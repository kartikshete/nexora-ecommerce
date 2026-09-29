import React, { createContext, useContext, useState, useEffect } from 'react';
import { PRODUCTS } from '../data/products';

const ShopContext = createContext();

export const ShopProvider = ({ children }) => {
  // Cart state persisted in localStorage
  const [cart, setCart] = useState(() => {
    try {
      const savedCart = localStorage.getItem('nexora_cart');
      return savedCart ? JSON.parse(savedCart) : [];
    } catch {
      return [];
    }
  });

  // Wishlist state persisted in localStorage
  const [wishlist, setWishlist] = useState(() => {
    try {
      const savedWishlist = localStorage.getItem('nexora_wishlist');
      return savedWishlist ? JSON.parse(savedWishlist) : [];
    } catch {
      return [];
    }
  });

  // Global Search state
  const [searchQuery, setSearchQuery] = useState('');

  // Active Category filter
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Notification Toast state
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  useEffect(() => {
    try {
      localStorage.setItem('nexora_cart', JSON.stringify(cart));
    } catch (e) {
      console.error('Failed to save cart to localStorage', e);
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('nexora_wishlist', JSON.stringify(wishlist));
    } catch (e) {
      console.error('Failed to save wishlist to localStorage', e);
    }
  }, [wishlist]);

  // Cart operations
  const addToCart = (product, quantity = 1, selectedSize = null) => {
    const defaultSize = selectedSize || (product.sizes ? product.sizes[0] : null);
    
    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex(
        (item) => item.product.id === product.id && item.selectedSize === defaultSize
      );

      if (existingIndex > -1) {
        const updated = [...prevCart];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        return [...prevCart, { product, quantity, selectedSize: defaultSize }];
      }
    });

    showToast(`Added "${product.name}" to cart`);
  };

  const removeFromCart = (productId, selectedSize = null) => {
    setCart((prevCart) =>
      prevCart.filter(
        (item) => !(item.product.id === productId && item.selectedSize === selectedSize)
      )
    );
    showToast('Item removed from cart', 'info');
  };

  const updateQuantity = (productId, selectedSize, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId, selectedSize);
      return;
    }

    setCart((prevCart) =>
      prevCart.map((item) => {
        if (item.product.id === productId && item.selectedSize === selectedSize) {
          return { ...item, quantity: newQuantity };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  // Wishlist operations
  const toggleWishlist = (productId) => {
    const product = PRODUCTS.find((p) => p.id === productId);
    setWishlist((prevWishlist) => {
      const exists = prevWishlist.includes(productId);
      if (exists) {
        showToast(`Removed "${product ? product.name : 'Item'}" from wishlist`, 'info');
        return prevWishlist.filter((id) => id !== productId);
      } else {
        showToast(`Saved "${product ? product.name : 'Item'}" to wishlist`);
        return [...prevWishlist, productId];
      }
    });
  };

  const isInWishlist = (productId) => wishlist.includes(productId);

  // Cart metrics calculations
  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  const cartSubtotal = cart.reduce((total, item) => total + item.product.price * item.quantity, 0);

  const cartOriginalTotal = cart.reduce(
    (total, item) => total + (item.product.originalPrice || item.product.price) * item.quantity,
    0
  );

  const totalSavings = Math.max(0, cartOriginalTotal - cartSubtotal);

  const shippingFee = cartSubtotal >= 100 || cartSubtotal === 0 ? 0 : 15;

  const cartTotal = cartSubtotal + shippingFee;

  return (
    <ShopContext.Provider
      value={{
        cart,
        wishlist,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        toggleWishlist,
        isInWishlist,
        cartItemCount,
        cartSubtotal,
        cartOriginalTotal,
        totalSavings,
        shippingFee,
        cartTotal,
        toast,
        showToast,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShopContext = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShopContext must be used within a ShopProvider');
  }
  return context;
};
