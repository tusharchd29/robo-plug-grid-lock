import React, { useEffect, useState, useRef } from 'react';

// timeRatio: 0=no time left, 1=full time
// progressRatio: 0=nothing freed, 1=all freed
export default function CatCharacter({ timeRatio = 1, progressRatio = 0, timerStarted = false }) {
  const [blink, setBlink]       = useState(false);
  const [pawTap, setPawTap]     = useState(false);
  const [tailPhase, setTailPhase] = useState(0);
  const [sweatDrop, setSweatDrop] = useState(false);
  const [bounce, setBounce]     = useState(false);
  const [prevProg, setPrevProg] = useState(progressRatio);
  const frameRef = useRef(0);

  // Anxiety: high when time low AND progress low
  // Hope: high when progress high regardless of time
  const anxiety = timerStarted ? Math.max(0, (1 - timeRatio) * (1 - progressRatio)) : 0;
  const hope    = progressRatio;
  // Combined mood: 0=panic, 0.5=neutral, 1=joy
  const mood    = Math.max(hope, 1 - anxiety);

  // Blink — faster when anxious
  useEffect(() => {
    const blinkInterval = () => 1800 + (1 - anxiety) * 2000 + Math.random() * 1000;
    let t = setTimeout(function tick() {
      setBlink(true);
      setTimeout(() => setBlink(false), 100);
      t = setTimeout(tick, blinkInterval());
    }, blinkInterval());
    return () => clearTimeout(t);
  }, [anxiety]);

  // Tail animation loop
  useEffect(() => {
    let raf;
    const speed = anxiety > 0.7 ? 0.08 : hope > 0.6 ? 0.06 : 0.025;
    const tick = () => {
      setTailPhase(p => p + speed);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [anxiety, hope]);

  // Paw tap when anxious
  useEffect(() => {
    if (anxiety < 0.4) return;
    const interval = setInterval(() => {
      setPawTap(true);
      setTimeout(() => setPawTap(false), 200);
    }, 600 - anxiety * 400);
    return () => clearInterval(interval);
  }, [anxiety]);

  // Sweat drop when panic
  useEffect(() => {
    if (anxiety < 0.7) { setSweatDrop(false); return; }
    const interval = setInterval(() => {
      setSweatDrop(true);
      setTimeout(() => setSweatDrop(false), 800);
    }, 1200);
    return () => clearInterval(interval);
  }, [anxiety]);

  // Bounce on progress increase
  useEffect(() => {
    if (progressRatio > prevProg) {
      setBounce(true);
      setTimeout(() => setBounce(false), 500);
    }
    setPrevProg(progressRatio);
  }, [progressRatio]);

  // ── Derived visuals ──────────────────────────────
  const shakeX = anxiety > 0.6 ? Math.sin(tailPhase * 8) * (anxiety - 0.6) * 14 : 0;
  const shakeY = anxiety > 0.7 ? Math.cos(tailPhase * 7) * (anxiety - 0.7) * 6  : 0;
  const bounceY = bounce ? -10 : 0;

  // Ear angles: droopy when panicking, perky when hopeful
  const earLRot = anxiety > 0.5 ? -25 + anxiety * -15 : -15 + hope * 20;
  const earRRot =  anxiety > 0.5 ?  25 + anxiety *  15 :  15 - hope * 20;

  // Body color shifts: grey-lavender when sad → warm cream when happy
  const bodyCol  = lerpColor('#c4b8d8', '#fde8c8', mood);
  const innerCol = lerpColor('#ddd6ee', '#fff5e0', mood);
  const noseCol  = mood > 0.5 ? '#f472b6' : anxiety > 0.7 ? '#cc2060' : '#a070b8';

  // Tail wag: slow & droopy when sad, fast & perky when happy, frantic when panicking
  const tailSwing = anxiety > 0.7
    ? Math.sin(tailPhase * 3) * 45        // frantic
    : hope > 0.6
    ? Math.sin(tailPhase * 2) * 35        // happy wagging
    : Math.sin(tailPhase)     * 18;       // slow/droopy

  // Pupil dilation: wide when scared
  const pupilR = anxiety > 0.6 ? 7 + anxiety * 4 : hope > 0.6 ? 5 : 7;

  // Blush
  const blushA = hope > 0.4 ? (hope - 0.4) * 1.2 : 0;

  return (
    <svg
      viewBox="0 0 200 190"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        width: '100%', height: '100%',
        overflow: 'visible',
        filter: `drop-shadow(0 4px 16px rgba(160,100,180,0.2))`,
        transform: `translate(${shakeX}px, ${shakeY + bounceY}px)`,
        transition: bounce ? 'transform 0.1s' : 'transform 0.05s',
      }}
    >
      {/* ── Tail ──────────────────────────────────── */}
      <g transform={`translate(150,145)`}>
        <g transform={`rotate(${tailSwing})`} style={{ transformOrigin: '0 0' }}>
          <path d="M0,0 Q18,-8 26,-28 Q32,-48 20,-60"
            stroke={bodyCol} strokeWidth="13" strokeLinecap="round" fill="none"/>
          <path d="M0,0 Q18,-8 26,-28 Q32,-48 20,-60"
            stroke={innerCol} strokeWidth="7" strokeLinecap="round" fill="none" opacity="0.6"/>
          <circle cx="20" cy="-60" r="9"
            fill={hope > 0.5 ? '#f9a8d4' : anxiety > 0.6 ? '#f87171' : '#c4b0d8'}/>
        </g>
      </g>

      {/* ── Body ──────────────────────────────────── */}
      <ellipse cx="100" cy="148" rx="54" ry="38" fill={bodyCol}/>
      <ellipse cx="100" cy="145" rx="40" ry="28" fill={innerCol}/>

      {/* ── Front paws ────────────────────────────── */}
      <ellipse cx="74" cy={170 + (pawTap ? -3 : 0)} rx="17" ry="11" fill={bodyCol}
        style={{ transition: 'cy 0.05s' }}/>
      <ellipse cx="126" cy={170 + (anxiety > 0.4 && !pawTap ? -3 : 0)} rx="17" ry="11" fill={bodyCol}
        style={{ transition: 'cy 0.05s' }}/>
      <ellipse cx="74"  cy={171 + (pawTap ? -3 : 0)} rx="11" ry="6.5" fill={innerCol}/>
      <ellipse cx="126" cy={171 + (anxiety > 0.4 && !pawTap ? -3 : 0)} rx="11" ry="6.5" fill={innerCol}/>
      {/* Toe lines */}
      {[68,73,78].map((x,i) => (
        <line key={i} x1={x} y1="167" x2={x-1+i} y2="173"
          stroke={bodyCol} strokeWidth="1.2" opacity="0.35"/>
      ))}
      {[120,125,130].map((x,i) => (
        <line key={i} x1={x} y1="167" x2={x-1+i} y2="173"
          stroke={bodyCol} strokeWidth="1.2" opacity="0.35"/>
      ))}

      {/* ── Head ──────────────────────────────────── */}
      <ellipse cx="100" cy="98" rx="48" ry="46" fill={bodyCol}/>
      <ellipse cx="100" cy="100" rx="35" ry="33" fill={innerCol} opacity="0.45"/>

      {/* ── Ears ──────────────────────────────────── */}
      <g transform={`translate(62,58) rotate(${earLRot})`}>
        <polygon points="0,0 -20,-36 18,-30" fill={bodyCol}/>
        <polygon points="2,-3 -11,-26 13,-22" fill={hope > 0.3 ? '#f9a8d4' : '#d0c0e0'}/>
      </g>
      <g transform={`translate(138,58) rotate(${earRRot})`}>
        <polygon points="0,0 20,-36 -18,-30" fill={bodyCol}/>
        <polygon points="-2,-3 11,-26 -13,-22" fill={hope > 0.3 ? '#f9a8d4' : '#d0c0e0'}/>
      </g>

      {/* ── Eyes ──────────────────────────────────── */}
      {blink ? (
        <>
          <path d="M80,95 Q88,91 96,95" stroke="#5a3060" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
          <path d="M104,95 Q112,91 120,95" stroke="#5a3060" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
        </>
      ) : hope > 0.65 ? (
        /* Happy curved ^_^ */
        <>
          <path d="M79,96 Q88,86 97,96" stroke="#5a3060" strokeWidth="3" fill="none" strokeLinecap="round"/>
          <path d="M103,96 Q112,86 121,96" stroke="#5a3060" strokeWidth="3" fill="none" strokeLinecap="round"/>
        </>
      ) : (
        /* Round eyes — bigger = more scared */
        <>
          <circle cx="88" cy="95" r={pupilR} fill="#5a3060"/>
          <circle cx="112" cy="95" r={pupilR} fill="#5a3060"/>
          <circle cx="91"  cy="92" r="2.5" fill="white" opacity="0.9"/>
          <circle cx="115" cy="92" r="2.5" fill="white" opacity="0.9"/>
          {/* Extra scared shine */}
          {anxiety > 0.5 && <>
            <circle cx="84" cy="99" r="1.5" fill="white" opacity="0.6"/>
            <circle cx="108" cy="99" r="1.5" fill="white" opacity="0.6"/>
          </>}
          {/* Worry brows */}
          {anxiety > 0.3 && <>
            <path d="M80,84 Q88,79 95,83" stroke="#5a3060" strokeWidth="2" fill="none" strokeLinecap="round"
              transform={`rotate(${anxiety * 12}, 88, 83)`}/>
            <path d="M105,83 Q112,79 120,84" stroke="#5a3060" strokeWidth="2" fill="none" strokeLinecap="round"
              transform={`rotate(${-anxiety * 12}, 112, 83)`}/>
          </>}
        </>
      )}

      {/* ── Cheek blush ───────────────────────────── */}
      <ellipse cx="72" cy="107" rx="11" ry="6" fill="#f9a8d4" opacity={blushA * 0.65}/>
      <ellipse cx="128" cy="107" rx="11" ry="6" fill="#f9a8d4" opacity={blushA * 0.65}/>

      {/* ── Nose ──────────────────────────────────── */}
      <ellipse cx="100" cy="107" rx="4.5" ry="3" fill={noseCol}/>

      {/* ── Whiskers ──────────────────────────────── */}
      {[
        [54,103, 83,106], [52,109, 82,109], [54,115, 83,112],
        [117,106,146,103],[118,109,148,109],[117,112,146,115],
      ].map(([x1,y1,x2,y2],i) => (
        <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
          stroke="#a090c0" strokeWidth="1.2" opacity="0.55"/>
      ))}

      {/* ── Mouth ─────────────────────────────────── */}
      {hope > 0.6 ? (
        /* Big smile */
        <path d="M90,115 Q100,124 110,115" stroke="#5a3060" strokeWidth="2.2" fill="none" strokeLinecap="round"/>
      ) : anxiety > 0.5 ? (
        /* Worried / trembling */
        <path d="M90,116 Q95,112 100,116 Q105,112 110,116" stroke="#5a3060" strokeWidth="2" fill="none" strokeLinecap="round"/>
      ) : (
        /* Neutral hopeful */
        <path d="M92,115 Q100,118 108,115" stroke="#5a3060" strokeWidth="2" fill="none" strokeLinecap="round"/>
      )}

      {/* ── Sweat drop ────────────────────────────── */}
      {sweatDrop && (
        <g opacity="0.85">
          <ellipse cx="130" cy="82" rx="4" ry="6" fill="#93c5fd" opacity="0.8"/>
          <polygon points="126,82 134,82 130,72" fill="#93c5fd" opacity="0.7"/>
        </g>
      )}

      {/* ── Yarn tangles on body (fade as freed) ─── */}
      {progressRatio < 0.99 && (
        <g opacity={Math.max(0, 1 - progressRatio * 1.3)}>
          <path d="M58,125 Q70,115 82,125 Q92,135 102,122"
            stroke={anxiety > 0.5 ? '#f87171' : '#f472b6'}
            strokeWidth="3.5" fill="none" strokeLinecap="round" opacity="0.55"/>
          <path d="M118,128 Q128,118 140,128"
            stroke="#a78bfa" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.5"/>
          <path d="M82,158 Q94,148 106,158 Q116,166 128,154"
            stroke="#34d399" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.45"/>
          {progressRatio < 0.5 && (
            <path d="M65,108 Q72,98 80,108"
              stroke="#fb923c" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.4"/>
          )}
        </g>
      )}

      {/* ── Sparkles when making progress ─────────── */}
      {hope > 0.3 && (
        <g opacity={(hope - 0.3) * 1.4}>
          <text x="40" y="76" fontSize="13">✨</text>
          <text x="155" y="72" fontSize="11">⭐</text>
        </g>
      )}

      {/* ── Full joy hearts ────────────────────────── */}
      {hope >= 0.99 && (
        <>
          <text x="38" y="62" fontSize="18">💕</text>
          <text x="156" y="58" fontSize="15">💕</text>
          <text x="98" y="52" fontSize="12">✨</text>
        </>
      )}

      {/* ── Timer panic — red tinge overlay ─────── */}
      {anxiety > 0.75 && (
        <ellipse cx="100" cy="120" rx="60" ry="70"
          fill="#ef4444" opacity={(anxiety - 0.75) * 0.12}/>
      )}
    </svg>
  );
}

function lerpColor(hex1, hex2, t) {
  t = Math.max(0, Math.min(1, t));
  const r1 = parseInt(hex1.slice(1,3),16), g1 = parseInt(hex1.slice(3,5),16), b1 = parseInt(hex1.slice(5,7),16);
  const r2 = parseInt(hex2.slice(1,3),16), g2 = parseInt(hex2.slice(3,5),16), b2 = parseInt(hex2.slice(5,7),16);
  return `rgb(${Math.round(r1+(r2-r1)*t)},${Math.round(g1+(g2-g1)*t)},${Math.round(b1+(b2-b1)*t)})`;
}
