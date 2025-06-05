import api from './axios';

const orderService = {
  createOrder: async ({ productID, quantity, size_index, shipping_address, shipping_method, token }) => {
    try {
      const formData = new FormData();
      formData.append('productID', productID);
      formData.append('quantity', quantity.toString());
      formData.append('size_index', size_index.toString());
      formData.append('shipping_address', shipping_address);
      formData.append('shipping_method', shipping_method.toString());

      const response = await api.post('/freshorder/create', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      return {
        code: response.data.code,
        message: response.data.message,
        data: response.data.data,
        errors: response.data.errors
      };
    } catch (error) {
      return {
        code: error.response?.data?.code || 500,
        message: error.response?.data?.message || 'Error creating order',
        data: null,
        errors: error.response?.data?.errors || ['Failed to create order']
      };
    }
  },

  getOrder: async (orderId) => {
    try {
      const response = await api.get(`/orders/${orderId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error fetching order' };
    }
  },

  getProduct: async (productId) => {
    try {
      const response = await api.get(`/product/${productId}`);
      return response.data;
    } catch (error) {
      throw { message: 'Error fetching product' };
    }
  },

  getPaymentStatus: async (paymentId, token) => {
    try {
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
      return {
        code: error.response?.data?.code || 500,
        message: error.response?.data?.message || 'Error checking payment status',
        data: null,
        errors: error.response?.data?.errors || ['Failed to check payment status']
      };
    }
  },

  getOrders: async (token) => {
    try {
      const response = await api.get('/orders/get', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      // Always return an array
      const orders = Array.isArray(response.data.data?.orders)
        ? response.data.data.orders
        : [];

      return {
        code: response.data.code,
        message: response.data.message,
        data: orders,
        errors: response.data.errors
      };
    } catch (error) {
      return {
        code: error.response?.data?.code || 500,
        message: error.response?.data?.message || 'Error fetching orders',
        data: [],
        errors: error.response?.data?.errors || ['Failed to fetch orders']
      };
    }
  },

  getOrderDetails: async (orderId, token) => {
    try {
      const response = await api.get(`/orders/${orderId}`, {
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
      return {
        code: error.response?.data?.code || 500,
        message: error.response?.data?.message || 'Error fetching order details',
        data: null,
        errors: error.response?.data?.errors || ['Failed to fetch order details']
      };
    }
  },
};

export default orderService;




