const mongoose = require('mongoose');
const Product = require('../models/Product');

/**
 * Escapes special characters for safe regular expression querying.
 * @param {string} str 
 * @returns {string}
 */
const escapeRegex = (str) => {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

// ─────────────────────────────────────────────────
// @desc    Get all active products with pagination, search, filter, and sort
// @route   GET /api/products
// @access  Public
// ─────────────────────────────────────────────────
const getProducts = async (req, res) => {
  try {
    const {
      search,
      category,
      minPrice,
      maxPrice,
      sort,
      page = 1,
      limit = 12,
    } = req.query;

    // ── 1. Validate Pagination Parameters ─────────
    let pageNum = 1;
    if (page !== undefined && page !== null && page !== '') {
      const parsedPage = Number(page);
      if (!Number.isInteger(parsedPage) || parsedPage < 1) {
        return res.status(400).json({
          success: false,
          message: 'Page must be a positive integer greater than or equal to 1.',
        });
      }
      pageNum = parsedPage;
    }

    let limitNum = 12;
    if (limit !== undefined && limit !== null && limit !== '') {
      const parsedLimit = Number(limit);
      if (!Number.isInteger(parsedLimit) || parsedLimit < 1 || parsedLimit > 100) {
        return res.status(400).json({
          success: false,
          message: 'Limit must be a positive integer between 1 and 100.',
        });
      }
      limitNum = parsedLimit;
    }

    // ── 2. Validate Price Range Parameters ────────
    let parsedMin = null;
    if (minPrice !== undefined && minPrice !== null && minPrice !== '') {
      parsedMin = Number(minPrice);
      if (isNaN(parsedMin) || parsedMin < 0) {
        return res.status(400).json({
          success: false,
          message: 'minPrice must be a valid non-negative number.',
        });
      }
    }

    let parsedMax = null;
    if (maxPrice !== undefined && maxPrice !== null && maxPrice !== '') {
      parsedMax = Number(maxPrice);
      if (isNaN(parsedMax) || parsedMax < 0) {
        return res.status(400).json({
          success: false,
          message: 'maxPrice must be a valid non-negative number.',
        });
      }
    }

    if (parsedMin !== null && parsedMax !== null && parsedMin > parsedMax) {
      return res.status(400).json({
        success: false,
        message: 'minPrice cannot be greater than maxPrice.',
      });
    }

    // ── 3. Validate Sort Parameter ────────────────
    let sortQuery = { createdAt: -1 }; // Default: newest first
    if (sort !== undefined && sort !== null && sort !== '') {
      const validSortOptions = ['price_asc', 'price_desc', 'newest'];
      if (!validSortOptions.includes(sort)) {
        return res.status(400).json({
          success: false,
          message: `Invalid sort parameter '${sort}'. Allowed options: 'price_asc', 'price_desc', 'newest'.`,
        });
      }

      if (sort === 'price_asc') {
        sortQuery = { price: 1 };
      } else if (sort === 'price_desc') {
        sortQuery = { price: -1 };
      } else if (sort === 'newest') {
        sortQuery = { createdAt: -1 };
      }
    }

    // ── 4. Build MongoDB Query Filter ─────────────
    const filter = { isActive: true };

    // Case-insensitive search on name and brand
    if (search && typeof search === 'string') {
      const trimmedSearch = search.trim();
      if (trimmedSearch.length > 0) {
        const searchRegex = new RegExp(escapeRegex(trimmedSearch), 'i');
        filter.$or = [
          { name: searchRegex },
          { brand: searchRegex },
        ];
      }
    }

    // Category filter (case-insensitive exact match)
    if (category && typeof category === 'string') {
      const trimmedCategory = category.trim();
      if (trimmedCategory.length > 0) {
        filter.category = new RegExp(`^${escapeRegex(trimmedCategory)}$`, 'i');
      }
    }

    // Price range filter
    if (parsedMin !== null || parsedMax !== null) {
      filter.price = {};
      if (parsedMin !== null) {
        filter.price.$gte = parsedMin;
      }
      if (parsedMax !== null) {
        filter.price.$lte = parsedMax;
      }
    }

    // ── 5. Execute Count & Paginated Query ─────────
    const totalProducts = await Product.countDocuments(filter);
    const totalPages = totalProducts === 0 ? 0 : Math.ceil(totalProducts / limitNum);
    const skip = (pageNum - 1) * limitNum;

    const products = await Product.find(filter)
      .sort(sortQuery)
      .skip(skip)
      .limit(limitNum)
      .populate('seller', 'name email');

    const hasNextPage = pageNum < totalPages;
    const hasPrevPage = pageNum > 1 && (totalPages > 0 && pageNum <= totalPages + 1);

    // ── 6. Send Standardized JSON Response ────────
    return res.status(200).json({
      success: true,
      count: products.length,
      totalProducts,
      currentPage: pageNum,
      totalPages,
      hasNextPage,
      hasPrevPage,
      products,
    });
  } catch (error) {
    console.error('getProducts controller error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error while fetching products.',
    });
  }
};

// ─────────────────────────────────────────────────
// @desc    Get single product by ID or slug
// @route   GET /api/products/:id
// @access  Public
// ─────────────────────────────────────────────────
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    let product = null;
    if (mongoose.Types.ObjectId.isValid(id)) {
      product = await Product.findById(id).populate('seller', 'name email');
    } else {
      // Try finding by slug
      product = await Product.findOne({ slug: id }).populate('seller', 'name email');
    }

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found.',
      });
    }

    // If product is inactive, only allow seller/admin to view it
    if (!product.isActive) {
      const isPrivileged = req.user && (req.user.role === 'admin' || (product.seller && product.seller._id.toString() === req.user._id.toString()));
      if (!isPrivileged) {
        return res.status(404).json({
          success: false,
          message: 'Product is currently not available.',
        });
      }
    }

    return res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    console.error('getProductById controller error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error while retrieving product.',
    });
  }
};

// ─────────────────────────────────────────────────
// @desc    Create a new product
// @route   POST /api/products
// @access  Private (Admin, Seller)
// ─────────────────────────────────────────────────
const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      brand,
      category,
      price,
      originalPrice,
      discount = 0,
      images = [],
      stock = 0,
      sku,
      status = 'published',
      specifications,
      isActive = true,
    } = req.body;

    // Basic required fields validation
    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Product name is required.' });
    }
    if (!description || !description.trim()) {
      return res.status(400).json({ success: false, message: 'Product description is required.' });
    }
    if (!brand || !brand.trim()) {
      return res.status(400).json({ success: false, message: 'Brand name is required.' });
    }
    if (!category || !category.trim()) {
      return res.status(400).json({ success: false, message: 'Category is required.' });
    }
    if (price === undefined || price === null || isNaN(Number(price)) || Number(price) < 0) {
      return res.status(400).json({ success: false, message: 'Valid non-negative price is required.' });
    }

    const numericPrice = Number(price);
    const numericOriginalPrice = originalPrice !== undefined ? Number(originalPrice) : numericPrice;
    if (isNaN(numericOriginalPrice) || numericOriginalPrice < 0) {
      return res.status(400).json({ success: false, message: 'Original price cannot be negative.' });
    }

    const numericDiscount = Number(discount);
    if (isNaN(numericDiscount) || numericDiscount < 0 || numericDiscount > 100) {
      return res.status(400).json({ success: false, message: 'Discount must be between 0 and 100.' });
    }

    const numericStock = Number(stock);
    if (isNaN(numericStock) || numericStock < 0) {
      return res.status(400).json({ success: false, message: 'Stock quantity cannot be negative.' });
    }

    const product = new Product({
      name: name.trim(),
      description: description.trim(),
      brand: brand.trim(),
      category: category.trim(),
      price: numericPrice,
      originalPrice: numericOriginalPrice,
      discount: numericDiscount,
      images: Array.isArray(images) ? images : [],
      stock: numericStock,
      sku: sku ? sku.trim().toUpperCase() : undefined,
      status,
      specifications,
      isActive: Boolean(isActive),
      seller: req.user ? req.user._id : undefined,
    });

    const savedProduct = await product.save();

    return res.status(201).json({
      success: true,
      message: 'Product created successfully.',
      product: savedProduct,
    });
  } catch (error) {
    console.error('createProduct controller error:', error);
    if (error.code === 11000) {
      const duplicateField = Object.keys(error.keyPattern || {})[0] || 'field';
      return res.status(400).json({
        success: false,
        message: `Duplicate value entered for ${duplicateField}. Must be unique.`,
      });
    }
    return res.status(500).json({
      success: false,
      message: error.message || 'Internal server error while creating product.',
    });
  }
};

// ─────────────────────────────────────────────────
// @desc    Update an existing product
// @route   PUT /api/products/:id
// @access  Private (Admin, Seller - owner)
// ─────────────────────────────────────────────────
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid product ID format.' });
    }

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    // Role check: Admin can update any, seller can only update own product
    if (req.user.role !== 'admin') {
      if (!product.seller || product.seller.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          success: false,
          message: 'Forbidden: You do not have permission to update this product.',
        });
      }
    }

    const allowedUpdates = [
      'name',
      'description',
      'brand',
      'category',
      'price',
      'originalPrice',
      'discount',
      'images',
      'stock',
      'sku',
      'status',
      'specifications',
      'isActive',
    ];

    allowedUpdates.forEach((field) => {
      if (req.body[field] !== undefined) {
        if (['price', 'originalPrice', 'discount', 'stock'].includes(field)) {
          product[field] = Number(req.body[field]);
        } else {
          product[field] = req.body[field];
        }
      }
    });

    // Validate numeric fields if updated
    if (product.price < 0) {
      return res.status(400).json({ success: false, message: 'Price cannot be negative.' });
    }
    if (product.stock < 0) {
      return res.status(400).json({ success: false, message: 'Stock cannot be negative.' });
    }
    if (product.discount < 0 || product.discount > 100) {
      return res.status(400).json({ success: false, message: 'Discount must be between 0 and 100.' });
    }

    // Recalculate discountedPrice
    if (product.discount > 0) {
      product.discountedPrice = Math.round(product.price * (1 - product.discount / 100) * 100) / 100;
    } else {
      product.discountedPrice = product.price;
    }

    const updatedProduct = await product.save();

    return res.status(200).json({
      success: true,
      message: 'Product updated successfully.',
      product: updatedProduct,
    });
  } catch (error) {
    console.error('updateProduct controller error:', error);
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Duplicate value conflict with another product.',
      });
    }
    return res.status(500).json({
      success: false,
      message: error.message || 'Internal server error while updating product.',
    });
  }
};

// ─────────────────────────────────────────────────
// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private (Admin, Seller - owner)
// ─────────────────────────────────────────────────
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid product ID format.' });
    }

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    // Role check: Admin can delete any, seller can only delete own product
    if (req.user.role !== 'admin') {
      if (!product.seller || product.seller.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          success: false,
          message: 'Forbidden: You do not have permission to delete this product.',
        });
      }
    }

    await Product.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: 'Product deleted successfully.',
    });
  } catch (error) {
    console.error('deleteProduct controller error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error while deleting product.',
    });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
