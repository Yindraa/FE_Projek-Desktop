"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import OrderDetailsModal from "../../components/waiter/OrderDetailsModal";
import OrderActionsMenu from "../../components/waiter/OrderActionsMenu";
import EditOrderModal from "../../components/waiter/EditOrderModal";
import {
  ClipboardDocumentListIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";

export default function WaiterDashboard() {
  const [stats, setStats] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [isEditOrderModalOpen, setIsEditOrderModalOpen] = useState(false);

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

        // Mock recent orders data with more detailed information
        setRecentOrders([
          {
            id: "ORD-001",
            table: 5,
            customer: "Walk-in",
            items: [
              {
                name: "Beef Burger",
                quantity: 2,
                price: 12.99,
                notes: "No pickles",
              },
              { name: "Caesar Salad", quantity: 1, price: 8.99, notes: "" },
              { name: "Iced Tea", quantity: 1, price: 3.99, notes: "" },
            ],
            itemCount: 4,
            total: "$38.96",
            status: "served",
            time: "10:15 AM",
          },
          {
            id: "ORD-002",
            table: 3,
            customer: "John Smith",
            items: [
              {
                name: "Margherita Pizza",
                quantity: 1,
                price: 14.99,
                notes: "Extra cheese",
              },
              {
                name: "Chicken Wings",
                quantity: 2,
                price: 9.99,
                notes: "Spicy",
              },
            ],
            itemCount: 3,
            total: "$34.97",
            status: "in-progress",
            time: "10:30 AM",
          },
          {
            id: "ORD-003",
            table: 8,
            customer: "Sarah Johnson",
            items: [
              {
                name: "Spaghetti Carbonara",
                quantity: 1,
                price: 16.99,
                notes: "",
              },
              { name: "Tiramisu", quantity: 1, price: 7.99, notes: "" },
            ],
            itemCount: 2,
            total: "$24.98",
            status: "pending-payment",
            time: "10:40 AM",
          },
          {
            id: "ORD-004",
            table: 1,
            customer: "Walk-in",
            items: [
              {
                name: "Beef Burger",
                quantity: 1,
                price: 12.99,
                notes: "No onions",
              },
              { name: "French Fries", quantity: 1, price: 4.99, notes: "" },
            ],
            itemCount: 2,
            total: "$17.98",
            status: "pending",
            time: "10:45 AM",
          },
        ]);

        setIsLoading(false);
      }, 1000);
    };

    loadDashboardData();
  }, []);

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setIsOrderModalOpen(true);
  };

  const handleMarkAsServed = (orderId) => {
    // In a real app, you would call an API to update the order status
    setRecentOrders(
      recentOrders.map((order) =>
        order.id === orderId ? { ...order, status: "served" } : order
      )
    );
  };

  const handleAddItems = (order) => {
    console.log("Adding items to order:", order); // Debug log
    setSelectedOrder(order);
    setIsEditOrderModalOpen(true);
  };

  const handleUpdateOrder = (updatedOrder) => {
    console.log("Updating order:", updatedOrder); // Debug log

    // In a real app, you would call an API to update the order
    setRecentOrders(
      recentOrders.map((order) => {
        if (order.id === updatedOrder.id) {
          // Update the order with new data
          return {
            ...order,
            items: updatedOrder.items,
            itemCount: updatedOrder.items.reduce(
              (total, item) => total + item.quantity,
              0
            ),
            total:
              typeof updatedOrder.total === "string"
                ? updatedOrder.total
                : `$${updatedOrder.total.toFixed(2)}`,
          };
        }
        return order;
      })
    );

    setIsEditOrderModalOpen(false);
  };

  return (
    <DashboardLayout role="waiter">
      <div className="p-6">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">
          Waiter Dashboard
        </h1>

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
                          {order.itemCount || order.items.length}
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
                          <div className="flex justify-end items-center space-x-2">
                            <button
                              className="text-amber-600 hover:text-amber-900"
                              onClick={() => handleViewOrder(order)}
                            >
                              View
                            </button>

                            <OrderActionsMenu
                              order={order}
                              onView={() => handleViewOrder(order)}
                              onMarkAsServed={() =>
                                handleMarkAsServed(order.id)
                              }
                              onAddItems={() => handleAddItems(order)}
                            />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Tables Overview */}
        <div className="mt-8 bg-white shadow-md rounded-xl overflow-hidden">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Tables Overview
            </h3>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {[...Array(12)].map((_, i) => {
                const status =
                  i % 3 === 0
                    ? "available"
                    : i % 3 === 1
                    ? "occupied"
                    : "reserved";
                return (
                  <div
                    key={i}
                    className={`p-4 rounded-xl shadow text-center ${
                      status === "available"
                        ? "bg-green-100"
                        : status === "occupied"
                        ? "bg-red-100"
                        : "bg-yellow-100"
                    }`}
                  >
                    <p className="font-medium">Table {i + 1}</p>
                    <p className="text-sm capitalize">{status}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Order Details Modal */}
      <OrderDetailsModal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        order={selectedOrder}
      />

      {/* Edit Order Modal */}
      <EditOrderModal
        isOpen={isEditOrderModalOpen}
        onClose={() => setIsEditOrderModalOpen(false)}
        order={selectedOrder}
        onUpdateOrder={handleUpdateOrder}
      />
    </DashboardLayout>
  );
}
