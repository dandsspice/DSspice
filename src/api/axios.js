import axios from 'axios';
import { cookies } from '../utils/cookies';

// Always use relative URL for both development and production
const baseURL = '/api';

const api = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
});

// Add CORS preflight handling
api.interceptors.request.use(
  (config) => {
    // Handle preflight requests
    if (config.method === 'options') {
      config.headers['Access-Control-Allow-Origin'] = '*';
      config.headers['Access-Control-Allow-Methods'] = 'GET,PUT,POST,DELETE,PATCH,OPTIONS';
      config.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization';
    }

    const token = cookies.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response for handling errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Handle different error status codes
      switch (error.response.status) {
        case 401:
          cookies.clearAuth(); // Clear auth data on unauthorized
          break;
        case 403:
          // Handle forbidden access
          break;
        case 404:
          // Handle not found
          break;
        case 500:
          // Handle server error
          break;
        default:
          break;
      }
    }
    return Promise.reject(error);
  }
);

export default api;