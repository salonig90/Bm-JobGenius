import React from 'react';

const Features = () => {
  const features = [
    {
      title: "Smart Resume Analysis",
      desc: "Our AI dives deep into your resume to extract key skills and quantify your professional achievements.",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
          <polyline points="14.5 2 14.5 7.5 20 7.5"></polyline>
          <line x1="16" y1="13" x2="8" y2="13"></line>
          <line x1="16" y1="17" x2="8" y2="17"></line>
          <line x1="10" y1="9" x2="8" y2="9"></line>
        </svg>
      ),
      color: "#fb2576"
    },
    {
      title: "Job Market Matching",
      desc: "Connect instantly with thousands of job opportunities across LinkedIn, Indeed, and Google Jobs.",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
        </svg>
      ),
      color: "#00f5ff"
    },

    {
      title: "Personalized Coaching",
      desc: "AI-powered feedback on your professional tone, formatting, and overall resume effectiveness.",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>
      ),
      color: "#fb2576"
    }
  ];

  return (
    <section className="features-section">
      <div className="section-header">
        <h2 className="section-title">Empower Your Career</h2>
        <p className="section-subtitle">Everything you need to stand out and land your next big role.</p>
      </div>
      <div className="features-grid">
        {features.map((f, i) => (
          <div key={i} className="feature-card animate-fade-in" style={{animationDelay: `${i * 0.2}s`}}>
            <div className="feature-icon" style={{backgroundColor: `${f.color}15`, color: f.color}}>
              {f.icon}
            </div>
            <h3 className="feature-title">{f.title}</h3>
            <p className="feature-desc">{f.desc}</p>
            <div className="feature-glow" style={{background: `radial-gradient(circle at center, ${f.color}20 0%, transparent 70%)`}}></div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Features;
