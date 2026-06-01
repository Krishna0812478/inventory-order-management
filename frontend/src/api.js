import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const getStats = async () => {
  try {
    const [productsRes, customersRes, ordersRes] = await Promise.all([
      api.get('/products'),
      api.get('/customers'),
      api.get('/orders'),
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

export default api;