import React from 'react';
import heroImage from '../assets/hero.png';

const Hero = ({ onAnalyzeClick }) => {
  return (
    <div className="hero-container">
      <header className="hero-section animate-fade-in">
        <div className="hero-content">
          <div className="hero-badge">AI-Powered Career Intelligence</div>
          <h1 className="hero-title">
            The <span className="text-gradient">Genius</span> way to land your dream job.
          </h1>
          <p className="hero-subtitle delay-100">
            JobGenius uses advanced AI to match your unique skills with the perfect opportunities. Fast, smart, and designed for the ambitious professional.
          </p>
          <div className="cta-group delay-200">
            <button className="primary-btn glow-effect" onClick={onAnalyzeClick}>
              Scan your Resume
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </button>
          </div>
        </div>
        
        <div className="hero-visual delay-300">
          <div className="hero-image-wrapper">
            <div className="image-glow-orb"></div>
            
            {/* New Creative "Smart Resume" Illustration */}
            <div className="creative-resume-viz">
              <div className="resume-page main-page">
                <div className="resume-line title-line"></div>
                <div className="resume-line long-line"></div>
                <div className="resume-line mid-line"></div>
                <div className="resume-line long-line"></div>
                
                {/* AI Scanning Effect */}
                <div className="scanning-bar"></div>

                {/* Skills moved back inside the file for a neat look */}
                <div className="skill-tag tag-1">React</div>
                <div className="skill-tag tag-2">Python</div>
                <div className="skill-tag tag-3">AI</div>
              </div>
              <div className="resume-page back-page"></div>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
};

export default Hero;
