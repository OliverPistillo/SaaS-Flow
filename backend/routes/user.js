const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User, Company } = require('../models');
const { authenticateToken } = require('../middleware/auth');
const { validateInput, sanitizeInput } = require('../middleware/security');
const { body, validationResult } = require('express-validator');

const router = express.Router();

// Validation rules
const userValidation = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 8 }).matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/),
  body('firstName').isLength({ min: 2 }).trim().escape(),
  body('lastName').isLength({ min: 2 }).trim().escape()
];

const loginValidation = [
  body('emailOrPhone').notEmpty().trim(),
  body('password').notEmpty()
];

// Register new user
router.post('/register', userValidation, validateInput, async (req, res) => {
  try {
    const { firstName, lastName, email, password, companyName, industry } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Un utente con questa email esiste già'
      });
    }

    // Hash password
    const saltRounds = parseInt(process.env.BCRYPT_ROUNDS) || 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create company first
    const company = await Company.create({
      name: companyName,
      industry,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    // Create user
    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role: 'admin',
      companyId: company.id,
      isActive: true,
      lastLogin: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    });

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email, 
        role: user.role,
        companyId: company.id 
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );

    // Return success response (don't send password)
    const { password: _, ...userWithoutPassword } = user.toJSON();
    
    res.status(201).json({
      success: true,
      message: 'Registrazione completata con successo',
      data: {
        user: userWithoutPassword,
        company: company.toJSON(),
        token
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Errore interno del server durante la registrazione'
    });
  }
});

// Login user
router.post('/login', loginValidation, validateInput, async (req, res) => {
  try {
    const { emailOrPhone, password } = req.body;

    // Find user by email or phone
    const user = await User.findOne({
      where: {
        [require('sequelize').Op.or]: [
          { email: emailOrPhone },
          { phone: emailOrPhone }
        ]
      },
      include: [{
        model: Company,
        as: 'company'
      }]
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Credenziali non valide'
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account disattivato. Contatta l\'amministratore.'
      });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Credenziali non valide'
      });
    }

    // Update last login
    await user.update({ lastLogin: new Date() });

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email, 
        role: user.role,
        companyId: user.companyId 
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );

    // Return success response (don't send password)
    const { password: _, ...userWithoutPassword } = user.toJSON();
    
    res.json({
      success: true,
      message: 'Login effettuato con successo',
      data: {
        user: userWithoutPassword,
        token
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Errore interno del server durante il login'
    });
  }
});

// Get current user profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.userId, {
      include: [{
        model: Company,
        as: 'company'
      }],
      attributes: { exclude: ['password'] }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Utente non trovato'
      });
    }

    res.json({
      success: true,
      data: { user }
    });

  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Errore durante il recupero del profilo'
    });
  }
});

// Update user profile
router.put('/profile', authenticateToken, [
  body('firstName').optional().isLength({ min: 2 }).trim().escape(),
  body('lastName').optional().isLength({ min: 2 }).trim().escape(),
  body('phone').optional().isMobilePhone('it-IT')
], validateInput, async (req, res) => {
  try {
    const { firstName, lastName, phone } = req.body;

    const user = await User.findByPk(req.user.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Utente non trovato'
      });
    }

    // Update user data
    await user.update({
      firstName: firstName || user.firstName,
      lastName: lastName || user.lastName,
      phone: phone || user.phone,
      updatedAt: new Date()
    });

    // Return updated user (without password)
    const { password: _, ...userWithoutPassword } = user.toJSON();
    
    res.json({
      success: true,
      message: 'Profilo aggiornato con successo',
      data: { user: userWithoutPassword }
    });

  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({
      success: false,
      message: 'Errore durante l\'aggiornamento del profilo'
    });
  }
});

// Change password
router.put('/change-password', authenticateToken, [
  body('currentPassword').notEmpty(),
  body('newPassword').isLength({ min: 8 }).matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
], validateInput, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findByPk(req.user.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Utente non trovato'
      });
    }

    // Verify current password
    const isValidPassword = await bcrypt.compare(currentPassword, user.password);
    if (!isValidPassword) {
      return res.status(400).json({
        success: false,
        message: 'Password attuale non corretta'
      });
    }

    // Hash new password
    const saltRounds = parseInt(process.env.BCRYPT_ROUNDS) || 12;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update password
    await user.update({
      password: hashedPassword,
      updatedAt: new Date()
    });

    res.json({
      success: true,
      message: 'Password cambiata con successo'
    });

  } catch (error) {
    console.error('Password change error:', error);
    res.status(500).json({
      success: false,
      message: 'Errore durante il cambio password'
    });
  }
});

// Logout (client-side token removal)
router.post('/logout', authenticateToken, (req, res) => {
  res.json({
    success: true,
    message: 'Logout effettuato con successo'
  });
});

// Get all users in company (admin only)
router.get('/company-users', authenticateToken, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Accesso negato. Solo gli amministratori possono visualizzare tutti gli utenti.'
      });
    }

    const users = await User.findAll({
      where: { companyId: req.user.companyId },
      attributes: { exclude: ['password'] },
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      data: { users }
    });

  } catch (error) {
    console.error('Company users error:', error);
    res.status(500).json({
      success: false,
      message: 'Errore durante il recupero degli utenti'
    });
  }
});

module.exports = router;