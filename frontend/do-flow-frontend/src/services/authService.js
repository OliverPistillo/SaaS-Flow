import { apiService } from './enhancedApiService';

export const authService = {
  async login(emailOrPhone, password) {
    try {
      const response = await apiService.login(emailOrPhone, password);
      
      if (response.success && response.data.token) {
        localStorage.setItem('authToken', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        return response.data;
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (error) {
      // Fallback for demo purposes
      if (emailOrPhone === 'demo@doflow.it' && password === 'demo123') {
        const demoUser = {
          id: 'demo-user-1',
          firstName: 'Demo',
          lastName: 'User',
          email: 'demo@doflow.it',
          company: 'Demo Company'
        };
        const demoToken = 'demo-token-' + Date.now();
        
        localStorage.setItem('authToken', demoToken);
        localStorage.setItem('user', JSON.stringify(demoUser));
        
        return { user: demoUser, token: demoToken };
      }
      throw error;
    }
  },

  async register(userData) {
    try {
      const response = await apiService.register(userData);
      
      if (response.success) {
        return response.data;
      } else {
        throw new Error(response.message || 'Registration failed');
      }
    } catch (error) {
      // Fallback for demo purposes
      const demoUser = {
        id: 'demo-user-' + Date.now(),
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.emailOrPhone,
        userName: userData.userName
      };
      
      return { user: demoUser };
    }
  },

  async logout() {
    try {
      await apiService.logout();
    } catch (error) {
      console.warn('Logout API call failed:', error);
    } finally {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
    }
  },

  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  getToken() {
    return localStorage.getItem('authToken');
  },

  isAuthenticated() {
    return !!this.getToken();
  }
};

