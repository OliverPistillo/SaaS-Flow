// Enhanced API Service with new endpoints
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://477h9ikc88qm.manus.space';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Add auth token if available
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Health check
  async healthCheck() {
    return this.request('/api/v1/health');
  }

  // Authentication
  async login(emailOrPhone, password) {
    return this.request('/api/v1/auth/login', {
      method: 'POST',
      body: JSON.stringify({ emailOrPhone, password }),
    });
  }

  async register(userData) {
    return this.request('/api/v1/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async logout() {
    return this.request('/api/v1/auth/logout', {
      method: 'POST',
    });
  }

  // Transactions
  async getTransactions(filters = {}) {
    const queryParams = new URLSearchParams(filters).toString();
    return this.request(`/api/v1/transactions?${queryParams}`);
  }

  async createTransaction(transactionData) {
    return this.request('/api/v1/transactions', {
      method: 'POST',
      body: JSON.stringify(transactionData),
    });
  }

  async updateTransaction(transactionId, transactionData) {
    return this.request(`/api/v1/transactions/${transactionId}`, {
      method: 'PUT',
      body: JSON.stringify(transactionData),
    });
  }

  async deleteTransaction(transactionId) {
    return this.request(`/api/v1/transactions/${transactionId}`, {
      method: 'DELETE',
    });
  }

  // Clients
  async getClients() {
    return this.request('/api/v1/clients');
  }

  async createClient(clientData) {
    return this.request('/api/v1/clients', {
      method: 'POST',
      body: JSON.stringify(clientData),
    });
  }

  async getClient(clientId) {
    return this.request(`/api/v1/clients/${clientId}`);
  }

  async updateClient(clientId, clientData) {
    return this.request(`/api/v1/clients/${clientId}`, {
      method: 'PUT',
      body: JSON.stringify(clientData),
    });
  }

  // Accounts
  async getAccounts() {
    return this.request('/api/v1/accounts');
  }

  async createAccount(accountData) {
    return this.request('/api/v1/accounts', {
      method: 'POST',
      body: JSON.stringify(accountData),
    });
  }

  // Analytics
  async getAnalyticsOverview() {
    return this.request('/api/v1/analytics/overview');
  }

  async getReports(type = 'overview', period = 'yearly') {
    return this.request(`/api/v1/analytics/reports?type=${type}&period=${period}`);
  }

  // User Preferences
  async getUserPreferences(userId = 'default') {
    return this.request(`/api/v1/preferences?userId=${userId}`);
  }

  async updateUserPreferences(preferences) {
    return this.request('/api/v1/preferences', {
      method: 'PUT',
      body: JSON.stringify(preferences),
    });
  }

  // Chat AI
  async sendChatMessage(message, sessionId = 'default', userId = 'user') {
    return this.request('/api/v1/chat/message', {
      method: 'POST',
      body: JSON.stringify({ message, sessionId, userId }),
    });
  }

  async getChatHistory(sessionId) {
    return this.request(`/api/v1/chat/history/${sessionId}`);
  }

  async getChatSessions() {
    return this.request('/api/v1/chat/sessions');
  }

  // Demo endpoints for development
  async getDemoFinancialData() {
    return this.request('/api/v1/demo/financial');
  }

  async getDemoHRData() {
    return this.request('/api/v1/demo/hr');
  }

  async getDemoAnalytics() {
    return this.request('/api/v1/demo/analytics');
  }
}

export const apiService = new ApiService();
export default apiService;

