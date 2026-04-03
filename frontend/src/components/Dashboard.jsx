import React from 'react';
import AnalysisResults from './AnalysisResults';
import JobRecommendations from './JobRecommendations';

const Dashboard = ({ analysisData, onReset }) => {
  return (
    <div className="dashboard-container animate-fade-in">
      <div className="dashboard-content">
        <header className="dashboard-header">
          <div className="dashboard-header-top">
            <h1>Your AI Career Dashboard</h1>
            <button className="reset-analysis-btn" onClick={onReset}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M23 4v6h-4"></path>
                <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
              </svg>
              Analyze New Resume
            </button>
          </div>
          <p>Real-time analysis and job matching based on your profile.</p>
        </header>

        <div className="dashboard-split-layout">
          <div className="dashboard-left-panel">
            {analysisData.resumeName && (
              <div className="dashboard-card-wrapper resume-info-card">
                <h3>Uploaded Resume</h3>
                <div className="resume-display">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="resume-icon">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <line x1="16" y1="13" x2="8" y2="13"></line>
                    <line x1="16" y1="17" x2="8" y2="17"></line>
                    <polyline points="10 9 9 9 8 9"></polyline>
                  </svg>
                  <span className="resume-filename">{analysisData.resumeName}</span>
                </div>
              </div>
            )}
            <div className="dashboard-card-wrapper">
              <h3>Analysis Summary</h3>
              <AnalysisResults 
                matchScore={analysisData.matchScore} 
                scoreLabel={analysisData.scoreLabel}
                extractedSkills={analysisData.extractedSkills} 
              />
            </div>
          </div>

          <div className="dashboard-right-panel">
            <div className="dashboard-card-wrapper">
              <JobRecommendations 
                isFetchingJobs={analysisData.isFetchingJobs} 
                jobRecommendations={analysisData.jobRecommendations} 
              />
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .dashboard-container {
          padding: 100px 20px 40px;
          min-height: 100vh;
          color: white;
          max-width: 1400px;
          margin: 0 auto;
        }

        .dashboard-header {
          margin-bottom: 40px;
          text-align: left;
        }

        .dashboard-header-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
          flex-wrap: wrap;
          gap: 20px;
        }

        .dashboard-header h1 {
          font-size: 2.5rem;
          margin: 0;
          background: linear-gradient(to right, #fb2576, #00f5ff);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .reset-analysis-btn {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: #fff;
          padding: 0.8rem 1.5rem;
          border-radius: 99rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 10px;
          font-weight: 600;
          transition: all 0.3s ease;
        }

        .reset-analysis-btn:hover {
          background: rgba(251, 37, 118, 0.1);
          border-color: #fb2576;
          color: #fb2576;
          transform: translateY(-2px);
        }

        .dashboard-split-layout {
          display: grid;
          grid-template-columns: 350px 1fr;
          gap: 30px;
        }

        @media (max-width: 1024px) {
          .dashboard-split-layout {
            grid-template-columns: 1fr;
          }
        }

        .dashboard-card-wrapper {
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          padding: 30px;
          height: 100%;
        }

        .dashboard-card-wrapper h3 {
          margin-bottom: 25px;
          color: #fff;
          font-size: 1.5rem;
          font-weight: 600;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          padding-bottom: 15px;
        }

        .dashboard-left-panel {
          position: sticky;
          top: 100px;
          height: fit-content;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .resume-info-card {
          margin-bottom: 0;
        }

        .resume-display {
          display: flex;
          align-items: center;
          gap: 12px;
          background: rgba(255, 255, 255, 0.05);
          padding: 15px;
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .resume-icon {
          color: #fb2576;
        }

        .resume-filename {
          font-weight: 500;
          color: #f8fafc;
          font-size: 0.95rem;
          word-break: break-all;
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
