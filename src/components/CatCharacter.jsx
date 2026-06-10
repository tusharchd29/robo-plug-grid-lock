import React, { useEffect, useState } from 'react';

export default function CatCharacter({ timeRatio = 1, progressRatio = 0, timerStarted = false, onStormOff }) {
  const [blink, setBlink]       = useState(false);
  const [tailWag, setTailWag]   = useState(0);
  const [bounce, setBounce]     = useState(false);
  const [prevProg, setPrevProg] = useState(progressRatio);
  const [stormX, setStormX]     = useState(0);
  const [storming, setStorming] = useState(false);
  const [sweat, setSweat]       = useState(false);

  // anxiety 0-1 based on time left and progress
  const timeWorry = timerStarted ? Math.max(0, (0.5 - timeRatio) * 2) : 0;
  const anxiety   = Math.max(0, timeWorry - progressRatio * 0.6);
  const h         = progressRatio >= 1 ? 1 : Math.max(progressRatio * 0.7, 1 - anxiety);

  // Storm off on timeout
  useEffect(() => {
    if (timerStarted && timeRatio <= 0 && !storming) {
      setStorming(true);
      let x = 0;
      const iv = setInterval(() => {
        x += 16; setStormX(x);
        if (x > 340) { clearInterval(iv); onStormOff?.(); }
      }, 28);
    }
  }, [timeRatio, timerStarted]);

  useEffect(() => {
    if (timeRatio === 1) { setStorming(false); setStormX(0); }
  }, [timeRatio]);

  // Blinking — faster when anxious
  useEffect(() => {
    const delay = () => anxiety > 0.7 ? 400 + Math.random()*200
      : anxiety > 0.4 ? 900 + Math.random()*600
      : 2500 + Math.random()*1500;
    let t = setTimeout(function tick() {
      setBlink(true);
      setTimeout(() => setBlink(false), 100);
      t = setTimeout(tick, delay());
    }, delay());
    return () => clearTimeout(t);
  }, [anxiety]);

  // Tail wag
  useEffect(() => {
    const interval = setInterval(() => {
      setTailWag(t => (t + 1) % 100);
    }, anxiety > 0.7 ? 50 : h > 0.7 ? 80 : h > 0.4 ? 140 : 220);
    return () => clearInterval(interval);
  }, [h, anxiety]);

  // Bounce on progress
  useEffect(() => {
    if (progressRatio > prevProg) {
      setBounce(true);
      setTimeout(() => setBounce(false), 600);
    }
    setPrevProg(progressRatio);
  }, [progressRatio]);

  // Sweat drop when anxious
  useEffect(() => {
    if (anxiety < 0.45) { setSweat(false); return; }
    const iv = setInterval(() => {
      setSweat(true);
      setTimeout(() => setSweat(false), 700);
    }, 900);
    return () => clearInterval(iv);
  }, [anxiety]);

  // ── Derived visuals ──────────────────────────────────────────────────────
  const isAngry   = anxiety > 0.65;
  const isWorried = anxiety > 0.25 && !isAngry;

  // Body color: grey sad → warm cream happy → reddish angry
  const bodyColor  = isAngry
    ? interpolateColor('#fde8c8', '#f0b090', Math.min(1,(anxiety-0.65)*3))
    : interpolateColor('#b8b0c8', '#fde8c8', h);
  const innerColor = isAngry
    ? interpolateColor('#fff0dc', '#fdd0b0', Math.min(1,(anxiety-0.65)*3))
    : interpolateColor('#d8d0e8', '#fff0dc', h);

  // Ear droop when worried, spike when angry
  const earRotL = isAngry ? -30 : -15 + h * 25;
  const earRotR = isAngry ?  30 :  15 - h * 25;
  const earColor = isAngry ? '#f87171' : h > 0.4 ? '#f9a8d4' : '#d4c8e8';

  // Tail swing — furious flick when angry
  const tailAngle = isAngry
    ? Math.sin(tailWag * 0.5) * 55
    : Math.sin(tailWag * 0.2) * (15 + h * 30);

  const mouthCurve = isAngry ? 'angry' : h > 0.5 ? 'smile' : h > 0.2 ? 'neutral' : 'frown';
  const blushOpacity = !isAngry && h > 0.5 ? (h - 0.5) * 2 : 0;
  const bounceY  = bounce ? -8 : 0;

  const transform = storming
    ? `translateX(${stormX}px) rotate(${stormX * 0.25}deg)`
    : `translateY(${bounceY}px)`;

  return (
    <svg
      viewBox="0 0 200 180"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        width: '100%', height: '100%',
        filter: 'drop-shadow(0 4px 12px rgba(180,140,200,0.25))',
        transform,
        transition: storming ? 'transform 0.03s linear' : 'transform 0.15s cubic-bezier(0.34,1.56,0.64,1)',
        overflow: 'visible',
      }}
    >
      {/* Anger vein marks */}
      {isAngry && (
        <g opacity={Math.min(1,(anxiety-0.65)*3)}>
          <path d="M42,72 L47,66 L52,72 L47,78 Z" fill="#ef4444" opacity="0.65"/>
          <path d="M148,70 L153,64 L158,70 L153,76 Z" fill="#ef4444" opacity="0.6"/>
        </g>
      )}

      {/* Tail */}
      <g transform={`translate(148, 138) rotate(${tailAngle})`} style={{ transformOrigin: '0 0' }}>
        <path d="M0,0 Q20,-10 30,-30 Q38,-50 25,-65"
          stroke={bodyColor} strokeWidth="12" strokeLinecap="round" fill="none"/>
        <path d="M0,0 Q20,-10 30,-30 Q38,-50 25,-65"
          stroke={innerColor} strokeWidth="7" strokeLinecap="round" fill="none" opacity="0.6"/>
        <circle cx="25" cy="-65" r="8"
          fill={isAngry ? '#f87171' : h > 0.5 ? '#f9a8d4' : '#c4b8d8'}/>
      </g>

      {/* Body */}
      <ellipse cx="100" cy="140" rx="52" ry="38" fill={bodyColor}/>
      <ellipse cx="100" cy="138" rx="38" ry="28" fill={innerColor}/>

      {/* Paws — tense/raised when angry */}
      <ellipse cx="72"  cy={isAngry ? 160 : 165} rx="16" ry="10" fill={bodyColor}/>
      <ellipse cx="128" cy={isAngry ? 160 : 165} rx="16" ry="10" fill={bodyColor}/>
      <ellipse cx="72"  cy={isAngry ? 161 : 166} rx="10" ry="6"  fill={innerColor}/>
      <ellipse cx="128" cy={isAngry ? 161 : 166} rx="10" ry="6"  fill={innerColor}/>
      {/* Claws when angry */}
      {isAngry && [66,72,78].map((x,i) => (
        <line key={i} x1={x} y1="166" x2={x-1} y2="173"
          stroke="#c8a090" strokeWidth="1.5" opacity="0.8" strokeLinecap="round"/>
      ))}

      {/* Head */}
      <ellipse cx="100" cy="95" rx="46" ry="44" fill={bodyColor}/>
      <ellipse cx="100" cy="97" rx="34" ry="32" fill={innerColor} opacity="0.5"/>

      {/* Red anger flush */}
      {isAngry && (
        <ellipse cx="100" cy="100" rx="46" ry="44"
          fill="#ef4444" opacity={Math.min(0.12,(anxiety-0.65)*0.35)}/>
      )}

      {/* Ears */}
      <g transform={`translate(62, 60) rotate(${earRotL})`}>
        <polygon points="0,0 -18,-32 16,-28" fill={bodyColor}/>
        <polygon points="2,-3 -10,-24 12,-21" fill={earColor}/>
      </g>
      <g transform={`translate(138, 60) rotate(${earRotR})`}>
        <polygon points="0,0 18,-32 -16,-28" fill={bodyColor}/>
        <polygon points="-2,-3 10,-24 -12,-21" fill={earColor}/>
      </g>

      {/* Eyes */}
      {blink ? (
        <>
          <path d="M82,92 Q88,88 94,92" stroke="#5a3e6e" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
          <path d="M106,92 Q112,88 118,92" stroke="#5a3e6e" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
        </>
      ) : isAngry ? (
        // ANGRY — slanted pupils, angry brows
        <>
          <circle cx="88"  cy="93" r="9" fill="#5a3e6e"/>
          <circle cx="112" cy="93" r="9" fill="#5a3e6e"/>
          {/* Red iris tint */}
          <circle cx="88"  cy="93" r="7" fill="#c0302a" opacity="0.5"/>
          <circle cx="112" cy="93" r="7" fill="#c0302a" opacity="0.5"/>
          {/* Slit pupils */}
          <ellipse cx="88"  cy="93" rx="2.5" ry="7" fill="#1a0808"/>
          <ellipse cx="112" cy="93" rx="2.5" ry="7" fill="#1a0808"/>
          <circle cx="91"  cy="89" r="2" fill="white" opacity="0.7"/>
          <circle cx="115" cy="89" r="2" fill="white" opacity="0.7"/>
          {/* Heavy angry brows slanting inward */}
          <path d="M78,82 Q86,87 96,83" stroke="#3a2020" strokeWidth="4" fill="none" strokeLinecap="round"/>
          <path d="M104,83 Q114,87 122,82" stroke="#3a2020" strokeWidth="4" fill="none" strokeLinecap="round"/>
        </>
      ) : eyeHappy > 0.6 ? (
        // Happy ^_^
        <>
          <path d="M80,93 Q88,83 96,93" stroke="#5a3e6e" strokeWidth="3" fill="none" strokeLinecap="round"/>
          <path d="M104,93 Q112,83 120,93" stroke="#5a3e6e" strokeWidth="3" fill="none" strokeLinecap="round"/>
        </>
      ) : (
        // Normal
        <>
          <circle cx="88"  cy="93" r={9 - eyeHappy*2} fill="#5a3e6e"/>
          <circle cx="112" cy="93" r={9 - eyeHappy*2} fill="#5a3e6e"/>
          <circle cx="91"  cy="90" r="2.5" fill="white" opacity="0.9"/>
          <circle cx="115" cy="90" r="2.5" fill="white" opacity="0.9"/>
          {/* Worry brows */}
          {isWorried && (
            <>
              <path d="M81,83 Q88,79 95,82" stroke="#5a3e6e" strokeWidth="2" fill="none" strokeLinecap="round"
                transform={`rotate(${anxiety*18}, 88, 82)`}/>
              <path d="M105,82 Q112,79 119,83" stroke="#5a3e6e" strokeWidth="2" fill="none" strokeLinecap="round"
                transform={`rotate(${-anxiety*18}, 112, 82)`}/>
            </>
          )}
          {h < 0.3 && !isWorried && (
            <>
              <path d="M81,83 Q88,79 95,82" stroke="#5a3e6e" strokeWidth="2" fill="none" strokeLinecap="round"/>
              <path d="M105,82 Q112,79 119,83" stroke="#5a3e6e" strokeWidth="2" fill="none" strokeLinecap="round"/>
            </>
          )}
        </>
      )}

      {/* Cheek blush */}
      <ellipse cx="74"  cy="103" rx="10" ry="6" fill="#f9a8d4" opacity={blushOpacity * 0.7}/>
      <ellipse cx="126" cy="103" rx="10" ry="6" fill="#f9a8d4" opacity={blushOpacity * 0.7}/>

      {/* Nose */}
      <ellipse cx="100" cy="103" rx="4" ry="3"
        fill={isAngry ? '#d04030' : h > 0.5 ? '#f472b6' : '#9b7bb8'}/>

      {/* Whiskers — flared when angry */}
      {[
        [56,100, 84,104], [54,106, 83,107], [56,112, 84,110],
        [116,104,144,100],[117,107,146,106],[116,110,144,112],
      ].map(([x1,y1,x2,y2],i) => (
        <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
          stroke="#9b8dbf" strokeWidth="1.2"
          opacity={isAngry ? 0.9 : 0.6}
          strokeLinecap="round"/>
      ))}

      {/* Mouth */}
      {mouthCurve === 'angry' && (
        // Hiss / grimace
        <>
          <path d="M88,110 Q94,120 100,113 Q106,120 112,110"
            stroke="#3a2020" strokeWidth="2" fill="rgba(180,50,30,0.2)" strokeLinecap="round"/>
          <line x1="94"  y1="111" x2="94"  y2="117" stroke="white" strokeWidth="1.5" opacity="0.8"/>
          <line x1="100" y1="111" x2="100" y2="119" stroke="white" strokeWidth="1.5" opacity="0.8"/>
          <line x1="106" y1="111" x2="106" y2="117" stroke="white" strokeWidth="1.5" opacity="0.8"/>
        </>
      )}
      {mouthCurve === 'smile' && (
        <>
          <path d="M93,110 Q100,118 107,110" stroke="#5a3e6e" strokeWidth="2" fill="none" strokeLinecap="round"/>
          <path d="M93,110 Q88,113 85,110"   stroke="#5a3e6e" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
          <path d="M107,110 Q112,113 115,110" stroke="#5a3e6e" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
        </>
      )}
      {mouthCurve === 'neutral' && (
        <path d="M93,111 Q100,114 107,111" stroke="#5a3e6e" strokeWidth="2" fill="none" strokeLinecap="round"/>
      )}
      {mouthCurve === 'frown' && (
        <path d="M90,113 Q100,108 110,113" stroke="#5a3e6e" strokeWidth="2" fill="none" strokeLinecap="round"/>
      )}

      {/* Yarn tangles */}
      {h < 0.8 && (
        <g opacity={1 - h * 1.2}>
          <path d="M60,120 Q70,112 80,122 Q90,132 100,120"
            stroke={isAngry ? '#f87171' : '#f472b6'} strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.6"/>
          <path d="M120,125 Q130,115 140,125"
            stroke="#a78bfa" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.6"/>
          <path d="M85,150 Q95,140 105,150 Q115,160 125,148"
            stroke="#34d399" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.5"/>
        </g>
      )}

      {/* Sweat drop */}
      {sweat && (
        <g opacity="0.9">
          <path d="M142,62 Q138,54 142,48 Q146,54 142,62 Z" fill="#93c5fd"/>
          <circle cx="142" cy="63" r="4" fill="#93c5fd"/>
        </g>
      )}

      {/* Sparkles */}
      {h > 0.7 && !isAngry && (
        <g opacity={(h-0.7)*3.3}>
          <text x="42"  y="72" fontSize="14" textAnchor="middle">✨</text>
          <text x="158" y="68" fontSize="12" textAnchor="middle">⭐</text>
        </g>
      )}
      {h >= 1 && (
        <>
          <text x="45"  y="58" fontSize="16" textAnchor="middle">💕</text>
          <text x="160" y="55" fontSize="14" textAnchor="middle">💕</text>
        </>
      )}

      {/* Storm smoke */}
      {storming && (
        <g transform="translate(-40, 90)">
          <circle cx="0"   cy="0"  r="12" fill="#9ca3af" opacity="0.45"/>
          <circle cx="-16" cy="-6" r="9"  fill="#9ca3af" opacity="0.35"/>
          <text x="-5" y="-16" fontSize="16" opacity="0.7">💢</text>
        </g>
      )}
    </svg>
  );
}

function interpolateColor(hex1, hex2, t) {
  const r1=parseInt(hex1.slice(1,3),16), g1=parseInt(hex1.slice(3,5),16), b1=parseInt(hex1.slice(5,7),16);
  const r2=parseInt(hex2.slice(1,3),16), g2=parseInt(hex2.slice(3,5),16), b2=parseInt(hex2.slice(5,7),16);
  return `rgb(${Math.round(r1+(r2-r1)*t)},${Math.round(g1+(g2-g1)*t)},${Math.round(b1+(b2-b1)*t)})`;
}
