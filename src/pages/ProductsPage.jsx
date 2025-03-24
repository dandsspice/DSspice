import { useState } from 'react';
import { motion } from 'framer-motion';
import { products, categories } from '../data/productsData';
import ProductCard from '../components/products/ProductCard';
import ProductFilters from '../components/products/ProductFilters';
import Button from '../components/common/Button';
import BackButton from '../components/common/BackButton';

export default function ProductsPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [filters, setFilters] = useState({ size: 'all', sort: 'featured' });

  const filteredProducts = products
    .filter(product => 
      activeCategory === 'all' ? true : product.category === activeCategory
    )
    .sort((a, b) => {
      switch (filters.sort) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'newest':
          return new Date(b.createdAt) - new Date(a.createdAt);
        default:
          return 0;
      }
    });

  return (
    <div className="min-h-screen">
      {/* Navigation and Hero Section */}
      <div className="bg-background-alt">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <div className="pt-6">
            <BackButton />
          </div>

          {/* Hero Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-text-primary dark:text-dark-text-primary">
              Our Products
            </h1>
            <p className="text-lg text-text-secondary dark:text-dark-text-secondary max-w-2xl mx-auto">
              Discover our premium selection of authentic African locust beans,
              carefully processed and packaged for your culinary delight.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Enhanced Categories Section */}
        <div className="relative mb-8">
          {/* Scrollable Container */}
          <div className="flex overflow-x-auto gap-2 sm:gap-4 pb-4 no-scrollbar 
            snap-x snap-mandatory scroll-smooth
            before:shrink-0 before:w-[0px] sm:before:w-0
            after:shrink-0 after:w-[0px] sm:after:w-0"
          >
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={activeCategory === category.id ? 'primary' : 'secondary'}
                size="small"
                onClick={() => setActiveCategory(category.id)}
                className={`
                  shrink-0 snap-start
                  min-w-[170px] sm:min-w-fit
                  text-sm sm:text-base
                  px-4 py-2 sm:px-6
                  ${activeCategory === category.id 
                    ? 'shadow-md' 
                    : 'hover:shadow-sm'
                  }
                `}
              >
                {category.name}
              </Button>
            ))}
          </div>

          {/* Scroll Indicators */}
          <div className="absolute left-0 top-0 bottom-4 w-8 bg-gradient-to-r from-background to-transparent pointer-events-none sm:hidden" />
          <div className="absolute right-0 top-0 bottom-4 w-8 bg-gradient-to-l from-background to-transparent pointer-events-none sm:hidden" />
        </div>

        {/* Filters */}
        <div className="mb-8">
          <ProductFilters onFilterChange={setFilters} />
        </div>

        {/* Products Grid */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {filteredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </motion.div>

        {/* No Products Found */}
        {filteredProducts.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-lg text-text-secondary dark:text-dark-text-secondary">
              No products found in this category.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
} 