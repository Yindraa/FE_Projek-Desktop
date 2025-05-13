"use client";

import { Fragment, useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import {
  XMarkIcon,
  CreditCardIcon,
  BanknotesIcon,
  QrCodeIcon,
  ReceiptIcon,
} from "@heroicons/react/24/outline";

export default function PaymentModal({
  isOpen,
  onClose,
  order,
  onProcessPayment,
}) {
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [amountPaid, setAmountPaid] = useState(order ? order.total : 0);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (order) {
      setAmountPaid(order.total);
    }
  }, [order]);

  const calculateChange = () => {
    if (paymentMethod !== "cash") return 0;
    return Math.max(0, amountPaid - (order?.total || 0));
  };

  const handleProcessPayment = () => {
    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      const paymentData = {
        orderId: order?.id,
        amount: order?.total,
        method: paymentMethod,
        amountPaid: paymentMethod === "cash" ? amountPaid : order?.total,
        change: calculateChange(),
        timestamp: new Date().toISOString(),
      };

      onProcessPayment(paymentData);
      setIsProcessing(false);
      onClose();
    }, 1000);
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
                      Process Payment - {order.id}
                    </Dialog.Title>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Table {order.table} - Customer: {order.customer}
                      </p>
                    </div>

                    <div className="mt-4 bg-amber-50 p-4 rounded-xl">
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium text-gray-500">
                          Items:
                        </span>
                        <span className="text-sm text-gray-900">
                          {order.items.length}
                        </span>
                      </div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium text-gray-500">
                          Subtotal:
                        </span>
                        <span className="text-sm text-gray-900">
                          ${(order.total * 0.9).toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium text-gray-500">
                          Tax (10%):
                        </span>
                        <span className="text-sm text-gray-900">
                          ${(order.total * 0.1).toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-gray-900">
                          Total:
                        </span>
                        <span className="text-sm font-bold text-gray-900">
                          ${order.total.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    <div className="mt-6">
                      <label className="text-sm font-medium text-gray-700">
                        Payment Method
                      </label>
                      <div className="mt-2 grid grid-cols-3 gap-3">
                        <button
                          type="button"
                          className={`flex flex-col items-center justify-center rounded-xl px-3 py-3 text-sm font-medium ${
                            paymentMethod === "cash"
                              ? "bg-amber-100 text-amber-800 ring-2 ring-amber-500"
                              : "bg-white text-gray-700 ring-1 ring-gray-300 hover:bg-gray-50"
                          }`}
                          onClick={() => setPaymentMethod("cash")}
                        >
                          <BanknotesIcon className="h-6 w-6 mb-1" />
                          Cash
                        </button>
                        <button
                          type="button"
                          className={`flex flex-col items-center justify-center rounded-xl px-3 py-3 text-sm font-medium ${
                            paymentMethod === "card"
                              ? "bg-amber-100 text-amber-800 ring-2 ring-amber-500"
                              : "bg-white text-gray-700 ring-1 ring-gray-300 hover:bg-gray-50"
                          }`}
                          onClick={() => setPaymentMethod("card")}
                        >
                          <CreditCardIcon className="h-6 w-6 mb-1" />
                          Card
                        </button>
                        <button
                          type="button"
                          className={`flex flex-col items-center justify-center rounded-xl px-3 py-3 text-sm font-medium ${
                            paymentMethod === "qris"
                              ? "bg-amber-100 text-amber-800 ring-2 ring-amber-500"
                              : "bg-white text-gray-700 ring-1 ring-gray-300 hover:bg-gray-50"
                          }`}
                          onClick={() => setPaymentMethod("qris")}
                        >
                          <QrCodeIcon className="h-6 w-6 mb-1" />
                          QRIS
                        </button>
                      </div>
                    </div>

                    {paymentMethod === "cash" && (
                      <div className="mt-4">
                        <label
                          htmlFor="amountPaid"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Amount Paid
                        </label>
                        <div className="mt-1 relative rounded-xl shadow-sm">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="text-gray-500 sm:text-sm">$</span>
                          </div>
                          <input
                            type="number"
                            name="amountPaid"
                            id="amountPaid"
                            className="focus:ring-amber-500 focus:border-amber-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-xl"
                            placeholder="0.00"
                            step="0.01"
                            min={order.total}
                            value={amountPaid}
                            onChange={(e) =>
                              setAmountPaid(
                                Number.parseFloat(e.target.value) || 0
                              )
                            }
                          />
                        </div>

                        <div className="mt-2 flex justify-between text-sm">
                          <span className="font-medium text-gray-700">
                            Change:
                          </span>
                          <span className="font-medium text-green-600">
                            ${calculateChange().toFixed(2)}
                          </span>
                        </div>
                      </div>
                    )}

                    {paymentMethod === "qris" && (
                      <div className="mt-4 flex justify-center">
                        <div className="bg-gray-100 p-4 rounded-xl w-48 h-48 flex items-center justify-center">
                          <div className="text-center">
                            <QrCodeIcon className="h-24 w-24 mx-auto text-gray-400" />
                            <p className="mt-2 text-sm text-gray-500">
                              QRIS Code Placeholder
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {paymentMethod === "card" && (
                      <div className="mt-4 p-4 bg-gray-50 rounded-xl">
                        <p className="text-sm text-gray-500 text-center">
                          Please process the card payment using the card
                          terminal.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                <div className="mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                  <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-xl bg-amber-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 sm:col-start-2"
                    onClick={handleProcessPayment}
                    disabled={isProcessing}
                  >
                    {isProcessing ? "Processing..." : "Complete Payment"}
                  </button>
                  <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center items-center rounded-xl bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
                    onClick={onClose}
                    disabled={isProcessing}
                  >
                    <ReceiptIcon className="h-4 w-4 mr-2" />
                    Print Receipt
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
