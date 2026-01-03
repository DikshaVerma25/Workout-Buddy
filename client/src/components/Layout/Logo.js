import React from 'react';
import './Logo.css';

function Logo({ size = 'medium', showText = true }) {
  return (
    <div className={`logo-container logo-${size}`}>
      <svg 
        className="logo-icon" 
        viewBox="0 0 100 100" 
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Dumbbell icon - left weight */}
        <rect x="10" y="35" width="22" height="30" rx="4" fill="currentColor" />
        <rect x="12" y="37" width="18" height="26" rx="2" fill="white" opacity="0.3" />
        
        {/* Right weight */}
        <rect x="68" y="35" width="22" height="30" rx="4" fill="currentColor" />
        <rect x="70" y="37" width="18" height="26" rx="2" fill="white" opacity="0.3" />
        
        {/* Center bar */}
        <rect x="32" y="47" width="36" height="6" rx="3" fill="currentColor" />
        <rect x="34" y="48" width="32" height="4" rx="2" fill="white" opacity="0.4" />
        
        {/* Grip lines */}
        <line x1="40" y1="48" x2="40" y2="52" stroke="white" strokeWidth="0.5" opacity="0.5" />
        <line x1="45" y1="48" x2="45" y2="52" stroke="white" strokeWidth="0.5" opacity="0.5" />
        <line x1="55" y1="48" x2="55" y2="52" stroke="white" strokeWidth="0.5" opacity="0.5" />
        <line x1="60" y1="48" x2="60" y2="52" stroke="white" strokeWidth="0.5" opacity="0.5" />
      </svg>
      {showText && <span className="logo-text">Workout Buddy</span>}
    </div>
  );
}

export default Logo;

