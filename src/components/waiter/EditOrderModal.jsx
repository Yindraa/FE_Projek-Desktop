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

export default function EditOrderModal({
  isOpen,
  onClose,
  order,
  onUpdateOrder,
}) {
  const [orderItems, setOrderItems] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [menuByCategory, setMenuByCategory] = useState({});
  const [activeCategory, setActiveCategory] = useState("");
  const [isLoadingMenu, setIsLoadingMenu] = useState(false);  const [originalTotal, setOriginalTotal] = useState(0);

  // Fetch menu items when component mounts or modal opens
  useEffect(() => {
    if (isOpen) {
      loadMenuItems();
    }
  }, [isOpen]);
  const loadMenuItems = async () => {
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
    } finally {
      setIsLoadingMenu(false);
    }
  };
  // Initialize order items when the modal opens
  useEffect(() => {
    if (isOpen && order && menuItems.length > 0) {
      try {
        // For orders from the dashboard, we need to create mock items since they only have a count
        let formattedItems = [];

        // Check if order has detailed items or just a count
        if (order.items && Array.isArray(order.items)) {
          // If it has detailed items (from Orders page)
          formattedItems = order.items.map((item) => ({
            id: Date.now() + Math.random(),
            menuItemId:
              menuItems.find((menuItem) => menuItem.name === item.name)?.id ||
              0,
            name: item.name,            price: waiterService.parsePrice(item.price),
            quantity: item.quantity || 1,
            notes: item.notes || "",
          }));
        } else if (typeof order.items === "number") {
          // If it just has a count (from Dashboard), create placeholder items
          // This is just for demonstration - in a real app, you'd fetch the actual items
          formattedItems = [
            {
              id: Date.now(),
              menuItemId: 1,
              name: "Sample Item",
              price: 10.0,
              quantity: order.items,
              notes: "",
            },
          ];
        }        setOrderItems(formattedItems);        // Parse the total using waiterService utility
        const total = waiterService.parsePrice(order.total);

        setOriginalTotal(total);
      } catch (error) {
        console.error("Error initializing order items:", error);
        // Provide fallback empty state to prevent crashes
        setOrderItems([]);
        setOriginalTotal(0);
      }
    }
  }, [order, isOpen, menuItems]);

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
          id: Date.now() + Math.random(),
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

  const handleUpdateOrder = () => {
    if (orderItems.length === 0) {
      alert("An order must have at least one item");
      return;
    }

    // Format items for the updated order
    const updatedItems = orderItems.map((item) => ({
      name: item.name,
      quantity: item.quantity,
      price: item.price,
      notes: item.notes,
    }));

    // Create updated order object
    const updatedOrder = {
      ...order,
      items: updatedItems,
      total: calculateTotal(),
    };

    // If the original order had a string total with a dollar sign, format the new total the same way
    if (typeof order.total === "string" && order.total.includes("$")) {
      updatedOrder.total = `$${calculateTotal().toFixed(2)}`;
    }

    onUpdateOrder(updatedOrder);
    onClose();
  };

  // If no order is provided, don't render the modal
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
                        Edit Order - {order.id}
                      </Dialog.Title>
                      <div className="mt-1">
                        <p className="text-sm text-gray-500">
                          Table {order.table} -{" "}
                          {order.customer || "Walk-in Customer"}
                        </p>
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
                      </div>

                      <div className="mt-3 flex-1 overflow-y-auto">
                        {isLoadingMenu ? (
                          <div className="flex items-center justify-center h-32">
                            <div className="text-sm text-gray-500">Loading menu...</div>
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
                        Current Order Items
                      </h4>

                      {orderItems.length === 0 ? (
                        <div className="flex-1 flex items-center justify-center text-gray-500 text-sm">
                          No items in this order
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
                        </div>                      )}

                      <div className="mt-4 pt-3 border-t border-gray-200">                        <div className="flex justify-between text-sm text-gray-500">
                          <span>Original Total:</span>
                          <span>{waiterService.formatPrice(originalTotal)}</span>
                        </div>
                        <div className="flex justify-between font-medium mt-1">
                          <span>New Total:</span>
                          <span>{waiterService.formatPrice(calculateTotal())}</span>
                        </div>
                        <div className="flex justify-between text-sm text-gray-500 mt-1">
                          <span>Difference:</span>
                          <span
                            className={
                              calculateTotal() > originalTotal
                                ? "text-green-600"
                                : calculateTotal() < originalTotal
                                ? "text-red-600"
                                : ""
                            }                          >
                            {calculateTotal() > originalTotal ? "+" : ""}{waiterService.formatPrice(Math.abs(calculateTotal() - originalTotal))}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                  <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-xl bg-amber-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-amber-500 sm:ml-3 sm:w-auto"
                    onClick={handleUpdateOrder}
                  >
                    Update Order
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
