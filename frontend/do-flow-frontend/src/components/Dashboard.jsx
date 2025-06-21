import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3, 
  Users, 
  TrendingUp, 
  Euro, 
  ArrowUpRight, 
  ArrowDownRight,
  Plus,
  Eye,
  Calendar,
  Target
} from 'lucide-react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import DashboardLayout from './DashboardLayout';
import { useAuth } from '../contexts/AuthContext';
import { formatCurrency, formatPercentage } from '../utils/helpers';
import '../App.css';

const Dashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    financial: {
      totalRevenue: 285000,
      totalExpenses: 195000,
      netProfit: 90000,
      profitMargin: 31.6,
      revenueGrowth: 12.5
    },
    hr: {
      totalEmployees: 24,
      assessedEmployees: 18,
      assessmentCoverage: 75,
      avgPerformanceScore: 82.4
    },
    recentActivity: [
      { id: 1, type: 'financial', message: 'Nuovo record finanziario aggiunto', time: '2 ore fa' },
      { id: 2, type: 'hr', message: 'Assessment completato per Marco Verdi', time: '4 ore fa' },
      { id: 3, type: 'financial', message: 'Report mensile generato', time: '1 giorno fa' }
    ]
  });

  // Dati mock per i grafici
  const revenueData = [
    { month: 'Gen', revenue: 45000, expenses: 32000 },
    { month: 'Feb', revenue: 52000, expenses: 35000 },
    { month: 'Mar', revenue: 48000, expenses: 33000 },
    { month: 'Apr', revenue: 61000, expenses: 38000 },
    { month: 'Mag', revenue: 55000, expenses: 36000 },
    { month: 'Giu', revenue: 67000, expenses: 42000 }
  ];

  const teamPerformanceData = [
    { department: 'IT', score: 88 },
    { department: 'Marketing', score: 82 },
    { department: 'Vendite', score: 79 },
    { department: 'HR', score: 85 }
  ];

  const kpiData = [
    { name: 'Ricavi', value: 285000, change: 12.5, positive: true },
    { name: 'Spese', value: 195000, change: -3.2, positive: true },
    { name: 'Dipendenti', value: 24, change: 8.3, positive: true },
    { name: 'Performance', value: 82.4, change: 5.1, positive: true }
  ];

  useEffect(() => {
    // Simula caricamento dati
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Benvenuto, {user?.firstName}!
            </h1>
            <p className="text-gray-600 mt-1">
              Ecco una panoramica delle performance di {user?.company?.name}
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm">
              <Calendar className="h-4 w-4 mr-2" />
              Ultimo mese
            </Button>
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Nuovo record
            </Button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {kpiData.map((kpi, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {kpi.name}
                </CardTitle>
                <div className={`p-2 rounded-lg ${
                  index === 0 ? 'bg-green-100' :
                  index === 1 ? 'bg-red-100' :
                  index === 2 ? 'bg-blue-100' : 'bg-purple-100'
                }`}>
                  {index === 0 && <Euro className="h-4 w-4 text-green-600" />}
                  {index === 1 && <TrendingUp className="h-4 w-4 text-red-600" />}
                  {index === 2 && <Users className="h-4 w-4 text-blue-600" />}
                  {index === 3 && <Target className="h-4 w-4 text-purple-600" />}
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">
                  {index < 2 ? formatCurrency(kpi.value) : 
                   index === 3 ? `${kpi.value}%` : kpi.value}
                </div>
                <div className="flex items-center mt-2">
                  {kpi.positive ? (
                    <ArrowUpRight className="h-4 w-4 text-green-500" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4 text-red-500" />
                  )}
                  <span className={`text-sm ml-1 ${
                    kpi.positive ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {formatPercentage(Math.abs(kpi.change))}
                  </span>
                  <span className="text-sm text-gray-500 ml-1">vs mese scorso</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Andamento Finanziario
                <Link to="/financial">
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    Dettagli
                  </Button>
                </Link>
              </CardTitle>
              <CardDescription>
                Ricavi e spese degli ultimi 6 mesi
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value) => [formatCurrency(value), '']}
                    labelStyle={{ color: '#374151' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="revenue" 
                    stackId="1"
                    stroke="#3B82F6" 
                    fill="#3B82F6" 
                    fillOpacity={0.6}
                    name="Ricavi"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="expenses" 
                    stackId="2"
                    stroke="#EF4444" 
                    fill="#EF4444" 
                    fillOpacity={0.6}
                    name="Spese"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Team Performance Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Performance Team
                <Link to="/hr">
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    Dettagli
                  </Button>
                </Link>
              </CardTitle>
              <CardDescription>
                Punteggi medi per dipartimento
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={teamPerformanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="department" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip 
                    formatter={(value) => [`${value}%`, 'Score']}
                    labelStyle={{ color: '#374151' }}
                  />
                  <Bar 
                    dataKey="score" 
                    fill="#8B5CF6"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Statistiche Rapide</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Margine di profitto</span>
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  {formatPercentage(dashboardData.financial.profitMargin)}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Copertura valutazioni</span>
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  {formatPercentage(dashboardData.hr.assessmentCoverage)}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Crescita ricavi</span>
                <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                  +{formatPercentage(dashboardData.financial.revenueGrowth)}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Score medio team</span>
                <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                  {dashboardData.hr.avgPerformanceScore}%
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Attività Recente</CardTitle>
              <CardDescription>
                Ultimi aggiornamenti del sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dashboardData.recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className={`p-2 rounded-full ${
                      activity.type === 'financial' ? 'bg-blue-100' : 'bg-purple-100'
                    }`}>
                      {activity.type === 'financial' ? (
                        <BarChart3 className="h-4 w-4 text-blue-600" />
                      ) : (
                        <Users className="h-4 w-4 text-purple-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {activity.message}
                      </p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 text-center">
                <Link to="/analytics">
                  <Button variant="outline" size="sm">
                    Vedi tutti i report
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;

