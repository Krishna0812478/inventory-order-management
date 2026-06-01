import React, { useState, useEffect } from 'react';
import { getStats, getProducts } from '../api';
import './Dashboard.css';

function Dashboard() {
  const [stats, setStats] = useState({ products: 0, customers: 0, orders: 0, revenue: 0 });
  const [lowStockProducts, setLowStockProducts] = useState([]);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const statsData = await getStats();
        setStats(statsData);
        
        const productsData = await getProducts();
        const lowStock = productsData.filter(p => p.stock_quantity <= 5);
        setLowStockProducts(lowStock);
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      }
    }
    loadDashboardData();
  }, []);

  return (
    <div className="dashboard-container">
      <header className="page-header">
        <h1>Welcome Back, Krishna! 👋</h1>
        <p>Here's what's happening with your inventory today.</p>
      </header>

      <div className="dashboard-grid">
        <div className="stat-card">
          <div className="stat-icon stat-icon-product">📦</div>
          <div>
            <div className="stat-label">Total Products</div>
            <div className="stat-value">{stats.products}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon stat-icon-customer">👥</div>
          <div>
            <div className="stat-label">Total Customers</div>
            <div className="stat-value">{stats.customers}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon stat-icon-order">🛍️</div>
          <div>
            <div className="stat-label">Total Orders</div>
            <div className="stat-value">{stats.orders}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon stat-icon-revenue">💰</div>
          <div>
            <div className="stat-label">Total Revenue</div>
            <div className="stat-value">₹{stats.revenue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
          </div>
        </div>
      </div>

      <section className="data-card">
        <h2>⚠️ Low Stock Alerts</h2>
        {lowStockProducts.length === 0 ? (
          <div className="success-state">
            ✨ All products are sufficiently stocked!
          </div>
        ) : (
          <div className="table-responsive">
            <table className="inventory-table">
              <thead>
                <tr>
                  <th>Product Name</th>
                  <th>SKU</th>
                  <th>Price</th>
                  <th>Remaining Stock</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {lowStockProducts.map(product => (
                  <tr key={product.id}>
                    <td><span className="fw-semibold">{product.name}</span></td>
                    <td><code>{product.sku}</code></td>
                    <td>₹{product.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                    <td className="danger-text">{product.stock_quantity}</td>
                    <td>
                      <span className="badge badge-danger">
                        {product.stock_quantity === 0 ? 'Out of Stock' : 'Low Stock'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

export default Dashboard;