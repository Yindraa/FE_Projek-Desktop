"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import PageTitle from "../../components/common/PageTitle";
import { FireIcon, ExclamationTriangleIcon } from "@heroicons/react/24/outline";

export default function KitchenStatus() {
  const [kitchenStations, setKitchenStations] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API call with mock data
    const loadKitchenData = async () => {
      setIsLoading(true);

      // Simulate API delay
      setTimeout(() => {
        // Mock kitchen stations data
        setKitchenStations([
          {
            id: 1,
            name: "Grill Station",
            status: "operational",
            chef: "John Smith",
            currentLoad: "Medium",
            items: ["Steaks", "Grilled Chicken", "Burgers"],
          },
          {
            id: 2,
            name: "Fry Station",
            status: "operational",
            chef: "Maria Garcia",
            currentLoad: "High",
            items: ["French Fries", "Onion Rings", "Fried Chicken"],
          },
          {
            id: 3,
            name: "Cold Station",
            status: "operational",
            chef: "David Lee",
            currentLoad: "Low",
            items: ["Salads", "Cold Appetizers", "Desserts"],
          },
          {
            id: 4,
            name: "Hot Station",
            status: "maintenance",
            chef: "Unassigned",
            currentLoad: "N/A",
            items: ["Soups", "Pasta", "Hot Appetizers"],
          },
        ]);

        // Mock inventory data
        setInventory([
          {
            id: 1,
            name: "Chicken Breast",
            quantity: 24,
            unit: "kg",
            status: "normal",
          },
          {
            id: 2,
            name: "Ground Beef",
            quantity: 15,
            unit: "kg",
            status: "normal",
          },
          {
            id: 3,
            name: "Lettuce",
            quantity: 10,
            unit: "kg",
            status: "normal",
          },
          {
            id: 4,
            name: "Tomatoes",
            quantity: 8,
            unit: "kg",
            status: "normal",
          },
          { id: 5, name: "Cheese", quantity: 5, unit: "kg", status: "low" },
          { id: 6, name: "Potatoes", quantity: 3, unit: "kg", status: "low" },
          {
            id: 7,
            name: "Cooking Oil",
            quantity: 2,
            unit: "L",
            status: "critical",
          },
        ]);

        setIsLoading(false);
      }, 1000);
    };

    loadKitchenData();
  }, []);

  const handleStationStatusChange = (stationId, newStatus) => {
    setKitchenStations((prevStations) =>
      prevStations.map((station) => {
        if (station.id === stationId) {
          return { ...station, status: newStatus };
        }
        return station;
      })
    );
  };

  return (
    <DashboardLayout role="chef">
      <div className="animate-fadeIn">
        <PageTitle
          title="Kitchen Status"
          subtitle="Monitor kitchen stations and inventory levels"
        />

        {/* Kitchen Stations */}
        <div className="bg-white shadow-md rounded-xl overflow-hidden mb-8">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
              <FireIcon className="h-5 w-5 mr-2 text-amber-600" />
              Kitchen Stations
            </h3>
          </div>
          <div className="px-4 py-3 sm:px-6">
            {isLoading ? (
              <div className="animate-pulse space-y-4">
                {Array(4)
                  .fill(0)
                  .map((_, index) => (
                    <div
                      key={index}
                      className="h-24 bg-gray-200 rounded mb-4"
                    ></div>
                  ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2">
                {kitchenStations.map((station) => (
                  <div
                    key={station.id}
                    className={`border rounded-xl overflow-hidden shadow-sm ${
                      station.status === "operational"
                        ? "border-green-200"
                        : station.status === "busy"
                        ? "border-yellow-200"
                        : "border-red-200"
                    }`}
                  >
                    <div
                      className={`px-4 py-3 ${
                        station.status === "operational"
                          ? "bg-green-50"
                          : station.status === "busy"
                          ? "bg-yellow-50"
                          : "bg-red-50"
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <h4 className="text-md font-medium text-gray-900">
                          {station.name}
                        </h4>
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            station.status === "operational"
                              ? "bg-green-100 text-green-800"
                              : station.status === "busy"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {station.status.charAt(0).toUpperCase() +
                            station.status.slice(1)}
                        </span>
                      </div>
                    </div>
                    <div className="px-4 py-4 sm:px-6">
                      <dl className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
                        <div className="sm:col-span-1">
                          <dt className="text-sm font-medium text-gray-500">
                            Chef
                          </dt>
                          <dd className="mt-1 text-sm text-gray-900">
                            {station.chef}
                          </dd>
                        </div>
                        <div className="sm:col-span-1">
                          <dt className="text-sm font-medium text-gray-500">
                            Current Load
                          </dt>
                          <dd className="mt-1 text-sm text-gray-900">
                            {station.currentLoad}
                          </dd>
                        </div>
                        <div className="sm:col-span-2">
                          <dt className="text-sm font-medium text-gray-500">
                            Items
                          </dt>
                          <dd className="mt-1 text-sm text-gray-900">
                            {station.items.map((item, index) => (
                              <span
                                key={index}
                                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 mr-2 mb-2"
                              >
                                {item}
                              </span>
                            ))}
                          </dd>
                        </div>
                      </dl>
                      <div className="mt-4 flex justify-end space-x-3">
                        {station.status !== "operational" && (
                          <button
                            onClick={() =>
                              handleStationStatusChange(
                                station.id,
                                "operational"
                              )
                            }
                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-xl shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                          >
                            Mark Operational
                          </button>
                        )}
                        {station.status !== "busy" && (
                          <button
                            onClick={() =>
                              handleStationStatusChange(station.id, "busy")
                            }
                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-xl shadow-sm text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                          >
                            Mark Busy
                          </button>
                        )}
                        {station.status !== "maintenance" && (
                          <button
                            onClick={() =>
                              handleStationStatusChange(
                                station.id,
                                "maintenance"
                              )
                            }
                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-xl shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                          >
                            Needs Maintenance
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Inventory Status */}
        <div className="bg-white shadow-md rounded-xl overflow-hidden">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
              <ExclamationTriangleIcon className="h-5 w-5 mr-2 text-amber-600" />
              Inventory Status
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Items that need attention are highlighted
            </p>
          </div>
          <div className="px-4 py-3 sm:px-6">
            {isLoading ? (
              <div className="animate-pulse">
                <div className="h-10 bg-gray-200 rounded mb-4"></div>
                {Array(5)
                  .fill(0)
                  .map((_, index) => (
                    <div
                      key={index}
                      className="h-8 bg-gray-200 rounded mb-2"
                    ></div>
                  ))}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Item
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Quantity
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {inventory.map((item) => (
                      <tr
                        key={item.id}
                        className={
                          item.status === "critical"
                            ? "bg-red-50"
                            : item.status === "low"
                            ? "bg-yellow-50"
                            : ""
                        }
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {item.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {item.quantity} {item.unit}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              item.status === "normal"
                                ? "bg-green-100 text-green-800"
                                : item.status === "low"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {item.status.charAt(0).toUpperCase() +
                              item.status.slice(1)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
