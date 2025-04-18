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
        console.log('Login response token:', response.data.data.token); // Debug log
        const { token, ...userData } = response.data.data;
        cookies.setAuth(token.token, userData);
        console.log('Token stored in cookies:', cookies.getToken()); // Debug log
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

  logout: async () => {
    try {
      const token = cookies.getToken();
      console.log('Token before logout:', token); // Debug line
      
      const response = await api.get('/auth/logout', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log('Logout response:', response.data); // Debug line
      
      cookies.clearAuth();
      return response.data;
    } catch (error) {
      console.error('Logout error:', error); // Debug line
      cookies.clearAuth();
      return error.response?.data || {
        code: 500,
        message: 'An error occurred during logout',
        data: null,
        errors: null
      };
    }
  },

  getUserProfile: async () => {
    try {
      const token = cookies.getToken();
      console.log('Token from cookies:', token);
      
      if (!token) {
        console.log('No token found in cookies');
        return {
          code: 401,
          message: "No token passed",
          data: null,
          errors: null
        };
      }

      // Ensure token is properly formatted
      const formattedToken = token.trim();
      console.log('Formatted token:', formattedToken);

      const response = await api.get('/user/get', {
        headers: {
          'Authorization': `Bearer ${formattedToken}`
        }
      });
      
      console.log('API Response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error in getUserProfile:', error);
      console.error('Error response:', error.response);
      return error.response?.data || {
        code: 401,
        message: "No token passed",
        data: null,
        errors: null
      };
    }
  },

  getCurrentUser: () => {
    return cookies.getUserData();
  },

  isAuthenticated: () => {
    return !!cookies.getToken();
  }
};

export default authService;