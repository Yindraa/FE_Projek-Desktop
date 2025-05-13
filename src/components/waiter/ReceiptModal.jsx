"use client";

import { Fragment, useRef } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon, PrinterIcon } from "@heroicons/react/24/outline";

export default function ReceiptModal({ isOpen, onClose, transaction }) {
  const receiptRef = useRef(null);

  // Add defensive check for transaction
  if (!isOpen) return null;

  // Ensure transaction has all required properties with fallbacks
  const safeTransaction = {
    id: transaction?.id || "TRX-TEMP",
    orderId: transaction?.orderId || "ORD-TEMP",
    table: transaction?.table || 0,
    customer: transaction?.customer || "Walk-in Customer",
    amount: transaction?.amount || 0,
    method: transaction?.method || "cash",
    status: transaction?.status || "completed",
    time:
      transaction?.time ||
      new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    date: transaction?.date || new Date().toLocaleDateString(),
    items: transaction?.items || [],
    subtotal: transaction?.subtotal || 0,
    tax: transaction?.tax || 0,
    total: transaction?.total || 0,
    ...transaction,
  };

  const handlePrintReceipt = () => {
    try {
      if (!receiptRef.current) return;

      const printContent = document.createElement("div");
      printContent.innerHTML = receiptRef.current.innerHTML;

      // Create a new window for printing
      const printWindow = window.open("", "_blank", "height=600,width=800");
      if (!printWindow) {
        console.error("Could not open print window. Pop-ups might be blocked.");
        return;
      }

      printWindow.document.write("<html><head><title>Print Receipt</title>");

      // Add print-specific styles
      printWindow.document.write(`
      <style>
        body {
          font-family: 'Arial', sans-serif;
          padding: 0;
          max-width: 300px;
          margin: 0 auto;
          color: #333;
        }
        .receipt-container {
          width: 100%;
          padding: 10px;
        }
        .receipt-header {
          text-align: center;
          margin-bottom: 15px;
        }
        .receipt-header h2 {
          margin: 5px 0;
          font-size: 18px;
        }
        .receipt-header p {
          margin: 3px 0;
          font-size: 12px;
        }
        .border-dashed {
          border-style: dashed;
          border-width: 1px 0;
          border-color: #ccc;
          margin: 8px 0;
          padding: 8px 0;
        }
        .flex {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .py-1 {
          padding: 4px 0;
        }
        .py-2 {
          padding: 6px 0;
        }
        .text-sm {
          font-size: 12px;
        }
        .text-xs {
          font-size: 10px;
        }
        .text-base {
          font-size: 14px;
        }
        .font-medium {
          font-weight: 500;
        }
        .font-bold {
          font-weight: 700;
        }
        .text-center {
          text-align: center;
        }
        .text-right {
          text-align: right;
        }
        .text-green-600 {
          color: #059669;
        }
        .text-gray-500 {
          color: #6b7280;
        }
        .text-gray-600 {
          color: #4b5563;
        }
        .tabular-nums {
          font-variant-numeric: tabular-nums;
        }
        .mb-0.5 {
          margin-bottom: 2px;
        }
        .mb-1 {
          margin-bottom: 4px;
        }
        .mb-3 {
          margin-bottom: 12px;
        }
        .mb-4 {
          margin-bottom: 16px;
        }
        .mt-1 {
          margin-top: 4px;
        }
        .mt-3 {
          margin-top: 12px;
        }
        .mt-6 {
          margin-top: 24px;
        }
        .ml-4 {
          margin-left: 16px;
        }
        .border-t {
          border-top-width: 1px;
        }
        .border-b {
          border-bottom-width: 1px;
        }
        .border-dashed {
          border-style: dashed;
        }
        .border-gray-300 {
          border-color: #d1d5db;
        }
        .my-3 {
          margin-top: 12px;
          margin-bottom: 12px;
        }
        .pt-2 {
          padding-top: 8px;
        }
        @media print {
          body {
            padding: 0;
          }
          @page {
            margin: 10mm;
            size: 80mm 297mm;
          }
        }
      </style>
    `);

      printWindow.document.write("</head><body>");
      printWindow.document.write(printContent.innerHTML);
      printWindow.document.write("</body></html>");

      printWindow.document.close();
      printWindow.focus();

      // Print after a short delay to ensure content is loaded
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 250);
    } catch (error) {
      console.error("Error printing receipt:", error);
    }
  };

  if (!safeTransaction) return null;

  // Format date and time
  const formatDate = (dateString) => {
    if (!dateString) {
      const today = new Date();
      return today.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    }
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getPaymentMethodText = (method) => {
    switch (method) {
      case "cash":
        return "Cash";
      case "credit":
        return "Credit Card";
      case "qr":
        return "QR Code Payment";
      default:
        return "Other";
    }
  };

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-xl bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-md sm:p-6">
                <div className="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
                  <button
                    type="button"
                    className="rounded-xl bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
                    onClick={onClose}
                  >
                    <span className="sr-only">Close</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>

                <div>
                  <div className="mt-3 text-center sm:mt-0 sm:text-left">
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-semibold leading-6 text-gray-900 border-b pb-3 mb-4 flex items-center justify-between"
                    >
                      <span>Receipt</span>
                      <button
                        onClick={handlePrintReceipt}
                        className="inline-flex items-center rounded-md bg-amber-50 px-3 py-1.5 text-sm font-medium text-amber-700 hover:bg-amber-100 transition-colors"
                      >
                        <PrinterIcon className="h-4 w-4 mr-1.5" />
                        Print
                      </button>
                    </Dialog.Title>
                  </div>
                </div>

                {/* Receipt Content */}
                <div className="mt-2 bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <div ref={receiptRef} className="receipt-container p-4">
                    <div className="receipt-header text-center mb-4">
                      <h2 className="text-xl font-bold mb-1">
                        DineFlow Restaurant
                      </h2>
                      <p className="text-sm text-gray-600 mb-0.5">
                        123 Food Street, Culinary City
                      </p>
                      <p className="text-sm text-gray-600 mb-0.5">
                        Tel: (123) 456-7890
                      </p>
                      <div className="border-t border-b border-dashed border-gray-300 my-3 py-2">
                        <p className="text-sm mb-0.5">
                          {formatDate(safeTransaction.date)} -{" "}
                          {safeTransaction.time}
                        </p>
                        <p className="text-sm font-medium mb-0.5">
                          Order: {safeTransaction.orderId} - Table:{" "}
                          {safeTransaction.table}
                        </p>
                        {safeTransaction.customer && (
                          <p className="text-sm mb-0.5">
                            Customer: {safeTransaction.customer}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="mb-4">
                      {safeTransaction.items ? (
                        safeTransaction.items.map((item, index) => (
                          <div
                            key={index}
                            className="flex justify-between text-sm py-1"
                          >
                            <div className="flex-1">
                              <span className="font-medium">
                                {item.quantity} x{" "}
                              </span>
                              <span>{item.name}</span>
                            </div>
                            <div className="text-right ml-4 tabular-nums">
                              ${(item.price * item.quantity).toFixed(2)}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="flex justify-between text-sm py-1">
                          <div>Items</div>
                          <div className="tabular-nums">
                            ${safeTransaction.amount.toFixed(2)}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="border-t border-dashed border-gray-300 pt-2 mb-3">
                      {safeTransaction.subtotal && (
                        <div className="flex justify-between text-sm py-1">
                          <div>Subtotal</div>
                          <div className="tabular-nums">
                            ${safeTransaction.subtotal.toFixed(2)}
                          </div>
                        </div>
                      )}

                      {safeTransaction.tax && (
                        <div className="flex justify-between text-sm py-1">
                          <div>Tax</div>
                          <div className="tabular-nums">
                            ${safeTransaction.tax.toFixed(2)}
                          </div>
                        </div>
                      )}

                      <div className="flex justify-between font-bold text-base py-2 border-t border-dashed border-gray-300 mt-1">
                        <div>TOTAL</div>
                        <div className="tabular-nums">
                          ${safeTransaction.amount.toFixed(2)}
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-dashed border-gray-300 py-2 mb-3">
                      <div className="text-sm py-1 flex justify-between">
                        <div>Payment Method:</div>
                        <div>
                          {getPaymentMethodText(safeTransaction.method)}
                        </div>
                      </div>

                      {safeTransaction.method === "cash" &&
                        safeTransaction.cashReceived && (
                          <>
                            <div className="text-sm py-1 flex justify-between">
                              <div>Cash Received:</div>
                              <div className="tabular-nums">
                                ${safeTransaction.cashReceived.toFixed(2)}
                              </div>
                            </div>
                            <div className="text-sm py-1 flex justify-between">
                              <div>Change:</div>
                              <div className="tabular-nums">
                                ${safeTransaction.change.toFixed(2)}
                              </div>
                            </div>
                          </>
                        )}

                      <div className="text-sm py-1 flex justify-between">
                        <div>Status:</div>
                        <div className="font-medium text-green-600">Paid</div>
                      </div>
                    </div>

                    <div className="text-center mt-6 text-sm text-gray-600">
                      <p className="mb-1">Thank you for dining with us!</p>
                      <p className="mb-1">Please come again</p>
                      <p className="text-xs mt-3 text-gray-500">
                        Transaction ID: {safeTransaction.id}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-5 sm:mt-6">
                  <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-xl bg-amber-600 px-3 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-amber-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-600 transition-colors"
                    onClick={onClose}
                  >
                    Close
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
