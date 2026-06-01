import React, { useState, useEffect } from 'react';
import { getStats, getProducts } from '../api';

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

  const styles = {
    container: { padding: '2.5rem 2rem', maxWidth: '1280px', margin: '0 auto', fontFamily: 'system-ui, sans-serif' },
    welcome: { fontSize: '2rem', fontWeight: '700', color: '#0f172a', letterSpacing: '-0.025em' },
    sub: { color: '#64748b', marginTop: '0.25rem', marginBottom: '2.5rem', fontSize: '1rem' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '3rem' },
    card: { background: '#fff', padding: '1.75rem', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '1.25rem', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(15,23,42,0.05)' },
    iconBox: { width: '52px', height: '52px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyEncoding: 'center', fontSize: '1.5rem', flexShrink: 0, justifyContent: 'center' },
    label: { fontSize: '0.8rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' },
    value: { fontSize: '1.75rem', fontWeight: '700', color: '#0f172a', marginTop: '0.25rem', letterSpacing: '-0.02em' },
    tableCard: { background: '#fff', padding: '2rem', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' },
    tableHeader: { fontSize: '1.25rem', fontWeight: '700', color: '#0f172a', marginBottom: '1.25rem' },
    table: { width: '100%', borderCollapse: 'collapse', textAlign: 'left' },
    th: { background: '#f8fafc', padding: '1rem', fontSize: '0.75rem', fontWeight: '700', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid #e2e8f0' },
    td: { padding: '1.25rem', borderBottom: '1px solid #e2e8f0', fontSize: '0.95rem', color: '#334155', verticalAlign: 'middle' }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.welcome}>Welcome Back, Krishna! 👋</h1>
      <p style={styles.sub}>Here's what's happening with your inventory today.</p>

      <div style={styles.grid}>
        <div style={styles.card}>
          <div style={{ ...styles.iconBox, background: '#e0e7ff', color: '#4f46e5' }}>📦</div>
          <div>
            <div style={styles.label}>Total Products</div>
            <div style={styles.value}>{stats.products}</div>
          </div>
        </div>
        <div style={styles.card}>
          <div style={{ ...styles.iconBox, background: '#ecfdf5', color: '#10b981' }}>👥</div>
          <div>
            <div style={styles.label}>Total Customers</div>
            <div style={styles.value}>{stats.customers}</div>
          </div>
        </div>
        <div style={styles.card}>
          <div style={{ ...styles.iconBox, background: '#fef3c7', color: '#f59e0b' }}>🛍️</div>
          <div>
            <div style={styles.label}>Total Orders</div>
            <div style={styles.value}>{stats.orders}</div>
          </div>
        </div>
        <div style={styles.card}>
          <div style={{ ...styles.iconBox, background: '#dcfce7', color: '#15803d' }}>💰</div>
          <div>
            <div style={styles.label}>Total Revenue</div>
            <div style={styles.value}>₹{stats.revenue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
          </div>
        </div>
      </div>

      <div style={styles.tableCard}>
        <h2 style={styles.tableHeader}>⚠️ Low Stock Alerts</h2>
        {lowStockProducts.length === 0 ? (
          <div style={{ padding: '1.25rem', background: '#ecfdf5', color: '#065f46', borderRadius: '12px', fontWeight: '500', fontSize: '0.95rem', border: '1px solid #a7f3d0' }}>
            ✨ All products are sufficiently stocked!
          </div>
        ) : (
          <div style={{ overflowX: 'auto', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Product Name</th>
                  <th style={styles.th}>SKU</th>
                  <th style={styles.th}>Price</th>
                  <th style={styles.th}>Remaining Stock</th>
                  <th style={styles.th}>Status</th>
                </tr>
              </thead>
              <tbody>
                {lowStockProducts.map(product => (
                  <tr key={product.id}>
                    <td style={styles.td}><span style={{fontWeight: '600'}}>{product.name}</span></td>
                    <td style={styles.td}><code style={{ background: '#f1f5f9', padding: '0.25rem 0.5rem', borderRadius: '6px', color: '#be185d', fontWeight: '600', fontFamily: 'monospace' }}>{product.sku}</code></td>
                    <td style={styles.td}>₹{product.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                    <td style={{ ...styles.td, color: '#ef4444', fontWeight: '700' }}>{product.stock_quantity}</td>
                    <td style={styles.td}>
                      <span style={{ padding: '0.25rem 0.75rem', background: '#fee2e2', color: '#991b1b', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: '700' }}>
                        {product.stock_quantity === 0 ? 'Out of Stock' : 'Low Stock'}
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
  );
}

export default Dashboard;