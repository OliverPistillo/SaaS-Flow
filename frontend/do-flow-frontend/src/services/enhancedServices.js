import { apiService } from './enhancedApiService';

export const financialService = {
  // Transactions
  async getTransactions(filters = {}) {
    try {
      const response = await apiService.getTransactions(filters);
      return response.success ? response.data : [];
    } catch (error) {
      console.error('Error fetching transactions:', error);
      return [];
    }
  },

  async createTransaction(transactionData) {
    try {
      const response = await apiService.createTransaction(transactionData);
      return response;
    } catch (error) {
      console.error('Error creating transaction:', error);
      throw error;
    }
  },

  async updateTransaction(transactionId, transactionData) {
    try {
      const response = await apiService.updateTransaction(transactionId, transactionData);
      return response;
    } catch (error) {
      console.error('Error updating transaction:', error);
      throw error;
    }
  },

  async deleteTransaction(transactionId) {
    try {
      const response = await apiService.deleteTransaction(transactionId);
      return response;
    } catch (error) {
      console.error('Error deleting transaction:', error);
      throw error;
    }
  },

  // Accounts
  async getAccounts() {
    try {
      const response = await apiService.getAccounts();
      return response.success ? response.data : [];
    } catch (error) {
      console.error('Error fetching accounts:', error);
      // Return demo data as fallback
      return [
        { id: 'ACC-001', name: 'Main Bank Account', type: 'bank', balance: 25000.00 },
        { id: 'ACC-002', name: 'Cash Register', type: 'cash', balance: 2500.00 },
        { id: 'ACC-003', name: 'Business Card', type: 'card', balance: 5000.00 }
      ];
    }
  },

  async createAccount(accountData) {
    try {
      const response = await apiService.createAccount(accountData);
      return response;
    } catch (error) {
      console.error('Error creating account:', error);
      throw error;
    }
  },

  // Clients
  async getClients() {
    try {
      const response = await apiService.getClients();
      return response.success ? response.data : [];
    } catch (error) {
      console.error('Error fetching clients:', error);
      return [];
    }
  },

  async createClient(clientData) {
    try {
      const response = await apiService.createClient(clientData);
      return response;
    } catch (error) {
      console.error('Error creating client:', error);
      throw error;
    }
  },

  async getClient(clientId) {
    try {
      const response = await apiService.getClient(clientId);
      return response.success ? response.data : null;
    } catch (error) {
      console.error('Error fetching client:', error);
      return null;
    }
  },

  async updateClient(clientId, clientData) {
    try {
      const response = await apiService.updateClient(clientId, clientData);
      return response;
    } catch (error) {
      console.error('Error updating client:', error);
      throw error;
    }
  },

  // Analytics
  async getAnalyticsOverview() {
    try {
      const response = await apiService.getAnalyticsOverview();
      return response.success ? response.data : null;
    } catch (error) {
      console.error('Error fetching analytics overview:', error);
      // Return demo data as fallback
      return {
        summary: {
          totalIncome: 285000,
          totalExpenses: 195000,
          totalSavings: 90000,
          netProfit: 90000,
          profitMargin: 31.6
        },
        monthlyData: [],
        recentTransactions: []
      };
    }
  },

  async getReports(type = 'overview', period = 'yearly') {
    try {
      const response = await apiService.getReports(type, period);
      return response.success ? response.data : null;
    } catch (error) {
      console.error('Error fetching reports:', error);
      return null;
    }
  },

  // Demo data for development
  async getDemoData() {
    try {
      const response = await apiService.getDemoFinancialData();
      return response.success ? response.data : null;
    } catch (error) {
      console.error('Error fetching demo financial data:', error);
      return null;
    }
  }
};

export const hrService = {
  async getDemoData() {
    try {
      const response = await apiService.getDemoHRData();
      return response.success ? response.data : null;
    } catch (error) {
      console.error('Error fetching demo HR data:', error);
      return null;
    }
  }
};

export const analyticsService = {
  async getOverview() {
    return financialService.getAnalyticsOverview();
  },

  async getReports(type, period) {
    return financialService.getReports(type, period);
  },

  async getDemoData() {
    try {
      const response = await apiService.getDemoAnalytics();
      return response.success ? response.data : null;
    } catch (error) {
      console.error('Error fetching demo analytics data:', error);
      return null;
    }
  }
};

export const preferencesService = {
  async getUserPreferences(userId = 'default') {
    try {
      const response = await apiService.getUserPreferences(userId);
      return response.success ? response.data : null;
    } catch (error) {
      console.error('Error fetching user preferences:', error);
      // Return default preferences
      return {
        theme: 'light',
        language: 'it',
        currency: 'EUR',
        dateFormat: 'DD/MM/YYYY',
        notifications: {
          email: true,
          push: true,
          sms: false
        },
        rememberLogin: false
      };
    }
  },

  async updateUserPreferences(preferences) {
    try {
      const response = await apiService.updateUserPreferences(preferences);
      return response;
    } catch (error) {
      console.error('Error updating user preferences:', error);
      throw error;
    }
  }
};

