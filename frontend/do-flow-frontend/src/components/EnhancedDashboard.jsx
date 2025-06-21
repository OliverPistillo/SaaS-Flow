import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  CreditCard, 
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Search,
  Filter,
  Download,
  Calendar,
  Eye
} from 'lucide-react';
import DashboardLayout from './DashboardLayout';
import '../App.css';

const EnhancedDashboard = () => {
  const { user } = useAuth();
  const [timeRange, setTimeRange] = useState('monthly');
  const [dashboardData, setDashboardData] = useState({
    summary: {
      totalIncome: 285000,
      totalExpenses: 195000,
      totalSavings: 90000,
      netProfit: 90000,
      profitMargin: 31.6
    },
    monthlyData: [],
    recentTransactions: [],
    loading: true
  });

  useEffect(() => {
    fetchDashboardData();
  }, [timeRange]);

  const fetchDashboardData = async () => {
    try {
      // Simulate API call
      setTimeout(() => {
        setDashboardData(prev => ({
          ...prev,
          recentTransactions: [
            {
              id: '1s5gf1',
              category: 'Salary',
              name: 'Starbucks',
              details: 'Dhanmondi Branch 2 Rent',
              amount: 33200.00,
              type: 'income',
              paymentMethod: 'bank',
              date: '2024-01-15'
            },
            {
              id: 'dsrg515',
              category: 'Office Rent',
              name: 'Pizza Hut',
              details: 'Dhanmondi Branch 2 Rent',
              amount: 12200.00,
              type: 'expense',
              paymentMethod: 'bank',
              date: '2024-01-14'
            },
            {
              id: '452hd',
              category: 'Car Rent',
              name: 'Car Rent',
              details: 'Vehicle rental for business',
              amount: 1200.00,
              type: 'expense',
              paymentMethod: 'cash',
              date: '2024-01-13'
            }
          ],
          loading: false
        }));
      }, 1000);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setDashboardData(prev => ({ ...prev, loading: false }));
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const getTransactionIcon = (type) => {
    switch (type) {
      case 'income':
        return <ArrowUpRight className="w-5 h-5" />;
      case 'expense':
        return <ArrowDownRight className="w-5 h-5" />;
      default:
        return <DollarSign className="w-5 h-5" />;
    }
  };

  if (dashboardData.loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-96">
          <div className="loading"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
              Benvenuto, {user?.firstName || 'Simi'}! 👋
            </h1>
            <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
              Ecco una panoramica delle tue finanze e attività
            </p>
          </div>
          
          <div className="flex items-center space-x-3 mt-4 sm:mt-0">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="input text-sm"
              style={{ minWidth: '120px' }}
            >
              <option value="weekly">Settimanale</option>
              <option value="monthly">Mensile</option>
              <option value="yearly">Annuale</option>
            </select>
            
            <button className="btn btn-primary">
              <Plus className="w-4 h-4 mr-2" />
              Nuova Transazione
            </button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="dashboard-grid">
          {/* Income Monthly */}
          <div className="stat-card">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <span className="text-xs px-2 py-1 bg-green-100 text-green-600 rounded-full">
                +15% ultimi 7 giorni
              </span>
            </div>
            <div className="stat-value text-green-600">
              {formatCurrency(dashboardData.summary.totalIncome / 12)}
            </div>
            <div className="stat-label">Entrate Mensili</div>
            <div className="stat-change positive">
              Incremento entrate 15% ultimi 7 giorni
            </div>
          </div>

          {/* Expense Monthly */}
          <div className="stat-card">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <TrendingDown className="w-6 h-6 text-red-600" />
              </div>
              <span className="text-xs px-2 py-1 bg-red-100 text-red-600 rounded-full">
                +8% ultimi 7 giorni
              </span>
            </div>
            <div className="stat-value text-red-600">
              {formatCurrency(dashboardData.summary.totalExpenses / 12)}
            </div>
            <div className="stat-label">Spese Mensili</div>
            <div className="stat-change negative">
              Incremento spese 8% ultimi 7 giorni
            </div>
          </div>

          {/* Analytics Yearly */}
          <div className="stat-card">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <PieChart className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-xs px-2 py-1 bg-blue-100 text-blue-600 rounded-full">
                2024
              </span>
            </div>
            <div className="stat-value text-blue-600">
              {formatCurrency(dashboardData.summary.netProfit)}
            </div>
            <div className="stat-label">Analytics Annuali</div>
            <div className="stat-change positive">
              Margine di profitto: {dashboardData.summary.profitMargin}%
            </div>
          </div>

          {/* Overview */}
          <div className="stat-card">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-purple-600" />
              </div>
              <button className="btn btn-ghost text-xs">
                <Eye className="w-3 h-3 mr-1" />
                Dettagli
              </button>
            </div>
            <div className="stat-value text-purple-600">
              {formatCurrency(dashboardData.summary.totalSavings)}
            </div>
            <div className="stat-label">Risparmi Totali</div>
            <div className="stat-change positive">
              Obiettivo annuale: 85% raggiunto
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Transactions */}
          <div className="lg:col-span-2">
            <div className="card">
              <div className="card-header">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                    Transazioni Recenti
                  </h3>
                  <div className="flex items-center space-x-2">
                    <button className="btn btn-ghost btn-sm">
                      <Search className="w-4 h-4" />
                    </button>
                    <button className="btn btn-ghost btn-sm">
                      <Filter className="w-4 h-4" />
                    </button>
                    <button className="btn btn-secondary btn-sm">
                      Vedi tutto
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="card-content">
                <div className="space-y-3">
                  {dashboardData.recentTransactions.map((transaction) => (
                    <div key={transaction.id} className="transaction-item">
                      <div className={`transaction-icon ${transaction.type}`}>
                        {getTransactionIcon(transaction.type)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>
                              {transaction.name}
                            </p>
                            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                              {transaction.category} • {transaction.details}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className={`font-semibold text-sm ${
                              transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                            </p>
                            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                              {transaction.paymentMethod} • {transaction.id}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions & Reports */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="card">
              <div className="card-header">
                <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                  Azioni Rapide
                </h3>
              </div>
              <div className="card-content">
                <div className="space-y-3">
                  <button className="btn btn-secondary w-full justify-start">
                    <Plus className="w-4 h-4 mr-3" />
                    Aggiungi Entrata
                  </button>
                  <button className="btn btn-secondary w-full justify-start">
                    <TrendingDown className="w-4 h-4 mr-3" />
                    Aggiungi Spesa
                  </button>
                  <button className="btn btn-secondary w-full justify-start">
                    <Users className="w-4 h-4 mr-3" />
                    Gestisci Clienti
                  </button>
                  <button className="btn btn-secondary w-full justify-start">
                    <CreditCard className="w-4 h-4 mr-3" />
                    Gestisci Account
                  </button>
                </div>
              </div>
            </div>

            {/* Reports */}
            <div className="card">
              <div className="card-header">
                <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                  Report
                </h3>
              </div>
              <div className="card-content">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>
                        Report Mensile
                      </p>
                      <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                        Gennaio 2024
                      </p>
                    </div>
                    <button className="btn btn-ghost btn-sm">
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>
                        Analisi Categorie
                      </p>
                      <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                        Ultimo trimestre
                      </p>
                    </div>
                    <button className="btn btn-ghost btn-sm">
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <button className="btn btn-primary w-full">
                    <PieChart className="w-4 h-4 mr-2" />
                    Vedi tutti i report
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="card">
            <div className="card-content">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-green-600">€12,153</p>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Ricavi Annuali (2024)</p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="card">
            <div className="card-content">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-red-600">€8,420</p>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Costi Totali (2024)</p>
                </div>
                <TrendingDown className="w-8 h-8 text-red-600" />
              </div>
            </div>
          </div>
          
          <div className="card">
            <div className="card-content">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-blue-600">€3,733</p>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Risparmi Annuali (2024)</p>
                </div>
                <DollarSign className="w-8 h-8 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="card">
            <div className="card-content">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-purple-600">€1,215</p>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>IVA/Tasse (2024)</p>
                </div>
                <Calendar className="w-8 h-8 text-purple-600" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default EnhancedDashboard;

