import React, { useState, useEffect, useCallback } from 'react';
import { getCustomers, createCustomer, deleteCustomer } from '../api';
import './Customers.css';

function Customers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Form State
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
  const [uiMessage, setUiMessage] = useState({ text: '', type: '' });

  // useCallback use kiya taaki useEffect mein error na aaye
  const fetchCustomersList = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getCustomers();
      setCustomers(Array.isArray(data) ? data : []);
    } catch (error) {
      showNotification('Error fetching customers directory!', 'danger');
    } finally {
      setLoading(false);
    }
  }, []); // dependencies empty hain kyunki ye sirf mount par chalega

  useEffect(() => {
    fetchCustomersList();
  }, [fetchCustomersList]); // Ab yahan error nahi aayegi

  const showNotification = (text, type) => {
    setUiMessage({ text, type });
    setTimeout(() => setUiMessage({ text: '', type: '' }), 4000);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.phone) {
      showNotification('All fields are required to register a customer!', 'danger');
      return;
    }

    try {
      await createCustomer(formData);
      showNotification('Customer registered successfully! 👥✨', 'success');
      setFormData({ name: '', email: '', phone: '' });
      fetchCustomersList();
    } catch (error) {
      const errorMsg = error.response?.data?.detail || 'Failed to add customer. Make sure Email is unique!';
      showNotification(errorMsg, 'danger');
    }
  };

  const handleDeleteClick = async (id) => {
    if (window.confirm('Are you sure you want to remove this customer profile?')) {
      try {
        await deleteCustomer(id);
        showNotification('Customer deleted successfully! 🗑️', 'success');
        fetchCustomersList();
      } catch (error) {
        showNotification('Cannot delete customer. They might have active orders!', 'danger');
      }
    }
  };

  return (
    <div className="customers-container">
      {/* ... (Baki ka JSX waisa ka waisa hi rehne do, wo bilkul sahi hai) ... */}
      <div className="customers-header page-header">
        <h1>👥 Customer Directory</h1>
        <p>Manage customer profiles, contact records, and track accounts registered in the system.</p>
      </div>

      {uiMessage.text && (
        <div className={`ui-alert alert-${uiMessage.type}`}>
          {uiMessage.text}
        </div>
      )}

      <div className="customers-grid">
        <div className="form-section-card">
          <h2>➕ Add New Customer</h2>
          <form onSubmit={handleSubmit} className="custom-form">
            <div className="form-group">
              <label>Full Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="e.g. Krishna Gupta" />
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="e.g. krishna@example.com" />
            </div>
            <div className="form-group">
              <label>Phone Number</label>
              <input type="text" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="e.g. 9876543210" />
            </div>
            <button type="submit" className="btn btn-primary">Register Customer</button>
          </form>
        </div>

        <div className="list-section-card">
          <h2>📋 Registered Profiles</h2>
          {loading ? (
            <div className="table-loading">Loading database records...</div>
          ) : customers.length === 0 ? (
            <div className="empty-state">No customers registered yet. Create one on the left!</div>
          ) : (
            <div className="table-responsive">
              <table className="customers-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map((customer) => (
                    <tr key={customer.id}>
                      <td>{customer.id}</td>
                      <td className="fw-medium">{customer.name}</td>
                      <td>{customer.email}</td>
                      <td><code>{customer.phone}</code></td>
                      <td>
                        <button className="btn-action btn-delete" onClick={() => handleDeleteClick(customer.id)}>
                          🗑️ Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Customers;