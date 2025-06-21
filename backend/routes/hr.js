const express = require('express');
const { body, validationResult } = require('express-validator');
const { Employee, Assessment } = require('../models');
const { authMiddleware, requireRole } = require('../middleware/auth');

const router = express.Router();

// Applica autenticazione a tutte le route
router.use(authMiddleware);

// Ottieni dashboard HR
router.get('/dashboard', async (req, res) => {
  try {
    const employees = await Employee.findAll({
      where: { companyId: req.user.companyId },
      include: [{
        model: Assessment,
        as: 'assessments',
        limit: 1,
        order: [['createdAt', 'DESC']]
      }]
    });

    const assessments = await Assessment.findAll({
      where: { companyId: req.user.companyId },
      order: [['createdAt', 'DESC']],
      limit: 10
    });

    // Calcola statistiche
    const totalEmployees = employees.length;
    const assessedEmployees = employees.filter(emp => emp.assessments && emp.assessments.length > 0).length;
    const avgPerformanceScore = employees.reduce((sum, emp) => {
      const lastAssessment = emp.assessments && emp.assessments[0];
      return sum + (lastAssessment ? lastAssessment.overallScore : 0);
    }, 0) / totalEmployees || 0;

    // Distribuzione per dipartimento
    const departmentStats = employees.reduce((acc, emp) => {
      const dept = emp.department || 'Non specificato';
      acc[dept] = (acc[dept] || 0) + 1;
      return acc;
    }, {});

    // Top performers (ultimi assessment)
    const topPerformers = employees
      .filter(emp => emp.assessments && emp.assessments.length > 0)
      .sort((a, b) => (b.assessments[0].overallScore || 0) - (a.assessments[0].overallScore || 0))
      .slice(0, 5)
      .map(emp => ({
        id: emp.id,
        name: `${emp.firstName} ${emp.lastName}`,
        position: emp.position,
        department: emp.department,
        score: emp.assessments[0].overallScore
      }));

    res.json({
      summary: {
        totalEmployees,
        assessedEmployees,
        assessmentCoverage: totalEmployees > 0 ? Math.round((assessedEmployees / totalEmployees) * 100) : 0,
        avgPerformanceScore: Math.round(avgPerformanceScore * 100) / 100
      },
      departmentStats,
      topPerformers,
      recentAssessments: assessments.slice(0, 5)
    });

  } catch (error) {
    console.error('Errore dashboard HR:', error);
    res.status(500).json({
      error: 'Errore interno del server',
      message: 'Impossibile recuperare i dati HR'
    });
  }
});

// Ottieni tutti i dipendenti
router.get('/employees', async (req, res) => {
  try {
    const { page = 1, limit = 20, department, position } = req.query;
    const offset = (page - 1) * limit;

    const whereClause = { companyId: req.user.companyId };
    
    if (department) {
      whereClause.department = department;
    }
    
    if (position) {
      whereClause.position = { [require('sequelize').Op.iLike]: `%${position}%` };
    }

    const { count, rows } = await Employee.findAndCountAll({
      where: whereClause,
      include: [{
        model: Assessment,
        as: 'assessments',
        limit: 1,
        order: [['createdAt', 'DESC']]
      }],
      order: [['lastName', 'ASC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      employees: rows,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / limit)
      }
    });

  } catch (error) {
    console.error('Errore recupero dipendenti:', error);
    res.status(500).json({
      error: 'Errore interno del server',
      message: 'Impossibile recuperare i dipendenti'
    });
  }
});

// Aggiungi nuovo dipendente
router.post('/employees', requireRole(['admin', 'manager']), [
  body('firstName').trim().isLength({ min: 2 }).withMessage('Nome richiesto'),
  body('lastName').trim().isLength({ min: 2 }).withMessage('Cognome richiesto'),
  body('email').isEmail().normalizeEmail().withMessage('Email non valida'),
  body('position').trim().isLength({ min: 2 }).withMessage('Posizione richiesta'),
  body('department').optional().trim(),
  body('hireDate').isISO8601().withMessage('Data assunzione non valida'),
  body('salary').optional().isNumeric().withMessage('Salario deve essere numerico')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Dati non validi',
        details: errors.array()
      });
    }

    const { firstName, lastName, email, position, department, hireDate, salary, phone } = req.body;

    // Verifica se il dipendente esiste già
    const existingEmployee = await Employee.findOne({
      where: { 
        email,
        companyId: req.user.companyId 
      }
    });

    if (existingEmployee) {
      return res.status(409).json({
        error: 'Dipendente già esistente',
        message: 'Un dipendente con questa email esiste già'
      });
    }

    const employee = await Employee.create({
      firstName,
      lastName,
      email,
      position,
      department,
      hireDate: new Date(hireDate),
      salary: salary ? parseFloat(salary) : null,
      phone,
      companyId: req.user.companyId,
      isActive: true
    });

    res.status(201).json({
      message: 'Dipendente aggiunto con successo',
      employee
    });

  } catch (error) {
    console.error('Errore creazione dipendente:', error);
    res.status(500).json({
      error: 'Errore interno del server',
      message: 'Impossibile creare il dipendente'
    });
  }
});

// Test attitudinali - Ottieni tipi di test disponibili
router.get('/assessments/types', (req, res) => {
  const testTypes = [
    {
      id: 'cognitive',
      name: 'Test Cognitivo',
      description: 'Valuta capacità di ragionamento logico, problem solving e analisi',
      duration: 30,
      questions: 25
    },
    {
      id: 'personality',
      name: 'Test Personalità',
      description: 'Analizza tratti caratteriali e stile di lavoro',
      duration: 20,
      questions: 40
    },
    {
      id: 'technical',
      name: 'Test Tecnico',
      description: 'Valuta competenze tecniche specifiche per il ruolo',
      duration: 45,
      questions: 30
    },
    {
      id: 'leadership',
      name: 'Test Leadership',
      description: 'Misura potenziale di leadership e gestione team',
      duration: 25,
      questions: 20
    },
    {
      id: 'communication',
      name: 'Test Comunicazione',
      description: 'Valuta abilità comunicative e interpersonali',
      duration: 15,
      questions: 15
    }
  ];

  res.json({ testTypes });
});

// Crea nuovo assessment
router.post('/assessments', requireRole(['admin', 'manager']), [
  body('employeeId').isUUID().withMessage('ID dipendente non valido'),
  body('testType').isIn(['cognitive', 'personality', 'technical', 'leadership', 'communication']).withMessage('Tipo test non valido'),
  body('responses').isArray().withMessage('Risposte devono essere un array'),
  body('responses.*.questionId').notEmpty().withMessage('ID domanda richiesto'),
  body('responses.*.answer').notEmpty().withMessage('Risposta richiesta')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Dati non validi',
        details: errors.array()
      });
    }

    const { employeeId, testType, responses, notes } = req.body;

    // Verifica che il dipendente appartenga all'azienda
    const employee = await Employee.findOne({
      where: {
        id: employeeId,
        companyId: req.user.companyId
      }
    });

    if (!employee) {
      return res.status(404).json({
        error: 'Dipendente non trovato'
      });
    }

    // Simula calcolo punteggio AI (in produzione userebbe un vero algoritmo AI)
    const calculateScore = (testType, responses) => {
      const baseScore = Math.random() * 40 + 60; // Score tra 60-100
      const responseQuality = responses.length / 25; // Normalizza per numero di risposte
      return Math.min(100, Math.round(baseScore * responseQuality));
    };

    const overallScore = calculateScore(testType, responses);
    
    // Genera insights AI simulati
    const generateInsights = (testType, score) => {
      const insights = {
        cognitive: [
          'Eccellenti capacità di problem solving',
          'Forte pensiero analitico',
          'Buona capacità di apprendimento rapido'
        ],
        personality: [
          'Personalità orientata al team',
          'Alta motivazione intrinseca',
          'Buona gestione dello stress'
        ],
        technical: [
          'Solide competenze tecniche',
          'Capacità di adattamento tecnologico',
          'Attenzione ai dettagli'
        ],
        leadership: [
          'Potenziale di leadership emergente',
          'Buone capacità decisionali',
          'Abilità nel motivare gli altri'
        ],
        communication: [
          'Eccellenti abilità comunicative',
          'Ascolto attivo sviluppato',
          'Chiarezza espositiva'
        ]
      };
      
      return insights[testType] || ['Valutazione completata con successo'];
    };

    const assessment = await Assessment.create({
      employeeId,
      companyId: req.user.companyId,
      testType,
      responses,
      overallScore,
      insights: generateInsights(testType, overallScore),
      notes,
      conductedBy: req.user.id,
      completedAt: new Date()
    });

    res.status(201).json({
      message: 'Assessment completato con successo',
      assessment: {
        id: assessment.id,
        testType: assessment.testType,
        overallScore: assessment.overallScore,
        insights: assessment.insights,
        completedAt: assessment.completedAt
      }
    });

  } catch (error) {
    console.error('Errore creazione assessment:', error);
    res.status(500).json({
      error: 'Errore interno del server',
      message: 'Impossibile creare l\'assessment'
    });
  }
});

// Ottieni assessment di un dipendente
router.get('/employees/:employeeId/assessments', async (req, res) => {
  try {
    const employee = await Employee.findOne({
      where: {
        id: req.params.employeeId,
        companyId: req.user.companyId
      }
    });

    if (!employee) {
      return res.status(404).json({
        error: 'Dipendente non trovato'
      });
    }

    const assessments = await Assessment.findAll({
      where: { employeeId: req.params.employeeId },
      order: [['createdAt', 'DESC']],
      attributes: { exclude: ['responses'] } // Escludi risposte dettagliate per privacy
    });

    res.json({
      employee: {
        id: employee.id,
        name: `${employee.firstName} ${employee.lastName}`,
        position: employee.position,
        department: employee.department
      },
      assessments
    });

  } catch (error) {
    console.error('Errore recupero assessment:', error);
    res.status(500).json({
      error: 'Errore interno del server',
      message: 'Impossibile recuperare gli assessment'
    });
  }
});

// Genera report team insights
router.get('/insights/team', async (req, res) => {
  try {
    const { department } = req.query;
    
    const whereClause = { companyId: req.user.companyId };
    if (department) {
      whereClause.department = department;
    }

    const employees = await Employee.findAll({
      where: whereClause,
      include: [{
        model: Assessment,
        as: 'assessments',
        order: [['createdAt', 'DESC']]
      }]
    });

    // Analisi competenze team
    const teamInsights = {
      totalMembers: employees.length,
      assessmentCoverage: 0,
      strengthAreas: [],
      improvementAreas: [],
      topPerformers: [],
      skillsDistribution: {}
    };

    const assessedEmployees = employees.filter(emp => emp.assessments.length > 0);
    teamInsights.assessmentCoverage = employees.length > 0 ? 
      Math.round((assessedEmployees.length / employees.length) * 100) : 0;

    // Analizza punti di forza e aree di miglioramento
    const skillScores = {};
    assessedEmployees.forEach(emp => {
      emp.assessments.forEach(assessment => {
        if (!skillScores[assessment.testType]) {
          skillScores[assessment.testType] = [];
        }
        skillScores[assessment.testType].push(assessment.overallScore);
      });
    });

    Object.entries(skillScores).forEach(([skill, scores]) => {
      const avgScore = scores.reduce((sum, score) => sum + score, 0) / scores.length;
      teamInsights.skillsDistribution[skill] = Math.round(avgScore);
      
      if (avgScore >= 80) {
        teamInsights.strengthAreas.push({
          skill,
          averageScore: Math.round(avgScore),
          employeeCount: scores.length
        });
      } else if (avgScore < 70) {
        teamInsights.improvementAreas.push({
          skill,
          averageScore: Math.round(avgScore),
          employeeCount: scores.length
        });
      }
    });

    // Top performers
    teamInsights.topPerformers = assessedEmployees
      .map(emp => {
        const avgScore = emp.assessments.reduce((sum, ass) => sum + ass.overallScore, 0) / emp.assessments.length;
        return {
          id: emp.id,
          name: `${emp.firstName} ${emp.lastName}`,
          position: emp.position,
          department: emp.department,
          averageScore: Math.round(avgScore),
          assessmentCount: emp.assessments.length
        };
      })
      .sort((a, b) => b.averageScore - a.averageScore)
      .slice(0, 5);

    res.json({ teamInsights });

  } catch (error) {
    console.error('Errore insights team:', error);
    res.status(500).json({
      error: 'Errore interno del server',
      message: 'Impossibile generare insights del team'
    });
  }
});

module.exports = router;

