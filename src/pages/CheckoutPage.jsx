import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import CheckoutForm from '../components/checkout/CheckoutForm';
import BackButton from '../components/common/BackButton';
import { cookies } from '../utils/cookies';

export default function CheckoutPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [orderData, setOrderData] = useState(null);
  
  useEffect(() => {
    // Get order data from either navigation state or cookies
    const data = location.state || cookies.getOrderSelection();
    
    if (!data) {
      // Redirect to order page if no selection found
      navigate('/order');
      return;
    }

    setOrderData(data);
  }, [location.state, navigate]);

  if (!orderData) {
    return null; // or a loading spinner
  }

  return (
    <div className="min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <BackButton />
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl sm:text-4xl font-bold text-text-primary dark:text-dark-text-primary">
            Checkout
          </h1>
        </motion.div>

        <CheckoutForm orderData={orderData} />
      </div>
    </div>
  );
} 