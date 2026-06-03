import React from 'react';

const TOTAL = 15;
const R = 54;
const CIRC = 2 * Math.PI * R;

export default function TimerRing({ timeLeft, anxiety, hope, children }) {
  const ratio    = Math.max(0, timeLeft / TOTAL);
  const dashOff  = CIRC * (1 - ratio);

  // Color: green → yellow → orange → red based on anxiety
  const ringColor = anxiety > 0.75 ? '#ef4444'
    : anxiety > 0.5  ? '#fb923c'
    : anxiety > 0.25 ? '#fbbf24'
    : hope > 0.5     ? '#34d399'
    : '#a78bfa';

  const pulseScale = anxiety > 0.7 ? 1 + Math.sin(Date.now() / 120) * 0.015 : 1;

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {/* Timer ring SVG behind cat */}
      <svg
        viewBox="0 0 120 120"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          transform: `scale(${pulseScale})`,
          transition: 'transform 0.1s',
        }}
      >
        {/* Track */}
        <circle cx="60" cy="60" r={R}
          fill="none"
          stroke="rgba(200,160,200,0.12)"
          strokeWidth="5"
        />
        {/* Fill */}
        <circle cx="60" cy="60" r={R}
          fill="none"
          stroke={ringColor}
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray={CIRC}
          strokeDashoffset={dashOff}
          transform="rotate(-90 60 60)"
          style={{ transition: 'stroke-dashoffset 0.12s linear, stroke 0.3s ease' }}
          opacity={anxiety > 0 || !false ? 0.75 : 0.4}
        />
        {/* Time text */}
        <text
          x="60" y="112"
          textAnchor="middle"
          fontSize="9"
          fontFamily="Nunito, sans-serif"
          fontWeight="900"
          fill={ringColor}
          opacity="0.85"
        >
          {Math.ceil(timeLeft)}s
        </text>
      </svg>

      {/* Cat inside */}
      <div style={{ position: 'relative', width: '85%', height: '85%', zIndex: 1 }}>
        {children}
      </div>
    </div>
  );
}
