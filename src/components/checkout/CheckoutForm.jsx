import { useState } from 'react';
import { motion } from 'framer-motion';
import Button from '../common/Button';
import { useCart } from '../../context/CartContext';

export default function CheckoutForm() {
  const { cartItems, cartTotal } = useCart();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Personal Information
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    
    // Shipping Information
    address: '',
    apartment: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    
    // Delivery Options
    shippingMethod: 'standard',
    
    // Payment Information
    cardName: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const inputClasses = "w-full px-4 py-3 rounded-lg border border-secondary/20 bg-background dark:bg-dark-background text-text-primary dark:text-dark-text-primary focus:outline-none focus:ring-2 focus:ring-accent/50";
  const labelClasses = "block text-sm font-medium text-text-primary dark:text-dark-text-primary mb-2";

  return (
    <div className="max-w-3xl mx-auto">
      {/* Progress Steps */}
      <div className="flex justify-between mb-8">
        {['Personal Info', 'Shipping', 'Payment'].map((label, index) => (
          <div key={label} className="flex items-center">
            <div className={`
              w-8 h-8 rounded-full flex items-center justify-center text-sm
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
            <h2 className="text-xl font-semibold mb-6">Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="firstName" className={labelClasses}>First Name</label>
              <input
                type="text"
                  id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                  className={inputClasses}
                  required
                />
              </div>
              <div>
                <label htmlFor="lastName" className={labelClasses}>Last Name</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className={inputClasses}
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className={labelClasses}>Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={inputClasses}
                  required
                />
              </div>
              <div>
                <label htmlFor="phone" className={labelClasses}>Phone</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={inputClasses}
                  required
                />
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold mb-6">Shipping Information</h2>
            <div className="space-y-6">
              <div>
                <label htmlFor="address" className={labelClasses}>Street Address</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className={inputClasses}
                  required
                />
              </div>
              <div>
                <label htmlFor="apartment" className={labelClasses}>Apartment, suite, etc. (optional)</label>
                <input
                  type="text"
                  id="apartment"
                  name="apartment"
                  value={formData.apartment}
                  onChange={handleInputChange}
                  className={inputClasses}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label htmlFor="city" className={labelClasses}>City</label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className={inputClasses}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="state" className={labelClasses}>State</label>
                  <input
                    type="text"
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    className={inputClasses}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="zipCode" className={labelClasses}>ZIP Code</label>
                  <input
                    type="text"
                    id="zipCode"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    className={inputClasses}
                    required
                  />
                </div>
            </div>
              <div>
                <label htmlFor="shippingMethod" className={labelClasses}>Shipping Method</label>
                <select
                  id="shippingMethod"
                  name="shippingMethod"
                  value={formData.shippingMethod}
                  onChange={handleInputChange}
                  className={inputClasses}
                  required
                >
                  <option value="standard">Standard Shipping (5-7 business days)</option>
                  <option value="express">Express Shipping (2-3 business days)</option>
                  <option value="overnight">Overnight Shipping (1 business day)</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold mb-6">Payment Information</h2>
            <div className="space-y-6">
              <div>
                <label htmlFor="cardName" className={labelClasses}>Name on Card</label>
                <input
                  type="text"
                  id="cardName"
                  name="cardName"
                  value={formData.cardName}
                  onChange={handleInputChange}
                  className={inputClasses}
                  required
                />
              </div>
              <div>
                <label htmlFor="cardNumber" className={labelClasses}>Card Number</label>
                <input
                  type="text"
                  id="cardNumber"
                  name="cardNumber"
                  value={formData.cardNumber}
                  onChange={handleInputChange}
                  className={inputClasses}
                  required
                  maxLength="16"
                />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label htmlFor="expiryDate" className={labelClasses}>Expiry Date</label>
                  <input
                    type="text"
                    id="expiryDate"
                    name="expiryDate"
                    placeholder="MM/YY"
                    value={formData.expiryDate}
                    onChange={handleInputChange}
                    className={inputClasses}
                    required
                    maxLength="5"
                  />
                </div>
                <div>
                  <label htmlFor="cvv" className={labelClasses}>CVV</label>
                  <input
                    type="text"
                    id="cvv"
                    name="cvv"
                    value={formData.cvv}
                    onChange={handleInputChange}
                    className={inputClasses}
                    required
                    maxLength="4"
                  />
                </div>
              </div>
            </div>
            </div>
        )}

        {/* Navigation Buttons */}
        <div className="mt-8 flex justify-between">
          {step > 1 && (
              <Button
                variant="outline"
              onClick={() => setStep(step - 1)}
              >
                Back
              </Button>
          )}
          <div className="ml-auto">
            {step < 3 ? (
              <Button
                variant="primary"
                onClick={() => setStep(step + 1)}
              >
                Continue
              </Button>
            ) : (
              <Button
                variant="primary"
                onClick={() => {/* Handle form submission */}}
              >
                Place Order
              </Button>
            )}
            </div>
          </div>
      </motion.div>
    </div>
  );
} 