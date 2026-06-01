import React, { useState, useEffect } from 'react';
import { getStats } from '../api';
import './Dashboard.css';

function Dashboard() {
  const [stats, setStats] = useState({ products: 0, customers: 0, orders: 0, revenue: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const data = await getStats();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Products</h3>
          <p className="stat-value">{stats.products}</p>
        </div>
        <div className="stat-card">
          <h3>Total Customers</h3>
          <p className="stat-value">{stats.customers}</p>
        </div>
        <div className="stat-card">
          <h3>Total Orders</h3>
          <p className="stat-value">{stats.orders}</p>
        </div>
        <div className="stat-card">
          <h3>Total Revenue</h3>
          <p className="stat-value">₹{stats.revenue?.toFixed(2) || 0}</p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;