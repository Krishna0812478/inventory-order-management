import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  const location = useLocation();

  const getLinkClassName = (path) =>
    location.pathname === path ? 'navbar-link active' : 'navbar-link';

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand" aria-label="Inventory Manager dashboard">
        <span className="navbar-logo">📦</span>
        <span className="navbar-title">Inventory Manager</span>
      </Link>
      <div className="navbar-links">
        <Link to="/" className={getLinkClassName('/')} aria-current={location.pathname === '/' ? 'page' : undefined}>Dashboard</Link>
        <Link to="/products" className={getLinkClassName('/products')} aria-current={location.pathname === '/products' ? 'page' : undefined}>Products</Link>
        <Link to="/customers" className={getLinkClassName('/customers')} aria-current={location.pathname === '/customers' ? 'page' : undefined}>Customers</Link>
        <Link to="/orders" className={getLinkClassName('/orders')} aria-current={location.pathname === '/orders' ? 'page' : undefined}>Orders</Link>
      </div>
    </nav>
  );
}

export default Navbar;