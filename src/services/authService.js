import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

/**
 * Login user ke backend
 * @param {string} username
 * @param {string} password
 * @returns {Promise<Object>} response dari backend (biasanya token & user)
 */
export const login = async (username, password) => {
  const response = await axios.post(`${API_URL}/auth/login`, {
    username,
    password,
  });
  return response.data;
};

// Helper to get token from localStorage/sessionStorage
function getToken() {
  return (
    localStorage.getItem("token") || sessionStorage.getItem("token")
  );
}

// Create axios instance with interceptor for Authorization
export const authAxios = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

authAxios.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
