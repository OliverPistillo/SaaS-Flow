// frontend/do-flow-frontend/src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './App.css';
import './styles/themes.css';

// Enhanced Components
import LandingPage from './components/LandingPage';
import EnhancedLoginPage from './components/EnhancedLoginPage';
import EnhancedRegisterPage from './components/EnhancedRegisterPage';
import EnhancedDashboard from './components/EnhancedDashboard';
import EnhancedFinancialDashboard from './components/EnhancedFinancialDashboard';
import HRDashboard from './components/HRDashboard';
import AnalyticsDashboard from './components/AnalyticsDashboard';

// Context
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading"></div>
      </div>
    );
  }
  
  return user ? children : <Navigate to="/login" />;
};

// Public Route Component (redirect if authenticated)
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading"></div>
      </div>
    );
  }
  
  return user ? <Navigate to="/dashboard" /> : children;
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="min-h-screen">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<PublicRoute><LandingPage /></PublicRoute>} />
              <Route path="/login" element={<PublicRoute><EnhancedLoginPage /></PublicRoute>} />
              <Route path="/register" element={<PublicRoute><EnhancedRegisterPage /></PublicRoute>} />
              
              {/* Protected Routes */}
              <Route path="/dashboard" element={<ProtectedRoute><EnhancedDashboard /></ProtectedRoute>} />
              <Route path="/financial" element={<ProtectedRoute><EnhancedFinancialDashboard /></ProtectedRoute>} />
              <Route path="/hr" element={<ProtectedRoute><HRDashboard /></ProtectedRoute>} />
              <Route path="/analytics" element={<ProtectedRoute><AnalyticsDashboard /></ProtectedRoute>} />
              
              {/* Catch all route */}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;