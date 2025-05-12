"use client";

import { useState, useEffect, useRef } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import PageTitle from "../../components/common/PageTitle";
import {
  ChartBarIcon,
  CurrencyDollarIcon,
  QueueListIcon,
  CalendarIcon,
  PrinterIcon,
} from "@heroicons/react/24/outline";

// Mock data for sales data
const mockSalesData = [
  {
    name: "Total Sales",
    value: "$24,000",
    icon: () => {
      return (
        <CurrencyDollarIcon
          className="h-6 w-6 text-amber-600"
          aria-hidden="true"
        />
      );
    },
  },
  {
    name: "Average Order",
    value: "$53.33",
    icon: () => {
      return (
        <ChartBarIcon className="h-6 w-6 text-amber-600" aria-hidden="true" />
      );
    },
  },
  {
    name: "Orders",
    value: "450",
    icon: () => {
      return (
        <QueueListIcon className="h-6 w-6 text-amber-600" aria-hidden="true" />
      );
    },
  },
  {
    name: "Customers",
    value: "320",
    icon: () => {
      return (
        <UsersIcon className="h-6 w-6 text-amber-600" aria-hidden="true" />
      );
    },
  },
];

// Mock data for popular items
const mockPopularItems = [
  { name: "Grilled Salmon", category: "Main Course", orders: 45 },
  { name: "Caesar Salad", category: "Appetizer", orders: 38 },
  { name: "Chocolate Lava Cake", category: "Dessert", orders: 32 },
  { name: "Margherita Pizza", category: "Main Course", orders: 30 },
  { name: "Iced Coffee", category: "Beverage", orders: 28 },
];

// Mock data for staff performance
const mockStaffPerformance = [
  {
    name: "Waiter One",
    role: "Waiter",
    ordersProcessed: 120,
    salesAmount: "5,240",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    name: "Waiter Two",
    role: "Waiter",
    ordersProcessed: 98,
    salesAmount: "4,120",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    name: "Chef User",
    role: "Chef",
    ordersProcessed: 218,
    salesAmount: "9,360",
    avatar: "/placeholder.svg?height=40&width=40",
  },
];

import { UsersIcon } from "@heroicons/react/24/outline";

export default function Reports() {
  const [timeRange, setTimeRange] = useState("week");
  const [salesData, setSalesData] = useState([]);
  const [popularItems, setPopularItems] = useState([]);
  const [staffPerformance, setStaffPerformance] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Refs for the sections to print
  const salesReportRef = useRef(null);
  const itemsReportRef = useRef(null);
  const staffReportRef = useRef(null);

  useEffect(() => {
    const loadReportData = async () => {
      try {
        setIsLoading(true);

        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Use mock data directly
        setSalesData(mockSalesData);
        setPopularItems(mockPopularItems);
        setStaffPerformance(mockStaffPerformance);
        setError(null);
      } catch (err) {
        console.error("Error loading report data:", err);
        setError("Failed to load report data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    loadReportData();
  }, [timeRange]);

  // Function to print a specific section
  const handlePrintReport = (reportType) => {
    let contentToPrint;
    let title;

    switch (reportType) {
      case "sales":
        contentToPrint = salesReportRef.current;
        title = "Sales Report";
        break;
      case "items":
        contentToPrint = itemsReportRef.current;
        title = "Popular Items Report";
        break;
      case "staff":
        contentToPrint = staffReportRef.current;
        title = "Staff Performance Report";
        break;
      default:
        return;
    }

    if (!contentToPrint) return;

    // Create a new window for printing
    const printWindow = window.open("", "_blank");

    // Add content to the new window
    printWindow.document.write(`
      <html>
        <head>
          <title>${title} - ${
      timeRange.charAt(0).toUpperCase() + timeRange.slice(1)
    }</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 20px;
            }
            .report-header {
              text-align: center;
              margin-bottom: 20px;
            }
            .report-header h1 {
              margin-bottom: 5px;
            }
            .report-header p {
              color: #666;
              margin-top: 0;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 20px;
            }
            th, td {
              border: 1px solid #ddd;
              padding: 8px;
              text-align: left;
            }
            th {
              background-color: #f2f2f2;
            }
            tr:nth-child(even) {
              background-color: #f9f9f9;
            }
            .print-date {
              text-align: right;
              font-size: 12px;
              color: #666;
              margin-top: 30px;
            }
          </style>
        </head>
        <body>
          <div class="report-header">
            <h1>${title}</h1>
            <p>Time Range: ${
              timeRange.charAt(0).toUpperCase() + timeRange.slice(1)
            }</p>
          </div>
          ${contentToPrint.outerHTML}
          <div class="print-date">
            Printed on: ${new Date().toLocaleString()}
          </div>
        </body>
      </html>
    `);

    // Wait for content to load then print
    printWindow.document.close();
    printWindow.onload = () => {
      printWindow.focus();
      printWindow.print();
      // printWindow.close(); // Uncomment to auto-close after print dialog
    };
  };

  return (
    <DashboardLayout role="admin">
      <div className="animate-fadeIn">
        <PageTitle
          title="Reports & Analytics"
          subtitle="View and print detailed reports about your restaurant's performance"
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

        {/* Time Range Selector */}
        <div className="bg-white shadow-md rounded-xl mb-6 p-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center mb-4 sm:mb-0">
              <CalendarIcon className="h-5 w-5 text-amber-600 mr-2" />
              <h3 className="text-lg font-medium text-gray-900">Time Range</h3>
            </div>
            <div className="flex space-x-2">
              {["day", "week", "month", "year"].map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-4 py-2 text-sm font-medium rounded-md ${
                    timeRange === range
                      ? "bg-amber-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {range.charAt(0).toUpperCase() + range.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Sales Overview */}
        <div className="bg-white shadow-md rounded-xl overflow-hidden mb-6">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200 flex justify-between items-center">
            <div className="flex items-center">
              <CurrencyDollarIcon className="h-5 w-5 text-amber-600 mr-2" />
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Sales Overview
              </h3>
            </div>
            <button
              onClick={() => handlePrintReport("sales")}
              className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
            >
              <PrinterIcon className="-ml-0.5 mr-2 h-4 w-4" />
              Print
            </button>
          </div>
          <div className="p-6" ref={salesReportRef}>
            {isLoading ? (
              <div className="animate-pulse h-64 bg-gray-200 rounded"></div>
            ) : (
              <div className="h-64 bg-amber-50 rounded-lg flex items-center justify-center">
                <p className="text-gray-500">
                  Sales chart will be displayed here
                </p>
                {/* In a real app, you would integrate a chart library like Chart.js or Recharts */}
              </div>
            )}
            <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {isLoading
                ? Array(4)
                    .fill(0)
                    .map((_, index) => (
                      <div
                        key={index}
                        className="animate-pulse h-20 bg-gray-200 rounded"
                      ></div>
                    ))
                : salesData.map((item) => (
                    <div
                      key={item.name}
                      className="bg-white overflow-hidden shadow rounded-lg"
                    >
                      <div className="p-5">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 bg-amber-100 rounded-md p-3">
                            <item.icon
                              className="h-6 w-6 text-amber-600"
                              aria-hidden="true"
                            />
                          </div>
                          <div className="ml-5 w-0 flex-1">
                            <dl>
                              <dt className="text-sm font-medium text-gray-500 truncate">
                                {item.name}
                              </dt>
                              <dd>
                                <div className="text-lg font-medium text-gray-900">
                                  {item.value}
                                </div>
                              </dd>
                            </dl>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 mt-6">
          {/* Popular Items */}
          <div className="bg-white shadow-md rounded-xl overflow-hidden">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200 flex justify-between items-center">
              <div className="flex items-center">
                <QueueListIcon className="h-5 w-5 text-amber-600 mr-2" />
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Popular Items
                </h3>
              </div>
              <button
                onClick={() => handlePrintReport("items")}
                className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
              >
                <PrinterIcon className="-ml-0.5 mr-2 h-4 w-4" />
                Print
              </button>
            </div>
            <div className="px-4 py-3 sm:px-6" ref={itemsReportRef}>
              {isLoading ? (
                <div className="animate-pulse space-y-4">
                  {Array(5)
                    .fill(0)
                    .map((_, index) => (
                      <div
                        key={index}
                        className="h-12 bg-gray-200 rounded"
                      ></div>
                    ))}
                </div>
              ) : (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Item Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Orders
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {popularItems.map((item, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {item.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {item.category}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-amber-600 font-medium text-right">
                          {item.orders}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* Staff Performance */}
          <div className="bg-white shadow-md rounded-xl overflow-hidden">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200 flex justify-between items-center">
              <div className="flex items-center">
                <ChartBarIcon className="h-5 w-5 text-amber-600 mr-2" />
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Staff Performance
                </h3>
              </div>
              <button
                onClick={() => handlePrintReport("staff")}
                className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
              >
                <PrinterIcon className="-ml-0.5 mr-2 h-4 w-4" />
                Print
              </button>
            </div>
            <div className="px-4 py-3 sm:px-6" ref={staffReportRef}>
              {isLoading ? (
                <div className="animate-pulse space-y-4">
                  {Array(5)
                    .fill(0)
                    .map((_, index) => (
                      <div
                        key={index}
                        className="h-12 bg-gray-200 rounded"
                      ></div>
                    ))}
                </div>
              ) : (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Staff Member
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Orders
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Sales
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {staffPerformance.map((staff, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <img
                                className="h-10 w-10 rounded-full"
                                src={
                                  staff.avatar ||
                                  "/placeholder.svg?height=40&width=40"
                                }
                                alt=""
                              />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {staff.name}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {staff.role}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-amber-600 font-medium text-right">
                          {staff.ordersProcessed}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-amber-600 font-medium text-right">
                          ${staff.salesAmount}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
