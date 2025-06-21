const { AIAnalyticsService } = require('./aiAnalytics');
const FinancialService = require('./financialService');
const HRService = require('./hrService');

class AnalyticsService {
  constructor() {
    this.aiService = new AIAnalyticsService();
    this.financialService = new FinancialService();
    this.hrService = new HRService();
  }

  async generateOverviewDashboard(companyId, period = '12') {
    try {
      const [financialData, hrData] = await Promise.all([
        this.financialService.generateDashboardData(companyId, period),
        this.hrService.generateDashboardData(companyId)
      ]);

      const overview = {
        financial: {
          revenue: financialData.summary.totalRevenue,
          profit: financialData.summary.netProfit,
          margin: financialData.summary.profitMargin,
          growth: financialData.summary.revenueGrowth
        },
        hr: {
          employees: hrData.summary.totalEmployees,
          performance: hrData.summary.avgPerformanceScore,
          coverage: hrData.summary.assessmentCoverage
        },
        insights: await this.generateCrossInsights(financialData, hrData),
        alerts: this.generateAlerts(financialData, hrData),
        kpis: this.calculateCompanyKPIs(financialData, hrData)
      };

      return overview;
    } catch (error) {
      console.error('Error generating overview dashboard:', error);
      throw new Error('Errore nella generazione della dashboard overview');
    }
  }

  async generatePredictions(companyId, type = 'revenue', months = 6) {
    try {
      let predictions;

      switch (type) {
        case 'revenue':
          predictions = await this.financialService.getForecast(companyId, months);
          break;
        case 'expenses':
          predictions = await this.predictExpenses(companyId, months);
          break;
        case 'headcount':
          predictions = await this.predictHeadcount(companyId, months);
          break;
        case 'performance':
          predictions = await this.predictPerformance(companyId, months);
          break;
        default:
          throw new Error('Tipo di previsione non supportato');
      }

      return {
        type,
        period: months,
        predictions,
        confidence: predictions.confidence || 0.8,
        methodology: this.getMethodologyDescription(type),
        lastUpdated: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error generating predictions:', error);
      throw new Error('Errore nella generazione delle previsioni');
    }
  }

  async generateCustomReport(companyId, reportConfig) {
    try {
      const {
        title,
        sections,
        period,
        filters,
        format = 'json'
      } = reportConfig;

      const report = {
        title,
        generatedAt: new Date().toISOString(),
        period,
        filters,
        sections: {}
      };

      // Genera ogni sezione richiesta
      for (const section of sections) {
        switch (section) {
          case 'financial_summary':
            report.sections.financial = await this.generateFinancialSection(companyId, period, filters);
            break;
          case 'hr_summary':
            report.sections.hr = await this.generateHRSection(companyId, filters);
            break;
          case 'predictions':
            report.sections.predictions = await this.generatePredictionsSection(companyId, filters);
            break;
          case 'insights':
            report.sections.insights = await this.generateInsightsSection(companyId, period, filters);
            break;
          case 'recommendations':
            report.sections.recommendations = await this.generateRecommendationsSection(companyId, filters);
            break;
        }
      }

      // Genera executive summary
      report.executiveSummary = await this.generateExecutiveSummary(report.sections);

      return format === 'pdf' ? await this.convertToPDF(report) : report;
    } catch (error) {
      console.error('Error generating custom report:', error);
      throw new Error('Errore nella generazione del report personalizzato');
    }
  }

  async generateKPIAnalysis(companyId, kpiType, period = '12') {
    try {
      const analysis = {
        kpiType,
        period,
        current: {},
        historical: {},
        benchmarks: {},
        trends: {},
        insights: [],
        recommendations: []
      };

      switch (kpiType) {
        case 'financial':
          analysis.current = await this.getCurrentFinancialKPIs(companyId);
          analysis.historical = await this.getHistoricalFinancialKPIs(companyId, period);
          analysis.benchmarks = this.getIndustryBenchmarks('financial');
          break;
        case 'hr':
          analysis.current = await this.getCurrentHRKPIs(companyId);
          analysis.historical = await this.getHistoricalHRKPIs(companyId, period);
          analysis.benchmarks = this.getIndustryBenchmarks('hr');
          break;
        case 'operational':
          analysis.current = await this.getCurrentOperationalKPIs(companyId);
          analysis.historical = await this.getHistoricalOperationalKPIs(companyId, period);
          analysis.benchmarks = this.getIndustryBenchmarks('operational');
          break;
      }

      // Analizza trend
      analysis.trends = this.analyzeTrends(analysis.historical);
      
      // Genera insights
      analysis.insights = await this.generateKPIInsights(analysis);
      
      // Genera raccomandazioni
      analysis.recommendations = this.generateKPIRecommendations(analysis);

      return analysis;
    } catch (error) {
      console.error('Error generating KPI analysis:', error);
      throw new Error('Errore nell\'analisi dei KPI');
    }
  }

  // Metodi helper
  async generateCrossInsights(financialData, hrData) {
    const insights = [];

    // Correlazione performance-profitto
    const profitPerEmployee = financialData.summary.netProfit / hrData.summary.totalEmployees;
    if (profitPerEmployee > 50000) {
      insights.push({
        type: 'positive',
        category: 'productivity',
        title: 'Alta produttività per dipendente',
        description: `Profitto per dipendente: €${Math.round(profitPerEmployee).toLocaleString()}`,
        impact: 'high'
      });
    }

    // Correlazione crescita-assunzioni
    if (financialData.summary.revenueGrowth > 10 && hrData.summary.totalEmployees < 30) {
      insights.push({
        type: 'opportunity',
        category: 'scaling',
        title: 'Opportunità di crescita del team',
        description: 'La crescita dei ricavi suggerisce la necessità di nuove assunzioni',
        impact: 'medium'
      });
    }

    // Performance team vs risultati finanziari
    if (hrData.summary.avgPerformanceScore > 85 && financialData.summary.profitMargin > 25) {
      insights.push({
        type: 'positive',
        category: 'alignment',
        title: 'Eccellente allineamento team-risultati',
        description: 'Alta performance del team correlata a ottimi margini',
        impact: 'high'
      });
    }

    return insights;
  }

  generateAlerts(financialData, hrData) {
    const alerts = [];

    // Alert finanziari
    if (financialData.summary.profitMargin < 10) {
      alerts.push({
        type: 'warning',
        category: 'financial',
        title: 'Margine di profitto basso',
        description: 'Il margine di profitto è sotto il 10%',
        priority: 'high',
        action: 'Rivedi la struttura dei costi'
      });
    }

    // Alert HR
    if (hrData.summary.assessmentCoverage < 50) {
      alerts.push({
        type: 'info',
        category: 'hr',
        title: 'Bassa copertura valutazioni',
        description: 'Meno del 50% dei dipendenti ha completato le valutazioni',
        priority: 'medium',
        action: 'Pianifica sessioni di assessment'
      });
    }

    return alerts;
  }

  calculateCompanyKPIs(financialData, hrData) {
    return {
      revenuePerEmployee: Math.round(financialData.summary.totalRevenue / hrData.summary.totalEmployees),
      profitPerEmployee: Math.round(financialData.summary.netProfit / hrData.summary.totalEmployees),
      averagePerformance: hrData.summary.avgPerformanceScore,
      profitMargin: financialData.summary.profitMargin,
      revenueGrowth: financialData.summary.revenueGrowth,
      teamEfficiency: this.calculateTeamEfficiency(financialData, hrData)
    };
  }

  calculateTeamEfficiency(financialData, hrData) {
    const revenuePerEmployee = financialData.summary.totalRevenue / hrData.summary.totalEmployees;
    const performanceScore = hrData.summary.avgPerformanceScore;
    
    // Formula proprietaria per l'efficienza del team
    return Math.round((revenuePerEmployee / 1000) * (performanceScore / 100) * 10) / 10;
  }

  async predictExpenses(companyId, months) {
    // Implementazione predizione spese
    const historicalData = await this.financialService.getFinancialData(companyId, '24');
    const expensesTrend = this.analyzeTrend(historicalData.map(d => d.expenses));
    
    const predictions = [];
    const baseExpenses = historicalData[historicalData.length - 1].expenses;
    
    for (let i = 1; i <= months; i++) {
      const trendFactor = expensesTrend.direction === 'up' ? 1.02 : 
                          expensesTrend.direction === 'down' ? 0.98 : 1.0;
      const seasonalFactor = 1 + Math.sin((i / 12) * 2 * Math.PI) * 0.05;
      
      predictions.push({
        month: i,
        value: Math.round(baseExpenses * Math.pow(trendFactor, i) * seasonalFactor),
        confidence: Math.max(0.6, 0.9 - (i * 0.05))
      });
    }

    return { predictions, confidence: 0.8 };
  }

  async predictHeadcount(companyId, months) {
    // Implementazione predizione organico
    const currentEmployees = await this.hrService.getEmployees(companyId);
    const growthRate = 0.05; // 5% crescita mensile stimata
    
    const predictions = [];
    let currentCount = currentEmployees.length;
    
    for (let i = 1; i <= months; i++) {
      currentCount = Math.round(currentCount * (1 + growthRate));
      predictions.push({
        month: i,
        value: currentCount,
        confidence: Math.max(0.5, 0.8 - (i * 0.08))
      });
    }

    return { predictions, confidence: 0.7 };
  }

  getIndustryBenchmarks(category) {
    const benchmarks = {
      financial: {
        profitMargin: { excellent: 25, good: 15, average: 10, poor: 5 },
        revenueGrowth: { excellent: 20, good: 10, average: 5, poor: 0 },
        revenuePerEmployee: { excellent: 200000, good: 150000, average: 100000, poor: 50000 }
      },
      hr: {
        performanceScore: { excellent: 90, good: 80, average: 70, poor: 60 },
        assessmentCoverage: { excellent: 90, good: 75, average: 60, poor: 40 },
        retentionRate: { excellent: 95, good: 85, average: 75, poor: 65 }
      }
    };

    return benchmarks[category] || {};
  }

  analyzeTrend(values) {
    if (values.length < 2) return { direction: 'stable', strength: 0 };
    
    const firstHalf = values.slice(0, Math.floor(values.length / 2));
    const secondHalf = values.slice(Math.floor(values.length / 2));
    
    const firstAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;
    
    const change = (secondAvg - firstAvg) / firstAvg;
    
    return {
      direction: change > 0.05 ? 'up' : change < -0.05 ? 'down' : 'stable',
      strength: Math.abs(change),
      change: change * 100
    };
  }
}

module.exports = AnalyticsService;

