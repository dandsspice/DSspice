import { motion } from 'framer-motion';
import CheckoutForm from '../components/checkout/CheckoutForm';
import BackButton from '../components/common/BackButton';

export default function CheckoutPage() {
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

        <CheckoutForm />
      </div>
    </div>
  );
} 