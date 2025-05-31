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
import { waiterService, getWaiterDashboardStats, mapOrderFromApi } from "../../services/waiterService";

export default function WaiterDashboard() {
  const [stats, setStats] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [tables, setTables] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingTables, setIsLoadingTables] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [isEditOrderModalOpen, setIsEditOrderModalOpen] = useState(false);
  useEffect(() => {
    // Load dashboard data and tables when component mounts
    const loadDashboardStats = async () => {
      setIsLoading(true);
      try {
        const stats = await getWaiterDashboardStats();
        setStats([
          {
            name: "Active Tables",
            value: `${stats.occupiedTables}/${stats.totalTables}`,
            icon: UserGroupIcon,
            color: "bg-blue-100 text-blue-800",
          },
          {
            name: "Pending Orders",
            value: stats.pendingOrders,
            icon: ClipboardDocumentListIcon,
            color: "bg-amber-100 text-amber-800",
          },
          {
            name: "Today's Sales",
            value: `Rp ${Number(stats.todaySales).toLocaleString("id-ID")}`,
            icon: CurrencyDollarIcon,
            color: "bg-green-100 text-green-800",
          },
        ]);
        // Normalize recentOrders using the shared mapping utility
        setRecentOrders(Array.isArray(stats.recentOrders) ? stats.recentOrders.map(mapOrderFromApi) : []);
      } catch (error) {
        setStats([
          {
            name: "Active Tables",
            value: "0/0",
            icon: UserGroupIcon,
            color: "bg-blue-100 text-blue-800",
          },
          {
            name: "Pending Orders",
            value: 0,
            icon: ClipboardDocumentListIcon,
            color: "bg-amber-100 text-amber-800",
          },
          {
            name: "Today's Sales",
            value: "Rp 0",
            icon: CurrencyDollarIcon,
            color: "bg-green-100 text-green-800",
          },
        ]);
        setRecentOrders([]);
      } finally {
        setIsLoading(false);
      }
    };
    const loadTables = async () => {
      setIsLoadingTables(true);
      try {
        const tablesData = await waiterService.getTables();

        // Transform API data to match component expectations
        const transformedTables = tablesData.map((table) => ({
          id: table.tableNumber,
          tableNumber: table.tableNumber,
          status: table.status.toLowerCase(), // Convert "Available" to "available"
          dbId: table.id, // Keep original ID for API calls
        }));

        setTables(transformedTables);
      } catch (error) {
        console.error("Failed to load tables:", error);
        // Fallback to empty array on error
        setTables([]);
      } finally {
        setIsLoadingTables(false);
      }
    };

    loadDashboardStats();
    loadTables();
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
                          {order.table ? `Table ${order.table}` : "-"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {Array.isArray(order.items) ? order.items.length : order.itemCount ?? 0}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {order.total ? (typeof order.total === "number" ? `Rp ${order.total.toLocaleString("id-ID")}` : order.total) : (order.totalAmount ? `Rp ${Number(order.totalAmount).toLocaleString("id-ID")}` : "-")}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              order.status === "served"
                                ? "bg-green-100 text-green-800"
                                : order.status === "in-process" || order.status === "in_progress"
                                ? "bg-yellow-100 text-yellow-800"
                                : order.status === "pending-payment"
                                ? "bg-purple-100 text-purple-800"
                                : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {order.status
                              ? order.status
                                  .toString()
                                  .split("-")
                                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                                  .join(" ")
                              : "-"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {order.time || order.createdAt ? (order.time || new Date(order.createdAt).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })) : "-"}
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
                              onMarkAsServed={() => handleMarkAsServed(order.id)}
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
            {isLoadingTables ? (
              <div className="animate-pulse grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {Array(12)
                  .fill(0)
                  .map((_, index) => (
                    <div key={index} className="h-20 bg-gray-200 rounded-xl"></div>
                  ))}
              </div>
            ) : tables.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {tables.map((table) => (
                  <div
                    key={table.id}
                    className={`p-4 rounded-xl shadow text-center transition-colors ${
                      table.status === "available"
                        ? "bg-green-100"
                        : table.status === "occupied"
                        ? "bg-red-100"
                        : "bg-yellow-100"
                    }`}
                  >
                    <p className="font-medium">Table {table.tableNumber}</p>
                    <p className="text-sm capitalize">{table.status}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No tables available</p>
              </div>
            )}
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
