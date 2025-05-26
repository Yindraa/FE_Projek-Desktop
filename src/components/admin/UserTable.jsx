import React from 'react';
import {
  PencilIcon,
  TrashIcon,
  ArrowUpIcon,
  ArrowDownIcon,
} from "@heroicons/react/24/outline";

const UserTable = ({
  users,
  isLoading,
  sortConfig,
  onSort,
  onEditRole,
  onDeleteUser,
  filteredUsersCount
}) => {
  if (isLoading) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500 text-lg">Loading users...</p>
        {/* You can add a spinner here */}
      </div>
    );
  }

  if (filteredUsersCount === 0) {
    return (
      <div className="text-center py-10 bg-white shadow-md rounded-lg">
        <p className="text-gray-500 text-lg">No users found matching your criteria.</p>
      </div>
    );
  }

  const requestSort = (key) => {
    let direction = "ascending";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "ascending"
    ) {
      direction = "descending";
    }
    onSort(key, direction);
  };

  const getSortIcon = (key) => {
    if (!sortConfig || sortConfig.key !== key) {
      return null; // Or a default icon for unsorted columns
    }
    if (sortConfig.direction === "ascending") {
      return <ArrowUpIcon className="h-4 w-4 inline ml-1" />;
    }
    return <ArrowDownIcon className="h-4 w-4 inline ml-1" />;
  };

  return (
    <div className="overflow-x-auto bg-white shadow-md rounded-lg">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => requestSort("name")}
            >
              Name {getSortIcon("name")}
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => requestSort("username")}
            >
              Username {getSortIcon("username")}
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => requestSort("role")}
            >
              Role
              {sortConfig.key === "role" && (
                <span>{sortConfig.direction === "ascending" ? " ▲" : " ▼"}</span>
              )}
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Status
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {users.map((user) => (
            <tr key={user.id} className="hover:bg-gray-50 transition-colors duration-150">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">{user.name}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500">{user.username}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    user.role === "ADMIN" // Compare with uppercase
                      ? "bg-red-100 text-red-800"
                      : user.role === "STAFF" // Compare with uppercase
                      ? "bg-blue-100 text-blue-800"
                      : user.role === "USER" // Compare with uppercase
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800" // Fallback for other roles
                  }`}
                >
                  {user.role}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <span
                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    user.active // Assuming 'active' is a boolean derived from status
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {user.active ? "Active" : "Inactive"}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button
                  onClick={() => onEditRole(user)}
                  className="text-indigo-600 hover:text-indigo-900 mr-3 transition-colors duration-150"
                  aria-label={`Edit role for ${user.name}`}
                >
                  <PencilIcon className="h-5 w-5" />
                </button>
                <button
                  onClick={() => onDeleteUser(user.id)}
                  className="text-red-600 hover:text-red-900 transition-colors duration-150"
                  aria-label={`Delete ${user.name}`}
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
