import React from 'react';
import Hero from '../components/Hero';
import Features from '../components/Features';
import HowItWorks from '../components/HowItWorks';
import CallToAction from '../components/CallToAction';

const Home = ({ onAnalyzeClick }) => {
  return (
    <div className="home-page-layout" style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Hero onAnalyzeClick={onAnalyzeClick} />
      <Features />
      <HowItWorks />
      <CallToAction onAnalyzeClick={onAnalyzeClick} />
    </div>
  );
};

export default Home;
