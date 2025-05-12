"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import PageTitle from "../../components/common/PageTitle";
import {
  ClipboardDocumentListIcon,
  FireIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";

export default function ChefDashboard() {
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
            name: "Pending Orders",
            value: 5,
            icon: ClipboardDocumentListIcon,
            color: "bg-amber-100 text-amber-800",
          },
          {
            name: "In Progress",
            value: 3,
            icon: FireIcon,
            color: "bg-blue-100 text-blue-800",
          },
          {
            name: "Completed Today",
            value: 42,
            icon: CheckCircleIcon,
            color: "bg-green-100 text-green-800",
          },
        ]);

        // Mock recent orders data
        setRecentOrders([
          {
            id: "ORD-001",
            table: 5,
            items: [
              {
                name: "Grilled Salmon",
                quantity: 2,
                status: "completed",
                notes: "Medium well",
              },
              {
                name: "Caesar Salad",
                quantity: 1,
                status: "completed",
                notes: "No croutons",
              },
            ],
            status: "completed",
            time: "10:15 AM",
          },
          {
            id: "ORD-002",
            table: 3,
            items: [
              {
                name: "Margherita Pizza",
                quantity: 1,
                status: "in-progress",
                notes: "Extra cheese",
              },
              {
                name: "Chicken Wings",
                quantity: 2,
                status: "in-progress",
                notes: "Spicy",
              },
            ],
            status: "in-progress",
            time: "10:30 AM",
          },
          {
            id: "ORD-004",
            table: 1,
            items: [
              {
                name: "Beef Burger",
                quantity: 1,
                status: "pending",
                notes: "No onions",
              },
              {
                name: "French Fries",
                quantity: 1,
                status: "pending",
                notes: "Extra salt",
              },
            ],
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
    <DashboardLayout role="chef">
      <div className="animate-fadeIn">
        <PageTitle
          title="Chef Dashboard"
          subtitle="Overview of kitchen operations and recent orders"
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
                    className="bg-white rounded-xl shadow-md p-6 animate-pulse"
                  >
                    <div className="flex items-center">
                      <div className="rounded-xl bg-amber-200 h-12 w-12"></div>
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
                  className="bg-white overflow-hidden shadow-md rounded-xl transition-all duration-200 hover:shadow-lg"
                >
                  <div className="p-5">
                    <div className="flex items-center">
                      <div
                        className={`flex-shrink-0 rounded-xl p-3 ${
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
                {Array(3)
                  .fill(0)
                  .map((_, index) => (
                    <div key={index} className="h-16 bg-gray-200 rounded"></div>
                  ))}
              </div>
            ) : (
              <div className="space-y-6">
                {recentOrders.map((order) => (
                  <div
                    key={order.id}
                    className="bg-white shadow overflow-hidden sm:rounded-xl"
                  >
                    <div className="px-4 py-5 sm:px-6 flex justify-between items-center bg-gray-50">
                      <div>
                        <h3 className="text-lg leading-6 font-medium text-gray-900">
                          {order.id} - Table {order.table}
                        </h3>
                        <p className="mt-1 max-w-2xl text-sm text-gray-500">
                          Ordered at {order.time}
                        </p>
                      </div>
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          order.status === "completed"
                            ? "bg-green-100 text-green-800"
                            : order.status === "in-progress"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {order.status.charAt(0).toUpperCase() +
                          order.status.slice(1)}
                      </span>
                    </div>
                    <div className="border-t border-gray-200">
                      <dl>
                        {order.items.map((item, index) => (
                          <div
                            key={index}
                            className={`${
                              index % 2 === 0 ? "bg-gray-50" : "bg-white"
                            } px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6`}
                          >
                            <dt className="text-sm font-medium text-gray-500">
                              {item.quantity}x {item.name}
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-1">
                              {item.notes || "No special instructions"}
                            </dd>
                            <dd className="mt-1 text-sm sm:mt-0 sm:col-span-1 text-right">
                              <span
                                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                  item.status === "completed"
                                    ? "bg-green-100 text-green-800"
                                    : item.status === "in-progress"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-blue-100 text-blue-800"
                                }`}
                              >
                                {item.status.charAt(0).toUpperCase() +
                                  item.status.slice(1)}
                              </span>
                            </dd>
                          </div>
                        ))}
                      </dl>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
