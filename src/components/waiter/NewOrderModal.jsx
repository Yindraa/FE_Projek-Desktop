"use client";

import { Fragment, useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import {
  XMarkIcon,
  PlusIcon,
  MinusIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { waiterService } from "../../services/waiterService";

export default function NewOrderModal({
  isOpen,
  onClose,
  tableId,
  onCreateOrder,
}) {
  const [orderItems, setOrderItems] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [menuByCategory, setMenuByCategory] = useState({});
  const [activeCategory, setActiveCategory] = useState("");
  const [customerCount, setCustomerCount] = useState(1);
  const [selectedTableId, setSelectedTableId] = useState(tableId || 1);
  const [isLoadingMenu, setIsLoadingMenu] = useState(false);  const [availableTables, setAvailableTables] = useState([]);
  const [isLoadingTables, setIsLoadingTables] = useState(false);

  // Fetch menu items and tables when component mounts or modal opens
  useEffect(() => {
    if (isOpen) {
      loadMenuItems();
      loadTables();
      // Reset to the correct table when modal opens
      if (tableId) {
        setSelectedTableId(tableId);
      }
    }
  }, [isOpen, tableId]);
  // Update selected table when tableId prop changes
  useEffect(() => {
    if (tableId) {
      setSelectedTableId(tableId);
    }
  }, [tableId]);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setOrderItems([]);
      setCustomerCount(1);
      if (tableId) {
        setSelectedTableId(tableId);
      }
    }
  }, [isOpen, tableId]);  const loadMenuItems = async () => {
    setIsLoadingMenu(true);
    try {
      const availableItems = await waiterService.getMenuItems();
      
      setMenuItems(availableItems);
      
      // Group items by category using waiterService utility
      const groupedItems = waiterService.groupMenuItemsByCategory(availableItems);
      
      setMenuByCategory(groupedItems);
      
      // Set first category as active
      const categories = Object.keys(groupedItems);
      if (categories.length > 0) {
        setActiveCategory(categories[0]);
      }
    } catch (error) {
      console.error('Failed to load menu items:', error);
      // Set fallback empty state
      setMenuItems([]);
      setMenuByCategory({});
      setActiveCategory('');    } finally {
      setIsLoadingMenu(false);
    }
  };
  const loadTables = async () => {
    setIsLoadingTables(true);
    try {
      const tables = await waiterService.getTables();
      setAvailableTables(tables);
      
      // If no table is pre-selected and tables are available, set the first table as default
      if (!tableId && tables.length > 0 && !selectedTableId) {
        setSelectedTableId(tables[0].tableNumber);
      }
    } catch (error) {
      console.error('Failed to load tables:', error);
      // Set fallback empty state
      setAvailableTables([]);
    } finally {
      setIsLoadingTables(false);
    }
  };

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
                        </div>                        <div className="ml-4">
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
                            disabled={isLoadingTables}
                          >
                            {isLoadingTables ? (
                              <option value="">Loading...</option>
                            ) : availableTables.length > 0 ? (
                              availableTables.map((table) => (
                                <option key={table.tableNumber} value={table.tableNumber}>
                                  Table {table.tableNumber}
                                </option>
                              ))
                            ) : (
                              <option value="">No tables available</option>
                            )}
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>                  <div className="mt-4 flex-1 overflow-hidden flex">
                    {/* Menu Section */}
                    <div className="w-1/2 pr-4 flex flex-col overflow-hidden">
                      <h4 className="font-medium text-gray-900 mb-2">
                        Add Items
                      </h4>
                      <div className="flex space-x-2 overflow-x-auto pb-2">
                        {Object.keys(menuByCategory).map((category) => (
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
                      </div>                      <div className="mt-3 flex-1 overflow-y-auto">
                        {isLoadingMenu ? (
                          <div className="flex items-center justify-center h-32">
                            <div className="text-sm text-gray-500">Loading menu...</div>
                          </div>
                        ) : Object.keys(menuByCategory).length === 0 ? (
                          <div className="flex items-center justify-center h-32">
                            <div className="text-sm text-gray-500">No menu items available</div>
                          </div>
                        ) : !menuByCategory[activeCategory] ? (
                          <div className="flex items-center justify-center h-32">
                            <div className="text-sm text-gray-500">No items in {activeCategory} category</div>
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 gap-2">
                            {menuByCategory[activeCategory]?.map((menuItem) => (
                              <button
                                key={menuItem.id}
                                className="flex justify-between items-center p-3 rounded-xl border border-gray-200 hover:bg-amber-50 text-left"
                                onClick={() => addItemToOrder(menuItem)}
                              >
                                <div>                                <h4 className="font-medium">{menuItem.name}</h4>
                                  <p className="text-sm text-gray-500">
                                    {waiterService.formatPrice(menuItem.price)}
                                  </p>
                                  {menuItem.description && (
                                    <p className="text-xs text-gray-400 mt-1">
                                      {menuItem.description}
                                    </p>
                                  )}
                                </div>
                                <PlusIcon className="h-5 w-5 text-amber-600" />
                              </button>
                            ))}
                          </div>
                        )}
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
                              </div>                              <div className="flex justify-between items-center mt-1">                                <p className="text-sm text-gray-500">
                                  {waiterService.formatPrice(item.price * item.quantity)}
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
                      )}                      <div className="mt-4 pt-3 border-t border-gray-200">                        <div className="flex justify-between font-medium">
                          <span>Total:</span>
                          <span>{waiterService.formatPrice(calculateTotal())}</span>
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
