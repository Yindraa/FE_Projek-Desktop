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
import { fetchReportsSummary, fetchReportsChartData } from "../../services/adminService";
import { UsersIcon } from "@heroicons/react/24/outline";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Label } from "recharts";

export default function Reports() {
  const [timeRange, setTimeRange] = useState("week");
  const [salesData, setSalesData] = useState([]);
  const [salesChartData, setSalesChartData] = useState([]); // for future chart
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
        // Fetch summary metrics and chart data from new endpoints
        const [summary, chart, items, staff] = await Promise.all([
          fetchReportsSummary(timeRange),
          fetchReportsChartData(timeRange),
          // fallback: use summary.popularItems if available, else fetch separately if needed
          // fallback: use summary.staffPerformance if available, else fetch separately if needed
        ]);
        const summaryData = summary?.summary || {};
        setSalesData([
          {
            name: "Total Sales",
            value: summaryData.totalSales ? `Rp${Number(summaryData.totalSales).toLocaleString("id-ID")}` : "-",
            icon: () => <CurrencyDollarIcon className="h-6 w-6 text-amber-600" aria-hidden="true" />,
          },
          {
            name: "Average Order",
            value: summaryData.averageOrder ? `Rp${Number(summaryData.averageOrder).toLocaleString("id-ID")}` : "-",
            icon: () => <ChartBarIcon className="h-6 w-6 text-amber-600" aria-hidden="true" />,
          },
          {
            name: "Orders",
            value: summaryData.orders ? summaryData.orders.toLocaleString("id-ID") : "-",
            icon: () => <QueueListIcon className="h-6 w-6 text-amber-600" aria-hidden="true" />,
          },
          {
            name: "Customers",
            value: summaryData.customers ? summaryData.customers.toLocaleString("id-ID") : "-",
            icon: () => <UsersIcon className="h-6 w-6 text-amber-600" aria-hidden="true" />,
          },
        ]);
        setPopularItems(summaryData.popularItems || []);
        setStaffPerformance(summaryData.staffPerformance || []);
        setSalesChartData(chart.chartData || []);
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
        title = "Sales Overview";
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
    const currentDate = new Date().toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const timeRangeText =
      timeRange.charAt(0).toUpperCase() + timeRange.slice(1);

    // Generate sales cards HTML for print
    let salesCardsHtml = "";
    if (reportType === "sales") {
      salesCardsHtml = `
        <div class="sales-metrics">
          ${salesData
            .map(
              (item) => `
            <div class="metric-card">
              <div class="metric-icon">${getIconForPrint(item.name)}</div>
              <div class="metric-content">
                <h3>${item.name}</h3>
                <p class="metric-value">${item.value}</p>
              </div>
            </div>
          `
            )
            .join("")}
        </div>
      `;
    }

    // Add content to the new window with improved styling
    printWindow.document.write(`
      <html>
        <head>
          <title>${title} - ${timeRangeText}</title>
          <style>
            @media print {
              @page {
                size: portrait;
                margin: 0.5in;
              }
            }
            
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              color: #333;
              line-height: 1.5;
              padding: 0;
              margin: 0;
              background: white;
            }
            
            .container {
              max-width: 100%;
              margin: 0 auto;
              padding: 20px;
            }
            
            .report-header {
              text-align: center;
              margin-bottom: 30px;
              padding-bottom: 15px;
              border-bottom: 2px solid #f59e0b;
            }
            
            .report-header h1 {
              margin: 0 0 5px 0;
              color: #b45309;
              font-size: 28px;
            }
            
            .report-header p {
              color: #666;
              margin: 5px 0;
              font-size: 16px;
            }
            
            .report-header .restaurant-name {
              font-size: 20px;
              font-weight: bold;
              margin-bottom: 5px;
            }
            
            .report-meta {
              display: flex;
              justify-content: space-between;
              margin-bottom: 20px;
              font-size: 14px;
              color: #666;
            }
            
            table {
              width: 100%;
              border-collapse: collapse;
              margin: 20px 0;
              font-size: 14px;
            }
            
            th, td {
              padding: 12px 15px;
              text-align: left;
              border-bottom: 1px solid #ddd;
            }
            
            th {
              background-color: #f8fafc;
              font-weight: 600;
              color: #4b5563;
              border-bottom: 2px solid #e5e7eb;
            }
            
            tr:nth-child(even) {
              background-color: #f9fafb;
            }
            
            tr:hover {
              background-color: #f3f4f6;
            }
            
            .text-right {
              text-align: right;
            }
            
            .print-footer {
              margin-top: 40px;
              text-align: center;
              font-size: 12px;
              color: #6b7280;
              border-top: 1px solid #e5e7eb;
              padding-top: 15px;
            }
            
            /* Sales metrics styling */
            .sales-metrics {
              display: flex;
              flex-wrap: wrap;
              gap: 20px;
              justify-content: space-between;
              margin: 20px 0;
            }
            
            .metric-card {
              flex: 1 1 200px;
              display: flex;
              align-items: center;
              padding: 15px;
              background-color: #fff;
              border: 1px solid #e5e7eb;
              border-radius: 8px;
              box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            }
            
            .metric-icon {
              width: 40px;
              height: 40px;
              display: flex;
              align-items: center;
              justify-content: center;
              background-color: #fef3c7;
              border-radius: 8px;
              margin-right: 15px;
              color: #b45309;
            }
            
            .metric-content h3 {
              margin: 0 0 5px 0;
              font-size: 14px;
              color: #6b7280;
            }
            
            .metric-value {
              margin: 0;
              font-size: 20px;
              font-weight: bold;
              color: #1f2937;
            }
            
            /* Chart placeholder */
            .chart-placeholder {
              height: 250px;
              background-color: #f9fafb;
              border: 1px dashed #d1d5db;
              border-radius: 8px;
              display: flex;
              align-items: center;
              justify-content: center;
              margin: 20px 0;
              color: #6b7280;
            }
            
            /* Staff table specific */
            .staff-table .staff-name {
              display: flex;
              align-items: center;
            }
            
            .staff-avatar {
              width: 30px;
              height: 30px;
              border-radius: 50%;
              margin-right: 10px;
              background-color: #f3f4f6;
            }
            
            .highlight {
              color: #b45309;
              font-weight: 600;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="report-header">
              <div class="restaurant-name">DineFlow Restaurant</div>
              <h1>${title}</h1>
              <p>Time Range: ${timeRangeText}</p>
            </div>
            
            <div class="report-meta">
              <div>Generated on: ${currentDate}</div>
              <div>Report ID: REP-${Math.floor(Math.random() * 10000)
                .toString()
                .padStart(4, "0")}</div>
            </div>
            
            ${
              reportType === "sales"
                ? `
              <div class="chart-placeholder">
                <p>Sales trend visualization would appear here</p>
              </div>
              ${salesCardsHtml}
            `
                : ""
            }
            
            ${contentToPrint.outerHTML}
            
            <div class="print-footer">
              <p>This report is generated automatically by DineFlow Restaurant Management System.</p>
              <p>© ${new Date().getFullYear()} DineFlow. All rights reserved.</p>
            </div>
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

  // Helper function to get icon HTML for print
  const getIconForPrint = (itemName) => {
    switch (itemName) {
      case "Total Sales":
        return '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="24" height="24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>';
      case "Average Order":
        return '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="24" height="24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>';
      case "Orders":
        return '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="24" height="24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>';
      case "Customers":
        return '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="24" height="24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>';
      default:
        return "";
    }
  };

  function formatRupiah(value) {
    if (typeof value !== "number") return value;
    if (value >= 1000000) return `Rp${(value / 1000000).toFixed(1)}Jt`;
    if (value >= 1000) return `Rp${(value / 1000).toFixed(0)}K`;
    return `Rp${value}`;
  }

  function CustomTooltip({ active, payload, label }) {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-amber-200 rounded-md px-3 py-2 shadow text-xs">
          <div className="font-semibold mb-1">{label}</div>
          <div>Pendapatan: <span className="text-amber-600 font-bold">{formatRupiah(payload[0]?.value)}</span></div>
          {payload[1] && <div>Order: <span className="text-blue-600 font-bold">{payload[1]?.value}</span></div>}
        </div>
      );
    }
    return null;
  }

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
                  className={`px-4 py-2 text-sm font-medium rounded-xl ${
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
              className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-xl text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
            >
              <PrinterIcon className="-ml-0.5 mr-2 h-4 w-4" />
              Print
            </button>
          </div>
          <div className="p-6" ref={salesReportRef}>
            {isLoading ? (
              <div className="animate-pulse h-64 bg-gray-200 rounded"></div>
            ) : (
              <div className="h-64 bg-amber-50 rounded-xl flex items-center justify-center">
                {salesChartData && salesChartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={220}>
                    <LineChart data={salesChartData} margin={{ top: 20, right: 40, left: 10, bottom: 10 }}>
                      <CartesianGrid strokeDasharray="4 4" stroke="#f3e8d2" />
                      <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                      <YAxis
                        yAxisId="left"
                        orientation="left"
                        tickFormatter={formatRupiah}
                        tick={{ fontSize: 12 }}
                        width={80}
                        axisLine={false}
                      >
                        <Label value="Pendapatan (Rp)" angle={-90} position="insideLeft" style={{ textAnchor: 'middle', fill: '#b45309', fontSize: 12 }} />
                      </YAxis>
                      <YAxis
                        yAxisId="right"
                        orientation="right"
                        tickFormatter={v => v}
                        tick={{ fontSize: 12 }}
                        width={40}
                        axisLine={false}
                      >
                        <Label value="Order" angle={90} position="insideRight" style={{ textAnchor: 'middle', fill: '#2563eb', fontSize: 12 }} />
                      </YAxis>
                      <Tooltip content={<CustomTooltip />} />
                      <Legend verticalAlign="top" height={36} />
                      <Line yAxisId="left" type="monotone" dataKey="revenue" name="Revenue" stroke="#f59e42" strokeWidth={2} dot={false} />
                      <Line yAxisId="right" type="monotone" dataKey="orders" name="Orders" stroke="#2563eb" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-gray-500">No sales data available.</p>
                )}
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
                      className="bg-white overflow-hidden shadow rounded-xl"
                    >
                      <div className="p-5">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 bg-amber-100 rounded-xl p-3">
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
      </div>
    </DashboardLayout>
  );
}
