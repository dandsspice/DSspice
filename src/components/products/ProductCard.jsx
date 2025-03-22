import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import Button from '../common/Button';
import QuickView from './QuickView';
import { EyeIcon, ShoppingCartIcon } from '@heroicons/react/24/outline';

export default function ProductCard({ product }) {
  const { darkMode } = useTheme();
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`rounded-2xl overflow-hidden shadow-lg ${
          darkMode ? 'bg-dark-background-alt' : 'bg-background-alt'
        }`}
      >
        <div className="relative group">
          <img
            src={product.imageSrc}
            alt={product.name}
            className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {product.badge && (
            <span className="absolute top-4 right-4 bg-accent text-white px-3 py-1 rounded-full text-sm font-medium">
              {product.badge}
            </span>
          )}
          
          {/* Quick View Button */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 backdrop-blur-sm">
            <Button
              variant="primary"
              size="small"
              onClick={() => setIsQuickViewOpen(true)}
              leftIcon={<EyeIcon className="w-5 h-5" />}
            >
              Quick View
            </Button>
          </div>
        </div>
        
        <div className="p-6">
          <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
          <p className="text-text-secondary mb-4">{product.shortDescription}</p>
          
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-accent">
              ${product.sizes[0].price}
            </span>
            <Button
              variant="primary"
              size="small"
              leftIcon={<ShoppingCartIcon className="w-5 h-5" />}
            >
              Add to Cart
            </Button>
          </div>
        </div>
      </motion.div>

      <QuickView
        product={product}
        isOpen={isQuickViewOpen}
        onClose={() => setIsQuickViewOpen(false)}
      />
    </>
  );
} 