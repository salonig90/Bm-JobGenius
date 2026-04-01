import React from 'react'
import logo from '../assets/logo.png'

const Navbar = ({ isAuthenticated, onLogout, onLoginClick, onSignupClick }) => {
  return (
    <nav className="navbar animate-fade-in">
      <div className="navbar-content">
        <div className="navbar-left">
          <div className="nav-logo-container">
            <img src={logo} alt="JobGenius Logo" className="nav-logo" />
            <span className="nav-brand-name">JobGenius</span>
          </div>
        </div>
        
        <div className="navbar-right">
          <ul className="nav-links">
            <li><a href="#features" className="nav-link">Features</a></li>
            <li><a href="#about" className="nav-link">About</a></li>
          </ul>
          
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
