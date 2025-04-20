import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../common/Button';
import { useNavigate, useLocation } from 'react-router-dom';
import authService from '../../api/authService';
import orderService from '../../api/orderService';

// Add these utility functions at the top of the file
const formatPhoneNumber = (value) => {
  const phone = value.replace(/\D/g, '');
  if (phone.length < 4) return phone;
  if (phone.length < 7) return `(${phone.slice(0, 3)}) ${phone.slice(3)}`;
  return `(${phone.slice(0, 3)}) ${phone.slice(3, 6)}-${phone.slice(6, 13)}`;
};

const formatCardNumber = (value) => {
  const card = value.replace(/\D/g, '');
  const parts = [];
  for (let i = 0; i < card.length; i += 4) {
    parts.push(card.slice(i, i + 4));
  }
  return parts.join(' ');
};

const formatExpiryDate = (value) => {
  const expiry = value.replace(/\D/g, '');
  if (expiry.length < 3) return expiry;
  return `${expiry.slice(0, 2)}/${expiry.slice(2, 4)}`;
};

export default function CheckoutForm({ orderData }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postcode: '',
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
    shippingMethod: 'RoyalMailTracked48',
    password: '',
    confirmPassword: '',
  });
  const [authMode, setAuthMode] = useState('login');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [errors, setErrors] = useState({});
  const [isEditingPersonalInfo, setIsEditingPersonalInfo] = useState(false);
  
  // Get order data from location state
  const order = location.state || orderData || {
    type: 'powdered',
    size: { id: 'medium', name: 'Medium', weight: '250g', price: 39.99 }
  };

  // Modify the existing useEffect to load user profile
  useEffect(() => {
    const loadUserData = async () => {
      if (authService.isAuthenticated()) {
        setIsAuthenticated(true);
        const response = await authService.getUserProfile();
        
        if (response.code === 200) {
          // Pre-fill form with user data
          setFormData(prev => ({
            ...prev,
            firstName: response.data.first_name || '',
            lastName: response.data.last_name || '',
            email: response.data.email || '',
            phone: response.data.phone_number || ''
          }));
        }
      }
    };

    loadUserData();
  }, []);

  // Add a function to get shipping cost based on selected method
  const getShippingCost = (method) => {
    const shippingCosts = {
      RoyalMailTracked48: 3.39,
      RoyalMailTracked24: 4.25,
      RoyalMailSigned1stClass: 5.49,
      RoyalMailTracked24Signed: 5.65
    };
    return shippingCosts[method] || 3.39;
  };

  const getTotalWithShipping = () => {
    const shippingCost = getShippingCost(formData.shippingMethod);
    return order.size.price + shippingCost;
  };

  // Validation rules
  const validateStep = (stepNumber) => {
    const newErrors = {};
    
    if (stepNumber === 1 && !isAuthenticated) {
      // Validate auth fields
      if (!formData.email.trim()) {
        newErrors.email = 'Email is required';
      }
      if (!formData.password.trim()) {
        newErrors.password = 'Password is required';
      }
      if (authMode === 'signup') {
        if (!formData.firstName.trim()) {
          newErrors.firstName = 'First name is required';
        }
        if (!formData.lastName.trim()) {
          newErrors.lastName = 'Last name is required';
        }
        if (!formData.phone.trim()) {
          newErrors.phone = 'Phone number is required';
        }
        if (!formData.confirmPassword.trim()) {
          newErrors.confirmPassword = 'Please confirm your password';
        } else if (formData.password !== formData.confirmPassword) {
          newErrors.confirmPassword = 'Passwords do not match';
        }
      }
    } else if (stepNumber === 3) {
      // Only check if fields are not empty
      if (!formData.cardName.trim()) {
        newErrors.cardName = 'Name on card is required';
      }
      if (!formData.cardNumber.trim()) {
        newErrors.cardNumber = 'Card number is required';
      }
      if (!formData.expiryDate.trim()) {
        newErrors.expiryDate = 'Expiry date is required';
      }
      if (!formData.cvv.trim()) {
        newErrors.cvv = 'CVV is required';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Enhanced input handling
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Handle different form field types
    if (name === 'phone') {
      setFormData({ ...formData, [name]: formatPhoneNumber(value) });
    } else if (name === 'cardNumber') {
      setFormData({ ...formData, [name]: formatCardNumber(value) });
    } else if (name === 'expiryDate') {
      setFormData({ ...formData, [name]: formatExpiryDate(value) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    }
  };

  const inputClasses = "w-full px-4 py-3 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent/50";
  const labelClasses = "block text-sm font-medium mb-2";
  const errorClasses = "text-red-500 text-sm mt-1";

  const getInputStyles = (fieldName) => `
    ${inputClasses}
    ${errors[fieldName] 
      ? 'border-red-500 bg-red-50 dark:bg-red-900/10' 
      : 'border-secondary/20 bg-background dark:bg-dark-background'}
    ${errors[fieldName] 
      ? 'text-red-600 dark:text-red-400' 
      : 'text-text-primary dark:text-dark-text-primary'}
  `;

  // Order Summary Component
  const OrderSummary = () => {
    const shippingCost = getShippingCost(formData.shippingMethod);
    const quantity = order.quantity || 1;
    const productPrice = order.size.price * quantity;
    const total = productPrice + shippingCost;
    
    return (
      <div className="bg-background-alt dark:bg-dark-background-alt p-6 rounded-2xl">
        <h3 className="text-lg font-semibold mb-4 text-text-primary dark:text-dark-text-primary">
          Order Summary
        </h3>
        <div className="space-y-4">
          <div className="flex justify-between pb-4 border-b border-secondary/10">
            <div className="space-y-1">
              <p className="font-medium">{order.typeName || `Premium Locust Beans (${order.type})`}</p>
              <p className="text-sm text-text-secondary dark:text-dark-text-secondary">
                {order.size.weight} × {quantity}
              </p>
            </div>
            <p className="font-medium">€{productPrice.toFixed(2)}</p>
          </div>
          
          <div className="flex justify-between pb-4 border-b border-secondary/10">
            <div className="space-y-1">
              <p>Shipping</p>
              <p className="text-sm text-text-secondary dark:text-dark-text-secondary">
                {formData.shippingMethod.replace(/([A-Z])/g, ' $1').trim()}
              </p>
            </div>
            <p>€{shippingCost.toFixed(2)}</p>
          </div>
          
          <div className="flex justify-between text-lg font-bold">
            <p>Total</p>
            <p>€{total.toFixed(2)}</p>
          </div>
        </div>
      </div>
    );
  };

  // Progress Steps Component
  const ProgressSteps = () => (
    <div className="flex justify-between mb-8">
      {['Personal Info', 'Shipping', 'Payment'].map((label, index) => (
        <div key={label} className="flex items-center">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ 
              scale: 1,
              backgroundColor: step > index + 1 
                ? 'var(--color-accent)' 
                : step === index + 1 
                ? 'var(--color-secondary)' 
                : 'var(--color-background-alt)'
            }}
            className={`
              w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium text-primary
              transition-colors duration-300
            `}
          >
            {index + 1}
          </motion.div>
          <span className="ml-2 hidden sm:inline">{label}</span>
          {index < 2 && (
            <div className="mx-4 flex-1 h-0.5 bg-secondary/20" />
          )}
        </div>
      ))}
    </div>
  );

  // Add success screen component
  const SuccessScreen = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center py-12 px-4"
    >
      <div className="mb-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="w-20 h-20 mx-auto bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center"
        >
          <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        </motion.div>
      </div>
      <h2 className="text-2xl font-bold mb-4 text-text-primary dark:text-dark-text-primary">
        Order Confirmed!
      </h2>
      <p className="text-text-secondary dark:text-dark-text-secondary mb-8">
        Thank you for your order. We've sent a confirmation email to {formData.email}
      </p>
      <div className="max-w-sm mx-auto bg-background-alt dark:bg-dark-background-alt rounded-lg p-6 mb-8">
        <h3 className="font-semibold mb-4">Order Summary</h3>
        <p className="text-sm mb-2">Order #: {Date.now().toString().slice(-8)}</p>
        <p className="text-sm">Estimated delivery: {new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()}</p>
      </div>
      <Button
        variant="primary"
        onClick={() => window.location.href = '/'}
        className="w-full sm:w-auto"
      >
        Return to Home
      </Button>
    </motion.div>
  );

  // loading overlay component
  const LoadingOverlay = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
    >
      <div className="bg-background dark:bg-dark-background rounded-lg p-8 flex flex-col items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mb-4"></div>
        <p className="text-text-primary dark:text-dark-text-primary">Processing your order...</p>
      </div>
    </motion.div>
  );

  // Form submission
  const handleSubmit = async () => {
    if (validateStep(3)) {
      setIsLoading(true);
      try {
        const orderData = {
          items: [{
            type: order.type,
            size: order.size,
            quantity: order.quantity || 1
          }],
          shipping: {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            phone: formData.phone,
            address: formData.address,
            city: formData.city,
            postcode: formData.postcode,
            method: formData.shippingMethod
          },
          payment: {
            cardName: formData.cardName,
            cardNumber: formData.cardNumber,
            expiryDate: formData.expiryDate,
            cvv: formData.cvv
          },
          total: getTotalWithShipping()
        };

        await orderService.createOrder(orderData);
        setIsComplete(true);
      } catch (error) {
        setErrors({ 
          submit: error.message || 'Failed to process order. Please try again.' 
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleAuth = async () => {
    setIsLoading(true);
    try {
      let response;
      if (authMode === 'login') {
        response = await authService.login(formData.email, formData.password);
      } else {
        response = await authService.signup({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          password: formData.password
        });
      }

      if (response.code === 200) {
        setIsAuthenticated(true);
        // Get fresh user profile data
        const userProfile = await authService.getUserProfile();
        if (userProfile.code === 200) {
          setFormData(prev => ({
            ...prev,
            firstName: userProfile.data.first_name || prev.firstName,
            lastName: userProfile.data.last_name || prev.lastName,
            email: userProfile.data.email || prev.email,
            phone: userProfile.data.phone_number || prev.phone
          }));
        }
        handleNext();
      } else {
        setErrors({
          auth: response.message || 'Authentication failed'
        });
      }
    } catch (error) {
      setErrors({
        auth: error.message || 'An error occurred during authentication'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    authService.logout();
    setIsAuthenticated(false);
    setStep(1);
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      postcode: '',
      cardNumber: '',
      cardName: '',
      expiryDate: '',
      cvv: '',
      shippingMethod: 'RoyalMailTracked48',
      password: '',
      confirmPassword: '',
    });
  };

  const loadUserProfile = async () => {
    const response = await authService.getUserProfile();
    
    if (response.code === 200) {
      // User data is available in response.data
      setFormData(prev => ({
        ...prev,
        firstName: response.data.first_name,
        lastName: response.data.last_name,
        email: response.data.email,
        phone: response.data.phone_number
      }));
    } else {
      // Handle error - user might not be logged in
      console.log(response.message);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4">
      {/* Logout button */}
      {isAuthenticated && (
        <div className="flex justify-end mb-6">
          <Button
            variant="outline"
            onClick={handleLogout}
            className="text-sm"
          >
            Logout
          </Button>
        </div>
      )}

      <AnimatePresence>
        {isLoading && <LoadingOverlay />}
      </AnimatePresence>

      {isComplete ? (
        <SuccessScreen />
      ) : (
        <>
          <ProgressSteps />
          
          <div className={`grid grid-cols-1 ${isAuthenticated ? 'lg:grid-cols-3' : 'lg:grid-cols-1 lg:max-w-2xl lg:mx-auto'} gap-8`}>
            <div className={isAuthenticated ? 'lg:col-span-2' : ''}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  className="bg-background dark:bg-dark-background rounded-lg p-6 shadow-lg"
                >
                  {/* Step 1: Personal Information */}
                  {step === 1 && (
                    !isAuthenticated ? (
                      <div className="space-y-6">
                        <h2 className="text-3xl text-center  font-bold mb-6">
                          {authMode === 'login' ? 'Login to Continue' : 'Create an Account'}
                        </h2>
                        
                        {authMode === 'signup' && (
                          <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div>
                                <label htmlFor="firstName" className={labelClasses}>First Name</label>
                                <input
                                  type="text"
                                  id="firstName"
                                  name="firstName"
                                  value={formData.firstName}
                                  onChange={handleInputChange}
                                  className={getInputStyles('firstName')}
                                  required
                                />
                                {errors.firstName && (
                                  <p className={errorClasses}>{errors.firstName}</p>
                                )}
                              </div>
                              <div>
                                <label htmlFor="lastName" className={labelClasses}>Last Name</label>
                                <input
                                  type="text"
                                  id="lastName"
                                  name="lastName"
                                  value={formData.lastName}
                                  onChange={handleInputChange}
                                  className={getInputStyles('lastName')}
                                  required
                                />
                                {errors.lastName && (
                                  <p className={errorClasses}>{errors.lastName}</p>
                                )}
                              </div>
                            </div>

                            {/* Phone number field */}
                            <div>
                              <label htmlFor="phone" className={labelClasses}>Phone Number</label>
                              <input
                                type="tel"
                                id="phone"
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                className={getInputStyles('phone')}
                                placeholder="+2341234567890"
                                required
                              />
                              {errors.phone && (
                                <p className={errorClasses}>{errors.phone}</p>
                              )}
                              <p className="text-sm text-text-secondary dark:text-dark-text-secondary mt-1">
                                Type your number after +234
                              </p>
                            </div>
                          </div>
                        )}
                        
                        <div>
                          <label htmlFor="email" className={labelClasses}>Email</label>
                          <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className={getInputStyles('email')}
                            required
                          />
                          {errors.email && (
                            <p className={errorClasses}>{errors.email}</p>
                          )}
                        </div>
                        
                        <div>
                          <label htmlFor="password" className={labelClasses}>Password</label>
                          <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            className={getInputStyles('password')}
                            required
                          />
                          {errors.password && (
                            <p className={errorClasses}>{errors.password}</p>
                          )}
                        </div>
                        
                        {authMode === 'signup' && (
                          <div>
                            <label htmlFor="confirmPassword" className={labelClasses}>Confirm Password</label>
                            <input
                              type="password"
                              id="confirmPassword"
                              name="confirmPassword"
                              value={formData.confirmPassword}
                              onChange={handleInputChange}
                              className={getInputStyles('confirmPassword')}
                              required
                            />
                            {errors.confirmPassword && (
                              <p className={errorClasses}>{errors.confirmPassword}</p>
                            )}
                          </div>
                        )}
                        
                        {errors.auth && (
                          <p className="text-red-500 text-sm mt-2">{errors.auth}</p>
                        )}
                        
                        <div className="flex flex-col space-y-4">
                          <Button
                            variant="primary"
                            onClick={handleAuth}
                            className="w-full"
                            disabled={isLoading}
                          >
                            {isLoading ? 'Processing...' : authMode === 'login' ? 'Login' : 'Create Account'}
                          </Button>
                          
                          <button
                            type="button"
                            onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}
                            className="text-sm text-accent hover:underline"
                          >
                            {authMode === 'login' 
                              ? "Don't have an account? Sign up" 
                              : 'Already have an account? Login'}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        <div className="flex justify-between items-center mb-6">
                          <h2 className="text-xl font-semibold">Personal Information</h2>
                          <Button
                            variant="outline"
                            onClick={() => setIsEditingPersonalInfo(!isEditingPersonalInfo)}
                            className="text-sm"
                          >
                            {isEditingPersonalInfo ? 'Save Changes' : 'Edit'}
                          </Button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label htmlFor="firstName" className={labelClasses}>First Name</label>
                            <input
                              type="text"
                              id="firstName"
                              name="firstName"
                              value={formData.firstName}
                              onChange={handleInputChange}
                              className={`${getInputStyles('firstName')} ${!isEditingPersonalInfo ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                              required
                              readOnly={!isEditingPersonalInfo}
                            />
                            {errors.firstName && (
                              <p className={errorClasses}>{errors.firstName}</p>
                            )}
                          </div>
                          <div>
                            <label htmlFor="lastName" className={labelClasses}>Last Name</label>
                            <input
                              type="text"
                              id="lastName"
                              name="lastName"
                              value={formData.lastName}
                              onChange={handleInputChange}
                              className={`${getInputStyles('lastName')} ${!isEditingPersonalInfo ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                              required
                              readOnly={!isEditingPersonalInfo}
                            />
                            {errors.lastName && (
                              <p className={errorClasses}>{errors.lastName}</p>
                            )}
                          </div>
                          <div>
                            <label htmlFor="email" className={labelClasses}>Email</label>
                            <input
                              type="email"
                              id="email"
                              name="email"
                              value={formData.email}
                              onChange={handleInputChange}
                              className={`${getInputStyles('email')} ${!isEditingPersonalInfo ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                              required
                              readOnly={!isEditingPersonalInfo}
                            />
                            {errors.email && (
                              <p className={errorClasses}>{errors.email}</p>
                            )}
                          </div>
                          <div>
                            <label htmlFor="phone" className={labelClasses}>Phone Number</label>
                            <input
                              type="tel"
                              id="phone"
                              name="phone"
                              value={formData.phone}
                              onChange={handleInputChange}
                              className={`${getInputStyles('phone')} ${!isEditingPersonalInfo ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                              placeholder="+2341234567890"
                              required
                              readOnly={!isEditingPersonalInfo}
                            />
                            {errors.phone && (
                              <p className={errorClasses}>{errors.phone}</p>
                            )}
                            <p className="text-sm text-text-secondary dark:text-dark-text-secondary mt-1">
                              Type your number after +234
                            </p>
                          </div>
                        </div>
                      </div>
                    )
                  )}

                  {/* Step 2: Shipping Information */}
                  {step === 2 && (
                    <div className="space-y-6">
                      <h2 className="text-xl font-semibold mb-6">Shipping Information</h2>
                      <div>
                        <label htmlFor="address" className={labelClasses}>Street Address</label>
                        <input
                          type="text"
                          id="address"
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          className={getInputStyles('address')}
                          required
                        />
                        {errors.address && (
                          <p className={errorClasses}>{errors.address}</p>
                        )}
                      </div>
                      <div>
                        <label htmlFor="city" className={labelClasses}>City</label>
                        <input
                          type="text"
                          id="city"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          className={getInputStyles('city')}
                          required
                        />
                        {errors.city && (
                          <p className={errorClasses}>{errors.city}</p>
                        )}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                          <label htmlFor="postcode" className={labelClasses}>ZIP Code</label>
                          <input
                            type="text"
                            id="postcode"
                            name="postcode"
                            value={formData.postcode}
                            onChange={handleInputChange}
                            className={getInputStyles('postcode')}
                            required
                          />
                          {errors.postcode && (
                            <p className={errorClasses}>{errors.postcode}</p>
                          )}
                        </div>
                      </div>
                      <div className="mb-6">
                        <label className="block text-sm font-medium mb-2 text-text-primary dark:text-dark-text-primary">
                          Shipping Method
                        </label>
                        <div className="mt-2 space-y-3">
                          <label className={`block relative p-4 border rounded-lg cursor-pointer transition-all ${
                            formData.shippingMethod === 'RoyalMailTracked48' 
                              ? 'border-accent bg-accent/5' 
                              : 'border-secondary/20 hover:border-accent/30'
                          }`}>
                            <input
                              type="radio"
                              name="shippingMethod"
                              value="RoyalMailTracked48"
                              checked={formData.shippingMethod === 'RoyalMailTracked48'}
                              onChange={handleInputChange}
                              className="sr-only"
                            />
                            <div className="flex justify-between items-center">
                              <div>
                                <span className="block font-medium">Royal Mail Tracked 48</span>
                                <span className="text-sm text-text-secondary dark:text-dark-text-secondary">
                                  Delivery within 2-3 working days with tracking updates
                                </span>
                              </div>
                              <span className="font-medium">€3.39</span>
                            </div>
                          </label>
                          
                          <label className={`block relative p-4 border rounded-lg cursor-pointer transition-all ${
                            formData.shippingMethod === 'RoyalMailTracked24' 
                              ? 'border-accent bg-accent/5' 
                              : 'border-secondary/20 hover:border-accent/30'
                          }`}>
                            <input
                              type="radio"
                              name="shippingMethod"
                              value="RoyalMailTracked24"
                              checked={formData.shippingMethod === 'RoyalMailTracked24'}
                              onChange={handleInputChange}
                              className="sr-only"
                            />
                            <div className="flex justify-between items-center">
                              <div>
                                <span className="block font-medium">Royal Mail Tracked 24</span>
                                <span className="text-sm text-text-secondary dark:text-dark-text-secondary">
                                  Super convenient next day delivery with notifications for the recipient
                                </span>
                              </div>
                              <span className="font-medium">€4.25</span>
                            </div>
                          </label>
                          
                          <label className={`block relative p-4 border rounded-lg cursor-pointer transition-all ${
                            formData.shippingMethod === 'RoyalMailSigned1stClass' 
                              ? 'border-accent bg-accent/5' 
                              : 'border-secondary/20 hover:border-accent/30'
                          }`}>
                            <input
                              type="radio"
                              name="shippingMethod"
                              value="RoyalMailSigned1stClass"
                              checked={formData.shippingMethod === 'RoyalMailSigned1stClass'}
                              onChange={handleInputChange}
                              className="sr-only"
                            />
                            <div className="flex justify-between items-center">
                              <div>
                                <span className="block font-medium">Royal Mail Signed 1st Class</span>
                                <span className="text-sm text-text-secondary dark:text-dark-text-secondary">
                                  Priority delivery with recipient signature confirmation
                                </span>
                              </div>
                              <span className="font-medium">€5.49</span>
                            </div>
                          </label>
                          
                          <label className={`block relative p-4 border rounded-lg cursor-pointer transition-all ${
                            formData.shippingMethod === 'RoyalMailTracked24Signed' 
                              ? 'border-accent bg-accent/5' 
                              : 'border-secondary/20 hover:border-accent/30'
                          }`}>
                            <input
                              type="radio"
                              name="shippingMethod"
                              value="RoyalMailTracked24Signed"
                              checked={formData.shippingMethod === 'RoyalMailTracked24Signed'}
                              onChange={handleInputChange}
                              className="sr-only"
                            />
                            <div className="flex justify-between items-center">
                              <div>
                                <span className="block font-medium">Royal Mail Tracked 24 Signed</span>
                                <span className="text-sm text-text-secondary dark:text-dark-text-secondary">
                                  Premium next day delivery with tracking and signature on delivery
                                </span>
                              </div>
                              <span className="font-medium">€5.65</span>
                            </div>
                          </label>
                        </div>
                        {errors.shippingMethod && (
                          <p className="mt-1 text-sm text-red-500">{errors.shippingMethod}</p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Step 3: Payment Information */}
                  {step === 3 && (
                    <div className="space-y-6">
                      <h2 className="text-xl font-semibold mb-6">Payment Information</h2>
                      <div>
                        <label htmlFor="cardName" className={labelClasses}>Name on Card</label>
                        <input
                          type="text"
                          id="cardName"
                          name="cardName"
                          value={formData.cardName}
                          onChange={handleInputChange}
                          className={getInputStyles('cardName')}
                          required
                        />
                        {errors.cardName && (
                          <p className={errorClasses}>{errors.cardName}</p>
                        )}
                      </div>
                      <div>
                        <label htmlFor="cardNumber" className={labelClasses}>Card Number</label>
                        <input
                          type="text"
                          id="cardNumber"
                          name="cardNumber"
                          value={formData.cardNumber}
                          onChange={handleInputChange}
                          className={getInputStyles('cardNumber')}
                          placeholder="1234 5678 9012 3456"
                          maxLength="19" // 16 digits + 3 spaces
                          required
                        />
                        {errors.cardNumber && (
                          <p className={errorClasses}>{errors.cardNumber}</p>
                        )}
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
                            className={getInputStyles('expiryDate')}
                            required
                            maxLength="5"
                          />
                          {errors.expiryDate && (
                            <p className={errorClasses}>{errors.expiryDate}</p>
                          )}
                        </div>
                        <div>
                          <label htmlFor="cvv" className={labelClasses}>CVV</label>
                          <input
                            type="text"
                            id="cvv"
                            name="cvv"
                            value={formData.cvv}
                            onChange={handleInputChange}
                            className={getInputStyles('cvv')}
                            required
                            maxLength="4"
                            placeholder="123"
                          />
                          {errors.cvv && (
                            <p className={errorClasses}>{errors.cvv}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Navigation Buttons */}
              <div className="mt-8 flex justify-between">
                {step > 1 && (
                  <Button
                    variant="outline"
                    onClick={() => setStep(step - 1)}
                    className="w-32"
                  >
                    Back
                  </Button>
                )}
                <div className="ml-auto">
                  {step === 1 && !isAuthenticated ? null : step < 3 ? (
                    <Button
                      variant="primary"
                      onClick={handleNext}
                      className="w-32"
                    >
                      Continue
                    </Button>
                  ) : (
                    <Button
                      variant="primary"
                      onClick={handleSubmit}
                      className="w-full"
                      disabled={isLoading}
                    >
                      {isLoading ? 'Processing...' : 'Place Order'}
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* Order Summary after authentication */}
            {isAuthenticated && (
            <div className="lg:col-span-1">
              <OrderSummary />
            </div>
            )}
          </div>
        </>
      )}
    </div>
  );
} 