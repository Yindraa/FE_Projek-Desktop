import axios from 'axios';

// Create axios instance for waiter services
const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const waiterAPI = axios.create({
  baseURL: baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor to add authentication if needed
waiterAPI.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
waiterAPI.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('Waiter API Error:', error);
    
    // Handle specific error cases
    if (error.response?.status === 401) {
      // Handle unauthorized access
      console.warn('Unauthorized access - token may be expired');
    } else if (error.response?.status === 404) {
      console.warn('Resource not found');
    } else if (error.response?.status >= 500) {
      console.error('Server error occurred');
    }
    
    return Promise.reject(error);
  }
);

// Waiter Service Functions
export const waiterService = {
  // ===== MENU SERVICES =====
  
  /**
   * Get all available menu items
   * @returns {Promise<Array>} Array of menu items
   */  getMenuItems: async () => {
    try {
      const response = await waiterAPI.get('/menu/public/items');
      // Filter only available items - API uses 'status: AVAILABLE' instead of 'isAvailable'
      const availableItems = response.data
        .filter(item => item.status === 'AVAILABLE')
        .map(item => ({
          ...item,
          // Convert price string to number for consistent handling
          price: typeof item.price === 'string' ? parseFloat(item.price) : item.price,
          // Add isAvailable for backward compatibility
          isAvailable: item.status === 'AVAILABLE'
        }));
      return availableItems;
    } catch (error) {
      console.error('Failed to fetch menu items:', error);
      throw new Error('Failed to load menu items. Please try again.');
    }
  },

  /**
   * Get a specific menu item by ID
   * @param {string} id - Menu item ID
   * @returns {Promise<Object>} Menu item details
   */
  getMenuItem: async (id) => {
    try {
      const response = await waiterAPI.get(`/menu/public/item/${id}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch menu item:', error);
      throw new Error('Failed to load menu item details.');
    }
  },

  // ===== ORDER SERVICES =====
  
  /**
   * Create a new order
   * @param {Object} orderData - Order information
   * @returns {Promise<Object>} Created order
   */
  createOrder: async (orderData) => {
    try {
      const response = await waiterAPI.post('/orders', orderData);
      return response.data;
    } catch (error) {
      console.error('Failed to create order:', error);
      throw new Error('Failed to create order. Please try again.');
    }
  },

  /**
   * Update an existing order
   * @param {string} orderId - Order ID
   * @param {Object} orderData - Updated order information
   * @returns {Promise<Object>} Updated order
   */
  updateOrder: async (orderId, orderData) => {
    try {
      const response = await waiterAPI.put(`/orders/${orderId}`, orderData);
      return response.data;
    } catch (error) {
      console.error('Failed to update order:', error);
      throw new Error('Failed to update order. Please try again.');
    }
  },

  /**
   * Get all orders for waiter view
   * @param {Object} filters - Optional filters (status, table, etc.)
   * @returns {Promise<Array>} Array of orders
   */
  getOrders: async (filters = {}) => {
    try {
      const response = await waiterAPI.get('/orders', { params: filters });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      throw new Error('Failed to load orders. Please try again.');
    }
  },

  /**
   * Get a specific order by ID
   * @param {string} orderId - Order ID
   * @returns {Promise<Object>} Order details
   */
  getOrder: async (orderId) => {
    try {
      const response = await waiterAPI.get(`/orders/${orderId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch order:', error);
      throw new Error('Failed to load order details.');
    }
  },

  /**
   * Update order status
   * @param {string} orderId - Order ID
   * @param {string} status - New status
   * @returns {Promise<Object>} Updated order
   */
  updateOrderStatus: async (orderId, status) => {
    try {
      const response = await waiterAPI.patch(`/orders/${orderId}/status`, { status });
      return response.data;
    } catch (error) {
      console.error('Failed to update order status:', error);
      throw new Error('Failed to update order status. Please try again.');
    }
  },
  // ===== TABLE SERVICES =====
  
  /**
   * Get all tables
   * @returns {Promise<Array>} Array of tables
   */  getTables: async () => {
    try {
      const response = await waiterAPI.get('/waiter/tables');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch tables:', error);
      throw new Error('Failed to load tables. Please try again.');
    }
  },

  /**
   * Get specific table details by table number
   * @param {number} tableNumber - Table number
   * @returns {Promise<Object>} Table details with active order if any
   */  getTableDetails: async (tableNumber) => {
    try {
      const response = await waiterAPI.get(`/waiter/table/${tableNumber}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch table ${tableNumber} details:`, error);
      throw new Error('Failed to load table details. Please try again.');
    }
  },

  /**
   * Update table status
   * @param {string} tableId - Table ID
   * @param {string} status - New status
   * @returns {Promise<Object>} Updated table
   */
  updateTableStatus: async (tableId, status) => {
    try {
      const response = await waiterAPI.patch(`/tables/${tableId}/status`, { status });
      return response.data;
    } catch (error) {
      console.error('Failed to update table status:', error);
      throw new Error('Failed to update table status. Please try again.');
    }
  },

  /**
   * Seat customers at a table
   * @param {string} tableId - Table ID
   * @param {Object} customerData - Customer information
   * @returns {Promise<Object>} Updated table
   */
  seatCustomers: async (tableId, customerData) => {
    try {
      const response = await waiterAPI.post(`/tables/${tableId}/seat`, customerData);
      return response.data;
    } catch (error) {
      console.error('Failed to seat customers:', error);
      throw new Error('Failed to seat customers. Please try again.');
    }
  },

  // ===== PAYMENT SERVICES =====
  
  /**
   * Process payment for an order
   * @param {string} orderId - Order ID
   * @param {Object} paymentData - Payment information
   * @returns {Promise<Object>} Payment result
   */
  processPayment: async (orderId, paymentData) => {
    try {
      const response = await waiterAPI.post(`/orders/${orderId}/payment`, paymentData);
      return response.data;
    } catch (error) {
      console.error('Failed to process payment:', error);
      throw new Error('Failed to process payment. Please try again.');
    }
  },

  // ===== UTILITY SERVICES =====
  
  /**
   * Group menu items by category
   * @param {Array} menuItems - Array of menu items
   * @returns {Object} Grouped menu items by category
   */
  groupMenuItemsByCategory: (menuItems) => {
    return menuItems.reduce((acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = [];
      }
      acc[item.category].push(item);
      return acc;
    }, {});
  },

  /**
   * Format price to Indonesian Rupiah
   * @param {number} price - Price amount
   * @returns {string} Formatted price string
   */
  formatPrice: (price) => {
    return `Rp ${price.toLocaleString('id-ID')}`;
  },

  /**
   * Parse price from string (handles both $ and Rp formats)
   * @param {string|number} priceString - Price string or number
   * @returns {number} Parsed price number
   */
  parsePrice: (priceString) => {
    if (typeof priceString === 'number') {
      return priceString;
    }
    
    if (typeof priceString === 'string') {
      return Number.parseFloat(
        priceString
          .replace('$', '')
          .replace('Rp', '')
          .replace(/\./g, '') // Remove thousand separators
          .replace(/,/g, '.') // Convert decimal separator if needed
          || '0'
      );
    }
    
    return 0;
  }
};

export default waiterService;
