"use client";

import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon, UserGroupIcon } from "@heroicons/react/24/outline";

export default function SeatCustomersModal({
  isOpen,
  onClose,
  tableId,
  onSeatCustomers,
}) {
  const [customerCount, setCustomerCount] = useState(2);
  const [customerName, setCustomerName] = useState("");
  const [specialRequests, setSpecialRequests] = useState("");

  const handleSubmit = () => {
    onSeatCustomers({
      tableId,
      customerCount,
      customerName: customerName.trim() || "Walk-in",
      specialRequests,
      seatedAt: new Date().toISOString(),
    });
    onClose();
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
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-100">
                    <UserGroupIcon
                      className="h-6 w-6 text-amber-600"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="mt-3 text-center sm:mt-5">
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-semibold leading-6 text-gray-900"
                    >
                      Seat Customers at Table {tableId}
                    </Dialog.Title>
                    <div className="mt-6 space-y-4">
                      <div className="text-left">
                        <label
                          htmlFor="customerCount"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Number of Customers
                        </label>
                        <input
                          type="number"
                          id="customerCount"
                          min="1"
                          value={customerCount}
                          onChange={(e) =>
                            setCustomerCount(
                              Math.max(1, Number.parseInt(e.target.value) || 1)
                            )
                          }
                          className="mt-1 block w-full rounded-xl border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm"
                        />
                      </div>

                      <div className="text-left">
                        <label
                          htmlFor="customerName"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Customer Name (optional)
                        </label>
                        <input
                          type="text"
                          id="customerName"
                          placeholder="Walk-in"
                          value={customerName}
                          onChange={(e) => setCustomerName(e.target.value)}
                          className="mt-1 block w-full rounded-xl border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm"
                        />
                      </div>

                      <div className="text-left">
                        <label
                          htmlFor="specialRequests"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Special Requests (optional)
                        </label>
                        <textarea
                          id="specialRequests"
                          rows={3}
                          placeholder="High chair, window seat, etc."
                          value={specialRequests}
                          onChange={(e) => setSpecialRequests(e.target.value)}
                          className="mt-1 block w-full rounded-xl border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                  <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-xl bg-amber-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 sm:col-start-2"
                    onClick={handleSubmit}
                  >
                    Seat Customers
                  </button>
                  <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-xl bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
                    onClick={onClose}
                  >
                    Cancel
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
