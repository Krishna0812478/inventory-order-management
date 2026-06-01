import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// ==================== DASHBOARD STATS ====================
export const getStats = async () => {
  try {
    const [productsRes, customersRes, ordersRes] = await Promise.all([
      api.get('/products/'),
      api.get('/customers/'),
      api.get('/orders/'),
    ]);

    let totalRevenue = 0;
    if (ordersRes.data && Array.isArray(ordersRes.data)) {
      totalRevenue = ordersRes.data.reduce((sum, order) => sum + (order.total_amount || 0), 0);
    }

    return {
      products: productsRes.data?.length || 0,
      customers: customersRes.data?.length || 0,
      orders: ordersRes.data?.length || 0,
      revenue: totalRevenue,
    };
  } catch (error) {
    console.error('Error fetching stats:', error);
    return { products: 0, customers: 0, orders: 0, revenue: 0 };
  }
};

// ==================== PRODUCTS API ====================
export const getProducts = async () => {
  const response = await api.get('/products/');
  return response.data;
};

export const createProduct = async (productData) => {
  const response = await api.post('/products/', productData);
  return response.data;
};

export const updateProduct = async (productId, productData) => {
  const response = await api.put(`/products/${productId}`, productData);
  return response.data;
};

export const deleteProduct = async (productId) => {
  const response = await api.delete(`/products/${productId}`);
  return response.data;
};

// ==================== CUSTOMERS API ====================
export const getCustomers = async () => {
  const response = await api.get('/customers/');
  return response.data;
};

export const createCustomer = async (customerData) => {
  const response = await api.post('/customers/', customerData);
  return response.data;
};

export const deleteCustomer = async (customerId) => {
  const response = await api.delete(`/customers/${customerId}`);
  return response.data;
};

// ==================== ORDERS API ====================
export const getOrders = async () => {
  const response = await api.get('/orders/');
  return response.data;
};

export const createOrder = async (orderData) => {
  const response = await api.post('/orders/', orderData);
  return response.data;
};

export const deleteOrder = async (orderId) => {
  const response = await api.delete(`/orders/${orderId}`);
  return response.data;
};

export default api;