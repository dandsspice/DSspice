import api from './axios';
import { cookies } from '../utils/cookies';

const authService = {
  login: async (email, password) => {
    try {
      // FormData object to match API requirements
      const formData = new FormData();
      formData.append('email', email);
      formData.append('password', password);

      const response = await api.post('/auth/login', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Check if login was successful and we have user data
      if (response.data.code === 200 && response.data.data?.token) {
        const { token, ...userData } = response.data.data;
        cookies.setAuth(token.token, userData);
      }
      return response.data;
    } catch (error) {
      // Return the error response in the same format as the API
      return error.response?.data || {
        code: 500,
        message: 'An error occurred during login',
        data: null,
        errors: null
      };
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

      // Api instance instead of full URL
      const response = await api.post('/auth/register', formData, {
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