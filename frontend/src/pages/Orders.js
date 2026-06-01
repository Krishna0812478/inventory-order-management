import React, { useState, useEffect } from 'react';
import { getOrders, createOrder, deleteOrder, getCustomers, getProducts } from '../api';

function Orders() {
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({ customer_id: '', product_id: '', quantity: '1' });
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const [ordersData, customersData, productsData] = await Promise.all([
        getOrders(),
        getCustomers(),
        getProducts()
      ]);
      setOrders(ordersData);
      setCustomers(customersData);
      setProducts(productsData);
    } catch (err) {
      console.error("Error fetching ledger data:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      await createOrder({
        customer_id: parseInt(formData.customer_id),
        product_id: parseInt(formData.product_id),
        quantity: parseInt(formData.quantity)
      });
      setFormData({ customer_id: '', product_id: '', quantity: '1' });
      fetchInitialData();
    } catch (error) {
      setErrorMsg(error.response?.data?.detail || 'Failed to place order. Check product inventory stock!');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Cancel and delete this transaction record?')) {
      await deleteOrder(id);
      fetchInitialData();
    }
  };

  const styles = {
    container: { padding: '2.5rem 2rem', maxWidth: '1280px', margin: '0 auto', fontFamily: 'system-ui, sans-serif' },
    title: { fontSize: '2rem', fontWeight: '700', color: '#0f172a', letterSpacing: '-0.03em' },
    sub: { color: '#64748b', marginTop: '0.25rem', marginBottom: '2.5rem' },
    layout: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '2rem', alignItems: 'start' },
    formCard: { background: '#fff', padding: '2rem', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' },
    listCard: { background: '#fff', padding: '2rem', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' },
    formGroup: { display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.25rem' },
    select: { width: '100%', padding: '0.75rem 0.85rem', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.95rem', background: '#fff' },
    input: { width: '100%', padding: '0.75rem 0.85rem', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.95rem' },
    btn: { width: '100%', padding: '0.8rem', background: '#4f46e5', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: '600', cursor: 'pointer', fontSize: '0.95rem' },
    table: { width: '100%', borderCollapse: 'collapse', textAlign: 'left' },
    th: { background: '#f8fafc', padding: '1rem', fontSize: '0.75rem', fontWeight: '700', color: '#475569', textTransform: 'uppercase', borderBottom: '1px solid #e2e8f0' },
    td: { padding: '1.25rem', borderBottom: '1px solid #e2e8f0', fontSize: '0.95rem', color: '#334155', verticalAlign: 'middle' }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>🛍️ Order Management</h1>
      <p style={styles.sub}>Punch new transactions, handle stock deductions, and manage invoice records.</p>

      {errorMsg && (
        <div style={{ padding: '1rem', background: '#fee2e2', color: '#991b1b', borderRadius: '12px', marginBottom: '1.5rem', fontWeight: '600', border: '1px solid #fca5a5' }}>
          ❌ {errorMsg}
        </div>
      )}

      <div style={styles.layout}>
        <div style={styles.formCard}>
          <h3 style={{ marginBottom: '1.5rem', fontWeight: '700', color: '#0f172a' }}>➕ Punch New Order</h3>
          <form onSubmit={handleSubmit}>
            <div style={styles.formGroup}>
              <label style={{ fontSize: '0.85rem', fontWeight: '600', color: '#475569' }}>Select Customer</label>
              <select value={formData.customer_id} onChange={e => setFormData({ ...formData, customer_id: e.target.value })} required style={styles.select}>
                <option value="">-- Choose Customer --</option>
                {customers.map(c => <option key={c.id} value={c.id}>{c.name} ({c.email})</option>)}
              </select>
            </div>
            <div style={styles.formGroup}>
              <label style={{ fontSize: '0.85rem', fontWeight: '600', color: '#475569' }}>Select Product</label>
              <select value={formData.product_id} onChange={e => setFormData({ ...formData, product_id: e.target.value })} required style={styles.select}>
                <option value="">-- Choose Product --</option>
                {products.map(p => <option key={p.id} value={p.id}>{p.name} - ₹{p.price} (Stock: {p.stock_quantity})</option>)}
              </select>
            </div>
            <div style={styles.formGroup}>
              <label style={{ fontSize: '0.85rem', fontWeight: '600', color: '#475569' }}>Order Quantity</label>
              <input type="number" min="1" value={formData.quantity} onChange={e => setFormData({ ...formData, quantity: e.target.value })} required style={styles.input} />
            </div>
            <button type="submit" style={styles.btn}>Place Active Order</button>
          </form>
        </div>

        <div style={styles.listCard}>
          <h3 style={{ marginBottom: '1.5rem', fontWeight: '700', color: '#0f172a' }}>📜 Order History Ledger</h3>
          <div style={{ overflowX: 'auto', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Order ID</th>
                  <th style={styles.th}>Customer ID</th>
                  <th style={styles.th}>Total Bill</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order.id}>
                    <td style={styles.td}>#{order.id}</td>
                    <td style={styles.td}><span style={{fontWeight: '500'}}>Customer Ref: {order.customer_id}</span></td>
                    <td style={{ ...styles.td, fontWeight: '700', color: '#16a34a' }}>₹{order.total_amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                    <td style={styles.td}>
                      <span style={{ padding: '0.25rem 0.6rem', background: '#d1fae5', color: '#065f46', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: '700' }}>PAID</span>
                    </td>
                    <td style={styles.td}>
                      <button onClick={() => handleDelete(order.id)} style={{ background: '#fef2f2', color: '#ef4444', border: 'none', padding: '0.45rem 0.75rem', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '0.85rem' }}>Cancel</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Orders;