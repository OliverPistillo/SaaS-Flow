const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const UserPreference = sequelize.define('UserPreference', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  theme: {
    type: DataTypes.ENUM('light', 'dark'),
    defaultValue: 'light',
    comment: 'Tema preferito dall\'utente (White/Dark Mood)'
  },
  language: {
    type: DataTypes.STRING,
    defaultValue: 'it',
    comment: 'Lingua preferita'
  },
  currency: {
    type: DataTypes.STRING,
    defaultValue: 'EUR',
    comment: 'Valuta preferita'
  },
  dateFormat: {
    type: DataTypes.STRING,
    defaultValue: 'DD/MM/YYYY',
    comment: 'Formato data preferito'
  },
  notifications: {
    type: DataTypes.JSON,
    defaultValue: {
      email: true,
      push: true,
      sms: false
    },
    comment: 'Preferenze notifiche'
  },
  dashboardLayout: {
    type: DataTypes.JSON,
    comment: 'Layout personalizzato della dashboard'
  },
  rememberLogin: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    comment: 'Remember for 30 Days option'
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    unique: true,
    references: {
      model: 'Users',
      key: 'id'
    }
  }
}, {
  tableName: 'user_preferences',
  timestamps: true,
  indexes: [
    {
      fields: ['userId']
    }
  ]
});

module.exports = UserPreference;

