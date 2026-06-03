import React, { useEffect, useState, useRef } from 'react';

export default function CatCharacter({ timeRatio = 1, progressRatio = 0, timerStarted = false, onStormOff }) {
  const [blink, setBlink]         = useState(false);
  const [pawTap, setPawTap]       = useState(false);
  const [tailPhase, setTailPhase] = useState(0);
  const [sweatDrop, setSweatDrop] = useState(false);
  const [bounce, setBounce]       = useState(false);
  const [prevProg, setPrevProg]   = useState(progressRatio);
  const [stormX, setStormX]       = useState(0);
  const [storming, setStorming]   = useState(false);
  const stormRef = useRef(false);

  // ── Mood formula ─────────────────────────────────────────────────
  // Worry starts at timeRatio < 0.5 (half time gone), scaled by lack of progress
  // Progress dampens worry but doesn't fully cancel it below 0.3 timeRatio
  const timeWorry   = timerStarted ? Math.max(0, (0.5 - timeRatio) * 2) : 0; // 0→1 as time goes 50%→0%
  const progressDamp = progressRatio * 0.6; // max 60% dampening from progress
  const anxiety     = Math.max(0, timeWorry - progressDamp);
  const hope        = progressRatio;
  const mood        = progressRatio >= 1 ? 1 : Math.max(hope * 0.7, 1 - anxiety);

  // Storm off when time runs out
  useEffect(() => {
    if (timerStarted && timeRatio <= 0 && !stormRef.current) {
      stormRef.current = true;
      setStorming(true);
      // Storm off to the right with angry flailing
      let x = 0;
      const interval = setInterval(() => {
        x += 18;
        setStormX(x);
        if (x > 320) {
          clearInterval(interval);
          onStormOff?.();
        }
      }, 30);
    }
  }, [timeRatio, timerStarted]);

  // Reset storm when restarted
  useEffect(() => {
    if (timeRatio === 1) {
      stormRef.current = false;
      setStorming(false);
      setStormX(0);
    }
  }, [timeRatio]);

  // Blink — much faster when anxious
  useEffect(() => {
    const delay = () => anxiety > 0.7 ? 600 + Math.random()*400 : anxiety > 0.4 ? 1000 + Math.random()*800 : 2000 + Math.random()*1500;
    let t = setTimeout(function tick() {
      setBlink(true);
      setTimeout(() => setBlink(false), 80);
      t = setTimeout(tick, delay());
    }, delay());
    return () => clearTimeout(t);
  }, [anxiety]);

  // Tail animation
  useEffect(() => {
    let raf;
    const speed = anxiety > 0.8 ? 0.12 : anxiety > 0.5 ? 0.08 : hope > 0.6 ? 0.06 : 0.025;
    const tick = () => { setTailPhase(p => p + speed); raf = requestAnimationFrame(tick); };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [anxiety, hope]);

  // Paw tap starts at half time
  useEffect(() => {
    if (anxiety < 0.15) return;
    const rate = Math.max(100, 700 - anxiety * 600);
    const interval = setInterval(() => {
      setPawTap(t => !t);
    }, rate);
    return () => clearInterval(interval);
  }, [anxiety]);

  // Sweat drop at high anxiety
  useEffect(() => {
    if (anxiety < 0.5) { setSweatDrop(false); return; }
    const interval = setInterval(() => {
      setSweatDrop(true);
      setTimeout(() => setSweatDrop(false), 700);
    }, 900);
    return () => clearInterval(interval);
  }, [anxiety]);

  // Bounce on progress
  useEffect(() => {
    if (progressRatio > prevProg) { setBounce(true); setTimeout(() => setBounce(false), 500); }
    setPrevProg(progressRatio);
  }, [progressRatio]);

  // ── Derived visuals ──────────────────────────────────────────────
  const shakeAmt  = anxiety > 0.5 ? (anxiety - 0.5) * 22 : 0;
  const shakeX    = storming ? 0 : Math.sin(tailPhase * 9) * shakeAmt;
  const shakeY    = storming ? 0 : Math.cos(tailPhase * 7) * shakeAmt * 0.5;
  const bounceY   = bounce ? -12 : 0;

  // Ears: very flat/back when angry
  const earLRot = anxiety > 0.7 ? -50 : anxiety > 0.4 ? -30 : -15 + hope * 22;
  const earRRot = anxiety > 0.7 ?  50 : anxiety > 0.4 ?  30 :  15 - hope * 22;

  // Body color
  const bodyCol  = lerpColor('#c4b8d8', anxiety > 0.6 ? '#e8b8b8' : '#fde8c8', mood);
  const innerCol = lerpColor('#ddd6ee', anxiety > 0.6 ? '#f0d0d0' : '#fff5e0', mood);
  const noseCol  = anxiety > 0.8 ? '#cc2020' : anxiety > 0.5 ? '#e05030' : hope > 0.5 ? '#f472b6' : '#a070b8';

  // Tail: lash angrily when anxiety high
  const tailSwing = anxiety > 0.8
    ? Math.sin(tailPhase * 4) * 60 - 20   // angry lashing low
    : anxiety > 0.5
    ? Math.sin(tailPhase * 3) * 50         // agitated
    : hope > 0.6
    ? Math.sin(tailPhase * 2) * 35         // happy wagging
    : Math.sin(tailPhase)     * 18;        // slow/droopy

  const pupilR = anxiety > 0.7 ? 11 : anxiety > 0.4 ? 9 : hope > 0.6 ? 5 : 7;

  const blushA = hope > 0.4 ? (hope - 0.4) * 1.3 : 0;

  // Storm off transform
  const transform = storming
    ? `translateX(${stormX}px) rotate(${stormX * 0.3}deg)`
    : `translate(${shakeX}px, ${shakeY + bounceY}px)`;

  return (
    <svg
      viewBox="0 0 200 190"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        width: '100%', height: '100%',
        overflow: 'visible',
        filter: `drop-shadow(0 4px 16px rgba(160,100,180,0.2))`,
        transform,
        transition: storming ? 'transform 0.03s linear' : bounce ? 'transform 0.1s' : 'transform 0.04s',
      }}
    >
      {/* ── Tail ──────────────────────────────────── */}
      <g transform="translate(150,145)">
        <g transform={`rotate(${tailSwing})`} style={{ transformOrigin: '0 0' }}>
          <path d="M0,0 Q18,-8 26,-28 Q32,-48 20,-60"
            stroke={bodyCol} strokeWidth="13" strokeLinecap="round" fill="none"/>
          <path d="M0,0 Q18,-8 26,-28 Q32,-48 20,-60"
            stroke={innerCol} strokeWidth="7" strokeLinecap="round" fill="none" opacity="0.6"/>
          <circle cx="20" cy="-60" r="9"
            fill={anxiety > 0.7 ? '#ef4444' : hope > 0.5 ? '#f9a8d4' : '#c4b0d8'}/>
        </g>
      </g>

      {/* ── Body ──────────────────────────────────── */}
      <ellipse cx="100" cy="148" rx="54" ry="38" fill={bodyCol}/>
      <ellipse cx="100" cy="145" rx="40" ry="28" fill={innerCol}/>

      {/* ── Front paws ────────────────────────────── */}
      <ellipse cx="74"  cy={170 + (pawTap  ? -5 : 0)} rx="17" ry="11" fill={bodyCol} style={{ transition: 'cy 0.06s' }}/>
      <ellipse cx="126" cy={170 + (!pawTap && anxiety > 0.2 ? -5 : 0)} rx="17" ry="11" fill={bodyCol} style={{ transition: 'cy 0.06s' }}/>
      <ellipse cx="74"  cy={171 + (pawTap  ? -5 : 0)} rx="11" ry="6.5" fill={innerCol}/>
      <ellipse cx="126" cy={171 + (!pawTap && anxiety > 0.2 ? -5 : 0)} rx="11" ry="6.5" fill={innerCol}/>
      {[68,73,78].map((x,i) => (
        <line key={i} x1={x} y1="167" x2={x-1+i} y2="173" stroke={bodyCol} strokeWidth="1.2" opacity="0.35"/>
      ))}
      {[120,125,130].map((x,i) => (
        <line key={i} x1={x} y1="167" x2={x-1+i} y2="173" stroke={bodyCol} strokeWidth="1.2" opacity="0.35"/>
      ))}

      {/* ── Head ──────────────────────────────────── */}
      <ellipse cx="100" cy="98" rx="48" ry="46" fill={bodyCol}/>
      <ellipse cx="100" cy="100" rx="35" ry="33" fill={innerCol} opacity="0.45"/>

      {/* ── Ears — flat back when angry ───────────── */}
      <g transform={`translate(62,58) rotate(${earLRot})`}>
        <polygon points="0,0 -20,-36 18,-30" fill={bodyCol}/>
        <polygon points="2,-3 -11,-26 13,-22" fill={anxiety > 0.6 ? '#ef9090' : hope > 0.3 ? '#f9a8d4' : '#d0c0e0'}/>
      </g>
      <g transform={`translate(138,58) rotate(${earRRot})`}>
        <polygon points="0,0 20,-36 -18,-30" fill={bodyCol}/>
        <polygon points="-2,-3 11,-26 -13,-22" fill={anxiety > 0.6 ? '#ef9090' : hope > 0.3 ? '#f9a8d4' : '#d0c0e0'}/>
      </g>

      {/* ── Eyes ──────────────────────────────────── */}
      {blink ? (
        <>
          <path d="M80,95 Q88,91 96,95" stroke="#5a3060" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
          <path d="M104,95 Q112,91 120,95" stroke="#5a3060" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
        </>
      ) : anxiety > 0.75 ? (
        /* ANGRY — slanted lines */
        <>
          <ellipse cx="88" cy="96" rx="9" ry="7" fill="#5a3060"/>
          <ellipse cx="112" cy="96" rx="9" ry="7" fill="#5a3060"/>
          <circle cx="91" cy="93" r="2" fill="white" opacity="0.7"/>
          <circle cx="115" cy="93" r="2" fill="white" opacity="0.7"/>
          {/* Angry slanted brows — thick and down-angled */}
          <line x1="78" y1="82" x2="96" y2="88" stroke="#5a3060" strokeWidth="3.5" strokeLinecap="round"/>
          <line x1="104" y1="88" x2="122" y2="82" stroke="#5a3060" strokeWidth="3.5" strokeLinecap="round"/>
        </>
      ) : hope > 0.65 ? (
        /* Happy ^_^ */
        <>
          <path d="M79,96 Q88,86 97,96" stroke="#5a3060" strokeWidth="3" fill="none" strokeLinecap="round"/>
          <path d="M103,96 Q112,86 121,96" stroke="#5a3060" strokeWidth="3" fill="none" strokeLinecap="round"/>
        </>
      ) : (
        /* Normal / worried */
        <>
          <circle cx="88" cy="95" r={pupilR} fill="#5a3060"/>
          <circle cx="112" cy="95" r={pupilR} fill="#5a3060"/>
          <circle cx="91" cy="92" r="2.5" fill="white" opacity="0.9"/>
          <circle cx="115" cy="92" r="2.5" fill="white" opacity="0.9"/>
          {anxiety > 0.5 && <>
            <circle cx="84" cy="99" r="1.5" fill="white" opacity="0.55"/>
            <circle cx="108" cy="99" r="1.5" fill="white" opacity="0.55"/>
          </>}
          {/* Worry brows start at half time */}
          {anxiety > 0.05 && <>
            <path d="M80,84 Q88,79 95,83" stroke="#5a3060" strokeWidth="2.2" fill="none" strokeLinecap="round"
              transform={`rotate(${Math.min(anxiety * 18, 18)}, 88, 83)`}/>
            <path d="M105,83 Q112,79 120,84" stroke="#5a3060" strokeWidth="2.2" fill="none" strokeLinecap="round"
              transform={`rotate(${-Math.min(anxiety * 18, 18)}, 112, 83)`}/>
          </>}
        </>
      )}

      {/* ── Cheek blush ───────────────────────────── */}
      <ellipse cx="72" cy="107" rx="11" ry="6" fill="#f9a8d4" opacity={blushA * 0.65}/>
      <ellipse cx="128" cy="107" rx="11" ry="6" fill="#f9a8d4" opacity={blushA * 0.65}/>

      {/* ── Anger veins ───────────────────────────── */}
      {anxiety > 0.75 && (
        <g opacity={(anxiety - 0.75) * 3}>
          <path d="M58,78 L63,72 L68,78 L63,84 Z" fill="#ef4444" opacity="0.7"/>
          <path d="M132,76 L137,70 L142,76 L137,82 Z" fill="#ef4444" opacity="0.6"/>
        </g>
      )}

      {/* ── Nose ──────────────────────────────────── */}
      <ellipse cx="100" cy="107" rx="4.5" ry="3" fill={noseCol}/>

      {/* ── Whiskers ──────────────────────────────── */}
      {[
        [54,103, 83,106],[52,109, 82,109],[54,115, 83,112],
        [117,106,146,103],[118,109,148,109],[117,112,146,115],
      ].map(([x1,y1,x2,y2],i) => (
        <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
          stroke={anxiety > 0.6 ? '#c04040' : '#a090c0'} strokeWidth="1.2" opacity="0.55"/>
      ))}

      {/* ── Mouth ─────────────────────────────────── */}
      {anxiety > 0.75 ? (
        /* HISSING — open angry mouth with teeth */
        <>
          <path d="M86,114 Q93,122 100,116 Q107,122 114,114"
            stroke="#5a3060" strokeWidth="2.2" fill="#f87171" fillOpacity="0.5" strokeLinecap="round"/>
          <line x1="92" y1="114" x2="92" y2="118" stroke="white" strokeWidth="1.5"/>
          <line x1="100" y1="114" x2="100" y2="120" stroke="white" strokeWidth="1.5"/>
          <line x1="108" y1="114" x2="108" y2="118" stroke="white" strokeWidth="1.5"/>
        </>
      ) : hope > 0.6 ? (
        <path d="M90,115 Q100,124 110,115" stroke="#5a3060" strokeWidth="2.2" fill="none" strokeLinecap="round"/>
      ) : anxiety > 0.3 ? (
        /* Trembling worried */
        <path d="M89,116 Q94,112 100,116 Q106,112 111,116"
          stroke="#5a3060" strokeWidth="2" fill="none" strokeLinecap="round"/>
      ) : (
        <path d="M92,115 Q100,118 108,115" stroke="#5a3060" strokeWidth="2" fill="none" strokeLinecap="round"/>
      )}

      {/* ── Sweat drop ────────────────────────────── */}
      {sweatDrop && (
        <g opacity="0.85">
          <ellipse cx="132" cy="82" rx="4" ry="6" fill="#93c5fd" opacity="0.8"/>
          <polygon points="128,82 136,82 132,72" fill="#93c5fd" opacity="0.7"/>
        </g>
      )}

      {/* ── Anger smoke puffs when storming ──────── */}
      {storming && (
        <g transform="translate(-30, 80)">
          <circle cx="0"  cy="0"  r="10" fill="#6b7280" opacity="0.5"/>
          <circle cx="-15" cy="-8" r="8"  fill="#6b7280" opacity="0.4"/>
          <circle cx="-28" cy="-4" r="6"  fill="#6b7280" opacity="0.3"/>
        </g>
      )}

      {/* ── Yarn tangles (fade as freed) ─────────── */}
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

      {/* ── Red panic tinge ──────────────────────── */}
      {anxiety > 0.6 && (
        <ellipse cx="100" cy="120" rx="62" ry="72"
          fill="#ef4444" opacity={(anxiety - 0.6) * 0.14}/>
      )}

      {/* ── Sparkles / hearts ────────────────────── */}
      {hope > 0.3 && !storming && (
        <g opacity={Math.min(1, (hope - 0.3) * 1.4)}>
          <text x="40" y="76" fontSize="13">✨</text>
          <text x="155" y="72" fontSize="11">⭐</text>
        </g>
      )}
      {hope >= 0.99 && (
        <>
          <text x="38" y="62" fontSize="18">💕</text>
          <text x="156" y="58" fontSize="15">💕</text>
          <text x="98" y="52" fontSize="12">✨</text>
        </>
      )}
    </svg>
  );
}

function lerpColor(hex1, hex2, t) {
  t = Math.max(0, Math.min(1, t));
  const r1=parseInt(hex1.slice(1,3),16),g1=parseInt(hex1.slice(3,5),16),b1=parseInt(hex1.slice(5,7),16);
  const r2=parseInt(hex2.slice(1,3),16),g2=parseInt(hex2.slice(3,5),16),b2=parseInt(hex2.slice(5,7),16);
  return `rgb(${Math.round(r1+(r2-r1)*t)},${Math.round(g1+(g2-g1)*t)},${Math.round(b1+(b2-b1)*t)})`;
}
