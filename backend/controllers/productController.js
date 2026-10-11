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
    // Strict requirement: return ONLY active products
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

module.exports = {
  getProducts,
};
