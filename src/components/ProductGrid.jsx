import React from 'react';
import ProductCard from './ProductCard';
import { PackageX, RefreshCw } from 'lucide-react';

export const ProductGrid = ({ products = [], onResetFilters, columns = 4 }) => {
  if (products.length === 0) {
    return (
      <div className="w-full py-16 px-4 text-center glass-panel rounded-3xl flex flex-col items-center justify-center space-y-4 my-8">
        <div className="p-4 rounded-full bg-gray-100 dark:bg-zinc-800 text-gray-400 dark:text-gray-500">
          <PackageX className="w-10 h-10" />
        </div>
        <div className="space-y-1 max-w-sm">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">No products found</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            We couldn't find any products matching your active filters or search terms.
          </p>
        </div>
        {onResetFilters && (
          <button
            onClick={onResetFilters}
            className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-full bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 text-xs font-semibold hover:opacity-90 transition-opacity"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Clear Filters</span>
          </button>
        )}
      </div>
    );
  }

  const gridColsClass =
    columns === 3
      ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
      : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';

  return (
    <div className={`grid ${gridColsClass} gap-6`}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default ProductGrid;
