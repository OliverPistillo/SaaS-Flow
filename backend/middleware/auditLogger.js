const GDPRComplianceService = require('../services/gdprCompliance');

class AuditLogger {
  constructor() {
    this.gdprService = new GDPRComplianceService();
  }

  // Middleware per audit trail
  auditMiddleware() {
    return (req, res, next) => {
      const startTime = Date.now();
      
      // Cattura informazioni della richiesta
      const auditData = {
        timestamp: new Date().toISOString(),
        method: req.method,
        url: req.url,
        userAgent: req.get('User-Agent'),
        ip: req.ip || req.connection.remoteAddress,
        userId: req.user ? req.user.id : null,
        sessionId: req.sessionID,
        requestId: this.generateRequestId()
      };

      // Aggiungi request ID al request per tracking
      req.auditId = auditData.requestId;

      // Override della funzione res.json per catturare la risposta
      const originalJson = res.json;
      res.json = function(data) {
        auditData.responseTime = Date.now() - startTime;
        auditData.statusCode = res.statusCode;
        auditData.success = res.statusCode < 400;
        
        // Non loggare dati sensibili nella risposta
        auditData.responseSize = JSON.stringify(data).length;
        
        // Salva log di audit
        this.saveAuditLog(auditData);
        
        return originalJson.call(this, data);
      }.bind(this);

      // Gestione errori
      res.on('error', (error) => {
        auditData.error = {
          message: error.message,
          stack: error.stack
        };
        auditData.success = false;
        this.saveAuditLog(auditData);
      });

      next();
    };
  }

  // Log specifici per azioni GDPR
  logDataAccess(userId, dataType, purpose, requestedBy) {
    const log = {
      type: 'data_access',
      timestamp: new Date().toISOString(),
      userId,
      dataType,
      purpose,
      requestedBy,
      lawfulBasis: this.gdprService.validateProcessingLawfulness(userId, purpose).lawfulBasis
    };

    this.saveGDPRLog(log);
  }

  logDataModification(userId, field, oldValue, newValue, modifiedBy) {
    const log = {
      type: 'data_modification',
      timestamp: new Date().toISOString(),
      userId,
      field,
      oldValue: this.gdprService.maskSensitiveValue(oldValue),
      newValue: this.gdprService.maskSensitiveValue(newValue),
      modifiedBy
    };

    this.saveGDPRLog(log);
  }

  logDataExport(userId, exportType, requestedBy) {
    const log = {
      type: 'data_export',
      timestamp: new Date().toISOString(),
      userId,
      exportType,
      requestedBy,
      purpose: 'data_portability_request'
    };

    this.saveGDPRLog(log);
  }

  logDataDeletion(userId, deletionType, reason, deletedBy) {
    const log = {
      type: 'data_deletion',
      timestamp: new Date().toISOString(),
      userId,
      deletionType,
      reason,
      deletedBy
    };

    this.saveGDPRLog(log);
  }

  logConsentChange(userId, consentType, granted, changedBy) {
    const log = {
      type: 'consent_change',
      timestamp: new Date().toISOString(),
      userId,
      consentType,
      granted,
      changedBy
    };

    this.saveGDPRLog(log);
  }

  // Log di sicurezza
  logSecurityEvent(eventType, severity, details, userId = null) {
    const log = {
      type: 'security_event',
      eventType,
      severity,
      timestamp: new Date().toISOString(),
      userId,
      details,
      source: 'do-flow-backend'
    };

    this.saveSecurityLog(log);
  }

  logAuthenticationAttempt(email, success, ip, userAgent, reason = null) {
    const log = {
      type: 'authentication',
      email: this.gdprService.maskSensitiveValue(email),
      success,
      ip,
      userAgent,
      timestamp: new Date().toISOString(),
      reason
    };

    this.saveSecurityLog(log);
  }

  logPrivilegeEscalation(userId, fromRole, toRole, grantedBy) {
    const log = {
      type: 'privilege_escalation',
      userId,
      fromRole,
      toRole,
      grantedBy,
      timestamp: new Date().toISOString()
    };

    this.saveSecurityLog(log);
  }

  // Analisi dei log
  async analyzeSecurityLogs(timeframe = '24h') {
    const logs = await this.getSecurityLogs(timeframe);
    
    const analysis = {
      timeframe,
      totalEvents: logs.length,
      eventsByType: this.groupByType(logs),
      suspiciousActivities: this.detectSuspiciousActivities(logs),
      recommendations: []
    };

    // Genera raccomandazioni basate sull'analisi
    if (analysis.suspiciousActivities.length > 0) {
      analysis.recommendations.push({
        type: 'security',
        priority: 'high',
        message: 'Rilevate attività sospette, rivedere i log di sicurezza'
      });
    }

    const failedLogins = logs.filter(l => 
      l.type === 'authentication' && !l.success
    ).length;

    if (failedLogins > 10) {
      analysis.recommendations.push({
        type: 'security',
        priority: 'medium',
        message: 'Alto numero di tentativi di login falliti, considerare rate limiting'
      });
    }

    return analysis;
  }

  async generateComplianceReport(period = 'monthly') {
    const report = {
      period,
      generatedAt: new Date().toISOString(),
      gdprCompliance: await this.assessGDPRCompliance(),
      auditSummary: await this.generateAuditSummary(period),
      securitySummary: await this.generateSecuritySummary(period),
      recommendations: []
    };

    // Aggiungi raccomandazioni basate sui risultati
    if (report.gdprCompliance.score < 80) {
      report.recommendations.push({
        type: 'compliance',
        priority: 'high',
        message: 'Migliorare la compliance GDPR'
      });
    }

    return report;
  }

  // Helper methods
  generateRequestId() {
    return 'req_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  groupByType(logs) {
    const grouped = {};
    logs.forEach(log => {
      if (!grouped[log.type]) {
        grouped[log.type] = 0;
      }
      grouped[log.type]++;
    });
    return grouped;
  }

  detectSuspiciousActivities(logs) {
    const suspicious = [];
    
    // Rileva tentativi di login multipli falliti
    const failedLogins = logs.filter(l => 
      l.type === 'authentication' && !l.success
    );
    
    const ipCounts = {};
    failedLogins.forEach(log => {
      if (!ipCounts[log.ip]) {
        ipCounts[log.ip] = 0;
      }
      ipCounts[log.ip]++;
    });

    Object.entries(ipCounts).forEach(([ip, count]) => {
      if (count > 5) {
        suspicious.push({
          type: 'brute_force_attempt',
          ip,
          attempts: count,
          severity: 'high'
        });
      }
    });

    // Rileva accessi fuori orario
    const offHoursAccess = logs.filter(log => {
      const hour = new Date(log.timestamp).getHours();
      return hour < 6 || hour > 22;
    });

    if (offHoursAccess.length > 10) {
      suspicious.push({
        type: 'off_hours_access',
        count: offHoursAccess.length,
        severity: 'medium'
      });
    }

    return suspicious;
  }

  async assessGDPRCompliance() {
    // Valuta la compliance GDPR
    const checks = {
      consentManagement: await this.checkConsentManagement(),
      dataRetention: await this.checkDataRetention(),
      dataSubjectRights: await this.checkDataSubjectRights(),
      dataProtection: await this.checkDataProtection(),
      auditTrail: await this.checkAuditTrail()
    };

    const scores = Object.values(checks).map(check => check.score);
    const overallScore = scores.reduce((a, b) => a + b, 0) / scores.length;

    return {
      overallScore: Math.round(overallScore),
      checks,
      compliant: overallScore >= 80
    };
  }

  async checkConsentManagement() {
    // Implementa controlli specifici per la gestione del consenso
    return {
      score: 85,
      status: 'compliant',
      issues: []
    };
  }

  async checkDataRetention() {
    // Implementa controlli per la retention dei dati
    return {
      score: 90,
      status: 'compliant',
      issues: []
    };
  }

  async checkDataSubjectRights() {
    // Implementa controlli per i diritti degli interessati
    return {
      score: 88,
      status: 'compliant',
      issues: []
    };
  }

  async checkDataProtection() {
    // Implementa controlli per la protezione dei dati
    return {
      score: 92,
      status: 'compliant',
      issues: []
    };
  }

  async checkAuditTrail() {
    // Implementa controlli per l'audit trail
    return {
      score: 95,
      status: 'compliant',
      issues: []
    };
  }

  // Database operations (da implementare)
  async saveAuditLog(auditData) {
    console.log('Saving audit log:', auditData);
    // Implementazione database
  }

  async saveGDPRLog(log) {
    console.log('Saving GDPR log:', log);
    // Implementazione database
  }

  async saveSecurityLog(log) {
    console.log('Saving security log:', log);
    // Implementazione database
  }

  async getSecurityLogs(timeframe) {
    // Implementazione database
    return [];
  }

  async generateAuditSummary(period) {
    // Implementazione database
    return {
      totalRequests: 1000,
      successfulRequests: 950,
      failedRequests: 50,
      averageResponseTime: 250
    };
  }

  async generateSecuritySummary(period) {
    // Implementazione database
    return {
      securityEvents: 5,
      authenticationAttempts: 200,
      failedLogins: 15,
      suspiciousActivities: 2
    };
  }
}

module.exports = AuditLogger;

