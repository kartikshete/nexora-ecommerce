import React from 'react';
import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2, Heart } from 'lucide-react';
import { useShop } from '../hooks/useShop';

export const CartItem = ({ item }) => {
  const { product, quantity, selectedSize } = item;
  const { updateQuantity, removeFromCart, toggleWishlist, isInWishlist } = useShop();

  const isWishlisted = isInWishlist(product.id);

  const handleMoveToWishlist = () => {
    if (!isWishlisted) {
      toggleWishlist(product.id);
    }
    removeFromCart(product.id, selectedSize);
  };

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 sm:p-5 rounded-3xl bg-white dark:bg-zinc-900 border border-gray-200/80 dark:border-zinc-800 gap-4 transition-all">
      
      {/* Product Image & Info */}
      <div className="flex items-center space-x-4 flex-1">
        
        {/* Thumbnail */}
        <Link to={`/product/${product.id}`} className="flex-shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gray-100 dark:bg-zinc-800 overflow-hidden border border-gray-100 dark:border-zinc-800">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </Link>

        {/* Info */}
        <div className="space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-zinc-500">
            {product.brand}
          </span>
          <Link to={`/product/${product.id}`}>
            <h4 className="text-sm font-bold text-gray-900 dark:text-white line-clamp-1 hover:underline">
              {product.name}
            </h4>
          </Link>

          {selectedSize && (
            <div className="inline-block text-[11px] font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-zinc-800 px-2.5 py-0.5 rounded-md">
              Option: <span className="font-semibold text-gray-800 dark:text-gray-200">{selectedSize}</span>
            </div>
          )}

          <div className="text-xs font-semibold text-gray-900 dark:text-white pt-1">
            ${product.price} <span className="text-[10px] text-gray-400 font-normal">/ unit</span>
          </div>
        </div>

      </div>

      {/* Quantity Adjuster & Item Subtotal */}
      <div className="flex items-center justify-between w-full sm:w-auto sm:space-x-8 pt-3 sm:pt-0 border-t sm:border-t-0 border-gray-100 dark:border-zinc-800">
        
        {/* Quantity Controls */}
        <div className="flex items-center space-x-1.5 bg-gray-100 dark:bg-zinc-800/90 rounded-full p-1 border border-gray-200/60 dark:border-zinc-700/60">
          <button
            onClick={() => updateQuantity(product.id, selectedSize, quantity - 1)}
            className="w-7 h-7 rounded-full bg-white dark:bg-zinc-900 text-gray-700 dark:text-gray-300 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors shadow-sm"
            aria-label="Decrease quantity"
          >
            <Minus className="w-3 h-3" />
          </button>
          
          <span className="w-8 text-center text-xs font-bold text-gray-900 dark:text-white">
            {quantity}
          </span>

          <button
            onClick={() => updateQuantity(product.id, selectedSize, quantity + 1)}
            className="w-7 h-7 rounded-full bg-white dark:bg-zinc-900 text-gray-700 dark:text-gray-300 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors shadow-sm"
            aria-label="Increase quantity"
          >
            <Plus className="w-3 h-3" />
          </button>
        </div>

        {/* Item Total Price */}
        <div className="text-right">
          <span className="text-base font-extrabold text-gray-900 dark:text-white">
            ${(product.price * quantity).toFixed(2)}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-1">
          <button
            onClick={handleMoveToWishlist}
            title="Move to Wishlist"
            className="p-2 rounded-full text-gray-400 hover:text-rose-500 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
          </button>
          
          <button
            onClick={() => removeFromCart(product.id, selectedSize)}
            title="Remove item"
            className="p-2 rounded-full text-gray-400 hover:text-red-500 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

      </div>

    </div>
  );
};

export default CartItem;
