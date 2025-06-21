// backend/models/index.js
const sequelize = require("../config/database");

// Import existing models
const Company = require("./Company");
const User = require("./User");
const FinancialData = require("./FinancialData");
const Employee = require("./Employee");
const Assessment = require("./Assessment");

// Import new models
const Transaction = require("./Transaction");
const Client = require("./Client");
const Account = require("./Account");
const ChatMessage = require("./ChatMessage");
const UserPreference = require("./UserPreference");

// Define existing associations
Company.hasMany(User, {
  foreignKey: "companyId",
  as: "users"
});

User.belongsTo(Company, {
  foreignKey: "companyId",
  as: "company"
});

Company.hasMany(FinancialData, {
  foreignKey: "companyId",
  as: "financialData"
});

FinancialData.belongsTo(Company, {
  foreignKey: "companyId",
  as: "company"
});

FinancialData.belongsTo(User, {
  foreignKey: "createdBy",
  as: "creator"
});

Company.hasMany(Employee, {
  foreignKey: "companyId",
  as: "employees"
});

Employee.belongsTo(Company, {
  foreignKey: "companyId",
  as: "company"
});

Employee.hasMany(Assessment, {
  foreignKey: "employeeId",
  as: "assessments"
});

Assessment.belongsTo(Employee, {
  foreignKey: "employeeId",
  as: "employee"
});

Assessment.belongsTo(Company, {
  foreignKey: "companyId",
  as: "company"
});

Assessment.belongsTo(User, {
  foreignKey: "conductedBy",
  as: "conductor"
});

// Define new associations for enhanced functionality
Company.hasMany(Transaction, {
  foreignKey: "companyId",
  as: "transactions"
});

Transaction.belongsTo(Company, {
  foreignKey: "companyId",
  as: "company"
});

User.hasMany(Transaction, {
  foreignKey: "userId",
  as: "transactions"
});

Transaction.belongsTo(User, {
  foreignKey: "userId",
  as: "user"
});

Company.hasMany(Client, {
  foreignKey: "companyId",
  as: "clients"
});

Client.belongsTo(Company, {
  foreignKey: "companyId",
  as: "company"
});

User.hasMany(Client, {
  foreignKey: "userId",
  as: "clients"
});

Client.belongsTo(User, {
  foreignKey: "userId",
  as: "user"
});

Client.hasMany(Transaction, {
  foreignKey: "clientId",
  as: "transactions"
});

Transaction.belongsTo(Client, {
  foreignKey: "clientId",
  as: "client"
});

Company.hasMany(Account, {
  foreignKey: "companyId",
  as: "accounts"
});

Account.belongsTo(Company, {
  foreignKey: "companyId",
  as: "company"
});

User.hasMany(Account, {
  foreignKey: "userId",
  as: "accounts"
});

Account.belongsTo(User, {
  foreignKey: "userId",
  as: "user"
});

Account.hasMany(Transaction, {
  foreignKey: "accountId",
  as: "transactions"
});

Transaction.belongsTo(Account, {
  foreignKey: "accountId",
  as: "account"
});

User.hasMany(ChatMessage, {
  foreignKey: "userId",
  as: "chatMessages"
});

ChatMessage.belongsTo(User, {
  foreignKey: "userId",
  as: "user"
});

Company.hasMany(ChatMessage, {
  foreignKey: "companyId",
  as: "chatMessages"
});

ChatMessage.belongsTo(Company, {
  foreignKey: "companyId",
  as: "company"
});

User.hasOne(UserPreference, {
  foreignKey: "userId",
  as: "preferences"
});

UserPreference.belongsTo(User, {
  foreignKey: "userId",
  as: "user"
});

// Sync database
const syncDatabase = async (force = false) => {
  try {
    await sequelize.sync({ force });
    console.log("✅ Database sincronizzato con successo");
  } catch (error) {
    console.error("❌ Errore sincronizzazione database:", error);
    throw error;
  }
};

module.exports = {
  sequelize,
  Company,
  User,
  FinancialData,
  Employee,
  Assessment,
  Transaction,
  Client,
  Account,
  ChatMessage,
  UserPreference,
  syncDatabase
};



