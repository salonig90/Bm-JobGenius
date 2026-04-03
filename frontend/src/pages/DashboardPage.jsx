import React from 'react';
import { Link } from 'react-router-dom';
import Dashboard from '../components/Dashboard';

const DashboardPage = ({ isAuthenticated, onAnalyzeClick, analysisData, setAnalysisData }) => {
  const hasResults = analysisData.matchScore > 0;

  const handleReset = () => {
    setAnalysisData({
      matchScore: 0,
      scoreLabel: '',
      extractedSkills: [],
      jobRecommendations: [],
      isFetchingJobs: false,
      resumeName: ''
    });
  };

  return (
    <div className="dashboard-page-container" style={{ width: '100%', minHeight: '100vh' }}>
      {hasResults ? (
        <Dashboard analysisData={analysisData} onReset={handleReset} />
      ) : (
        <div style={{ 
          padding: '120px 20px', 
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '30px'
        }}>
          <h1 style={{ 
            fontSize: '3rem', 
            background: 'linear-gradient(to right, #fb2576, #00f5ff)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Welcome to your Dashboard
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', maxWidth: '600px' }}>
            You haven't uploaded a resume yet. Let's get started by uploading your profile to see your analysis and matches!
          </p>
          <Link 
            to="/upload" 
            className="cta-button" 
            style={{ 
              textDecoration: 'none',
              background: 'linear-gradient(135deg, #fb2576 0%, #332fd0 100%)',
              color: 'white',
              padding: '1rem 2.5rem',
              borderRadius: '99rem',
              fontWeight: '700',
              fontSize: '1.1rem',
              boxShadow: '0 0 20px rgba(251, 37, 118, 0.4)',
              transition: 'all 0.3s ease'
            }}
          >
            Go to Upload
          </Link>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
