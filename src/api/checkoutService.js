import api from './axios';
import { cookies } from '../utils/cookies';

const checkoutService = {
  editPersonalInfo: async (personalInfo) => {
    try {
      // Create FormData object to match API requirements
      const formData = new FormData();
      formData.append('first_name', personalInfo.firstName);
      formData.append('last_name', personalInfo.lastName);
      formData.append('email', personalInfo.email);
      formData.append('phone_number', personalInfo.phone);

      const response = await api.post('/user/edit', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });

      // If successful, update the checkout information in cookies
      if (response.data.code === 200) {
        const savedSelection = cookies.getOrderSelection() || {};
        cookies.saveOrderSelection({
          ...savedSelection,
          personalInfo: {
            firstName: personalInfo.firstName,
            lastName: personalInfo.lastName,
            email: personalInfo.email,
            phone: personalInfo.phone
          }
        });
      }

      return response.data;
    } catch (error) {
      return error.response?.data || {
        code: 500,
        message: 'An error occurred while updating information',
        data: null,
        errors: ['Failed to update personal information']
      };
    }
  },

  // Add new shipping address method
  addShippingAddress: async (shippingInfo) => {
    try {
      const formData = new FormData();
      formData.append('address', shippingInfo.address);
      formData.append('city', shippingInfo.city);
      formData.append('zipcode', shippingInfo.zipcode);
      formData.append('country', shippingInfo.country);

      const response = await api.post('/shipping/add', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });

      // If successful, update the checkout information in cookies
      if (response.data.code === 200) {
        const savedSelection = cookies.getOrderSelection() || {};
        cookies.saveOrderSelection({
          ...savedSelection,
          shippingInfo: {
            address: shippingInfo.address,
            city: shippingInfo.city,
            zipcode: shippingInfo.zipcode,
            country: shippingInfo.country
          }
        });
      }

      return response.data;
    } catch (error) {
      return error.response?.data || {
        code: 500,
        message: 'An error occurred while saving shipping address',
        data: null,
        errors: ['Failed to save shipping address']
      };
    }
  }
};

export default checkoutService;
