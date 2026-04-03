import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';
import Logo from './Logo';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-glow"></div>
      <div className="footer-container">
        <div className="footer-top">
          <div className="footer-brand-section">
            <div className="footer-logo">
              <Logo size={40} />
              <span className="footer-brand-name">JobGenius</span>
            </div>
            <p className="footer-description">
              Transforming careers through AI-driven insights. Find your perfect match in the ever-evolving job market.
            </p>
            <div className="footer-socials">
              <a href="#" className="social-icon" aria-label="LinkedIn">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
              </a>
              <a href="#" className="social-icon" aria-label="Twitter">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg>
              </a>
              <a href="#" className="social-icon" aria-label="GitHub">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
              </a>
            </div>
          </div>

          <div className="footer-links-simple">
            <div className="footer-column">
              <h4>Navigation</h4>
              <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/upload">Upload Resume</Link></li>
                <li><Link to="/dashboard">Dashboard</Link></li>
              </ul>
            </div>
            <div className="footer-column">
              <h4>Support</h4>
              <ul>
                <li><a href="#">Contact Us</a></li>
                <li><a href="#">Privacy Policy</a></li>
                <li><a href="#">Terms of Use</a></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="footer-divider"></div>

        <div className="footer-bottom">
          <p className="copyright">&copy; {new Date().getFullYear()} JobGenius. Built with AI for the future of work.</p>
          <div className="footer-bottom-links">
            <span className="status-indicator">
              <span className="dot"></span> Systems Online
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
