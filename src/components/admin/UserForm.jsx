"use client";

import { useState, useEffect } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";

export default function UserForm({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  isLoading = false,
  isEditMode = false, // This prop will determine if we show all fields or just role
}) {
  const [formData, setFormData] = useState({
    username: "",
    name: "", // Added name field
    password: "",
    role: "WAITER", // Default role, ensure it's one of the valid uppercase options
  });
  const [errors, setErrors] = useState({});

  // Initialize form with data
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({
          username: initialData.username || "",
          name: initialData.name || "", // For editing name if applicable
          password: "", // Password is not pre-filled for editing
          role: initialData.role?.toUpperCase() || "WAITER",
        });
      } else {
        // Reset form for adding new user
        setFormData({
          username: "",
          name: "",
          password: "",
          role: "WAITER",
        });
      }
      setErrors({}); // Clear errors when modal opens or initialData changes
    }
  }, [initialData, isOpen]);

  // Add blur effect to the background when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("modal-open");
    } else {
      document.body.classList.remove("modal-open");
    }

    // Cleanup function
    return () => {
      document.body.classList.remove("modal-open");
    };
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    // If in 'Add User' mode (not isEditMode for role) or 'Edit User' mode (not isEditMode for role)
    if (!isEditMode) {
      if (!formData.username.trim()) newErrors.username = "Username is required";
      if (!formData.name.trim()) newErrors.name = "Name is required"; // Validate name

      // Password validation only if not editing an existing user (i.e., initialData is null)
      // or if it's an "Add User" scenario.
      // For a true "Edit User" form (if we re-introduce it), password might be optional.
      // For "Add User", password is required.
      if (!initialData) {
        if (!formData.password) {
          newErrors.password = "Password is required";
        } else if (formData.password.length < 6) {
          newErrors.password = "Password must be at least 6 characters";
        }
        // No confirm password field anymore
      }
    }
    // Role is always validated
    if (!formData.role) newErrors.role = "Role is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      // Ensure role is uppercase for submission
      onSubmit({ ...formData, role: formData.role.toUpperCase() });
    }
  };

  if (!isOpen) return null; // Return null if not open

  // Determine title based on whether it's add, edit user, or edit role
  let modalTitle = "Add User";
  if (initialData) {
    modalTitle = isEditMode ? "Edit User Role" : "Edit User";
  }

  return (
    <div
      className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center"
      style={{ zIndex: 50 }}
    >
      <div
        className="relative mx-auto p-8 border w-full max-w-lg shadow-lg rounded-xl bg-white"
        style={{ zIndex: 51 }}
      >
        <div className="flex items-start justify-between mb-6">
          <h3 className="text-2xl font-semibold text-gray-800">
            {modalTitle}
          </h3>
          <button
            type="button"
            className="p-2 -m-2 text-gray-400 hover:text-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
            onClick={onClose}
          >
            <span className="sr-only">Close</span>
            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Field */}
          {!isEditMode && (
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Name
              </label>
              <input
                type="text"
                name="name"
                id="name"
                value={formData.name}
                onChange={handleChange}
                className={`mt-1 block w-full px-4 py-3 rounded-lg border shadow-sm focus:border-amber-500 focus:ring focus:ring-amber-500 focus:ring-opacity-50 text-gray-900 placeholder-gray-400 ${
                  errors.name ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter full name"
              />
              {errors.name && (
                <p className="mt-2 text-xs text-red-600">{errors.name}</p>
              )}
            </div>
          )}

          {/* Username Field */}
          {!isEditMode && (
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Username
              </label>
              <input
                type="text"
                name="username"
                id="username"
                value={formData.username}
                onChange={handleChange}
                className={`mt-1 block w-full px-4 py-3 rounded-lg border shadow-sm focus:border-amber-500 focus:ring focus:ring-amber-500 focus:ring-opacity-50 text-gray-900 placeholder-gray-400 ${
                  errors.username ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter username"
              />
              {errors.username && (
                <p className="mt-2 text-xs text-red-600">{errors.username}</p>
              )}
            </div>
          )}

          {/* Password Field - Only shown when adding a new user */}
          {!initialData && !isEditMode && (
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Password
              </label>
              <input
                type="password"
                name="password"
                id="password"
                value={formData.password}
                onChange={handleChange}
                className={`mt-1 block w-full px-4 py-3 rounded-lg border shadow-sm focus:border-amber-500 focus:ring focus:ring-amber-500 focus:ring-opacity-50 text-gray-900 placeholder-gray-400 ${
                  errors.password ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter password"
              />
              {errors.password && (
                <p className="mt-2 text-xs text-red-600">{errors.password}</p>
              )}
            </div>
          )}

          {/* Role Field (Always shown) */}
          <div>
            <label
              htmlFor="role"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Role
            </label>
            <select
              name="role"
              id="role"
              value={formData.role}
              onChange={handleChange}
              className={`mt-1 block w-full px-4 py-3 rounded-lg border shadow-sm focus:border-amber-500 focus:ring focus:ring-amber-500 focus:ring-opacity-50 text-gray-900 ${
                errors.role ? "border-red-500" : "border-gray-300"
              }`}
            >
              <option value="ADMIN">Admin</option>
              <option value="CHEF">Chef</option>
              <option value="WAITER">Waiter</option>
              {/* Add other roles if necessary */}
            </select>
            {errors.role && (
              <p className="mt-2 text-xs text-red-600">{errors.role}</p>
            )}
          </div>

          <div className="pt-6 sm:flex sm:flex-row-reverse gap-3">
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex w-full justify-center rounded-lg border border-transparent bg-amber-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 sm:w-auto sm:text-sm transition-colors duration-150"
            >
              {isLoading ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Processing...
                </span>
              ) : initialData ? (
                "Update User"
              ) : (
                "Add User"
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="mt-3 inline-flex w-full justify-center rounded-lg border border-gray-300 bg-white px-6 py-3 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 sm:mt-0 sm:w-auto sm:text-sm transition-colors duration-150"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
