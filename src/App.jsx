"use client";

import { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import MenuManagement from "./pages/admin/MenuManagement";
import UserManagement from "./pages/admin/UserManagement";
import Reports from "./pages/admin/Reports";
import WaiterDashboard from "./pages/waiter/WaiterDashboard";
import Tables from "./pages/waiter/Tables";
import Orders from "./pages/waiter/Orders";
import Payments from "./pages/waiter/Payments";
import ChefDashboard from "./pages/chef/ChefDashboard";
import OrdersQueue from "./pages/chef/OrdersQueue";
import KitchenStatus from "./pages/chef/KitchenStatus";
import LoadingScreen from "./components/common/LoadingScreen";

function App() {
  const { currentUser, loading } = useAuth();
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    if (currentUser) {
      // Gunakan role dari backend (ADMIN, CHEF, WAITER)
      switch ((currentUser.role || "").toUpperCase()) {
        case "ADMIN":
          setUserRole("admin");
          break;
        case "CHEF":
          setUserRole("chef");
          break;
        case "WAITER":
          setUserRole("waiter");
          break;
        default:
          setUserRole("unknown");
      }
    } else {
      setUserRole(null);
    }
  }, [currentUser]);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/login"
          element={currentUser ? <Navigate to="/dashboard" /> : <LoginPage />}
        />
        <Route
          path="/register"
          element={
            currentUser ? <Navigate to="/dashboard" /> : <RegisterPage />
          }
        />

        {/* Protected routes */}
        <Route
          path="/dashboard"
          element={
            !currentUser ? (
              <Navigate to="/login" />
            ) : userRole === "admin" ? (
              <AdminDashboard />
            ) : userRole === "chef" ? (
              <ChefDashboard />
            ) : userRole === "waiter" ? (
              <WaiterDashboard />
            ) : (
              <div>Unauthorized access. Please contact administrator.</div>
            )
          }
        />

        {/* Admin routes */}
        <Route
          path="/admin/menu"
          element={
            !currentUser || userRole !== "admin" ? (
              <Navigate to="/login" />
            ) : (
              <MenuManagement />
            )
          }
        />
        <Route
          path="/admin/users"
          element={
            !currentUser || userRole !== "admin" ? (
              <Navigate to="/login" />
            ) : (
              <UserManagement />
            )
          }
        />
        <Route
          path="/admin/reports"
          element={
            !currentUser || userRole !== "admin" ? (
              <Navigate to="/login" />
            ) : (
              <Reports />
            )
          }
        />

        {/* Waiter routes */}
        <Route
          path="/waiter/tables"
          element={
            !currentUser || userRole !== "waiter" ? (
              <Navigate to="/login" />
            ) : (
              <Tables />
            )
          }
        />
        <Route
          path="/waiter/orders"
          element={
            !currentUser || userRole !== "waiter" ? (
              <Navigate to="/login" />
            ) : (
              <Orders />
            )
          }
        />
        <Route
          path="/waiter/payments"
          element={
            !currentUser || userRole !== "waiter" ? (
              <Navigate to="/login" />
            ) : (
              <Payments />
            )
          }
        />

        {/* Chef routes */}
        <Route
          path="/chef/orders"
          element={
            !currentUser || userRole !== "chef" ? (
              <Navigate to="/login" />
            ) : (
              <OrdersQueue />
            )
          }
        />
        <Route
          path="/chef/kitchen"
          element={
            !currentUser || userRole !== "chef" ? (
              <Navigate to="/login" />
            ) : (
              <KitchenStatus />
            )
          }
        />

        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
