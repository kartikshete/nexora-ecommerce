const express = require('express');
const router = express.Router();
const { getProducts } = require('../controllers/productController');

// @route   GET /api/products
// @desc    Get all products with advanced filtering and pagination
// @access  Public
router.get('/', getProducts);

module.exports = router;
