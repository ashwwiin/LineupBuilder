import React from 'react';

/**
 * Custom Dynamic Football Jersey SVG Renderer
 */
export default function JerseySVG({ 
  primaryColor = '#10b981', 
  secondaryColor = '#064e3b', 
  collarColor = '#ffffff', 
  sleeveColor = '#10b981', 
  pattern = 'solid', 
  numberColor = '#ffffff', 
  number = null,
  size = 48,
  className = '' 
}) {
  const patternId = `jersey-pattern-${pattern}-${primaryColor.replace('#', '')}-${secondaryColor.replace('#', '')}`;

  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={`drop-shadow-md select-none ${className}`}
    >
      <defs>
        {/* Vertical Stripes Pattern */}
        {pattern === 'vertical-stripes' && (
          <pattern id={patternId} width="20" height="100" patternUnits="userSpaceOnUse">
            <rect width="10" height="100" fill={primaryColor} />
            <rect x="10" width="10" height="100" fill={secondaryColor} />
          </pattern>
        )}

        {/* Horizontal Hoops Pattern */}
        {pattern === 'horizontal-hoops' && (
          <pattern id={patternId} width="100" height="20" patternUnits="userSpaceOnUse">
            <rect width="100" height="10" fill={primaryColor} />
            <rect y="10" width="100" height="10" fill={secondaryColor} />
          </pattern>
        )}

        {/* Diagonal Sash */}
        {pattern === 'sash' && (
          <g id={patternId}>
            <rect width="100" height="100" fill={primaryColor} />
            <polygon points="0,20 100,80 100,100 0,40" fill={secondaryColor} />
          </g>
        )}

        {/* Halved Split */}
        {pattern === 'halved' && (
          <g id={patternId}>
            <rect width="50" height="100" fill={primaryColor} />
            <rect x="50" width="50" height="100" fill={secondaryColor} />
          </g>
        )}

        {/* V-Chevron */}
        {pattern === 'chevron' && (
          <g id={patternId}>
            <rect width="100" height="100" fill={primaryColor} />
            <polygon points="0,20 50,55 100,20 100,35 50,70 0,35" fill={secondaryColor} />
          </g>
        )}

        {/* Shadow Overlay for Fabric Realism */}
        <linearGradient id="jersey-shade" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.25" />
          <stop offset="50%" stopColor="#000000" stopOpacity="0" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.4" />
        </linearGradient>
      </defs>

      {/* LEFT SLEEVE */}
      <path 
        d="M 28 22 L 5 36 L 15 56 L 31 42 Z" 
        fill={sleeveColor || primaryColor} 
        stroke="rgba(0,0,0,0.3)" 
        strokeWidth="1.5"
      />

      {/* RIGHT SLEEVE */}
      <path 
        d="M 72 22 L 95 36 L 85 56 L 69 42 Z" 
        fill={sleeveColor || primaryColor} 
        stroke="rgba(0,0,0,0.3)" 
        strokeWidth="1.5"
      />

      {/* SLEEVE CUFFS */}
      <path d="M 5 36 L 15 56 L 18 53 L 9 34 Z" fill={collarColor} opacity="0.9" />
      <path d="M 95 36 L 85 56 L 82 53 L 91 34 Z" fill={collarColor} opacity="0.9" />

      {/* MAIN TORSO SHIRT */}
      <path 
        d="M 28 22 Q 50 28 72 22 L 72 85 Q 50 90 28 85 Z" 
        fill={
          pattern === 'vertical-stripes' || pattern === 'horizontal-hoops'
            ? `url(#${patternId})`
            : primaryColor
        }
        stroke="rgba(0,0,0,0.4)" 
        strokeWidth="2"
      />

      {/* OVERLAY SASH / HALVED / CHEVRON CLIP IF PATTERN */}
      {(pattern === 'sash' || pattern === 'halved' || pattern === 'chevron') && (
        <g clipPath="url(#torso-clip)">
          <clipPath id="torso-clip">
            <path d="M 28 22 Q 50 28 72 22 L 72 85 Q 50 90 28 85 Z" />
          </clipPath>
          {pattern === 'sash' && (
            <polygon points="0,10 100,70 100,90 0,30" fill={secondaryColor} />
          )}
          {pattern === 'halved' && (
            <rect x="50" width="50" height="100" fill={secondaryColor} />
          )}
          {pattern === 'chevron' && (
            <polygon points="0,20 50,55 100,20 100,35 50,70 0,35" fill={secondaryColor} />
          )}
        </g>
      )}

      {/* FABRIC SHADOW OVERLAY */}
      <path 
        d="M 28 22 Q 50 28 72 22 L 72 85 Q 50 90 28 85 Z" 
        fill="url(#jersey-shade)" 
      />

      {/* COLLAR */}
      <path 
        d="M 38 22 Q 50 34 62 22 Q 50 26 38 22 Z" 
        fill={collarColor} 
        stroke="rgba(0,0,0,0.3)" 
        strokeWidth="1.5"
      />

      {/* SHIRT NUMBER ON FRONT (IF PROVIDED) */}
      {number !== null && number !== undefined && (
        <text 
          x="50" 
          y="62" 
          fill={numberColor} 
          fontSize="28" 
          fontWeight="900" 
          fontFamily="Outfit, sans-serif" 
          textAnchor="middle" 
          dominantBaseline="central"
          style={{ textShadow: '0px 1px 3px rgba(0,0,0,0.7)' }}
        >
          {number}
        </text>
      )}
    </svg>
  );
}
