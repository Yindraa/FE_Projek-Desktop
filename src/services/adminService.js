// This file contains mock service functions that would connect to a backend API in a real application
import axios from "axios";

// Mock data for dashboard stats
const mockStats = [
  {
    name: "Total Revenue",
    stat: "$24,000",
    icon: () => {},
    change: "+4.75%",
    changeType: "increase",
  },
  {
    name: "Total Orders",
    stat: "450",
    icon: () => {},
    change: "+10.15%",
    changeType: "increase",
  },
  {
    name: "Active Tables",
    stat: "12/20",
    icon: () => {},
    change: "70%",
    changeType: "neutral",
  },
  {
    name: "Staff Members",
    stat: "15",
    icon: () => {},
    change: "+2",
    changeType: "increase",
  },
];

// Mock data for recent orders
const mockRecentOrders = [
  { id: "ORD-001", table: "Table 5", amount: "$45.80", status: "Completed" },
  { id: "ORD-002", table: "Table 3", amount: "$32.50", status: "In Progress" },
  { id: "ORD-003", table: "Table 8", amount: "$78.25", status: "Completed" },
  { id: "ORD-004", table: "Table 1", amount: "$24.00", status: "Pending" },
];

// Mock data for popular items
const mockPopularItems = [
  { name: "Grilled Salmon", category: "Main Course", orders: 45 },
  { name: "Caesar Salad", category: "Appetizer", orders: 38 },
  { name: "Chocolate Lava Cake", category: "Dessert", orders: 32 },
  { name: "Margherita Pizza", category: "Main Course", orders: 30 },
  { name: "Iced Coffee", category: "Beverage", orders: 28 },
];

// Mock data for menu items
const mockMenuItems = [
  {
    id: 1,
    name: "Grilled Salmon",
    description:
      "Fresh salmon fillet grilled to perfection with herbs and lemon",
    category: "Main Course",
    price: 18.99,
    available: true,
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 2,
    name: "Caesar Salad",
    description:
      "Crisp romaine lettuce with Caesar dressing, croutons, and parmesan",
    category: "Appetizer",
    price: 9.99,
    available: true,
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 3,
    name: "Chocolate Lava Cake",
    description: "Warm chocolate cake with a molten chocolate center",
    category: "Dessert",
    price: 7.99,
    available: true,
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 4,
    name: "Margherita Pizza",
    description: "Classic pizza with tomato sauce, mozzarella, and fresh basil",
    category: "Main Course",
    price: 14.99,
    available: true,
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 5,
    name: "Iced Coffee",
    description: "Cold brewed coffee served over ice",
    category: "Beverage",
    price: 3.99,
    available: true,
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 6,
    name: "Beef Burger",
    description: "Juicy beef patty with lettuce, tomato, and special sauce",
    category: "Main Course",
    price: 12.99,
    available: false,
    image: "/placeholder.svg?height=40&width=40",
  },
];

// Mock data for menu categories
const mockMenuCategories = [
  { id: 1, name: "Appetizer" },
  { id: 2, name: "Main Course" },
  { id: 3, name: "Dessert" },
  { id: 4, name: "Beverage" },
];


// Mock data for sales data
const mockSalesData = [
  { name: "Total Sales", value: "$24,000", icon: () => {} },
  { name: "Average Order", value: "$53.33", icon: () => {} },
  { name: "Orders", value: "450", icon: () => {} },
  { name: "Customers", value: "320", icon: () => {} },
];

// Mock data for staff performance
const mockStaffPerformance = [
  {
    name: "Waiter One",
    role: "Waiter",
    ordersProcessed: 120,
    salesAmount: "5,240",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    name: "Waiter Two",
    role: "Waiter",
    ordersProcessed: 98,
    salesAmount: "4,120",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    name: "Chef User",
    role: "Chef",
    ordersProcessed: 218,
    salesAmount: "9,360",
    avatar: "/placeholder.svg?height=40&width=40",
  },
];

// Simulate API delay
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Dashboard API functions
export const fetchDashboardStats = async () => {
  await delay(1000); // Simulate API delay
  return mockStats;
};

export const fetchRecentOrders = async () => {
  await delay(800); // Simulate API delay
  return mockRecentOrders;
};

export const fetchPopularItems = async (timeRange = "week") => {
  await delay(1200); // Simulate API delay
  console.log(`Fetching popular items for ${timeRange}`);
  return mockPopularItems;
};

// Menu Management API functions
export const fetchMenuItems = async () => {
  await delay(1000); // Simulate API delay
  return mockMenuItems;
};

export const fetchMenuCategories = async () => {
  await delay(500); // Simulate API delay
  return mockMenuCategories;
};

export const createMenuItem = async (menuItem) => {
  await delay(1000); // Simulate API delay
  console.log("Creating menu item:", menuItem);
  return { ...menuItem, id: Date.now() };
};

export const updateMenuItem = async (menuItem) => {
  await delay(1000); // Simulate API delay
  console.log("Updating menu item:", menuItem);
  return menuItem;
};

export const deleteMenuItem = async (menuItemId) => {
  await delay(1000); // Simulate API delay
  console.log("Deleting menu item:", menuItemId);
  return { success: true };
};

// User Management API functions
export const fetchUsers = async () => {
  await delay(1000); // Simulate API delay
  return mockUsers;
};

export const createUser = async (user) => {
  await delay(1000); // Simulate API delay
  console.log("Creating user:", user);
  return { ...user, id: Date.now() };
};

export const updateUser = async (user) => {
  await delay(1000); // Simulate API delay
  console.log("Updating user:", user);
  return user;
};

export const deleteUser = async (userId) => {
  await delay(1000); // Simulate API delay
  console.log("Deleting user:", userId);
  return { success: true };
};

// Reports API functions
export const fetchSalesData = async (timeRange = "week") => {
  await delay(1500); // Simulate API delay
  console.log(`Fetching sales data for ${timeRange}`);
  return mockSalesData;
};

export const fetchStaffPerformance = async (timeRange = "week") => {
  await delay(1200); // Simulate API delay
  console.log(`Fetching staff performance for ${timeRange}`);
  return mockStaffPerformance;
};

// Export functions for generating reports
export const generateSalesReport = async (
  timeRange = "week",
  format = "pdf"
) => {
  await delay(2000); // Simulate API delay
  console.log(`Generating ${format} sales report for ${timeRange}`);
  return { url: "https://example.com/reports/sales-report.pdf" };
};

export const generateItemsReport = async (
  timeRange = "week",
  format = "pdf"
) => {
  await delay(2000); // Simulate API delay
  console.log(`Generating ${format} items report for ${timeRange}`);
  return { url: "https://example.com/reports/items-report.pdf" };
};

export const generateStaffReport = async (
  timeRange = "week",
  format = "pdf"
) => {
  await delay(2000); // Simulate API delay
  console.log(`Generating ${format} staff report for ${timeRange}`);
  return { url: "https://example.com/reports/staff-report.pdf" };
};

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

function getAuthHeader() {
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// --- USER MANAGEMENT API (REAL) ---

// Get all users
export const getAllUsers = async () => {
  const res = await axios.get(`${API_URL}/admin/users`, {
    headers: getAuthHeader(),
  });
  return res.data;
};

// Create new user
export const createUserAPI = async (userData) => {
  const res = await axios.post(`${API_URL}/admin/users`, userData, {
    headers: getAuthHeader(),
  });
  return res.data;
};

// Update user role
export const updateUserRole = async (id, role) => {
  const res = await axios.patch(
    `${API_URL}/admin/user/${id}/role`,
    { role },
    { headers: getAuthHeader() }
  );
  return res.data;
};

// Delete user
export const deleteUserAPI = async (id) => {
  const res = await axios.delete(`${API_URL}/admin/user/${id}`, {
    headers: getAuthHeader(),
  });
  return res.data;
};

// Get user detail (optional, not used in list)
export const getUserDetail = async (id) => {
  const res = await axios.get(`${API_URL}/admin/user/${id}`, {
    headers: getAuthHeader(),
  });
  return res.data;
};
