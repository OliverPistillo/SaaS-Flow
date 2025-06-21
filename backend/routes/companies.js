const express = require('express');
const { body, validationResult } = require('express-validator');
const { Company } = require('../models');
const { authMiddleware, requireRole } = require('../middleware/auth');

const router = express.Router();

// Applica autenticazione a tutte le route
router.use(authMiddleware);

// Ottieni informazioni azienda
router.get('/', async (req, res) => {
  try {
    const company = await Company.findByPk(req.user.companyId, {
      attributes: { exclude: ['createdAt', 'updatedAt'] }
    });

    if (!company) {
      return res.status(404).json({
        error: 'Azienda non trovata',
        message: 'L\'azienda associata al tuo account non esiste'
      });
    }

    res.json({
      company
    });

  } catch (error) {
    console.error('Errore recupero azienda:', error);
    res.status(500).json({
      error: 'Errore interno del server',
      message: 'Impossibile recuperare i dati dell\'azienda'
    });
  }
});

// Aggiorna informazioni azienda
router.put('/', requireRole(['admin']), [
  body('name').optional().trim().isLength({ min: 2 }).withMessage('Nome azienda deve essere di almeno 2 caratteri'),
  body('industry').optional().trim().isLength({ min: 2 }).withMessage('Settore richiesto'),
  body('address').optional().trim(),
  body('phone').optional().trim(),
  body('website').optional().isURL().withMessage('URL website non valido'),
  body('vatNumber').optional().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Dati non validi',
        details: errors.array()
      });
    }

    const company = await Company.findByPk(req.user.companyId);
    if (!company) {
      return res.status(404).json({
        error: 'Azienda non trovata'
      });
    }

    const updateData = {};
    const allowedFields = ['name', 'industry', 'address', 'phone', 'website', 'vatNumber'];
    
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    });

    await company.update(updateData);

    res.json({
      message: 'Informazioni azienda aggiornate con successo',
      company
    });

  } catch (error) {
    console.error('Errore aggiornamento azienda:', error);
    res.status(500).json({
      error: 'Errore interno del server',
      message: 'Impossibile aggiornare i dati dell\'azienda'
    });
  }
});

// Aggiorna impostazioni azienda
router.put('/settings', requireRole(['admin']), [
  body('currency').optional().isIn(['EUR', 'USD', 'GBP']).withMessage('Valuta non supportata'),
  body('timezone').optional().trim(),
  body('language').optional().isIn(['it', 'en', 'es', 'fr']).withMessage('Lingua non supportata'),
  body('fiscalYearStart').optional().isISO8601().withMessage('Data inizio anno fiscale non valida')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Dati non validi',
        details: errors.array()
      });
    }

    const company = await Company.findByPk(req.user.companyId);
    if (!company) {
      return res.status(404).json({
        error: 'Azienda non trovata'
      });
    }

    const currentSettings = company.settings || {};
    const newSettings = {
      ...currentSettings,
      ...req.body
    };

    await company.update({ settings: newSettings });

    res.json({
      message: 'Impostazioni aggiornate con successo',
      settings: newSettings
    });

  } catch (error) {
    console.error('Errore aggiornamento impostazioni:', error);
    res.status(500).json({
      error: 'Errore interno del server',
      message: 'Impossibile aggiornare le impostazioni'
    });
  }
});

module.exports = router;

