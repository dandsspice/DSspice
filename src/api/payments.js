import api from './axios';

const paymentsService = {
  getPayments: async (token) => {
    try {
      const response = await api.get('/payments/get', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
     
      
      return {
        code: response.data.code,
        message: response.data.message,
        data: response.data.data || {
          next: null,
          payments: []
        },
        errors: response.data.errors
      };
    } catch (error) {
      console.error('Error in getPayments:', error);
      throw error;
    }
  },
  verifyPayment: async (paymentId, token) => {
    try {
      // Updated to match the exact endpoint from your curl example
      const response = await api.get(`/payment/status/${paymentId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      

      
      return {
        code: response.data.code,
        message: response.data.message,
        data: response.data.data,
        errors: response.data.errors
      };
    } catch (error) {
      console.error('Error in verifyPayment:', error);
      throw error;
    }
  }
};

export default paymentsService;