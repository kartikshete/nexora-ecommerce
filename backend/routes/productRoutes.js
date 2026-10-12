const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

// ── Public Routes ─────────────────────────────────
// @route   GET /api/products
// @desc    Get all active products with search, filter, sort & pagination
router.get('/', getProducts);

// @route   GET /api/products/:id
// @desc    Get single product by ObjectId or slug
router.get('/:id', getProductById);

// ── Protected Administrative & Seller Routes ───────
// @route   POST /api/products
// @desc    Create product (admin, seller)
router.post('/', protect, authorizeRoles('admin', 'seller'), createProduct);

// @route   PUT /api/products/:id
// @desc    Update product (admin, seller)
router.put('/:id', protect, authorizeRoles('admin', 'seller'), updateProduct);

// @route   DELETE /api/products/:id
// @desc    Delete product (admin, seller)
router.delete('/:id', protect, authorizeRoles('admin', 'seller'), deleteProduct);

module.exports = router;
