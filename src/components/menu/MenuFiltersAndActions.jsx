import React from 'react';
import { MagnifyingGlassIcon, PlusIcon } from "@heroicons/react/24/outline";

export default function MenuFiltersAndActions({
  searchTerm,
  onSearchTermChange,
  selectedCategory,
  onSelectedCategoryChange,
  categories,
  onAddItem,
}) {
  return (
    <div className="bg-white shadow-md rounded-xl mb-6 p-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-3 md:space-y-0">
        <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
          {/* Search */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-xl leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
              placeholder="Search menu items..."
              value={searchTerm}
              onChange={(e) => onSearchTermChange(e.target.value)}
            />
          </div>

          {/* Category Filter */}
          <div>
            <select
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm rounded-xl"
              value={selectedCategory}
              onChange={(e) => onSelectedCategoryChange(e.target.value)}
            >              <option value="all">All Categories</option>
              {categories.map((category, index) => (
                <option key={category || index} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Add Button */}
        <button
          type="button"
          onClick={onAddItem}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-xl shadow-sm text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
        >
          <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
          Add Menu Item
        </button>
      </div>
    </div>
  );
}
