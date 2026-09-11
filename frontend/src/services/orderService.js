import api from "./api";

export const createOrder = async (orderData) => {
  const response = await api.post("/api/orders", orderData);

  return response.data;
};

export const getMyOrders = async () => {
  const response = await api.get("/api/orders/my");

  return response.data;
};

export const getOrderById = async (orderId) => {
  const response = await api.get(`/api/orders/${orderId}`);

  return response.data;
};

export const getOrderHistory = async (orderId) => {
  const response = await api.get(`/api/orders/${orderId}/history`);

  return response.data;
};

export const updateOrderStatus = async (orderId, status) => {
  const response = await api.patch(
    `/api/orders/${orderId}/status`,
    { status }
  );

  return response.data;
};

export const confirmPickup = async (orderId) => {
  const response = await api.put(
    `/api/orders/${orderId}/pickup`
  );

  return response.data;
};