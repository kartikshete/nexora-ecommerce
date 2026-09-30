import React from 'react';
import { CATEGORIES } from '../data/products';
import { Filter, X, RotateCcw, Star } from 'lucide-react';

export const FilterSidebar = ({
  selectedCategory,
  onCategoryChange,
  priceRange,
  onPriceChange,
  minRating,
  onRatingChange,
  inStockOnly,
  onStockChange,
  onResetFilters,
  isOpenMobile,
  onCloseMobile,
}) => {
  const content = (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-zinc-800">
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-gray-900 dark:text-white" />
          <h3 className="text-base font-bold text-gray-900 dark:text-white">Filters</h3>
        </div>
        <button
          onClick={onResetFilters}
          className="text-xs font-semibold text-gray-500 hover:text-black dark:hover:text-white flex items-center space-x-1 transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset All</span>
        </button>
      </div>

      {/* Categories Filter */}
      <div className="space-y-3">
        <h4 className="text-xs font-extrabold uppercase tracking-wider text-gray-400 dark:text-zinc-500">
          Categories
        </h4>
        <div className="space-y-1.5">
          <button
            onClick={() => onCategoryChange('all')}
            className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-colors flex items-center justify-between ${
              selectedCategory === 'all'
                ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 font-bold'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800'
            }`}
          >
            <span>All Categories</span>
          </button>
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onCategoryChange(cat.id)}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-colors flex items-center justify-between ${
                  isSelected
                    ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 font-bold'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800'
                }`}
              >
                <span>{cat.name}</span>
                <span className="text-[10px] opacity-60">({cat.count})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Price Range Filter */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-extrabold uppercase tracking-wider text-gray-400 dark:text-zinc-500">
            Max Price
          </h4>
          <span className="text-xs font-bold text-gray-900 dark:text-white">
            ${priceRange}
          </span>
        </div>
        <input
          type="range"
          min="50"
          max="1000"
          step="25"
          value={priceRange}
          onChange={(e) => onPriceChange(Number(e.target.value))}
          className="w-full h-1.5 bg-gray-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-black dark:accent-white"
        />
        <div className="flex justify-between text-[10px] text-gray-400">
          <span>$50</span>
          <span>$500</span>
          <span>$1000</span>
        </div>
      </div>

      {/* Minimum Rating Filter */}
      <div className="space-y-3">
        <h4 className="text-xs font-extrabold uppercase tracking-wider text-gray-400 dark:text-zinc-500">
          Minimum Rating
        </h4>
        <div className="space-y-1.5">
          {[
            { label: 'Any Rating', value: 0 },
            { label: '4.5 & Above', value: 4.5 },
            { label: '4.0 & Above', value: 4.0 },
          ].map((item) => (
            <button
              key={item.value}
              onClick={() => onRatingChange(item.value)}
              className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-colors flex items-center space-x-2 ${
                minRating === item.value
                  ? 'bg-gray-100 dark:bg-zinc-800 text-gray-900 dark:text-white font-bold border border-gray-300 dark:border-zinc-700'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-zinc-800/50'
              }`}
            >
              <Star className={`w-3.5 h-3.5 ${item.value > 0 ? 'fill-amber-400 text-amber-400' : 'text-gray-400'}`} />
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Stock Availability */}
      <div className="pt-2">
        <label className="flex items-center space-x-2.5 cursor-pointer text-xs font-medium text-gray-800 dark:text-gray-200">
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(e) => onStockChange(e.target.checked)}
            className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black dark:focus:ring-white accent-black dark:accent-white"
          />
          <span>In Stock Items Only</span>
        </label>
      </div>

    </div>
  );

  return (
    <>
      {/* Desktop Sticky Sidebar */}
      <div className="hidden lg:block w-64 flex-shrink-0 glass-panel rounded-3xl p-6 h-fit sticky top-28 border border-gray-200/80 dark:border-zinc-800">
        {content}
      </div>

      {/* Mobile Drawer Overlay */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop */}
          <div
            onClick={onCloseMobile}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
          />

          {/* Drawer Content */}
          <div className="relative ml-auto w-full max-w-xs bg-white dark:bg-zinc-950 h-full p-6 overflow-y-auto shadow-2xl z-10 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-gray-200 dark:border-zinc-800">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Filter Products</h3>
                <button
                  onClick={onCloseMobile}
                  className="p-1 rounded-full text-gray-400 hover:text-black dark:hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              {content}
            </div>

            <div className="pt-6 border-t border-gray-200 dark:border-zinc-800">
              <button
                onClick={onCloseMobile}
                className="w-full py-3 rounded-full bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 font-semibold text-xs shadow-md"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FilterSidebar;
