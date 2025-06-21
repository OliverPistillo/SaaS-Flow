const crypto = require('crypto');

class GDPRComplianceService {
  constructor() {
    this.encryptionKey = process.env.ENCRYPTION_KEY || this.generateEncryptionKey();
    this.algorithm = 'aes-256-gcm';
  }

  // Data Encryption/Decryption
  encryptSensitiveData(data) {
    try {
      const iv = crypto.randomBytes(16);
      const cipher = crypto.createCipher(this.algorithm, this.encryptionKey);
      cipher.setAAD(Buffer.from('gdpr-compliance'));
      
      let encrypted = cipher.update(JSON.stringify(data), 'utf8', 'hex');
      encrypted += cipher.final('hex');
      
      const authTag = cipher.getAuthTag();
      
      return {
        encrypted,
        iv: iv.toString('hex'),
        authTag: authTag.toString('hex')
      };
    } catch (error) {
      console.error('Encryption error:', error);
      throw new Error('Errore nella crittografia dei dati');
    }
  }

  decryptSensitiveData(encryptedData) {
    try {
      const { encrypted, iv, authTag } = encryptedData;
      const decipher = crypto.createDecipher(this.algorithm, this.encryptionKey);
      
      decipher.setAAD(Buffer.from('gdpr-compliance'));
      decipher.setAuthTag(Buffer.from(authTag, 'hex'));
      
      let decrypted = decipher.update(encrypted, 'hex', 'utf8');
      decrypted += decipher.final('utf8');
      
      return JSON.parse(decrypted);
    } catch (error) {
      console.error('Decryption error:', error);
      throw new Error('Errore nella decrittografia dei dati');
    }
  }

  // Consent Management
  async recordConsent(userId, consentType, granted = true, purpose = '') {
    const consent = {
      userId,
      consentType,
      granted,
      purpose,
      timestamp: new Date().toISOString(),
      ipAddress: this.getCurrentIP(),
      userAgent: this.getCurrentUserAgent(),
      version: '1.0'
    };

    // Salva nel database (implementazione specifica)
    await this.saveConsent(consent);
    
    return consent;
  }

  async getConsentStatus(userId, consentType) {
    const consents = await this.getUserConsents(userId);
    const latestConsent = consents
      .filter(c => c.consentType === consentType)
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))[0];

    return {
      granted: latestConsent ? latestConsent.granted : false,
      timestamp: latestConsent ? latestConsent.timestamp : null,
      version: latestConsent ? latestConsent.version : null
    };
  }

  async withdrawConsent(userId, consentType, reason = '') {
    return await this.recordConsent(userId, consentType, false, `Withdrawal: ${reason}`);
  }

  // Data Subject Rights
  async exportUserData(userId) {
    try {
      const userData = {
        personalInfo: await this.getUserPersonalInfo(userId),
        assessments: await this.getUserAssessments(userId),
        activityLog: await this.getUserActivityLog(userId),
        consents: await this.getUserConsents(userId),
        exportedAt: new Date().toISOString(),
        format: 'JSON'
      };

      // Rimuovi dati sensibili interni
      userData.personalInfo = this.sanitizePersonalInfo(userData.personalInfo);
      
      return userData;
    } catch (error) {
      console.error('Data export error:', error);
      throw new Error('Errore nell\'esportazione dei dati');
    }
  }

  async deleteUserData(userId, retentionReason = null) {
    try {
      const deletionLog = {
        userId,
        deletedAt: new Date().toISOString(),
        retentionReason,
        deletedBy: 'system', // o ID dell'operatore
        dataTypes: []
      };

      // Elimina dati personali
      if (!retentionReason || !this.isLegalRetentionRequired(retentionReason)) {
        await this.deletePersonalInfo(userId);
        deletionLog.dataTypes.push('personal_info');
      }

      // Anonimizza assessment (mantieni dati statistici)
      await this.anonymizeAssessments(userId);
      deletionLog.dataTypes.push('assessments_anonymized');

      // Elimina log di attività (tranne quelli richiesti per legge)
      await this.deleteActivityLogs(userId, retentionReason);
      deletionLog.dataTypes.push('activity_logs');

      // Registra la cancellazione
      await this.logDataDeletion(deletionLog);

      return deletionLog;
    } catch (error) {
      console.error('Data deletion error:', error);
      throw new Error('Errore nella cancellazione dei dati');
    }
  }

  async rectifyUserData(userId, corrections) {
    try {
      const rectificationLog = {
        userId,
        timestamp: new Date().toISOString(),
        corrections: [],
        requestedBy: userId
      };

      for (const [field, newValue] of Object.entries(corrections)) {
        const oldValue = await this.getUserFieldValue(userId, field);
        
        if (this.isFieldRectifiable(field)) {
          await this.updateUserField(userId, field, newValue);
          rectificationLog.corrections.push({
            field,
            oldValue: this.maskSensitiveValue(oldValue),
            newValue: this.maskSensitiveValue(newValue)
          });
        }
      }

      await this.logDataRectification(rectificationLog);
      return rectificationLog;
    } catch (error) {
      console.error('Data rectification error:', error);
      throw new Error('Errore nella rettifica dei dati');
    }
  }

  // Data Processing Lawfulness
  validateProcessingLawfulness(userId, processingPurpose) {
    const lawfulBases = {
      'user_registration': 'contract',
      'assessment_execution': 'consent',
      'analytics_generation': 'legitimate_interest',
      'legal_compliance': 'legal_obligation',
      'security_monitoring': 'legitimate_interest'
    };

    const lawfulBasis = lawfulBases[processingPurpose];
    
    if (!lawfulBasis) {
      throw new Error('Base giuridica non definita per questo trattamento');
    }

    return {
      purpose: processingPurpose,
      lawfulBasis,
      validated: true,
      timestamp: new Date().toISOString()
    };
  }

  // Data Minimization
  minimizeDataCollection(userData, purpose) {
    const purposeFields = {
      'registration': ['firstName', 'lastName', 'email', 'companyName'],
      'assessment': ['firstName', 'lastName', 'email', 'role'],
      'analytics': ['department', 'role', 'assessmentScores'],
      'reporting': ['department', 'assessmentScores', 'performanceMetrics']
    };

    const allowedFields = purposeFields[purpose] || [];
    const minimizedData = {};

    allowedFields.forEach(field => {
      if (userData[field] !== undefined) {
        minimizedData[field] = userData[field];
      }
    });

    return minimizedData;
  }

  // Data Retention
  async applyRetentionPolicies() {
    const policies = {
      'user_activity_logs': { retention: 365, unit: 'days' },
      'assessment_results': { retention: 7, unit: 'years' },
      'consent_records': { retention: 3, unit: 'years' },
      'audit_logs': { retention: 10, unit: 'years' }
    };

    const results = [];

    for (const [dataType, policy] of Object.entries(policies)) {
      const cutoffDate = this.calculateCutoffDate(policy);
      const deletedCount = await this.deleteExpiredData(dataType, cutoffDate);
      
      results.push({
        dataType,
        policy,
        cutoffDate,
        deletedRecords: deletedCount
      });
    }

    return results;
  }

  // Privacy Impact Assessment
  async conductPIA(processingActivity) {
    const pia = {
      activity: processingActivity,
      conductedAt: new Date().toISOString(),
      riskLevel: 'low',
      risks: [],
      mitigations: [],
      approved: false
    };

    // Valuta rischi
    const risks = this.assessPrivacyRisks(processingActivity);
    pia.risks = risks;
    pia.riskLevel = this.calculateOverallRisk(risks);

    // Proponi mitigazioni
    pia.mitigations = this.proposeMitigations(risks);

    // Approva se rischio accettabile
    pia.approved = pia.riskLevel !== 'high';

    await this.savePIA(pia);
    return pia;
  }

  // Helper Methods
  generateEncryptionKey() {
    return crypto.randomBytes(32).toString('hex');
  }

  getCurrentIP() {
    // Implementazione per ottenere IP corrente
    return '127.0.0.1'; // Placeholder
  }

  getCurrentUserAgent() {
    // Implementazione per ottenere User Agent
    return 'Do-Flow/1.0'; // Placeholder
  }

  sanitizePersonalInfo(personalInfo) {
    const sanitized = { ...personalInfo };
    
    // Rimuovi campi interni
    delete sanitized.password;
    delete sanitized.internalNotes;
    delete sanitized.systemFlags;
    
    return sanitized;
  }

  isLegalRetentionRequired(reason) {
    const legalReasons = [
      'tax_compliance',
      'employment_law',
      'contract_fulfillment',
      'legal_proceedings'
    ];
    
    return legalReasons.includes(reason);
  }

  isFieldRectifiable(field) {
    const rectifiableFields = [
      'firstName',
      'lastName',
      'email',
      'companyName',
      'department',
      'role'
    ];
    
    return rectifiableFields.includes(field);
  }

  maskSensitiveValue(value) {
    if (typeof value === 'string' && value.includes('@')) {
      // Email masking
      const [local, domain] = value.split('@');
      return `${local.substring(0, 2)}***@${domain}`;
    }
    
    if (typeof value === 'string' && value.length > 4) {
      return `${value.substring(0, 2)}***${value.substring(value.length - 2)}`;
    }
    
    return '***';
  }

  calculateCutoffDate(policy) {
    const date = new Date();
    
    switch (policy.unit) {
      case 'days':
        date.setDate(date.getDate() - policy.retention);
        break;
      case 'months':
        date.setMonth(date.getMonth() - policy.retention);
        break;
      case 'years':
        date.setFullYear(date.getFullYear() - policy.retention);
        break;
    }
    
    return date;
  }

  assessPrivacyRisks(activity) {
    const risks = [];
    
    if (activity.involvesSensitiveData) {
      risks.push({
        type: 'data_sensitivity',
        level: 'medium',
        description: 'Trattamento di dati sensibili'
      });
    }
    
    if (activity.involvesAutomatedDecision) {
      risks.push({
        type: 'automated_decision',
        level: 'high',
        description: 'Processo decisionale automatizzato'
      });
    }
    
    if (activity.involvesDataTransfer) {
      risks.push({
        type: 'data_transfer',
        level: 'medium',
        description: 'Trasferimento di dati a terzi'
      });
    }
    
    return risks;
  }

  calculateOverallRisk(risks) {
    const highRisks = risks.filter(r => r.level === 'high').length;
    const mediumRisks = risks.filter(r => r.level === 'medium').length;
    
    if (highRisks > 0) return 'high';
    if (mediumRisks > 2) return 'medium';
    return 'low';
  }

  proposeMitigations(risks) {
    const mitigations = [];
    
    risks.forEach(risk => {
      switch (risk.type) {
        case 'data_sensitivity':
          mitigations.push({
            risk: risk.type,
            mitigation: 'Implementare crittografia end-to-end',
            priority: 'high'
          });
          break;
        case 'automated_decision':
          mitigations.push({
            risk: risk.type,
            mitigation: 'Fornire spiegazione delle decisioni automatiche',
            priority: 'high'
          });
          break;
        case 'data_transfer':
          mitigations.push({
            risk: risk.type,
            mitigation: 'Verificare adeguatezza del paese di destinazione',
            priority: 'medium'
          });
          break;
      }
    });
    
    return mitigations;
  }

  // Database operations (da implementare con il database reale)
  async saveConsent(consent) {
    // Implementazione database
    console.log('Saving consent:', consent);
  }

  async getUserConsents(userId) {
    // Implementazione database
    return [];
  }

  async getUserPersonalInfo(userId) {
    // Implementazione database
    return {};
  }

  async getUserAssessments(userId) {
    // Implementazione database
    return [];
  }

  async getUserActivityLog(userId) {
    // Implementazione database
    return [];
  }

  async deletePersonalInfo(userId) {
    // Implementazione database
    console.log('Deleting personal info for user:', userId);
  }

  async anonymizeAssessments(userId) {
    // Implementazione database
    console.log('Anonymizing assessments for user:', userId);
  }

  async deleteActivityLogs(userId, retentionReason) {
    // Implementazione database
    console.log('Deleting activity logs for user:', userId);
  }

  async logDataDeletion(deletionLog) {
    // Implementazione database
    console.log('Logging data deletion:', deletionLog);
  }

  async logDataRectification(rectificationLog) {
    // Implementazione database
    console.log('Logging data rectification:', rectificationLog);
  }

  async getUserFieldValue(userId, field) {
    // Implementazione database
    return 'old_value';
  }

  async updateUserField(userId, field, newValue) {
    // Implementazione database
    console.log(`Updating ${field} for user ${userId}:`, newValue);
  }

  async deleteExpiredData(dataType, cutoffDate) {
    // Implementazione database
    console.log(`Deleting expired ${dataType} before:`, cutoffDate);
    return 0;
  }

  async savePIA(pia) {
    // Implementazione database
    console.log('Saving PIA:', pia);
  }
}

module.exports = GDPRComplianceService;

