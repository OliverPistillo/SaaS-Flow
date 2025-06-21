const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Transaction = sequelize.define('Transaction', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  transactionId: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    comment: 'T-ID come mostrato nell\'UI'
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'Categoria della transazione (Salary, Car Rent, Office Rent, etc.)'
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'Nome della transazione'
  },
  details: {
    type: DataTypes.TEXT,
    comment: 'Dettagli aggiuntivi della transazione'
  },
  amount: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
    comment: 'Importo della transazione'
  },
  type: {
    type: DataTypes.ENUM('income', 'expense', 'savings'),
    allowNull: false,
    comment: 'Tipo di transazione'
  },
  paymentMethod: {
    type: DataTypes.ENUM('bank', 'cash', 'card'),
    allowNull: false,
    comment: 'Metodo di pagamento'
  },
  imageUrl: {
    type: DataTypes.STRING,
    comment: 'URL dell\'immagine di prova caricata'
  },
  notes: {
    type: DataTypes.TEXT,
    comment: 'Note dettagliate sulla transazione'
  },
  receivedDate: {
    type: DataTypes.DATE,
    comment: 'Data di ricezione per transazioni income'
  },
  clientId: {
    type: DataTypes.UUID,
    references: {
      model: 'Clients',
      key: 'id'
    },
    comment: 'Riferimento al cliente (per income)'
  },
  accountId: {
    type: DataTypes.UUID,
    references: {
      model: 'Accounts',
      key: 'id'
    },
    comment: 'Account associato alla transazione'
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
  tableName: 'transactions',
  timestamps: true,
  indexes: [
    {
      fields: ['companyId', 'type']
    },
    {
      fields: ['userId']
    },
    {
      fields: ['transactionId']
    }
  ]
});

module.exports = Transaction;

