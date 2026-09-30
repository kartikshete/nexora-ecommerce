import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import FilterSidebar from '../components/FilterSidebar';
import ProductGrid from '../components/ProductGrid';
import { PRODUCTS, CATEGORIES } from '../data/products';
import { useShop } from '../hooks/useShop';
import { Filter, ArrowUpDown, X, SlidersHorizontal } from 'lucide-react';

export const Products = () => {
  const { searchQuery, setSearchQuery, selectedCategory, setSelectedCategory, wishlist } = useShop();
  const [searchParams] = useSearchParams();

  // Filter state
  const [priceRange, setPriceRange] = useState(1000);
  const [minRating, setMinRating] = useState(0);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState('featured');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Sync URL query params on initial load if present (e.g. ?filter=deals, ?filter=featured, ?wishlist=true)
  useEffect(() => {
    const filterParam = searchParams.get('filter');
    const wishlistParam = searchParams.get('wishlist');

    if (filterParam === 'deals') {
      setSortBy('discount');
    } else if (filterParam === 'featured') {
      setSortBy('featured');
    } else if (filterParam === 'trending') {
      setSortBy('popularity');
    }

    if (wishlistParam === 'true') {
      // Show wishlisted items mode
    }
  }, [searchParams]);

  const showOnlyWishlist = searchParams.get('wishlist') === 'true';

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((product) => {
      // Wishlist filter
      if (showOnlyWishlist && !wishlist.includes(product.id)) {
        return false;
      }

      // Search Query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = product.name.toLowerCase().includes(query);
        const matchesBrand = product.brand.toLowerCase().includes(query);
        const matchesCategory = product.category.toLowerCase().includes(query);
        if (!matchesName && !matchesBrand && !matchesCategory) return false;
      }

      // Category
      if (selectedCategory !== 'all' && product.category !== selectedCategory) {
        return false;
      }

      // Price Range
      if (product.price > priceRange) {
        return false;
      }

      // Rating
      if (minRating > 0 && product.rating < minRating) {
        return false;
      }

      // Stock
      if (inStockOnly && !product.inStock) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        case 'popularity':
          return b.reviewsCount - a.reviewsCount;
        case 'discount':
          return b.discount - a.discount;
        case 'featured':
        default:
          return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
      }
    });
  }, [searchQuery, selectedCategory, priceRange, minRating, inStockOnly, sortBy, showOnlyWishlist, wishlist]);

  const handleResetFilters = () => {
    setSelectedCategory('all');
    setSearchQuery('');
    setPriceRange(1000);
    setMinRating(0);
    setInStockOnly(false);
    setSortBy('featured');
  };

  const activeCategoryObj = CATEGORIES.find((c) => c.id === selectedCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header Banner */}
      <div className="space-y-3">
        <div className="flex items-center space-x-2 text-xs font-semibold text-gray-500">
          <span>Home</span>
          <span>/</span>
          <span className="text-gray-900 dark:text-white font-bold">
            {showOnlyWishlist ? 'My Wishlist' : 'Products Catalog'}
          </span>
        </div>
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              {showOnlyWishlist
                ? 'Saved Wishlist Items'
                : activeCategoryObj
                ? activeCategoryObj.name
                : 'All Products'}
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 pt-1">
              Showing <span className="font-bold text-gray-900 dark:text-white">{filteredProducts.length}</span> of {PRODUCTS.length} curated products
            </p>
          </div>

          {/* Search Bar Input */}
          <div className="w-full sm:w-80">
            <SearchBar value={searchQuery} onChange={setSearchQuery} />
          </div>
        </div>
      </div>

      {/* Sorting & Mobile Filter Trigger Bar */}
      <div className="flex items-center justify-between p-4 rounded-2xl glass-panel border border-gray-200/80 dark:border-zinc-800">
        
        {/* Mobile Filter Button */}
        <button
          onClick={() => setIsMobileFilterOpen(true)}
          className="lg:hidden inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-gray-100 dark:bg-zinc-800 text-xs font-bold text-gray-900 dark:text-white"
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span>Filter ({selectedCategory !== 'all' || priceRange < 1000 || minRating > 0 ? 'Active' : 'All'})</span>
        </button>

        {/* Active Filter Badges (Desktop) */}
        <div className="hidden lg:flex items-center space-x-2 flex-wrap text-xs">
          <span className="text-gray-400 font-semibold mr-1">Active:</span>
          {selectedCategory !== 'all' && (
            <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 font-medium">
              <span>Cat: {activeCategoryObj?.name}</span>
              <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedCategory('all')} />
            </span>
          )}
          {priceRange < 1000 && (
            <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 font-medium">
              <span>Max: ${priceRange}</span>
              <X className="w-3 h-3 cursor-pointer" onClick={() => setPriceRange(1000)} />
            </span>
          )}
          {minRating > 0 && (
            <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 font-medium">
              <span>{minRating}+ ★</span>
              <X className="w-3 h-3 cursor-pointer" onClick={() => setMinRating(0)} />
            </span>
          )}
          {(selectedCategory === 'all' && priceRange === 1000 && minRating === 0 && !searchQuery) && (
            <span className="text-gray-400 text-xs">None</span>
          )}
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center space-x-2 ml-auto">
          <ArrowUpDown className="w-4 h-4 text-gray-400 hidden sm:block" />
          <span className="text-xs font-semibold text-gray-500 hidden sm:block">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 rounded-xl bg-gray-100 dark:bg-zinc-800 text-xs font-semibold text-gray-900 dark:text-white border-none focus:outline-none cursor-pointer"
          >
            <option value="featured">Featured First</option>
            <option value="popularity">Most Popular</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
            <option value="discount">Biggest Discount</option>
          </select>
        </div>

      </div>

      {/* Main Content Layout: Sidebar + Grid */}
      <div className="flex gap-8 items-start">
        
        {/* Desktop Filter Sidebar / Mobile Drawer */}
        <FilterSidebar
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          priceRange={priceRange}
          onPriceChange={setPriceRange}
          minRating={minRating}
          onRatingChange={setMinRating}
          inStockOnly={inStockOnly}
          onStockChange={setInStockOnly}
          onResetFilters={handleResetFilters}
          isOpenMobile={isMobileFilterOpen}
          onCloseMobile={() => setIsMobileFilterOpen(false)}
        />

        {/* Product Grid Container */}
        <div className="flex-1 w-full">
          <ProductGrid
            products={filteredProducts}
            onResetFilters={handleResetFilters}
            columns={3}
          />
        </div>

      </div>

    </div>
  );
};

export default Products;
