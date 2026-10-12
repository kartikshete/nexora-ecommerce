import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import FilterSidebar from '../components/FilterSidebar';
import ProductGrid from '../components/ProductGrid';
import { CATEGORIES, PRODUCTS as LOCAL_FALLBACK_PRODUCTS } from '../data/products';
import { useShop } from '../hooks/useShop';
import { productService } from '../services/productService';
import {
  ArrowUpDown,
  X,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  Loader2,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';

export const Products = () => {
  const { searchQuery, setSearchQuery, selectedCategory, setSelectedCategory, wishlist } = useShop();
  const [searchParams, setSearchParams] = useSearchParams();

  // Filter state
  const [priceRange, setPriceRange] = useState(1000);
  const [minRating, setMinRating] = useState(0);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState('newest');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Pagination state
  const [page, setPage] = useState(1);
  const [limit] = useState(12);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);

  // API loading & error states
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [apiError, setApiError] = useState(null);

  // Sync URL query params on initial load
  useEffect(() => {
    const filterParam = searchParams.get('filter');
    const categoryParam = searchParams.get('category');
    const searchParam = searchParams.get('search');
    const pageParam = searchParams.get('page');

    if (filterParam === 'deals') {
      setSortBy('price_asc');
    } else if (filterParam === 'featured' || filterParam === 'trending') {
      setSortBy('newest');
    }

    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
    if (searchParam) {
      setSearchQuery(searchParam);
    }
    if (pageParam && Number(pageParam) > 0) {
      setPage(Number(pageParam));
    }
  }, [searchParams, setSelectedCategory, setSearchQuery]);

  const showOnlyWishlist = searchParams.get('wishlist') === 'true';

  // Map frontend sort values to backend accepted sort strings
  const mapSortOption = (opt) => {
    switch (opt) {
      case 'price-low':
      case 'discount':
        return 'price_asc';
      case 'price-high':
        return 'price_desc';
      case 'newest':
      case 'featured':
      case 'popularity':
      case 'rating':
      default:
        return 'newest';
    }
  };

  // Fetch products from backend API with local fallback
  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    setApiError(null);

    try {
      const backendSort = mapSortOption(sortBy);
      const res = await productService.getProducts({
        search: searchQuery,
        category: selectedCategory !== 'all' ? selectedCategory : undefined,
        maxPrice: priceRange < 1000 ? priceRange : undefined,
        sort: backendSort,
        page,
        limit,
      });

      if (res.success && Array.isArray(res.products)) {
        // If backend returned products
        if (res.products.length > 0) {
          setProducts(res.products);
          setTotalPages(res.totalPages || 1);
          setTotalProducts(res.totalProducts || res.products.length);
        } else if (res.totalProducts === 0 && !searchQuery && selectedCategory === 'all') {
          // Empty DB fallback: use local mock products so UI is vibrant
          filterAndSetLocalFallback();
        } else {
          setProducts([]);
          setTotalPages(0);
          setTotalProducts(0);
        }
      } else {
        filterAndSetLocalFallback();
      }
    } catch (err) {
      console.warn('Backend API unavailable or error, falling back to local dataset:', err);
      filterAndSetLocalFallback();
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, selectedCategory, priceRange, sortBy, page, limit]);

  // Local fallback filter function
  const filterAndSetLocalFallback = () => {
    let list = LOCAL_FALLBACK_PRODUCTS.filter((product) => {
      if (showOnlyWishlist && !wishlist.includes(product.id)) {
        return false;
      }
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = product.name.toLowerCase().includes(query);
        const matchesBrand = product.brand.toLowerCase().includes(query);
        const matchesCategory = product.category.toLowerCase().includes(query);
        if (!matchesName && !matchesBrand && !matchesCategory) return false;
      }
      if (selectedCategory !== 'all' && product.category.toLowerCase() !== selectedCategory.toLowerCase()) {
        return false;
      }
      if (product.price > priceRange) {
        return false;
      }
      if (minRating > 0 && product.rating < minRating) {
        return false;
      }
      if (inStockOnly && !product.inStock) {
        return false;
      }
      return true;
    });

    list.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        case 'discount':
          return b.discount - a.discount;
        case 'newest':
        case 'featured':
        default:
          return 0;
      }
    });

    const start = (page - 1) * limit;
    const paginated = list.slice(start, start + limit);
    setProducts(paginated);
    setTotalPages(Math.ceil(list.length / limit) || 1);
    setTotalProducts(list.length);
  };

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleResetFilters = () => {
    setSelectedCategory('all');
    setSearchQuery('');
    setPriceRange(1000);
    setMinRating(0);
    setInStockOnly(false);
    setSortBy('newest');
    setPage(1);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const activeCategoryObj = CATEGORIES.find(
    (c) => c.id.toLowerCase() === selectedCategory.toLowerCase()
  );

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
              Showing <span className="font-bold text-gray-900 dark:text-white">{products.length}</span> of {totalProducts} curated products
            </p>
          </div>

          {/* Search Bar Input */}
          <div className="w-full sm:w-80">
            <SearchBar
              value={searchQuery}
              onChange={(val) => {
                setSearchQuery(val);
                setPage(1);
              }}
            />
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
          <span>
            Filter ({selectedCategory !== 'all' || priceRange < 1000 || minRating > 0 ? 'Active' : 'All'})
          </span>
        </button>

        {/* Active Filter Badges (Desktop) */}
        <div className="hidden lg:flex items-center space-x-2 flex-wrap text-xs">
          <span className="text-gray-400 font-semibold mr-1">Active:</span>
          {selectedCategory !== 'all' && (
            <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 font-medium">
              <span>Cat: {activeCategoryObj?.name || selectedCategory}</span>
              <X
                className="w-3 h-3 cursor-pointer"
                onClick={() => {
                  setSelectedCategory('all');
                  setPage(1);
                }}
              />
            </span>
          )}
          {priceRange < 1000 && (
            <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 font-medium">
              <span>Max: ${priceRange}</span>
              <X
                className="w-3 h-3 cursor-pointer"
                onClick={() => {
                  setPriceRange(1000);
                  setPage(1);
                }}
              />
            </span>
          )}
          {searchQuery && (
            <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 font-medium">
              <span>Search: "{searchQuery}"</span>
              <X
                className="w-3 h-3 cursor-pointer"
                onClick={() => {
                  setSearchQuery('');
                  setPage(1);
                }}
              />
            </span>
          )}
          {selectedCategory === 'all' && priceRange === 1000 && minRating === 0 && !searchQuery && (
            <span className="text-gray-400 text-xs">None</span>
          )}
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center space-x-2 ml-auto">
          <ArrowUpDown className="w-4 h-4 text-gray-400 hidden sm:block" />
          <span className="text-xs font-semibold text-gray-500 hidden sm:block">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => {
              setSortBy(e.target.value);
              setPage(1);
            }}
            className="px-3 py-2 rounded-xl bg-gray-100 dark:bg-zinc-800 text-xs font-semibold text-gray-900 dark:text-white border-none focus:outline-none cursor-pointer"
          >
            <option value="newest">Newest Arrivals</option>
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
          onCategoryChange={(cat) => {
            setSelectedCategory(cat);
            setPage(1);
          }}
          priceRange={priceRange}
          onPriceChange={(val) => {
            setPriceRange(val);
            setPage(1);
          }}
          minRating={minRating}
          onRatingChange={setMinRating}
          inStockOnly={inStockOnly}
          onStockChange={setInStockOnly}
          onResetFilters={handleResetFilters}
          isOpenMobile={isMobileFilterOpen}
          onCloseMobile={() => setIsMobileFilterOpen(false)}
        />

        {/* Product Grid Container & Pagination */}
        <div className="flex-1 w-full space-y-8">
          {isLoading ? (
            <div className="w-full py-28 text-center glass-panel rounded-3xl flex flex-col items-center justify-center space-y-4">
              <Loader2 className="w-9 h-9 animate-spin text-zinc-900 dark:text-white" />
              <p className="text-sm font-semibold text-gray-600 dark:text-gray-300">
                Loading products catalog...
              </p>
            </div>
          ) : apiError ? (
            <div className="w-full py-16 px-4 text-center glass-panel rounded-3xl flex flex-col items-center justify-center space-y-4">
              <AlertCircle className="w-10 h-10 text-rose-500" />
              <div className="space-y-1 max-w-sm">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Unable to load products</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">{apiError}</p>
              </div>
              <button
                onClick={fetchProducts}
                className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-full bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 text-xs font-semibold hover:opacity-90"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Retry</span>
              </button>
            </div>
          ) : (
            <>
              <ProductGrid
                products={products}
                onResetFilters={handleResetFilters}
                columns={3}
              />

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-zinc-800">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Page <span className="font-bold text-gray-900 dark:text-white">{page}</span> of{' '}
                    <span className="font-bold text-gray-900 dark:text-white">{totalPages}</span>
                  </p>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handlePageChange(page - 1)}
                      disabled={page <= 1}
                      className={`inline-flex items-center space-x-1 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                        page <= 1
                          ? 'opacity-40 cursor-not-allowed bg-gray-100 dark:bg-zinc-800 text-gray-400'
                          : 'bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-zinc-800'
                      }`}
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span>Previous</span>
                    </button>

                    <div className="hidden sm:flex items-center space-x-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                        <button
                          key={p}
                          onClick={() => handlePageChange(p)}
                          className={`w-8 h-8 rounded-xl text-xs font-bold transition-all ${
                            p === page
                              ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 shadow-sm'
                              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-800'
                          }`}
                        >
                          {p}
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={() => handlePageChange(page + 1)}
                      disabled={page >= totalPages}
                      className={`inline-flex items-center space-x-1 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                        page >= totalPages
                          ? 'opacity-40 cursor-not-allowed bg-gray-100 dark:bg-zinc-800 text-gray-400'
                          : 'bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-zinc-800'
                      }`}
                    >
                      <span>Next</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;
