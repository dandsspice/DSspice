import { useState } from 'react';

export default function ProductFilters({ onFilterChange, availableSizes }) {
  const [selectedSize, setSelectedSize] = useState('all');
  const [selectedSort, setSelectedSort] = useState('featured');

  const handleSizeChange = (size) => {
    setSelectedSize(size);
    onFilterChange({ size, sort: selectedSort });
  };

  const handleSortChange = (sort) => {
    setSelectedSort(sort);
    onFilterChange({ size: selectedSize, sort });
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-8">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-text-primary dark:text-dark-text-primary">
          Size:
        </span>
        <select
          value={selectedSize}
          onChange={(e) => handleSizeChange(e.target.value)}
          className="rounded-lg border border-secondary/20 px-3 py-1.5 bg-background dark:bg-dark-background text-text-primary dark:text-dark-text-primary"
        >
          <option value="all">All Sizes</option>
          {availableSizes?.map(size => (
            <option key={size.id} value={size.id}>
              {size.name} ({size.weight})
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-text-primary dark:text-dark-text-primary">
          Sort by:
        </span>
        <select
          value={selectedSort}
          onChange={(e) => handleSortChange(e.target.value)}
          className="rounded-lg border border-secondary/20 px-3 py-1.5 bg-background dark:bg-dark-background text-text-primary dark:text-dark-text-primary"
        >
          <option value="featured">Featured</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
          <option value="newest">Newest</option>
        </select>
      </div>
    </div>
  );
} 