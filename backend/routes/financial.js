const express = require('express');
const { body, validationResult } = require('express-validator');
const { FinancialData } = require('../models');
const { authMiddleware, requireRole } = require('../middleware/auth');

const router = express.Router();

// Applica autenticazione a tutte le route
router.use(authMiddleware);

// Ottieni dashboard finanziaria
router.get('/dashboard', async (req, res) => {
  try {
    const { period = '12' } = req.query; // Default 12 mesi
    const months = parseInt(period);
    
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - months);

    const financialData = await FinancialData.findAll({
      where: {
        companyId: req.user.companyId,
        date: {
          [require('sequelize').Op.gte]: startDate
        }
      },
      order: [['date', 'ASC']]
    });

    // Calcola metriche aggregate
    const totalRevenue = financialData.reduce((sum, record) => sum + (record.revenue || 0), 0);
    const totalExpenses = financialData.reduce((sum, record) => sum + (record.expenses || 0), 0);
    const netProfit = totalRevenue - totalExpenses;
    const profitMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;

    // Calcola cash flow
    const cashFlow = financialData.map(record => ({
      date: record.date,
      cashFlow: (record.revenue || 0) - (record.expenses || 0),
      revenue: record.revenue || 0,
      expenses: record.expenses || 0
    }));

    // Trend analysis (confronto con periodo precedente)
    const previousStartDate = new Date(startDate);
    previousStartDate.setMonth(previousStartDate.getMonth() - months);
    
    const previousData = await FinancialData.findAll({
      where: {
        companyId: req.user.companyId,
        date: {
          [require('sequelize').Op.gte]: previousStartDate,
          [require('sequelize').Op.lt]: startDate
        }
      }
    });

    const previousRevenue = previousData.reduce((sum, record) => sum + (record.revenue || 0), 0);
    const revenueGrowth = previousRevenue > 0 ? ((totalRevenue - previousRevenue) / previousRevenue) * 100 : 0;

    res.json({
      summary: {
        totalRevenue,
        totalExpenses,
        netProfit,
        profitMargin: Math.round(profitMargin * 100) / 100,
        revenueGrowth: Math.round(revenueGrowth * 100) / 100
      },
      cashFlow,
      period: `${months} mesi`
    });

  } catch (error) {
    console.error('Errore dashboard finanziaria:', error);
    res.status(500).json({
      error: 'Errore interno del server',
      message: 'Impossibile recuperare i dati finanziari'
    });
  }
});

// Ottieni tutti i dati finanziari
router.get('/data', async (req, res) => {
  try {
    const { page = 1, limit = 50, startDate, endDate } = req.query;
    const offset = (page - 1) * limit;

    const whereClause = { companyId: req.user.companyId };
    
    if (startDate && endDate) {
      whereClause.date = {
        [require('sequelize').Op.between]: [new Date(startDate), new Date(endDate)]
      };
    }

    const { count, rows } = await FinancialData.findAndCountAll({
      where: whereClause,
      order: [['date', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      data: rows,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / limit)
      }
    });

  } catch (error) {
    console.error('Errore recupero dati finanziari:', error);
    res.status(500).json({
      error: 'Errore interno del server',
      message: 'Impossibile recuperare i dati finanziari'
    });
  }
});

// Aggiungi nuovo record finanziario
router.post('/data', requireRole(['admin', 'manager']), [
  body('date').isISO8601().withMessage('Data non valida'),
  body('revenue').isNumeric().withMessage('Ricavi devono essere numerici'),
  body('expenses').isNumeric().withMessage('Spese devono essere numeriche'),
  body('category').optional().trim().isLength({ min: 1 }).withMessage('Categoria richiesta'),
  body('description').optional().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Dati non validi',
        details: errors.array()
      });
    }

    const { date, revenue, expenses, category, description, metadata } = req.body;

    const financialRecord = await FinancialData.create({
      companyId: req.user.companyId,
      date: new Date(date),
      revenue: parseFloat(revenue) || 0,
      expenses: parseFloat(expenses) || 0,
      category: category || 'Generale',
      description,
      metadata: metadata || {},
      createdBy: req.user.id
    });

    res.status(201).json({
      message: 'Record finanziario creato con successo',
      data: financialRecord
    });

  } catch (error) {
    console.error('Errore creazione record finanziario:', error);
    res.status(500).json({
      error: 'Errore interno del server',
      message: 'Impossibile creare il record finanziario'
    });
  }
});

// Aggiorna record finanziario
router.put('/data/:recordId', requireRole(['admin', 'manager']), [
  body('date').optional().isISO8601().withMessage('Data non valida'),
  body('revenue').optional().isNumeric().withMessage('Ricavi devono essere numerici'),
  body('expenses').optional().isNumeric().withMessage('Spese devono essere numeriche'),
  body('category').optional().trim().isLength({ min: 1 }).withMessage('Categoria richiesta'),
  body('description').optional().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Dati non validi',
        details: errors.array()
      });
    }

    const record = await FinancialData.findOne({
      where: {
        id: req.params.recordId,
        companyId: req.user.companyId
      }
    });

    if (!record) {
      return res.status(404).json({
        error: 'Record non trovato'
      });
    }

    const updateData = {};
    const allowedFields = ['date', 'revenue', 'expenses', 'category', 'description', 'metadata'];
    
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        if (field === 'date') {
          updateData[field] = new Date(req.body[field]);
        } else if (field === 'revenue' || field === 'expenses') {
          updateData[field] = parseFloat(req.body[field]) || 0;
        } else {
          updateData[field] = req.body[field];
        }
      }
    });

    await record.update(updateData);

    res.json({
      message: 'Record aggiornato con successo',
      data: record
    });

  } catch (error) {
    console.error('Errore aggiornamento record:', error);
    res.status(500).json({
      error: 'Errore interno del server',
      message: 'Impossibile aggiornare il record'
    });
  }
});

// Elimina record finanziario
router.delete('/data/:recordId', requireRole(['admin', 'manager']), async (req, res) => {
  try {
    const record = await FinancialData.findOne({
      where: {
        id: req.params.recordId,
        companyId: req.user.companyId
      }
    });

    if (!record) {
      return res.status(404).json({
        error: 'Record non trovato'
      });
    }

    await record.destroy();

    res.json({
      message: 'Record eliminato con successo'
    });

  } catch (error) {
    console.error('Errore eliminazione record:', error);
    res.status(500).json({
      error: 'Errore interno del server',
      message: 'Impossibile eliminare il record'
    });
  }
});

// Previsioni finanziarie (AI-powered)
router.get('/forecast', async (req, res) => {
  try {
    const { months = 6 } = req.query;
    
    // Ottieni dati storici degli ultimi 12 mesi
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 12);

    const historicalData = await FinancialData.findAll({
      where: {
        companyId: req.user.companyId,
        date: {
          [require('sequelize').Op.gte]: startDate
        }
      },
      order: [['date', 'ASC']]
    });

    if (historicalData.length < 3) {
      return res.json({
        forecast: [],
        message: 'Dati insufficienti per generare previsioni accurate. Servono almeno 3 mesi di dati storici.'
      });
    }

    // Calcola trend semplice (media mobile e crescita)
    const monthlyData = {};
    historicalData.forEach(record => {
      const monthKey = record.date.toISOString().substring(0, 7); // YYYY-MM
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { revenue: 0, expenses: 0, count: 0 };
      }
      monthlyData[monthKey].revenue += record.revenue || 0;
      monthlyData[monthKey].expenses += record.expenses || 0;
      monthlyData[monthKey].count += 1;
    });

    const monthlyAverages = Object.entries(monthlyData).map(([month, data]) => ({
      month,
      avgRevenue: data.revenue / data.count,
      avgExpenses: data.expenses / data.count
    }));

    // Calcola trend di crescita
    const recentMonths = monthlyAverages.slice(-3);
    const avgRevenueGrowth = recentMonths.length > 1 ? 
      (recentMonths[recentMonths.length - 1].avgRevenue - recentMonths[0].avgRevenue) / recentMonths.length : 0;
    const avgExpenseGrowth = recentMonths.length > 1 ? 
      (recentMonths[recentMonths.length - 1].avgExpenses - recentMonths[0].avgExpenses) / recentMonths.length : 0;

    // Genera previsioni
    const forecast = [];
    const lastMonth = recentMonths[recentMonths.length - 1];
    let currentRevenue = lastMonth.avgRevenue;
    let currentExpenses = lastMonth.avgExpenses;

    for (let i = 1; i <= parseInt(months); i++) {
      const forecastDate = new Date();
      forecastDate.setMonth(forecastDate.getMonth() + i);
      
      currentRevenue += avgRevenueGrowth;
      currentExpenses += avgExpenseGrowth;
      
      forecast.push({
        date: forecastDate.toISOString().substring(0, 7),
        predictedRevenue: Math.max(0, Math.round(currentRevenue)),
        predictedExpenses: Math.max(0, Math.round(currentExpenses)),
        predictedProfit: Math.round(currentRevenue - currentExpenses),
        confidence: Math.max(0.3, 0.9 - (i * 0.1)) // Diminuisce la confidenza nel tempo
      });
    }

    res.json({
      forecast,
      metadata: {
        basedOnMonths: monthlyAverages.length,
        avgMonthlyGrowth: {
          revenue: Math.round(avgRevenueGrowth),
          expenses: Math.round(avgExpenseGrowth)
        }
      }
    });

  } catch (error) {
    console.error('Errore previsioni finanziarie:', error);
    res.status(500).json({
      error: 'Errore interno del server',
      message: 'Impossibile generare le previsioni'
    });
  }
});

module.exports = router;

