"use client";

import { useState, useEffect, useRef } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import ReceiptModal from "../../components/waiter/ReceiptModal";
import {
  MagnifyingGlassIcon,
  PrinterIcon,
  CreditCardIcon,
  QrCodeIcon,
  BanknotesIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import waiterService from "../../services/waiterService";

export default function Payments() {
  const [pendingPayments, setPendingPayments] = useState([]);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showQrCode, setShowQrCode] = useState(false);
  const [showCardForm, setShowCardForm] = useState(false);
  const [cashAmount, setCashAmount] = useState("");
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    cardHolder: "",
    expiryDate: "",
    cvv: "",
  });
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  // Reference to store transaction details for receipt printing
  const transactionDetailsRef = useRef({});

  useEffect(() => {
    // Load pending payments and recent transactions from API
    const loadPaymentData = async () => {
      setIsLoading(true);
      try {
        const pending = await waiterService.getPendingPayments();
        setPendingPayments(
          pending.map((order) => ({
            ...order,
            subtotal: order.total * 0.9, // Assume 10% tax
            tax: order.total * 0.1,
            total: order.total,
            time:
              order.time ||
              (order.orderTime
                ? new Date(order.orderTime).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "-"),
          }))
        );
        // Load recent transactions from API
        const recent = await waiterService.getRecentOrders();
        setRecentTransactions(
          recent.map((order) => ({
            id: order.id,
            orderId: order.id,
            table: order.table,
            customer: order.customer,
            amount: order.total,
            method: order.paymentOption
              ? order.paymentOption.toLowerCase() === "card"
                ? "credit"
                : order.paymentOption.toLowerCase() === "qris"
                ? "qr"
                : order.paymentOption.toLowerCase()
              : "cash",
            status: order.status,
            time: order.paymentTime
              ? new Date(order.paymentTime).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : order.time ||
                (order.orderTime
                  ? new Date(order.orderTime).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "-"),
            date: order.paymentTime
              ? new Date(order.paymentTime).toLocaleDateString()
              : order.orderTime
              ? new Date(order.orderTime).toLocaleDateString()
              : "-",
            items: order.items,
            subtotal: order.total * 0.9,
            tax: order.total * 0.1,
            total: order.total,
            cashReceived: null,
            change: null,
          }))
        );
        setIsLoading(false);
      } catch (err) {
        setPendingPayments([]);
        setRecentTransactions([]);
        setIsLoading(false);
      }
    };
    loadPaymentData();
  }, []);

  const handlePaymentSelect = async (payment) => {
    setIsLoading(true);
    try {
      const detail = await waiterService.getPendingPaymentDetail(payment.id);
      setSelectedPayment({
        ...detail,
        subtotal: detail.total * 0.9,
        tax: detail.total * 0.1,
        total: detail.total,
        time:
          detail.time ||
          (detail.orderTime
            ? new Date(detail.orderTime).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })
            : "-"),
      });
      setPaymentMethod("cash");
      setShowQrCode(false);
      setShowCardForm(false);
      setIsLoading(false);
    } catch (err) {
      setSelectedPayment(null);
      setIsLoading(false);
    }
  };

  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
    setShowQrCode(method === "qr");
    setShowCardForm(method === "credit");

    if (method === "cash" && selectedPayment) {
      setCashAmount(selectedPayment.total.toFixed(2));
    }
  };

  const handleCardInputChange = (e) => {
    const { name, value } = e.target;
    setCardDetails({
      ...cardDetails,
      [name]: value,
    });
  };

  const calculateChange = () => {
    if (!selectedPayment || !cashAmount) return 0;
    const cashValue = Number.parseFloat(cashAmount);
    return cashValue > selectedPayment.total ? cashValue - selectedPayment.total : 0;
  };

  const handleProcessPayment = async () => {
    if (!selectedPayment) return;

    // Validate payment method inputs
    if (
      paymentMethod === "cash" &&
      Number.parseFloat(cashAmount) < selectedPayment.total
    ) {
      alert("Cash amount must be equal to or greater than the total amount");
      return;
    }

    if (paymentMethod === "credit") {
      // Simple validation for card details
      if (
        !cardDetails.cardNumber ||
        !cardDetails.cardHolder ||
        !cardDetails.expiryDate ||
        !cardDetails.cvv
      ) {
        alert("Please fill in all card details");
        return;
      }

      if (cardDetails.cardNumber.replace(/\s/g, "").length !== 16) {
        alert("Card number must be 16 digits");
        return;
      }

      if (cardDetails.cvv.length < 3) {
        alert("CVV must be at least 3 digits");
        return;
      }
    }

    setIsProcessing(true);
    try {
      let paymentOption = "CASH";
      if (paymentMethod === "credit") paymentOption = "CARD";
      if (paymentMethod === "qr") paymentOption = "QRIS";
      const updatedOrder = await waiterService.completePayment(
        selectedPayment.id,
        paymentOption
      );
      // Add to recent transactions (simulate receipt)
      const newTransaction = {
        id: `TRX-${Math.floor(Math.random() * 1000)}`,
        orderId: updatedOrder.id,
        table: updatedOrder.table,
        customer: updatedOrder.customer,
        amount: updatedOrder.total,
        method: paymentMethod,
        status: "completed",
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        date: new Date().toLocaleDateString(),
        items: updatedOrder.items,
        subtotal: updatedOrder.total * 0.9,
        tax: updatedOrder.total * 0.1,
        total: updatedOrder.total,
        cashReceived:
          paymentMethod === "cash" ? Number.parseFloat(cashAmount) : null,
        change: paymentMethod === "cash" ? calculateChange() : null,
      };
      setRecentTransactions((prev) => [newTransaction, ...prev]);
      setPendingPayments((prev) => prev.filter((p) => p.id !== updatedOrder.id));
      if (paymentMethod === "cash" || paymentMethod === "credit") {
        setSelectedTransaction(newTransaction);
        setIsReceiptModalOpen(true);
      }
      setSelectedPayment(null);
      setShowQrCode(false);
      setShowCardForm(false);
      setCardDetails({ cardNumber: "", cardHolder: "", expiryDate: "", cvv: "" });
      setCashAmount("");
      setIsProcessing(false);
    } catch (err) {
      alert(err.message || "Failed to complete payment");
      setIsProcessing(false);
    }
  };

  const handlePrintReceipt = (transaction) => {
    setSelectedTransaction(transaction);
    setIsReceiptModalOpen(true);
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

  // Format card number with spaces
  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(" ");
    } else {
      return value;
    }
  };

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
              <h3 className="text-lg leading-6 font-medium text-gray-900">Pending Payments</h3>
            </div>
            <div className="px-4 py-3 sm:px-6">
              {isLoading ? (
                <div className="animate-pulse space-y-4">
                  {Array(2)
                    .fill(0)
                    .map((_, index) => (
                      <div key={index} className="h-24 bg-gray-200 rounded mb-4"></div>
                    ))}
                </div>
              ) : filteredPendingPayments.length > 0 ? (
                <div className="space-y-4">
                  {filteredPendingPayments.map((payment) => (
                    <div
                      key={payment.id}
                      className={`border rounded-xl overflow-hidden cursor-pointer transition-colors ${selectedPayment?.id === payment.id ? "border-amber-500 bg-amber-50" : "border-gray-200 hover:bg-gray-50"}`}
                      onClick={() => handlePaymentSelect(payment)}
                    >
                      <div className="px-4 py-3 border-b border-gray-200">
                        <div className="flex justify-between items-center">
                          <h4 className="text-md font-medium text-gray-900">{payment.id} - Table {payment.table}</h4>
                          <span className="text-sm text-gray-500">{payment.time}</span>
                        </div>
                        <p className="text-sm text-gray-500">Customer: {payment.customer}</p>
                      </div>
                      <div className="px-4 py-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Subtotal:</span>
                          <span className="text-gray-900">{waiterService.formatPrice(payment.subtotal)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Tax:</span>
                          <span className="text-gray-900">{waiterService.formatPrice(payment.tax)}</span>
                        </div>
                        <div className="flex justify-between font-medium mt-2">
                          <span className="text-gray-900">Total:</span>
                          <span className="text-gray-900">{waiterService.formatPrice(payment.total)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-gray-500">No pending payments found.</div>
              )}
            </div>
          </div> {/* <<<<<<<<<<<<<<<<<<<< THIS IS THE CORRECTED CLOSING DIV for "Pending Payments" section */}
          
          {/* Payment Processing or Recent Transactions */}
          {selectedPayment ? (
            <div className="bg-white shadow-md rounded-xl overflow-hidden">
              <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Process Payment</h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  Order {selectedPayment.id} - Table {selectedPayment.table}
                </p>
              </div>
              <div className="px-4 py-5 sm:px-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Order Summary</h4>
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
                                {waiterService.formatPrice(item.price)}
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
                              {waiterService.formatPrice(selectedPayment.subtotal)}
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
                              {waiterService.formatPrice(selectedPayment.tax)}
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
                              {waiterService.formatPrice(selectedPayment.total)}
                            </td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Payment Method</h4>
                    <div className="mt-2 grid grid-cols-3 gap-3">
                      <div
                        className={`border rounded-xl p-3 flex flex-col items-center cursor-pointer ${paymentMethod === "cash" ? "border-amber-500 bg-amber-50" : "border-gray-200 hover:bg-gray-50"}`}
                        onClick={() => handlePaymentMethodChange("cash")}
                      >
                        <BanknotesIcon className="h-6 w-6 text-gray-400" />
                        <span className="mt-2 text-sm font-medium text-gray-900">
                          Cash
                        </span>
                      </div>
                      <div
                        className={`border rounded-xl p-3 flex flex-col items-center cursor-pointer ${paymentMethod === "credit" ? "border-amber-500 bg-amber-50" : "border-gray-200 hover:bg-gray-50"}`}
                        onClick={() => handlePaymentMethodChange("credit")}
                      >
                        <CreditCardIcon className="h-6 w-6 text-gray-400" />
                        <span className="mt-2 text-sm font-medium text-gray-900">
                          Card
                        </span>
                      </div>
                      <div
                        className={`border rounded-xl p-3 flex flex-col items-center cursor-pointer ${paymentMethod === "qr" ? "border-amber-500 bg-amber-50" : "border-gray-200 hover:bg-gray-50"}`}
                        onClick={() => handlePaymentMethodChange("qr")}
                      >
                        <QrCodeIcon className="h-6 w-6 text-gray-400" />
                        <span className="mt-2 text-sm font-medium text-gray-900">
                          QR Code
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Cash Payment Form */}
                  {paymentMethod === "cash" && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-xl">
                      <div className="mb-4">
                        <label
                          htmlFor="cashAmount"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Cash Received
                        </label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="text-gray-500 sm:text-sm">$</span> {/* Consider making currency dynamic or based on locale */}
                          </div>
                          <input
                            type="number"
                            name="cashAmount"
                            id="cashAmount"
                            className="focus:ring-amber-500 focus:border-amber-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                            placeholder="0.00"
                            step="0.01"
                            min={selectedPayment.total}
                            value={cashAmount}
                            onChange={(e) => setCashAmount(e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="flex justify-between text-sm">
                        <span className="font-medium text-gray-700">
                          Change:
                        </span>
                        <span className="font-medium text-green-600">
                          {waiterService.formatPrice(calculateChange())}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Credit Card Payment Form */}
                  {paymentMethod === "credit" && showCardForm && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-xl">
                      <div className="space-y-4">
                        <div>
                          <label
                            htmlFor="cardNumber"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Card Number
                          </label>
                          <input
                            type="text"
                            name="cardNumber"
                            id="cardNumber"
                            className="mt-1 focus:ring-amber-500 focus:border-amber-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                            placeholder="1234 5678 9012 3456"
                            maxLength="19"
                            value={cardDetails.cardNumber}
                            onChange={(e) => {
                              const formattedValue = formatCardNumber(
                                e.target.value
                              );
                              setCardDetails({
                                ...cardDetails,
                                cardNumber: formattedValue,
                              });
                            }}
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="cardHolder"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Card Holder Name
                          </label>
                          <input
                            type="text"
                            name="cardHolder"
                            id="cardHolder"
                            className="mt-1 focus:ring-amber-500 focus:border-amber-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                            placeholder="John Doe"
                            value={cardDetails.cardHolder}
                            onChange={handleCardInputChange}
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label
                              htmlFor="expiryDate"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Expiry Date
                            </label>
                            <input
                              type="text"
                              name="expiryDate"
                              id="expiryDate"
                              className="mt-1 focus:ring-amber-500 focus:border-amber-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                              placeholder="MM/YY"
                              maxLength="5"
                              value={cardDetails.expiryDate}
                              onChange={(e) => {
                                let value = e.target.value.replace(/[^0-9/]/g, ""); // Allow only numbers and slash
                                // Add slash automatically
                                if (value.length === 2 && cardDetails.expiryDate.length === 1 && value.indexOf('/') === -1) {
                                  value += "/";
                                } else if (value.length === 2 && e.nativeEvent.inputType === 'deleteContentBackward' && cardDetails.expiryDate.length === 3) {
                                  // Handle backspace when slash is present
                                  value = value.slice(0,1);
                                } else if (value.length > 2 && value.indexOf('/') === -1) {
                                    // if user types more than 2 digits without slash, add it
                                    value = value.slice(0,2) + "/" + value.slice(2);
                                }
                                // Prevent typing more than MM/YY
                                if (value.length > 5) value = value.slice(0,5);

                                setCardDetails({
                                  ...cardDetails,
                                  expiryDate: value,
                                });
                              }}
                            />
                          </div>

                          <div>
                            <label
                              htmlFor="cvv"
                              className="block text-sm font-medium text-gray-700"
                            >
                              CVV
                            </label>
                            <input
                              type="text"
                              name="cvv"
                              id="cvv"
                              className="mt-1 focus:ring-amber-500 focus:border-amber-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                              placeholder="123"
                              maxLength="4"
                              value={cardDetails.cvv}
                              onChange={(e) => {
                                const value = e.target.value.replace(/\D/g, "");
                                setCardDetails({
                                  ...cardDetails,
                                  cvv: value,
                                });
                              }}
                            />
                          </div>
                        </div>

                        <div className="text-sm text-gray-500 mt-2">
                          <p>
                            This is a simulation. No real payment will be
                            processed.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* QR Code Payment */}
                  {paymentMethod === "qr" && showQrCode && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-xl flex flex-col items-center">
                      <div className="bg-white p-4 rounded-xl shadow-md mb-4">
                        <div className="w-48 h-48 relative">
                          {/* Simulated QR Code */}
                          <div className="absolute inset-0 grid grid-cols-5 grid-rows-5 gap-1">
                            {Array(25)
                              .fill(0)
                              .map((_, i) => (
                                <div
                                  key={i}
                                  className={`${
                                    Math.random() > 0.3
                                      ? "bg-black"
                                      : "bg-white"
                                  } ${
                                    i < 5 || // Top border squares
                                    i > 19 || // Bottom border squares
                                    i % 5 === 0 || // Left border squares
                                    i % 5 === 4 // Right border squares
                                      ? Math.random() > 0.2 ? "bg-black" : "bg-gray-700" // Make border squares more consistently dark
                                      : "" // Inner squares
                                  }`}
                                ></div>
                              ))}
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-gray-700 font-medium">
                        Scan to pay {waiterService.formatPrice(selectedPayment.total)}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Payment ID: {selectedPayment.id}
                      </p>
                      <button
                        className="mt-4 inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
                        onClick={() => setShowQrCode(false)} // This should probably refresh or re-validate
                      >
                        <ArrowPathIcon className="-ml-0.5 mr-2 h-4 w-4" />
                        Refresh QR Code {/* Or "Verify Payment" if QR triggers an external check */}
                      </button>
                    </div>
                  )}

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
                              {waiterService.formatPrice(transaction.amount)}
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
                              <button
                                className="text-amber-600 hover:text-amber-900"
                                onClick={() => handlePrintReceipt(transaction)}
                              >
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
      {/* Receipt Modal */}
      <ReceiptModal
        isOpen={isReceiptModalOpen}
        onClose={() => setIsReceiptModalOpen(false)}
        transaction={selectedTransaction}
      />
    </DashboardLayout>
  );
}