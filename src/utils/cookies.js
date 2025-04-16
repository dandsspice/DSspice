import Cookies from 'js-cookie';

const COOKIE_CONFIG = {
  expires: 7, // Cookie expires in 7 days
  secure: process.env.NODE_ENV === 'production', // Secure in production
  sameSite: 'strict'
};

export const AUTH_COOKIE_NAME = 'auth_token';
export const USER_COOKIE_NAME = 'user_data';

export const cookies = {
  // Set authentication data
  setAuth: (token, userData) => {
    Cookies.set(AUTH_COOKIE_NAME, token, COOKIE_CONFIG);
    Cookies.set(USER_COOKIE_NAME, JSON.stringify(userData), COOKIE_CONFIG);
  },

  // Get authentication token
  getToken: () => {
    return Cookies.get(AUTH_COOKIE_NAME);
  },

  // Get user data
  getUserData: () => {
    const userData = Cookies.get(USER_COOKIE_NAME);
    return userData ? JSON.parse(userData) : null;
  },

  // Clear authentication data
  clearAuth: () => {
    Cookies.remove(AUTH_COOKIE_NAME);
    Cookies.remove(USER_COOKIE_NAME);
  }
}; 