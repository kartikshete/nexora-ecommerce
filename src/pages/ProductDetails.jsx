import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { PRODUCTS as LOCAL_FALLBACK_PRODUCTS } from '../data/products';
import { useShop } from '../hooks/useShop';
import { productService } from '../services/productService';
import RatingStars from '../components/RatingStars';
import ProductCard from '../components/ProductCard';
import {
  Heart,
  ShoppingBag,
  Zap,
  Truck,
  ShieldCheck,
  RefreshCw,
  Minus,
  Plus,
  ArrowLeft,
  Check,
  Loader2,
  AlertCircle,
  Package,
} from 'lucide-react';

export const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, toggleWishlist, isInWishlist } = useShop();

  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Gallery state
  const [selectedImage, setSelectedImage] = useState('');

  // Size/Variant selection state
  const [selectedVariant, setSelectedVariant] = useState(null);

  // Quantity state
  const [quantity, setQuantity] = useState(1);

  // Fetch product from API with fallback to local mock data
  useEffect(() => {
    let isMounted = true;

    const loadProduct = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const res = await productService.getProductById(id);
        if (res.success && res.product && isMounted) {
          setProduct(res.product);
          const firstImg =
            (Array.isArray(res.product.images) && res.product.images[0]) ||
            res.product.image ||
            'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80';
          setSelectedImage(firstImg);
          if (res.product.sizes && res.product.sizes.length > 0) {
            setSelectedVariant(res.product.sizes[0]);
          }
          setIsLoading(false);
          return;
        }
      } catch (err) {
        // Try finding in local mock data
        const localMatch = LOCAL_FALLBACK_PRODUCTS.find((p) => p.id === id);
        if (localMatch && isMounted) {
          setProduct(localMatch);
          setSelectedImage(localMatch.image);
          if (localMatch.sizes && localMatch.sizes.length > 0) {
            setSelectedVariant(localMatch.sizes[0]);
          }
          setIsLoading(false);
          return;
        }

        if (isMounted) {
          setError('Product not found or unavailable.');
          setIsLoading(false);
        }
      }
    };

    loadProduct();
    setQuantity(1);
    window.scrollTo(0, 0);

    return () => {
      isMounted = false;
    };
  }, [id]);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center glass-panel rounded-3xl flex flex-col items-center justify-center space-y-4 my-10">
        <Loader2 className="w-10 h-10 animate-spin text-zinc-900 dark:text-white" />
        <p className="text-sm font-semibold text-gray-600 dark:text-gray-300">
          Loading product details...
        </p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center glass-panel rounded-3xl flex flex-col items-center justify-center space-y-4 my-10">
        <AlertCircle className="w-12 h-12 text-rose-500" />
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Product Not Found</h2>
        <p className="text-xs text-gray-500 max-w-sm">
          {error || "The product you're looking for doesn't exist or has been removed."}
        </p>
        <button
          onClick={() => navigate('/products')}
          className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-full bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 text-xs font-semibold hover:opacity-90"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Products</span>
        </button>
      </div>
    );
  }

  const productId = product._id || product.id;
  const isWishlisted = isInWishlist(productId);

  const imagesList =
    Array.isArray(product.images) && product.images.length > 0
      ? product.images
      : product.gallery && product.gallery.length > 0
      ? product.gallery
      : [product.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80'];

  const discountPercent =
    product.discount > 0
      ? product.discount
      : product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : 0;

  const isOutOfStock = product.stock !== undefined && product.stock <= 0;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addToCart(product, quantity, selectedVariant);
  };

  const handleBuyNow = () => {
    if (isOutOfStock) return;
    addToCart(product, quantity, selectedVariant);
    navigate('/cart');
  };

  // Related products from local dataset
  const relatedProducts = LOCAL_FALLBACK_PRODUCTS.filter(
    (p) => p.category === product.category && (p.id !== productId && p._id !== productId)
  ).slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      {/* Back Link & Breadcrumbs */}
      <div className="flex items-center space-x-3 text-xs font-semibold text-gray-500">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-full bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors"
          aria-label="Go back"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <Link to="/" className="hover:text-black dark:hover:text-white">Home</Link>
        <span>/</span>
        <Link to="/products" className="hover:text-black dark:hover:text-white">Products</Link>
        <span>/</span>
        <span className="text-gray-900 dark:text-white font-bold truncate max-w-xs">{product.name}</span>
      </div>

      {/* Main Product Hero Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
        {/* Left Column: Image Gallery */}
        <div className="lg:col-span-6 space-y-4">
          {/* Main Display Image */}
          <div className="relative w-full aspect-square rounded-3xl overflow-hidden bg-gray-100 dark:bg-zinc-900 border border-gray-200/80 dark:border-zinc-800 shadow-md">
            {discountPercent > 0 && (
              <span className="absolute top-4 left-4 z-10 px-3.5 py-1.5 rounded-full bg-rose-500 text-white text-xs font-extrabold shadow-md">
                SAVE {discountPercent}%
              </span>
            )}

            <button
              onClick={() => toggleWishlist(productId)}
              className={`absolute top-4 right-4 z-10 p-3 rounded-full backdrop-blur-md shadow-md transition-all ${
                isWishlisted
                  ? 'bg-rose-500 text-white'
                  : 'bg-white/80 dark:bg-zinc-900/80 text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-zinc-800'
              }`}
              aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-white' : ''}`} />
            </button>

            <img
              src={selectedImage || imagesList[0]}
              alt={product.name}
              className="w-full h-full object-cover object-center transition-all duration-300"
            />
          </div>

          {/* Gallery Thumbnails */}
          {imagesList.length > 1 && (
            <div className="flex items-center space-x-3 overflow-x-auto pb-2 no-scrollbar">
              {imagesList.map((imgUrl, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(imgUrl)}
                  className={`w-20 h-20 rounded-2xl overflow-hidden border-2 flex-shrink-0 transition-all ${
                    (selectedImage || imagesList[0]) === imgUrl
                      ? 'border-black dark:border-white scale-105 shadow-md'
                      : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={imgUrl} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Product Meta & Purchase Options */}
        <div className="lg:col-span-6 space-y-6">
          {/* Brand & Title */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase tracking-widest text-brand-600 dark:text-brand-400">
                {product.brand || 'NEXORA'}
              </span>
              {product.sku && (
                <span className="text-[11px] font-mono text-gray-400 bg-gray-100 dark:bg-zinc-800 px-2 py-0.5 rounded">
                  SKU: {product.sku}
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 dark:text-white leading-tight">
              {product.name}
            </h1>
            <RatingStars rating={product.rating || 0} reviewsCount={product.reviewsCount || 0} size="md" />
          </div>

          {/* Pricing Box */}
          <div className="p-4 rounded-2xl glass-panel border border-gray-200/80 dark:border-zinc-800 flex items-center justify-between">
            <div className="flex items-baseline space-x-3">
              <span className="text-3xl font-black text-gray-900 dark:text-white">
                ${product.price}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-base text-gray-400 line-through font-medium">
                  ${product.originalPrice}
                </span>
              )}
            </div>

            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-full">
                You Save ${(product.originalPrice - product.price).toFixed(0)}
              </span>
            )}
          </div>

          {/* Stock Status Badge */}
          <div className="flex items-center space-x-2">
            <Package className="w-4 h-4 text-gray-500" />
            <span className="text-xs font-semibold text-gray-500">Inventory:</span>
            {isOutOfStock ? (
              <span className="text-xs font-bold text-rose-500 bg-rose-50 dark:bg-rose-950/30 px-2.5 py-1 rounded-full">
                Out of Stock
              </span>
            ) : (
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 px-2.5 py-1 rounded-full">
                In Stock {product.stock !== undefined ? `(${product.stock} available)` : ''}
              </span>
            )}
          </div>

          {/* Short Description */}
          <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-line">
            {product.description}
          </p>

          {/* Variant Selector */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-zinc-500">
                Select Option / Color
              </label>
              <div className="flex flex-wrap gap-2.5">
                {product.sizes.map((variant) => {
                  const isSelected = selectedVariant === variant;
                  return (
                    <button
                      key={variant}
                      onClick={() => setSelectedVariant(variant)}
                      className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition-all border ${
                        isSelected
                          ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 border-black dark:border-white shadow-sm'
                          : 'bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-zinc-700 hover:border-gray-400'
                      }`}
                    >
                      {variant}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quantity Selector & Main Action Buttons */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center space-x-4">
              {/* Quantity Counter */}
              <div className="flex items-center space-x-2 bg-gray-100 dark:bg-zinc-800 p-1.5 rounded-2xl border border-gray-200 dark:border-zinc-700">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={isOutOfStock}
                  className="w-8 h-8 rounded-xl bg-white dark:bg-zinc-900 text-gray-800 dark:text-gray-200 flex items-center justify-center shadow-sm hover:bg-gray-200 dark:hover:bg-zinc-700 disabled:opacity-40"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-8 text-center text-sm font-bold text-gray-900 dark:text-white">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => (product.stock ? Math.min(product.stock, q + 1) : q + 1))}
                  disabled={isOutOfStock}
                  className="w-8 h-8 rounded-xl bg-white dark:bg-zinc-900 text-gray-800 dark:text-gray-200 flex items-center justify-center shadow-sm hover:bg-gray-200 dark:hover:bg-zinc-700 disabled:opacity-40"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className="flex-1 py-4 px-6 rounded-full bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 font-extrabold text-sm hover:opacity-90 transition-opacity flex items-center justify-center space-x-2 shadow-xl disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>{isOutOfStock ? 'Out of Stock' : 'Add to Cart'}</span>
              </button>
            </div>

            {/* Buy Now Button */}
            <button
              onClick={handleBuyNow}
              disabled={isOutOfStock}
              className="w-full py-4 px-6 rounded-full bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-sm transition-colors flex items-center justify-center space-x-2 shadow-lg disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Zap className="w-4 h-4 fill-white" />
              <span>Buy Now Express</span>
            </button>
          </div>

          {/* Delivery & Warranty Highlights */}
          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-gray-200/80 dark:border-zinc-800">
            <div className="p-3 rounded-2xl bg-gray-50 dark:bg-zinc-900/50 text-center space-y-1 border border-gray-100 dark:border-zinc-800">
              <Truck className="w-5 h-5 mx-auto text-gray-700 dark:text-gray-300" />
              <p className="text-[11px] font-bold text-gray-900 dark:text-white">Free Express Delivery</p>
              <p className="text-[10px] text-gray-500">Orders over $100</p>
            </div>
            <div className="p-3 rounded-2xl bg-gray-50 dark:bg-zinc-900/50 text-center space-y-1 border border-gray-100 dark:border-zinc-800">
              <ShieldCheck className="w-5 h-5 mx-auto text-gray-700 dark:text-gray-300" />
              <p className="text-[11px] font-bold text-gray-900 dark:text-white">2-Year Warranty</p>
              <p className="text-[10px] text-gray-500">Full Coverage</p>
            </div>
            <div className="p-3 rounded-2xl bg-gray-50 dark:bg-zinc-900/50 text-center space-y-1 border border-gray-100 dark:border-zinc-800">
              <RefreshCw className="w-5 h-5 mx-auto text-gray-700 dark:text-gray-300" />
              <p className="text-[11px] font-bold text-gray-900 dark:text-white">30-Day Returns</p>
              <p className="text-[10px] text-gray-500">Prepaid Labels</p>
            </div>
          </div>

          {/* Product Feature Bullets */}
          {product.features && (
            <div className="space-y-3 pt-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-zinc-500">
                Key Highlights & Specifications
              </h3>
              <ul className="space-y-2">
                {product.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start space-x-2.5 text-xs text-gray-700 dark:text-gray-300">
                    <Check className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Related Products Recommendation Grid */}
      {relatedProducts.length > 0 && (
        <section className="space-y-8 pt-8 border-t border-gray-200 dark:border-zinc-800">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white">
              You Might Also Like
            </h2>
            <Link to="/products" className="text-xs font-bold text-gray-500 hover:text-black dark:hover:text-white">
              View All →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p._id || p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductDetails;
