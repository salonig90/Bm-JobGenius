import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const AISuggestPage = ({ isAuthenticated, analysisData, setAnalysisData }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const suggestions = analysisData.aiSuggestions;

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
      return;
    }

    if (analysisData.resumeId && !analysisData.aiSuggestions) {
      fetchSuggestions(analysisData.resumeId);
    }
  }, [analysisData.resumeId, isAuthenticated, navigate, analysisData.aiSuggestions]);

  const fetchSuggestions = async (resumeId) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:8000/api/suggestions/suggestions/${resumeId}/`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setAnalysisData(prev => ({
          ...prev,
          aiSuggestions: data.suggestions
        }));
      } else {
        const errorData = await response.json();
        setError(errorData.error || errorData.detail || 'Failed to fetch suggestions');
      }
    } catch (err) {
      setError('A network error occurred while fetching suggestions.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!analysisData.resumeId) {
    return (
      <div className="ai-suggest-empty-container animate-fade-in" style={{ 
        minHeight: '85vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        padding: '120px 20px 60px',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '600px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div className="animate-float" style={{ marginBottom: '25px' }}>
            <svg width="70" height="70" viewBox="0 0 32 32" fill="none">
              <defs>
                <linearGradient id="advisor-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#fb2576" />
                  <stop offset="100%" stopColor="#00f5ff" />
                </linearGradient>
              </defs>
              <path 
                d="M16 2L19.5 12.5L30 16L19.5 19.5L16 30L12.5 19.5L2 16L12.5 12.5L16 2Z" 
                fill="url(#advisor-grad)" 
              />
            </svg>
          </div>

          <h1 className="page-title-gradient" style={{ fontSize: '3.5rem', marginBottom: '20px', fontWeight: '800' }}>AI Career Advisor</h1>
          
          <p style={{ 
            color: 'var(--text-muted)', 
            fontSize: '1.2rem', 
            marginBottom: '40px', 
            lineHeight: '1.6',
            maxWidth: '500px'
          }}>
            Personalized insights to help you bridge the gap between your skills and your next career move.
          </p>
          
          <Link to="/upload" className="primary-btn" style={{ textDecoration: 'none', padding: '1rem 2.5rem' }}>
            Upload Resume
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </Link>
        </div>
      </div>
    );
  }

  const formatSuggestion = (text) => {
    // Matches patterns like "1. **Title**: Description" or "**Title**: Description" or "Title: Description"
    const regex = /^(\d+\.\s*)?(\*\*)?(.*?)\2?:\s*(.*)/;
    const match = text.match(regex);

    if (match) {
      const [_, number = '', __, title, description] = match;
      return (
        <div style={{ display: 'flex', gap: '15px' }}>
          <div style={{ marginTop: '5px' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" fill="var(--accent)" opacity="0.8" />
            </svg>
          </div>
          <div>
            <strong style={{ color: 'var(--accent)', fontSize: '1.3rem', display: 'inline-block', marginBottom: '10px', fontWeight: '700' }}>{title}</strong>
            <div style={{ 
              color: 'var(--text-muted)', 
              fontSize: '1.05rem', 
              lineHeight: '1.6', 
              textAlign: 'justify'
            }}>
              {description}
            </div>
          </div>
        </div>
      );
    }
    
    // Fallback for simple bolding within text
    const boldRegex = /\*\*(.*?)\*\*/g;
    const parts = text.split(boldRegex);
    return (
      <div style={{ display: 'flex', gap: '15px' }}>
        <div style={{ marginTop: '5px' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" fill="var(--primary)" opacity="0.6" />
          </svg>
        </div>
        <div style={{ 
          color: 'var(--text-muted)', 
          fontSize: '1.05rem', 
          lineHeight: '1.6', 
          textAlign: 'justify'
        }}>
          {parts.map((part, i) => 
            i % 2 === 1 ? <strong key={i} style={{ color: 'var(--accent)', fontWeight: '700' }}>{part}</strong> : part
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="ai-suggest-container animate-fade-in" style={{ padding: '120px 20px 80px', maxWidth: '1000px', margin: '0 auto', width: '100%' }}>
      <header style={{ marginBottom: '60px', textAlign: 'center' }}>
        <h1 className="page-title-gradient" style={{ fontSize: '3rem', marginBottom: '15px', fontWeight: '800' }}>AI Career Advisor</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
          Strategic recommendations to accelerate your professional growth.
        </p>
      </header>

      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '100px 0' }}>
          <div className="loading-spinner" style={{ marginBottom: '30px' }}></div>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Analyzing your resume with Gemini AI...</p>
        </div>
      ) : error ? (
        <div className="error-card" style={{ 
          background: 'rgba(239, 68, 68, 0.05)', 
          border: '1px solid rgba(239, 68, 68, 0.1)', 
          padding: '40px', 
          borderRadius: '24px',
          color: '#f87171',
          textAlign: 'center'
        }}>
          <p style={{ fontSize: '1.1rem', marginBottom: '25px' }}>{error}</p>
          <button onClick={() => fetchSuggestions(analysisData.resumeId)} className="primary-btn" style={{ margin: '0 auto', background: '#f87171' }}>
            Try Again
          </button>
        </div>
      ) : suggestions ? (
        <div className="suggestions-list" style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          {Array.isArray(suggestions) ? (
            suggestions.map((suggestion, index) => (
              <div key={index} className="suggestion-card" style={{ 
                background: 'rgba(255, 255, 255, 0.02)', 
                padding: '35px', 
                borderRadius: '1.5rem',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                cursor: 'default',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <div style={{ 
                  position: 'absolute', 
                  top: 0, 
                  left: 0, 
                  width: '4px', 
                  height: '100%', 
                  background: 'linear-gradient(to bottom, var(--primary), var(--accent))',
                  opacity: 0.4
                }}></div>
                {formatSuggestion(suggestion)}
              </div>
            ))
          ) : (
            <div className="suggestion-card" style={{ 
              background: 'rgba(255, 255, 255, 0.02)', 
              padding: '30px', 
              borderRadius: '1.25rem',
              border: '1px solid rgba(255, 255, 255, 0.05)'
            }}>
              {suggestions}
            </div>
          )}
        </div>
      ) : null}

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
        .page-title-gradient {
          background: linear-gradient(135deg, #fb2576 0%, #00f5ff 100%);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }
        .suggestion-card {
          transition: all 0.3s ease;
        }
        .suggestion-card:hover {
          border-color: rgba(251, 37, 118, 0.2);
          background: rgba(255, 255, 255, 0.04);
          transform: translateY(-2px);
        }
        
        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 2px solid rgba(255, 255, 255, 0.05);
          border-radius: 50%;
          border-top-color: #fb2576;
          animation: spin 1s linear infinite;
          margin: 0 auto;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .ai-suggest-container {
            padding: 80px 15px 40px !important;
          }
          .page-title-gradient {
            font-size: 2.2rem !important;
          }
          .suggestion-card {
            padding: 25px !important;
          }
          .ai-suggest-empty-container h1 {
            font-size: 2.2rem !important;
          }
        }
      `}</style>
    </div>
  );
};

export default AISuggestPage;
