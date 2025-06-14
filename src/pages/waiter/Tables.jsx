"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import OrderDetailsModal from "../../components/waiter/OrderDetailsModal";
import NewOrderModal from "../../components/waiter/NewOrderModal";
import SeatCustomersModal from "../../components/waiter/SeatCustomersModal";
import ConfirmationModal from "../../components/waiter/ConfirmationModal";
import { PlusIcon } from "@heroicons/react/24/outline";
import { waiterService } from "../../services/waiterService";

export default function Tables() {
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Modal states
  const [isOrderDetailsModalOpen, setIsOrderDetailsModalOpen] = useState(false);
  const [isNewOrderModalOpen, setIsNewOrderModalOpen] = useState(false);
  const [isSeatCustomersModalOpen, setIsSeatCustomersModalOpen] =
    useState(false);
  const [isCancelReservationModalOpen, setIsCancelReservationModalOpen] =
    useState(false);
  useEffect(() => {
    loadTables();
  }, []);
  const loadTables = async () => {
    setIsLoading(true);
    try {
      const tablesData = await waiterService.getTables();
      
      // Transform API data to match component expectations
      const transformedTables = tablesData.map(table => ({
        id: table.tableNumber,
        tableNumber: table.tableNumber,
        status: table.status.toLowerCase(), // Convert "Available" to "available"
        dbId: table.id, // Keep original ID for API calls
        orders: [], // Will be populated when table is clicked
        createdAt: table.createdAt,
        updatedAt: table.updatedAt
      }));
      
      setTables(transformedTables);
    } catch (error) {
      console.error('Failed to load tables:', error);
      // Fallback to empty array on error
      setTables([]);
    } finally {
      setIsLoading(false);
    }
  };
  const handleTableClick = async (tableId) => {
    try {
      // Get the table from local state for basic info
      const localTable = tables.find((table) => table.id === tableId);
      if (!localTable) return;

      // Fetch detailed table information including active orders from API
      const tableDetails = await waiterService.getTableDetails(tableId);
      
      // Merge local table info with API details
      const detailedTable = {
        ...localTable,
        orders: tableDetails.activeOrder ? [tableDetails.activeOrder] : [],
        // Update status if it changed
        status: tableDetails.status ? tableDetails.status.toLowerCase() : localTable.status
      };
      
      setSelectedTable(detailedTable);
    } catch (error) {
      console.error('Failed to fetch table details:', error);
      // Fallback to local table data
      setSelectedTable(tables.find((table) => table.id === tableId));
    }
  };

  const handleViewOrderDetails = (order) => {
    setSelectedOrder(order);
    setIsOrderDetailsModalOpen(true);
  };

  const handleMarkAsServed = (orderId) => {
    // In a real app, you would call an API to update the order status
    const updatedTables = tables.map((table) => {
      if (table.id === selectedTable.id) {
        const updatedOrders = table.orders.map((order) =>
          order.id === orderId ? { ...order, status: "served" } : order
        );
        return { ...table, orders: updatedOrders };
      }
      return table;
    });

    setTables(updatedTables);
    setSelectedTable(
      updatedTables.find((table) => table.id === selectedTable.id)
    );
  };  const handleCreateOrder = (apiResponse) => {
    // Handle API response format from /waiter/order endpoint
    const time = new Date().toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });

    // Format order data to match frontend expectations
    const formattedOrder = {
      id: apiResponse.id,
      items: apiResponse.orderItems ? apiResponse.orderItems.length : 0,
      total: waiterService.formatPrice(
        typeof apiResponse.totalAmount === 'string' 
          ? parseFloat(apiResponse.totalAmount) 
          : apiResponse.totalAmount
      ),
      status: apiResponse.status ? apiResponse.status.toLowerCase() : "pending",
      time: time,
    };

    const updatedTables = tables.map((table) => {
      if (table.id === selectedTable.id) {
        return {
          ...table,
          status: "occupied",
          orders: [...table.orders, formattedOrder],
        };
      }
      return table;
    });

    setTables(updatedTables);
    setSelectedTable(
      updatedTables.find((table) => table.id === selectedTable.id)
    );
  };

  const handleSeatCustomers = (customerData) => {
    // In a real app, you would call an API to update the table status
    const updatedTables = tables.map((table) => {
      if (table.id === selectedTable.id) {
        return {
          ...table,
          status: "occupied",
          customerData,
        };
      }
      return table;
    });

    setTables(updatedTables);
    setSelectedTable(
      updatedTables.find((table) => table.id === selectedTable.id)
    );
  };

  const handleCancelReservation = () => {
    // In a real app, you would call an API to update the table status
    const updatedTables = tables.map((table) => {
      if (table.id === selectedTable.id) {
        return {
          ...table,
          status: "available",
        };
      }
      return table;
    });

    setTables(updatedTables);
    setSelectedTable(
      updatedTables.find((table) => table.id === selectedTable.id)
    );
  };

  return (
    <DashboardLayout role="waiter">
      <div className="p-6">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">
          Tables Overview
        </h1>

        {/* Tables Grid */}
        <div className="bg-white shadow-md rounded-xl overflow-hidden mb-6">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Tables Layout
            </h3>
          </div>
          <div className="p-4">
            {isLoading ? (
              <div className="animate-pulse grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {Array(20)
                  .fill(0)
                  .map((_, index) => (
                    <div key={index} className="h-24 bg-gray-200 rounded"></div>
                  ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {tables.map((table) => (
                  <button
                    key={table.id}
                    onClick={() => handleTableClick(table.id)}
                    className={`p-4 rounded-xl shadow text-center ${
                      table.status === "available"
                        ? "bg-green-100 hover:bg-green-200"
                        : table.status === "occupied"
                        ? "bg-red-100 hover:bg-red-200"
                        : "bg-yellow-100 hover:bg-yellow-200"
                    } ${
                      selectedTable?.id === table.id
                        ? "ring-2 ring-amber-500"
                        : ""
                    }`}
                  >
                    <p className="font-medium">Table {table.id}</p>
                    <p className="text-sm capitalize">{table.status}</p>
                    {table.orders.length > 0 && (
                      <p className="text-xs mt-1">
                        {table.orders.length} order(s)
                      </p>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Selected Table Details */}
        {selectedTable && (
          <div className="bg-white shadow-md rounded-xl overflow-hidden">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Table {selectedTable.id} -{" "}
                {selectedTable.status.charAt(0).toUpperCase() +
                  selectedTable.status.slice(1)}
              </h3>
              {selectedTable.status === "available" && (
                <button
                  className="px-4 py-2 border border-transparent text-sm font-medium rounded-xl text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
                  onClick={() => setIsNewOrderModalOpen(true)}
                >
                  <PlusIcon className="-ml-1 mr-2 h-5 w-5 inline-block" />
                  New Order
                </button>
              )}
            </div>

            {selectedTable.orders.length > 0 ? (
              <div className="divide-y divide-gray-200">
                {selectedTable.orders.map((order) => (
                  <div key={order.id} className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-amber-600 truncate">
                        {order.id}
                      </p>
                      <div className="ml-2 flex-shrink-0 flex">
                        <p
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
                        </p>
                      </div>
                    </div>
                    <div className="mt-2 sm:flex sm:justify-between">
                      <div className="sm:flex">
                        <p className="flex items-center text-sm text-gray-500">
                          {order.items} items
                        </p>
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                        <p>Total: {order.total}</p>
                      </div>
                    </div>
                    <div className="mt-3 flex space-x-2">
                      <button
                        className="px-3 py-1 border border-gray-300 text-sm font-medium rounded-xl text-gray-700 bg-white hover:bg-gray-50"
                        onClick={() => handleViewOrderDetails(order)}
                      >
                        View Details
                      </button>
                      {order.status === "served" && (
                        <button className="px-3 py-1 border border-transparent text-sm font-medium rounded-xl text-white bg-amber-600 hover:bg-amber-700">
                          Process Payment
                        </button>
                      )}
                      {order.status === "in-progress" && (
                        <button
                          className="px-3 py-1 border border-transparent text-sm font-medium rounded-xl text-white bg-green-600 hover:bg-green-700"
                          onClick={() => handleMarkAsServed(order.id)}
                        >
                          Mark as Served
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="px-4 py-5 sm:px-6 text-center text-gray-500">
                No active orders for this table.
              </div>
            )}

            {selectedTable.status === "available" && (
              <div className="px-4 py-4 sm:px-6 bg-gray-50 border-t border-gray-200">
                <p className="text-sm text-gray-500">
                  This table is available for new customers.
                </p>
                <button
                  className="mt-2 w-full px-4 py-2 border border-transparent text-sm font-medium rounded-xl text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
                  onClick={() => setIsSeatCustomersModalOpen(true)}
                >
                  Seat Customers
                </button>
              </div>
            )}

            {selectedTable.status === "reserved" && (
              <div className="px-4 py-4 sm:px-6 bg-gray-50 border-t border-gray-200">
                <p className="text-sm text-gray-500">
                  This table is reserved for upcoming customers.
                </p>
                <div className="mt-2 flex space-x-2">
                  <button
                    className="flex-1 px-4 py-2 border border-transparent text-sm font-medium rounded-xl text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
                    onClick={() => setIsSeatCustomersModalOpen(true)}
                  >
                    Seat Customers
                  </button>
                  <button
                    className="flex-1 px-4 py-2 border border-gray-300 text-sm font-medium rounded-xl text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
                    onClick={() => setIsCancelReservationModalOpen(true)}
                  >
                    Cancel Reservation
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      <OrderDetailsModal
        isOpen={isOrderDetailsModalOpen}
        onClose={() => setIsOrderDetailsModalOpen(false)}
        order={selectedOrder}
      />

      {/* New Order Modal */}
      <NewOrderModal
        isOpen={isNewOrderModalOpen}
        onClose={() => setIsNewOrderModalOpen(false)}
        tableId={selectedTable?.id}
        onCreateOrder={handleCreateOrder}
      />

      {/* Seat Customers Modal */}
      <SeatCustomersModal
        isOpen={isSeatCustomersModalOpen}
        onClose={() => setIsSeatCustomersModalOpen(false)}
        tableId={selectedTable?.id}
        onSeatCustomers={handleSeatCustomers}
      />

      {/* Cancel Reservation Confirmation Modal */}
      <ConfirmationModal
        isOpen={isCancelReservationModalOpen}
        onClose={() => setIsCancelReservationModalOpen(false)}
        onConfirm={handleCancelReservation}
        title="Cancel Reservation"
        message={`Are you sure you want to cancel the reservation for Table ${selectedTable?.id}? This action cannot be undone.`}
        confirmButtonText="Cancel Reservation"
        confirmButtonColor="red"
      />
    </DashboardLayout>
  );
}
