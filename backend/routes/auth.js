// backend/routes/auth.js
const express = require("express");
const { body, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const { User, Company } = require("../models");
const { hashPassword, comparePassword } = require("../utils/security");

const router = express.Router();

// Registrazione utente
router.post("/register", [
  body("email").isEmail().normalizeEmail().withMessage("Email non valida"),
  body("password").isLength({ min: 8 }).withMessage("Password deve essere di almeno 8 caratteri"),
  body("firstName").trim().isLength({ min: 2 }).withMessage("Nome richiesto"),
  body("lastName").trim().isLength({ min: 2 }).withMessage("Cognome richiesto"),
  body("companyName").trim().isLength({ min: 2 }).withMessage("Nome azienda richiesto")
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: "Dati non validi",
        details: errors.array()
      });
    }

    const { email, password, firstName, lastName, companyName, industry } = req.body;

    // Verifica se l'utente esiste già
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({
        error: "Utente già esistente",
        message: "Un account con questa email esiste già"
      });
    }

    // Crea l'azienda
    const company = await Company.create({
      name: companyName,
      industry: industry || "Altro",
      settings: {
        currency: "EUR",
        timezone: "Europe/Rome",
        language: "it"
      }
    });

    // Crea l'utente
    const hashedPassword = await hashPassword(password);
    const user = await User.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      role: "admin",
      companyId: company.id,
      isActive: true
    });

    // Genera token JWT
    const token = jwt.sign(
      { userId: user.id, companyId: company.id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
    );

    res.status(201).json({
      message: "Registrazione completata con successo",
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        company: {
          id: company.id,
          name: company.name,
          industry: company.industry
        }
      }
    });

  } catch (error) {
    console.error("Errore registrazione:", error);
    res.status(500).json({
      error: "Errore interno del server",
      message: "Impossibile completare la registrazione"
    });
  }
});

// Login utente
router.post("/login", [
  body("email").isEmail().normalizeEmail().withMessage("Email non valida"),
  body("password").notEmpty().withMessage("Password richiesta")
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: "Dati non validi",
        details: errors.array()
      });
    }

    const { email, password } = req.body;

    // Trova l'utente
    const user = await User.findOne({
      where: { email },
      include: [{
        model: Company,
        as: "company",
        attributes: ["id", "name", "industry"]
      }]
    });

    if (!user) {
      return res.status(401).json({
        error: "Credenziali non valide",
        message: "Email o password incorretti"
      });
    }

    if (!user.isActive) {
      return res.status(401).json({
        error: "Account disattivato",
        message: "Il tuo account è stato disattivato"
      });
    }

    // Verifica password
    const isValidPassword = await comparePassword(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({
        error: "Credenziali non valide",
        message: "Email o password incorretti"
      });
    }

    // Genera token JWT
    const token = jwt.sign(
      { userId: user.id, companyId: user.companyId },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
    );

    // Aggiorna ultimo accesso
    await user.update({ lastLoginAt: new Date() });

    res.json({
      message: "Login effettuato con successo",
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        company: user.company
      }
    });

  } catch (error) {
    console.error("Errore login:", error);
    res.status(500).json({
      error: "Errore interno del server",
      message: "Impossibile effettuare il login"
    });
  }
});

// Verifica token
router.get("/verify", async (req, res) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    
    if (!token) {
      return res.status(401).json({
        error: "Token mancante",
        message: "Token di autorizzazione richiesto"
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.userId, {
      attributes: { exclude: ["password"] },
      include: [{
        model: Company,
        as: "company",
        attributes: ["id", "name", "industry"]
      }]
    });

    if (!user) {
      return res.status(401).json({
        error: "Token non valido",
        message: "Utente non trovato"
      });
    }

    res.json({
      valid: true,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        company: user.company
      }
    });

  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        error: "Token non valido",
        message: "Token malformato o scaduto"
      });
    }
    
    res.status(500).json({
      error: "Errore di verifica",
      message: "Impossibile verificare il token"
    });
  }
});

module.exports = router;


