const jwt = require('jsonwebtoken');
const { User } = require('../models');

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        error: 'Accesso negato',
        message: 'Token di autorizzazione richiesto'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.userId, {
      attributes: { exclude: ['password'] }
    });

    if (!user) {
      return res.status(401).json({
        error: 'Token non valido',
        message: 'Utente non trovato'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        error: 'Token non valido',
        message: 'Token malformato o scaduto'
      });
    }
    
    res.status(500).json({
      error: 'Errore di autenticazione',
      message: 'Errore interno del server'
    });
  }
};

const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'Non autorizzato',
        message: 'Autenticazione richiesta'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        error: 'Accesso negato',
        message: 'Permessi insufficienti per questa operazione'
      });
    }

    next();
  };
};

module.exports = {
  authMiddleware,
  requireRole
};

