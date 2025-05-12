"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import PageTitle from "../../components/common/PageTitle";

export default function OrdersQueue() {
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState("pending");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API call with mock data
    const loadOrders = async () => {
      setIsLoading(true);

      // Simulate API delay
      setTimeout(() => {
        // Mock orders data
        setOrders([
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
              {
                name: "Garlic Bread",
                quantity: 1,
                status: "completed",
                notes: "",
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
            id: "ORD-003",
            table: 8,
            items: [
              {
                name: "Spaghetti Carbonara",
                quantity: 1,
                status: "pending",
                notes: "Al dente",
              },
              { name: "Tiramisu", quantity: 1, status: "pending", notes: "" },
            ],
            status: "pending",
            time: "10:40 AM",
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

    loadOrders();
  }, []);

  const filteredOrders = orders.filter((order) => {
    if (activeTab === "all") return true;

    // Check if any item in the order has the status matching the active tab
    return order.items.some((item) => item.status === activeTab);
  });

  const handleItemStatusChange = (orderId, itemName, newStatus) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) => {
        if (order.id === orderId) {
          const updatedItems = order.items.map((item) => {
            if (item.name === itemName) {
              return { ...item, status: newStatus };
            }
            return item;
          });

          // Only update the order status if ALL items have the same status
          const allCompleted = updatedItems.every(
            (item) => item.status === "completed"
          );
          const allInProgress = updatedItems.every(
            (item) =>
              item.status === "in-progress" || item.status === "completed"
          );

          let orderStatus = order.status;
          if (allCompleted) {
            orderStatus = "completed";
          } else if (allInProgress && !allCompleted) {
            orderStatus = "in-progress";
          }

          return {
            ...order,
            items: updatedItems,
            status: orderStatus,
          };
        }
        return order;
      })
    );
  };

  return (
    <DashboardLayout role="chef">
      <div className="animate-fadeIn">
        <PageTitle
          title="Orders Queue"
          subtitle="Manage and process incoming food orders"
        />

        <div className="mt-6">
          <div className="sm:hidden">
            <label htmlFor="tabs" className="sr-only">
              Select a tab
            </label>
            <select
              id="tabs"
              name="tabs"
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              value={activeTab}
              onChange={(e) => setActiveTab(e.target.value)}
            >
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="all">All Orders</option>
            </select>
          </div>
          <div className="hidden sm:block">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                {["pending", "in-progress", "completed", "all"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`${
                      activeTab === tab
                        ? "border-amber-500 text-amber-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm capitalize`}
                  >
                    {tab === "all"
                      ? "All Orders"
                      : tab
                          .split("-")
                          .map(
                            (word) =>
                              word.charAt(0).toUpperCase() + word.slice(1)
                          )
                          .join(" ")}
                  </button>
                ))}
              </nav>
            </div>
          </div>
        </div>

        <div className="mt-6 space-y-6">
          {isLoading ? (
            <div className="animate-pulse space-y-4">
              {Array(3)
                .fill(0)
                .map((_, index) => (
                  <div key={index} className="h-64 bg-gray-200 rounded"></div>
                ))}
            </div>
          ) : filteredOrders.length > 0 ? (
            filteredOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white shadow overflow-hidden sm:rounded-lg"
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
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Item
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Quantity
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Notes
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
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {order.items.map((item, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {item.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {item.quantity}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {item.notes || "-"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
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
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {item.status === "pending" && (
                              <button
                                onClick={() =>
                                  handleItemStatusChange(
                                    order.id,
                                    item.name,
                                    "in-progress"
                                  )
                                }
                                className="text-amber-600 hover:text-amber-900"
                              >
                                Start Cooking
                              </button>
                            )}
                            {item.status === "in-progress" && (
                              <button
                                onClick={() =>
                                  handleItemStatusChange(
                                    order.id,
                                    item.name,
                                    "completed"
                                  )
                                }
                                className="text-green-600 hover:text-green-900"
                              >
                                Mark as Ready
                              </button>
                            )}
                            {item.status === "completed" && (
                              <span className="text-gray-400">Completed</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6 text-center text-gray-500">
                No orders found in this category.
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
