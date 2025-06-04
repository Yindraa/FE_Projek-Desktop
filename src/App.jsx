"use client";

import { useEffect, useState } from "react";
import {
  HashRouter as Router, // Gunakan HashRouter
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import { NotificationProvider } from "./contexts/NotificationContext";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/auth/LoginPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import MenuManagement from "./pages/admin/MenuManagement";
import UserManagement from "./pages/admin/UserManagement";
import Reports from "./pages/admin/Reports";
import WaiterDashboard from "./pages/waiter/WaiterDashboard";
import Tables from "./pages/waiter/Tables";
import Orders from "./pages/waiter/Orders";
import Payments from "./pages/waiter/Payments";
import OrdersQueue from "./pages/chef/OrdersQueue";
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
    <NotificationProvider>
      <Router
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LandingPage />} />
          <Route
            path="/login"
            element={
              currentUser ? (
                userRole === "admin" ? (
                  <Navigate to="/dashboard" />
                ) : userRole === "chef" ? (
                  <Navigate to="/chef/orders" />
                ) : userRole === "waiter" ? (
                  <Navigate to="/dashboard" />
                ) : (
                  <Navigate to="/dashboard" />
                )
              ) : (
                <LoginPage />
              )
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
                <Navigate to="/chef/orders" />
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

          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </NotificationProvider>
  );
}

export default App;
