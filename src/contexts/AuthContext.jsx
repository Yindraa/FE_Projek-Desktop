"use client";

import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Mock login function - in a real app, this would validate against a database
  const login = async (email, password, rememberMe = false) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Simple validation
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

        setCurrentUser(user);
        return user;
      } else {
        throw new Error("Invalid credentials");
      }
    } catch (error) {
      throw error;
    }
  };

  // Mock register function - in a real app, this would create a user in the database
  const register = async (userData) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // In a real app, you would send userData to your backend
      console.log("Registering user:", userData);

      // For demo purposes, we'll just return success
      return { success: true };
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("user");
    sessionStorage.removeItem("user");
    setCurrentUser(null);
  };

  // Check if user is already logged in
  useEffect(() => {
    const user = localStorage.getItem("user") || sessionStorage.getItem("user");
    if (user) {
      setCurrentUser(JSON.parse(user));
    }
    setLoading(false);
  }, []);

  const value = {
    currentUser,
    login,
    register,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
