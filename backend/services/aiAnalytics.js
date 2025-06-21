class AIAnalyticsService {
  constructor() {
    this.models = {
      financial: new FinancialPredictionModel(),
      hr: new HRAssessmentModel(),
      insights: new InsightsGeneratorModel()
    };
  }

  // Financial AI Services
  async predictCashFlow(historicalData, months = 6) {
    try {
      const trends = this.analyzeFinancialTrends(historicalData);
      const seasonality = this.detectSeasonality(historicalData);
      const predictions = [];

      for (let i = 1; i <= months; i++) {
        const prediction = this.models.financial.predict({
          trends,
          seasonality,
          month: i,
          historicalData
        });
        predictions.push(prediction);
      }

      return {
        predictions,
        confidence: this.calculateConfidence(historicalData),
        insights: this.generateFinancialInsights(predictions, trends)
      };
    } catch (error) {
      console.error('Cash flow prediction error:', error);
      throw new Error('Errore nella previsione del flusso di cassa');
    }
  }

  async analyzeFinancialRisks(financialData) {
    const risks = [];
    
    // Analisi liquidità
    const liquidityRisk = this.assessLiquidityRisk(financialData);
    if (liquidityRisk.level > 0.3) {
      risks.push({
        type: 'liquidity',
        level: liquidityRisk.level,
        description: 'Rischio di liquidità elevato',
        recommendations: liquidityRisk.recommendations
      });
    }

    // Analisi margini
    const marginRisk = this.assessMarginRisk(financialData);
    if (marginRisk.level > 0.4) {
      risks.push({
        type: 'margin',
        level: marginRisk.level,
        description: 'Margini in diminuzione',
        recommendations: marginRisk.recommendations
      });
    }

    return {
      risks,
      overallRiskScore: this.calculateOverallRisk(risks),
      actionPlan: this.generateActionPlan(risks)
    };
  }

  // HR AI Services
  async generateAptitudeTest(role, difficulty = 'medium') {
    const testTemplates = {
      'developer': {
        logical: 40,
        analytical: 30,
        technical: 30
      },
      'manager': {
        leadership: 35,
        communication: 25,
        strategic: 25,
        analytical: 15
      },
      'sales': {
        communication: 40,
        persuasion: 30,
        resilience: 20,
        analytical: 10
      },
      'marketing': {
        creativity: 35,
        analytical: 25,
        communication: 25,
        strategic: 15
      }
    };

    const template = testTemplates[role.toLowerCase()] || testTemplates['manager'];
    const questions = await this.generateQuestions(template, difficulty);

    return {
      testId: this.generateTestId(),
      role,
      difficulty,
      questions,
      timeLimit: this.calculateTimeLimit(questions.length),
      scoringCriteria: this.generateScoringCriteria(template)
    };
  }

  async evaluateAssessment(answers, testConfig) {
    const scores = {};
    const categories = Object.keys(testConfig.scoringCriteria);

    for (const category of categories) {
      const categoryQuestions = testConfig.questions.filter(q => q.category === category);
      const categoryAnswers = answers.filter(a => 
        categoryQuestions.some(q => q.id === a.questionId)
      );

      scores[category] = this.calculateCategoryScore(categoryAnswers, categoryQuestions);
    }

    const overallScore = this.calculateOverallScore(scores, testConfig.scoringCriteria);
    const insights = this.generateHRInsights(scores, testConfig.role);

    return {
      scores,
      overallScore,
      insights,
      recommendations: this.generateHRRecommendations(scores, testConfig.role),
      strengths: this.identifyStrengths(scores),
      developmentAreas: this.identifyDevelopmentAreas(scores)
    };
  }

  async analyzeTeamDynamics(teamData) {
    const analysis = {
      diversity: this.analyzeDiversity(teamData),
      skillGaps: this.identifySkillGaps(teamData),
      collaboration: this.assessCollaboration(teamData),
      performance: this.analyzeTeamPerformance(teamData)
    };

    return {
      ...analysis,
      recommendations: this.generateTeamRecommendations(analysis),
      actionItems: this.generateTeamActionItems(analysis)
    };
  }

  // Analytics and Insights
  async generateBusinessInsights(companyData) {
    const insights = [];

    // Financial insights
    const financialInsights = await this.analyzeFinancialPerformance(companyData.financial);
    insights.push(...financialInsights);

    // HR insights
    const hrInsights = await this.analyzeHRPerformance(companyData.hr);
    insights.push(...hrInsights);

    // Cross-functional insights
    const crossInsights = await this.analyzeCrossFunctionalMetrics(companyData);
    insights.push(...crossInsights);

    return {
      insights: this.prioritizeInsights(insights),
      summary: this.generateExecutiveSummary(insights),
      actionPlan: this.generateStrategicActionPlan(insights)
    };
  }

  // Helper Methods
  analyzeFinancialTrends(data) {
    const trends = {};
    const metrics = ['revenue', 'expenses', 'profit'];

    for (const metric of metrics) {
      const values = data.map(d => d[metric]);
      trends[metric] = {
        direction: this.calculateTrendDirection(values),
        strength: this.calculateTrendStrength(values),
        volatility: this.calculateVolatility(values)
      };
    }

    return trends;
  }

  detectSeasonality(data) {
    if (data.length < 12) return null;

    const monthlyAverages = {};
    data.forEach(d => {
      const month = new Date(d.date).getMonth();
      if (!monthlyAverages[month]) monthlyAverages[month] = [];
      monthlyAverages[month].push(d.revenue);
    });

    const seasonalFactors = {};
    Object.keys(monthlyAverages).forEach(month => {
      const avg = monthlyAverages[month].reduce((a, b) => a + b, 0) / monthlyAverages[month].length;
      const overallAvg = data.reduce((sum, d) => sum + d.revenue, 0) / data.length;
      seasonalFactors[month] = avg / overallAvg;
    });

    return seasonalFactors;
  }

  generateQuestions(template, difficulty) {
    const questionBank = {
      logical: [
        {
          id: 'log_001',
          text: 'Se A > B e B > C, quale delle seguenti affermazioni è vera?',
          options: ['A < C', 'A > C', 'A = C', 'Non si può determinare'],
          correct: 1,
          difficulty: 'easy'
        }
        // Più domande...
      ],
      analytical: [
        {
          id: 'ana_001',
          text: 'Analizza il seguente grafico delle vendite e identifica il trend principale.',
          options: ['Crescita costante', 'Declino stagionale', 'Volatilità alta', 'Stabilità'],
          correct: 0,
          difficulty: 'medium'
        }
        // Più domande...
      ]
      // Altri tipi di domande...
    };

    const questions = [];
    Object.keys(template).forEach(category => {
      const percentage = template[category];
      const numQuestions = Math.round((percentage / 100) * 20); // 20 domande totali
      const categoryQuestions = questionBank[category] || [];
      
      const selectedQuestions = this.selectQuestionsByDifficulty(
        categoryQuestions, 
        numQuestions, 
        difficulty
      );
      
      questions.push(...selectedQuestions.map(q => ({ ...q, category })));
    });

    return this.shuffleArray(questions);
  }

  calculateCategoryScore(answers, questions) {
    let correct = 0;
    answers.forEach(answer => {
      const question = questions.find(q => q.id === answer.questionId);
      if (question && question.correct === answer.selectedOption) {
        correct++;
      }
    });

    return Math.round((correct / questions.length) * 100);
  }

  generateHRInsights(scores, role) {
    const insights = [];
    const roleRequirements = this.getRoleRequirements(role);

    Object.keys(scores).forEach(category => {
      const score = scores[category];
      const requirement = roleRequirements[category] || 70;

      if (score >= requirement + 10) {
        insights.push({
          type: 'strength',
          category,
          message: `Eccellente performance in ${category} (${score}%)`
        });
      } else if (score < requirement - 10) {
        insights.push({
          type: 'development',
          category,
          message: `Area di miglioramento in ${category} (${score}%)`
        });
      }
    });

    return insights;
  }

  // Utility methods
  calculateTrendDirection(values) {
    const firstHalf = values.slice(0, Math.floor(values.length / 2));
    const secondHalf = values.slice(Math.floor(values.length / 2));
    
    const firstAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;
    
    return secondAvg > firstAvg ? 'up' : secondAvg < firstAvg ? 'down' : 'stable';
  }

  calculateConfidence(data) {
    // Calcola la confidenza basata sulla quantità e qualità dei dati
    const dataQuality = data.length >= 12 ? 0.8 : data.length / 12 * 0.8;
    const consistency = this.calculateConsistency(data);
    return Math.min(dataQuality * consistency, 0.95);
  }

  shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  generateTestId() {
    return 'test_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }
}

// Modelli AI specifici
class FinancialPredictionModel {
  predict({ trends, seasonality, month, historicalData }) {
    const baseValue = this.calculateBaseValue(historicalData);
    const trendAdjustment = this.applyTrend(trends.revenue, month);
    const seasonalAdjustment = seasonality ? seasonality[month % 12] || 1 : 1;
    const randomFactor = 0.95 + Math.random() * 0.1; // ±5% variazione

    return {
      revenue: Math.round(baseValue * trendAdjustment * seasonalAdjustment * randomFactor),
      confidence: this.calculatePredictionConfidence(month),
      factors: {
        trend: trendAdjustment,
        seasonal: seasonalAdjustment,
        random: randomFactor
      }
    };
  }

  calculateBaseValue(data) {
    const recent = data.slice(-3); // Ultimi 3 mesi
    return recent.reduce((sum, d) => sum + d.revenue, 0) / recent.length;
  }

  applyTrend(trend, month) {
    const trendMultiplier = trend.direction === 'up' ? 1.02 : 
                           trend.direction === 'down' ? 0.98 : 1.0;
    return Math.pow(trendMultiplier, month);
  }

  calculatePredictionConfidence(month) {
    return Math.max(0.5, 0.9 - (month * 0.05)); // Diminuisce con la distanza
  }
}

class HRAssessmentModel {
  // Implementazione del modello di valutazione HR
}

class InsightsGeneratorModel {
  // Implementazione del generatore di insights
}

module.exports = {
  AIAnalyticsService,
  FinancialPredictionModel,
  HRAssessmentModel,
  InsightsGeneratorModel
};

