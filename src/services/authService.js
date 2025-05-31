import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

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
