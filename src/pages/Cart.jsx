import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useShop } from '../hooks/useShop';
import CartItem from '../components/CartItem';
import {
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Truck,
  Trash2,
  Tag,
  Check,
  X,
  CreditCard,
} from 'lucide-react';

export const Cart = () => {
  const {
    cart,
    clearCart,
    cartSubtotal,
    cartOriginalTotal,
    totalSavings,
    shippingFee,
    cartTotal,
    showToast,
  } = useShop();

  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);

  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (promoCode.trim().toUpperCase() === 'NEXORA10' || promoCode.trim().toUpperCase() === 'WELCOME15') {
      setAppliedPromo({ code: promoCode.toUpperCase(), discountPercent: 10 });
      showToast(`Applied coupon "${promoCode.toUpperCase()}"! Saved 10% extra.`);
    } else {
      showToast('Invalid promo code. Try "NEXORA10"', 'error');
    }
  };

  const finalPromoDiscount = appliedPromo ? (cartSubtotal * appliedPromo.discountPercent) / 100 : 0;
  const grandTotal = Math.max(0, cartTotal - finalPromoDiscount);

  // Free shipping progress bar logic ($100 goal)
  const freeShippingThreshold = 100;
  const progressPercent = Math.min(100, (cartSubtotal / freeShippingThreshold) * 100);
  const amountNeeded = Math.max(0, freeShippingThreshold - cartSubtotal);

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-zinc-800 flex items-center justify-center mx-auto text-gray-400">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
            Your Cart is Empty
          </h1>
          <p className="text-sm text-gray-500 max-w-sm mx-auto">
            Looks like you haven't added any NEXORA items to your shopping cart yet.
          </p>
        </div>
        <Link
          to="/products"
          className="inline-flex items-center space-x-2 px-8 py-4 rounded-full bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 font-extrabold text-sm hover:opacity-90 transition-opacity shadow-lg"
        >
          <span>Start Shopping Now</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-zinc-800">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Shopping Cart
          </h1>
          <p className="text-xs text-gray-500 pt-1">
            {cart.length} unique item{cart.length > 1 ? 's' : ''} in your cart
          </p>
        </div>
        <button
          onClick={clearCart}
          className="text-xs font-semibold text-gray-400 hover:text-red-500 flex items-center space-x-1 transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear Cart</span>
        </button>
      </div>

      {/* Free Shipping Progress Indicator */}
      <div className="p-4 rounded-2xl bg-gray-100 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 space-y-2">
        <div className="flex items-center justify-between text-xs font-semibold text-gray-800 dark:text-gray-200">
          <div className="flex items-center space-x-1.5">
            <Truck className="w-4 h-4 text-emerald-500" />
            {amountNeeded > 0 ? (
              <span>Add <strong className="text-gray-900 dark:text-white">${amountNeeded.toFixed(2)}</strong> more for <strong>FREE Shipping</strong>!</span>
            ) : (
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">🎉 You unlocked FREE Shipping!</span>
            )}
          </div>
          <span>{progressPercent.toFixed(0)}%</span>
        </div>
        <div className="w-full h-2 rounded-full bg-gray-200 dark:bg-zinc-800 overflow-hidden">
          <div
            className="h-full bg-emerald-500 transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Main Grid: Cart Items List + Order Summary Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Cart Items List */}
        <div className="lg:col-span-8 space-y-4">
          {cart.map((item, idx) => (
            <CartItem key={`${item.product.id}-${item.selectedSize}-${idx}`} item={item} />
          ))}
        </div>

        {/* Right Column: Order Summary Card */}
        <div className="lg:col-span-4 glass-panel p-6 sm:p-8 rounded-3xl border border-gray-200/80 dark:border-zinc-800 space-y-6 sticky top-28 shadow-lg">
          
          <h3 className="text-lg font-extrabold text-gray-900 dark:text-white pb-3 border-b border-gray-200 dark:border-zinc-800">
            Order Summary
          </h3>

          {/* Promo Code Input Form */}
          <form onSubmit={handleApplyPromo} className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-zinc-500">
              Have a Promo Code?
            </label>
            <div className="flex gap-2">
              <div className="relative flex-grow">
                <input
                  type="text"
                  placeholder="e.g. NEXORA10"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="w-full pl-8 pr-3 py-2.5 text-xs rounded-xl bg-gray-100 dark:bg-zinc-800 text-gray-900 dark:text-white uppercase placeholder-gray-400 border border-gray-200 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                />
                <Tag className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-3" />
              </div>
              <button
                type="submit"
                className="px-4 py-2.5 rounded-xl bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 text-xs font-bold hover:opacity-90 transition-opacity"
              >
                Apply
              </button>
            </div>
            {appliedPromo && (
              <div className="flex items-center justify-between text-xs text-emerald-600 dark:text-emerald-400 pt-1">
                <span>Coupon {appliedPromo.code} applied</span>
                <button
                  type="button"
                  onClick={() => setAppliedPromo(null)}
                  className="text-gray-400 hover:text-red-500"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </form>

          {/* Price Calculations */}
          <div className="space-y-3 pt-2 text-xs">
            
            <div className="flex items-center justify-between text-gray-600 dark:text-gray-400">
              <span>Subtotal</span>
              <span className="font-bold text-gray-900 dark:text-white">${cartSubtotal.toFixed(2)}</span>
            </div>

            {totalSavings > 0 && (
              <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400">
                <span>Catalog Discount</span>
                <span className="font-bold">-${totalSavings.toFixed(2)}</span>
              </div>
            )}

            {appliedPromo && (
              <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400">
                <span>Promo Discount ({appliedPromo.discountPercent}%)</span>
                <span className="font-bold">-${finalPromoDiscount.toFixed(2)}</span>
              </div>
            )}

            <div className="flex items-center justify-between text-gray-600 dark:text-gray-400">
              <span>Estimated Shipping</span>
              <span className="font-bold text-gray-900 dark:text-white">
                {shippingFee === 0 ? <strong className="text-emerald-500 uppercase">FREE</strong> : `$${shippingFee}`}
              </span>
            </div>

            <div className="pt-3 border-t border-gray-200 dark:border-zinc-800 flex items-baseline justify-between text-base">
              <span className="font-extrabold text-gray-900 dark:text-white">Total Amount</span>
              <span className="text-2xl font-black text-gray-900 dark:text-white">${grandTotal.toFixed(2)}</span>
            </div>

          </div>

          {/* Checkout Action */}
          <button
            onClick={() => setIsCheckoutModalOpen(true)}
            className="w-full py-4 rounded-full bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 font-extrabold text-sm hover:opacity-90 transition-all flex items-center justify-center space-x-2 shadow-xl"
          >
            <CreditCard className="w-4 h-4" />
            <span>Proceed to Checkout</span>
          </button>

          <div className="flex items-center justify-center space-x-2 text-[11px] text-gray-400 text-center pt-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Encrypted & Guaranteed Checkout</span>
          </div>

        </div>

      </div>

      {/* Checkout Placeholder Modal */}
      {isCheckoutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-3xl p-8 max-w-md w-full text-center space-y-6 shadow-2xl relative">
            <button
              onClick={() => setIsCheckoutModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-black dark:hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 mx-auto flex items-center justify-center">
              <Check className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white">
                Frontend UI Demo
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                You've reached the checkout phase! Backend authentication, address collection, payment gateway (Stripe/PayPal), and order creation will be integrated in future phases.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-gray-100 dark:bg-zinc-900 text-xs font-semibold text-gray-800 dark:text-gray-200 text-left space-y-1">
              <div className="flex justify-between">
                <span>Total Items:</span>
                <span>{cart.length}</span>
              </div>
              <div className="flex justify-between font-bold text-gray-900 dark:text-white pt-1">
                <span>Grand Total:</span>
                <span>${grandTotal.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={() => {
                clearCart();
                setIsCheckoutModalOpen(false);
                showToast('Demo order placed successfully!');
              }}
              className="w-full py-3.5 rounded-full bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 font-extrabold text-xs shadow-md"
            >
              Simulate Successful Order
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default Cart;
