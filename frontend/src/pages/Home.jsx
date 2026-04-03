import React from 'react';
import Hero from '../components/Hero';
import Features from '../components/Features';
import HowItWorks from '../components/HowItWorks';
import CallToAction from '../components/CallToAction';

const Home = ({ onAnalyzeClick }) => {
  return (
    <div className="home-page-layout" style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Hero onAnalyzeClick={onAnalyzeClick} />
      <div style={{ margin: '60px 0' }}></div>
      <Features />
      <div style={{ margin: '80px 0' }}></div>
      <HowItWorks />
      <div style={{ margin: '40px 0' }}></div>
      <CallToAction onAnalyzeClick={onAnalyzeClick} />
    </div>
  );
};

export default Home;
