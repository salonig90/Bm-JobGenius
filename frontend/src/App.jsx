import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Signup from './components/Signup';
import Footer from './components/Footer';
import Home from './pages/Home';
import DashboardPage from './pages/DashboardPage';
import UploadResumePage from './pages/UploadResumePage';
import AISuggestPage from './pages/AISuggestPage';

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [pendingRedirect, setPendingRedirect] = useState(null);
  const [analysisData, setAnalysisData] = useState(() => {
    const savedData = localStorage.getItem('analysis_data');
    return savedData ? JSON.parse(savedData) : {
      resumeId: null,
      matchScore: 0,
      scoreLabel: '',
      extractedSkills: [],
      jobRecommendations: [],
      aiSuggestions: null,
      isFetchingJobs: false,
      resumeName: ''
    };
  });

  useEffect(() => {
    localStorage.setItem('analysis_data', JSON.stringify(analysisData));
  }, [analysisData]);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const savedUsername = localStorage.getItem('username');
    if (token) {
      setIsAuthenticated(true);
      if (savedUsername) setUsername(savedUsername);
      
      // Fetch user's saved resume data on page refresh if authenticated
      fetchUserResumeData(token);
    }
  }, []);

  const fetchUserResumeData = async (token) => {
    try {
      const response = await fetch('http://localhost:8000/api/resume/my-resume/', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const result = await response.json();
        const resumeName = result.data.file ? result.data.file.split('/').pop() : 'Saved Resume';
        
        setAnalysisData(prev => ({
          ...prev,
          resumeId: result.data.id || null,
          extractedSkills: result.extracted_skills || [],
          matchScore: result.score || 0,
          scoreLabel: result.score_label || '',
          resumeName: resumeName,
          isFetchingJobs: false
        }));
        
        if (result.data.id) {
          fetchJobRecommendations(result.data.id);
        }
      }
    } catch (error) {
      console.error('Failed to fetch saved resume:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('username');
    localStorage.removeItem('analysis_data');
    setIsAuthenticated(false);
    setUsername('');
    setAnalysisData({
      resumeId: null,
      matchScore: 0,
      scoreLabel: '',
      extractedSkills: [],
      jobRecommendations: [],
      aiSuggestions: null,
      isFetchingJobs: false,
      resumeName: ''
    });
    navigate('/');
  };

  const handleLoginSuccess = async () => {
    setIsAuthenticated(true);
    const savedUsername = localStorage.getItem('username');
    if (savedUsername) setUsername(savedUsername);
    setShowLogin(false);
    setShowSignup(false);

    // Fetch user's saved resume data
    const token = localStorage.getItem('access_token');
    if (token) {
      fetchUserResumeData(token);
    }
    
    if (pendingRedirect) {
      navigate(pendingRedirect);
      setPendingRedirect(null);
    }
  };

  const handleSignupSuccess = () => {
    setShowSignup(false);
    setShowLogin(true);
  };

  const handleAnalyzeResume = () => {
    navigate('/upload');
  };

  const fetchJobRecommendations = async (resumeId) => {
    setAnalysisData(prev => ({ ...prev, isFetchingJobs: true }));
    try {
      const response = await fetch(`http://localhost:8000/api/jobs/recommend/${resumeId}/`);
      if (response.ok) {
        const data = await response.json();
        setAnalysisData(prev => ({ 
          ...prev, 
          jobRecommendations: data.recommendations || [] 
        }));
      }
    } catch (error) {
      console.error('Failed to fetch recommendations:', error);
    } finally {
      setAnalysisData(prev => ({ ...prev, isFetchingJobs: false }));
    }
  };

  const handleUploadSuccess = () => {
    navigate('/dashboard');
  };

  const handleLogoClick = () => {
    navigate('/');
  };

  return (
    <div className="app-container">
      <div className="bg-orbs">
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
        <div className="orb orb-3"></div>
      </div>
      <Navbar
        isAuthenticated={isAuthenticated}
        username={username}
        onLogout={handleLogout}
        onLoginClick={() => setShowLogin(true)}
        onSignupClick={() => setShowSignup(true)}
        onLogoClick={handleLogoClick}
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

      <main className="main-content" style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Routes>
          <Route path="/" element={<Home onAnalyzeClick={handleAnalyzeResume} />} />
          <Route 
            path="/upload" 
            element={
              <UploadResumePage 
                isAuthenticated={isAuthenticated}
                onAnalyzeClick={() => {
                  setPendingRedirect('/upload');
                  setShowLogin(true);
                }}
                onUploadSuccess={handleUploadSuccess}
                fetchJobRecommendations={fetchJobRecommendations}
                analysisData={analysisData}
                setAnalysisData={setAnalysisData}
              />
            } 
          />
          <Route 
            path="/dashboard" 
            element={
              <DashboardPage 
                isAuthenticated={isAuthenticated}
                onAnalyzeClick={handleAnalyzeResume}
                analysisData={analysisData}
                setAnalysisData={setAnalysisData}
              />
            } 
          />
          <Route 
            path="/ai-suggest" 
            element={
              <AISuggestPage 
                isAuthenticated={isAuthenticated}
                analysisData={analysisData}
                setAnalysisData={setAnalysisData}
              />
            } 
          />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
