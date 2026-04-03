import React from 'react';
import AnalysisDashboard from '../components/AnalysisDashboard';

const UploadResumePage = ({ isAuthenticated, onAnalyzeClick, onUploadSuccess, fetchJobRecommendations, analysisData, setAnalysisData }) => {
  return (
    <div className="upload-page-container" style={{ padding: '100px 20px', width: '100%', maxWidth: '1200px' }}>
      <div className="section-header" style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ 
          fontSize: '3rem', 
          marginBottom: '10px',
          background: 'linear-gradient(to right, #fb2576, #00f5ff)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          Upload Your Resume
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem' }}>
          Let our AI analyze your profile and find the perfect job matches for you.
        </p>
      </div>
      
      <AnalysisDashboard 
        isAuthenticated={isAuthenticated} 
        onAnalyzeClick={onAnalyzeClick}
        onUploadSuccess={onUploadSuccess}
        fetchJobRecommendations={fetchJobRecommendations}
        analysisData={analysisData}
        setAnalysisData={setAnalysisData}
      />
    </div>
  );
};

export default UploadResumePage;
