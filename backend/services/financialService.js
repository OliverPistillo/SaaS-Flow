const { AIAnalyticsService } = require('./aiAnalytics');

class FinancialService {
  constructor() {
    this.aiService = new AIAnalyticsService();
  }

  async generateDashboardData(companyId, period = '12') {
    try {
      // Simula dati finanziari (in produzione verrebbero dal database)
      const financialData = await this.getFinancialData(companyId, period);
      
      const dashboard = {
        summary: {
          totalRevenue: financialData.reduce((sum, d) => sum + d.revenue, 0),
          totalExpenses: financialData.reduce((sum, d) => sum + d.expenses, 0),
          netProfit: 0,
          profitMargin: 0,
          revenueGrowth: 0
        },
        trends: await this.aiService.analyzeFinancialTrends(financialData),
        predictions: await this.aiService.predictCashFlow(financialData, 6),
        risks: await this.aiService.analyzeFinancialRisks(financialData),
        kpis: this.calculateKPIs(financialData)
      };

      // Calcola metriche derivate
      dashboard.summary.netProfit = dashboard.summary.totalRevenue - dashboard.summary.totalExpenses;
      dashboard.summary.profitMargin = (dashboard.summary.netProfit / dashboard.summary.totalRevenue) * 100;
      dashboard.summary.revenueGrowth = this.calculateGrowthRate(financialData, 'revenue');

      return dashboard;
    } catch (error) {
      console.error('Error generating financial dashboard:', error);
      throw new Error('Errore nella generazione della dashboard finanziaria');
    }
  }

  async getForecast(companyId, months = 6) {
    const historicalData = await this.getFinancialData(companyId, '24');
    return await this.aiService.predictCashFlow(historicalData, months);
  }

  async generateFinancialReport(companyId, reportType = 'monthly') {
    const data = await this.getFinancialData(companyId, '12');
    
    const report = {
      type: reportType,
      period: this.getReportPeriod(reportType),
      summary: this.generateReportSummary(data),
      charts: this.generateChartData(data),
      insights: await this.aiService.generateBusinessInsights({ financial: data }),
      recommendations: this.generateRecommendations(data)
    };

    return report;
  }

  // Metodi helper
  async getFinancialData(companyId, period) {
    // Simula dati finanziari per demo
    const months = parseInt(period);
    const data = [];
    const baseRevenue = 45000;
    const baseExpenses = 32000;

    for (let i = months - 1; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      
      const seasonalFactor = 1 + Math.sin((date.getMonth() / 12) * 2 * Math.PI) * 0.1;
      const trendFactor = 1 + (months - i) * 0.02; // Crescita del 2% al mese
      const randomFactor = 0.9 + Math.random() * 0.2;

      data.push({
        date: date.toISOString().split('T')[0],
        revenue: Math.round(baseRevenue * seasonalFactor * trendFactor * randomFactor),
        expenses: Math.round(baseExpenses * (0.95 + Math.random() * 0.1)),
        profit: 0 // Calcolato dopo
      });
    }

    // Calcola profit
    data.forEach(d => {
      d.profit = d.revenue - d.expenses;
    });

    return data;
  }

  calculateKPIs(data) {
    const latest = data[data.length - 1];
    const previous = data[data.length - 2];

    return {
      revenue: {
        current: latest.revenue,
        change: previous ? ((latest.revenue - previous.revenue) / previous.revenue) * 100 : 0
      },
      expenses: {
        current: latest.expenses,
        change: previous ? ((latest.expenses - previous.expenses) / previous.expenses) * 100 : 0
      },
      profit: {
        current: latest.profit,
        change: previous ? ((latest.profit - previous.profit) / previous.profit) * 100 : 0
      },
      margin: {
        current: (latest.profit / latest.revenue) * 100,
        change: previous ? 
          ((latest.profit / latest.revenue) - (previous.profit / previous.revenue)) * 100 : 0
      }
    };
  }

  calculateGrowthRate(data, metric) {
    if (data.length < 2) return 0;
    
    const recent = data.slice(-3);
    const older = data.slice(-6, -3);
    
    const recentAvg = recent.reduce((sum, d) => sum + d[metric], 0) / recent.length;
    const olderAvg = older.reduce((sum, d) => sum + d[metric], 0) / older.length;
    
    return ((recentAvg - olderAvg) / olderAvg) * 100;
  }

  generateChartData(data) {
    return {
      revenue: data.map(d => ({ date: d.date, value: d.revenue })),
      expenses: data.map(d => ({ date: d.date, value: d.expenses })),
      profit: data.map(d => ({ date: d.date, value: d.profit })),
      margin: data.map(d => ({ 
        date: d.date, 
        value: (d.profit / d.revenue) * 100 
      }))
    };
  }

  generateRecommendations(data) {
    const recommendations = [];
    const trends = this.aiService.analyzeFinancialTrends(data);

    if (trends.revenue.direction === 'down') {
      recommendations.push({
        type: 'revenue',
        priority: 'high',
        title: 'Incrementare i ricavi',
        description: 'I ricavi mostrano un trend negativo. Considera strategie di marketing o nuovi prodotti.',
        actions: [
          'Analizza i canali di vendita più performanti',
          'Implementa campagne di marketing mirate',
          'Valuta l\'espansione in nuovi mercati'
        ]
      });
    }

    if (trends.expenses.direction === 'up') {
      recommendations.push({
        type: 'expenses',
        priority: 'medium',
        title: 'Ottimizzare i costi',
        description: 'Le spese stanno aumentando. Identifica aree di ottimizzazione.',
        actions: [
          'Rivedi i contratti con i fornitori',
          'Automatizza processi manuali',
          'Ottimizza l\'utilizzo delle risorse'
        ]
      });
    }

    return recommendations;
  }
}

module.exports = FinancialService;

