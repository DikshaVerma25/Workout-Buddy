import React from 'react';

// Yoga-themed background component with meditation pose and lotus pattern
export const YogaBackground = () => {
  return (
    <div className="yoga-background-container">
      <svg
        className="yoga-background-svg"
        viewBox="0 0 1000 600"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Gradient matching the color palette */}
          <linearGradient id="yogaGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.05" />
          </linearGradient>
          <linearGradient id="yogaGradient2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#6366f1" stopOpacity="0.05" />
          </linearGradient>
          {/* Lotus petal pattern */}
          <pattern id="lotusPattern" x="0" y="0" width="200" height="200" patternUnits="userSpaceOnUse">
            <circle cx="100" cy="100" r="30" fill="#6366f1" opacity="0.03" />
            <path d="M100 70 Q120 100 100 130 Q80 100 100 70" fill="#8b5cf6" opacity="0.04" />
            <path d="M100 70 Q130 90 130 100 Q130 110 100 130" fill="#8b5cf6" opacity="0.04" />
            <path d="M100 70 Q70 90 70 100 Q70 110 100 130" fill="#8b5cf6" opacity="0.04" />
          </pattern>
        </defs>
        
        {/* Background gradients */}
        <rect width="1000" height="600" fill="url(#yogaGradient1)" />
        <rect width="1000" height="600" fill="url(#yogaGradient2)" />
        
        {/* Lotus pattern overlay */}
        <rect width="1000" height="600" fill="url(#lotusPattern)" opacity="0.5" />
        
        {/* Meditation pose silhouette (right side, subtle) */}
        <g opacity="0.12" transform="translate(700, 50)">
          {/* Head */}
          <circle cx="0" cy="0" r="35" fill="#6366f1" />
          {/* Body (seated meditation pose) */}
          <ellipse cx="0" cy="60" rx="45" ry="80" fill="#6366f1" />
          {/* Left arm (meditation pose) */}
          <path d="M-45 40 Q-60 30 -75 40" stroke="#8b5cf6" strokeWidth="18" fill="none" strokeLinecap="round" />
          {/* Right arm (meditation pose) */}
          <path d="M45 40 Q60 30 75 40" stroke="#8b5cf6" strokeWidth="18" fill="none" strokeLinecap="round" />
          {/* Meditation circles around */}
          <circle cx="0" cy="60" r="100" fill="none" stroke="#6366f1" strokeWidth="2" opacity="0.3" />
          <circle cx="0" cy="60" r="130" fill="none" stroke="#8b5cf6" strokeWidth="1.5" opacity="0.2" />
        </g>
        
        {/* Lotus flowers (scattered) */}
        <g opacity="0.15">
          {/* Top left lotus */}
          <g transform="translate(150, 100)">
            <circle cx="0" cy="0" r="25" fill="#6366f1" opacity="0.2" />
            <path d="M0 -25 Q15 -10 0 5 Q-15 -10 0 -25" fill="#8b5cf6" />
            <path d="M25 0 Q10 15 -5 0 Q10 -15 25 0" fill="#6366f1" />
            <path d="M0 25 Q-15 10 0 -5 Q15 10 0 25" fill="#8b5cf6" />
            <path d="M-25 0 Q-10 -15 5 0 Q-10 15 -25 0" fill="#6366f1" />
          </g>
          
          {/* Bottom right lotus */}
          <g transform="translate(850, 450)">
            <circle cx="0" cy="0" r="30" fill="#8b5cf6" opacity="0.2" />
            <path d="M0 -30 Q18 -12 0 6 Q-18 -12 0 -30" fill="#6366f1" />
            <path d="M30 0 Q12 18 -6 0 Q12 -18 30 0" fill="#8b5cf6" />
            <path d="M0 30 Q-18 12 0 -6 Q18 12 0 30" fill="#6366f1" />
            <path d="M-30 0 Q-12 -18 6 0 Q-12 18 -30 0" fill="#8b5cf6" />
          </g>
        </g>
        
        {/* Breathing/energy circles (subtle) */}
        <circle cx="200" cy="300" r="80" fill="none" stroke="#6366f1" strokeWidth="1.5" opacity="0.1" />
        <circle cx="200" cy="300" r="120" fill="none" stroke="#8b5cf6" strokeWidth="1" opacity="0.08" />
        <circle cx="800" cy="200" r="60" fill="none" stroke="#8b5cf6" strokeWidth="1.5" opacity="0.1" />
        <circle cx="800" cy="200" r="90" fill="none" stroke="#6366f1" strokeWidth="1" opacity="0.08" />
      </svg>
    </div>
  );
};

