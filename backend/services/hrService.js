const { AIAnalyticsService } = require('./aiAnalytics');

class HRService {
  constructor() {
    this.aiService = new AIAnalyticsService();
  }

  async generateDashboardData(companyId) {
    try {
      const employees = await this.getEmployees(companyId);
      const assessments = await this.getAssessments(companyId);
      
      const dashboard = {
        summary: {
          totalEmployees: employees.length,
          assessedEmployees: assessments.length,
          assessmentCoverage: (assessments.length / employees.length) * 100,
          avgPerformanceScore: this.calculateAverageScore(assessments)
        },
        departmentBreakdown: this.analyzeDepartments(employees),
        performanceTrends: this.analyzePerformanceTrends(assessments),
        skillGaps: await this.identifySkillGaps(employees, assessments),
        teamInsights: await this.aiService.analyzeTeamDynamics({
          employees,
          assessments
        })
      };

      return dashboard;
    } catch (error) {
      console.error('Error generating HR dashboard:', error);
      throw new Error('Errore nella generazione della dashboard HR');
    }
  }

  async createAptitudeTest(role, difficulty = 'medium', customizations = {}) {
    try {
      const test = await this.aiService.generateAptitudeTest(role, difficulty);
      
      // Applica personalizzazioni se presenti
      if (customizations.focusAreas) {
        test.questions = this.customizeQuestions(test.questions, customizations.focusAreas);
      }

      // Salva il test nel database (simulato)
      const testId = await this.saveTest(test);
      
      return {
        ...test,
        id: testId,
        createdAt: new Date().toISOString(),
        status: 'active'
      };
    } catch (error) {
      console.error('Error creating aptitude test:', error);
      throw new Error('Errore nella creazione del test attitudinale');
    }
  }

  async evaluateTestResults(testId, answers, candidateInfo) {
    try {
      const test = await this.getTest(testId);
      const evaluation = await this.aiService.evaluateAssessment(answers, test);
      
      const result = {
        testId,
        candidateInfo,
        evaluation,
        completedAt: new Date().toISOString(),
        recommendations: this.generateHiringRecommendations(evaluation, test.role),
        fitScore: this.calculateRoleFit(evaluation, test.role)
      };

      // Salva i risultati
      await this.saveTestResults(result);
      
      return result;
    } catch (error) {
      console.error('Error evaluating test results:', error);
      throw new Error('Errore nella valutazione del test');
    }
  }

  async generateTeamReport(companyId, department = null) {
    try {
      const employees = await this.getEmployees(companyId, department);
      const assessments = await this.getAssessments(companyId, department);
      
      const report = {
        department: department || 'Tutta l\'azienda',
        period: this.getCurrentPeriod(),
        teamComposition: this.analyzeTeamComposition(employees),
        performanceAnalysis: this.analyzeTeamPerformance(assessments),
        skillMatrix: this.generateSkillMatrix(employees, assessments),
        developmentPlan: await this.generateDevelopmentPlan(employees, assessments),
        insights: await this.aiService.generateBusinessInsights({ hr: { employees, assessments } })
      };

      return report;
    } catch (error) {
      console.error('Error generating team report:', error);
      throw new Error('Errore nella generazione del report team');
    }
  }

  async getPersonalizedInsights(employeeId) {
    try {
      const employee = await this.getEmployee(employeeId);
      const assessments = await this.getEmployeeAssessments(employeeId);
      const teamData = await this.getTeamData(employee.department);

      const insights = {
        strengths: this.identifyStrengths(assessments),
        developmentAreas: this.identifyDevelopmentAreas(assessments),
        careerPath: this.suggestCareerPath(employee, assessments),
        learningRecommendations: this.generateLearningRecommendations(assessments),
        teamFit: this.analyzeTeamFit(employee, teamData),
        performanceTrend: this.analyzePerformanceTrend(assessments)
      };

      return insights;
    } catch (error) {
      console.error('Error generating personalized insights:', error);
      throw new Error('Errore nella generazione degli insights personalizzati');
    }
  }

  // Metodi helper
  async getEmployees(companyId, department = null) {
    // Simula dati dipendenti per demo
    const employees = [
      {
        id: 1,
        firstName: 'Marco',
        lastName: 'Rossi',
        email: 'marco.rossi@company.com',
        department: 'IT',
        role: 'Developer',
        hireDate: '2022-01-15',
        level: 'Senior'
      },
      {
        id: 2,
        firstName: 'Laura',
        lastName: 'Bianchi',
        email: 'laura.bianchi@company.com',
        department: 'Marketing',
        role: 'Marketing Manager',
        hireDate: '2021-06-10',
        level: 'Manager'
      },
      {
        id: 3,
        firstName: 'Giuseppe',
        lastName: 'Verdi',
        email: 'giuseppe.verdi@company.com',
        department: 'Sales',
        role: 'Sales Representative',
        hireDate: '2023-03-20',
        level: 'Junior'
      },
      {
        id: 4,
        firstName: 'Anna',
        lastName: 'Neri',
        email: 'anna.neri@company.com',
        department: 'HR',
        role: 'HR Specialist',
        hireDate: '2022-09-05',
        level: 'Mid'
      }
    ];

    return department ? employees.filter(e => e.department === department) : employees;
  }

  async getAssessments(companyId, department = null) {
    // Simula dati valutazioni per demo
    const assessments = [
      {
        id: 1,
        employeeId: 1,
        testType: 'aptitude',
        role: 'developer',
        scores: {
          logical: 88,
          analytical: 85,
          technical: 92
        },
        overallScore: 88,
        completedAt: '2024-05-15'
      },
      {
        id: 2,
        employeeId: 2,
        testType: 'aptitude',
        role: 'manager',
        scores: {
          leadership: 90,
          communication: 87,
          strategic: 82,
          analytical: 78
        },
        overallScore: 84,
        completedAt: '2024-05-10'
      }
    ];

    if (department) {
      const employees = await this.getEmployees(companyId, department);
      const employeeIds = employees.map(e => e.id);
      return assessments.filter(a => employeeIds.includes(a.employeeId));
    }

    return assessments;
  }

  calculateAverageScore(assessments) {
    if (assessments.length === 0) return 0;
    const total = assessments.reduce((sum, a) => sum + a.overallScore, 0);
    return Math.round(total / assessments.length * 10) / 10;
  }

  analyzeDepartments(employees) {
    const departments = {};
    
    employees.forEach(emp => {
      if (!departments[emp.department]) {
        departments[emp.department] = {
          name: emp.department,
          count: 0,
          levels: {}
        };
      }
      
      departments[emp.department].count++;
      
      if (!departments[emp.department].levels[emp.level]) {
        departments[emp.department].levels[emp.level] = 0;
      }
      departments[emp.department].levels[emp.level]++;
    });

    return Object.values(departments);
  }

  analyzePerformanceTrends(assessments) {
    // Analizza i trend di performance nel tempo
    const trends = {};
    
    assessments.forEach(assessment => {
      const month = new Date(assessment.completedAt).getMonth();
      if (!trends[month]) {
        trends[month] = {
          month,
          scores: [],
          average: 0
        };
      }
      trends[month].scores.push(assessment.overallScore);
    });

    Object.values(trends).forEach(trend => {
      trend.average = trend.scores.reduce((a, b) => a + b, 0) / trend.scores.length;
    });

    return Object.values(trends);
  }

  async identifySkillGaps(employees, assessments) {
    const skillGaps = [];
    const departmentSkills = {
      'IT': ['technical', 'logical', 'analytical'],
      'Marketing': ['creativity', 'analytical', 'communication'],
      'Sales': ['communication', 'persuasion', 'resilience'],
      'HR': ['communication', 'empathy', 'analytical']
    };

    Object.keys(departmentSkills).forEach(dept => {
      const deptEmployees = employees.filter(e => e.department === dept);
      const deptAssessments = assessments.filter(a => 
        deptEmployees.some(e => e.id === a.employeeId)
      );

      departmentSkills[dept].forEach(skill => {
        const scores = deptAssessments
          .map(a => a.scores[skill])
          .filter(score => score !== undefined);
        
        if (scores.length > 0) {
          const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;
          if (avgScore < 75) {
            skillGaps.push({
              department: dept,
              skill,
              currentLevel: avgScore,
              targetLevel: 80,
              gap: 80 - avgScore,
              priority: avgScore < 60 ? 'high' : 'medium'
            });
          }
        }
      });
    });

    return skillGaps;
  }

  generateHiringRecommendations(evaluation, role) {
    const recommendations = [];
    const threshold = this.getRoleThreshold(role);

    if (evaluation.overallScore >= threshold + 10) {
      recommendations.push({
        type: 'hire',
        confidence: 'high',
        message: 'Candidato eccellente, raccomandato per l\'assunzione'
      });
    } else if (evaluation.overallScore >= threshold) {
      recommendations.push({
        type: 'consider',
        confidence: 'medium',
        message: 'Candidato valido, da considerare per l\'assunzione'
      });
    } else {
      recommendations.push({
        type: 'reject',
        confidence: 'high',
        message: 'Candidato non idoneo per il ruolo richiesto'
      });
    }

    return recommendations;
  }

  getRoleThreshold(role) {
    const thresholds = {
      'developer': 75,
      'manager': 80,
      'sales': 70,
      'marketing': 75,
      'hr': 78
    };
    return thresholds[role.toLowerCase()] || 75;
  }

  calculateRoleFit(evaluation, role) {
    const roleWeights = {
      'developer': { technical: 0.4, logical: 0.3, analytical: 0.3 },
      'manager': { leadership: 0.35, communication: 0.25, strategic: 0.25, analytical: 0.15 },
      'sales': { communication: 0.4, persuasion: 0.3, resilience: 0.2, analytical: 0.1 }
    };

    const weights = roleWeights[role.toLowerCase()] || {};
    let weightedScore = 0;
    let totalWeight = 0;

    Object.keys(weights).forEach(skill => {
      if (evaluation.scores[skill] !== undefined) {
        weightedScore += evaluation.scores[skill] * weights[skill];
        totalWeight += weights[skill];
      }
    });

    return totalWeight > 0 ? Math.round(weightedScore / totalWeight) : evaluation.overallScore;
  }
}

module.exports = HRService;

