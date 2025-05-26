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
        }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error creating order' };
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
      // Use the full API URL
      const response = await api.get(`/product/${productId}`);
return response.data;
     
    } catch (error) {
      throw { message: 'Error fetching product' };
    }
  },
};

export default orderService; 




