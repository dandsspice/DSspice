import { useState } from 'react';
import { motion } from 'framer-motion';
import { products, categories } from '../data/productsData';
import ProductCard from '../components/products/ProductCard';
import ProductFilters from '../components/products/ProductFilters';
import Button from '../components/common/Button';

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
    <div className="min-h-screen py-20">
      {/* Hero Section */}
      <div className="bg-background-alt py-16 mb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Our Products
            </h1>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">
              Discover our premium selection of authentic African locust beans,
              carefully processed and packaged for your culinary delight.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Enhanced Categories Section */}
        <div className="relative">
          {/* Scrollable Container */}
          <div className="flex overflow-x-auto gap-2 sm:gap-4 mb-8 pb-4 no-scrollbar 
            -mx-4 px-4 sm:mx-0 sm:px-0 
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
                  min-w-[120px] sm:min-w-fit
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
        <ProductFilters onFilterChange={setFilters} />

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
} 