// Sidebar.jsx
"use client";
import {
  HomeIcon,
  UsersIcon,
  ChartBarIcon,
  FireIcon,
  ClipboardDocumentListIcon,
  TableCellsIcon,
  ShoppingCartIcon,
  CreditCardIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";
import Logo from "../common/Logo";
import { Link, useLocation } from "react-router-dom";

// Navigation items for each role
const navigation = {
  admin: [
    { name: "Dashboard", href: "/dashboard", icon: HomeIcon },
    { name: "Menu Management", href: "/admin/menu", icon: DocumentTextIcon },
    { name: "User Management", href: "/admin/users", icon: UsersIcon },
    { name: "Reports", href: "/admin/reports", icon: ChartBarIcon },
  ],
  waiter: [
    { name: "Dashboard", href: "/dashboard", icon: HomeIcon },
    { name: "Tables", href: "/waiter/tables", icon: TableCellsIcon },
    { name: "Orders", href: "/waiter/orders", icon: ShoppingCartIcon },
    { name: "Payments", href: "/waiter/payments", icon: CreditCardIcon },
  ],
  chef: [
    {
      name: "Orders Queue",
      href: "/chef/orders",
      icon: ClipboardDocumentListIcon,
    },
  ],
};

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Sidebar({ sidebarOpen, setSidebarOpen, role }) {
  const location = useLocation();
  const navItems = navigation[role] || [];

  return (
    <div className="flex h-full flex-col bg-amber-800">
      <div className="flex flex-shrink-0 items-center px-4 py-4">
        <Logo className="h-8 w-auto text-white" />
      </div>
      <div className="mt-5 flex flex-1 flex-col overflow-y-auto">
        <nav className="flex-1 space-y-1 px-2 pb-4">
          {navItems.map((item) => {
            const isActive =
              location.pathname === item.href ||
              (item.href !== "/dashboard" &&
                location.pathname.startsWith(item.href));
            return (
              <Link
                key={item.name}
                to={item.href}
                className={classNames(
                  isActive
                    ? "bg-amber-900 text-white"
                    : "text-amber-100 hover:bg-amber-700",
                  "group flex items-center px-2 py-2 text-sm font-medium rounded-xl transition-colors duration-150"
                )}
                onClick={() => {
                  // Close sidebar on mobile when a link is clicked
                  if (window.innerWidth < 768 && setSidebarOpen) {
                    setSidebarOpen(false);
                  }
                }}
              >
                <item.icon
                  className={classNames(
                    isActive
                      ? "text-amber-200"
                      : "text-amber-300 group-hover:text-amber-200",
                    "mr-3 h-6 w-6 flex-shrink-0"
                  )}
                  aria-hidden="true"
                />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
