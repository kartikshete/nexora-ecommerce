import axiosInstance from '../api/axiosInstance';

/**
 * Product Service for NEXORA API
 * Connects frontend with backend /api/products endpoints.
 */
export const productService = {
  /**
   * Fetch paginated products with search, category, price range, and sort
   * @param {Object} params - { search, category, minPrice, maxPrice, sort, page, limit }
   */
  getProducts: async (params = {}) => {
    const queryParams = new URLSearchParams();

    if (params.search && params.search.trim()) {
      queryParams.append('search', params.search.trim());
    }
    if (params.category && params.category !== 'all') {
      queryParams.append('category', params.category);
    }
    if (params.minPrice !== undefined && params.minPrice !== null && params.minPrice !== '') {
      queryParams.append('minPrice', params.minPrice);
    }
    if (params.maxPrice !== undefined && params.maxPrice !== null && params.maxPrice !== '') {
      queryParams.append('maxPrice', params.maxPrice);
    }
    if (params.sort) {
      queryParams.append('sort', params.sort);
    }
    if (params.page) {
      queryParams.append('page', params.page);
    }
    if (params.limit) {
      queryParams.append('limit', params.limit);
    }

    const queryString = queryParams.toString();
    const url = queryString ? `/api/products?${queryString}` : '/api/products';

    const response = await axiosInstance.get(url);
    return response.data;
  },

  /**
   * Get product details by ID or slug
   * @param {string} idOrSlug
   */
  getProductById: async (idOrSlug) => {
    const response = await axiosInstance.get(`/api/products/${idOrSlug}`);
    return response.data;
  },

  /**
   * Create new product (Admin or Seller)
   * @param {Object} productData
   */
  createProduct: async (productData) => {
    const response = await axiosInstance.post('/api/products', productData);
    return response.data;
  },

  /**
   * Update existing product (Admin or Seller owner)
   * @param {string} id
   * @param {Object} updateData
   */
  updateProduct: async (id, updateData) => {
    const response = await axiosInstance.put(`/api/products/${id}`, updateData);
    return response.data;
  },

  /**
   * Delete product (Admin or Seller owner)
   * @param {string} id
   */
  deleteProduct: async (id) => {
    const response = await axiosInstance.delete(`/api/products/${id}`);
    return response.data;
  },
};

export default productService;
