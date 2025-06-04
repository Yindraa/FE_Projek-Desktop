import React from "react";
import { MagnifyingGlassIcon, PlusIcon } from "@heroicons/react/24/outline";

const UserActions = ({
  searchTerm,
  onSearchChange,
  selectedRole,
  onRoleChange,
  onAddUser,
}) => {
  return (
    <div className="mb-4 flex flex-col sm:flex-row justify-between items-center gap-4">
      <div className="relative w-full sm:w-1/3">
        <input
          type="text"
          placeholder="Search users..."
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent shadow-sm"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
      </div>
      <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
        <select
          className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent shadow-sm bg-white"
          value={selectedRole}
          onChange={(e) => onRoleChange(e.target.value)}
        >
          <option value="all">All Roles</option>
          <option value="admin">Admin</option>
          <option value="staff">Staff</option>
          <option value="user">User</option>
        </select>
        <button
          onClick={onAddUser}
          className="w-full sm:w-auto bg-amber-600 hover:bg-amber-700 text-white font-semibold py-2 px-4 rounded-xl shadow-md hover:shadow-lg transition duration-150 ease-in-out flex items-center justify-center"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Add User
        </button>
      </div>
    </div>
  );
};

export default UserActions;
