const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Account = sequelize.define('Account', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'Nome dell\'account (es. Conto Corrente, Cassa, etc.)'
  },
  type: {
    type: DataTypes.ENUM('bank', 'cash', 'card', 'savings'),
    allowNull: false,
    comment: 'Tipo di account'
  },
  balance: {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 0.00,
    comment: 'Saldo corrente dell\'account'
  },
  accountNumber: {
    type: DataTypes.STRING,
    comment: 'Numero di conto (se applicabile)'
  },
  bankName: {
    type: DataTypes.STRING,
    comment: 'Nome della banca (se applicabile)'
  },
  description: {
    type: DataTypes.TEXT,
    comment: 'Descrizione dell\'account'
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    comment: 'Account attivo o meno'
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
  tableName: 'accounts',
  timestamps: true,
  indexes: [
    {
      fields: ['companyId']
    },
    {
      fields: ['userId']
    },
    {
      fields: ['type']
    }
  ]
});

module.exports = Account;

