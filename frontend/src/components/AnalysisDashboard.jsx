import React, { useState, useRef, useEffect } from 'react';

const AnalysisDashboard = ({ isAuthenticated, onAnalyzeClick, onUploadSuccess, fetchJobRecommendations, analysisData, setAnalysisData }) => {
  const [file, setFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [waitingForLogin, setWaitingForLogin] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (isAuthenticated && waitingForLogin && file) {
      setWaitingForLogin(false);
      uploadResume();
    }
  }, [isAuthenticated, waitingForLogin, file]);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setUploadStatus('');
      setWaitingForLogin(false);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
      setUploadStatus('');
      setWaitingForLogin(false);
      setAnalysisData(prev => ({ ...prev, jobRecommendations: [] }));
    }
  };

  const uploadResume = async () => {
    if (!file) return;

    if (!isAuthenticated) {
      setWaitingForLogin(true);
      onAnalyzeClick();
      return;
    }

    setIsUploading(true);
    setUploadStatus('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:8000/api/resume/upload/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        const uploadedFileName = file.name; // Capture filename before clearing state
        setUploadStatus('success');
        setAnalysisData(prev => ({
          ...prev,
          extractedSkills: result.extracted_skills || [],
          matchScore: result.score || 0,
          scoreLabel: result.score_label || '',
          resumeName: uploadedFileName
        }));
        setFile(null);
        onUploadSuccess(); // Navigate to dashboard immediately after resume analysis
        
        if (result.data && result.data.id) {
          fetchJobRecommendations(result.data.id);
        }
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error('Upload failed:', response.status, errorData);
        setUploadStatus('error');
      }
    } catch (error) {
      console.error('Network or server error:', error);
      setUploadStatus('error');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <section className="analysis-dashboard" id="analysis-dashboard">
      <div className="dashboard-card">
        {!uploadStatus && !isUploading && (
          <div className="upload-view animate-fade-in">
            <div className="view-header">
              <h2>Ready to find your match?</h2>
              <p>Upload your resume to let our AI find the best roles for you.</p>
            </div>

            <div
              className={`modern-dropzone ${file ? 'file-selected' : ''}`}
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

              <div className="dropzone-inner">
                <div className="icon-box">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="var(--primary)"></path>
                    <polyline points="17 8 12 3 7 8" stroke="var(--primary)"></polyline>
                    <line x1="12" y1="3" x2="12" y2="15" stroke="var(--primary)"></line>
                  </svg>
                </div>
                {!file ? (
                  <div className="drop-text">
                    <p className="main-text">Click or drag resume here</p>
                    <p className="sub-text">PDF or DOCX (Max 10MB)</p>
                  </div>
                ) : (
                  <div className="selected-file">
                    <span className="file-name">{file.name}</span>
                    <span className="file-size">{(file.size / 1024).toFixed(1)} KB</span>
                  </div>
                )}
              </div>
              <div className="dropzone-border"></div>
            </div>

            <button
              className={`action-btn ${!file || isUploading ? 'disabled' : ''}`}
              onClick={uploadResume}
              disabled={!file || isUploading}
            >
              <span>Analyze Resume</span>
              <div className="btn-glow"></div>
            </button>
          </div>
        )}

        {isUploading && (
          <div className="scanning-view animate-fade-in">
            <div className="scanner-container">
              <div className="scanner-line"></div>
              <div className="resume-silhouette">
                <div className="skeleton-line"></div>
                <div className="skeleton-line"></div>
                <div className="skeleton-line"></div>
              </div>
            </div>
            <div className="scanning-text">
              <h3>AI is scanning your profile...</h3>
              <p>Extracting skills and matching with live opportunities</p>
            </div>
          </div>
        )}

        {uploadStatus === 'error' && (
          <div className="error-view animate-fade-in">
            <div className="error-icon">❌</div>
            <h3>Something went wrong</h3>
            <p>Please try again with a different file format or smaller size.</p>
            <button className="reset-btn" onClick={() => {setUploadStatus(''); setFile(null);}}>
              Try Again
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default AnalysisDashboard;
