import api from './axios';
import { cookies } from '../utils/cookies';

const authService = {
  login: async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      if (response.data.token) {
        cookies.setAuth(response.data.token, response.data.user);
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'An error occurred during login' };
    }
  },

  signup: async (userData) => {
    try {
      const response = await api.post('https://api.dspice.co.uk/api/auth/register', userData);
      if (response.data.token) {
        cookies.setAuth(response.data.token, response.data.user);
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'An error occurred during signup' };
    }
  },

  logout: () => {
    cookies.clearAuth();
  },

  getCurrentUser: () => {
    return cookies.getUserData();
  },

  isAuthenticated: () => {
    return !!cookies.getToken();
  }
};

export default authService; 