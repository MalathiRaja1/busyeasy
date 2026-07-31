import axios from "axios";

const API_URL = "https://localhost:7117/api";

const axiosInstance = axios.create({
  baseURL: API_URL,
});

axiosInstance.interceptors.request.use((config) => {
  const authData = localStorage.getItem('buyeasy_auth');
  if (authData) {
    const { token } = JSON.parse(authData);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export const getProducts = () => axiosInstance.get("/products");
export const getProductById = (id) => axiosInstance.get(`/products/${id}`);
export const createOrder = (data) => axiosInstance.post("/orders", data);
export const getMyOrders = () => axiosInstance.get("/orders");
export const getOrderById = (id) => axiosInstance.get(`/orders/${id}`);
export const createProduct = (data) => axiosInstance.post("/products", data);
export const updateProduct = (id, data) => axiosInstance.put(`/products/${id}`, data);
export const deleteProduct = (id) => axiosInstance.delete(`/products/${id}`);
export const getAllOrders = () => axiosInstance.get("/orders/all");
export const updateOrderStatus = (id, status) => axiosInstance.put(`/orders/${id}/status`, { status });
export const createRazorpayOrder = (amount) => axiosInstance.post("/payments/create-order", { amount });
export const verifyPayment = (data) => axiosInstance.post("/payments/verify", data);

export default axiosInstance;