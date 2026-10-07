import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Flame, LayoutDashboard, UserPlus, Home } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <div className="brand-icon">
            <Flame size={24} color="#ef4444" />
          </div>
          <div className="brand-text">
            <span className="brand-title">TAMIL NADU MARATHON 2026</span>
            <span className="brand-subtitle">STATE LEVEL REGISTRATION</span>
          </div>
        </Link>

        <div className="navbar-links">
          <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>
            <Home size={18} />
            <span>Home</span>
          </Link>

          <Link to="/register" className={`nav-link ${isActive('/register') ? 'active' : ''}`}>
            <UserPlus size={18} />
            <span>Register</span>
          </Link>

          <Link to="/admin" className={`nav-link nav-link-admin ${isActive('/admin') ? 'active' : ''}`}>
            <LayoutDashboard size={18} />
            <span>Admin Dashboard</span>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
