import React from 'react';

const HowItWorks = () => {
  const steps = [
    {
      number: "01",
      title: "Upload Your Resume",
      desc: "Simply drag and drop your PDF or DOCX resume. Our AI immediately begins parsing your professional history.",
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
          <polyline points="17 8 12 3 7 8"></polyline>
          <line x1="12" y1="3" x2="12" y2="15"></line>
        </svg>
      )
    },
    {
      number: "02",
      title: "AI Analysis & Scoring",
      desc: "We analyze your skills, experience, and impact, providing a compatibility score against industry benchmarks.",
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="22" y1="12" x2="18" y2="12"></line>
          <line x1="6" y1="12" x2="2" y2="12"></line>
          <line x1="12" y1="6" x2="12" y2="2"></line>
          <line x1="12" y1="22" x2="12" y2="18"></line>
        </svg>
      )
    },
    {
      number: "03",
      title: "Live Job Matching",
      desc: "Instantly see real-time job openings from top platforms that perfectly match your unique skill profile.",
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
          <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
      )
    }
  ];

  return (
    <section className="how-it-works-section">
      <div className="section-header">
        <h2 className="section-title">How It Works</h2>
        <p className="section-subtitle">Three simple steps to supercharge your career path.</p>
      </div>
      
      <div className="steps-container">
        {steps.map((step, i) => (
          <div key={i} className="step-card">
            <div className="step-number">{step.number}</div>
            <div className="step-icon-container">
              {step.icon}
            </div>
            <h3 className="step-title">{step.title}</h3>
            <p className="step-desc">{step.desc}</p>
            {i < steps.length - 1 && <div className="step-connector"></div>}
          </div>
        ))}
      </div>

      <style jsx>{`
        .how-it-works-section {
          padding: 60px 20px;
          max-width: 1200px;
          margin: 0 auto;
          width: 100%;
        }

        .steps-container {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 30px;
          margin-top: 40px;
          position: relative;
        }

        .step-card {
          position: relative;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          padding: 40px 30px;
          border-radius: 24px;
          text-align: center;
          transition: all 0.3s ease;
          z-index: 1;
        }

        .step-card:hover {
          transform: translateY(-10px);
          background: rgba(255, 255, 255, 0.05);
          border-color: var(--primary);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        }

        .step-number {
          font-size: 4rem;
          font-weight: 900;
          color: rgba(255, 255, 255, 0.05);
          position: absolute;
          top: 10px;
          right: 20px;
          line-height: 1;
          user-select: none;
        }

        .step-icon-container {
          width: 70px;
          height: 70px;
          background: var(--primary-glow);
          border-radius: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 25px;
          color: var(--primary);
          border: 1px solid var(--border-color);
        }

        .step-title {
          font-size: 1.5rem;
          margin-bottom: 15px;
          color: white;
        }

        .step-desc {
          color: var(--text-muted);
          line-height: 1.6;
          font-size: 1rem;
        }

        @media (max-width: 968px) {
          .steps-container {
            grid-template-columns: 1fr;
            gap: 30px;
          }
          
          .step-card {
            padding: 50px 30px;
          }
        }
      `}</style>
    </section>
  );
};

export default HowItWorks;
