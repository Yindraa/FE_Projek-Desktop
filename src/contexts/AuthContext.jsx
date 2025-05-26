"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { login as loginApi } from "../services/authService";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Login function - now using backend
  const login = async (username, password, rememberMe = false) => {
    try {
      const data = await loginApi(username, password);
      const { access_token, user } = data.data;
      // Simpan token & user
      const storage = rememberMe ? localStorage : sessionStorage;
      storage.setItem("user", JSON.stringify(user));
      storage.setItem("token", access_token);
      setCurrentUser(user);
      return user;
    } catch (error) {
      // Tangani error dari backend
      throw error.response?.data?.message || error.message || "Login failed";
    }
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("token");
    setCurrentUser(null);
  };

  // Check if user is already logged in
  useEffect(() => {
    let user = localStorage.getItem("user") || sessionStorage.getItem("user");
    // Cek agar tidak parse jika user adalah "undefined" atau "null"
    if (user && user !== "undefined" && user !== "null") {
      setCurrentUser(JSON.parse(user));
    }
    setLoading(false);
  }, []);

  // Tambahkan fungsi register dummy agar tidak error
  const register = async () => {
    throw new Error("Register belum diimplementasikan");
  };

  const value = {
    currentUser,
    login,
    register,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
