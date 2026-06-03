import React, { useEffect, useState } from 'react';

export default function YarnBall({ color, satisfied, size = 36, animating }) {
  const [pop, setPop] = useState(false);

  useEffect(() => {
    if (animating) {
      setPop(true);
      setTimeout(() => setPop(false), 600);
    }
  }, [animating]);

  const s = pop ? size * 1.35 : satisfied ? size * 1.1 : size;

  return (
    <svg
      viewBox="0 0 40 40"
      width={s}
      height={s}
      xmlns="http://www.w3.org/2000/svg"
      style={{
        transition: 'width 0.25s cubic-bezier(0.34,1.56,0.64,1), height 0.25s cubic-bezier(0.34,1.56,0.64,1)',
        filter: satisfied ? `drop-shadow(0 0 6px ${color}88)` : 'none',
        flexShrink: 0,
      }}
    >
      {/* Ball body */}
      <circle cx="20" cy="20" r="17" fill={satisfied ? color : '#e8e0f0'} />
      <circle cx="20" cy="20" r="17" fill="none" stroke={color} strokeWidth="2" opacity={satisfied ? 0 : 1} />

      {/* Yarn wind lines */}
      <path d="M6,14 Q20,8 34,14" stroke={satisfied ? 'white' : color} strokeWidth="1.8" fill="none" opacity="0.6" strokeLinecap="round" />
      <path d="M5,20 Q20,26 35,20" stroke={satisfied ? 'white' : color} strokeWidth="1.8" fill="none" opacity="0.6" strokeLinecap="round" />
      <path d="M8,27 Q20,22 32,27" stroke={satisfied ? 'white' : color} strokeWidth="1.8" fill="none" opacity="0.5" strokeLinecap="round" />
      <path d="M13,8 Q18,20 14,33" stroke={satisfied ? 'white' : color} strokeWidth="1.5" fill="none" opacity="0.4" strokeLinecap="round" />
      <path d="M27,7 Q22,20 26,33" stroke={satisfied ? 'white' : color} strokeWidth="1.5" fill="none" opacity="0.4" strokeLinecap="round" />

      {/* Sheen */}
      <circle cx="13" cy="13" r="4" fill="white" opacity={satisfied ? 0.3 : 0.15} />

      {/* Satisfied checkmark */}
      {satisfied && (
        <path d="M12,20 L18,26 L28,14" stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      )}

      {/* Waiting dots */}
      {!satisfied && (
        <text x="20" y="24" textAnchor="middle" fontSize="8" fill={color} opacity="0.5">• • •</text>
      )}
    </svg>
  );
}
