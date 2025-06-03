import { authAxios } from "./authService";

const API_URL = import.meta.env.VITE_API_URL;

export async function getOrdersForChef() {
  const response = await authAxios.get(`${API_URL}/chef/orders`);
  return response.data;
}

export async function updateOrderStatusChef(orderId, status) {
  const response = await authAxios.patch(`/chef/order/${orderId}/status`, { status });
  return response.data;
}