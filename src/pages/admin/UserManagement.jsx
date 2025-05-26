"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import PageTitle from "../../components/common/PageTitle";
import UserForm from "../../components/admin/UserForm"; 
import DeleteUserConfirmation from "../../components/admin/DeleteUserConfirmation";
import UserActions from "../../components/admin/UserActions"; 
import UserTable from "../../components/admin/UserTable"; 
import {
  getAllUsers,
  createUserAPI,
  updateUserRole,
  deleteUserAPI,
} from "../../services/adminService";

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
        const data = await getAllUsers();
        // Adapt backend data to frontend shape if needed
        setUsers(
          data.map((user) => ({
            id: user.id,
            username: user.username,
            name: user.name,

            role: user.role || "", // Store role as it comes from API (likely uppercase)
            active: user.status === "ACTIVE",
            avatar: "/placeholder.svg?height=40&width=40",
          }))
        );
        setIsLoading(false);
      } catch (err) {
        setError(
          err.response?.data?.message || err.message || "Failed to load users. Please try again."
        );
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
      setError(null);
      // API expects: username, password, role, name
      const reqBody = {
        username: formData.username,
        password: formData.password,
        role: formData.role.toUpperCase(), // Ensure role is uppercase
        name: formData.name, // Use the new single 'name' field
      };
      const newUser = await createUserAPI(reqBody);
      setUsers((prevUsers) => [
        ...prevUsers,
        {
          id: newUser.id,
          username: newUser.username,
          name: newUser.name,
          email: newUser.email || "-", // Keep for display if API returns it
          phoneNumber: newUser.phoneNumber || "-", // Keep for display if API returns it
          role: newUser.role?.toUpperCase() || "", // Store role as it comes from API
          active: newUser.status === "ACTIVE",
          avatar: "/placeholder.svg?height=40&width=40",
        },
      ]);
      setIsAddModalOpen(false);
    } catch (error) {
      setError(
        error.response?.data?.message || error.message || "Failed to add user. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Update the handleEditRoleSubmit function to use mock data
  const handleEditRoleSubmit = async (formData) => {
    try {
      setIsSubmitting(true);
      setError(null);
      const updated = await updateUserRole(editingUser.id, formData.role?.toUpperCase());
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === editingUser.id
            ? { ...user, role: updated.role || "", active: updated.status === "ACTIVE" } // Use role from API response
            : user
        )
      );
      setIsEditRoleModalOpen(false);
      setEditingUser(null);
    } catch (error) {
      setError(
        error.response?.data?.message || error.message || "Failed to update user role. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Update the handleDeleteConfirm function to use mock data
  const handleDeleteConfirm = async () => {
    try {
      setIsSubmitting(true);
      setError(null);
      await deleteUserAPI(deletingUser.id);
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== deletingUser.id));
      setIsDeleteModalOpen(false);
      setDeletingUser(null);
    } catch (error) {
      setError(
        error.response?.data?.message || error.message || "Failed to delete user. Please try again."
      );
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
    const fullName = user.name ? user.name.toLowerCase() : ''; // Use user.name
    const matchesSearch =
      fullName.includes(searchTerm.toLowerCase()) ||
      (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesRole = selectedRole === "all" || (user.role && user.role.toLowerCase() === selectedRole); // Compare user.role (now uppercase) with selectedRole (lowercase)
    return matchesSearch && matchesRole;
  });

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    let aValue, bValue;

    if (sortConfig.key === "name") {
      aValue = a.name || ''; // Use a.name
      bValue = b.name || ''; // Use b.name
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


  const handleEditSubmit = async (formData) => {
    try {
      setIsSubmitting(true);
      setError(null);
      // This modal is now only for editing the role.
      // If a full edit form is needed, it would be separate.
      const updated = await updateUserRole(editingUser.id, formData.role.toUpperCase());
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === editingUser.id
            ? { ...user, role: updated.role?.toUpperCase() || "", active: updated.status === "ACTIVE" }
            : user
        )
      );
      setIsEditModalOpen(false);
      setEditingUser(null);
    } catch (error) {
      setError(
        error.response?.data?.message || error.message || "Failed to update user role. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

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
        <UserActions
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedRole={selectedRole}
          onRoleChange={setSelectedRole}
          onAddUser={handleAddUser}
        />

        {/* Users Table */}
        <UserTable
          users={sortedUsers}
          isLoading={isLoading}
          sortConfig={sortConfig}
          onSort={handleSort}
          onEditRole={handleEditRole}
          onDeleteUser={handleDeleteClick}
          filteredUsersCount={filteredUsers.length}
        />
      </div>

      {/* Add User Modal */}
      <UserForm
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddSubmit}
        isLoading={isSubmitting}
        // isEditMode is false by default, so it's an "Add User" form
      />

      {/* Edit User Modal - This now only handles ROLE EDIT via isEditMode=true on UserForm */}
      {/* If a full "Edit User Details" form is needed, a new state/modal instance would be better */}
      <UserForm
        isOpen={isEditModalOpen} // This was for the general edit user modal
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingUser(null);
        }}
        onSubmit={handleEditSubmit} // This submits only role
        initialData={editingUser}
        isLoading={isSubmitting}
        isEditMode={true} // This tells UserForm to only show Role field
      />

      {/* Edit Role Modal - This is the specific modal for editing only the role */}
      {/* It seems isEditModalOpen and isEditRoleModalOpen might be redundant if UserForm's isEditMode handles it */}
      {/* For clarity, let's assume the UserTable's "Edit Role" button triggers isEditRoleModalOpen */}
      <UserForm
        isOpen={isEditRoleModalOpen}
        onClose={() => {
          setIsEditRoleModalOpen(false);
          setEditingUser(null);
        }}
        onSubmit={handleEditRoleSubmit} // This specifically handles role update
        initialData={editingUser}
        isLoading={isSubmitting}
        isEditMode={true} // Crucial: tells UserForm to only show relevant fields for role editing
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
