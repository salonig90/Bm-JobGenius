import React from 'react';

const CallToAction = ({ onAnalyzeClick }) => {
  return (
    <section className="cta-section">
      <div className="cta-card">
        <div className="cta-glow"></div>
        <div className="cta-content">
          <h2 className="cta-title">Ready to take the next step in your career?</h2>
          <p className="cta-subtitle">Join thousands of professionals landing their dream roles with AI-powered insights.</p>
          <button className="primary-btn glow-effect" onClick={onAnalyzeClick}>
            Get Started Now
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </button>
        </div>
      </div>

      <style jsx>{`
        .cta-section {
          padding: 80px 20px 140px;
          max-width: 1200px;
          margin: 0 auto;
          width: 100%;
        }

        .cta-card {
          position: relative;
          background: linear-gradient(135deg, rgba(251, 37, 118, 0.1) 0%, rgba(51, 47, 208, 0.1) 100%);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 40px;
          padding: 80px 40px;
          text-align: center;
          overflow: hidden;
          box-shadow: 0 40px 100px -20px rgba(0, 0, 0, 0.5);
        }

        .cta-glow {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 120%;
          height: 120%;
          background: radial-gradient(circle at center, rgba(251, 37, 118, 0.15) 0%, transparent 70%);
          pointer-events: none;
          z-index: 0;
        }

        .cta-content {
          position: relative;
          z-index: 1;
          max-width: 700px;
          margin: 0 auto;
        }

        .cta-title {
          font-size: 3rem;
          margin-bottom: 20px;
          color: white;
          font-weight: 800;
          line-height: 1.1;
        }

        .cta-subtitle {
          color: var(--text-muted);
          font-size: 1.25rem;
          margin-bottom: 40px;
          line-height: 1.6;
        }

        .primary-btn {
          background: linear-gradient(135deg, #fb2576 0%, #332fd0 100%);
          color: white;
          padding: 1.2rem 3rem;
          border-radius: 99rem;
          font-weight: 700;
          font-size: 1.15rem;
          border: none;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 12px;
          box-shadow: 0 0 30px rgba(251, 37, 118, 0.4);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .primary-btn:hover {
          transform: translateY(-5px) scale(1.05);
          box-shadow: 0 0 50px rgba(251, 37, 118, 0.6);
        }

        @media (max-width: 768px) {
          .cta-title {
            font-size: 2.25rem;
          }
          .cta-card {
            padding: 60px 20px;
          }
        }
      `}</style>
    </section>
  );
};

export default CallToAction;
