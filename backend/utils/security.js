const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const { body, validationResult } = require('express-validator');

class SecurityMiddleware {
  // Rate Limiting
  static createRateLimit(windowMs = 15 * 60 * 1000, max = 100, message = 'Troppi tentativi, riprova più tardi') {
    return rateLimit({
      windowMs,
      max,
      message: {
        error: message,
        retryAfter: Math.ceil(windowMs / 1000)
      },
      standardHeaders: true,
      legacyHeaders: false,
      handler: (req, res) => {
        res.status(429).json({
          error: message,
          retryAfter: Math.ceil(windowMs / 1000)
        });
      }
    });
  }

  // Rate limiting specifici
  static authRateLimit = this.createRateLimit(
    15 * 60 * 1000, // 15 minuti
    5, // 5 tentativi
    'Troppi tentativi di login, riprova tra 15 minuti'
  );

  static apiRateLimit = this.createRateLimit(
    15 * 60 * 1000, // 15 minuti
    100, // 100 richieste
    'Limite API raggiunto, riprova più tardi'
  );

  static strictRateLimit = this.createRateLimit(
    60 * 1000, // 1 minuto
    10, // 10 richieste
    'Limite richieste raggiunto, rallenta'
  );

  // Helmet Security Headers
  static securityHeaders() {
    return helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
          fontSrc: ["'self'", "https://fonts.gstatic.com"],
          imgSrc: ["'self'", "data:", "https:"],
          scriptSrc: ["'self'"],
          connectSrc: ["'self'", "https://api.do-flow.com"],
          frameSrc: ["'none'"],
          objectSrc: ["'none'"],
          upgradeInsecureRequests: []
        }
      },
      hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true
      },
      noSniff: true,
      frameguard: { action: 'deny' },
      xssFilter: true,
      referrerPolicy: { policy: 'strict-origin-when-cross-origin' }
    });
  }

  // Input Validation
  static validateRegistration() {
    return [
      body('firstName')
        .trim()
        .isLength({ min: 2, max: 50 })
        .matches(/^[a-zA-ZÀ-ÿ\s]+$/)
        .withMessage('Nome deve contenere solo lettere e spazi (2-50 caratteri)'),
      
      body('lastName')
        .trim()
        .isLength({ min: 2, max: 50 })
        .matches(/^[a-zA-ZÀ-ÿ\s]+$/)
        .withMessage('Cognome deve contenere solo lettere e spazi (2-50 caratteri)'),
      
      body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Email non valida'),
      
      body('password')
        .isLength({ min: 8, max: 128 })
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
        .withMessage('Password deve contenere almeno 8 caratteri, una maiuscola, una minuscola, un numero e un carattere speciale'),
      
      body('companyName')
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage('Nome azienda deve essere tra 2 e 100 caratteri'),
      
      body('industry')
        .optional()
        .isIn(['Tecnologia', 'Manifatturiero', 'Servizi', 'Commercio', 'Sanità', 'Educazione', 'Finanza', 'Immobiliare', 'Turismo', 'Altro'])
        .withMessage('Settore non valido')
    ];
  }

  static validateLogin() {
    return [
      body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Email non valida'),
      
      body('password')
        .isLength({ min: 1 })
        .withMessage('Password richiesta')
    ];
  }

  static validateFinancialData() {
    return [
      body('revenue')
        .isNumeric({ min: 0 })
        .withMessage('Ricavi devono essere un numero positivo'),
      
      body('expenses')
        .isNumeric({ min: 0 })
        .withMessage('Spese devono essere un numero positivo'),
      
      body('date')
        .isISO8601()
        .withMessage('Data non valida'),
      
      body('category')
        .optional()
        .isLength({ min: 2, max: 50 })
        .withMessage('Categoria deve essere tra 2 e 50 caratteri')
    ];
  }

  static validateAssessment() {
    return [
      body('answers')
        .isArray({ min: 1 })
        .withMessage('Risposte richieste'),
      
      body('answers.*.questionId')
        .isLength({ min: 1 })
        .withMessage('ID domanda richiesto'),
      
      body('answers.*.selectedOption')
        .isInt({ min: 0, max: 10 })
        .withMessage('Opzione selezionata non valida'),
      
      body('testId')
        .isLength({ min: 1 })
        .withMessage('ID test richiesto')
    ];
  }

  // Validation Error Handler
  static handleValidationErrors() {
    return (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: 'Dati non validi',
          details: errors.array().map(err => ({
            field: err.param,
            message: err.msg,
            value: err.value
          }))
        });
      }
      next();
    };
  }

  // SQL Injection Protection
  static sanitizeInput() {
    return (req, res, next) => {
      const sanitize = (obj) => {
        if (typeof obj === 'string') {
          // Rimuovi caratteri SQL pericolosi
          return obj.replace(/['"\\;]/g, '');
        }
        if (typeof obj === 'object' && obj !== null) {
          Object.keys(obj).forEach(key => {
            obj[key] = sanitize(obj[key]);
          });
        }
        return obj;
      };

      if (req.body) {
        req.body = sanitize(req.body);
      }
      if (req.query) {
        req.query = sanitize(req.query);
      }
      if (req.params) {
        req.params = sanitize(req.params);
      }

      next();
    };
  }

  // XSS Protection
  static xssProtection() {
    return (req, res, next) => {
      const escapeHtml = (text) => {
        if (typeof text !== 'string') return text;
        
        const map = {
          '&': '&amp;',
          '<': '&lt;',
          '>': '&gt;',
          '"': '&quot;',
          "'": '&#039;',
          '/': '&#x2F;'
        };
        
        return text.replace(/[&<>"'/]/g, (s) => map[s]);
      };

      const escapeObject = (obj) => {
        if (typeof obj === 'string') {
          return escapeHtml(obj);
        }
        if (typeof obj === 'object' && obj !== null) {
          Object.keys(obj).forEach(key => {
            obj[key] = escapeObject(obj[key]);
          });
        }
        return obj;
      };

      if (req.body) {
        req.body = escapeObject(req.body);
      }

      next();
    };
  }

  // CORS Configuration
  static corsOptions() {
    return {
      origin: (origin, callback) => {
        const allowedOrigins = [
          'http://localhost:3000',
          'http://localhost:3001',
          'https://do-flow.com',
          'https://app.do-flow.com'
        ];

        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error('Non autorizzato da CORS'));
        }
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
      exposedHeaders: ['X-Total-Count', 'X-Rate-Limit-Remaining'],
      maxAge: 86400 // 24 ore
    };
  }

  // Request Size Limiting
  static requestSizeLimit() {
    return (req, res, next) => {
      const maxSize = 10 * 1024 * 1024; // 10MB
      
      if (req.headers['content-length'] && parseInt(req.headers['content-length']) > maxSize) {
        return res.status(413).json({
          error: 'Richiesta troppo grande',
          maxSize: '10MB'
        });
      }

      next();
    };
  }

  // IP Whitelist/Blacklist
  static ipFilter(whitelist = [], blacklist = []) {
    return (req, res, next) => {
      const clientIP = req.ip || req.connection.remoteAddress;
      
      // Controlla blacklist
      if (blacklist.length > 0 && blacklist.includes(clientIP)) {
        return res.status(403).json({
          error: 'Accesso negato',
          reason: 'IP bloccato'
        });
      }

      // Controlla whitelist (se presente)
      if (whitelist.length > 0 && !whitelist.includes(clientIP)) {
        return res.status(403).json({
          error: 'Accesso negato',
          reason: 'IP non autorizzato'
        });
      }

      next();
    };
  }

  // Session Security
  static sessionSecurity() {
    return {
      secret: process.env.SESSION_SECRET || 'do-flow-secret-key-change-in-production',
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000, // 24 ore
        sameSite: 'strict'
      },
      name: 'do-flow-session'
    };
  }

  // Error Handler
  static errorHandler() {
    return (err, req, res, next) => {
      console.error('Security error:', err);

      // Non esporre dettagli dell'errore in produzione
      const isDevelopment = process.env.NODE_ENV === 'development';
      
      const errorResponse = {
        error: 'Errore interno del server',
        timestamp: new Date().toISOString(),
        requestId: req.auditId
      };

      if (isDevelopment) {
        errorResponse.details = err.message;
        errorResponse.stack = err.stack;
      }

      res.status(err.status || 500).json(errorResponse);
    };
  }

  // Security Headers Middleware
  static customSecurityHeaders() {
    return (req, res, next) => {
      // Rimuovi header che rivelano informazioni sul server
      res.removeHeader('X-Powered-By');
      res.removeHeader('Server');

      // Aggiungi header di sicurezza personalizzati
      res.setHeader('X-Content-Type-Options', 'nosniff');
      res.setHeader('X-Frame-Options', 'DENY');
      res.setHeader('X-XSS-Protection', '1; mode=block');
      res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
      res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
      res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');

      next();
    };
  }
}

module.exports = SecurityMiddleware;