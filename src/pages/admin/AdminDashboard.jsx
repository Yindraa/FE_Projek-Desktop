"use client";

import { useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import PageTitle from "../../components/common/PageTitle";
import {
  QueueListIcon,
  ClipboardDocumentListIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";
import { useEffect } from "react";
import { CurrencyDollarIcon, UsersIcon } from "@heroicons/react/24/outline";
import { fetchDashboardStats, fetchSalesChartData, fetchPopularMenuItemsWidget, fetchMenuAnalytics } from "../../services/adminService";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Label } from "recharts";

function formatRupiah(value) {
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
        <div>Order: <span className="text-blue-600 font-bold">{payload[1]?.value}</span></div>
      </div>
    );
  }
  return null;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [popularItems, setPopularItems] = useState([]);
  const [salesChart, setSalesChart] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setIsLoading(true);
        // Fetch from real API
        const data = await fetchDashboardStats();
        setStats([
          {
            name: "Total Revenue",
            stat: `$${data.totalRevenue.toLocaleString()}`,
            icon: () => (
              <CurrencyDollarIcon className="h-6 w-6" aria-hidden="true" />
            ),
            change: "", // You can add logic for change if available
            changeType: "neutral",
          },
          {
            name: "Total Orders",
            stat: data.totalOrders.toLocaleString(),
            icon: () => (
              <ClipboardDocumentListIcon className="h-6 w-6" aria-hidden="true" />
            ),
            change: "",
            changeType: "neutral",
          },
          {
            name: "Active Tables",
            stat: `${data.activeTables}/${data.totalTables}`,
            icon: () => (
              <QueueListIcon className="h-6 w-6" aria-hidden="true" />
            ),
            change: "",
            changeType: "neutral",
          },
          {
            name: "Staff Members",
            stat: data.staffMembers.toString(),
            icon: () => <UsersIcon className="h-6 w-6" aria-hidden="true" />,
            change: "",
            changeType: "neutral",
          }
        ]);
        setRecentOrders(
          (data.recentOrders || []).map((order) => ({
            id: order.id,
            table: `Table ${order.table?.tableNumber ?? "-"}`,
            amount: `$${order.totalAmount?.toFixed(2) ?? "0.00"}`,
            status:
              order.status === "COMPLETED"
                ? "Completed"
                : order.status.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
          }))
        );
        // Fetch popular menu items widget
        const popularMenuItems = await fetchPopularMenuItemsWidget(5);
        setPopularItems(
          (popularMenuItems || []).map(item => ({
            name: item.name,
            category: item.category,
            orders: item.totalOrders || item.orderCount || 0,
            imageUrl: item.imageUrl
          }))
        );
        // Fetch sales chart data
        const salesData = await fetchSalesChartData(7);
        setSalesChart(salesData || []);
        setError(null);
      } catch (err) {
        console.error("Error loading dashboard data:", err);
        setError("Failed to load dashboard data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  return (
    <DashboardLayout role="admin">
      <div className="animate-fadeIn md:pl-0 pl-0">
        <PageTitle
          title="Admin Dashboard"
          subtitle="Overview of your restaurant's performance and recent activity"
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

        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          {isLoading
            ? // Skeleton loaders for stats
              Array(4)
                .fill(0)
                .map((_, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-xl shadow-md p-6 animate-pulse"
                  >
                    <div className="flex items-center">
                      <div className="rounded-md bg-amber-200 h-12 w-12"></div>
                      <div className="ml-5 w-full">
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="h-6 bg-gray-300 rounded w-1/2"></div>
                      </div>
                    </div>
                    <div className="mt-4 h-4 bg-gray-200 rounded w-full"></div>
                  </div>
                ))
            : stats.map((item) => (
                <div
                  key={item.name}
                  className="bg-white overflow-hidden shadow-md rounded-xl transition-all duration-200 hover:shadow-lg"
                >
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 bg-amber-600 rounded-xl p-3">
                        <item.icon
                          className="h-6 w-6 text-white"
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
                              {item.stat}
                            </div>
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
        </div>

        {/* Charts Section */}
        <div className="mb-8">
          <div className="bg-white shadow-md rounded-xl overflow-hidden">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
                <ChartBarIcon className="h-5 w-5 mr-2 text-amber-600" />
                Sales Overview
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Last 7 days sales performance
              </p>
            </div>
            <div className="p-6">
              {isLoading ? (
                <div className="animate-pulse h-64 bg-gray-200 rounded"></div>
              ) : (
                <div className="h-64 bg-amber-50 rounded-xl flex items-center justify-center">
                  {salesChart && salesChart.length > 0 ? (
                    <ResponsiveContainer width="100%" height={220}>
                      <LineChart data={salesChart} margin={{ top: 20, right: 40, left: 10, bottom: 10 }}>
                        <CartesianGrid strokeDasharray="4 4" stroke="#f3e8d2" />
                        <XAxis dataKey="day" tick={{ fontSize: 12 }} />
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
                          <Label value="Jumlah Order" angle={90} position="insideRight" style={{ textAnchor: 'middle', fill: '#2563eb', fontSize: 12 }} />
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
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Recent Orders */}
          <div className="bg-white shadow-md rounded-xl overflow-hidden">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
                <ClipboardDocumentListIcon className="h-5 w-5 mr-2 text-amber-600" />
                Recent Orders
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
                        className="h-16 bg-gray-200 rounded"
                      ></div>
                    ))}
                </div>
              ) : (
                <div className="overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Order ID
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Table
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Amount
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
                      {recentOrders.map((order) => (
                        <tr key={order.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-amber-700">
                            {order.id}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {order.table}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {order.amount}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <span
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                order.status === "Completed"
                                  ? "bg-green-100 text-green-800"
                                  : order.status === "In Progress"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {order.status}
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

          {/* Popular Menu Items */}
          <div className="bg-white shadow-md rounded-xl overflow-hidden">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
                <QueueListIcon className="h-5 w-5 mr-2 text-amber-600" />
                Popular Menu Items
              </h3>
            </div>
            <div className="px-4 py-3 sm:px-6">
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
                <ul className="divide-y divide-gray-200">
                  {popularItems.map((item, index) => (
                    <li
                      key={index}
                      className="py-3 flex justify-between items-center hover:bg-gray-50 px-2 rounded-md"
                    >
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {item.name}
                        </p>
                        <p className="text-sm text-gray-500">{item.category}</p>
                      </div>
                      <div className="text-sm text-amber-600 font-medium">
                        {item.orders} orders
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
