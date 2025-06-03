"use client";

import { useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import PageTitle from "../../components/common/PageTitle";
import {
  QueueListIcon,
  ClipboardDocumentListIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";
import { useEffect } from "react";
import { CurrencyDollarIcon, UsersIcon } from "@heroicons/react/24/outline";
import { fetchDashboardStats } from "../../services/adminService";

// Mock data for popular items
const mockPopularItems = [
  { name: "Grilled Salmon", category: "Main Course", orders: 45 },
  { name: "Caesar Salad", category: "Appetizer", orders: 38 },
  { name: "Chocolate Lava Cake", category: "Dessert", orders: 32 },
  { name: "Margherita Pizza", category: "Main Course", orders: 30 },
  { name: "Iced Coffee", category: "Beverage", orders: 28 },
];

export default function AdminDashboard() {
  const [stats, setStats] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [popularItems, setPopularItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setIsLoading(true);
        // Fetch from real API
        const data = await fetchDashboardStats();
        setStats([
          {
            name: "Total Revenue",
            stat: `$${data.totalRevenue.toLocaleString()}`,
            icon: () => (
              <CurrencyDollarIcon className="h-6 w-6" aria-hidden="true" />
            ),
            change: "", // You can add logic for change if available
            changeType: "neutral",
          },
          {
            name: "Total Orders",
            stat: data.totalOrders.toLocaleString(),
            icon: () => (
              <ClipboardDocumentListIcon className="h-6 w-6" aria-hidden="true" />
            ),
            change: "",
            changeType: "neutral",
          },
          {
            name: "Active Tables",
            stat: `${data.activeTables}/${data.totalTables}`,
            icon: () => (
              <QueueListIcon className="h-6 w-6" aria-hidden="true" />
            ),
            change: "",
            changeType: "neutral",
          },
          {
            name: "Staff Members",
            stat: data.staffMembers.toString(),
            icon: () => <UsersIcon className="h-6 w-6" aria-hidden="true" />,
            change: "",
            changeType: "neutral",
          },
        ]);
        setRecentOrders(
          (data.recentOrders || []).map((order) => ({
            id: order.id,
            table: `Table ${order.table?.tableNumber ?? "-"}`,
            amount: `$${order.totalAmount?.toFixed(2) ?? "0.00"}`,
            status:
              order.status === "COMPLETED"
                ? "Completed"
                : order.status.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
          }))
        );
        // Keep using mockPopularItems for now
        setPopularItems(mockPopularItems);
        setError(null);
      } catch (err) {
        console.error("Error loading dashboard data:", err);
        setError("Failed to load dashboard data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  return (
    <DashboardLayout role="admin">
      <div className="animate-fadeIn md:pl-0 pl-0">
        <PageTitle
          title="Admin Dashboard"
          subtitle="Overview of your restaurant's performance and recent activity"
        />

        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-500"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          {isLoading
            ? // Skeleton loaders for stats
              Array(4)
                .fill(0)
                .map((_, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-xl shadow-md p-6 animate-pulse"
                  >
                    <div className="flex items-center">
                      <div className="rounded-md bg-amber-200 h-12 w-12"></div>
                      <div className="ml-5 w-full">
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="h-6 bg-gray-300 rounded w-1/2"></div>
                      </div>
                    </div>
                    <div className="mt-4 h-4 bg-gray-200 rounded w-full"></div>
                  </div>
                ))
            : stats.map((item) => (
                <div
                  key={item.name}
                  className="bg-white overflow-hidden shadow-md rounded-xl transition-all duration-200 hover:shadow-lg"
                >
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 bg-amber-600 rounded-xl p-3">
                        <item.icon
                          className="h-6 w-6 text-white"
                          aria-hidden="true"
                        />
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">
                            {item.name}
                          </dt>
                          <dd>
                            <div className="text-lg font-medium text-gray-900">
                              {item.stat}
                            </div>
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-5 py-3">
                    <div className="text-sm flex items-center">
                      <span
                        className={`font-medium flex items-center ${
                          item.changeType === "increase"
                            ? "text-green-600"
                            : item.changeType === "decrease"
                            ? "text-red-600"
                            : "text-gray-500"
                        }`}
                      >
                        {item.changeType === "increase" ? (
                          <ArrowUpIcon className="h-4 w-4 mr-1" />
                        ) : item.changeType === "decrease" ? (
                          <ArrowDownIcon className="h-4 w-4 mr-1" />
                        ) : null}
                        {item.change}
                      </span>{" "}
                      <span className="text-gray-500 ml-1">
                        from previous period
                      </span>
                    </div>
                  </div>
                </div>
              ))}
        </div>

        {/* Charts Section */}
        <div className="mb-8">
          <div className="bg-white shadow-md rounded-xl overflow-hidden">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
                <ChartBarIcon className="h-5 w-5 mr-2 text-amber-600" />
                Sales Overview
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Last 7 days sales performance
              </p>
            </div>
            <div className="p-6">
              {isLoading ? (
                <div className="animate-pulse h-64 bg-gray-200 rounded"></div>
              ) : (
                <div className="h-64 bg-amber-50 rounded-xl flex items-center justify-center">
                  <p className="text-gray-500">
                    Sales chart will be displayed here
                  </p>
                  {/* In a real app, you would integrate a chart library like Chart.js or Recharts */}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Recent Orders */}
          <div className="bg-white shadow-md rounded-xl overflow-hidden">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
                <ClipboardDocumentListIcon className="h-5 w-5 mr-2 text-amber-600" />
                Recent Orders
              </h3>
            </div>
            <div className="px-4 py-3 sm:px-6">
              {isLoading ? (
                <div className="animate-pulse space-y-4">
                  {Array(4)
                    .fill(0)
                    .map((_, index) => (
                      <div
                        key={index}
                        className="h-16 bg-gray-200 rounded"
                      ></div>
                    ))}
                </div>
              ) : (
                <div className="overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Order ID
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Table
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Amount
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {recentOrders.map((order) => (
                        <tr key={order.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-amber-700">
                            {order.id}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {order.table}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {order.amount}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <span
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                order.status === "Completed"
                                  ? "bg-green-100 text-green-800"
                                  : order.status === "In Progress"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {order.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="py-3 flex justify-center">
                    <button className="text-sm text-amber-600 hover:text-amber-800 font-medium">
                      View All Orders
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Popular Menu Items */}
          <div className="bg-white shadow-md rounded-xl overflow-hidden">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
                <QueueListIcon className="h-5 w-5 mr-2 text-amber-600" />
                Popular Menu Items
              </h3>
            </div>
            <div className="px-4 py-3 sm:px-6">
              {isLoading ? (
                <div className="animate-pulse space-y-4">
                  {Array(5)
                    .fill(0)
                    .map((_, index) => (
                      <div
                        key={index}
                        className="h-12 bg-gray-200 rounded"
                      ></div>
                    ))}
                </div>
              ) : (
                <ul className="divide-y divide-gray-200">
                  {popularItems.map((item, index) => (
                    <li
                      key={index}
                      className="py-3 flex justify-between items-center hover:bg-gray-50 px-2 rounded-md"
                    >
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {item.name}
                        </p>
                        <p className="text-sm text-gray-500">{item.category}</p>
                      </div>
                      <div className="text-sm text-amber-600 font-medium">
                        {item.orders} orders
                      </div>
                    </li>
                  ))}
                  <li className="py-3 flex justify-center">
                    <button className="text-sm text-amber-600 hover:text-amber-800 font-medium">
                      View All Items
                    </button>
                  </li>
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
