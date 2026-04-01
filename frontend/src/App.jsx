import React, { useState, useRef, useEffect } from 'react'
import './App.css'
import logo from './assets/logo.png' // Import the generated logo
import Navbar from './components/Navbar'
import Login from './components/Login'
import Signup from './components/Signup'

function App() {
  const [file, setFile] = useState(null)
  const [uploadStatus, setUploadStatus] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [showLogin, setShowLogin] = useState(false)
  const [showSignup, setShowSignup] = useState(false)
  const [extractedSkills, setExtractedSkills] = useState([])
  const [matchScore, setMatchScore] = useState(0)
  const [sentiment, setSentiment] = useState({ label: '', feedback: '' })
  const fileInputRef = useRef(null)

  useEffect(() => {
    const token = localStorage.getItem('access_token')
    if (token) {
      setIsAuthenticated(true)
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    setIsAuthenticated(false)
  }

  const handleLoginSuccess = () => {
    setIsAuthenticated(true)
    setShowLogin(false)
    setShowSignup(false)
  }

  const handleSignupSuccess = () => {
    setShowSignup(false)
    setShowLogin(true)
  }

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
      setUploadStatus('')
    }
  }

  const handleUploadClick = () => {
    fileInputRef.current.click()
  }

  const handleDragOver = (e) => {
    e.preventDefault()
  }

  const handleDrop = (e) => {
    e.preventDefault()
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0])
      setUploadStatus('')
    }
  }

  const uploadResume = async () => {
    if (!file) return

    setIsUploading(true)
    setUploadStatus('')

    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await fetch('http://localhost:8000/api/resume/upload/', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        const result = await response.json()
        setUploadStatus('success')
        setExtractedSkills(result.extracted_skills || [])
        setMatchScore(result.match_score || 0)
        setSentiment(result.sentiment || { label: 'NEUTRAL', feedback: '' })
        setFile(null)
      } else {
        setUploadStatus('error')
      }
    } catch (error) {
      setUploadStatus('error')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="app-container">
      <Navbar
        isAuthenticated={isAuthenticated}
        onLogout={handleLogout}
        onLoginClick={() => setShowLogin(true)}
        onSignupClick={() => setShowSignup(true)}
      />

      {showLogin && (
        <Login
          onLoginSuccess={handleLoginSuccess}
          onSignupClick={() => { setShowLogin(false); setShowSignup(true); }}
          onCancel={() => setShowLogin(false)}
        />
      )}

      {showSignup && (
        <Signup
          onSignupSuccess={handleSignupSuccess}
          onBackToLogin={() => { setShowSignup(false); setShowLogin(true); }}
          onCancel={() => setShowSignup(false)}
        />
      )}

      <div className="logo-container animate-fade-in">
        <img src={logo} alt="JobGenius Logo" className="app-logo" />
        <span className="brand-name glow-text-small">JobGenius</span>
      </div>

      <header className="hero-section animate-fade-in">
        <h1 className="glow-text">
          The genius way to land<br />your dream job.
        </h1>
        <p className="subtitle delay-100 animate-fade-in">
          JobGenius uses advanced AI to match your unique skills with the perfect opportunities. Fast, smart, and designed for the ambitious professional.
        </p>
        <div className="cta-group delay-200 animate-fade-in">
          <button className="primary-btn">
            Get Started
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </button>
          <button className="secondary-btn">
            Learn More
          </button>
        </div>
      </header>

      {/* Modern Upload Section */}
      <section className="upload-section delay-300 animate-fade-in">
        <div className="upload-container">
          <div className="upload-header">
            <h2>Ready to find your match?</h2>
            <p>Upload your resume (PDF/DOCX) to get started</p>
          </div>

          <div
            className={`dropzone ${file ? 'has-file' : ''}`}
            onClick={handleUploadClick}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".pdf,.doc,.docx"
              style={{ display: 'none' }}
            />

            {!file ? (
              <div className="dropzone-content">
                <svg className="upload-icon" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="17 8 12 3 7 8"></polyline>
                  <line x1="12" y1="3" x2="12" y2="15"></line>
                </svg>
                <p><strong>Click to upload</strong> or drag and drop</p>
                <span>PDF, DOCX (Max 10MB)</span>
              </div>
            ) : (
              <div className="file-info">
                <svg className="file-icon" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
                  <polyline points="13 2 13 9 20 9"></polyline>
                </svg>
                <span className="file-name">{file.name}</span>
              </div>
            )}
          </div>

          <div className="upload-actions">
            <button
              className={`upload-btn ${!file || isUploading ? 'disabled' : ''}`}
              onClick={uploadResume}
              disabled={!file || isUploading}
            >
              {isUploading ? 'Uploading...' : 'Analyze My Resume'}
            </button>
          </div>

          {uploadStatus === 'success' && (
            <div className="status-message success animate-fade-in">
              <div className="status-header">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
                Resume analyzed successfully!
              </div>
                <div className="analysis-results">
                  <div className="match-score-section">
                    <div className="score-circle">
                      <span className="score-value">{matchScore}%</span>
                      <span className="score-label">Match</span>
                    </div>
                  </div>
                  
                  <div className="skills-summary">
                    <p>Identified Skills:</p>
                    <div className="skills-chips">
                      {extractedSkills.map((skill, idx) => (
                        <span key={idx} className="skill-chip">{skill}</span>
                      ))}
                    </div>

                    {sentiment.label && (
                      <div className="sentiment-feedback">
                        <span className={`sentiment-badge ${sentiment.label.toLowerCase()}`}>
                          {sentiment.label} Tone
                        </span>
                        <p className="feedback-text">{sentiment.feedback}</p>
                      </div>
                    )}
                  </div>
                </div>
            </div>
          )}
          {uploadStatus === 'error' && (
            <div className="status-message error">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>
              Upload failed. Please try again.
            </div>
          )}
        </div>
      </section>

      <section className="features-grid delay-300 animate-fade-in">
        {/* Feature 1 */}
        <div className="feature-card">
          <div className="feature-icon-wrapper">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
              <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
              <line x1="12" y1="22.08" x2="12" y2="12"></line>
            </svg>
          </div>
          <h3 className="feature-title">AI Matching</h3>
          <p className="feature-desc">Our intelligent algorithms scan thousands of listings to find the perfect role matching your unique skill profile.</p>
        </div>

        {/* Feature 2 */}
        <div className="feature-card">
          <div className="feature-icon-wrapper">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
            </svg>
          </div>
          <h3 className="feature-title">Smart Resume Builder</h3>
          <p className="feature-desc">Automatically craft highly targeted resumes tailored specifically to the job descriptions you want to land.</p>
        </div>

        {/* Feature 3 */}
        <div className="feature-card">
          <div className="feature-icon-wrapper">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
          </div>
          <h3 className="feature-title">Real-time Insights</h3>
          <p className="feature-desc">Get up-to-the-minute salary trends, market demands, and necessary upskilling recommendations.</p>
        </div>
      </section>
    </div>
  )
}

export default App
