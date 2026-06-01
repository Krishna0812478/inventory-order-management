import React, { useState, useEffect } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Customers from './pages/Customers';
import Orders from './pages/Orders';

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');

  return (
    <div className="App">
      <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <div className="container">
        {currentPage === 'dashboard' && <Dashboard />}
        {currentPage === 'products' && <Products />}
        {currentPage === 'customers' && <Customers />}
        {currentPage === 'orders' && <Orders />}
      </div>
    </div>
  );
}

export default App;