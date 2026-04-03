import React, { useState } from 'react'
import Logo from './Logo'


const Signup = ({ onSignupSuccess, onBackToLogin, onCancel }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    full_name: '',
    phone_number: ''
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('http://localhost:8000/api/resume/register/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setSuccess(true)
        setTimeout(() => {
          onSignupSuccess()
        }, 1500)
      } else {
        const data = await response.json()
        setError(Object.values(data)[0] || 'Registration failed. Please check your details.')
      }
    } catch (err) {
      setError('An error occurred during registration. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="login-overlay">
        <div className="login-card animate-fade-in">
          <div className="login-header success-header">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
            <h2>Welcome to JobGenius!</h2>
            <p>Your account has been created. Redirecting to login...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="login-overlay">
      <div className="login-card animate-fade-in">
        <div className="login-header">
          <Logo size={64} className="auth-logo" />
          <h2>Create Account</h2>
          <p>Join JobGenius and transform your career.</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label htmlFor="full_name">Full Name</label>
            <input
              type="text"
              id="full_name"
              value={formData.full_name}
              onChange={handleChange}
              required
              placeholder="Saloni Giratkar"
            />
          </div>

          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={formData.username}
              onChange={handleChange}
              required
              placeholder="saloni_g"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="saloni123@example.com"
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone_number">Phone Number</label>
            <input
              type="tel"
              id="phone_number"
              value={formData.phone_number}
              onChange={handleChange}
              required
              placeholder="+91 9876543210"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Create a secure password"
            />
          </div>

          <div className="login-actions">
            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? 'Creating account...' : 'Sign Up'}
            </button>
            <div className="auth-footer">
              Already have an account? <span onClick={onBackToLogin}>Log In</span>
            </div>
            <button type="button" className="cancel-btn" onClick={onCancel}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Signup
