import React, { useState, useEffect } from 'react';
import { getProducts, createProduct, deleteProduct } from '../api';
import './Products.css';

function Products() {
  const [products, setProducts] = useState([]);
  // Yahan form state mein bhi 'quantity' use kar rahe hain
  const [formData, setFormData] = useState({ name: '', sku: '', price: '', quantity: '' });

  useEffect(() => { fetchProductsList(); }, []);

  const fetchProductsList = async () => {
    try {
      const data = await getProducts();
      console.log("Backend se aaya data:", data); 
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Data fetch error:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createProduct({
      name: formData.name,
      sku: formData.sku,
      price: parseFloat(formData.price),
      quantity: parseInt(formData.quantity) // Backend 'quantity' maang raha hai
    });
    setFormData({ name: '', sku: '', price: '', quantity: '' });
    fetchProductsList();
  };

  return (
    <div className="products-container">
      <div className="products-header page-header">
        <h1>📦 Product Management</h1>
        <p>Add, update, view, or remove products from your central inventory database.</p>
      </div>

      <div className="products-grid">
        <div className="form-section-card">
          <h2>➕ Add New Product</h2>
          <form onSubmit={handleSubmit} className="custom-form">
            <div className="form-group">
              <label>Product Name</label>
              <input type="text" placeholder="e.g. Test Laptop" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
            </div>
            <div className="form-group">
              <label>Unique SKU Code</label>
              <input type="text" placeholder="e.g. LAP-DEL-001" value={formData.sku} onChange={e => setFormData({ ...formData, sku: e.target.value })} required />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Price (₹)</label>
                <input type="number" placeholder="75000" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Stock Qty</label>
                {/* Yahan 'quantity' key use kar rahe hain */}
                <input type="number" placeholder="50" value={formData.quantity} onChange={e => setFormData({ ...formData, quantity: e.target.value })} required />
              </div>
            </div>
            <button type="submit" className="btn btn-primary">Save Product</button>
          </form>
        </div>

        <div className="list-section-card">
          <h2>📋 Product Inventory List</h2>
          <div className="table-responsive">
            <table className="products-table">
              <thead>
                <tr>
                  <th>ID</th><th>Name</th><th>SKU</th><th>Price</th><th>In Stock</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map(p => {
                  // Ab 'p.quantity' ko display karenge
                  const stockValue = p.quantity ?? 0;
                  
                  return (
                    <tr key={p.id}>
                      <td>{p.id}</td>
                      <td>{p.name}</td>
                      <td><code>{p.sku}</code></td>
                      <td>₹{parseFloat(p.price || 0).toFixed(2)}</td>
                      <td className={stockValue === 0 ? 'danger-text' : 'fw-semibold'}>
                        {stockValue}
                      </td>
                      <td>
                        <button onClick={() => deleteProduct(p.id).then(fetchProductsList)} className="btn-action btn-delete">Delete</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Products;