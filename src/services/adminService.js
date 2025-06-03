// This file contains service functions that connect to a backend API
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

function getAuthHeader() {
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// Transform API menu item response to frontend format
function transformMenuItemResponse(apiItem) {
  // Normalize available to boolean
  let availableRaw = apiItem.availableForOrdering !== undefined ? apiItem.availableForOrdering : apiItem.available;
  let available = false;
  if (typeof availableRaw === 'boolean') {
    available = availableRaw;
  } else if (typeof availableRaw === 'string') {
    available = availableRaw.toLowerCase() === 'true' || availableRaw.toLowerCase() === 'available';
  } else if (typeof availableRaw === 'number') {
    available = !!availableRaw;
  }
  // Also check for status === 'AVAILABLE' (case-insensitive)
  if (!available && typeof apiItem.status === 'string') {
    available = apiItem.status.toUpperCase() === 'AVAILABLE';
  }
  return {
    ...apiItem,
    available,
    price: typeof apiItem.price === "string" ? parseFloat(apiItem.price) : apiItem.price,
    image: apiItem.imageUrl
      ? (apiItem.imageUrl.startsWith("http") ? apiItem.imageUrl : `${API_URL}${apiItem.imageUrl}`)
      : (apiItem.image
        ? (apiItem.image.startsWith("http") ? apiItem.image : `${API_URL}${apiItem.image}`)
        : null)
  };
}

function handleApiError(error, defaultMessage = "An error occurred") {
  if (error.response?.data?.message) {
    if (Array.isArray(error.response.data.message)) {
      throw new Error(error.response.data.message.join(", "));
    } else {
      throw new Error(error.response.data.message);
    }
  }
  throw new Error(defaultMessage);
}

// --- DASHBOARD API ---
export const fetchDashboardStats = async () => {
  try {
    const res = await axios.get(`${API_URL}/admin/dashboard`, { headers: getAuthHeader() });
    return res.data;
  } catch (error) {
    handleApiError(error, "Failed to fetch dashboard statistics");
  }
};

export const fetchRecentOrders = async () => {
  try {
    const res = await axios.get(`${API_URL}/admin/dashboard/recent-orders`, { headers: getAuthHeader() });
    return res.data;
  } catch (error) {
    handleApiError(error, "Failed to fetch recent orders");
  }
};

export const fetchPopularItems = async (timeRange = "week") => {
  try {
    const res = await axios.get(`${API_URL}/admin/dashboard/popular-items`, {
      params: { timeRange },
      headers: getAuthHeader(),
    });
    return res.data;
  } catch (error) {
    handleApiError(error, "Failed to fetch popular items");
  }
};

// --- MENU MANAGEMENT API ---
export const fetchMenuItems = async () => {
  try {
    const res = await axios.get(`${API_URL}/menu/items`, { headers: getAuthHeader() });
    return res.data.map(transformMenuItemResponse);
  } catch (error) {
    handleApiError(error, "Failed to fetch menu items");
  }
};

export const fetchMenuCategories = async () => {
  const defaultCategories = [
    "Appetizers",
    "Main Course",
    "Desserts",
    "Beverages",
    "Snacks"
  ];
  try {
    const menuItems = await fetchMenuItems();
    const extracted = menuItems
      .map(item => item.category)
      .filter(category => category && category.trim() !== "");
    // Merge and deduplicate
    const categories = Array.from(new Set([...defaultCategories, ...extracted]));
    return categories.sort();  } catch (error) {
    // If fetching menu items fails, return default categories
    return defaultCategories;
  }
};

export const fetchMenuItemById = async (id) => {
  try {
    const res = await axios.get(`${API_URL}/menu/item/${id}`, { headers: getAuthHeader() });
    return transformMenuItemResponse(res.data);
  } catch (error) {
    handleApiError(error, "Failed to fetch menu item details");
  }
};

// --- USER MANAGEMENT API ---
export const getAllUsers = async () => {
  try {
    const res = await axios.get(`${API_URL}/admin/users`, { headers: getAuthHeader() });
    return res.data;
  } catch (error) {
    handleApiError(error, "Failed to fetch users");
  }
};

export const createUserAPI = async (userData) => {
  try {
    const res = await axios.post(`${API_URL}/admin/users`, userData, { headers: getAuthHeader() });
    return res.data;
  } catch (error) {
    handleApiError(error, "Failed to create user");
  }
};

export const updateUserRole = async (id, role) => {
  try {
    const res = await axios.patch(
      `${API_URL}/admin/user/${id}/role`,
      { role },
      { headers: getAuthHeader() }
    );
    return res.data;
  } catch (error) {
    handleApiError(error, "Failed to update user role");
  }
};

export const deleteUserAPI = async (id) => {
  try {
    const res = await axios.delete(`${API_URL}/admin/user/${id}`, { headers: getAuthHeader() });
    return res.data;
  } catch (error) {
    handleApiError(error, "Failed to delete user");
  }
};

export const getUserDetail = async (id) => {
  try {
    const res = await axios.get(`${API_URL}/admin/user/${id}`, { headers: getAuthHeader() });
    return res.data;
  } catch (error) {
    handleApiError(error, "Failed to fetch user details");
  }
};

// --- MENU MANAGEMENT API ---
export const createMenuItemAPI = async (menuItem) => {
  try {
    if (menuItem.image && menuItem.image instanceof File) {
      const formData = new FormData();
      formData.append("name", menuItem.name);
      formData.append("category", menuItem.category);
      formData.append("price", parseFloat(menuItem.price).toString());
      if (menuItem.description) formData.append("description", menuItem.description);
      formData.append("availableForOrdering", menuItem.availableForOrdering === true ? "true" : "false");
      formData.append("imageFile", menuItem.image);
      const res = await axios.post(`${API_URL}/menu/item`, formData, { headers: getAuthHeader() });
      return transformMenuItemResponse(res.data);
    } else {
      const requestBody = {
        name: menuItem.name,
        category: menuItem.category,
        price: parseFloat(menuItem.price),
        description: menuItem.description,
        availableForOrdering: menuItem.availableForOrdering === true
      };
      const res = await axios.post(`${API_URL}/menu/item`, requestBody, {
        headers: { ...getAuthHeader(), "Content-Type": "application/json" },
      });
      return transformMenuItemResponse(res.data);
    }
  } catch (error) {
    handleApiError(error, "Failed to create menu item");
  }
};

export const updateMenuItemAPI = async (id, menuItem) => {
  try {
    // Always use FormData for PATCH, even if no image is uploaded
    const formData = new FormData();
    if (menuItem.name) formData.append("name", menuItem.name);
    if (menuItem.category) formData.append("category", menuItem.category);
    if (menuItem.price) formData.append("price", parseFloat(menuItem.price).toString());
    if (menuItem.description) formData.append("description", menuItem.description);
    // Selalu kirim availableForOrdering, walaupun false
    formData.append("availableForOrdering", menuItem.availableForOrdering === true ? "true" : "false");
    if (menuItem.image && menuItem.image instanceof File) {
      formData.append("imageFile", menuItem.image);
    }
    const res = await axios.patch(`${API_URL}/menu/item/${id}`, formData, { headers: getAuthHeader() });
    return transformMenuItemResponse(res.data);
  } catch (error) {
    handleApiError(error, "Failed to update menu item");
  }
};

export const deleteMenuItemAPI = async (id) => {
  try {
    const res = await axios.delete(`${API_URL}/menu/item/${id}`, { headers: getAuthHeader() });
    return transformMenuItemResponse(res.data);
  } catch (error) {
    // Handle specific delete menu item errors
    if (error.response?.status === 404) {
      throw new Error("Menu item not found. It may have already been deleted.");
    } else if (error.response?.status === 409) {
      throw new Error("Cannot delete menu item as it is referenced by existing orders. Please contact administrator.");
    }
    handleApiError(error, "Failed to delete menu item");
  }
};

// --- REPORTS API ---
export const fetchSalesData = async (timeRange = "week") => {
  try {
    const res = await axios.get(`${API_URL}/admin/reports/sales`, {
      params: { timeRange },
      headers: getAuthHeader(),
    });
    return res.data;
  } catch (error) {
    handleApiError(error, "Failed to fetch sales data");
  }
};

export const fetchStaffPerformance = async (timeRange = "week") => {
  try {
    const res = await axios.get(`${API_URL}/admin/reports/staff-performance`, {
      params: { timeRange },
      headers: getAuthHeader(),
    });
    return res.data;
  } catch (error) {
    handleApiError(error, "Failed to fetch staff performance data");
  }
};

export const generateSalesReport = async (timeRange = "week", format = "pdf") => {
  try {
    const res = await axios.post(`${API_URL}/admin/reports/sales/generate`, { timeRange, format }, { headers: getAuthHeader() });
    return res.data;
  } catch (error) {
    handleApiError(error, "Failed to generate sales report");
  }
};

export const generateItemsReport = async (timeRange = "week", format = "pdf") => {
  try {
    const res = await axios.post(`${API_URL}/admin/reports/items/generate`, { timeRange, format }, { headers: getAuthHeader() });
    return res.data;
  } catch (error) {
    handleApiError(error, "Failed to generate items report");
  }
};

export const generateStaffReport = async (timeRange = "week", format = "pdf") => {
  try {
    const res = await axios.post(`${API_URL}/admin/reports/staff/generate`, { timeRange, format }, { headers: getAuthHeader() });
    return res.data;
  } catch (error) {
    handleApiError(error, "Failed to generate staff report");
  }
};


// export const bulkUpdateMenuItems = async (updates) => {
//   try {
//     // NOTE: This endpoint may need to be implemented in the backend
//     const res = await axios.patch(`${API_URL}/menu/items/bulk`, updates, { headers: getAuthHeader() });
//     return res.data.map(transformMenuItemResponse);
//   } catch (error) {
//     handleApiError(error, "Failed to bulk update menu items");
//   }
// };

// export const searchMenuItems = async (query, filters = {}) => {
//   try {
//     // NOTE: This endpoint may need to be implemented in the backend
//     const params = { query, ...filters };
//     const res = await axios.get(`${API_URL}/menu/items/search`, { params, headers: getAuthHeader() });
//     return res.data.map(transformMenuItemResponse);
//   } catch (error) {
//     handleApiError(error, "Failed to search menu items");
//   }
// };
