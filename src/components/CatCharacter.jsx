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

  const timeWorry    = timerStarted ? Math.max(0, (0.5 - timeRatio) * 2) : 0;
  const progressDamp = progressRatio * 0.6;
  const anxiety      = Math.max(0, timeWorry - progressDamp);
  const hope         = progressRatio;
  const mood         = progressRatio >= 1 ? 1 : Math.max(hope * 0.7, 1 - anxiety);

  // Storm off on time out
  useEffect(() => {
    if (timerStarted && timeRatio <= 0 && !stormRef.current) {
      stormRef.current = true;
      setStorming(true);
      let x = 0;
      const iv = setInterval(() => {
        x += 16;
        setStormX(x);
        if (x > 340) { clearInterval(iv); onStormOff?.(); }
      }, 28);
    }
  }, [timeRatio, timerStarted]);

  useEffect(() => {
    if (timeRatio === 1) { stormRef.current = false; setStorming(false); setStormX(0); }
  }, [timeRatio]);

  // Blink
  useEffect(() => {
    const delay = () => anxiety > 0.7 ? 500 + Math.random()*300 : anxiety > 0.4 ? 1000 + Math.random()*700 : 2200 + Math.random()*1500;
    let t = setTimeout(function tick() {
      setBlink(true);
      setTimeout(() => setBlink(false), 90);
      t = setTimeout(tick, delay());
    }, delay());
    return () => clearTimeout(t);
  }, [anxiety]);

  // Tail
  useEffect(() => {
    let raf;
    const spd = anxiety > 0.8 ? 0.13 : anxiety > 0.5 ? 0.09 : hope > 0.6 ? 0.065 : 0.028;
    const tick = () => { setTailPhase(p => p + spd); raf = requestAnimationFrame(tick); };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [anxiety, hope]);

  // Paw tap
  useEffect(() => {
    if (anxiety < 0.12) return;
    const rate = Math.max(90, 650 - anxiety * 550);
    const iv = setInterval(() => setPawTap(t => !t), rate);
    return () => clearInterval(iv);
  }, [anxiety]);

  // Sweat
  useEffect(() => {
    if (anxiety < 0.45) { setSweatDrop(false); return; }
    const iv = setInterval(() => { setSweatDrop(true); setTimeout(() => setSweatDrop(false), 700); }, 850);
    return () => clearInterval(iv);
  }, [anxiety]);

  // Bounce on progress
  useEffect(() => {
    if (progressRatio > prevProg) { setBounce(true); setTimeout(() => setBounce(false), 500); }
    setPrevProg(progressRatio);
  }, [progressRatio]);

  const shakeAmt = anxiety > 0.5 ? (anxiety - 0.5) * 20 : 0;
  const shakeX   = storming ? 0 : Math.sin(tailPhase * 9) * shakeAmt;
  const shakeY   = storming ? 0 : Math.cos(tailPhase * 7) * shakeAmt * 0.45;
  const bounceY  = bounce ? -11 : 0;

  // Ear droop when angry
  const earLTip = anxiety > 0.7 ? { x: 38, y: 14 } : anxiety > 0.4 ? { x: 42, y: 10 } : { x: 46, y: 4 };
  const earRTip = anxiety > 0.7 ? { x: 122, y: 14 } : anxiety > 0.4 ? { x: 118, y: 10 } : { x: 114, y: 4 };

  // Fur color: warm cream/apricot, shifts slightly reddish when angry
  const furMain  = anxiety > 0.7 ? '#f0c8a0' : '#f5deb3';
  const furLight = anxiety > 0.7 ? '#fde0c8' : '#fdf0d8';
  const furDark  = anxiety > 0.7 ? '#d4956a' : '#e8c88a';
  const furInner = '#fff8ee';
  const stripeCol = anxiety > 0.7 ? '#c8845a' : '#d4a870';

  // Tail swing
  const tailSwing = anxiety > 0.8
    ? Math.sin(tailPhase * 4) * 65 - 25
    : anxiety > 0.5
    ? Math.sin(tailPhase * 3) * 52
    : hope > 0.6
    ? Math.sin(tailPhase * 2) * 38
    : Math.sin(tailPhase)     * 20;

  const transform = storming
    ? `translateX(${stormX}px) rotate(${stormX * 0.25}deg)`
    : `translate(${shakeX}px, ${shakeY + bounceY}px)`;

  return (
    <svg
      viewBox="-10 0 220 230"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        width: '80%', height: '80%',
        overflow: 'visible',
        filter: 'drop-shadow(0 6px 18px rgba(140,90,60,0.22))',
        transform,
        transition: storming ? 'transform 0.03s linear' : bounce ? 'transform 0.08s' : 'transform 0.04s',
      }}
    >
      <defs>
        {/* Fur gradient for head */}
        <radialGradient id="headGrad" cx="48%" cy="44%" r="55%">
          <stop offset="0%"   stopColor={furLight}/>
          <stop offset="60%"  stopColor={furMain}/>
          <stop offset="100%" stopColor={furDark}/>
        </radialGradient>
        {/* Body gradient */}
        <radialGradient id="bodyGrad" cx="50%" cy="38%" r="60%">
          <stop offset="0%"   stopColor={furLight}/>
          <stop offset="70%"  stopColor={furMain}/>
          <stop offset="100%" stopColor={furDark}/>
        </radialGradient>
        {/* Eye iris gradient */}
        <radialGradient id="irisL" cx="38%" cy="32%" r="65%">
          <stop offset="0%"   stopColor="#a8e86a"/>
          <stop offset="45%"  stopColor="#5cb85c"/>
          <stop offset="100%" stopColor="#2d6e2d"/>
        </radialGradient>
        <radialGradient id="irisR" cx="38%" cy="32%" r="65%">
          <stop offset="0%"   stopColor="#a8e86a"/>
          <stop offset="45%"  stopColor="#5cb85c"/>
          <stop offset="100%" stopColor="#2d6e2d"/>
        </radialGradient>
        {/* Angry iris */}
        <radialGradient id="irisAngry" cx="38%" cy="32%" r="65%">
          <stop offset="0%"   stopColor="#f87060"/>
          <stop offset="50%"  stopColor="#d04030"/>
          <stop offset="100%" stopColor="#8b1a10"/>
        </radialGradient>
        {/* Tail gradient */}
        <radialGradient id="tailGrad" cx="30%" cy="30%" r="70%">
          <stop offset="0%" stopColor={furLight}/>
          <stop offset="100%" stopColor={furDark}/>
        </radialGradient>
        {/* Fur texture filter */}
        <filter id="furry" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" result="noise"/>
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="2.2" xChannelSelector="R" yChannelSelector="G"/>
        </filter>
      </defs>

      {/* ═══════════════════════════════════════
          TAIL (behind body)
      ═══════════════════════════════════════ */}
      <g transform="translate(148, 152)">
        <g transform={`rotate(${tailSwing})`} style={{ transformOrigin: '0 0' }}>
          {/* Tail main shape — thick fluffy bezier */}
          <path
            d="M0,0 C8,-5 18,-12 24,-28 C30,-44 28,-58 18,-68 C14,-73 8,-75 10,-68 C12,-62 16,-54 14,-42 C12,-30 6,-18 0,-8 Z"
            fill="url(#tailGrad)"
            filter="url(#furry)"
          />
          {/* Tail inner lighter stripe */}
          <path
            d="M3,-4 C9,-10 16,-18 20,-32 C24,-46 22,-56 15,-63"
            stroke={furLight} strokeWidth="5" fill="none" strokeLinecap="round" opacity="0.5"
          />
          {/* Tail tip fluffy ball */}
          <ellipse cx="14" cy="-68" rx="11" ry="10"
            fill={anxiety > 0.7 ? '#f87171' : hope > 0.5 ? '#fda4af' : furLight}
            filter="url(#furry)"/>
          {/* Fur wisps on tail tip */}
          {[-8,-3,3,8,12].map((dx,i) => (
            <line key={i}
              x1={14+dx} y1={-62+Math.abs(dx)*0.3}
              x2={14+dx*1.4} y2={-75-Math.abs(dx)*0.5}
              stroke={furLight} strokeWidth="1.2" opacity="0.55" strokeLinecap="round"/>
          ))}
          {/* Tail stripe marks */}
          {[[-16,-4],[-28,0],[-42,2]].map(([y,r],i) => (
            <path key={i}
              d={`M${4+r},${y} Q${10+r},${y-2} ${18+r},${y}`}
              stroke={stripeCol} strokeWidth="2" fill="none" opacity="0.35" strokeLinecap="round"/>
          ))}
        </g>
      </g>

      {/* ═══════════════════════════════════════
          BODY
      ═══════════════════════════════════════ */}
      {/* Body shadow */}
      <ellipse cx="100" cy="175" rx="52" ry="10" fill="rgba(100,60,20,0.12)"/>

      {/* Main body — rounded organic shape */}
      <path
        d="M52,148 C46,138 44,124 48,114 C52,104 58,100 68,98 C78,96 86,100 100,100 C114,100 122,96 132,98 C142,100 148,104 152,114 C156,124 154,138 148,148 C142,162 128,178 100,180 C72,178 58,162 52,148 Z"
        fill="url(#bodyGrad)"
        filter="url(#furry)"
      />
      {/* Belly — lighter soft patch */}
      <path
        d="M72,120 C68,130 70,152 100,158 C130,152 132,130 128,120 C120,112 80,112 72,120 Z"
        fill={furInner} opacity="0.75"
        filter="url(#furry)"
      />
      {/* Body tabby stripes */}
      {[
        "M60,130 Q70,126 78,132",
        "M58,142 Q68,138 76,144",
        "M122,132 Q130,126 140,130",
        "M124,144 Q132,138 142,142",
      ].map((d,i) => (
        <path key={i} d={d} stroke={stripeCol} strokeWidth="2.2" fill="none" opacity="0.3" strokeLinecap="round"/>
      ))}
      {/* Body fur wisps at edges */}
      {[
        [52,148, 44,154],[56,160, 48,168],[64,172, 58,180],
        [148,148,156,154],[144,160,152,168],[136,172,142,180],
      ].map(([x1,y1,x2,y2],i) => (
        <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
          stroke={furMain} strokeWidth="2.2" opacity="0.4" strokeLinecap="round"/>
      ))}

      {/* ═══════════════════════════════════════
          FRONT PAWS
      ═══════════════════════════════════════ */}
      {/* Left paw */}
      <g transform={`translate(0, ${pawTap ? -4 : 0})`} style={{ transition: 'transform 0.07s' }}>
        <path
          d="M68,172 C60,168 56,178 60,186 C64,192 78,194 84,190 C88,186 86,176 80,172 Z"
          fill="url(#bodyGrad)" filter="url(#furry)"/>
        {/* Paw toe beans — rounded bumps */}
        <ellipse cx="64" cy="188" rx="5" ry="4" fill="#e8b4b8" opacity="0.7"/>
        <ellipse cx="72" cy="191" rx="5.5" ry="4" fill="#e8b4b8" opacity="0.7"/>
        <ellipse cx="80" cy="189" rx="5" ry="4" fill="#e8b4b8" opacity="0.7"/>
        {/* Tiny toe lines */}
        <path d="M63,184 Q64,190 65,184" stroke={furDark} strokeWidth="0.8" fill="none" opacity="0.3"/>
        <path d="M71,186 Q72,193 73,186" stroke={furDark} strokeWidth="0.8" fill="none" opacity="0.3"/>
        <path d="M79,185 Q80,190 81,185" stroke={furDark} strokeWidth="0.8" fill="none" opacity="0.3"/>
        {/* Fur wisps over paw */}
        {[60,66,72,78,84].map((x,i) => (
          <line key={i} x1={x} y1="172" x2={x-1} y2="164"
            stroke={furMain} strokeWidth="1.5" opacity="0.35" strokeLinecap="round"/>
        ))}
        {/* Claws peeking when angry */}
        {anxiety > 0.6 && [62,70,78].map((x,i) => (
          <path key={i} d={`M${x},190 Q${x+1},196 ${x-1},198`}
            stroke="#c8a090" strokeWidth="1.2" fill="none" opacity="0.7" strokeLinecap="round"/>
        ))}
      </g>

      {/* Right paw */}
      <g transform={`translate(0, ${!pawTap && anxiety > 0.15 ? -4 : 0})`} style={{ transition: 'transform 0.07s' }}>
        <path
          d="M132,172 C126,176 114,186 120,190 C126,194 140,192 144,186 C148,178 144,168 136,172 Z"
          fill="url(#bodyGrad)" filter="url(#furry)"/>
        <ellipse cx="120" cy="189" rx="5" ry="4" fill="#e8b4b8" opacity="0.7"/>
        <ellipse cx="128" cy="191" rx="5.5" ry="4" fill="#e8b4b8" opacity="0.7"/>
        <ellipse cx="136" cy="188" rx="5" ry="4" fill="#e8b4b8" opacity="0.7"/>
        <path d="M119,185 Q120,190 121,185" stroke={furDark} strokeWidth="0.8" fill="none" opacity="0.3"/>
        <path d="M127,186 Q128,193 129,186" stroke={furDark} strokeWidth="0.8" fill="none" opacity="0.3"/>
        <path d="M135,184 Q136,190 137,185" stroke={furDark} strokeWidth="0.8" fill="none" opacity="0.3"/>
        {[116,122,128,134,140].map((x,i) => (
          <line key={i} x1={x} y1="172" x2={x+1} y2="164"
            stroke={furMain} strokeWidth="1.5" opacity="0.35" strokeLinecap="round"/>
        ))}
        {anxiety > 0.6 && [120,128,136].map((x,i) => (
          <path key={i} d={`M${x},190 Q${x+1},196 ${x-1},198`}
            stroke="#c8a090" strokeWidth="1.2" fill="none" opacity="0.7" strokeLinecap="round"/>
        ))}
      </g>

      {/* ═══════════════════════════════════════
          HEAD
      ═══════════════════════════════════════ */}
      {/* Head shadow under chin */}
      <ellipse cx="100" cy="108" rx="42" ry="8" fill="rgba(100,60,20,0.08)"/>

      {/* Main head shape — wide rounded with chubby cheeks */}
      <path
        d="M46,78 C42,62 50,44 64,36 C74,30 86,28 100,28 C114,28 126,30 136,36 C150,44 158,62 154,78 C158,88 160,98 156,108 C150,120 138,126 124,128 C116,130 108,130 100,130 C92,130 84,130 76,128 C62,126 50,120 44,108 C40,98 42,88 46,78 Z"
        fill="url(#headGrad)"
        filter="url(#furry)"
      />

      {/* Chubby cheek puffs — the roundness that makes it look real */}
      <path
        d="M44,88 C36,84 32,92 36,100 C40,108 52,112 60,108 C54,102 48,96 44,88 Z"
        fill={furMain} filter="url(#furry)" opacity="0.9"
      />
      <path
        d="M156,88 C164,84 168,92 164,100 C160,108 148,112 140,108 C146,102 152,96 156,88 Z"
        fill={furMain} filter="url(#furry)" opacity="0.9"
      />

      {/* Head tabby stripes on forehead */}
      {[
        "M88,34 Q100,30 112,34",
        "M84,42 Q100,37 116,42",
        "M86,50 Q100,46 114,50",
      ].map((d,i) => (
        <path key={i} d={d} stroke={stripeCol} strokeWidth="2" fill="none" opacity="0.28" strokeLinecap="round"/>
      ))}
      {/* M-mark on forehead (tabby characteristic) */}
      <path d="M88,56 Q94,50 100,56 Q106,50 112,56"
        stroke={stripeCol} strokeWidth="1.8" fill="none" opacity="0.25" strokeLinecap="round"/>

      {/* Fur wisps around face edge */}
      {[
        [46,78, 38,74],[44,88, 36,86],[46,98, 38,98],
        [154,78,162,74],[156,88,164,86],[154,98,162,98],
        [60,30, 56,22],[76,28, 74,20],[100,28, 100,20],[124,28, 126,20],[140,30, 144,22],
      ].map(([x1,y1,x2,y2],i) => (
        <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
          stroke={furMain} strokeWidth="2" opacity="0.38" strokeLinecap="round"/>
      ))}

      {/* ═══════════════════════════════════════
          EARS
      ═══════════════════════════════════════ */}
      {/* Left ear */}
      <path
        d={`M52,52 C50,38 ${earLTip.x},${earLTip.y} 56,28 C62,40 68,50 64,58 Z`}
        fill={furMain} filter="url(#furry)"
      />
      {/* Left ear inner pink */}
      <path
        d={`M54,50 C53,40 ${earLTip.x+4},${earLTip.y+8} 57,32 C61,40 64,50 61,56 Z`}
        fill={anxiety > 0.6 ? '#f87060' : '#f4a0b0'} opacity="0.65"
      />
      {/* Left ear fur wisps */}
      {[[48,46,42,38],[50,38,44,30],[56,28,54,20]].map(([x1,y1,x2,y2],i) => (
        <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
          stroke={furMain} strokeWidth="1.8" opacity="0.4" strokeLinecap="round"/>
      ))}

      {/* Right ear */}
      <path
        d={`M148,52 C150,38 ${earRTip.x},${earRTip.y} 144,28 C138,40 132,50 136,58 Z`}
        fill={furMain} filter="url(#furry)"
      />
      <path
        d={`M146,50 C147,40 ${earRTip.x-4},${earRTip.y+8} 143,32 C139,40 136,50 139,56 Z`}
        fill={anxiety > 0.6 ? '#f87060' : '#f4a0b0'} opacity="0.65"
      />
      {[[152,46,158,38],[150,38,156,30],[144,28,146,20]].map(([x1,y1,x2,y2],i) => (
        <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
          stroke={furMain} strokeWidth="1.8" opacity="0.4" strokeLinecap="round"/>
      ))}

      {/* ═══════════════════════════════════════
          EYES
      ═══════════════════════════════════════ */}
      {/* Eye whites / base */}
      <ellipse cx="78" cy="80" rx="16" ry={blink ? 1 : anxiety > 0.7 ? 11 : 13} fill="white"
        style={{ transition: 'ry 0.06s' }}/>
      <ellipse cx="122" cy="80" rx="16" ry={blink ? 1 : anxiety > 0.7 ? 11 : 13} fill="white"
        style={{ transition: 'ry 0.06s' }}/>

      {!blink && (
        <>
          {hope > 0.65 ? (
            /* Happy crescent eyes */
            <>
              <path d="M62,82 Q78,68 94,82" stroke="#3a2040" strokeWidth="3.5" fill="none"
                strokeLinecap="round" clipPath="none"/>
              <ellipse cx="78" cy="80" rx="16" ry="13" fill="none"
                stroke="#3a2040" strokeWidth="1" opacity="0.15"/>
              <path d="M106,82 Q122,68 138,82" stroke="#3a2040" strokeWidth="3.5" fill="none"
                strokeLinecap="round"/>
            </>
          ) : (
            <>
              {/* Iris — green or angry red */}
              <ellipse cx="78" cy="80" rx="12"
                ry={anxiety > 0.7 ? 10 : 12}
                fill={anxiety > 0.7 ? "url(#irisAngry)" : "url(#irisL)"}/>
              <ellipse cx="122" cy="80" rx="12"
                ry={anxiety > 0.7 ? 10 : 12}
                fill={anxiety > 0.7 ? "url(#irisAngry)" : "url(#irisR)"}/>

              {/* Pupil — slit when angry, round otherwise */}
              {anxiety > 0.6 ? (
                <>
                  <ellipse cx="78" cy="80" rx="3" ry={anxiety > 0.8 ? 9 : 7} fill="#1a0a08"/>
                  <ellipse cx="122" cy="80" rx="3" ry={anxiety > 0.8 ? 9 : 7} fill="#1a0a08"/>
                </>
              ) : (
                <>
                  <circle cx="78" cy="80"  r={hope > 0.4 ? 5 : 7} fill="#1a0a20"/>
                  <circle cx="122" cy="80" r={hope > 0.4 ? 5 : 7} fill="#1a0a20"/>
                </>
              )}

              {/* Catchlight — makes eyes look alive */}
              <circle cx="83" cy="74" r="3.5" fill="white" opacity="0.92"/>
              <circle cx="127" cy="74" r="3.5" fill="white" opacity="0.92"/>
              <circle cx="72" cy="85" r="1.5" fill="white" opacity="0.45"/>
              <circle cx="116" cy="85" r="1.5" fill="white" opacity="0.45"/>

              {/* Eyelid shadow top */}
              <path d="M62,76 Q78,70 94,76" stroke="#3a2040" strokeWidth="1.5"
                fill="rgba(60,32,64,0.12)" strokeLinecap="round"/>
              <path d="M106,76 Q122,70 138,76" stroke="#3a2040" strokeWidth="1.5"
                fill="rgba(60,32,64,0.12)" strokeLinecap="round"/>

              {/* Lash hints */}
              {[[62,76,58,70],[66,72,63,66],[70,70,68,64]].map(([x1,y1,x2,y2],i) => (
                <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
                  stroke="#3a2040" strokeWidth="1.2" opacity="0.4" strokeLinecap="round"/>
              ))}
              {[[130,72,132,66],[134,72,137,66],[138,76,142,70]].map(([x1,y1,x2,y2],i) => (
                <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
                  stroke="#3a2040" strokeWidth="1.2" opacity="0.4" strokeLinecap="round"/>
              ))}
            </>
          )}

          {/* Eyelid outline */}
          <path d="M62,80 Q78,68 94,80 Q78,93 62,80 Z"
            fill="none" stroke="#3a2040" strokeWidth="1.8" opacity="0.4"/>
          <path d="M106,80 Q122,68 138,80 Q122,93 106,80 Z"
            fill="none" stroke="#3a2040" strokeWidth="1.8" opacity="0.4"/>

          {/* Eyebrows — worry / angry */}
          {anxiety > 0.75 ? (
            /* THICK ANGRY brows slanting hard inward */
            <>
              <path d="M60,66 Q70,72 82,68" stroke="#3a2040" strokeWidth="4" fill="none"
                strokeLinecap="round" opacity="0.85"/>
              <path d="M118,68 Q130,72 140,66" stroke="#3a2040" strokeWidth="4" fill="none"
                strokeLinecap="round" opacity="0.85"/>
            </>
          ) : anxiety > 0.08 ? (
            /* Soft worry brows */
            <>
              <path d="M62,68 Q70,64 82,67" stroke="#3a2040" strokeWidth="2.2" fill="none"
                strokeLinecap="round" opacity="0.55"
                transform={`rotate(${Math.min(anxiety*22,22)}, 72, 66)`}/>
              <path d="M118,67 Q130,64 138,68" stroke="#3a2040" strokeWidth="2.2" fill="none"
                strokeLinecap="round" opacity="0.55"
                transform={`rotate(${-Math.min(anxiety*22,22)}, 128, 66)`}/>
            </>
          ) : null}
        </>
      )}

      {/* ═══════════════════════════════════════
          NOSE + MUZZLE + MOUTH
      ═══════════════════════════════════════ */}
      {/* Muzzle — two soft puffs */}
      <ellipse cx="88"  cy="102" rx="12" ry="9" fill={furInner} opacity="0.7"/>
      <ellipse cx="112" cy="102" rx="12" ry="9" fill={furInner} opacity="0.7"/>

      {/* Nose — small heart-like triangle */}
      <path
        d="M97,97 Q100,94 103,97 Q100,102 97,97 Z"
        fill={anxiety > 0.7 ? '#d04030' : hope > 0.5 ? '#f472b6' : '#c87090'}
      />
      <path d="M97,97 Q100,94 103,97" stroke={anxiety > 0.7 ? '#a02010' : '#a05070'}
        strokeWidth="0.8" fill="none"/>

      {/* Philtrum line */}
      <line x1="100" y1="100" x2="100" y2="106" stroke="#c87090" strokeWidth="1.2" opacity="0.5"/>

      {/* Mouth */}
      {anxiety > 0.75 ? (
        /* HISS — open with teeth showing */
        <>
          <path d="M88,108 Q94,118 100,112 Q106,118 112,108"
            stroke="#3a2040" strokeWidth="1.8" fill="rgba(200,60,40,0.35)" strokeLinecap="round"/>
          <line x1="94"  y1="109" x2="94"  y2="115" stroke="white" strokeWidth="1.5" opacity="0.8"/>
          <line x1="100" y1="109" x2="100" y2="117" stroke="white" strokeWidth="1.5" opacity="0.8"/>
          <line x1="106" y1="109" x2="106" y2="115" stroke="white" strokeWidth="1.5" opacity="0.8"/>
        </>
      ) : hope > 0.65 ? (
        /* Happy smile */
        <>
          <path d="M91,108 Q100,116 109,108"
            stroke="#3a2040" strokeWidth="2" fill="none" strokeLinecap="round"/>
          <path d="M91,108 Q87,110 85,107"
            stroke="#3a2040" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
          <path d="M109,108 Q113,110 115,107"
            stroke="#3a2040" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
        </>
      ) : anxiety > 0.3 ? (
        /* Worried tremble */
        <path d="M90,109 Q95,105 100,109 Q105,105 110,109"
          stroke="#3a2040" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
      ) : (
        /* Neutral */
        <path d="M93,109 Q100,112 107,109"
          stroke="#3a2040" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
      )}

      {/* ═══════════════════════════════════════
          WHISKERS
      ═══════════════════════════════════════ */}
      {[
        // Left whiskers — [x1,y1, x2,y2, curve direction]
        [86,100, 50,94],
        [86,103, 48,103],
        [86,106, 50,112],
        // Right whiskers
        [114,100, 150,94],
        [114,103, 152,103],
        [114,106, 150,112],
      ].map(([x1,y1,x2,y2],i) => (
        <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
          stroke="#d4c0a0" strokeWidth="0.9" opacity={anxiety > 0.5 ? 0.8 : 0.55}
          strokeLinecap="round"
          style={{ transform: anxiety > 0.6 ? `rotate(${i < 3 ? -8 : 8}deg)` : 'none',
                   transformOrigin: `${x1}px ${y1}px` }}
        />
      ))}

      {/* ═══════════════════════════════════════
          CHEEK BLUSH
      ═══════════════════════════════════════ */}
      <ellipse cx="62"  cy="96" rx="13" ry="8"
        fill="#f9a8d4" opacity={Math.max(0, (hope - 0.35) * 0.55)}/>
      <ellipse cx="138" cy="96" rx="13" ry="8"
        fill="#f9a8d4" opacity={Math.max(0, (hope - 0.35) * 0.55)}/>

      {/* ═══════════════════════════════════════
          ANGER VEINS
      ═══════════════════════════════════════ */}
      {anxiety > 0.72 && (
        <g opacity={Math.min(1, (anxiety - 0.72) * 4)}>
          <path d="M50,70 L55,64 L60,70 L55,76 Z" fill="#ef4444" opacity="0.6"/>
          <path d="M140,68 L145,62 L150,68 L145,74 Z" fill="#ef4444" opacity="0.55"/>
        </g>
      )}

      {/* Sweat drop */}
      {sweatDrop && (
        <g opacity="0.88">
          <path d="M142,62 Q138,54 142,48 Q146,54 142,62 Z" fill="#93c5fd"/>
          <circle cx="142" cy="63" r="4" fill="#93c5fd"/>
        </g>
      )}

      {/* Red panic tinge */}
      {anxiety > 0.55 && (
        <ellipse cx="100" cy="110" rx="64" ry="80"
          fill="#ef4444" opacity={(anxiety - 0.55) * 0.1}/>
      )}

      {/* ═══════════════════════════════════════
          YARN TANGLES ON BODY
      ═══════════════════════════════════════ */}
      {progressRatio < 0.99 && (
        <g opacity={Math.max(0, 1 - progressRatio * 1.35)}>
          <path d="M56,130 C68,118 80,128 90,118 C96,112 98,120 102,114"
            stroke={anxiety > 0.5 ? '#f87171' : '#f472b6'}
            strokeWidth="3.8" fill="none" strokeLinecap="round" opacity="0.55"/>
          <path d="M122,134 C132,122 142,132 148,124"
            stroke="#a78bfa" strokeWidth="3.2" fill="none" strokeLinecap="round" opacity="0.5"/>
          <path d="M76,164 C88,154 100,164 112,156 C120,150 126,158 132,152"
            stroke="#34d399" strokeWidth="2.8" fill="none" strokeLinecap="round" opacity="0.45"/>
          {progressRatio < 0.5 && (
            <path d="M60,110 C66,100 74,108 80,100"
              stroke="#fb923c" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.4"/>
          )}
          {progressRatio < 0.25 && (
            <path d="M116,100 C122,92 130,100 136,94"
              stroke="#38bdf8" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.4"/>
          )}
        </g>
      )}

      {/* Storm-off smoke */}
      {storming && (
        <g transform="translate(-40, 90)">
          <circle cx="0"  cy="0"  r="12" fill="#9ca3af" opacity="0.45"/>
          <circle cx="-16" cy="-6" r="9"  fill="#9ca3af" opacity="0.35"/>
          <circle cx="-30" cy="-2" r="7"  fill="#9ca3af" opacity="0.25"/>
          <text x="-5" y="-16" fontSize="16" opacity="0.7">💢</text>
        </g>
      )}

      {/* Sparkles + hearts */}
      {hope > 0.3 && !storming && (
        <g opacity={Math.min(1, (hope - 0.3) * 1.5)}>
          <text x="36" y="72" fontSize="14">✨</text>
          <text x="156" y="68" fontSize="12">⭐</text>
        </g>
      )}
      {hope >= 0.99 && (
        <>
          <text x="34" y="58" fontSize="18">💕</text>
          <text x="154" y="54" fontSize="15">💕</text>
          <text x="97" y="46" fontSize="12">✨</text>
        </>
      )}
    </svg>
  );
}
