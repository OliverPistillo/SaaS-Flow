const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Assessment = sequelize.define('Assessment', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  testType: {
    type: DataTypes.ENUM('cognitive', 'personality', 'technical', 'leadership', 'communication'),
    allowNull: false
  },
  responses: {
    type: DataTypes.JSONB,
    allowNull: false,
    defaultValue: []
  },
  overallScore: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 0,
      max: 100
    }
  },
  insights: {
    type: DataTypes.JSONB,
    allowNull: true,
    defaultValue: []
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  completedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  employeeId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'employees',
      key: 'id'
    }
  },
  companyId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'companies',
      key: 'id'
    }
  },
  conductedBy: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  }
}, {
  tableName: 'assessments',
  indexes: [
    {
      fields: ['employeeId']
    },
    {
      fields: ['companyId']
    },
    {
      fields: ['testType']
    },
    {
      fields: ['completedAt']
    }
  ]
});

module.exports = Assessment;

