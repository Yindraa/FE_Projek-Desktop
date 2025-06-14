"use client";

import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import {
  EllipsisVerticalIcon,
  EyeIcon,
  CheckCircleIcon,
  PlusCircleIcon,
} from "@heroicons/react/24/outline";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function OrderActionsMenu({
  order,
  onView,
  onMarkAsServed,
  onAddItems,
}) {
  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button className="flex items-center rounded-xl bg-white text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2">
          <span className="sr-only">Open options</span>
          <EllipsisVerticalIcon className="h-5 w-5" aria-hidden="true" />
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-xl bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={onView}
                  className={classNames(
                    active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                    "flex w-full px-4 py-2 text-sm items-center"
                  )}
                >
                  <EyeIcon className="h-4 w-4 mr-2" />
                  View Details
                </button>
              )}
            </Menu.Item>

            {order.status === "in-progress" && (
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={onMarkAsServed}
                    className={classNames(
                      active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                      "flex w-full px-4 py-2 text-sm items-center"
                    )}
                  >
                    <CheckCircleIcon className="h-4 w-4 mr-2" />
                    Mark as Served
                  </button>
                )}
              </Menu.Item>
            )}

            {(order.status === "pending" || order.status === "in-progress") && (
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={() => onAddItems(order)}
                    className={classNames(
                      active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                      "flex w-full px-4 py-2 text-sm items-center"
                    )}
                  >
                    <PlusCircleIcon className="h-4 w-4 mr-2" />
                    Add Items
                  </button>
                )}
              </Menu.Item>
            )}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
