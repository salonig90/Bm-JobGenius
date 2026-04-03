import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import Logo from './Logo'

const Navbar = ({ isAuthenticated, onLogout, onLoginClick, onSignupClick, onDashboardClick, onLogoClick }) => {
  const location = useLocation();

  return (
    <nav className="navbar animate-fade-in">
      <div className="navbar-content">
        <div className="navbar-left">
          <Link to="/" className="nav-logo-container" style={{ textDecoration: 'none' }}>
            <Logo size={40} className="nav-logo" />
            <span className="nav-brand-name">JobGenius</span>
          </Link>
        </div>

        <div className="navbar-center">
          <ul className="nav-links">
            <li>
              <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>
                Home
              </Link>
            </li>
            <li>
              <Link to="/upload" className={`nav-link ${location.pathname === '/upload' ? 'active' : ''}`}>
                Upload Resume
              </Link>
            </li>
            <li>
              <Link to="/dashboard" className={`nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`}>
                Dashboard
              </Link>
            </li>
            <li>
              <Link to="/ai-suggest" className={`nav-link ${location.pathname === '/ai-suggest' ? 'active' : ''}`}>
                AI Suggest
              </Link>
            </li>
          </ul>
        </div>
        
        <div className="navbar-right">
          <div className="nav-actions">
            {isAuthenticated ? (
              <div className="user-profile">
                <span className="welcome-text">Hi, User</span>
                <button className="logout-btn" onClick={onLogout}>
                  Logout
                </button>
              </div>
            ) : (
              <div className="nav-auth-group">
                <button className="nav-login-btn" onClick={onLoginClick}>
                  Login
                </button>
                <button className="nav-signup-btn" onClick={onSignupClick}>
                  Signup
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
