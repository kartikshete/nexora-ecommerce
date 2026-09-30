import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Hero from '../components/Hero';
import CategoryCard from '../components/CategoryCard';
import ProductCard from '../components/ProductCard';
import DealBanner from '../components/DealBanner';
import FeatureCard from '../components/FeatureCard';
import { CATEGORIES, PRODUCTS } from '../data/products';
import { ArrowRight, Flame, Sparkles, Mail, CheckCircle2 } from 'lucide-react';

export const Home = () => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const featuredProducts = PRODUCTS.filter((p) => p.isFeatured).slice(0, 8);
  const trendingProducts = PRODUCTS.filter((p) => p.isTrending);

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setSubscribed(true);
      setNewsletterEmail('');
    }
  };

  return (
    <div className="space-y-16 pb-12">
      
      {/* 1. Hero Section */}
      <Hero />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
        
        {/* 2. Categories Section */}
        <section className="space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-brand-600 dark:text-brand-400 uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Curated Collections</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
                Shop by Category
              </h2>
            </div>
            <Link
              to="/products"
              className="inline-flex items-center space-x-1 text-xs font-bold text-gray-900 dark:text-white hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
            >
              <span>Browse All Categories</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {CATEGORIES.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </section>

        {/* 3. Featured Products */}
        <section className="space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-amber-500 uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Handpicked Excellence</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
                Featured Products
              </h2>
            </div>
            <Link
              to="/products?filter=featured"
              className="inline-flex items-center space-x-1 text-xs font-bold text-gray-900 dark:text-white hover:underline transition-all"
            >
              <span>View Full Selection ({PRODUCTS.length})</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        {/* 4. Special Deals Banner */}
        <DealBanner />

        {/* 5. Trending Products Section */}
        <section className="space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-rose-500 uppercase tracking-wider">
                <Flame className="w-3.5 h-3.5 fill-rose-500" />
                <span>Customer Favorites</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
                Trending Right Now
              </h2>
            </div>
            <Link
              to="/products?filter=trending"
              className="inline-flex items-center space-x-1 text-xs font-bold text-gray-900 dark:text-white hover:underline"
            >
              <span>See Trending Products</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {trendingProducts.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        {/* 6. Why Choose NEXORA Section */}
        <section className="space-y-8 pt-4">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
              Why Choose NEXORA
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              We combine uncompromised quality, fast global logistics, and world-class customer protection.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard
              iconName="Truck"
              title="Fast Global Shipping"
              description="Free shipping on orders over $100 with real-time GPS tracking and 48-hour delivery options."
            />
            <FeatureCard
              iconName="ShieldCheck"
              title="Secure Checkout"
              description="Bank-grade 256-bit SSL encryption and instant buyer protection guarantee."
            />
            <FeatureCard
              iconName="RefreshCw"
              title="30-Day Easy Returns"
              description="No questions asked returns policy with instant prepaid shipping return labels."
            />
            <FeatureCard
              iconName="BadgeCheck"
              title="100% Authentic Products"
              description="Directly sourced from premium studios and certified manufacturers with full warranty."
            />
          </div>
        </section>

        {/* 7. Newsletter Section */}
        <section className="relative overflow-hidden rounded-3xl bg-gray-100 dark:bg-zinc-900 border border-gray-200/80 dark:border-zinc-800 p-8 sm:p-14 text-center my-12">
          <div className="max-w-2xl mx-auto space-y-6 relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 mx-auto flex items-center justify-center shadow-lg">
              <Mail className="w-6 h-6" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
                Join the NEXORA Insider Club
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                Subscribe to receive early access to limited edition drops, exclusive member discounts, and design stories.
              </p>
            </div>

            {subscribed ? (
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-semibold inline-flex items-center space-x-2 animate-fade-in">
                <CheckCircle2 className="w-4 h-4" />
                <span>Thank you for subscribing! Check your inbox for your 15% discount code.</span>
              </div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  required
                  placeholder="Enter your email address..."
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="flex-grow px-5 py-3.5 rounded-full bg-white dark:bg-zinc-800 text-gray-900 dark:text-white placeholder-gray-400 text-xs border border-gray-200 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                />
                <button
                  type="submit"
                  className="px-8 py-3.5 rounded-full bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 font-bold text-xs hover:opacity-90 transition-opacity shadow-md flex-shrink-0"
                >
                  Subscribe
                </button>
              </form>
            )}

            <p className="text-[11px] text-gray-400 dark:text-zinc-500">
              No spam ever. Unsubscribe at any time with a single click.
            </p>
          </div>
        </section>

      </div>
    </div>
  );
};

export default Home;
