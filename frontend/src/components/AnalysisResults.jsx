import React from 'react';

const AnalysisResults = ({ matchScore, scoreLabel, extractedSkills }) => {
  return (
    <div className="analysis-results-container">
      <div className="score-summary-card">
        <div className="radial-score">
          <svg viewBox="0 0 36 36" className="circular-chart">
            <path className="circle-bg"
              d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path className="circle"
              strokeDasharray={`${matchScore}, 100`}
              stroke={matchScore >= 80 ? '#10b981' : matchScore >= 60 ? '#fb2576' : '#f59e0b'}
              d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <text x="18" y="20.35" className="percentage">{matchScore}%</text>
          </svg>
          <div className="score-meta">
            <span className="score-label">Resume Score</span>
            {scoreLabel && (
              <span className={`score-badge ${scoreLabel.toLowerCase().replace(' ', '-')}`}>
                {scoreLabel}
              </span>
            )}
          </div>
        </div>
      </div>
      
      <div className="skills-grid-container">
        <h4 className="skills-title">Key Skills</h4>
        <div className="skills-cloud">
          {extractedSkills.map((skill, idx) => (
            <div key={idx} className="key-skill-tag">
              <span className="skill-bullet">•</span>
              {skill}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnalysisResults;
