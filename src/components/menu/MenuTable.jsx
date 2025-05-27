import React from 'react';
import {
  PencilIcon,
  TrashIcon,
  ArrowUpIcon,
  ArrowDownIcon,
} from "@heroicons/react/24/outline";

export default function MenuTable({
  isLoading,
  sortedItems,
  sortConfig,
  onSort,
  onEditItem,
  onDeleteClick,
  filteredItemsCount
}) {
  if (isLoading) {
    return (
      <div className="animate-pulse p-4">
        <div className="h-8 bg-gray-200 rounded mb-4"></div>
        {Array(5)
          .fill(0)
          .map((_, index) => (
            <div
              key={index}
              className="h-16 bg-gray-200 rounded mb-4"
            ></div>
          ))}
      </div>
    );
  }

  return (
    <div className="bg-white shadow-md rounded-xl overflow-hidden">
      <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          Menu Items
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          {filteredItemsCount} items found
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => onSort("name")}
              >
                <div className="flex items-center">
                  Name
                  {sortConfig.key === "name" &&
                    (sortConfig.direction === "ascending" ? (
                      <ArrowUpIcon className="h-4 w-4 ml-1" />
                    ) : (
                      <ArrowDownIcon className="h-4 w-4 ml-1" />
                    ))}
                </div>
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => onSort("category")}
              >
                <div className="flex items-center">
                  Category
                  {sortConfig.key === "category" &&
                    (sortConfig.direction === "ascending" ? (
                      <ArrowUpIcon className="h-4 w-4 ml-1" />
                    ) : (
                      <ArrowDownIcon className="h-4 w-4 ml-1" />
                    ))}
                </div>
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => onSort("price")}
              >
                <div className="flex items-center">
                  Price
                  {sortConfig.key === "price" &&
                    (sortConfig.direction === "ascending" ? (
                      <ArrowUpIcon className="h-4 w-4 ml-1" />
                    ) : (
                      <ArrowDownIcon className="h-4 w-4 ml-1" />
                    ))}
                </div>
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Status
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
            {sortedItems.length > 0 ? (
              sortedItems.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <img
                          className="h-10 w-10 rounded-full object-cover"
                          src={
                            item.image ||
                            "/placeholder.svg?height=40&width=40"
                          }
                          alt=""
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {item.name}
                        </div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">
                          {item.description}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {item.category}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      ${item.price.toFixed(2)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        item.available
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {item.available ? "Available" : "Unavailable"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => onEditItem(item)}
                      className="text-amber-600 hover:text-amber-900 mr-4"
                    >
                      <PencilIcon className="h-5 w-5" />
                      <span className="sr-only">Edit</span>
                    </button>
                    <button
                      onClick={() => onDeleteClick(item)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <TrashIcon className="h-5 w-5" />
                      <span className="sr-only">Delete</span>
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="5"
                  className="px-6 py-4 text-center text-sm text-gray-500"
                >
                  No menu items found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
