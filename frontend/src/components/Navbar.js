import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function Navbar() {
  const location = useLocation();
  
  const styles = {
    nav: { background: '#0f172a', padding: '0.75rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontFamily: 'system-ui, sans-serif', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' },
    logoContainer: { display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' },
    logoText: { color: '#fff', fontSize: '1.25rem', fontWeight: '700', letterSpacing: '-0.02em' },
    links: { display: 'flex', gap: '0.5rem' },
    link: { padding: '0.5rem 1rem', borderRadius: '8px', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '600', transition: 'all 0.2s' }
  };

  const getLinkStyle = (path) => ({
    ...styles.link,
    background: location.pathname === path ? '#3b82f6' : 'transparent',
    color: location.pathname === path ? '#fff' : '#94a3b8',
  });

  return (
    <nav style={styles.nav}>
      <Link to="/" style={styles.logoContainer}>
        <span style={{fontSize: '1.4rem'}}>📦</span>
        <span style={styles.logoText}>Inventory Manager</span>
      </Link>
      <div style={styles.links}>
        <Link to="/" style={getLinkStyle('/')}>Dashboard</Link>
        <Link to="/products" style={getLinkStyle('/products')}>Products</Link>
        <Link to="/customers" style={getLinkStyle('/customers')}>Customers</Link>
        <Link to="/orders" style={getLinkStyle('/orders')}>Orders</Link>
      </div>
    </nav>
  );
}

export default Navbar;