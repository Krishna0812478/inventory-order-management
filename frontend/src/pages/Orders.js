import React, { useState, useEffect } from 'react';
import { getOrders, createOrder, deleteOrder, getCustomers, getProducts } from '../api';
import './Orders.css';

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

  return (
    <div className="orders-container">
      <header className="page-header">
        <h1>🛍️ Order Management</h1>
        <p>Punch new transactions, handle stock deductions, and manage invoice records.</p>
      </header>

      {errorMsg && (
        <div className="ui-alert alert-danger">
          ❌ {errorMsg}
        </div>
      )}

      <div className="orders-grid">
        <div className="form-section-card">
          <h2>➕ Punch New Order</h2>
          <form onSubmit={handleSubmit} className="custom-form">
            <div className="form-group">
              <label>Select Customer</label>
              <select value={formData.customer_id} onChange={e => setFormData({ ...formData, customer_id: e.target.value })} required className="custom-select">
                <option value="">-- Choose Customer --</option>
                {customers.map(c => <option key={c.id} value={c.id}>{c.name} ({c.email})</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Select Product</label>
              <select value={formData.product_id} onChange={e => setFormData({ ...formData, product_id: e.target.value })} required className="custom-select">
                <option value="">-- Choose Product --</option>
                {products.map(p => <option key={p.id} value={p.id}>{p.name} - ₹{p.price} (Stock: {p.stock_quantity})</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Order Quantity</label>
              <input type="number" min="1" value={formData.quantity} onChange={e => setFormData({ ...formData, quantity: e.target.value })} required />
            </div>
            <button type="submit" className="btn btn-primary">Place Active Order</button>
          </form>
        </div>

        <div className="list-section-card">
          <h2>📜 Order History Ledger</h2>
          <div className="table-responsive">
            <table className="orders-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer ID</th>
                  <th>Total Bill</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order.id}>
                    <td>#{order.id}</td>
                    <td><span className="fw-medium">Customer Ref: {order.customer_id}</span></td>
                    <td className="success-text">₹{order.total_amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                    <td>
                      <span className="badge badge-success">PAID</span>
                    </td>
                    <td>
                      <button onClick={() => handleDelete(order.id)} className="btn-action btn-delete">Cancel</button>
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