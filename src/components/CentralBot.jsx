import React, { useEffect, useState } from 'react';
import { useGameStore } from '../store/gameStore';
import styles from './CentralBot.module.css';

// Wool colors tied to conduit colors
const WOOL_COLORS = [
  '#fbb6ce', '#a5f3d0', '#bfdbfe', '#fde68a',
  '#e9d5ff', '#fed7aa', '#99f6e4', '#f5d0fe',
];

export default function CentralBot() {
  const { totalBots, satisfiedCount, exits } = useGameStore();
  const [prevSatisfied, setPrevSatisfied] = useState(satisfiedCount);
  const [burstId, setBurstId] = useState(null);

  const pct = totalBots > 0 ? satisfiedCount / totalBots : 0;

  useEffect(() => {
    if (satisfiedCount > prevSatisfied) {
      setBurstId(satisfiedCount);
      setTimeout(() => setBurstId(null), 700);
    }
    setPrevSatisfied(satisfiedCount);
  }, [satisfiedCount]);

  function getEmoji() {
    if (pct >= 1.0) return '^_^';
    if (pct >= 0.6) return 'o_o';
    if (pct >= 0.26) return '-_-';
    return '>_<';
  }
  function getState() {
    if (pct >= 1.0)  return 'Happy';
    if (pct >= 0.6)  return 'Excited';
    if (pct >= 0.26) return 'Hopeful';
    return 'Sad';
  }
  function getStateColor() {
    if (pct >= 1.0)  return '#f59e0b';
    if (pct >= 0.6)  return '#059669';
    if (pct >= 0.26) return '#6366f1';
    return '#e86b9a';
  }

  // Wool layers — one per unsatisfied bot
  const woolLayers = exits.map((exit, i) => ({
    color: WOOL_COLORS[i % WOOL_COLORS.length],
    satisfied: exit.satisfied,
  }));

  return (
    <div className={styles.wrap}>
      <div className={styles.title}>Central Bot</div>

      <div className={`${styles.botContainer} ${pct >= 1 ? styles.dancing : ''} ${burstId ? styles.burst : ''}`}>
        <svg viewBox="0 0 120 155" className={styles.botSvg} xmlns="http://www.w3.org/2000/svg">
          {/* Robot body */}
          <rect x="30" y="58" width="60" height="62" rx="12" fill="#d8d0f0" stroke="#b0a0d8" strokeWidth="1.5"/>
          {/* Head */}
          <rect x="35" y="28" width="50" height="36" rx="10" fill="#d8d0f0" stroke="#b0a0d8" strokeWidth="1.5"/>
          {/* Antenna */}
          <line x1="60" y1="28" x2="60" y2="16" stroke="#b0a0d8" strokeWidth="2" strokeLinecap="round"/>
          <circle cx="60" cy="13" r="4" fill="#c084fc"/>
          {/* Arms */}
          <rect x="12" y="64" width="20" height="10" rx="5" fill="#c4bad8" stroke="#b0a0d8" strokeWidth="1"/>
          <rect x="88" y="64" width="20" height="10" rx="5" fill="#c4bad8" stroke="#b0a0d8" strokeWidth="1"/>
          {/* Legs */}
          <rect x="36" y="116" width="16" height="20" rx="6" fill="#c4bad8" stroke="#b0a0d8" strokeWidth="1"/>
          <rect x="68" y="116" width="16" height="20" rx="6" fill="#c4bad8" stroke="#b0a0d8" strokeWidth="1"/>
          {/* Eyes — react to state */}
          <text
            x="60" y="52"
            textAnchor="middle"
            fontSize="13"
            fill={getStateColor()}
            fontFamily="'Space Mono', monospace"
            fontWeight="700"
          >
            {getEmoji()}
          </text>
          {/* Mouth */}
          {pct >= 1
            ? <path d="M48 62 Q60 70 72 62" stroke={getStateColor()} strokeWidth="2" fill="none" strokeLinecap="round"/>
            : <path d="M48 64 Q60 58 72 64" stroke="#9070c0" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
          }

          {/* ── Wool strands — clip over robot ───────── */}
          {woolLayers.map((layer, i) => !layer.satisfied && (
            <WoolStrand key={i} index={i} color={layer.color} total={woolLayers.length} />
          ))}
        </svg>

        {/* Particle burst on wool removal */}
        {burstId && (
          <div className={styles.particles}>
            {[...Array(8)].map((_, i) => (
              <div key={i} className={styles.particle} style={{ '--angle': `${i * 45}deg` }} />
            ))}
          </div>
        )}
      </div>

      {/* Happiness meter */}
      <div className={styles.meterWrap}>
        <div className={styles.meterLabel}>
          <span>{getState()}</span>
          <span>{Math.round(pct * 100)}%</span>
        </div>
        <div className={styles.meterTrack}>
          <div
            className={styles.meterFill}
            style={{ width: `${pct * 100}%`, background: getStateColor() }}
          />
        </div>
      </div>

      {/* Wool swatches */}
      <div className={styles.swatchRow}>
        {woolLayers.map((layer, i) => (
          <div
            key={i}
            className={`${styles.swatch} ${layer.satisfied ? styles.swatchDone : ''}`}
            style={{ background: layer.color }}
          />
        ))}
      </div>
    </div>
  );
}

function WoolStrand({ index, color, total }) {
  // Each strand is a procedurally positioned blob over the robot
  const paths = [
    "M25,45 Q35,32 55,42 Q65,28 78,40 Q88,30 96,45 Q88,55 75,50 Q62,62 48,55 Q36,65 25,55Z",
    "M28,72 Q18,65 16,78 Q22,92 37,87 Q44,98 57,92 Q62,102 73,94 Q82,102 90,90 Q97,78 90,67 Q80,75 67,70 Q58,80 46,74Z",
    "M33,102 Q26,112 34,124 Q50,130 66,122 Q79,130 89,120 Q94,108 87,100 Q76,110 62,106 Q50,112 38,106Z",
    "M38,60 Q54,54 70,61 Q76,70 60,73 Q47,69 38,60Z",
    "M58,83 Q70,78 82,86 Q86,96 76,100 Q66,97 57,101 Q51,95 58,83Z",
    "M24,85 Q35,78 42,88 Q38,98 27,94Z",
    "M72,55 Q80,48 92,58 Q88,68 76,63Z",
    "M40,112 Q50,106 58,114 Q54,122 44,118Z",
  ];
  const path = paths[index % paths.length];
  const opacity = 0.55 + (index % 3) * 0.1;

  return (
    <path
      d={path}
      fill={color}
      opacity={opacity}
      stroke={color}
      strokeWidth="0.8"
      strokeOpacity="0.6"
    />
  );
}
