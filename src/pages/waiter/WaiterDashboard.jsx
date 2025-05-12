"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import PageTitle from "../../components/common/PageTitle";
import {
  ClipboardDocumentListIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";

export default function WaiterDashboard() {
  const [stats, setStats] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API call with mock data
    const loadDashboardData = async () => {
      setIsLoading(true);

      // Simulate API delay
      setTimeout(() => {
        // Mock stats data
        setStats([
          {
            name: "Active Tables",
            value: "8/20",
            icon: UserGroupIcon,
            color: "bg-blue-100 text-blue-800",
          },
          {
            name: "Pending Orders",
            value: 5,
            icon: ClipboardDocumentListIcon,
            color: "bg-amber-100 text-amber-800",
          },
          {
            name: "Today's Sales",
            value: "$1,245",
            icon: CurrencyDollarIcon,
            color: "bg-green-100 text-green-800",
          },
        ]);

        // Mock recent orders data
        setRecentOrders([
          {
            id: "ORD-001",
            table: 5,
            items: 4,
            total: "$45.80",
            status: "served",
            time: "10:15 AM",
          },
          {
            id: "ORD-002",
            table: 3,
            items: 3,
            total: "$32.50",
            status: "in-progress",
            time: "10:30 AM",
          },
          {
            id: "ORD-003",
            table: 8,
            items: 2,
            total: "$24.75",
            status: "pending-payment",
            time: "10:40 AM",
          },
          {
            id: "ORD-004",
            table: 1,
            items: 2,
            total: "$24.00",
            status: "pending",
            time: "10:45 AM",
          },
        ]);

        setIsLoading(false);
      }, 1000);
    };

    loadDashboardData();
  }, []);

  return (
    <DashboardLayout role="waiter">
      <div className="animate-fadeIn">
        <PageTitle
          title="Waiter Dashboard"
          subtitle="Overview of tables, orders, and sales"
        />

        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-8">
          {isLoading
            ? // Skeleton loaders for stats
              Array(3)
                .fill(0)
                .map((_, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-lg shadow-md p-6 animate-pulse"
                  >
                    <div className="flex items-center">
                      <div className="rounded-md bg-amber-200 h-12 w-12"></div>
                      <div className="ml-5 w-full">
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="h-6 bg-gray-300 rounded w-1/2"></div>
                      </div>
                    </div>
                  </div>
                ))
            : stats.map((item) => (
                <div
                  key={item.name}
                  className="bg-white overflow-hidden shadow-md rounded-lg transition-all duration-200 hover:shadow-lg"
                >
                  <div className="p-5">
                    <div className="flex items-center">
                      <div
                        className={`flex-shrink-0 rounded-md p-3 ${
                          item.color.split(" ")[0]
                        }`}
                      >
                        <item.icon
                          className={`h-6 w-6 ${item.color.split(" ")[1]}`}
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
                              {item.value}
                            </div>
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
        </div>

        {/* Recent Orders */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
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
                    <div key={index} className="h-16 bg-gray-200 rounded"></div>
                  ))}
              </div>
            ) : (
              <div className="overflow-x-auto">
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
                        Items
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Total
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Status
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Time
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Actions
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
                          Table {order.table}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {order.items}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {order.total}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              order.status === "served"
                                ? "bg-green-100 text-green-800"
                                : order.status === "in-progress"
                                ? "bg-yellow-100 text-yellow-800"
                                : order.status === "pending-payment"
                                ? "bg-purple-100 text-purple-800"
                                : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {order.status
                              .split("-")
                              .map(
                                (word) =>
                                  word.charAt(0).toUpperCase() + word.slice(1)
                              )
                              .join(" ")}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {order.time}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button className="text-amber-600 hover:text-amber-900 mr-2">
                            View
                          </button>
                          {order.status === "pending-payment" && (
                            <button className="text-green-600 hover:text-green-900">
                              Process Payment
                            </button>
                          )}
                          {order.status === "in-progress" && (
                            <button className="text-green-600 hover:text-green-900">
                              Mark as Served
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
