const Product = require('../models/Product');
const { getProducts } = require('../controllers/productController');

// ─── Test Dataset ─────────────────────────────────
const sampleData = [
  { _id: '1', name: 'iPhone 15 Pro', brand: 'Apple', category: 'Electronics', price: 120000, isActive: true, createdAt: new Date('2026-01-01T10:00:00Z') },
  { _id: '2', name: 'iPhone 14', brand: 'Apple', category: 'Electronics', price: 65000, isActive: true, createdAt: new Date('2025-01-01T10:00:00Z') },
  { _id: '3', name: 'Galaxy S24 Ultra', brand: 'Samsung', category: 'Electronics', price: 110000, isActive: true, createdAt: new Date('2026-02-01T10:00:00Z') },
  { _id: '4', name: 'Air Jordan 1 Retro', brand: 'Nike', category: 'Footwear', price: 16000, isActive: true, createdAt: new Date('2026-03-01T10:00:00Z') },
  { _id: '5', name: 'Ultraboost Light', brand: 'Adidas', category: 'Footwear', price: 18000, isActive: true, createdAt: new Date('2026-04-01T10:00:00Z') },
  { _id: '6', name: 'MacBook Air M3', brand: 'Apple', category: 'Electronics', price: 115000, isActive: true, createdAt: new Date('2026-05-01T10:00:00Z') },
  { _id: '7', name: 'Running Tee', brand: 'Nike', category: 'Apparel', price: 2500, isActive: true, createdAt: new Date('2026-06-01T10:00:00Z') },
  { _id: '8', name: 'Inactive Test Item', brand: 'Apple', category: 'Electronics', price: 10000, isActive: false, createdAt: new Date('2026-07-01T10:00:00Z') },
];

// Helper to filter sample dataset mimicking MongoDB query
function evaluateFilter(doc, filter) {
  if (filter.isActive !== undefined && doc.isActive !== filter.isActive) return false;
  
  if (filter.category) {
    if (!filter.category.test(doc.category)) return false;
  }

  if (filter.$or) {
    const matchesOr = filter.$or.some(clause => {
      if (clause.name && clause.name.test(doc.name)) return true;
      if (clause.brand && clause.brand.test(doc.brand)) return true;
      return false;
    });
    if (!matchesOr) return false;
  }

  if (filter.price) {
    if (filter.price.$gte !== undefined && doc.price < filter.price.$gte) return false;
    if (filter.price.$lte !== undefined && doc.price > filter.price.$lte) return false;
  }

  return true;
}

// Mock Product methods for deterministic offline testing
Product.countDocuments = async function(filter) {
  const filtered = sampleData.filter(d => evaluateFilter(d, filter));
  return filtered.length;
};

Product.find = function(filter) {
  let filtered = sampleData.filter(d => evaluateFilter(d, filter));
  
  const queryObj = {
    _sort: null,
    _skip: 0,
    _limit: 12,
    sort(s) {
      this._sort = s;
      if (s.price === 1) filtered.sort((a, b) => a.price - b.price);
      else if (s.price === -1) filtered.sort((a, b) => b.price - a.price);
      else if (s.createdAt === -1) filtered.sort((a, b) => b.createdAt - a.createdAt);
      return this;
    },
    skip(n) {
      this._skip = n;
      return this;
    },
    limit(n) {
      this._limit = n;
      return this;
    },
    populate() {
      return this;
    },
    then(resolve, reject) {
      const res = filtered.slice(this._skip, this._skip + this._limit);
      return Promise.resolve(res).then(resolve, reject);
    }
  };
  return queryObj;
};

// Mock Express response helper
function createMockRes() {
  const res = {
    statusCode: 200,
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(data) {
      this.body = data;
      return this;
    }
  };
  return res;
}

// ─── Test Runner ──────────────────────────────────
async function runTests() {
  console.log('🧪 Starting NEXORA Day 6 Product Listing API Tests...\n');
  let passed = 0;
  let failed = 0;

  async function test(name, query, expectedCheck) {
    try {
      const req = { query };
      const res = createMockRes();
      await getProducts(req, res);
      expectedCheck(res);
      console.log(`  ✅ PASS: ${name}`);
      passed++;
    } catch (err) {
      console.error(`  ❌ FAIL: ${name}`);
      console.error(`     Error: ${err.message}`);
      failed++;
    }
  }

  // 1. Fetch all active products
  await test('1. Fetch all active products (excludes inactive)', {}, (res) => {
    if (res.statusCode !== 200) throw new Error(`Expected 200, got ${res.statusCode}`);
    if (res.body.totalProducts !== 7) throw new Error(`Expected 7 active products, got ${res.body.totalProducts}`);
    if (res.body.products.some(p => !p.isActive)) throw new Error('Inactive product included in results');
    if (!res.body.currentPage || res.body.currentPage !== 1) throw new Error('Invalid currentPage');
  });

  // 2. Search by product name
  await test('2. Search by product name ("iPhone")', { search: 'iphone' }, (res) => {
    if (res.statusCode !== 200) throw new Error(`Expected 200, got ${res.statusCode}`);
    if (res.body.totalProducts !== 2) throw new Error(`Expected 2 iPhone matches, got ${res.body.totalProducts}`);
    if (!res.body.products.every(p => p.name.includes('iPhone'))) throw new Error('Result does not match search name');
  });

  // 3. Search by brand
  await test('3. Search by brand ("Samsung")', { search: 'Samsung' }, (res) => {
    if (res.statusCode !== 200) throw new Error(`Expected 200, got ${res.statusCode}`);
    if (res.body.totalProducts !== 1) throw new Error(`Expected 1 Samsung match, got ${res.body.totalProducts}`);
    if (res.body.products[0].brand !== 'Samsung') throw new Error('Brand mismatch');
  });

  // 4. Filter by category
  await test('4. Filter by category ("Footwear")', { category: 'Footwear' }, (res) => {
    if (res.statusCode !== 200) throw new Error(`Expected 200, got ${res.statusCode}`);
    if (res.body.totalProducts !== 2) throw new Error(`Expected 2 Footwear items, got ${res.body.totalProducts}`);
    if (!res.body.products.every(p => p.category === 'Footwear')) throw new Error('Non-footwear items returned');
  });

  // 5. Filter by price range
  await test('5. Filter by price range (minPrice: 15000, maxPrice: 70000)', { minPrice: '15000', maxPrice: '70000' }, (res) => {
    if (res.statusCode !== 200) throw new Error(`Expected 200, got ${res.statusCode}`);
    if (!res.body.products.every(p => p.price >= 15000 && p.price <= 70000)) throw new Error('Price out of bounds');
    if (res.body.totalProducts !== 3) throw new Error(`Expected 3 products, got ${res.body.totalProducts}`);
  });

  // 6a. Sort by price ascending
  await test('6a. Sort by price ascending', { sort: 'price_asc' }, (res) => {
    if (res.statusCode !== 200) throw new Error(`Expected 200, got ${res.statusCode}`);
    const prices = res.body.products.map(p => p.price);
    for (let i = 0; i < prices.length - 1; i++) {
      if (prices[i] > prices[i + 1]) throw new Error(`Prices not ascending: ${prices}`);
    }
  });

  // 6b. Sort by price descending
  await test('6b. Sort by price descending', { sort: 'price_desc' }, (res) => {
    if (res.statusCode !== 200) throw new Error(`Expected 200, got ${res.statusCode}`);
    const prices = res.body.products.map(p => p.price);
    for (let i = 0; i < prices.length - 1; i++) {
      if (prices[i] < prices[i + 1]) throw new Error(`Prices not descending: ${prices}`);
    }
  });

  // 7. Sort by newest
  await test('7. Sort by newest products', { sort: 'newest' }, (res) => {
    if (res.statusCode !== 200) throw new Error(`Expected 200, got ${res.statusCode}`);
    const dates = res.body.products.map(p => new Date(p.createdAt).getTime());
    for (let i = 0; i < dates.length - 1; i++) {
      if (dates[i] < dates[i + 1]) throw new Error(`Dates not descending (newest first)`);
    }
  });

  // 8. Combine multiple filters (search + category + price range + sort)
  await test('8. Combine multiple filters (Nike, Apparel, 2000-5000, price_asc)', {
    search: 'Nike',
    category: 'Apparel',
    minPrice: '2000',
    maxPrice: '5000',
    sort: 'price_asc'
  }, (res) => {
    if (res.statusCode !== 200) throw new Error(`Expected 200, got ${res.statusCode}`);
    if (res.body.totalProducts !== 1) throw new Error(`Expected 1 match, got ${res.body.totalProducts}`);
    if (res.body.products[0].name !== 'Running Tee') throw new Error('Incorrect product returned');
  });

  // 9. Navigate between pages (Pagination metadata)
  await test('9. Pagination navigation (limit: 2, page: 2)', { limit: '2', page: '2' }, (res) => {
    if (res.statusCode !== 200) throw new Error(`Expected 200, got ${res.statusCode}`);
    if (res.body.currentPage !== 2) throw new Error(`Expected currentPage 2, got ${res.body.currentPage}`);
    if (res.body.totalPages !== 4) throw new Error(`Expected totalPages 4, got ${res.body.totalPages}`);
    if (res.body.hasNextPage !== true) throw new Error('Expected hasNextPage to be true');
    if (res.body.hasPrevPage !== true) throw new Error('Expected hasPrevPage to be true');
    if (res.body.products.length !== 2) throw new Error(`Expected 2 products, got ${res.body.products.length}`);
  });

  // 10. Request an invalid page
  await test('10. Request an invalid page (page: -5)', { page: '-5' }, (res) => {
    if (res.statusCode !== 400) throw new Error(`Expected 400 Bad Request, got ${res.statusCode}`);
    if (res.body.success !== false) throw new Error('Expected success: false');
    if (!res.body.message.includes('positive integer')) throw new Error(`Unexpected error message: ${res.body.message}`);
  });

  // 11a. Invalid price range (minPrice > maxPrice)
  await test('11a. Invalid price range (minPrice > maxPrice)', { minPrice: '50000', maxPrice: '10000' }, (res) => {
    if (res.statusCode !== 400) throw new Error(`Expected 400, got ${res.statusCode}`);
    if (res.body.success !== false) throw new Error('Expected success: false');
    if (!res.body.message.includes('greater than maxPrice')) throw new Error(`Unexpected error message: ${res.body.message}`);
  });

  // 11b. Negative price validation
  await test('11b. Negative price parameter (minPrice: -100)', { minPrice: '-100' }, (res) => {
    if (res.statusCode !== 400) throw new Error(`Expected 400, got ${res.statusCode}`);
    if (res.body.success !== false) throw new Error('Expected success: false');
    if (!res.body.message.includes('non-negative number')) throw new Error(`Unexpected error message: ${res.body.message}`);
  });

  // 11c. Invalid sort option
  await test('11c. Invalid sort option (sort: invalid_sort)', { sort: 'invalid_sort' }, (res) => {
    if (res.statusCode !== 400) throw new Error(`Expected 400, got ${res.statusCode}`);
    if (res.body.success !== false) throw new Error('Expected success: false');
    if (!res.body.message.includes('Invalid sort parameter')) throw new Error(`Unexpected message: ${res.body.message}`);
  });

  // 12. Test empty search results
  await test('12. Empty search results (no matching keyword)', { search: 'nonexistentproductxyz123' }, (res) => {
    if (res.statusCode !== 200) throw new Error(`Expected 200, got ${res.statusCode}`);
    if (res.body.totalProducts !== 0) throw new Error(`Expected totalProducts 0, got ${res.body.totalProducts}`);
    if (res.body.totalPages !== 0) throw new Error(`Expected totalPages 0, got ${res.body.totalPages}`);
    if (res.body.hasNextPage !== false) throw new Error('Expected hasNextPage to be false');
    if (res.body.hasPrevPage !== false) throw new Error('Expected hasPrevPage to be false');
    if (res.body.products.length !== 0) throw new Error(`Expected empty products array, got ${res.body.products.length}`);
  });

  console.log(`\n========================================`);
  console.log(`🏁 Test Summary: ${passed} Passed, ${failed} Failed`);
  console.log(`========================================\n`);

  if (failed > 0) process.exit(1);
}

runTests();
