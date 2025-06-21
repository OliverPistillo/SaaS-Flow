const express = require('express');
const { authMiddleware } = require('../middleware/auth');
const AnalyticsService = require('../services/analyticsService');

const router = express.Router();
const analyticsService = new AnalyticsService();

// Applica autenticazione a tutte le route
router.use(authMiddleware);

// Analytics generali dell'azienda
router.get('/overview', async (req, res) => {
  try {
    const { period = '12' } = req.query;
    const companyId = req.user.companyId;
    
    const overview = await analyticsService.generateOverviewDashboard(companyId, period);
    
    res.json({
      success: true,
      data: overview
    });
  } catch (error) {
    console.error('Error generating overview:', error);
    res.status(500).json({
      error: 'Errore nella generazione della panoramica',
      message: error.message
    });
  }
});

// Previsioni
router.get('/predictions', async (req, res) => {
  try {
    const { type = 'revenue', months = 6 } = req.query;
    const companyId = req.user.companyId;
    
    const predictions = await analyticsService.generatePredictions(companyId, type, parseInt(months));
    
    res.json({
      success: true,
      data: predictions
    });
  } catch (error) {
    console.error('Error generating predictions:', error);
    res.status(500).json({
      error: 'Errore nella generazione delle previsioni',
      message: error.message
    });
  }
});

// Report personalizzati
router.post('/reports', async (req, res) => {
  try {
    const companyId = req.user.companyId;
    const reportConfig = req.body;
    
    const report = await analyticsService.generateCustomReport(companyId, reportConfig);
    
    res.json({
      success: true,
      data: report
    });
  } catch (error) {
    console.error('Error generating custom report:', error);
    res.status(500).json({
      error: 'Errore nella generazione del report',
      message: error.message
    });
  }
});

// Analisi KPI
router.get('/kpi/:type', async (req, res) => {
  try {
    const { type } = req.params;
    const { period = '12' } = req.query;
    const companyId = req.user.companyId;
    
    const analysis = await analyticsService.generateKPIAnalysis(companyId, type, period);
    
    res.json({
      success: true,
      data: analysis
    });
  } catch (error) {
    console.error('Error generating KPI analysis:', error);
    res.status(500).json({
      error: 'Errore nell\'analisi dei KPI',
      message: error.message
    });
  }
});

module.exports = router;

