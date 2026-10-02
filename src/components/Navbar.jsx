import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useShop } from '../hooks/useShop';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import UserDropdown from './UserDropdown';
import {
  ShoppingBag,
  Heart,
  Search,
  Sun,
  Moon,
  Menu,
  X,
  User,
  Sparkles,
  LogOut,
} from 'lucide-react';

export const Navbar = () => {
  const { cartItemCount, wishlist, searchQuery, setSearchQuery, setSelectedCategory } = useShop();
  const { isDarkMode, toggleTheme } = useTheme();
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate('/products');
      setSearchOpen(false);
      setMobileMenuOpen(false);
    }
  };

  const handleCategoryNav = (catId) => {
    setSelectedCategory(catId);
    navigate('/products');
    setMobileMenuOpen(false);
  };

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Products', path: '/products' },
    { label: 'Deals', path: '/products?filter=deals' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full glass-nav transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo */}
          <Link
            to="/"
            className="flex items-center space-x-2 group focus:outline-none"
            onClick={() => setSelectedCategory('all')}
          >
            <div className="w-10 h-10 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 flex items-center justify-center font-extrabold text-xl shadow-lg group-hover:scale-105 transition-transform">
              N
            </div>
            <span className="text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-white font-sans">
              NEXORA<span className="text-brand-500 font-normal">.</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.label}
                  to={link.path}
                  className={`text-sm font-medium transition-colors hover:text-black dark:hover:text-white ${
                    isActive
                      ? 'text-black dark:text-white font-semibold'
                      : 'text-gray-600 dark:text-gray-400'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            {/* Quick Category Dropdown/Trigger */}
            <button
              onClick={() => handleCategoryNav('all')}
              className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors"
            >
              Categories
            </button>
          </nav>

          {/* Right Action Icons & Tools */}
          <div className="flex items-center space-x-2 sm:space-x-4">

            {/* Desktop Quick Search Bar */}
            <form onSubmit={handleSearchSubmit} className="hidden lg:relative lg:block">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-48 xl:w-64 pl-9 pr-4 py-2 text-xs rounded-full bg-gray-100 dark:bg-zinc-800/80 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all"
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
            </form>

            {/* Mobile Search Toggle */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800 lg:hidden focus:outline-none"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Dark/Light Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors focus:outline-none"
              aria-label="Toggle Dark Mode"
            >
              {isDarkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Wishlist Button with Badge */}
            <Link
              to="/products?wishlist=true"
              className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors relative focus:outline-none"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute top-0 right-0 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-fade-in">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Cart Button with Count Badge */}
            <Link
              to="/cart"
              className="p-2.5 rounded-full bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-gray-100 transition-all flex items-center space-x-2 relative focus:outline-none shadow-sm"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="text-xs font-bold px-1">{cartItemCount}</span>
            </Link>

            {/* Auth Buttons */}
            {isAuthenticated ? (
              <div className="hidden sm:flex items-center">
                <UserDropdown />
              </div>
            ) : (
              <Link
                to="/login"
                className="hidden sm:flex items-center space-x-1.5 text-xs font-semibold px-4 py-2.5 rounded-full border border-gray-300 dark:border-zinc-700 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
              >
                <User className="w-3.5 h-3.5" />
                <span>Login</span>
              </Link>
            )}

            {/* Mobile Hamburger Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800 md:hidden focus:outline-none"
              aria-label="Open Mobile Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Search Bar Dropdown */}
      {searchOpen && (
        <div className="lg:hidden px-4 pb-4 border-b border-gray-200 dark:border-zinc-800 animate-slide-up">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              placeholder="Search products, brands, categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl bg-gray-100 dark:bg-zinc-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
            />
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
          </form>
        </div>
      )}

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-panel border-b border-gray-200 dark:border-zinc-800 px-6 py-6 space-y-4 animate-slide-up">
          <nav className="flex flex-col space-y-3">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="text-base font-semibold text-gray-900 dark:text-gray-100 py-1"
            >
              Home
            </Link>
            <Link
              to="/products"
              onClick={() => {
                setSelectedCategory('all');
                setMobileMenuOpen(false);
              }}
              className="text-base font-semibold text-gray-900 dark:text-gray-100 py-1"
            >
              All Products
            </Link>
            <button
              onClick={() => handleCategoryNav('electronics')}
              className="text-left text-sm text-gray-600 dark:text-gray-400 py-1"
            >
              Electronics
            </button>
            <button
              onClick={() => handleCategoryNav('fashion')}
              className="text-left text-sm text-gray-600 dark:text-gray-400 py-1"
            >
              Fashion & Apparel
            </button>
            <button
              onClick={() => handleCategoryNav('footwear')}
              className="text-left text-sm text-gray-600 dark:text-gray-400 py-1"
            >
              Footwear
            </button>
            <button
              onClick={() => handleCategoryNav('accessories')}
              className="text-left text-sm text-gray-600 dark:text-gray-400 py-1"
            >
              Accessories
            </button>
          </nav>
          <div className="pt-4 border-t border-gray-200 dark:border-zinc-800 flex items-center justify-between">
            {isAuthenticated ? (
              <div className="w-full space-y-2">
                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center space-x-2 py-3 rounded-xl bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 font-semibold text-sm shadow-md"
                >
                  <User className="w-4 h-4" />
                  <span>{user?.name || 'Profile'}</span>
                </Link>
                <button
                  onClick={() => { logout(); navigate('/'); setMobileMenuOpen(false); }}
                  className="w-full flex items-center justify-center space-x-2 py-3 rounded-xl border-2 border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 font-semibold text-sm hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center space-x-2 py-3 rounded-xl bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 font-semibold text-sm shadow-md"
              >
                <User className="w-4 h-4" />
                <span>Login to Account</span>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
