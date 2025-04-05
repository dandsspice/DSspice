import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '../components/common/Button';
import BackButton from '../components/common/BackButton';
import { fadeInUp, staggerContainer } from '../animations/variants';
import { PlusIcon, MinusIcon } from '@heroicons/react/24/outline';

export default function OrderPage() {
  const navigate = useNavigate();
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // Product information
  const product = {
    id: 'normal',
    name: 'Traditional Locust Beans',
    description: 'Authentic African locust beans, naturally fermented and carefully preserved for the ultimate taste experience. Perfect for soups, stews, and traditional African dishes.',
    sizes: [
      {
        id: 'small',
        name: 'Small',
        weight: '100g',
        price: 19.99,
        imageSrc: 'images/featureImg1.jpeg'
      },
      {
        id: 'medium',
        name: 'Medium',
        weight: '250g',
        price: 39.99,
        imageSrc: 'images/featureImg2.jpeg'
      },
      {
        id: 'large',
        name: 'Large',
        weight: '500g',
        price: 69.99,
        imageSrc: 'images/featureImg3.jpeg'
      }
    ]
  };

  const handleQuantityChange = (value) => {
    const newQuantity = Math.max(1, Math.min(10, quantity + value));
    setQuantity(newQuantity);
  };

  const handleProceedToCheckout = () => {
    if (!selectedSize) return;
    
    setIsLoading(true);
    
    // Simulate a small delay for better UX
    setTimeout(() => {
      window.scrollTo(0, 0);
      // Pass the selection data to checkout page through navigation state
      navigate('/checkout', { 
        state: { 
          type: product.id,
          typeName: product.name,
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
        className={`p-2 rounded-full €{
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
        className={`p-2 rounded-full €{
          quantity >= 10 
            ? 'bg-secondary/10 text-text-secondary cursor-not-allowed' 
            : 'bg-background-alt dark:bg-dark-background-alt hover:bg-accent/10'
        }`}
      >
        <PlusIcon className="w-5 h-5" />
      </button>
    </div>
  );

  // Get current image to display
  const currentImage = selectedSize ? selectedSize.imageSrc : product.sizes[0].imageSrc;

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
              Select your preferred size and quantity
            </p>
          </motion.div>
          
          {/* Product Card */}
          <motion.div
            variants={fadeInUp}
            className="overflow-hidden rounded-xl shadow-lg bg-background-alt dark:bg-dark-background-alt"
          >
            <div className="md:flex">
              <div className="md:w-2/5">
                <motion.img 
                  key={currentImage}
                  src={currentImage} 
                  alt={product.name} 
                  className="w-full h-64 md:h-full object-cover"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              
              <div className="p-6 md:w-3/5">
                <h2 className="text-2xl font-bold text-text-primary dark:text-dark-text-primary mb-2">
                  {product.name}
                </h2>
                
                <p className="text-text-secondary dark:text-dark-text-secondary mb-6">
                  {product.description}
                </p>
                
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3">Product Features:</h3>
                  <ul className="space-y-2">
                    <li className="flex items-center text-text-secondary dark:text-dark-text-secondary">
                      <span className="mr-2 text-accent">•</span> 100% Natural & Authentic
                    </li>
                    <li className="flex items-center text-text-secondary dark:text-dark-text-secondary">
                      <span className="mr-2 text-accent">•</span> Carefully fermented
                    </li>
                    <li className="flex items-center text-text-secondary dark:text-dark-text-secondary">
                      <span className="mr-2 text-accent">•</span> Rich, bold flavor
                    </li>
                    <li className="flex items-center text-text-secondary dark:text-dark-text-secondary">
                      <span className="mr-2 text-accent">•</span> No preservatives or additives
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
          
          {/* Size Selection */}
          <motion.div variants={fadeInUp} className="space-y-6">
            <h2 className="text-xl font-semibold text-text-primary dark:text-dark-text-primary">
              1. Choose Size
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {product.sizes.map((size) => (
                <button
                key={size.id}
                onClick={() => setSelectedSize(size)}
              className={`p-4 rounded-xl text-center transition-all €{
                  selectedSize?.id === size.id 
                    ? 'bg-accent/20 border-2 border-accent' 
                    : 'bg-background-alt dark:bg-dark-background-alt border-2 border-transparent hover:border-accent/30'
                }`}
              >
              <div className="flex flex-row sm:flex-col items-center sm:items-center justify-between sm:justify-center sm:gap-2">
                <div className="flex items-center gap-2">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center €{
                    selectedSize?.id === size.id ? 'border-accent bg-accent' : 'border-secondary'
                  }`}>
                    {selectedSize?.id === size.id && (
                      <svg className="w-3 h-3 text-text-primary dark:text-dark-text-primary" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <div className="text-left sm:text-center">
                    <h3 className="text-base font-medium">{size.name}</h3>
                    <p className="text-sm text-text-secondary dark:text-dark-text-secondary">
                    {size.weight}
                  </p>
                  </div>
                </div>
                <p className="text-accent font-bold">
                    €{size.price.toFixed(2)}
                  </p>
                </div>
              </button>
              ))}
            </div>
          </motion.div>
          
          {/* Quantity Selection - only show if size is selected */}
          {selectedSize && (
            <motion.div variants={fadeInUp} className="space-y-6">
              <h2 className="text-xl font-semibold text-text-primary dark:text-dark-text-primary">
                2. Select Quantity
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
                    <span>{product.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Size:</span>
                    <span>{selectedSize.weight}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Price per unit:</span>
                    <span>€{selectedSize.price.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Quantity:</span>
                    <span>{quantity}</span>
                  </div>
                  <div className="flex justify-between font-bold pt-2 border-t border-accent/20">
                    <span>Subtotal:</span>
                    <span>€{(selectedSize.price * quantity).toFixed(2)}</span>
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
              disabled={!selectedSize || isLoading}
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