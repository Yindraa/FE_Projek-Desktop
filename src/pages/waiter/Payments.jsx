"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import {
  MagnifyingGlassIcon,
  PrinterIcon,
  CreditCardIcon,
  QrCodeIcon,
  BanknotesIcon,
} from "@heroicons/react/24/outline";

export default function Payments() {
  const [pendingPayments, setPendingPayments] = useState([]);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    // Simulate API call with mock data
    const loadPaymentData = async () => {
      setIsLoading(true);

      // Simulate API delay
      setTimeout(() => {
        // Mock pending payments data
        setPendingPayments([
          {
            id: "ORD-003",
            table: 8,
            customer: "Sarah Johnson",
            items: [
              { name: "Spaghetti Carbonara", quantity: 1, price: 16.99 },
              { name: "Tiramisu", quantity: 1, price: 7.99 },
            ],
            subtotal: 24.98,
            tax: 2.5,
            total: 27.48,
            time: "10:40 AM",
          },
          {
            id: "ORD-005",
            table: 12,
            customer: "Michael Brown",
            items: [
              { name: "Steak", quantity: 1, price: 24.99 },
              { name: "Mashed Potatoes", quantity: 1, price: 5.99 },
              { name: "Red Wine", quantity: 1, price: 8.99 },
            ],
            subtotal: 39.97,
            tax: 4.0,
            total: 43.97,
            time: "11:05 AM",
          },
        ]);

        // Mock recent transactions data
        setRecentTransactions([
          {
            id: "TRX-001",
            orderId: "ORD-001",
            table: 5,
            amount: 52.96,
            method: "credit",
            status: "completed",
            time: "10:25 AM",
          },
          {
            id: "TRX-002",
            orderId: "ORD-004",
            table: 1,
            amount: 23.96,
            method: "cash",
            status: "completed",
            time: "10:55 AM",
          },
          {
            id: "TRX-003",
            orderId: "ORD-002",
            table: 3,
            amount: 40.97,
            method: "qr",
            status: "completed",
            time: "11:10 AM",
          },
        ]);

        setIsLoading(false);
      }, 1000);
    };

    loadPaymentData();
  }, []);

  const handlePaymentSelect = (payment) => {
    setSelectedPayment(payment);
    setPaymentMethod("cash"); // Reset payment method when selecting a new payment
  };

  const handleProcessPayment = () => {
    if (!selectedPayment) return;

    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      // Add to recent transactions
      const newTransaction = {
        id: `TRX-${Math.floor(Math.random() * 1000)}`,
        orderId: selectedPayment.id,
        table: selectedPayment.table,
        amount: selectedPayment.total,
        method: paymentMethod,
        status: "completed",
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setRecentTransactions((prev) => [newTransaction, ...prev]);

      // Remove from pending payments
      setPendingPayments((prev) =>
        prev.filter((p) => p.id !== selectedPayment.id)
      );

      // Reset selected payment
      setSelectedPayment(null);
      setIsProcessing(false);
    }, 1500);
  };

  const filteredPendingPayments = pendingPayments.filter((payment) => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      payment.id.toLowerCase().includes(searchLower) ||
      payment.customer.toLowerCase().includes(searchLower) ||
      `table ${payment.table}`.toLowerCase().includes(searchLower)
    );
  });

  const filteredTransactions = recentTransactions.filter((transaction) => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      transaction.id.toLowerCase().includes(searchLower) ||
      transaction.orderId.toLowerCase().includes(searchLower) ||
      `table ${transaction.table}`.toLowerCase().includes(searchLower)
    );
  });

  return (
    <DashboardLayout role="waiter">
      <div className="p-6">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">Payments</h1>

        {/* Search */}
        <div className="bg-white shadow-md rounded-xl mb-6 p-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-xl leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
              placeholder="Search by order ID, table, or customer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pending Payments */}
          <div className="bg-white shadow-md rounded-xl overflow-hidden">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Pending Payments
              </h3>
            </div>
            <div className="px-4 py-3 sm:px-6">
              {isLoading ? (
                <div className="animate-pulse space-y-4">
                  {Array(2)
                    .fill(0)
                    .map((_, index) => (
                      <div
                        key={index}
                        className="h-24 bg-gray-200 rounded mb-4"
                      ></div>
                    ))}
                </div>
              ) : filteredPendingPayments.length > 0 ? (
                <div className="space-y-4">
                  {filteredPendingPayments.map((payment) => (
                    <div
                      key={payment.id}
                      className={`border rounded-xl overflow-hidden cursor-pointer transition-colors ${
                        selectedPayment?.id === payment.id
                          ? "border-amber-500 bg-amber-50"
                          : "border-gray-200 hover:bg-gray-50"
                      }`}
                      onClick={() => handlePaymentSelect(payment)}
                    >
                      <div className="px-4 py-3 border-b border-gray-200">
                        <div className="flex justify-between items-center">
                          <h4 className="text-md font-medium text-gray-900">
                            {payment.id} - Table {payment.table}
                          </h4>
                          <span className="text-sm text-gray-500">
                            {payment.time}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500">
                          Customer: {payment.customer}
                        </p>
                      </div>
                      <div className="px-4 py-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Subtotal:</span>
                          <span className="text-gray-900">
                            ${payment.subtotal.toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Tax:</span>
                          <span className="text-gray-900">
                            ${payment.tax.toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-between font-medium mt-2">
                          <span className="text-gray-900">Total:</span>
                          <span className="text-gray-900">
                            ${payment.total.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-gray-500">
                  No pending payments found.
                </div>
              )}
            </div>
          </div>

          {/* Payment Processing or Recent Transactions */}
          {selectedPayment ? (
            <div className="bg-white shadow-md rounded-xl overflow-hidden">
              <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Process Payment
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  Order {selectedPayment.id} - Table {selectedPayment.table}
                </p>
              </div>
              <div className="px-4 py-5 sm:px-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">
                      Order Summary
                    </h4>
                    <div className="mt-2 border rounded-xl overflow-hidden">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th
                              scope="col"
                              className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Item
                            </th>
                            <th
                              scope="col"
                              className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Qty
                            </th>
                            <th
                              scope="col"
                              className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Price
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {selectedPayment.items.map((item, index) => (
                            <tr key={index}>
                              <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                                {item.name}
                              </td>
                              <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                                {item.quantity}
                              </td>
                              <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 text-right">
                                ${item.price.toFixed(2)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot className="bg-gray-50">
                          <tr>
                            <td
                              colSpan={2}
                              className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900"
                            >
                              Subtotal
                            </td>
                            <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900 text-right">
                              ${selectedPayment.subtotal.toFixed(2)}
                            </td>
                          </tr>
                          <tr>
                            <td
                              colSpan={2}
                              className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900"
                            >
                              Tax
                            </td>
                            <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900 text-right">
                              ${selectedPayment.tax.toFixed(2)}
                            </td>
                          </tr>
                          <tr>
                            <td
                              colSpan={2}
                              className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900"
                            >
                              Total
                            </td>
                            <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900 text-right">
                              ${selectedPayment.total.toFixed(2)}
                            </td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-500">
                      Payment Method
                    </h4>
                    <div className="mt-2 grid grid-cols-3 gap-3">
                      <div
                        className={`border rounded-xl p-3 flex flex-col items-center cursor-pointer ${
                          paymentMethod === "cash"
                            ? "border-amber-500 bg-amber-50"
                            : "border-gray-200 hover:bg-gray-50"
                        }`}
                        onClick={() => setPaymentMethod("cash")}
                      >
                        <BanknotesIcon className="h-6 w-6 text-gray-400" />
                        <span className="mt-2 text-sm font-medium text-gray-900">
                          Cash
                        </span>
                      </div>
                      <div
                        className={`border rounded-xl p-3 flex flex-col items-center cursor-pointer ${
                          paymentMethod === "credit"
                            ? "border-amber-500 bg-amber-50"
                            : "border-gray-200 hover:bg-gray-50"
                        }`}
                        onClick={() => setPaymentMethod("credit")}
                      >
                        <CreditCardIcon className="h-6 w-6 text-gray-400" />
                        <span className="mt-2 text-sm font-medium text-gray-900">
                          Card
                        </span>
                      </div>
                      <div
                        className={`border rounded-xl p-3 flex flex-col items-center cursor-pointer ${
                          paymentMethod === "qr"
                            ? "border-amber-500 bg-amber-50"
                            : "border-gray-200 hover:bg-gray-50"
                        }`}
                        onClick={() => setPaymentMethod("qr")}
                      >
                        <QrCodeIcon className="h-6 w-6 text-gray-400" />
                        <span className="mt-2 text-sm font-medium text-gray-900">
                          QR Code
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 flex justify-end space-x-3">
                    <button
                      className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-xl text-gray-700 bg-white hover:bg-gray-50"
                      onClick={() => setSelectedPayment(null)}
                    >
                      Cancel
                    </button>
                    <button
                      className="px-4 py-2 border border-transparent text-sm font-medium rounded-xl text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
                      onClick={handleProcessPayment}
                      disabled={isProcessing}
                    >
                      {isProcessing ? (
                        <span className="flex items-center">
                          <svg
                            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Processing...
                        </span>
                      ) : (
                        "Process Payment"
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white shadow-md rounded-xl overflow-hidden">
              <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Recent Transactions
                </h3>
              </div>
              <div className="px-4 py-3 sm:px-6">
                {isLoading ? (
                  <div className="animate-pulse space-y-4">
                    {Array(3)
                      .fill(0)
                      .map((_, index) => (
                        <div
                          key={index}
                          className="h-16 bg-gray-200 rounded mb-4"
                        ></div>
                      ))}
                  </div>
                ) : filteredTransactions.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Transaction ID
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Order
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
                            Method
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
                        {filteredTransactions.map((transaction) => (
                          <tr key={transaction.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-amber-700">
                              {transaction.id}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {transaction.orderId} (Table {transaction.table})
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              ${transaction.amount.toFixed(2)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <span
                                className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                  transaction.method === "cash"
                                    ? "bg-green-100 text-green-800"
                                    : transaction.method === "credit"
                                    ? "bg-blue-100 text-blue-800"
                                    : "bg-purple-100 text-purple-800"
                                }`}
                              >
                                {transaction.method === "cash"
                                  ? "Cash"
                                  : transaction.method === "credit"
                                  ? "Card"
                                  : "QR Code"}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {transaction.time}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <button className="text-amber-600 hover:text-amber-900">
                                <PrinterIcon className="h-5 w-5" />
                                <span className="sr-only">Print Receipt</span>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-6 text-gray-500">
                    No transactions found.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
