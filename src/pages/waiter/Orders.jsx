"use client";

import { useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import NewOrderModal from "../../components/waiter/NewOrderModal";
import EditOrderModal from "../../components/waiter/EditOrderModal";
import { PlusIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";

// Mock data - completely self-contained
const MOCK_ORDERS = [
  {
    id: "ORD-001",
    table: 5,
    customer: "Walk-in",
    items: [
      {
        name: "Grilled Salmon",
        quantity: 2,
        price: 18.99,
        notes: "Medium well",
      },
      {
        name: "Caesar Salad",
        quantity: 1,
        price: 9.99,
        notes: "No croutons",
      },
      { name: "Garlic Bread", quantity: 1, price: 4.99, notes: "" },
    ],
    total: 52.96,
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
        price: 12.99,
        notes: "Spicy",
      },
    ],
    total: 40.97,
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
        notes: "Al dente",
      },
      { name: "Tiramisu", quantity: 1, price: 7.99, notes: "" },
    ],
    total: 24.98,
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
      {
        name: "French Fries",
        quantity: 1,
        price: 4.99,
        notes: "Extra salt",
      },
      { name: "Soda", quantity: 2, price: 2.99, notes: "" },
    ],
    total: 23.96,
    status: "pending",
    time: "10:45 AM",
  },
];

export default function Orders() {
  // Use static mock data instead of loading from an API
  const [orders, setOrders] = useState(MOCK_ORDERS);
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Modal states
  const [isNewOrderModalOpen, setIsNewOrderModalOpen] = useState(false);
  const [isEditOrderModalOpen, setIsEditOrderModalOpen] = useState(false);

  const filteredOrders = orders.filter((order) => {
    // Filter by status
    if (activeTab !== "all" && order.status !== activeTab) {
      return false;
    }

    // Filter by search term
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        order.id.toLowerCase().includes(searchLower) ||
        order.customer.toLowerCase().includes(searchLower) ||
        order.items.some((item) =>
          item.name.toLowerCase().includes(searchLower)
        )
      );
    }

    return true;
  });

  const handleStatusChange = (orderId, newStatus) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) => {
        if (order.id === orderId) {
          return { ...order, status: newStatus };
        }
        return order;
      })
    );
  };

  const handleCreateOrder = (newOrder) => {
    // In a real app, you would call an API to create the order
    const orderId = `ORD-${Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, "0")}`;
    const time = new Date().toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });

    const formattedItems = newOrder.items.map((item) => ({
      name: item.name,
      quantity: item.quantity,
      price: item.price,
      notes: item.notes || "",
    }));

    const formattedOrder = {
      id: orderId,
      table: newOrder.tableId,
      customer: "Walk-in",
      items: formattedItems,
      total: newOrder.total,
      status: "pending",
      time: time,
    };

    setOrders([formattedOrder, ...orders]);
    setIsNewOrderModalOpen(false);
  };

  const handleUpdateOrder = (updatedOrder) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) => {
        if (order.id === updatedOrder.id) {
          return updatedOrder;
        }
        return order;
      })
    );
  };

  const openEditOrderModal = (order) => {
    setSelectedOrder(order);
    setIsEditOrderModalOpen(true);
  };

  return (
    <DashboardLayout role="waiter">
      <div className="p-6">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">
          Orders Management
        </h1>

        {/* Search and Filter */}
        <div className="bg-white shadow-md rounded-xl mb-6 p-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-3 md:space-y-0">
            <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
              {/* Search */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-xl leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                  placeholder="Search orders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Status Filter */}
              <div className="hidden sm:block">
                <div className="border-b border-gray-200">
                  <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                    {[
                      "all",
                      "pending",
                      "in-progress",
                      "served",
                      "pending-payment",
                    ].map((tab) => (
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

            {/* New Order Button */}
            <button
              className="px-4 py-2 border border-transparent text-sm font-medium rounded-xl text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
              onClick={() => setIsNewOrderModalOpen(true)}
            >
              <PlusIcon className="-ml-1 mr-2 h-5 w-5 inline-block" />
              New Order
            </button>
          </div>

          {/* Mobile Status Filter */}
          <div className="sm:hidden mt-4">
            <label htmlFor="tabs" className="sr-only">
              Select a tab
            </label>
            <select
              id="tabs"
              name="tabs"
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm rounded-xl"
              value={activeTab}
              onChange={(e) => setActiveTab(e.target.value)}
            >
              <option value="all">All Orders</option>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="served">Served</option>
              <option value="pending-payment">Pending Payment</option>
            </select>
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-6">
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white shadow-md rounded-xl overflow-hidden"
              >
                <div className="px-4 py-5 sm:px-6 flex justify-between items-center bg-gray-50">
                  <div>
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      {order.id} - Table {order.table}
                    </h3>
                    <p className="mt-1 max-w-2xl text-sm text-gray-500">
                      Customer: {order.customer} | Ordered at {order.time}
                    </p>
                  </div>
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
                        (word) => word.charAt(0).toUpperCase() + word.slice(1)
                      )
                      .join(" ")}
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
                          Price
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Notes
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
                            ${item.price.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {item.notes || "-"}
                          </td>
                        </tr>
                      ))}
                      <tr className="bg-gray-50">
                        <td
                          colSpan={2}
                          className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
                        >
                          Total
                        </td>
                        <td
                          colSpan={2}
                          className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
                        >
                          ${order.total.toFixed(2)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="px-4 py-3 bg-gray-50 text-right sm:px-6 border-t border-gray-200">
                  <div className="flex justify-end space-x-3">
                    <button
                      className="px-3 py-1 border border-gray-300 text-sm font-medium rounded-xl text-gray-700 bg-white hover:bg-gray-50"
                      onClick={() => openEditOrderModal(order)}
                    >
                      Edit Order
                    </button>
                    {order.status === "pending" && (
                      <button
                        onClick={() =>
                          handleStatusChange(order.id, "in-progress")
                        }
                        className="px-3 py-1 border border-transparent text-sm font-medium rounded-xl text-white bg-amber-600 hover:bg-amber-700"
                      >
                        Send to Kitchen
                      </button>
                    )}
                    {order.status === "in-progress" && (
                      <button
                        onClick={() => handleStatusChange(order.id, "served")}
                        className="px-3 py-1 border border-transparent text-sm font-medium rounded-xl text-white bg-green-600 hover:bg-green-700"
                      >
                        Mark as Served
                      </button>
                    )}
                    {order.status === "served" && (
                      <button
                        onClick={() =>
                          handleStatusChange(order.id, "pending-payment")
                        }
                        className="px-3 py-1 border border-transparent text-sm font-medium rounded-xl text-white bg-purple-600 hover:bg-purple-700"
                      >
                        Request Payment
                      </button>
                    )}
                    {order.status === "pending-payment" && (
                      <button
                        onClick={() =>
                          alert(`Process Payment for Order ${order.id}`)
                        }
                        className="px-3 py-1 border border-transparent text-sm font-medium rounded-xl text-white bg-blue-600 hover:bg-blue-700"
                      >
                        Process Payment
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white shadow-md rounded-xl p-6 text-center">
              <p className="text-gray-500">
                No orders found matching your criteria.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* New Order Modal */}
      <NewOrderModal
        isOpen={isNewOrderModalOpen}
        onClose={() => setIsNewOrderModalOpen(false)}
        tableId={1} // Default to table 1
        onCreateOrder={handleCreateOrder}
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
