import api from './axios';
import { cookies } from '../utils/cookies';

const authService = {
  login: async (email, password) => {
    try {
      const response = await api.post('/auth/login', { 
        email, 
        password 
      });
      
      if (response.data.data?.token) {
        const { token, ...userData } = response.data.data;
        cookies.setAuth(token.token, userData);
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'An error occurred during login' };
    }
  },

  signup: async (userData) => {
    try {
      // FormData object to match API requirements
      const formData = new FormData();
      formData.append('first_name', userData.firstName);
      formData.append('last_name', userData.lastName);
      formData.append('email', userData.email);
      formData.append('phone_number', userData.phone);
      formData.append('password', userData.password);
      formData.append('confirm_password', userData.password);

      const response = await api.post('https://api.dspice.co.uk/api/auth/register', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.data?.token) {
        const { token, ...userData } = response.data.data;
        cookies.setAuth(token.token, userData);
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