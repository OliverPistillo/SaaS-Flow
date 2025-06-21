// backend/server.js
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3001;
const HOST = process.env.HOST || "0.0.0.0";

// Security middleware
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false
}));

// CORS configuration
app.use(cors({
  origin: process.env.CORS_ORIGIN || "http://localhost:3000",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Compression middleware
app.use(compression());

// Logging middleware
app.use(morgan("combined"));

// Health check endpoint
app.get("/api/v1/health", (req, res) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    version: "1.0.0"
  });
});

// Simple test routes
app.get("/api/v1/test", (req, res) => {
  res.json({
    message: "Do-Flow API is working!",
    timestamp: new Date().toISOString()
  });
});

// Demo data endpoint
app.get("/api/v1/demo/financial", (req, res) => {
  const demoData = {
    summary: {
      totalRevenue: 285000,
      totalExpenses: 195000,
      netProfit: 90000,
      profitMargin: 31.6,
      revenueGrowth: 12.5
    },
    chartData: [
      { month: "Gen", revenue: 45000, expenses: 32000 },
      { month: "Feb", revenue: 48000, expenses: 33000 },
      { month: "Mar", revenue: 52000, expenses: 35000 },
      { month: "Apr", revenue: 47000, expenses: 31000 },
      { month: "Mag", revenue: 55000, expenses: 38000 },
      { month: "Giu", revenue: 58000, expenses: 40000 }
    ]
  };
  
  res.json({
    success: true,
    data: demoData
  });
});

app.get("/api/v1/demo/hr", (req, res) => {
  const demoData = {
    summary: {
      totalEmployees: 24,
      assessedEmployees: 18,
      assessmentCoverage: 75,
      avgPerformanceScore: 82.4
    },
    departments: [
      { name: "IT", count: 8, avgScore: 85 },
      { name: "Marketing", count: 6, avgScore: 80 },
      { name: "Sales", count: 7, avgScore: 78 },
      { name: "HR", count: 3, avgScore: 88 }
    ]
  };
  
  res.json({
    success: true,
    data: demoData
  });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    error: "Endpoint non trovato",
    message: `La risorsa ${req.originalUrl} non esiste`
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(err.status || 500).json({
    error: "Errore interno del server",
    message: process.env.NODE_ENV === "development" ? err.message : "Qualcosa è andato storto"
  });
});

// Start server
app.listen(PORT, HOST, () => {
  console.log(`🚀 Do-Flow Backend running on http://${HOST}:${PORT}`);
  console.log(`📊 Health check: http://${HOST}:${PORT}/api/v1/health`);
  console.log(`🧪 Test endpoint: http://${HOST}:${PORT}/api/v1/test`);
});