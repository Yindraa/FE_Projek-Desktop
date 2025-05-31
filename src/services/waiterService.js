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

// Utility function to map backend order to frontend format
export function mapOrderFromApi(order) {
  return {
    id: order.id,
    table: order.table?.tableNumber || order.table?.id || '-',
    customer: order.customerName || 'Walk-in',
    items: Array.isArray(order.orderItems)
      ? order.orderItems.map(oi => ({
          name: oi.menuItem?.name || '-',
          quantity: oi.quantity,
          price: oi.menuItem?.price || 0,
          notes: oi.notes || '',
        }))
      : [],
    total: typeof order.totalAmount === 'number' ? order.totalAmount : parseFloat(order.totalAmount) || 0,
    // Map BE status to FE status for UI logic and button visibility
    status: (() => {
      switch (order.status) {
        case 'RECEIVED': // Initial state, before sent to kitchen
          return 'pending'; // Show 'Send to Kitchen' button (Waiter)
        case 'IN_QUEUE':
          return 'in-queue'; // No button in Waiter, only visible in Chef
        case 'IN_PROCESS':
          return 'in-process'; // No button in Waiter, only visible in Chef
        case 'READY':
          return 'ready'; // Show 'Served' button (Waiter)
        case 'DELIVERED': // After ready, delivered to table
          return 'delivered'; // Show 'Process Payment' button (Waiter)
        case 'PENDING_PAYMENT':
          return 'pending-payment'; // No button, handled in Payments page
        case 'COMPLETED':
          return 'completed'; // No button
        default:
          return (order.status || '').toLowerCase();
      }
    })(),
    time: order.orderTime ? new Date(order.orderTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : '-',
    createdAt: order.createdAt,
    // Add other fields as needed
  };
}

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
   * @param {string} orderData.tableId - Table database ID (not table number)
   * @param {Array} orderData.items - Array of order items
   * @param {string} orderData.items[].menuItemId - Menu item database ID
   * @param {number} orderData.items[].quantity - Quantity of the item
   * @param {string} [orderData.items[].notes] - Optional notes for the item
   * @returns {Promise<Object>} Created order
   */
  createOrder: async (orderData) => {
    try {
      // Format request body according to API specification
      const requestBody = {
        tableId: orderData.tableId, // Table database ID
        items: orderData.items.map(item => ({
          menuItemId: item.menuItemId,
          quantity: item.quantity,
          notes: item.notes || '' // Optional notes
        }))
      };

      const response = await waiterAPI.post('/waiter/order', requestBody);
      return response.data;
    } catch (error) {
      console.error('Failed to create order:', error);
      
      // Handle specific API errors
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      
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
      // Use the correct endpoint for waiter orders
      const response = await waiterAPI.get('/waiter/orders', { params: filters });
      // Map API response to match frontend expectations
      const orders = Array.isArray(response.data) ? response.data.map(mapOrderFromApi) : [];
      return orders;
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
  
  updateOrderStatusByAction: async (orderId, action) => {
    try {
      const response = await waiterAPI.patch(`/waiter/order/${orderId}/status`, { action });
      // Map API response to FE format
      return mapOrderFromApi(response.data);
    } catch (error) {
      console.error('Failed to update order status by action:', error);
      throw new Error(
        error.response?.data?.message || 'Failed to update order status. Please try again.'
      );
    }
  },

  /**
   * Get order details for waiter (correct endpoint)
   * @param {string} orderId - Order ID
   * @returns {Promise<Object>} Order details
   */
  getOrderDetails: async (orderId) => {
    try {
      const response = await waiterAPI.get(`/waiter/order/${orderId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch order details:', error);
      throw new Error('Failed to load order details.');
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

/**
 * Get waiter dashboard stats (active tables, total tables, pending orders, today sales)
 * @returns {Promise<{totalTables:number, occupiedTables:number, pendingOrders:number, todaySales:number}>}
 */
export async function getWaiterDashboardStats() {
  const response = await waiterAPI.get('/waiter/dashboard-stats');
  return response.data;
}

export default waiterService;
