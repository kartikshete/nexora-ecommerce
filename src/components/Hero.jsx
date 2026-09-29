import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, ShieldCheck, Truck, Zap } from 'lucide-react';
import { PRODUCTS } from '../data/products';

export const Hero = () => {
  const featuredHeroProduct = PRODUCTS[0]; // Acoustica Ultra Headphones

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-gray-100 via-gray-50 to-white dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950 pt-10 pb-20 lg:pt-16 lg:pb-28">
      {/* Background Accent Decorative Elements */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-500/10 dark:bg-brand-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -top-10 -right-10 w-96 h-96 bg-purple-500/10 dark:bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Text & CTA Content */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8 text-center lg:text-left">
            
            {/* Pill Tag */}
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-black/5 dark:bg-white/10 border border-gray-200 dark:border-zinc-800 text-xs font-semibold text-gray-800 dark:text-gray-200 backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Next-Generation Shopping Experience</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900 dark:text-white leading-[1.1] font-sans">
              Redefining <span className="bg-gradient-to-r from-gray-900 via-zinc-700 to-black dark:from-white dark:via-gray-300 dark:to-gray-400 bg-clip-text text-transparent">Everyday Premium</span> Living.
            </h1>

            {/* Subtext */}
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
              Discover curated luxury electronics, minimalist apparel, and lifestyle essentials crafted with precision, functionality, and uncompromising style.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start space-y-3 sm:space-y-0 sm:space-x-4 pt-2">
              <Link
                to="/products"
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 rounded-full bg-zinc-900 hover:bg-black text-white dark:bg-white dark:hover:bg-gray-100 dark:text-zinc-950 font-semibold text-sm transition-all duration-200 shadow-xl hover:shadow-2xl hover:-translate-y-0.5"
              >
                <span>Shop Now</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
              <Link
                to="/products?filter=featured"
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-zinc-800/80 dark:hover:bg-zinc-800 text-gray-900 dark:text-white font-semibold text-sm transition-all duration-200 border border-gray-200 dark:border-zinc-700"
              >
                Explore Collection
              </Link>
            </div>

            {/* Trust Micro Indicators */}
            <div className="pt-6 grid grid-cols-3 gap-4 border-t border-gray-200/80 dark:border-zinc-800/80 max-w-lg mx-auto lg:mx-0">
              <div className="flex flex-col items-center lg:items-start space-y-1">
                <span className="text-xl sm:text-2xl font-extrabold text-zinc-900 dark:text-white">100%</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">Authentic Gear</span>
              </div>
              <div className="flex flex-col items-center lg:items-start space-y-1">
                <span className="text-xl sm:text-2xl font-extrabold text-zinc-900 dark:text-white">Fast</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">Global Shipping</span>
              </div>
              <div className="flex flex-col items-center lg:items-start space-y-1">
                <span className="text-xl sm:text-2xl font-extrabold text-zinc-900 dark:text-white">4.9★</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">Customer Rating</span>
              </div>
            </div>

          </div>

          {/* Right Product Visual Card Showcase */}
          <div className="lg:col-span-5 relative flex justify-center">
            
            {/* Main Showcase Container */}
            <div className="relative w-full max-w-md lg:max-w-none glass-panel rounded-3xl p-6 sm:p-8 shadow-card dark:shadow-dark-card border border-gray-200/80 dark:border-zinc-800/80 group">
              
              {/* Product Badge */}
              <div className="flex items-center justify-between mb-4">
                <span className="px-3 py-1 text-[11px] font-bold tracking-wider uppercase rounded-full bg-rose-500 text-white shadow-sm">
                  {featuredHeroProduct.discount}% OFF DEAL
                </span>
                <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                  {featuredHeroProduct.brand}
                </span>
              </div>

              {/* Product Image */}
              <div className="relative overflow-hidden rounded-2xl bg-gray-100 dark:bg-zinc-800 aspect-square mb-6">
                <img
                  src={featuredHeroProduct.image}
                  alt={featuredHeroProduct.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
              </div>

              {/* Product Info */}
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white line-clamp-1">
                  {featuredHeroProduct.name}
                </h3>
                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-baseline space-x-2">
                    <span className="text-2xl font-black text-gray-900 dark:text-white">
                      ${featuredHeroProduct.price}
                    </span>
                    <span className="text-sm text-gray-400 line-through">
                      ${featuredHeroProduct.originalPrice}
                    </span>
                  </div>
                  <Link
                    to={`/product/${featuredHeroProduct.id}`}
                    className="text-xs font-bold px-4 py-2 rounded-full bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 hover:opacity-90 transition-opacity"
                  >
                    View Product
                  </Link>
                </div>
              </div>

              {/* Floating Floating Stat Pill 1 */}
              <div className="hidden sm:flex absolute -bottom-5 -left-6 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-3.5 shadow-xl items-center space-x-3 backdrop-blur-md animate-fade-in">
                <div className="p-2 bg-emerald-100 dark:bg-emerald-950/50 rounded-xl text-emerald-600 dark:text-emerald-400">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-900 dark:text-white">Express Delivery</p>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400">Ships in 24 hours</p>
                </div>
              </div>

              {/* Floating Stat Pill 2 */}
              <div className="hidden sm:flex absolute -top-5 -right-6 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-3.5 shadow-xl items-center space-x-3 backdrop-blur-md animate-fade-in">
                <div className="p-2 bg-indigo-100 dark:bg-indigo-950/50 rounded-xl text-indigo-600 dark:text-indigo-400">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-900 dark:text-white">2-Year Warranty</p>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400">Guaranteed Protection</p>
                </div>
              </div>

            </div>

          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;
