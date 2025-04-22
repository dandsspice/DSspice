import api from './axios';

const orderService = {
  createOrder: async (orderData) => {
    try {
      // Create FormData object to match API requirements
      const formData = new FormData();
      formData.append('productID', orderData.productId);
      formData.append('quantity', orderData.quantity.toString());
      formData.append('size_index', orderData.sizeIndex.toString());
      formData.append('shipping_address', orderData.shippingAddress);
      formData.append('shipping_method', orderData.shippingMethod.toString());

      const response = await api.post('/order', formData);
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

};

export default orderService; 