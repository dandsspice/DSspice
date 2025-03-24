import { useState } from 'react';
import { motion } from 'framer-motion';
import Button from '../common/Button';

export default function CheckoutForm() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Shipping Information
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    // Delivery Options
    shippingMethod: 'standard',
    // Payment Information
    cardNumber: '',
    expiryDate: '',
    cvv: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Progress Steps */}
      <div className="flex justify-between mb-8">
        {['Shipping', 'Delivery', 'Payment'].map((label, index) => (
          <div
            key={label}
            className="flex items-center"
          >
            <div className={`
              flex items-center justify-center w-8 h-8 rounded-full
              ${step > index + 1 ? 'bg-accent text-white' :
                step === index + 1 ? 'bg-secondary text-primary' :
                'bg-background-alt text-text-secondary'}
            `}>
              {index + 1}
            </div>
            <div className={`
              ml-2 text-sm font-medium
              ${step === index + 1 ? 'text-text-primary dark:text-dark-text-primary' : 'text-text-secondary dark:text-dark-text-secondary'}
            `}>
              {label}
            </div>
            {index < 2 && (
              <div className="mx-4 flex-1 h-px bg-secondary/20" />
            )}
          </div>
        ))}
      </div>

      {/* Form Steps */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {step === 1 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-text-primary dark:text-dark-text-primary">
              Shipping Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-lg border border-secondary/20 bg-background dark:bg-dark-background"
              />
              {/* Add other shipping fields */}
            </div>
            <Button
              variant="primary"
              fullWidth
              onClick={() => setStep(2)}
            >
              Continue to Delivery
            </Button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-text-primary dark:text-dark-text-primary">
              Delivery Options
            </h2>
            <div className="space-y-4">
              {/* Delivery options */}
            </div>
            <div className="flex gap-4">
              <Button
                variant="outline"
                onClick={() => setStep(1)}
              >
                Back
              </Button>
              <Button
                variant="primary"
                onClick={() => setStep(3)}
              >
                Continue to Payment
              </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-text-primary dark:text-dark-text-primary">
              Payment Information
            </h2>
            <div className="space-y-4">
              {/* Payment fields */}
            </div>
            <div className="flex gap-4">
              <Button
                variant="outline"
                onClick={() => setStep(2)}
              >
                Back
              </Button>
              <Button
                variant="primary"
                onClick={() => {/* Handle payment */}}
              >
                Complete Order
              </Button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
} 