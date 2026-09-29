import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Eye } from 'lucide-react';
import { useShop } from '../hooks/useShop';
import RatingStars from './RatingStars';

export const ProductCard = ({ product }) => {
  const { addToCart, toggleWishlist, isInWishlist } = useShop();

  const isWishlisted = isInWishlist(product.id);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
  };

  const handleToggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  return (
    <div className="group relative flex flex-col justify-between overflow-hidden rounded-3xl bg-white dark:bg-zinc-900 border border-gray-200/80 dark:border-zinc-800/80 p-4 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      
      {/* Top Image Container */}
      <div className="relative w-full aspect-square overflow-hidden rounded-2xl bg-gray-100 dark:bg-zinc-800 mb-4">
        
        {/* Discount Badge */}
        {product.discount > 0 && (
          <div className="absolute top-3 left-3 z-10 px-2.5 py-1 rounded-full bg-black/90 dark:bg-white/90 backdrop-blur-md text-white dark:text-black text-[11px] font-extrabold tracking-wide uppercase shadow-sm">
            {product.discount}% OFF
          </div>
        )}

        {/* Wishlist Heart Button */}
        <button
          onClick={handleToggleWishlist}
          className={`absolute top-3 right-3 z-10 p-2.5 rounded-full transition-all duration-200 backdrop-blur-md focus:outline-none ${
            isWishlisted
              ? 'bg-rose-500 text-white shadow-md'
              : 'bg-white/80 dark:bg-zinc-900/80 text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-zinc-800'
          }`}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-white' : ''}`} />
        </button>

        {/* Image */}
        <Link to={`/product/${product.id}`} className="block w-full h-full">
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
          />
        </Link>

        {/* Quick View Hover Overlay Button */}
        <div className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex space-x-2">
          <Link
            to={`/product/${product.id}`}
            className="flex-1 py-2.5 px-3 rounded-xl bg-white/95 dark:bg-zinc-900/95 text-zinc-900 dark:text-white text-xs font-semibold backdrop-blur-md flex items-center justify-center space-x-1.5 shadow-md hover:bg-white dark:hover:bg-zinc-900 transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Quick View</span>
          </Link>
        </div>

      </div>

      {/* Details Container */}
      <div className="flex flex-col flex-grow justify-between space-y-3 px-1">
        
        <div className="space-y-1.5">
          {/* Brand */}
          <div className="text-[11px] font-bold tracking-wider uppercase text-gray-400 dark:text-zinc-500">
            {product.brand}
          </div>

          {/* Title */}
          <Link to={`/product/${product.id}`} className="block group-hover:text-black dark:group-hover:text-white">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white line-clamp-1 transition-colors">
              {product.name}
            </h3>
          </Link>

          {/* Rating */}
          <RatingStars rating={product.rating} reviewsCount={product.reviewsCount} size="xs" />
        </div>

        {/* Price & Add to Cart Footer Row */}
        <div className="pt-2 flex items-center justify-between border-t border-gray-100 dark:border-zinc-800/60">
          
          {/* Price display */}
          <div className="flex flex-col">
            <div className="flex items-baseline space-x-1.5">
              <span className="text-base font-extrabold text-gray-900 dark:text-white">
                ${product.price}
              </span>
              {product.originalPrice && (
                <span className="text-xs text-gray-400 line-through">
                  ${product.originalPrice}
                </span>
              )}
            </div>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            className="p-2.5 rounded-2xl bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 hover:bg-black dark:hover:bg-gray-100 transition-all duration-200 shadow-sm flex items-center justify-center focus:outline-none active:scale-95"
            aria-label="Add to cart"
          >
            <ShoppingBag className="w-4 h-4" />
          </button>

        </div>

      </div>
    </div>
  );
};

export default ProductCard;
