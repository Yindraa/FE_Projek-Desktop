"use client";

import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import {
  XMarkIcon,
  PlusIcon,
  MinusIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

// Mock menu items - in a real app, this would come from your database
const MENU_ITEMS = [
  { id: 1, name: "Beef Burger", price: 12.99, category: "Main Course" },
  { id: 2, name: "Caesar Salad", price: 8.99, category: "Appetizer" },
  { id: 3, name: "Iced Tea", price: 3.99, category: "Beverage" },
  { id: 4, name: "Margherita Pizza", price: 14.99, category: "Main Course" },
  { id: 5, name: "French Fries", price: 4.99, category: "Side" },
  { id: 6, name: "Chocolate Cake", price: 6.99, category: "Dessert" },
  { id: 7, name: "Chicken Wings", price: 9.99, category: "Appetizer" },
  { id: 8, name: "Soda", price: 2.99, category: "Beverage" },
];

// Group menu items by category
const MENU_BY_CATEGORY = MENU_ITEMS.reduce((acc, item) => {
  if (!acc[item.category]) {
    acc[item.category] = [];
  }
  acc[item.category].push(item);
  return acc;
}, {});

export default function NewOrderModal({
  isOpen,
  onClose,
  tableId,
  onCreateOrder,
}) {
  const [orderItems, setOrderItems] = useState([]);
  const [activeCategory, setActiveCategory] = useState(
    Object.keys(MENU_BY_CATEGORY)[0] || ""
  );
  const [customerCount, setCustomerCount] = useState(1);
  const [selectedTableId, setSelectedTableId] = useState(tableId || 1);

  const addItemToOrder = (menuItem) => {
    const existingItem = orderItems.find(
      (item) => item.menuItemId === menuItem.id
    );

    if (existingItem) {
      setOrderItems(
        orderItems.map((item) =>
          item.menuItemId === menuItem.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setOrderItems([
        ...orderItems,
        {
          id: Date.now(),
          menuItemId: menuItem.id,
          name: menuItem.name,
          price: menuItem.price,
          quantity: 1,
          notes: "",
        },
      ]);
    }
  };

  const updateItemQuantity = (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeItemFromOrder(itemId);
      return;
    }

    setOrderItems(
      orderItems.map((item) =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const updateItemNotes = (itemId, notes) => {
    setOrderItems(
      orderItems.map((item) => (item.id === itemId ? { ...item, notes } : item))
    );
  };

  const removeItemFromOrder = (itemId) => {
    setOrderItems(orderItems.filter((item) => item.id !== itemId));
  };

  const calculateTotal = () => {
    return orderItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  const handleCreateOrder = () => {
    if (orderItems.length === 0) {
      alert("Please add at least one item to the order");
      return;
    }

    const newOrder = {
      tableId: selectedTableId,
      items: orderItems,
      customerCount,
      total: calculateTotal(),
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    onCreateOrder(newOrder);
    // Reset form
    setOrderItems([]);
    setCustomerCount(1);
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
          <div className="flex min-h-full items-stretch justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-xl bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-4xl sm:h-[80vh] flex flex-col">
                <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4 flex-1 overflow-hidden flex flex-col">
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
                  <div className="sm:flex sm:items-start">
                    <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full">
                      <Dialog.Title
                        as="h3"
                        className="text-lg font-semibold leading-6 text-gray-900"
                      >
                        New Order {tableId ? `- Table ${tableId}` : ""}
                      </Dialog.Title>

                      <div className="mt-4 flex items-center space-x-4">
                        <div>
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
                                Math.max(
                                  1,
                                  Number.parseInt(e.target.value) || 1
                                )
                              )
                            }
                            className="mt-1 block w-24 rounded-xl border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm"
                          />
                        </div>
                        <div className="ml-4">
                          <label
                            htmlFor="tableSelect"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Select Table
                          </label>
                          <select
                            id="tableSelect"
                            className="mt-1 block w-24 rounded-xl border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm"
                            value={selectedTableId}
                            onChange={(e) =>
                              setSelectedTableId(Number(e.target.value))
                            }
                          >
                            {Array.from({ length: 20 }, (_, i) => (
                              <option key={i + 1} value={i + 1}>
                                Table {i + 1}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex-1 overflow-hidden flex">
                    {/* Menu Section */}
                    <div className="w-1/2 pr-4 flex flex-col overflow-hidden">
                      <div className="flex space-x-2 overflow-x-auto pb-2">
                        {Object.keys(MENU_BY_CATEGORY).map((category) => (
                          <button
                            key={category}
                            className={`px-3 py-1 text-sm font-medium rounded-xl whitespace-nowrap ${
                              activeCategory === category
                                ? "bg-amber-100 text-amber-800"
                                : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                            }`}
                            onClick={() => setActiveCategory(category)}
                          >
                            {category}
                          </button>
                        ))}
                      </div>

                      <div className="mt-3 flex-1 overflow-y-auto">
                        <div className="grid grid-cols-1 gap-2">
                          {MENU_BY_CATEGORY[activeCategory]?.map((menuItem) => (
                            <button
                              key={menuItem.id}
                              className="flex justify-between items-center p-3 rounded-xl border border-gray-200 hover:bg-amber-50 text-left"
                              onClick={() => addItemToOrder(menuItem)}
                            >
                              <div>
                                <h4 className="font-medium">{menuItem.name}</h4>
                                <p className="text-sm text-gray-500">
                                  ${menuItem.price.toFixed(2)}
                                </p>
                              </div>
                              <PlusIcon className="h-5 w-5 text-amber-600" />
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Order Items Section */}
                    <div className="w-1/2 pl-4 border-l border-gray-200 flex flex-col overflow-hidden">
                      <h4 className="font-medium text-gray-900 mb-2">
                        Order Items
                      </h4>

                      {orderItems.length === 0 ? (
                        <div className="flex-1 flex items-center justify-center text-gray-500 text-sm">
                          No items added to the order yet
                        </div>
                      ) : (
                        <div className="flex-1 overflow-y-auto space-y-3">
                          {orderItems.map((item) => (
                            <div
                              key={item.id}
                              className="p-3 rounded-xl border border-gray-200"
                            >
                              <div className="flex justify-between">
                                <h4 className="font-medium">{item.name}</h4>
                                <div className="flex items-center space-x-1">
                                  <button
                                    className="p-1 rounded-full hover:bg-gray-100"
                                    onClick={() =>
                                      updateItemQuantity(
                                        item.id,
                                        item.quantity - 1
                                      )
                                    }
                                  >
                                    <MinusIcon className="h-4 w-4 text-gray-600" />
                                  </button>
                                  <span className="w-6 text-center">
                                    {item.quantity}
                                  </span>
                                  <button
                                    className="p-1 rounded-full hover:bg-gray-100"
                                    onClick={() =>
                                      updateItemQuantity(
                                        item.id,
                                        item.quantity + 1
                                      )
                                    }
                                  >
                                    <PlusIcon className="h-4 w-4 text-gray-600" />
                                  </button>
                                </div>
                              </div>

                              <div className="flex justify-between items-center mt-1">
                                <p className="text-sm text-gray-500">
                                  ${(item.price * item.quantity).toFixed(2)}
                                </p>
                                <button
                                  className="p-1 rounded-full hover:bg-gray-100 text-red-500"
                                  onClick={() => removeItemFromOrder(item.id)}
                                >
                                  <TrashIcon className="h-4 w-4" />
                                </button>
                              </div>

                              <div className="mt-2">
                                <input
                                  type="text"
                                  placeholder="Add notes (e.g., no onions)"
                                  className="w-full text-sm p-1 border border-gray-200 rounded-xl"
                                  value={item.notes}
                                  onChange={(e) =>
                                    updateItemNotes(item.id, e.target.value)
                                  }
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="mt-4 pt-3 border-t border-gray-200">
                        <div className="flex justify-between font-medium">
                          <span>Total:</span>
                          <span>${calculateTotal().toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                  <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-xl bg-amber-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-amber-500 sm:ml-3 sm:w-auto"
                    onClick={handleCreateOrder}
                  >
                    Create Order
                  </button>
                  <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-xl bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
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
