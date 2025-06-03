"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import PageTitle from "../../components/common/PageTitle";
import { updateOrderStatusChef, getOrdersForChef } from "../../services/chefService";
import { useNotification } from "../../contexts/NotificationContext";

export default function OrdersQueue() {
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState("In Queue");
  const [isLoading, setIsLoading] = useState(true);
  const { showError } = useNotification();

  useEffect(() => {
    const loadOrders = async () => {
      setIsLoading(true);
      try {
        const apiOrders = await getOrdersForChef();
        // Map API data to FE format
        const mappedOrders = apiOrders.map((order) => ({
          id: order.id,
          table: order.table?.tableNumber || "-",
          items: order.orderItems.map((item) => ({
            name: item.menuItem?.name || "-",
            quantity: item.quantity,
            status:
              order.status === "IN_QUEUE"
                ? "In Queue"
                : order.status === "IN_PROCESS"
                ? "in-process"
                : order.status === "READY"
                ? "Ready"
                : order.status,
            notes: item.notes || "",
          })),
          status:
            order.status === "IN_QUEUE"
              ? "In Queue"
              : order.status === "IN_PROCESS"
              ? "in-process"
              : order.status === "READY"
              ? "Ready"
              : order.status,
          time: order.orderTime
            ? new Date(order.orderTime).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })
            : "-",
        }));
        setOrders(mappedOrders);
      } catch (err) {
        setOrders([]);
      } finally {
        setIsLoading(false);
      }
    };
    loadOrders();
  }, []);

  const filteredOrders = orders.filter((order) => {
    if (activeTab === "all") return true;

    // Check if any item in the order has the status matching the active tab
    return order.items.some((item) => item.status === activeTab);
  });

  // Handler untuk update status order chef
  const handleItemStatusChange = async (orderId, itemName, newStatus) => {
    // Map FE status ke BE status
    let backendStatus = null;
    if (newStatus === "in-process") backendStatus = "IN_PROCESS";
    if (newStatus === "Ready") backendStatus = "READY";
    if (!backendStatus) return;

    try {
      const updatedOrder = await updateOrderStatusChef(orderId, backendStatus);
      // Map API response ke FE format
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === updatedOrder.id
            ? {
                ...order,
                status:
                  updatedOrder.status === "IN_QUEUE"
                    ? "In Queue"
                    : updatedOrder.status === "IN_PROCESS"
                    ? "in-process"
                    : updatedOrder.status === "READY"
                    ? "Ready"
                    : updatedOrder.status,
                items: updatedOrder.orderItems.map((item) => ({
                  name: item.menuItem?.name || "-",
                  quantity: item.quantity,
                  status:
                    updatedOrder.status === "IN_QUEUE"
                      ? "In Queue"
                      : updatedOrder.status === "IN_PROCESS"
                      ? "in-process"
                      : updatedOrder.status === "READY"
                      ? "Ready"
                      : updatedOrder.status,
                  notes: item.notes || "",
                })),
              }
            : order
        )
      );
    } catch (err) {
      showError(
        "Gagal update status order",
        err?.response?.data?.message || err?.message || "Terjadi kesalahan saat update status order."
      );
    }
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
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-xl"
              value={activeTab}
              onChange={(e) => setActiveTab(e.target.value)}
            >
              <option value="In Queue">In Queue</option>
              <option value="in-process">In Process</option>
              <option value="Ready">Ready</option>
              <option value="all">All Orders</option>
            </select>
          </div>
          <div className="hidden sm:block">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                {["In Queue", "in-process", "Ready", "all"].map((tab) => (
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
                      order.status === "Ready"
                        ? "bg-green-100 text-green-800"
                        : order.status === "in-process"
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
                                item.status === "Ready"
                                  ? "bg-green-100 text-green-800"
                                  : item.status === "in-process"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-blue-100 text-blue-800"
                              }`}
                            >
                              {item.status.charAt(0).toUpperCase() +
                                item.status.slice(1)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {item.status === "In Queue" && (
                              <button
                                onClick={() =>
                                  handleItemStatusChange(
                                    order.id,
                                    item.name,
                                    "in-process"
                                  )
                                }
                                className="text-amber-600 hover:text-amber-900"
                              >
                                Start Cooking
                              </button>
                            )}
                            {item.status === "in-process" && (
                              <button
                                onClick={() =>
                                  handleItemStatusChange(
                                    order.id,
                                    item.name,
                                    "Ready"
                                  )
                                }
                                className="text-green-600 hover:text-green-900"
                              >
                                Mark as Ready
                              </button>
                            )}
                            {item.status === "Ready" && (
                              <span className="text-gray-400">Ready</span>
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
            <div className="bg-white shadow overflow-hidden sm:rounded-xl">
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
