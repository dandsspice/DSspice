import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '../components/common/Button';
import BackButton from '../components/common/BackButton';
import { fadeInUp, staggerContainer } from '../animations/variants';
import { PlusIcon, MinusIcon } from '@heroicons/react/24/outline';

export default function OrderPage() {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // Different pricing for powdered and non-powdered options
  const productTypes = {
    powdered: {
      name: 'Powdered Locust Beans',
      description: 'Finely ground for convenience and quick cooking',
      image: 'https://picsum.photos/seed/powdered/500/500',
      // Higher prices for powdered (processed) version
      sizes: [
        { id: 'small', name: 'Small', weight: '100g', price: 24.99 },
        { id: 'medium', name: 'Medium', weight: '250g', price: 49.99 },
        { id: 'large', name: 'Large', weight: '500g', price: 84.99 }
      ]
    },
    whole: {
      name: 'Whole Locust Beans',
      description: 'Traditional whole beans for authentic flavor and texture',
      image: 'https://picsum.photos/seed/whole/500/500',
      // Standard prices for whole (non-processed) version
      sizes: [
        { id: 'small', name: 'Small', weight: '100g', price: 19.99 },
        { id: 'medium', name: 'Medium', weight: '250g', price: 39.99 },
        { id: 'large', name: 'Large', weight: '500g', price: 69.99 }
      ]
    }
  };

  // Reset size selection when type changes
  useEffect(() => {
    setSelectedSize(null);
  }, [selectedType]);

  const handleQuantityChange = (value) => {
    const newQuantity = Math.max(1, Math.min(10, quantity + value));
    setQuantity(newQuantity);
  };

  const handleProceedToCheckout = () => {
    if (!selectedType || !selectedSize) return;
    
    setIsLoading(true);
    
    // Get the complete product info for checkout
    const productInfo = productTypes[selectedType];
    
    // Simulate a small delay for better UX
    setTimeout(() => {
      // Pass the selection data to checkout page through navigation state
      navigate('/checkout', { 
        state: { 
          type: selectedType,
          typeName: productInfo.name,
          size: selectedSize,
          quantity: quantity,
          totalPrice: selectedSize.price * quantity
        } 
      });
    }, 600);
  };

  // Helper function to render quantity selector
  const QuantitySelector = () => (
    <div className="flex items-center gap-4">
      <button
        onClick={() => handleQuantityChange(-1)}
        disabled={quantity <= 1}
        className={`p-2 rounded-full ${
          quantity <= 1 
            ? 'bg-secondary/10 text-text-secondary cursor-not-allowed' 
            : 'bg-background-alt dark:bg-dark-background-alt hover:bg-accent/10'
        }`}
      >
        <MinusIcon className="w-5 h-5" />
      </button>
      
      <span className="w-8 text-center text-xl font-medium">
        {quantity}
      </span>
      
      <button
        onClick={() => handleQuantityChange(1)}
        disabled={quantity >= 10}
        className={`p-2 rounded-full ${
          quantity >= 10 
            ? 'bg-secondary/10 text-text-secondary cursor-not-allowed' 
            : 'bg-background-alt dark:bg-dark-background-alt hover:bg-accent/10'
        }`}
      >
        <PlusIcon className="w-5 h-5" />
      </button>
    </div>
  );

  // Get the available sizes for the selected type
  const availableSizes = selectedType ? productTypes[selectedType].sizes : [];

  return (
    <div className="min-h-screen py-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="mb-6">
          <BackButton />
        </div>
        
        <motion.div
          initial="initial"
          animate="animate"
          variants={staggerContainer}
          className="space-y-12"
        >
          <motion.div 
            variants={fadeInUp}
            className="text-center"
          >
            <h1 className="text-3xl sm:text-4xl font-bold text-text-primary dark:text-dark-text-primary mb-4">
              Order Locust Beans
            </h1>
            <p className="text-text-secondary dark:text-dark-text-secondary">
              Select your preferred type and size of our premium locust beans.
            </p>
          </motion.div>
          
          {/* Type Selection with Images */}
          <motion.div variants={fadeInUp} className="space-y-6">
            <h2 className="text-xl font-semibold text-text-primary dark:text-dark-text-primary">
              1. Choose Type
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Powdered Option */}
              <div 
                onClick={() => setSelectedType('powdered')}
                className={`relative rounded-2xl overflow-hidden cursor-pointer transition-all ${
                  selectedType === 'powdered' 
                    ? 'ring-4 ring-accent' 
                    : 'hover:shadow-lg'
                }`}
              >
                <div className="aspect-square relative">
                  <img 
                    src={productTypes.powdered.image}
                    alt="Powdered Locust Beans" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6">
                    <div className="flex justify-between items-end mb-2">
                      <h3 className="text-xl font-bold text-white">Powdered</h3>
                      <span className="text-white bg-accent/80 px-2 py-1 rounded-full text-xs">
                        Premium
                      </span>
                    </div>
                    <p className="text-white/80 text-sm">
                      {productTypes.powdered.description}
                    </p>
                  </div>
                </div>
                <div className={`absolute top-4 right-4 w-6 h-6 rounded-full flex items-center justify-center ${
                  selectedType === 'powdered' 
                    ? 'bg-accent text-white' 
                    : 'bg-white/80'
                }`}>
                  {selectedType === 'powdered' && (
                    <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              </div>
              
              {/* Whole (Non-Powdered) Option */}
              <div 
                onClick={() => setSelectedType('whole')}
                className={`relative rounded-2xl overflow-hidden cursor-pointer transition-all ${
                  selectedType === 'whole' 
                    ? 'ring-4 ring-accent' 
                    : 'hover:shadow-lg'
                }`}
              >
                <div className="aspect-square relative">
                  <img 
                    src={productTypes.whole.image}
                    alt="Whole Locust Beans" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6">
                    <div className="flex justify-between items-end mb-2">
                      <h3 className="text-xl font-bold text-white">Whole (Non-Powdered)</h3>
                      <span className="text-white bg-secondary/80 px-2 py-1 rounded-full text-xs">
                        Traditional
                      </span>
                    </div>
                    <p className="text-white/80 text-sm">
                      {productTypes.whole.description}
                    </p>
                  </div>
                </div>
                <div className={`absolute top-4 right-4 w-6 h-6 rounded-full flex items-center justify-center ${
                  selectedType === 'whole' 
                    ? 'bg-accent text-white' 
                    : 'bg-white/80'
                }`}>
                  {selectedType === 'whole' && (
                    <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              </div>
            </div>
            
            {/* Price comparison notice */}
            {selectedType && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-4 p-4 rounded-lg bg-secondary/10 text-text-secondary dark:text-dark-text-secondary"
              >
                <p className="text-sm">
                  <span className="font-medium">Note:</span> {selectedType === 'powdered' 
                    ? "Powdered beans are slightly higher priced due to the additional grinding and processing involved, but offer greater convenience." 
                    : "Whole beans maintain the traditional texture and are more economical, perfect for traditional cooking methods."}
                </p>
              </motion.div>
            )}
          </motion.div>
          
          {/* Size Selection - only show if type is selected */}
          {selectedType && (
            <motion.div variants={fadeInUp} className="space-y-6">
              <h2 className="text-xl font-semibold text-text-primary dark:text-dark-text-primary">
                2. Choose Size
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {availableSizes.map((size) => (
                  <button
                    key={size.id}
                    onClick={() => setSelectedSize(size)}
                    className={`p-6 rounded-2xl text-center transition-all ${
                      selectedSize?.id === size.id 
                        ? 'bg-accent/20 border-2 border-accent' 
                        : 'bg-background-alt dark:bg-dark-background-alt border-2 border-transparent hover:border-accent/30'
                    }`}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        selectedSize?.id === size.id ? 'border-accent bg-accent' : 'border-secondary'
                      }`}>
                        {selectedSize?.id === size.id && (
                          <svg className="w-4 h-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                      <h3 className="text-lg font-medium">{size.name}</h3>
                      <p className="text-text-secondary dark:text-dark-text-secondary">
                        {size.weight}
                      </p>
                      <p className="text-accent font-bold mt-2">
                        ${size.price.toFixed(2)}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
          
          {/* Quantity Selection - only show if size is selected */}
          {selectedSize && (
            <motion.div variants={fadeInUp} className="space-y-6">
              <h2 className="text-xl font-semibold text-text-primary dark:text-dark-text-primary">
                3. Select Quantity
              </h2>
              <div className="flex flex-col sm:flex-row items-center justify-between p-6 rounded-2xl bg-background-alt dark:bg-dark-background-alt">
                <div className="mb-4 sm:mb-0">
                  <h3 className="text-lg font-medium mb-2">How many would you like?</h3>
                  <p className="text-text-secondary dark:text-dark-text-secondary">
                    Select between 1-10 packs
                  </p>
                </div>
                <QuantitySelector />
              </div>
              
              {/* Order Summary */}
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="p-6 rounded-2xl bg-accent/10 border border-accent/20"
              >
                <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Product:</span>
                    <span>{productTypes[selectedType].name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Size:</span>
                    <span>{selectedSize.weight}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Price per unit:</span>
                    <span>${selectedSize.price.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Quantity:</span>
                    <span>{quantity}</span>
                  </div>
                  <div className="flex justify-between font-bold pt-2 border-t border-accent/20">
                    <span>Subtotal:</span>
                    <span>${(selectedSize.price * quantity).toFixed(2)}</span>
                  </div>
                  <p className="text-xs text-text-secondary dark:text-dark-text-secondary mt-2">
                    *Shipping costs will be calculated at checkout
                  </p>
                </div>
              </motion.div>
            </motion.div>
          )}
          
          {/* Proceed Button */}
          <motion.div variants={fadeInUp} className="flex justify-center pt-6">
            <Button
              variant="primary"
              size="large"
              onClick={handleProceedToCheckout}
              disabled={!selectedType || !selectedSize || isLoading}
              isLoading={isLoading}
              className="min-w-[200px]"
            >
              Proceed to Checkout
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
} 