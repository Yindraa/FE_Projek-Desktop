"use client";

import { useState, useEffect } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";

export default function MenuItemForm({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  categories = [],
  isLoading = false,
}) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
    available: true,
    image: null,
    imagePreview: null,
  });
  const [errors, setErrors] = useState({});

  // Initialize form with data if editing
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        description: initialData.description || "",
        category: initialData.category || "",
        price: initialData.price ? initialData.price.toString() : "",
        available:
          initialData.available !== undefined ? initialData.available : true,
        image: null,
        imagePreview: initialData.image || null,
      });
    } else {
      // Reset form when adding new item
      setFormData({
        name: "",
        description: "",
        category: categories.length > 0 ? categories[0].name : "",
        price: "",
        available: true,
        image: null,
        imagePreview: null,
      });
    }
  }, [initialData, categories, isOpen]);

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
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else if (name === "price") {
      // Only allow numbers and decimal point
      const regex = /^[0-9]*\.?[0-9]*$/;
      if (value === "" || regex.test(value)) {
        setFormData((prev) => ({ ...prev, [name]: value }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        image: file,
        imagePreview: URL.createObjectURL(file),
      }));

      if (errors.image) {
        setErrors((prev) => ({ ...prev, image: null }));
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";
    if (!formData.category) newErrors.category = "Category is required";
    if (!formData.price) newErrors.price = "Price is required";
    else if (
      isNaN(Number.parseFloat(formData.price)) ||
      Number.parseFloat(formData.price) <= 0
    ) {
      newErrors.price = "Price must be a positive number";
    }

    if (!initialData && !formData.image && !formData.imagePreview) {
      newErrors.image = "Image is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      // Convert price to number
      const submissionData = {
        ...formData,
        price: Number.parseFloat(formData.price),
      };

      onSubmit(submissionData);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 overflow-y-auto" style={{ zIndex: 10 }}>
      <div className="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 bg-black bg-opacity-25 transition-opacity"
          onClick={onClose}
          style={{ zIndex: 9 }}
        ></div>

        <span
          className="hidden sm:inline-block sm:h-screen sm:align-middle"
          aria-hidden="true"
        >
          &#8203;
        </span>

        <div
          className="inline-block transform overflow-hidden rounded-xl bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle"
          style={{ position: "relative", zIndex: 10 }}
        >
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex items-start justify-between">
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                {initialData ? "Edit Menu Item" : "Add Menu Item"}
              </h3>
              <button
                type="button"
                className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none"
                onClick={onClose}
              >
                <span className="sr-only">Close</span>
                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Item Image
                </label>
                <div className="mt-1 flex items-center space-x-4">
                  <div className="h-24 w-24 overflow-hidden rounded-xl border border-gray-300 bg-gray-100">
                    {formData.imagePreview ? (
                      <img
                        src={formData.imagePreview || "/placeholder.svg"}
                        alt="Preview"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-gray-400">
                        No image
                      </div>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="image-upload"
                      className="cursor-pointer rounded-xl bg-white px-3 py-2 text-sm font-medium text-amber-600 shadow-sm hover:bg-amber-50 focus-within:outline-none"
                    >
                      <span>Upload a file</span>
                      <input
                        id="image-upload"
                        name="image"
                        type="file"
                        accept="image/*"
                        className="sr-only"
                        onChange={handleImageChange}
                      />
                    </label>
                    {errors.image && (
                      <p className="mt-1 text-xs text-red-600">
                        {errors.image}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Name */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`mt-1 block w-full rounded-xl border ${
                    errors.name ? "border-red-300" : "border-gray-300"
                  } px-3 py-2 shadow-sm focus:border-amber-500 focus:outline-none focus:ring-amber-500 sm:text-sm`}
                />
                {errors.name && (
                  <p className="mt-1 text-xs text-red-600">{errors.name}</p>
                )}
              </div>

              {/* Description */}
              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  value={formData.description}
                  onChange={handleChange}
                  className={`mt-1 block w-full rounded-xl border ${
                    errors.description ? "border-red-300" : "border-gray-300"
                  } px-3 py-2 shadow-sm focus:border-amber-500 focus:outline-none focus:ring-amber-500 sm:text-sm`}
                />
                {errors.description && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.description}
                  </p>
                )}
              </div>

              {/* Category */}
              <div>
                <label
                  htmlFor="category"
                  className="block text-sm font-medium text-gray-700"
                >
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className={`mt-1 block w-full rounded-xl border ${
                    errors.category ? "border-red-300" : "border-gray-300"
                  } bg-white px-3 py-2 shadow-sm focus:border-amber-500 focus:outline-none focus:ring-amber-500 sm:text-sm`}
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <p className="mt-1 text-xs text-red-600">{errors.category}</p>
                )}
              </div>

              {/* Price */}
              <div>
                <label
                  htmlFor="price"
                  className="block text-sm font-medium text-gray-700"
                >
                  Price ($)
                </label>
                <input
                  type="text"
                  name="price"
                  id="price"
                  value={formData.price}
                  onChange={handleChange}
                  className={`mt-1 block w-full rounded-xl border ${
                    errors.price ? "border-red-300" : "border-gray-300"
                  } px-3 py-2 shadow-sm focus:border-amber-500 focus:outline-none focus:ring-amber-500 sm:text-sm`}
                />
                {errors.price && (
                  <p className="mt-1 text-xs text-red-600">{errors.price}</p>
                )}
              </div>

              {/* Availability */}
              <div className="flex items-center">
                <input
                  id="available"
                  name="available"
                  type="checkbox"
                  checked={formData.available}
                  onChange={handleChange}
                  className="h-4 w-4 rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                />
                <label
                  htmlFor="available"
                  className="ml-2 block text-sm text-gray-900"
                >
                  Available for ordering
                </label>
              </div>

              <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="inline-flex w-full justify-center rounded-xl border border-transparent bg-amber-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 sm:col-start-2 sm:text-sm"
                >
                  {isLoading ? (
                    <span className="flex items-center">
                      <svg
                        className="mr-2 h-4 w-4 animate-spin text-white"
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
                    "Update"
                  ) : (
                    "Add"
                  )}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="mt-3 inline-flex w-full justify-center rounded-xl border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 sm:col-start-1 sm:mt-0 sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
