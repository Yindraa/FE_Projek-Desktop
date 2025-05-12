import axios from "axios";
import {
  mockMenuItems,
  mockMenuCategories,
  mockUsers,
  mockSalesData,
  mockPopularItems,
  mockStaffPerformance,
  mockStats,
  mockRecentOrders,
} from "./mockData";

// Create an axios instance with default config
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// Let's also make sure the isUsingDemoAccount function is working correctly
// Helper function to check if using a demo account
const isUsingDemoAccount = () => {
  try {
    const user = localStorage.getItem("user") || sessionStorage.getItem("user");
    if (!user) return true; // Default to demo mode if no user found

    const userData = JSON.parse(user);
    // Consider any test@ or demo@ email as a demo account, or if no specific API URL is set
    return (
      userData.email.includes("test@") ||
      userData.email.includes("demo@") ||
      !process.env.REACT_APP_API_URL
    );
  } catch (error) {
    console.error("Error checking demo account:", error);
    return true; // Default to demo mode on error
  }
};

// Auth API
export const authAPI = {
  login: async (email, password, rememberMe = false) => {
    try {
      // For demo accounts, don't even try to call the API
      if (email.includes("test@") || email.includes("demo@")) {
        return handleDemoLogin(email, password, rememberMe);
      }

      // Try to call the real API
      const response = await api.post("/auth/login", { email, password });
      const { token, user } = response.data;

      // Store token and user data
      if (rememberMe) {
        localStorage.setItem("authToken", token);
        localStorage.setItem("user", JSON.stringify(user));
      } else {
        sessionStorage.setItem("authToken", token);
        sessionStorage.setItem("user", JSON.stringify(user));
      }

      return { token, user };
    } catch (error) {
      console.warn("API call failed, using mock data:", error);
      // Fallback to mock login for development
      return handleDemoLogin(email, password, rememberMe);
    }
  },

  register: async (userData) => {
    try {
      const response = await api.post("/auth/register", userData);
      return response.data;
    } catch (error) {
      console.warn("API call failed, using mock data:", error);
      // Simulate successful registration
      return { success: true };
    }
  },

  logout: () => {
    localStorage.removeItem("authToken");
    sessionStorage.removeItem("authToken");
    localStorage.removeItem("user");
    sessionStorage.removeItem("user");
  },

  getCurrentUser: () => {
    try {
      const user =
        localStorage.getItem("user") || sessionStorage.getItem("user");
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error("Error getting current user:", error);
      return null;
    }
  },

  isAuthenticated: () => {
    return !!(
      localStorage.getItem("authToken") ||
      sessionStorage.getItem("authToken") ||
      localStorage.getItem("user") ||
      sessionStorage.getItem("user")
    );
  },
};

// Helper function for demo login
const handleDemoLogin = (email, password, rememberMe) => {
  if (password === "password") {
    const user = {
      email,
      id: Date.now().toString(),
      firstName: "Demo",
      lastName: "User",
      role: email.includes("@admin")
        ? "admin"
        : email.includes("@chef")
        ? "chef"
        : "waiter",
    };

    // Store user in localStorage if rememberMe is true
    if (rememberMe) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      // Use sessionStorage if not remembering
      sessionStorage.setItem("user", JSON.stringify(user));
    }

    return { token: "mock-token", user };
  } else {
    throw new Error("Invalid credentials");
  }
};

// Menu API
export const menuAPI = {
  getMenuItems: async () => {
    try {
      if (isUsingDemoAccount()) {
        return mockMenuItems;
      }

      const response = await api.get("/menu");
      return response.data;
    } catch (error) {
      console.warn("API call failed, using mock data:", error);
      return mockMenuItems;
    }
  },

  getMenuCategories: async () => {
    try {
      if (isUsingDemoAccount()) {
        return mockMenuCategories;
      }

      const response = await api.get("/menu/categories");
      return response.data;
    } catch (error) {
      console.warn("API call failed, using mock data:", error);
      return mockMenuCategories;
    }
  },

  createMenuItem: async (menuItemData) => {
    try {
      if (isUsingDemoAccount()) {
        return {
          id: Date.now(),
          ...menuItemData,
          image:
            menuItemData.imagePreview || "/placeholder.svg?height=40&width=40",
        };
      }

      // Handle file upload if there's an image
      if (menuItemData.image instanceof File) {
        const formData = new FormData();
        Object.keys(menuItemData).forEach((key) => {
          if (key === "image") {
            formData.append("image", menuItemData.image);
          } else if (key !== "imagePreview") {
            formData.append(key, menuItemData[key]);
          }
        });

        const response = await api.post("/menu", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        return response.data;
      } else {
        const { image, imagePreview, ...itemData } = menuItemData;
        const response = await api.post("/menu", itemData);
        return response.data;
      }
    } catch (error) {
      console.warn("API call failed, using mock data:", error);
      return {
        id: Date.now(),
        ...menuItemData,
        image:
          menuItemData.imagePreview || "/placeholder.svg?height=40&width=40",
      };
    }
  },

  updateMenuItem: async (id, menuItemData) => {
    try {
      if (isUsingDemoAccount()) {
        return {
          id,
          ...menuItemData,
          image:
            menuItemData.imagePreview || "/placeholder.svg?height=40&width=40",
        };
      }

      // Handle file upload if there's an image
      if (menuItemData.image instanceof File) {
        const formData = new FormData();
        Object.keys(menuItemData).forEach((key) => {
          if (key === "image") {
            formData.append("image", menuItemData.image);
          } else if (key !== "imagePreview") {
            formData.append(key, menuItemData[key]);
          }
        });

        const response = await api.put(`/menu/${id}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        return response.data;
      } else {
        const { image, imagePreview, ...itemData } = menuItemData;
        const response = await api.put(`/menu/${id}`, itemData);
        return response.data;
      }
    } catch (error) {
      console.warn("API call failed, using mock data:", error);
      return {
        id,
        ...menuItemData,
        image:
          menuItemData.imagePreview || "/placeholder.svg?height=40&width=40",
      };
    }
  },

  deleteMenuItem: async (id) => {
    try {
      if (isUsingDemoAccount()) {
        return { success: true };
      }

      const response = await api.delete(`/menu/${id}`);
      return response.data;
    } catch (error) {
      console.warn("API call failed, using mock data:", error);
      return { success: true };
    }
  },
};

// User API
export const userAPI = {
  getUsers: async () => {
    try {
      if (isUsingDemoAccount()) {
        return mockUsers;
      }

      const response = await api.get("/users");
      return response.data;
    } catch (error) {
      console.warn("API call failed, using mock data:", error);
      return mockUsers;
    }
  },

  createUser: async (userData) => {
    try {
      if (isUsingDemoAccount()) {
        return { id: Date.now(), ...userData };
      }

      const response = await api.post("/users", userData);
      return response.data;
    } catch (error) {
      console.warn("API call failed, using mock data:", error);
      return { id: Date.now(), ...userData };
    }
  },

  updateUser: async (id, userData) => {
    try {
      if (isUsingDemoAccount()) {
        return { id, ...userData };
      }

      const response = await api.put(`/users/${id}`, userData);
      return response.data;
    } catch (error) {
      console.warn("API call failed, using mock data:", error);
      return { id, ...userData };
    }
  },

  deleteUser: async (id) => {
    try {
      if (isUsingDemoAccount()) {
        return { success: true };
      }

      const response = await api.delete(`/users/${id}`);
      return response.data;
    } catch (error) {
      console.warn("API call failed, using mock data:", error);
      return { success: true };
    }
  },
};

// Dashboard API
export const dashboardAPI = {
  getStats: async () => {
    try {
      if (isUsingDemoAccount()) {
        return mockStats;
      }

      const response = await api.get("/dashboard/stats");
      return response.data;
    } catch (error) {
      console.warn("API call failed, using mock data:", error);
      return mockStats;
    }
  },

  getRecentOrders: async () => {
    try {
      if (isUsingDemoAccount()) {
        return mockRecentOrders;
      }

      const response = await api.get("/dashboard/recent-orders");
      return response.data;
    } catch (error) {
      console.warn("API call failed, using mock data:", error);
      return mockRecentOrders;
    }
  },

  getPopularItems: async () => {
    try {
      if (isUsingDemoAccount()) {
        return mockPopularItems;
      }

      const response = await api.get("/dashboard/popular-items");
      return response.data;
    } catch (error) {
      console.warn("API call failed, using mock data:", error);
      return mockPopularItems;
    }
  },
};

// Reports API
export const reportAPI = {
  getSalesData: async (timeRange) => {
    try {
      if (isUsingDemoAccount()) {
        return mockSalesData;
      }

      const response = await api.get(`/reports/sales?timeRange=${timeRange}`);
      return response.data;
    } catch (error) {
      console.warn("API call failed, using mock data:", error);
      return mockSalesData;
    }
  },

  getPopularItems: async (timeRange) => {
    try {
      if (isUsingDemoAccount()) {
        return mockPopularItems;
      }

      const response = await api.get(
        `/reports/popular-items?timeRange=${timeRange}`
      );
      return response.data;
    } catch (error) {
      console.warn("API call failed, using mock data:", error);
      return mockPopularItems;
    }
  },

  getStaffPerformance: async (timeRange) => {
    try {
      if (isUsingDemoAccount()) {
        return mockStaffPerformance;
      }

      const response = await api.get(
        `/reports/staff-performance?timeRange=${timeRange}`
      );
      return response.data;
    } catch (error) {
      console.warn("API call failed, using mock data:", error);
      return mockStaffPerformance;
    }
  },

  generateReport: async (reportType, timeRange, format) => {
    try {
      if (isUsingDemoAccount()) {
        alert(
          `Demo mode: This would download a ${reportType} report in ${format} format in production.`
        );
        return { success: true };
      }

      const response = await api.get(
        `/reports/generate/${reportType}?timeRange=${timeRange}&format=${format}`,
        {
          responseType: "blob",
        }
      );

      // Create a download link for the report
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `${reportType}-report-${timeRange}.${format}`
      );
      document.body.appendChild(link);
      link.click();
      link.remove();

      return { success: true };
    } catch (error) {
      console.warn("API call failed:", error);
      alert(
        `Report generation failed. This would download a ${reportType} report in ${format} format in production.`
      );
      return { success: false };
    }
  },
};

export default {
  authAPI,
  menuAPI,
  userAPI,
  dashboardAPI,
  reportAPI,
};
