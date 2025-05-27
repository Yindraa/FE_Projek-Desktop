"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import PageTitle from "../../components/common/PageTitle";
import MenuItemForm from "../../components/menu/MenuItemForm";
import DeleteConfirmation from "../../components/menu/DeleteConfirmation";
import MenuFiltersAndActions from "../../components/menu/MenuFiltersAndActions"; // Import the new component
import MenuTable from "../../components/menu/MenuTable"; // Import the new component

// Mock data for menu items
const mockMenuItems = [
  {
    id: 1,
    name: "Grilled Salmon",
    description:
      "Fresh salmon fillet grilled to perfection with herbs and lemon",
    category: "Main Course",
    price: 18.99,
    available: true,
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 2,
    name: "Caesar Salad",
    description:
      "Crisp romaine lettuce with Caesar dressing, croutons, and parmesan",
    category: "Appetizer",
    price: 9.99,
    available: true,
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 3,
    name: "Chocolate Lava Cake",
    description: "Warm chocolate cake with a molten chocolate center",
    category: "Dessert",
    price: 7.99,
    available: true,
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 4,
    name: "Margherita Pizza",
    description: "Classic pizza with tomato sauce, mozzarella, and fresh basil",
    category: "Main Course",
    price: 14.99,
    available: true,
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 5,
    name: "Iced Coffee",
    description: "Cold brewed coffee served over ice",
    category: "Beverage",
    price: 3.99,
    available: true,
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 6,
    name: "Beef Burger",
    description: "Juicy beef patty with lettuce, tomato, and special sauce",
    category: "Main Course",
    price: 12.99,
    available: false,
    image: "/placeholder.svg?height=40&width=40",
  },
];

// Mock data for menu categories
const mockMenuCategories = [
  { id: 1, name: "Appetizer" },
  { id: 2, name: "Main Course" },
  { id: 3, name: "Dessert" },
  { id: 4, name: "Beverage" },
];

export default function MenuManagement() {
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
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
    // Simulate API call with a delay
    const loadMenuData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Use mock data directly
        setMenuItems(mockMenuItems);
        setCategories(mockMenuCategories);
      } catch (err) {
        console.error("Error loading menu data:", err);
        setError("Failed to load menu data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    loadMenuData();
  }, []);

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

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Create a new item with an ID
      const newItem = {
        id: Date.now(),
        ...formData,
        image: formData.imagePreview || "/placeholder.svg?height=40&width=40",
      };

      // Update local state with the new item
      setMenuItems((prevItems) => [...prevItems, newItem]);

      // Close the modal
      setIsAddModalOpen(false);
    } catch (error) {
      console.error("Error adding menu item:", error);
      setError("Failed to add menu item. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditSubmit = async (formData) => {
    try {
      setIsSubmitting(true);

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Create updated item
      const updatedItem = {
        id: editingItem.id,
        ...formData,
        image: formData.imagePreview || editingItem.image,
      };

      // Update local state with the updated item
      setMenuItems((prevItems) =>
        prevItems.map((item) =>
          item.id === editingItem.id ? updatedItem : item
        )
      );

      // Close the modal
      setIsEditModalOpen(false);
      setEditingItem(null);
    } catch (error) {
      console.error("Error updating menu item:", error);
      setError("Failed to update menu item. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      setIsSubmitting(true);

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Update local state by removing the deleted item
      setMenuItems((prevItems) =>
        prevItems.filter((item) => item.id !== deletingItem.id)
      );

      // Close the modal
      setIsDeleteModalOpen(false);
      setDeletingItem(null);
    } catch (error) {
      console.error("Error deleting menu item:", error);
      setError("Failed to delete menu item. Please try again.");
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
        />

        {error && (
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
