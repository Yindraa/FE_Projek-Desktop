"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import PageTitle from "../../components/common/PageTitle";
import UserForm from "../../components/user/UserForm";
import DeleteUserConfirmation from "../../components/user/DeleteUserConfirmation";
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  ArrowUpIcon,
  ArrowDownIcon,
} from "@heroicons/react/24/outline";

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("all");
  const [sortConfig, setSortConfig] = useState({
    key: "name",
    direction: "ascending",
  });

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isEditRoleModalOpen, setIsEditRoleModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [deletingUser, setDeletingUser] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Use mock data directly since API isn't ready
        setTimeout(() => {
          setUsers([
            {
              id: 1,
              username: "admin_user",
              firstName: "Admin",
              lastName: "User",
              email: "admin@example.com",
              phoneNumber: "+1234567890",
              role: "admin",
              active: true,
              avatar: "/placeholder.svg?height=40&width=40",
            },
            {
              id: 2,
              username: "chef_user",
              firstName: "Chef",
              lastName: "User",
              email: "chef@example.com",
              phoneNumber: "+1234567891",
              role: "chef",
              active: true,
              avatar: "/placeholder.svg?height=40&width=40",
            },
            {
              id: 3,
              username: "waiter_user1",
              firstName: "Waiter",
              lastName: "One",
              email: "waiter1@example.com",
              phoneNumber: "+1234567892",
              role: "waiter",
              active: true,
              avatar: "/placeholder.svg?height=40&width=40",
            },
            {
              id: 4,
              username: "waiter_user2",
              firstName: "Waiter",
              lastName: "Two",
              email: "waiter2@example.com",
              phoneNumber: "+1234567893",
              role: "waiter",
              active: false,
              avatar: "/placeholder.svg?height=40&width=40",
            },
          ]);
          setIsLoading(false);
        }, 1000); // Simulate API delay
      } catch (err) {
        console.error("Error loading users:", err);
        setError("Failed to load users. Please try again.");
        setIsLoading(false);
      }
    };

    loadUsers();
  }, []);

  const handleAddUser = () => {
    setEditingUser(null);
    setIsAddModalOpen(true);
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setIsEditModalOpen(true);
  };

  const handleEditRole = (user) => {
    setEditingUser(user);
    setIsEditRoleModalOpen(true);
  };

  const handleDeleteClick = (user) => {
    setDeletingUser(user);
    setIsDeleteModalOpen(true);
  };

  // Update the handleAddSubmit function to use mock data
  const handleAddSubmit = async (formData) => {
    try {
      setIsSubmitting(true);

      // Create a mock user with the form data
      const newUser = {
        id: Date.now(),
        ...formData,
        avatar: "/placeholder.svg?height=40&width=40",
      };

      // Update local state with the new user
      setUsers((prevUsers) => [...prevUsers, newUser]);

      // Close the modal
      setIsAddModalOpen(false);
    } catch (error) {
      console.error("Error adding user:", error);
      setError("Failed to add user. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Update the handleEditSubmit function to use mock data
  const handleEditSubmit = async (formData) => {
    try {
      setIsSubmitting(true);

      // Create updated user with the form data
      const updatedUser = {
        ...editingUser,
        ...formData,
      };

      // Update local state with the updated user
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === editingUser.id ? updatedUser : user
        )
      );

      // Close the modal
      setIsEditModalOpen(false);
      setEditingUser(null);
    } catch (error) {
      console.error("Error updating user:", error);
      setError("Failed to update user. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Update the handleEditRoleSubmit function to use mock data
  const handleEditRoleSubmit = async (formData) => {
    try {
      setIsSubmitting(true);

      // Update local state with the updated user role
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === editingUser.id ? { ...user, role: formData.role } : user
        )
      );

      // Close the modal
      setIsEditRoleModalOpen(false);
      setEditingUser(null);
    } catch (error) {
      console.error("Error updating user role:", error);
      setError("Failed to update user role. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Update the handleDeleteConfirm function to use mock data
  const handleDeleteConfirm = async () => {
    try {
      setIsSubmitting(true);

      // Update local state by removing the deleted user
      setUsers((prevUsers) =>
        prevUsers.filter((user) => user.id !== deletingUser.id)
      );

      // Close the modal
      setIsDeleteModalOpen(false);
      setDeletingUser(null);
    } catch (error) {
      console.error("Error deleting user:", error);
      setError("Failed to delete user. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  // Filter and sort users
  const filteredUsers = users.filter((user) => {
    const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
    const matchesSearch =
      fullName.includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === "all" || user.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    let aValue, bValue;

    if (sortConfig.key === "name") {
      aValue = `${a.firstName} ${a.lastName}`;
      bValue = `${b.firstName} ${b.lastName}`;
    } else {
      aValue = a[sortConfig.key];
      bValue = b[sortConfig.key];
    }

    if (aValue < bValue) {
      return sortConfig.direction === "ascending" ? -1 : 1;
    }
    if (aValue > bValue) {
      return sortConfig.direction === "ascending" ? 1 : -1;
    }
    return 0;
  });

  return (
    <DashboardLayout role="admin">
      <div className="animate-fadeIn">
        <PageTitle
          title="User Management"
          subtitle="Add, edit, and manage staff accounts"
        />

        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-500"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Filters and Actions */}
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
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Role Filter */}
              <div>
                <select
                  className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm rounded-md"
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                >
                  <option value="all">All Roles</option>
                  <option value="admin">Admin</option>
                  <option value="chef">Chef</option>
                  <option value="waiter">Waiter</option>
                </select>
              </div>
            </div>

            {/* Add Button */}
            <button
              type="button"
              onClick={handleAddUser}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
            >
              <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
              Add User
            </button>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white shadow-md rounded-xl overflow-hidden">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Staff Members
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {filteredUsers.length} users found
            </p>
          </div>

          <div className="overflow-x-auto">
            {isLoading ? (
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
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort("name")}
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
                      onClick={() => handleSort("email")}
                    >
                      <div className="flex items-center">
                        Email
                        {sortConfig.key === "email" &&
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
                      onClick={() => handleSort("role")}
                    >
                      <div className="flex items-center">
                        Role
                        {sortConfig.key === "role" &&
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
                  {sortedUsers.length > 0 ? (
                    sortedUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <img
                                className="h-10 w-10 rounded-full"
                                src={
                                  user.avatar ||
                                  "/placeholder.svg?height=40&width=40"
                                }
                                alt=""
                              />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {user.firstName} {user.lastName}
                              </div>
                              <div className="text-sm text-gray-500">
                                {user.username}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {user.email}
                          </div>
                          <div className="text-sm text-gray-500">
                            {user.phoneNumber}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <span className="capitalize">{user.role}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              user.active
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {user.active ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => handleEditRole(user)}
                            className="text-amber-600 hover:text-amber-900 mr-4"
                            title="Edit Role"
                          >
                            <PencilIcon className="h-5 w-5" />
                            <span className="sr-only">Edit Role</span>
                          </button>
                          <button
                            onClick={() => handleDeleteClick(user)}
                            className="text-red-600 hover:text-red-900"
                            title="Delete User"
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
                        No users found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* Add User Modal */}
      <UserForm
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddSubmit}
        isLoading={isSubmitting}
      />

      {/* Edit User Modal */}
      <UserForm
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingUser(null);
        }}
        onSubmit={handleEditSubmit}
        initialData={editingUser}
        isLoading={isSubmitting}
      />

      {/* Edit Role Modal */}
      <UserForm
        isOpen={isEditRoleModalOpen}
        onClose={() => {
          setIsEditRoleModalOpen(false);
          setEditingUser(null);
        }}
        onSubmit={handleEditRoleSubmit}
        initialData={editingUser}
        isLoading={isSubmitting}
        isEditMode={true}
      />

      {/* Delete Confirmation Modal */}
      <DeleteUserConfirmation
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDeletingUser(null);
        }}
        onConfirm={handleDeleteConfirm}
        userName={
          deletingUser
            ? `${deletingUser.firstName} ${deletingUser.lastName}`
            : ""
        }
        isLoading={isSubmitting}
      />
    </DashboardLayout>
  );
}
