import React from 'react';
import './Navbar.css';

function Navbar({ currentPage, setCurrentPage }) {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <h1 className="navbar-title">📦 Inventory Manager</h1>
        <ul className="navbar-menu">
          <li>
            <button
              className={currentPage === 'dashboard' ? 'active' : ''}
              onClick={() => setCurrentPage('dashboard')}
            >
              Dashboard
            </button>
          </li>
          <li>
            <button
              className={currentPage === 'products' ? 'active' : ''}
              onClick={() => setCurrentPage('products')}
            >
              Products
            </button>
          </li>
          <li>
            <button
              className={currentPage === 'customers' ? 'active' : ''}
              onClick={() => setCurrentPage('customers')}
            >
              Customers
            </button>
          </li>
          <li>
            <button
              className={currentPage === 'orders' ? 'active' : ''}
              onClick={() => setCurrentPage('orders')}
            >
              Orders
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;