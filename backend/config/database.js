const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME || 'doflow_db',
  process.env.DB_USER || 'doflow_user',
  process.env.DB_PASSWORD || 'doflow_password',
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    define: {
      timestamps: true,
      underscored: true,
      freezeTableName: true
    }
  }
);

// Test database connection
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Connessione al database PostgreSQL stabilita con successo.');
  } catch (error) {
    console.error('❌ Impossibile connettersi al database:', error.message);
  }
};

testConnection();

module.exports = sequelize;

