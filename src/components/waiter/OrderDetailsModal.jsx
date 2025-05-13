"use client";

import { Fragment, useRef } from "react";
import { Dialog, Transition } from "@headlessui/react";
import {
  XMarkIcon,
  PrinterIcon,
  CreditCardIcon,
  CheckCircleIcon,
  BanknotesIcon,
} from "@heroicons/react/24/outline";
import ReceiptTemplate from "./ReceiptTemplate";

export default function OrderDetailsModal({ isOpen, onClose, order }) {
  // Mock order details - in a real app, this would come from your database
  const orderItems = [
    {
      id: 1,
      name: "Beef Burger",
      quantity: 2,
      price: "$12.99",
      notes: "No pickles",
    },
    {
      id: 2,
      name: "Caesar Salad",
      quantity: 1,
      price: "$8.99",
      notes: "Dressing on the side",
    },
    { id: 3, name: "Iced Tea", quantity: 2, price: "$3.99", notes: "" },
  ];

  const receiptRef = useRef(null);

  const handlePrintReceipt = () => {
    const printContent = document.createElement("div");
    printContent.innerHTML = receiptRef.current.innerHTML;

    // Create a new window for printing
    const printWindow = window.open("", "_blank", "height=600,width=800");
    printWindow.document.write("<html><head><title>Print Receipt</title>");

    // Add print-specific styles
    printWindow.document.write(`
      <style>
        body {
          font-family: 'Courier New', monospace;
          padding: 20px;
          max-width: 300px;
          margin: 0 auto;
        }
        .receipt-container {
          width: 100%;
        }
        .receipt-header {
          text-align: center;
          margin-bottom: 10px;
        }
        .receipt-header h2 {
          margin: 5px 0;
          font-size: 16px;
        }
        .receipt-header p {
          margin: 5px 0;
          font-size: 12px;
        }
        .receipt-divider {
          border-top: 1px dashed #000;
          margin: 10px 0;
        }
        .receipt-item {
          display: flex;
          justify-content: space-between;
          font-size: 12px;
          margin-bottom: 5px;
        }
        .receipt-item-details {
          flex: 1;
        }
        .receipt-item-price {
          text-align: right;
          min-width: 60px;
        }
        .receipt-total {
          display: flex;
          justify-content: space-between;
          font-weight: bold;
          margin-top: 10px;
          font-size: 14px;
        }
        .receipt-footer {
          text-align: center;
          margin-top: 20px;
          font-size: 12px;
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
  };

  if (!order) return null;

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
              <Dialog.Panel className="relative transform overflow-hidden rounded-xl bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
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
                      className="text-lg font-semibold leading-6 text-gray-900"
                    >
                      Order Details - {order.id}
                    </Dialog.Title>

                    <div className="mt-4 bg-amber-50 p-4 rounded-xl">
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium text-gray-500">
                          Table:
                        </span>
                        <span className="text-sm text-gray-900">
                          Table {order.table}
                        </span>
                      </div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium text-gray-500">
                          Time:
                        </span>
                        <span className="text-sm text-gray-900">
                          {order.time}
                        </span>
                      </div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium text-gray-500">
                          Status:
                        </span>
                        <span
                          className={`text-sm px-2 inline-flex leading-5 font-semibold rounded-xl ${
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
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-gray-500">
                          Total:
                        </span>
                        <span className="text-sm font-bold text-gray-900">
                          {order.total}
                        </span>
                      </div>
                    </div>

                    <div className="mt-4">
                      <h4 className="font-medium text-gray-900">Order Items</h4>
                      <div className="mt-2 border-t border-gray-200">
                        <dl className="divide-y divide-gray-200">
                          {orderItems.map((item) => (
                            <div
                              key={item.id}
                              className="py-3 grid grid-cols-12 gap-2"
                            >
                              <dt className="col-span-1 text-sm font-medium text-gray-900">
                                {item.quantity}x
                              </dt>
                              <dd className="col-span-7 text-sm text-gray-900">
                                <div className="font-medium">{item.name}</div>
                                {item.notes && (
                                  <div className="text-xs text-gray-500 mt-1">
                                    Note: {item.notes}
                                  </div>
                                )}
                              </dd>
                              <dd className="col-span-4 text-sm text-right font-medium text-gray-900">
                                {item.price}
                              </dd>
                            </div>
                          ))}
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action buttons section */}
                <div className="mt-6">
                  <h4 className="text-sm font-medium text-gray-500 mb-3">
                    Actions
                  </h4>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {/* Status-specific primary actions */}
                    {order.status === "pending-payment" && (
                      <button
                        type="button"
                        className="inline-flex flex-col items-center justify-center rounded-xl bg-amber-50 px-3 py-3 text-sm font-semibold text-amber-700 shadow-sm hover:bg-amber-100"
                      >
                        <CreditCardIcon className="h-6 w-6 mb-1" />
                        Process Payment
                      </button>
                    )}

                    {order.status === "in-progress" && (
                      <button
                        type="button"
                        className="inline-flex flex-col items-center justify-center rounded-xl bg-green-50 px-3 py-3 text-sm font-semibold text-green-700 shadow-sm hover:bg-green-100"
                      >
                        <CheckCircleIcon className="h-6 w-6 mb-1" />
                        Mark as Served
                      </button>
                    )}

                    {order.status === "served" && (
                      <button
                        type="button"
                        className="inline-flex flex-col items-center justify-center rounded-xl bg-purple-50 px-3 py-3 text-sm font-semibold text-purple-700 shadow-sm hover:bg-purple-100"
                      >
                        <BanknotesIcon className="h-6 w-6 mb-1" />
                        Mark for Payment
                      </button>
                    )}

                    {/* Common actions available for all orders */}
                    <button
                      type="button"
                      className="inline-flex flex-col items-center justify-center rounded-xl bg-gray-50 px-3 py-3 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-100"
                      onClick={handlePrintReceipt}
                    >
                      <PrinterIcon className="h-6 w-6 mb-1" />
                      Print Receipt
                    </button>
                  </div>
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-xl bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                    onClick={onClose}
                  >
                    Close
                  </button>
                </div>

                {/* Hidden receipt template for printing */}
                <div className="hidden">
                  <div ref={receiptRef}>
                    <ReceiptTemplate order={order} items={orderItems} />
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
