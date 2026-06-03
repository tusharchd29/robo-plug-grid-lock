import React from 'react';

const TOTAL = 15;
const R     = 54;
const CIRC  = 2 * Math.PI * R;

export default function TimerRing({ timeLeft, anxiety, hope, children }) {
  const ratio   = Math.max(0, timeLeft / TOTAL);
  const dashOff = CIRC * (1 - ratio);

  const ringColor = anxiety > 0.8  ? '#ef4444'
    : anxiety > 0.6  ? '#f97316'
    : anxiety > 0.3  ? '#fbbf24'
    : anxiety > 0.05 ? '#fb923c'
    : hope > 0.5     ? '#34d399'
    : '#a78bfa';

  return (
    <div style={{ position:'relative', width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center' }}>
      <svg viewBox="0 0 120 120"
        style={{ position:'absolute', inset:0, width:'100%', height:'100%' }}
      >
        {/* Track */}
        <circle cx="60" cy="60" r={R} fill="none" stroke="rgba(200,160,200,0.12)" strokeWidth="5"/>
        {/* Fill — only show once timer started */}
        {anxiety > 0 && (
          <circle cx="60" cy="60" r={R}
            fill="none"
            stroke={ringColor}
            strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray={CIRC}
            strokeDashoffset={dashOff}
            transform="rotate(-90 60 60)"
            style={{ transition: 'stroke-dashoffset 0.12s linear, stroke 0.3s ease' }}
            opacity="0.8"
          />
        )}
        {/* Seconds label */}
        {anxiety > 0 && (
          <text x="60" y="113" textAnchor="middle" fontSize="9"
            fontFamily="Nunito, sans-serif" fontWeight="900"
            fill={ringColor} opacity="0.9">
            {Math.ceil(timeLeft)}s
          </text>
        )}
      </svg>

      <div style={{ position:'relative', width:'85%', height:'85%', zIndex:1 }}>
        {children}
      </div>
    </div>
  );
}
