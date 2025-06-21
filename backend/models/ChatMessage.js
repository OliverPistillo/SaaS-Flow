const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ChatMessage = sequelize.define('ChatMessage', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false,
    comment: 'Contenuto del messaggio'
  },
  sender: {
    type: DataTypes.ENUM('user', 'ai'),
    allowNull: false,
    comment: 'Chi ha inviato il messaggio'
  },
  messageType: {
    type: DataTypes.ENUM('text', 'transaction', 'report', 'help'),
    defaultValue: 'text',
    comment: 'Tipo di messaggio per categorizzazione'
  },
  context: {
    type: DataTypes.JSON,
    comment: 'Contesto aggiuntivo del messaggio (es. dati transazione)'
  },
  sessionId: {
    type: DataTypes.STRING,
    comment: 'ID della sessione chat'
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  companyId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Companies',
      key: 'id'
    }
  }
}, {
  tableName: 'chat_messages',
  timestamps: true,
  indexes: [
    {
      fields: ['userId', 'sessionId']
    },
    {
      fields: ['companyId']
    },
    {
      fields: ['createdAt']
    }
  ]
});

module.exports = ChatMessage;

