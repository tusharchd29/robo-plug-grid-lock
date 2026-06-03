import React, { useEffect, useState } from 'react';

// happiness 0-1
export default function CatCharacter({ happiness = 0 }) {
  const [blink, setBlink] = useState(false);
  const [tailWag, setTailWag] = useState(0);
  const [bounce, setBounce] = useState(false);
  const [prevHappy, setPrevHappy] = useState(happiness);

  // Blinking
  useEffect(() => {
    const interval = setInterval(() => {
      setBlink(true);
      setTimeout(() => setBlink(false), 150);
    }, 3000 + Math.random() * 2000);
    return () => clearInterval(interval);
  }, []);

  // Tail wag speed based on happiness
  useEffect(() => {
    const interval = setInterval(() => {
      setTailWag(t => (t + 1) % 100);
    }, happiness > 0.7 ? 80 : happiness > 0.4 ? 140 : 220);
    return () => clearInterval(interval);
  }, [happiness]);

  // Bounce on happiness increase
  useEffect(() => {
    if (happiness > prevHappy) {
      setBounce(true);
      setTimeout(() => setBounce(false), 600);
    }
    setPrevHappy(happiness);
  }, [happiness]);

  const h = happiness;

  // Eye expressions
  const eyeOpen = blink ? 1 : 0;
  // 0=sad closed, 0.5=neutral, 1=happy curved
  const eyeHappy = h;

  // Ear angle: droopy when sad, perky when happy
  const earRotL = -15 + h * 25;
  const earRotR = 15 - h * 25;

  // Mouth curve
  const mouthCurve = h > 0.5 ? 'smile' : h > 0.2 ? 'neutral' : 'frown';

  // Cheek blush visibility
  const blushOpacity = h > 0.5 ? (h - 0.5) * 2 : 0;

  // Body color: grey-ish when sad, warm cream when happy
  const bodyColor = interpolateColor('#b8b0c8', '#fde8c8', h);
  const innerColor = interpolateColor('#d8d0e8', '#fff0dc', h);

  // Tail wag angle
  const tailAngle = Math.sin(tailWag * 0.2) * (15 + h * 30);

  const bounceY = bounce ? -8 : 0;

  return (
    <svg
      viewBox="0 0 200 180"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        width: '100%',
        height: '100%',
        filter: 'drop-shadow(0 4px 12px rgba(180,140,200,0.25))',
        transform: `translateY(${bounceY}px)`,
        transition: 'transform 0.15s cubic-bezier(0.34,1.56,0.64,1)',
        overflow: 'visible',
      }}
    >
      {/* ── Tail ─────────────────────────────── */}
      <g transform={`translate(148, 138) rotate(${tailAngle})`} style={{ transformOrigin: '0 0' }}>
        <path
          d="M0,0 Q20,-10 30,-30 Q38,-50 25,-65"
          stroke={bodyColor}
          strokeWidth="12"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M0,0 Q20,-10 30,-30 Q38,-50 25,-65"
          stroke={innerColor}
          strokeWidth="7"
          strokeLinecap="round"
          fill="none"
          opacity="0.6"
        />
        {/* Tail tip */}
        <circle cx="25" cy="-65" r="8" fill={h > 0.5 ? '#f9a8d4' : '#c4b8d8'} />
      </g>

      {/* ── Body ─────────────────────────────── */}
      <ellipse cx="100" cy="140" rx="52" ry="38" fill={bodyColor} />
      <ellipse cx="100" cy="138" rx="38" ry="28" fill={innerColor} />

      {/* ── Legs/paws ─────────────────────────── */}
      <ellipse cx="72" cy="165" rx="16" ry="10" fill={bodyColor} />
      <ellipse cx="128" cy="165" rx="16" ry="10" fill={bodyColor} />
      <ellipse cx="72" cy="166" rx="10" ry="6" fill={innerColor} />
      <ellipse cx="128" cy="166" rx="10" ry="6" fill={innerColor} />
      {/* Toe lines */}
      <line x1="68" y1="163" x2="67" y2="170" stroke={bodyColor} strokeWidth="1.5" strokeOpacity="0.4" />
      <line x1="72" y1="163" x2="72" y2="170" stroke={bodyColor} strokeWidth="1.5" strokeOpacity="0.4" />
      <line x1="76" y1="163" x2="77" y2="170" stroke={bodyColor} strokeWidth="1.5" strokeOpacity="0.4" />

      {/* ── Head ─────────────────────────────── */}
      <ellipse cx="100" cy="95" rx="46" ry="44" fill={bodyColor} />
      <ellipse cx="100" cy="97" rx="34" ry="32" fill={innerColor} opacity="0.5" />

      {/* ── Ears ─────────────────────────────── */}
      {/* Left ear */}
      <g transform={`translate(62, 60) rotate(${earRotL})`}>
        <polygon points="0,0 -18,-32 16,-28" fill={bodyColor} />
        <polygon points="2,-3 -10,-24 12,-21" fill={h > 0.4 ? '#f9a8d4' : '#d4c8e8'} />
      </g>
      {/* Right ear */}
      <g transform={`translate(138, 60) rotate(${earRotR})`}>
        <polygon points="0,0 18,-32 -16,-28" fill={bodyColor} />
        <polygon points="-2,-3 10,-24 -12,-21" fill={h > 0.4 ? '#f9a8d4' : '#d4c8e8'} />
      </g>

      {/* ── Eyes ─────────────────────────────── */}
      {eyeOpen === 0 ? (
        // Blink
        <>
          <path d="M82,92 Q88,88 94,92" stroke="#5a3e6e" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <path d="M106,92 Q112,88 118,92" stroke="#5a3e6e" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        </>
      ) : eyeHappy > 0.6 ? (
        // Happy curved eyes (^_^)
        <>
          <path d="M80,93 Q88,83 96,93" stroke="#5a3e6e" strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M104,93 Q112,83 120,93" stroke="#5a3e6e" strokeWidth="3" fill="none" strokeLinecap="round" />
        </>
      ) : (
        // Normal round eyes
        <>
          <circle cx="88" cy="93" r={9 - eyeHappy * 2} fill="#5a3e6e" />
          <circle cx="112" cy="93" r={9 - eyeHappy * 2} fill="#5a3e6e" />
          <circle cx="91" cy="90" r="2.5" fill="white" opacity="0.9" />
          <circle cx="115" cy="90" r="2.5" fill="white" opacity="0.9" />
          {/* Sad eyebrows */}
          {h < 0.3 && (
            <>
              <path d="M81,83 Q88,79 95,82" stroke="#5a3e6e" strokeWidth="2" fill="none" strokeLinecap="round" />
              <path d="M105,82 Q112,79 119,83" stroke="#5a3e6e" strokeWidth="2" fill="none" strokeLinecap="round" />
            </>
          )}
        </>
      )}

      {/* ── Cheek blush ─────────────────────── */}
      <ellipse cx="74" cy="103" rx="10" ry="6" fill="#f9a8d4" opacity={blushOpacity * 0.7} />
      <ellipse cx="126" cy="103" rx="10" ry="6" fill="#f9a8d4" opacity={blushOpacity * 0.7} />

      {/* ── Nose ───────────────────────────── */}
      <ellipse cx="100" cy="103" rx="4" ry="3" fill={h > 0.5 ? '#f472b6' : '#9b7bb8'} />

      {/* ── Whiskers ─────────────────────────── */}
      <line x1="56" y1="100" x2="84" y2="104" stroke="#9b8dbf" strokeWidth="1.2" opacity="0.6" />
      <line x1="54" y1="106" x2="83" y2="107" stroke="#9b8dbf" strokeWidth="1.2" opacity="0.6" />
      <line x1="56" y1="112" x2="84" y2="110" stroke="#9b8dbf" strokeWidth="1.2" opacity="0.6" />
      <line x1="116" y1="104" x2="144" y2="100" stroke="#9b8dbf" strokeWidth="1.2" opacity="0.6" />
      <line x1="117" y1="107" x2="146" y2="106" stroke="#9b8dbf" strokeWidth="1.2" opacity="0.6" />
      <line x1="116" y1="110" x2="144" y2="112" stroke="#9b8dbf" strokeWidth="1.2" opacity="0.6" />

      {/* ── Mouth ─────────────────────────── */}
      {mouthCurve === 'smile' && (
        <>
          <path d="M93,110 Q100,118 107,110" stroke="#5a3e6e" strokeWidth="2" fill="none" strokeLinecap="round" />
          <path d="M93,110 Q88,113 85,110" stroke="#5a3e6e" strokeWidth="1.5" fill="none" strokeLinecap="round" />
          <path d="M107,110 Q112,113 115,110" stroke="#5a3e6e" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        </>
      )}
      {mouthCurve === 'neutral' && (
        <path d="M93,111 Q100,114 107,111" stroke="#5a3e6e" strokeWidth="2" fill="none" strokeLinecap="round" />
      )}
      {mouthCurve === 'frown' && (
        <path d="M90,113 Q100,108 110,113" stroke="#5a3e6e" strokeWidth="2" fill="none" strokeLinecap="round" />
      )}

      {/* ── Yarn tangles (visible when sad) ── */}
      {h < 0.8 && (
        <g opacity={1 - h * 1.2}>
          <path d="M60,120 Q70,112 80,122 Q90,132 100,120" stroke="#f472b6" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.6" />
          <path d="M120,125 Q130,115 140,125" stroke="#a78bfa" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.6" />
          <path d="M85,150 Q95,140 105,150 Q115,160 125,148" stroke="#34d399" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.5" />
        </g>
      )}

      {/* ── Happy sparkles ─────────────────── */}
      {h > 0.7 && (
        <g opacity={(h - 0.7) * 3.3}>
          <text x="42" y="72" fontSize="14" textAnchor="middle">✨</text>
          <text x="158" y="68" fontSize="12" textAnchor="middle">⭐</text>
          <text x="155" y="95" fontSize="10" textAnchor="middle">✨</text>
        </g>
      )}

      {/* ── Fully free hearts ───────────────── */}
      {h >= 1 && (
        <>
          <text x="45" y="58" fontSize="16" textAnchor="middle" style={{ animation: 'floatUp 1s ease-out infinite' }}>💕</text>
          <text x="160" y="55" fontSize="14" textAnchor="middle">💕</text>
        </>
      )}
    </svg>
  );
}

function interpolateColor(hex1, hex2, t) {
  const r1 = parseInt(hex1.slice(1, 3), 16);
  const g1 = parseInt(hex1.slice(3, 5), 16);
  const b1 = parseInt(hex1.slice(5, 7), 16);
  const r2 = parseInt(hex2.slice(1, 3), 16);
  const g2 = parseInt(hex2.slice(3, 5), 16);
  const b2 = parseInt(hex2.slice(5, 7), 16);
  const r = Math.round(r1 + (r2 - r1) * t);
  const g = Math.round(g1 + (g2 - g1) * t);
  const b = Math.round(b1 + (b2 - b1) * t);
  return `rgb(${r},${g},${b})`;
}
