const Product = require('../models/Product');

// ─────────────────────────────────────────────────
// @desc    Get all products (with search, filter, sort, pagination)
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

    // 1. Build Query Filter
    // Always exclude inactive products from public search
    const filter = { isActive: true };

    // Search by name or brand (case-insensitive)
    if (search) {
      const searchRegex = new RegExp(search, 'i');
      filter.$or = [
        { name: searchRegex },
        { brand: searchRegex },
      ];
    }

    // Filter by category (case-insensitive exact match)
    if (category) {
      filter.category = new RegExp(`^${category}$`, 'i');
    }

    // Filter by price range
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice && !isNaN(minPrice)) {
        filter.price.$gte = Number(minPrice);
      }
      if (maxPrice && !isNaN(maxPrice)) {
        filter.price.$lte = Number(maxPrice);
      }
    }

    // 2. Build Sort Order
    let sortQuery = { createdAt: -1 }; // default: newest first
    if (sort === 'price_asc') {
      sortQuery = { price: 1 };
    } else if (sort === 'price_desc') {
      sortQuery = { price: -1 };
    } else if (sort === 'newest') {
      sortQuery = { createdAt: -1 };
    }

    // 3. Pagination Configuration
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    // 4. Execute Query
    const products = await Product.find(filter)
      .sort(sortQuery)
      .skip(skip)
      .limit(limitNum)
      // Optionally populate seller if needed (excluding password)
      .populate('seller', 'name email');

    const totalProducts = await Product.countDocuments(filter);
    const totalPages = Math.ceil(totalProducts / limitNum);

    // 5. Send Response
    res.status(200).json({
      success: true,
      count: products.length,
      total: totalProducts,
      page: pageNum,
      totalPages,
      products,
    });
  } catch (error) {
    console.error('GetProducts error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch products. Invalid query parameters or server error.',
    });
  }
};

module.exports = {
  getProducts,
};
