import React from 'react';

const Logo = ({ className = '', size = 48 }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 32 32" 
      className={`theme-logo ${className}`}
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fb2576" />
          <stop offset="50%" stopColor="#8c52ff" />
          <stop offset="100%" stopColor="#00f5ff" />
        </linearGradient>
        <filter id="logoGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        <filter id="softGlow">
          <feGaussianBlur stdDeviation="0.5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>
      
      {/* Background Stylized "G" base (Brain/Circuit shape) */}
      <path 
        d="M26 16C26 21.5228 21.5228 26 16 26C10.4772 26 6 21.5228 6 16C6 10.4772 10.4772 6 16 6C18.5 6 20.8 6.9 22.5 8.5" 
        stroke="url(#logoGradient)" 
        strokeWidth="2.5" 
        strokeLinecap="round"
        filter="url(#logoGlow)"
        opacity="0.9"
      >
        <animate attributeName="stroke-dasharray" from="0, 100" to="100, 0" dur="2s" fill="freeze" />
      </path>

      {/* Stylized "J" integrated with the "G" */}
      <path 
        d="M16 10V20C16 21.5 15 22.5 13.5 22.5C12 22.5 11 21.5 11 20" 
        stroke="#00f5ff" 
        strokeWidth="2.5" 
        strokeLinecap="round"
        filter="url(#softGlow)"
      >
        <animate attributeName="opacity" values="0.7;1;0.7" dur="3s" repeatCount="indefinite" />
      </path>

      {/* "G" cross-bar/Genius bar */}
      <path 
        d="M16 16H24V20C24 21.5 23 22.5 22 22.5" 
        stroke="#fb2576" 
        strokeWidth="2.5" 
        strokeLinecap="round"
        filter="url(#softGlow)"
      />

      {/* Central "Genius" Spark/Node */}
      <circle cx="16" cy="16" r="1.5" fill="white">
        <animate attributeName="r" values="1;2;1" dur="1.5s" repeatCount="indefinite" />
        <animate attributeName="fill" values="#00f5ff;#fb2576;#00f5ff" dur="3s" repeatCount="indefinite" />
      </circle>

      {/* Intelligence/Data Flow Dots */}
      <circle cx="22.5" cy="8.5" r="1" fill="#00f5ff">
        <animate attributeName="opacity" values="0;1;0" dur="2s" repeatCount="indefinite" />
      </circle>
      <circle cx="26" cy="16" r="0.8" fill="#fb2576">
        <animate attributeName="opacity" values="1;0;1" dur="2.5s" repeatCount="indefinite" />
      </circle>
      <circle cx="9.5" cy="11.5" r="0.8" fill="#8c52ff">
        <animate attributeName="opacity" values="0;1;0" dur="1.8s" repeatCount="indefinite" />
      </circle>
    </svg>
  );
};

export default Logo;
