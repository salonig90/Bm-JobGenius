import React from 'react';

const JobRecommendations = ({ isFetchingJobs, jobRecommendations }) => {
  return (
    <div className="recommendations-container">
      <div className="section-header">
        <h3 className="recommendations-title">Job Recommendations</h3>
        <p className="recommendations-subtitle">Hand-picked roles that align with your unique skill profile.</p>
      </div>

      {isFetchingJobs ? (
        <div className="fetching-jobs">
          <div className="loader-dots">
            <span></span><span></span><span></span>
          </div>
          <span>Curating best opportunities...</span>
        </div>
      ) : jobRecommendations.length > 0 ? (
        <div className="jobs-grid">
          {jobRecommendations.map((job, idx) => (
            <div key={idx} className="job-card animate-fade-in" style={{animationDelay: `${idx * 0.1}s`}}>
              <div className="job-card-header">
                <div className="match-badge">
                  <span className="match-percent">{job.match_score}%</span>
                  <span className="match-text">Match</span>
                </div>
                {job.source && <div className="source-tag">{job.source}</div>}
              </div>

              <div className="job-card-content">
                <h4 className="job-title">{job.title}</h4>
                <div className="job-meta">
                  <span className="company-name">{job.company}</span>
                  <span className="dot">•</span>
                  <span className="job-location">{job.location || 'Remote'}</span>
                </div>
                <p className="job-desc">
                  {job.description
                    ? (job.description.length > 140 ? `${job.description.substring(0, 140)}...` : job.description)
                    : 'No description available.'}
                </p>
              </div>

              <div className="job-card-footer">
                {job.job_url && job.job_url !== 'None' && job.job_url !== 'nan' ? (
                  <a
                    href={job.job_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="apply-btn"
                  >
                    <span>View Details</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>
                  </a>
                ) : (
                  <span className="no-link">No link available</span>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-jobs">
          <div className="no-jobs-icon">🔍</div>
          <p>No live jobs found right now. Our AI is constantly scanning — please check back in a few minutes.</p>
        </div>
      )}
    </div>
  );
};

export default JobRecommendations;
