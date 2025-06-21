const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Client = sequelize.define('Client', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  clientId: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    comment: 'ID cliente formato CL-1001'
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'Nome del cliente o azienda'
  },
  email: {
    type: DataTypes.STRING,
    validate: {
      isEmail: true
    },
    comment: 'Email del cliente'
  },
  phone: {
    type: DataTypes.STRING,
    comment: 'Numero di telefono del cliente'
  },
  address: {
    type: DataTypes.TEXT,
    comment: 'Indirizzo del cliente'
  },
  contact: {
    type: DataTypes.STRING,
    comment: 'Persona di contatto'
  },
  companyType: {
    type: DataTypes.STRING,
    comment: 'Tipo di azienda (se applicabile)'
  },
  notes: {
    type: DataTypes.TEXT,
    comment: 'Note aggiuntive sul cliente'
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    comment: 'Cliente attivo o meno'
  },
  companyId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Companies',
      key: 'id'
    }
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  }
}, {
  tableName: 'clients',
  timestamps: true,
  indexes: [
    {
      fields: ['companyId']
    },
    {
      fields: ['clientId']
    },
    {
      fields: ['email']
    }
  ]
});

module.exports = Client;

