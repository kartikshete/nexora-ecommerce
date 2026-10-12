const mongoose = require('mongoose');
const {
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');
const Product = require('../models/Product');
const { authorizeRoles } = require('../middleware/authMiddleware');

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
    },
  };
  return res;
}

async function runTests() {
  console.log('🧪 Starting NEXORA Day 8 Product CRUD & RBAC Tests...\n');
  let passed = 0;
  let failed = 0;

  function assert(condition, testName) {
    if (condition) {
      console.log(`  ✅ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${testName}`);
      failed++;
    }
  }

  // In-memory product collection for test
  const testDb = [];

  // Mock Product methods for CRUD testing
  Product.findById = function (id) {
    const doc = testDb.find((p) => p._id.toString() === id.toString());
    return {
      populate: () => Promise.resolve(doc || null),
      then: (fn) => Promise.resolve(doc || null).then(fn),
    };
  };

  Product.findOne = function (query) {
    const doc = testDb.find((p) => query.slug && p.slug === query.slug);
    return {
      populate: () => Promise.resolve(doc || null),
      then: (fn) => Promise.resolve(doc || null).then(fn),
    };
  };

  Product.findByIdAndDelete = async function (id) {
    const idx = testDb.findIndex((p) => p._id.toString() === id.toString());
    if (idx !== -1) testDb.splice(idx, 1);
    return true;
  };

  // Mock constructor & save
  function MockProductDoc(data) {
    Object.assign(this, data);
    this._id = new mongoose.Types.ObjectId();
    this.createdAt = new Date();
    this.save = async function () {
      const idx = testDb.findIndex((p) => p._id.toString() === this._id.toString());
      if (idx !== -1) {
        testDb[idx] = this;
      } else {
        testDb.push(this);
      }
      return this;
    };
  }

  // Test 1: RBAC Middleware Blocks Customer
  {
    const req = { user: { role: 'customer' } };
    const res = createMockRes();
    let nextCalled = false;
    const middleware = authorizeRoles('admin', 'seller');
    middleware(req, res, () => { nextCalled = true; });

    assert(res.statusCode === 403 && !nextCalled, '1. RBAC blocks customer from admin/seller routes');
  }

  // Test 2: RBAC Allows Admin
  {
    const req = { user: { role: 'admin' } };
    const res = createMockRes();
    let nextCalled = false;
    const middleware = authorizeRoles('admin', 'seller');
    middleware(req, res, () => { nextCalled = true; });

    assert(nextCalled === true, '2. RBAC allows admin access');
  }

  // Test 3: Create Product Validation (missing name)
  {
    const req = {
      body: { price: 100 },
      user: { _id: new mongoose.Types.ObjectId(), role: 'admin' },
    };
    const res = createMockRes();
    await createProduct(req, res);

    assert(res.statusCode === 400 && res.body.message.includes('Product name is required'), '3. Validation catches missing product name');
  }

  // Test 4: Create Product Validation (negative price)
  {
    const req = {
      body: { name: 'Test Product', description: 'desc', brand: 'BrandX', category: 'Tech', price: -50 },
      user: { _id: new mongoose.Types.ObjectId(), role: 'admin' },
    };
    const res = createMockRes();
    await createProduct(req, res);

    assert(res.statusCode === 400 && res.body.message.includes('Valid non-negative price'), '4. Validation catches negative price');
  }

  // Test 5: Successfully Create Product
  let createdId = null;
  {
    // Temporarily replace model instantiation
    const originalModel = Product;
    Product.prototype.save = async function () {
      if (!this._id) this._id = new mongoose.Types.ObjectId();
      this.slug = this.slug || 'test-smart-watch-xyz12';
      this.discountedPrice = Math.round(this.price * (1 - this.discount / 100) * 100) / 100;
      const existingIdx = testDb.findIndex((p) => p._id.toString() === this._id.toString());
      if (existingIdx !== -1) {
        testDb[existingIdx] = this;
      } else {
        testDb.push(this);
      }
      return this;
    };

    const sellerId = new mongoose.Types.ObjectId();
    const req = {
      body: {
        name: 'Test Smart Watch',
        description: 'Next-gen display smartwatch',
        brand: 'SmartBrand',
        category: 'Electronics',
        price: 200,
        originalPrice: 250,
        discount: 20,
        stock: 50,
      },
      user: { _id: sellerId, role: 'seller' },
    };
    const res = createMockRes();
    await createProduct(req, res);

    createdId = res.body?.product?._id;
    assert(
      res.statusCode === 201 &&
      res.body.success === true &&
      res.body.product.discountedPrice === 160,
      '5. Product created successfully with accurate discounted price'
    );
  }

  // Test 6: Retrieve Product by ID
  {
    const req = { params: { id: createdId.toString() } };
    const res = createMockRes();
    await getProductById(req, res);

    assert(
      res.statusCode === 200 &&
      res.body.success === true &&
      res.body.product.name === 'Test Smart Watch',
      '6. Retrieve product by ObjectId'
    );
  }

  // Test 7: Retrieve Product by Slug
  {
    const req = { params: { id: 'test-smart-watch-xyz12' } };
    const res = createMockRes();
    await getProductById(req, res);

    assert(
      res.statusCode === 200 &&
      res.body.product.slug === 'test-smart-watch-xyz12',
      '7. Retrieve product by slug'
    );
  }

  // Test 8: Non-owner seller cannot update product
  {
    const unauthorizedSeller = { _id: new mongoose.Types.ObjectId(), role: 'seller' };
    const req = {
      params: { id: createdId.toString() },
      body: { price: 300 },
      user: unauthorizedSeller,
    };
    const res = createMockRes();
    await updateProduct(req, res);

    assert(res.statusCode === 403, '8. Unauthorized seller cannot update another seller\'s product');
  }

  // Test 9: Admin can update any product
  {
    const adminUser = { _id: new mongoose.Types.ObjectId(), role: 'admin' };
    const req = {
      params: { id: createdId.toString() },
      body: { price: 180, discount: 10 },
      user: adminUser,
    };
    const res = createMockRes();
    await updateProduct(req, res);

    assert(
      res.statusCode === 200 &&
      res.body.product.price === 180 &&
      res.body.product.discountedPrice === 162,
      '9. Admin updates product and discountedPrice recalculates'
    );
  }

  // Test 10: Delete Product
  {
    const adminUser = { _id: new mongoose.Types.ObjectId(), role: 'admin' };
    const req = {
      params: { id: createdId.toString() },
      user: adminUser,
    };
    const res = createMockRes();
    await deleteProduct(req, res);

    assert(
      res.statusCode === 200 &&
      testDb.length === 0,
      '10. Admin successfully deletes product'
    );
  }

  console.log('\n========================================');
  console.log(`🏁 Day 8 CRUD & RBAC Test Summary: ${passed} Passed, ${failed} Failed`);
  console.log('========================================\n');
}

runTests().catch(console.error);
