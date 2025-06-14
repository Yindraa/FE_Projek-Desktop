// DashboardLayout.jsx
"use client";

import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import Sidebar from "./Sidebar";
import Header from "./Header";

export default function DashboardLayout({ children, role }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { currentUser, logout } = useAuth();

  // Function to close sidebar when clicking outside on mobile
  const handleOverlayClick = () => {
    if (sidebarOpen) {
      setSidebarOpen(false);
    }
  };

  return (
    <div className="h-screen flex overflow-hidden bg-gray-100">
      {/* Sidebar for desktop - always visible on md and up */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div className="flex flex-col h-0 flex-1 border-r border-amber-900 bg-amber-800">
            <Sidebar
              sidebarOpen={sidebarOpen}
              setSidebarOpen={setSidebarOpen}
              role={role}
            />
          </div>
        </div>
      </div>

      {/* Mobile sidebar - only visible when sidebarOpen is true */}
      <div
        className={`md:hidden fixed inset-0 flex z-30 ${
          sidebarOpen ? "" : "hidden"
        }`}
      >
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-75"
          onClick={handleOverlayClick}
        ></div>
        <div className="relative flex-1 flex flex-col max-w-xs w-full bg-amber-800">
          {/* X button removed from here */}
          <Sidebar
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
            role={role}
          />
        </div>
      </div>

      {/* Main content area */}
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        <Header
          setSidebarOpen={setSidebarOpen}
          user={currentUser}
          onLogout={logout}
        />
        <main className="flex-1 relative z-0 overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              <div className="bg-white rounded-xl shadow-sm p-6">
                {children}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
