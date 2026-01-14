import React from 'react';

// Color palette from the website
const PRIMARY_COLOR = '#6366f1';
const SECONDARY_COLOR = '#8b5cf6';
const ACCENT_COLOR = '#e2e8f0';

// Custom SVG workout illustrations styled with the color palette
export const StrengthTrainingIcon = ({ size = 48, isActive = false }) => {
  const color = isActive ? '#ffffff' : PRIMARY_COLOR;
  const bgColor = isActive ? SECONDARY_COLOR : 'rgba(99, 102, 241, 0.1)';
  
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="48" height="48" rx="12" fill={bgColor} />
      {/* Left weight */}
      <rect x="6" y="18" width="14" height="12" rx="2" fill={color} opacity="0.9" />
      <rect x="8" y="20" width="10" height="8" rx="1" fill={bgColor} />
      {/* Right weight */}
      <rect x="28" y="18" width="14" height="12" rx="2" fill={color} opacity="0.9" />
      <rect x="30" y="20" width="10" height="8" rx="1" fill={bgColor} />
      {/* Center bar */}
      <rect x="20" y="22" width="8" height="4" rx="2" fill={color} />
    </svg>
  );
};

export const CardioIcon = ({ size = 48, isActive = false }) => {
  const color = isActive ? '#ffffff' : PRIMARY_COLOR;
  const bgColor = isActive ? SECONDARY_COLOR : 'rgba(99, 102, 241, 0.1)';
  
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="48" height="48" rx="12" fill={bgColor} />
      {/* Runner silhouette */}
      <circle cx="18" cy="14" r="4" fill={color} />
      <path d="M18 18 L18 28 L14 34 L22 34 L18 28 Z" fill={color} opacity="0.9" />
      {/* Motion lines */}
      <path d="M8 24 L12 24" stroke={color} strokeWidth="2" strokeLinecap="round" opacity="0.6" />
      <path d="M36 20 L40 20" stroke={color} strokeWidth="2" strokeLinecap="round" opacity="0.6" />
      <path d="M34 28 L38 28" stroke={color} strokeWidth="2" strokeLinecap="round" opacity="0.6" />
    </svg>
  );
};

export const BikingIcon = ({ size = 48, isActive = false }) => {
  const color = isActive ? '#ffffff' : PRIMARY_COLOR;
  const bgColor = isActive ? SECONDARY_COLOR : 'rgba(99, 102, 241, 0.1)';
  
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="48" height="48" rx="12" fill={bgColor} />
      {/* Bike frame */}
      <circle cx="14" cy="32" r="4" fill={color} opacity="0.3" />
      <circle cx="34" cy="32" r="4" fill={color} opacity="0.3" />
      <circle cx="14" cy="32" r="2" fill={color} />
      <circle cx="34" cy="32" r="2" fill={color} />
      {/* Frame */}
      <path d="M14 32 L24 16 L34 32" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
      <path d="M24 16 L24 24" stroke={color} strokeWidth="2.5" />
      {/* Pedals */}
      <circle cx="24" cy="24" r="3" fill="none" stroke={color} strokeWidth="2" />
      <path d="M24 24 L26 26" stroke={color} strokeWidth="1.5" />
    </svg>
  );
};

export const YogaIcon = ({ size = 48, isActive = false }) => {
  const color = isActive ? '#ffffff' : PRIMARY_COLOR;
  const bgColor = isActive ? SECONDARY_COLOR : 'rgba(99, 102, 241, 0.1)';
  
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="48" height="48" rx="12" fill={bgColor} />
      {/* Meditation figure */}
      <circle cx="24" cy="16" r="4" fill={color} />
      {/* Body */}
      <ellipse cx="24" cy="26" rx="6" ry="10" fill={color} opacity="0.9" />
      {/* Arms (meditation pose) */}
      <path d="M18 24 Q14 22 12 24" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M30 24 Q34 22 36 24" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" />
      {/* Lotus/mandala circle */}
      <circle cx="24" cy="26" r="8" fill="none" stroke={color} strokeWidth="1" opacity="0.4" />
    </svg>
  );
};

export const PilatesIcon = ({ size = 48, isActive = false }) => {
  const color = isActive ? '#ffffff' : PRIMARY_COLOR;
  const bgColor = isActive ? SECONDARY_COLOR : 'rgba(99, 102, 241, 0.1)';
  
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="48" height="48" rx="12" fill={bgColor} />
      {/* Person in pilates pose */}
      <circle cx="24" cy="14" r="3" fill={color} />
      {/* Body */}
      <path d="M24 17 L24 28" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
      {/* Legs (stretched) */}
      <path d="M24 28 L18 38" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
      <path d="M24 28 L30 38" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
      {/* Arms */}
      <path d="M24 17 L18 22" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
      <path d="M24 17 L30 22" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
      {/* Mat */}
      <ellipse cx="24" cy="36" rx="12" ry="2" fill={color} opacity="0.2" />
    </svg>
  );
};

export const ZumbaIcon = ({ size = 48, isActive = false }) => {
  const color = isActive ? '#ffffff' : PRIMARY_COLOR;
  const bgColor = isActive ? SECONDARY_COLOR : 'rgba(99, 102, 241, 0.1)';
  
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="48" height="48" rx="12" fill={bgColor} />
      {/* Dancer figure */}
      <circle cx="24" cy="14" r="3.5" fill={color} />
      {/* Body */}
      <path d="M24 17.5 L24 30" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
      {/* Arms (dancing pose) */}
      <path d="M24 20 L18 16" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
      <path d="M24 20 L30 16" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
      {/* Legs (in motion) */}
      <path d="M24 30 L20 38" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
      <path d="M24 30 L28 38" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
      {/* Music notes */}
      <circle cx="12" cy="20" r="2" fill={color} opacity="0.6" />
      <path d="M12 22 L12 26" stroke={color} strokeWidth="1.5" opacity="0.6" />
    </svg>
  );
};

export const HIITIcon = ({ size = 48, isActive = false }) => {
  const color = isActive ? '#ffffff' : PRIMARY_COLOR;
  const bgColor = isActive ? SECONDARY_COLOR : 'rgba(99, 102, 241, 0.1)';
  
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="48" height="48" rx="12" fill={bgColor} />
      {/* Lightning bolt */}
      <path d="M24 8 L18 20 L22 20 L20 32 L28 18 L24 18 L26 8 Z" fill={color} />
      {/* Energy waves */}
      <circle cx="24" cy="24" r="10" fill="none" stroke={color} strokeWidth="1.5" opacity="0.3" />
      <circle cx="24" cy="24" r="14" fill="none" stroke={color} strokeWidth="1" opacity="0.2" />
    </svg>
  );
};

export const CrossFitIcon = ({ size = 48, isActive = false }) => {
  const color = isActive ? '#ffffff' : PRIMARY_COLOR;
  const bgColor = isActive ? SECONDARY_COLOR : 'rgba(99, 102, 241, 0.1)';
  
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="48" height="48" rx="12" fill={bgColor} />
      {/* Kettlebell */}
      <path d="M18 18 Q18 14 22 14 Q26 14 26 18 L28 22 Q28 26 24 28 Q20 26 20 22 Z" fill={color} />
      <rect x="22" y="28" width="4" height="6" rx="1" fill={color} />
      {/* Barbell */}
      <rect x="10" y="36" width="28" height="3" rx="1.5" fill={color} opacity="0.8" />
      <circle cx="12" cy="37.5" r="3" fill={color} opacity="0.6" />
      <circle cx="36" cy="37.5" r="3" fill={color} opacity="0.6" />
    </svg>
  );
};

export const LightWalkIcon = ({ size = 48, isActive = false }) => {
  const color = isActive ? '#ffffff' : PRIMARY_COLOR;
  const bgColor = isActive ? SECONDARY_COLOR : 'rgba(99, 102, 241, 0.1)';
  
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="48" height="48" rx="12" fill={bgColor} />
      {/* Walker */}
      <circle cx="20" cy="16" r="3" fill={color} />
      {/* Body */}
      <path d="M20 19 L20 32" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
      {/* Legs (walking) */}
      <path d="M20 32 L16 40" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
      <path d="M20 32 L24 40" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
      {/* Arms */}
      <path d="M20 22 L16 26" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
      <path d="M20 22 L24 26" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
      {/* Path/ground */}
      <path d="M8 40 L40 40" stroke={color} strokeWidth="2" strokeLinecap="round" opacity="0.4" />
      <circle cx="12" cy="40" r="1.5" fill={color} opacity="0.6" />
      <circle cx="36" cy="40" r="1.5" fill={color} opacity="0.6" />
    </svg>
  );
};

export const SportsIcon = ({ size = 48, isActive = false }) => {
  const color = isActive ? '#ffffff' : PRIMARY_COLOR;
  const bgColor = isActive ? SECONDARY_COLOR : 'rgba(99, 102, 241, 0.1)';
  
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="48" height="48" rx="12" fill={bgColor} />
      {/* Ball */}
      <circle cx="24" cy="24" r="10" fill={color} />
      <path d="M24 14 Q28 20 24 24 Q20 20 24 14" fill={bgColor} opacity="0.3" />
      <path d="M24 24 Q28 28 24 34 Q20 28 24 24" fill={bgColor} opacity="0.3" />
      <path d="M14 24 Q20 28 24 24 Q20 20 14 24" fill={bgColor} opacity="0.3" />
      {/* Motion lines */}
      <path d="M6 24 L10 24" stroke={color} strokeWidth="2" strokeLinecap="round" opacity="0.5" />
      <path d="M38 24 L42 24" stroke={color} strokeWidth="2" strokeLinecap="round" opacity="0.5" />
    </svg>
  );
};

export const BreathWorkIcon = ({ size = 48, isActive = false }) => {
  const color = isActive ? '#ffffff' : PRIMARY_COLOR;
  const bgColor = isActive ? SECONDARY_COLOR : 'rgba(99, 102, 241, 0.1)';
  
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="48" height="48" rx="12" fill={bgColor} />
      {/* Breathing circle expanding */}
      <circle cx="24" cy="24" r="6" fill="none" stroke={color} strokeWidth="2" opacity="0.8" />
      <circle cx="24" cy="24" r="10" fill="none" stroke={color} strokeWidth="1.5" opacity="0.5" />
      <circle cx="24" cy="24" r="14" fill="none" stroke={color} strokeWidth="1" opacity="0.3" />
      {/* Center dot */}
      <circle cx="24" cy="24" r="2" fill={color} />
    </svg>
  );
};

export const OtherIcon = ({ size = 48, isActive = false }) => {
  const color = isActive ? '#ffffff' : PRIMARY_COLOR;
  const bgColor = isActive ? SECONDARY_COLOR : 'rgba(99, 102, 241, 0.1)';
  
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="48" height="48" rx="12" fill={bgColor} />
      {/* Dots pattern */}
      <circle cx="16" cy="16" r="2.5" fill={color} />
      <circle cx="24" cy="16" r="2.5" fill={color} />
      <circle cx="32" cy="16" r="2.5" fill={color} />
      <circle cx="16" cy="24" r="2.5" fill={color} />
      <circle cx="24" cy="24" r="3.5" fill={color} />
      <circle cx="32" cy="24" r="2.5" fill={color} />
      <circle cx="16" cy="32" r="2.5" fill={color} />
      <circle cx="24" cy="32" r="2.5" fill={color} />
      <circle cx="32" cy="32" r="2.5" fill={color} />
    </svg>
  );
};

// Mapping function
export const getWorkoutIcon = (type, size = 48, isActive = false) => {
  const icons = {
    'strength training': StrengthTrainingIcon,
    'cardio': CardioIcon,
    'biking': BikingIcon,
    'yoga': YogaIcon,
    'pilates': PilatesIcon,
    'zumba': ZumbaIcon,
    'hiit': HIITIcon,
    'crossfit': CrossFitIcon,
    'light walk': LightWalkIcon,
    'sports and activities': SportsIcon,
    'breath work': BreathWorkIcon,
    'other': OtherIcon
  };
  
  const IconComponent = icons[type] || OtherIcon;
  return <IconComponent size={size} isActive={isActive} />;
};
