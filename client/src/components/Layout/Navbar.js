import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Logo from './Logo';
import './Navbar.css';

function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();

  if (!user) return null;

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/dashboard" className="navbar-brand">
          <Logo size="medium" showText={true} />
        </Link>
        <div className="navbar-links">
          <Link
            to="/dashboard"
            className={location.pathname === '/dashboard' ? 'active' : ''}
          >
            Dashboard
          </Link>
          <Link
            to="/friends"
            className={location.pathname === '/friends' ? 'active' : ''}
          >
            Friends
          </Link>
          <Link
            to="/leaderboard"
            className={location.pathname === '/leaderboard' ? 'active' : ''}
          >
            Leaderboard
          </Link>
          <div className="navbar-user">
            <span>{user.username}</span>
            <button onClick={logout} className="btn-logout">
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

