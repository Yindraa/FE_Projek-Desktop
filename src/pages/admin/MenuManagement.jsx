"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import PageTitle from "../../components/common/PageTitle";
import MenuItemForm from "../../components/menu/MenuItemForm";
import DeleteConfirmation from "../../components/menu/DeleteConfirmation";
import MenuFiltersAndActions from "../../components/menu/MenuFiltersAndActions";
import MenuTable from "../../components/menu/MenuTable";
import { 
  createMenuItemAPI, 
  updateMenuItemAPI, 
  deleteMenuItemAPI, 
  fetchMenuItems, 
  fetchMenuCategories 
} from "../../services/adminService";

export default function MenuManagement() {  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortConfig, setSortConfig] = useState({
    key: "name",
    direction: "ascending",
  });

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deletingItem, setDeletingItem] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadMenuData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Load data from real API
        const [menuItemsData, categoriesData] = await Promise.all([
          fetchMenuItems(),
          fetchMenuCategories()
        ]);
        
        setMenuItems(menuItemsData);
        setCategories(categoriesData);
      } catch (err) {
        console.error("Error loading menu data:", err);
        setError("Failed to load menu data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };    loadMenuData();
  }, []);

  // Auto-clear success messages after 5 seconds
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setSuccess(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  const handleAddItem = () => {
    setIsAddModalOpen(true);
  };

  const handleEditItem = (item) => {
    setEditingItem(item);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (item) => {
    setDeletingItem(item);
    setIsDeleteModalOpen(true);
  };
  const handleAddSubmit = async (formData) => {
    try {
      setIsSubmitting(true);
      setError(null);
      setSuccess(null);
      // Kirim ke backend
      const newItem = await createMenuItemAPI(formData);
      setMenuItems((prevItems) => [...prevItems, newItem]);
      setIsAddModalOpen(false);
    } catch (error) {
      let msg = "Failed to add menu item. Please try again.";
      if (error?.response?.data?.message) {
        if (Array.isArray(error.response.data.message)) {
          msg = error.response.data.message.join(", ");
        } else {
          msg = error.response.data.message;
        }
      }
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };  const handleEditSubmit = async (formData) => {
    try {
      setIsSubmitting(true);
      setError(null);
      setSuccess(null);

      // Update via real API
      const updatedItem = await updateMenuItemAPI(editingItem.id, formData);
      
      // Update local state with the updated item
      setMenuItems((prevItems) =>
        prevItems.map((item) =>
          item.id === editingItem.id ? updatedItem : item
        )
      );

      // Show success message
      setSuccess(`Menu item \"${updatedItem.name}\" has been updated successfully.`);

      // Close the modal
      setIsEditModalOpen(false);
      setEditingItem(null);
    } catch (error) {
      console.error("Error updating menu item:", error);
      let msg = "Failed to update menu item. Please try again.";
      if (error?.response?.data?.message) {
        if (Array.isArray(error.response.data.message)) {
          msg = error.response.data.message.join(", ");
        } else {
          msg = error.response.data.message;
        }
      }
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleDeleteConfirm = async () => {
    try {
      setIsSubmitting(true);
      setError(null);
      setSuccess(null);

      // Delete via real API
      await deleteMenuItemAPI(deletingItem.id);

      // Update local state by removing the deleted item
      setMenuItems((prevItems) =>
        prevItems.filter((item) => item.id !== deletingItem.id)
      );

      // Show success message
      setSuccess(`Menu item "${deletingItem.name}" has been deleted successfully.`);

      // Close the modal
      setIsDeleteModalOpen(false);
      setDeletingItem(null);} catch (error) {
      console.error("Error deleting menu item:", error);
      let msg = "Failed to delete menu item. Please try again.";
      
      // Handle specific error scenarios
      if (error.message.includes("referenced by existing orders")) {
        msg = "Cannot delete this menu item because it's part of existing orders. Please contact your administrator.";
      } else if (error.message.includes("not found")) {
        msg = "Menu item not found. It may have already been deleted.";
        // If item not found, also remove it from local state
        setMenuItems((prevItems) =>
          prevItems.filter((item) => item.id !== deletingItem.id)
        );
        setIsDeleteModalOpen(false);
        setDeletingItem(null);
      } else if (error?.response?.data?.message) {
        if (Array.isArray(error.response.data.message)) {
          msg = error.response.data.message.join(", ");
        } else {
          msg = error.response.data.message;
        }
      } else if (error.message) {
        msg = error.message;
      }
      setError(msg);
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

  // Filter and sort menu items
  const filteredItems = menuItems.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const sortedItems = [...filteredItems].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === "ascending" ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === "ascending" ? 1 : -1;
    }
    return 0;
  });

  return (
    <DashboardLayout role="admin">
      <div className="animate-fadeIn">
        <PageTitle
          title="Menu Management"
          subtitle="Add, edit, and manage your restaurant's menu items"
        />        {error && (
          <div className="mb-6 rounded-lg bg-red-50 border-l-4 border-red-500 p-4">
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

        {success && (
          <div className="mb-6 rounded-lg bg-green-50 border-l-4 border-green-500 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-green-500"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-green-700">{success}</p>
              </div>
            </div>
          </div>
        )}

        {/* Filters and Actions */}
        <MenuFiltersAndActions
          searchTerm={searchTerm}
          onSearchTermChange={setSearchTerm}
          selectedCategory={selectedCategory}
          onSelectedCategoryChange={setSelectedCategory}
          categories={categories}
          onAddItem={handleAddItem}
        />

        {/* Menu Items Table */}
        <MenuTable
          isLoading={isLoading}
          sortedItems={sortedItems}
          sortConfig={sortConfig}
          onSort={handleSort}
          onEditItem={handleEditItem}
          onDeleteClick={handleDeleteClick}
          filteredItemsCount={filteredItems.length}
          currencySymbol="Rp."
        />
      </div>

      {/* Add Menu Item Modal */}
      <MenuItemForm
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddSubmit}
        categories={categories}
        isLoading={isSubmitting}
      />

      {/* Edit Menu Item Modal */}
      <MenuItemForm
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingItem(null);
        }}
        onSubmit={handleEditSubmit}
        initialData={editingItem}
        categories={categories}
        isLoading={isSubmitting}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmation
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDeletingItem(null);
        }}
        onConfirm={handleDeleteConfirm}
        itemName={deletingItem?.name}
        isLoading={isSubmitting}
      />
    </DashboardLayout>
  );
}
