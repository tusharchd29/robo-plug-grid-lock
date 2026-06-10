import React, { useEffect, useState } from 'react';

export default function CatCharacter({ timeRatio = 1, progressRatio = 0, timerStarted = false, onStormOff }) {
  const [blink, setBlink]       = useState(false);
  const [tailWag, setTailWag]   = useState(0);
  const [bounce, setBounce]     = useState(false);
  const [prevProg, setPrevProg] = useState(progressRatio);
  const [stormX, setStormX]     = useState(0);
  const [storming, setStorming] = useState(false);
  const [sweat, setSweat]       = useState(false);
  const [shake, setShake]       = useState(0);

  // ── Mood calculation ────────────────────────────────────────────────────────
  // timeRatio: 1=full time, 0=time up
  // Calm until half time (timeRatio > 0.5)
  // Worried from half time (0.5 → 0.27)
  // RAGING from last 4s (timeRatio < 0.27 = 4/15)
  const timeUsed = timerStarted ? 1 - timeRatio : 0;
  const rawAnxiety = timerStarted
    ? timeRatio > 0.5
      ? 0                                        // first 7.5s: calm
      : timeRatio > 0.267
        ? (0.5 - timeRatio) / 0.233 * 0.55      // 7.5s → 4s: 0 → 0.55 worried
        : 0.55 + (0.267 - timeRatio) / 0.267 * 0.45  // last 4s: 0.55 → 1.0 RAGE
    : 0;

  // Progress dampens anxiety slightly
  const anxiety = Math.max(0, rawAnxiety - progressRatio * 0.25);
  const h = progressRatio >= 1 ? 1 : Math.max(progressRatio * 0.6, 1 - anxiety);

  const isCalm    = anxiety < 0.1;
  const isWorried = anxiety >= 0.1 && anxiety < 0.55;
  const isAngry   = anxiety >= 0.55 && anxiety < 0.85;
  const isRaging  = anxiety >= 0.85;
  const eyeHappy  = h;

  // Storm off on timeout
  useEffect(() => {
    if (timerStarted && timeRatio <= 0 && !storming) {
      setStorming(true);
      let x = 0;
      const iv = setInterval(() => {
        x += 18; setStormX(x);
        if (x > 380) { clearInterval(iv); onStormOff?.(); }
      }, 25);
    }
  }, [timeRatio, timerStarted]);

  useEffect(() => {
    if (timeRatio === 1) { setStorming(false); setStormX(0); }
  }, [timeRatio]);

  // Blinking — calm=slow, worried=normal, angry=fast, raging=manic
  useEffect(() => {
    const delay = () => isRaging ? 200 + Math.random()*150
      : isAngry   ? 400 + Math.random()*300
      : isWorried ? 900 + Math.random()*600
      : 2800 + Math.random()*1500;
    let t = setTimeout(function tick() {
      setBlink(true);
      setTimeout(() => setBlink(false), isRaging ? 60 : 100);
      t = setTimeout(tick, delay());
    }, delay());
    return () => clearTimeout(t);
  }, [isRaging, isAngry, isWorried]);

  // Tail wag speed
  useEffect(() => {
    const speed = isRaging ? 25 : isAngry ? 50 : h > 0.7 ? 80 : 200;
    const iv = setInterval(() => setTailWag(t => (t + 1) % 100), speed);
    return () => clearInterval(iv);
  }, [isRaging, isAngry, h]);

  // Body shake when raging
  useEffect(() => {
    if (!isRaging) { setShake(0); return; }
    const iv = setInterval(() => setShake(s => s + 1), 60);
    return () => clearInterval(iv);
  }, [isRaging]);

  // Bounce on progress
  useEffect(() => {
    if (progressRatio > prevProg) {
      setBounce(true);
      setTimeout(() => setBounce(false), 600);
    }
    setPrevProg(progressRatio);
  }, [progressRatio]);

  // Sweat drop when worried/angry
  useEffect(() => {
    if (anxiety < 0.2) { setSweat(false); return; }
    const rate = isRaging ? 400 : isAngry ? 700 : 1200;
    const iv = setInterval(() => {
      setSweat(true);
      setTimeout(() => setSweat(false), 600);
    }, rate);
    return () => clearInterval(iv);
  }, [anxiety, isRaging, isAngry]);

  // ── Derived visuals ────────────────────────────────────────────────────────
  const bodyColor = isRaging
    ? `rgb(240,${Math.round(120 - anxiety*40)},${Math.round(80 - anxiety*30)})`
    : isAngry
    ? interpolateColor('#fde8c8', '#f0b090', (anxiety - 0.55) / 0.3)
    : interpolateColor('#b8b0c8', '#fde8c8', h);

  const innerColor = isRaging
    ? `rgb(255,${Math.round(180 - anxiety*60)},${Math.round(140 - anxiety*50)})`
    : isAngry
    ? interpolateColor('#fff0dc', '#fdd0b0', (anxiety - 0.55) / 0.3)
    : interpolateColor('#d8d0e8', '#fff0dc', h);

  const earColor = isRaging ? '#ff4444'
    : isAngry ? '#f87171'
    : h > 0.4 ? '#f9a8d4' : '#d4c8e8';

  // Ear droop=worried, spike outward=angry, extreme spike=raging
  const earRotL = isRaging ? -45 : isAngry ? -32 : isWorried ? -8 : -15 + h * 25;
  const earRotR = isRaging ?  45 : isAngry ?  32 : isWorried ?  8 :  15 - h * 25;

  // Tail: lazy=calm, fast flick=angry, violent thrash=raging
  const tailAngle = isRaging
    ? Math.sin(tailWag * 0.8) * 80
    : isAngry
    ? Math.sin(tailWag * 0.5) * 55
    : Math.sin(tailWag * 0.2) * (15 + h * 30);

  const mouthCurve = isRaging ? 'hiss' : isAngry ? 'angry' : h > 0.5 ? 'smile' : h > 0.2 ? 'neutral' : 'frown';
  const blushOpacity = isCalm && h > 0.5 ? (h - 0.5) * 2 : 0;

  // Shake offset for rage
  const shakeOffX = isRaging ? Math.sin(shake * 1.8) * 4 : 0;
  const shakeOffY = isRaging ? Math.cos(shake * 2.1) * 3 : 0;
  const bounceY   = bounce ? -8 : 0;

  const transform = storming
    ? `translateX(${stormX}px) rotate(${stormX * 0.25}deg)`
    : `translate(${shakeOffX}px, ${shakeOffY + bounceY}px)`;

  return (
    <svg
      viewBox="0 0 200 180"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        width: '100%', height: '100%',
        filter: isRaging
          ? `drop-shadow(0 0 12px rgba(255,60,0,0.6)) drop-shadow(0 4px 8px rgba(180,140,200,0.2))`
          : 'drop-shadow(0 4px 12px rgba(180,140,200,0.25))',
        transform,
        transition: storming ? 'transform 0.03s linear' : isRaging ? 'none' : 'transform 0.15s cubic-bezier(0.34,1.56,0.64,1)',
        overflow: 'visible',
      }}
    >
      {/* Rage fire aura */}
      {isRaging && (
        <g opacity={Math.min(1, (anxiety - 0.85) * 6)}>
          {[-30,-15,0,15,30].map((dx, i) => (
            <text key={i} x={70 + dx * 2} y={20 + Math.sin(shake * 0.3 + i) * 8}
              fontSize={14 + i % 3 * 4} textAnchor="middle" opacity="0.85">
              {['🔥','💢','🔥','💢','🔥'][i]}
            </text>
          ))}
        </g>
      )}

      {/* Anger vein marks */}
      {(isAngry || isRaging) && (
        <g opacity={Math.min(1, (anxiety - 0.55) * 3)}>
          <path d="M38,68 L44,62 L50,68 L44,74 Z" fill="#ef4444" opacity="0.7"/>
          <path d="M150,66 L156,60 L162,66 L156,72 Z" fill="#ef4444" opacity="0.65"/>
          {isRaging && (
            <>
              <path d="M44,50 L49,45 L54,50 L49,55 Z" fill="#dc2626" opacity="0.6"/>
              <path d="M146,48 L151,43 L156,48 L151,53 Z" fill="#dc2626" opacity="0.55"/>
            </>
          )}
        </g>
      )}

      {/* Tail */}
      <g transform={`translate(148, 138) rotate(${tailAngle})`} style={{ transformOrigin: '0 0' }}>
        <path d="M0,0 Q20,-10 30,-30 Q38,-50 25,-65"
          stroke={bodyColor} strokeWidth="12" strokeLinecap="round" fill="none"/>
        <path d="M0,0 Q20,-10 30,-30 Q38,-50 25,-65"
          stroke={innerColor} strokeWidth="7" strokeLinecap="round" fill="none" opacity="0.6"/>
        <circle cx="25" cy="-65" r="8"
          fill={isRaging ? '#ff4444' : isAngry ? '#f87171' : h > 0.5 ? '#f9a8d4' : '#c4b8d8'}/>
      </g>

      {/* Body */}
      <ellipse cx="100" cy="140" rx="52" ry="38" fill={bodyColor}/>
      <ellipse cx="100" cy="138" rx="38" ry="28" fill={innerColor}/>

      {/* Rage body flush */}
      {isRaging && (
        <ellipse cx="100" cy="140" rx="52" ry="38"
          fill="#ff2200" opacity={Math.min(0.2, (anxiety-0.85)*1.3)}/>
      )}

      {/* Paws — raised when angry */}
      <ellipse cx="72"  cy={(isAngry||isRaging) ? 158 : 165} rx="16" ry="10" fill={bodyColor}/>
      <ellipse cx="128" cy={(isAngry||isRaging) ? 158 : 165} rx="16" ry="10" fill={bodyColor}/>
      <ellipse cx="72"  cy={(isAngry||isRaging) ? 159 : 166} rx="10" ry="6"  fill={innerColor}/>
      <ellipse cx="128" cy={(isAngry||isRaging) ? 159 : 166} rx="10" ry="6"  fill={innerColor}/>
      {/* Claws */}
      {(isAngry || isRaging) && [64,70,76].map((x,i) => (
        <line key={i} x1={x} y1={(isRaging?164:170)} x2={x-2} y2={(isRaging?173:178)}
          stroke={isRaging?"#ff6644":"#c8a090"} strokeWidth={isRaging?2:1.5} opacity="0.9" strokeLinecap="round"/>
      ))}
      {(isAngry || isRaging) && [122,128,134].map((x,i) => (
        <line key={i} x1={x} y1={(isRaging?164:170)} x2={x+2} y2={(isRaging?173:178)}
          stroke={isRaging?"#ff6644":"#c8a090"} strokeWidth={isRaging?2:1.5} opacity="0.9" strokeLinecap="round"/>
      ))}

      {/* Head */}
      <ellipse cx="100" cy="95" rx="46" ry="44" fill={bodyColor}/>
      <ellipse cx="100" cy="97" rx="34" ry="32" fill={innerColor} opacity="0.5"/>

      {/* Rage head flush */}
      {isRaging && (
        <ellipse cx="100" cy="95" rx="46" ry="44"
          fill="#ff2200" opacity={Math.min(0.18, (anxiety-0.85)*1.2)}/>
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
          <path d="M82,92 Q88,88 94,92" stroke="#3a1010" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
          <path d="M106,92 Q112,88 118,92" stroke="#3a1010" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
        </>
      ) : isRaging ? (
        // RAGING — blood red, slit pupils, thick angry brows slanted hard
        <>
          <circle cx="88"  cy="93" r="10" fill="#8b0000"/>
          <circle cx="112" cy="93" r="10" fill="#8b0000"/>
          <circle cx="88"  cy="93" r="8" fill="#cc0000"/>
          <circle cx="112" cy="93" r="8" fill="#cc0000"/>
          <ellipse cx="88"  cy="93" rx="2" ry="9" fill="#1a0000"/>
          <ellipse cx="112" cy="93" rx="2" ry="9" fill="#1a0000"/>
          <circle cx="91"  cy="88" r="2.5" fill="white" opacity="0.5"/>
          <circle cx="115" cy="88" r="2.5" fill="white" opacity="0.5"/>
          {/* VERY heavy brows */}
          <path d="M74,80 Q84,88 98,82" stroke="#2a0000" strokeWidth="5.5" fill="none" strokeLinecap="round"/>
          <path d="M102,82 Q116,88 126,80" stroke="#2a0000" strokeWidth="5.5" fill="none" strokeLinecap="round"/>
          {/* Inner glow */}
          <circle cx="88"  cy="93" r="10" fill="none" stroke="#ff4400" strokeWidth="1.5" opacity="0.6"/>
          <circle cx="112" cy="93" r="10" fill="none" stroke="#ff4400" strokeWidth="1.5" opacity="0.6"/>
        </>
      ) : isAngry ? (
        // ANGRY — red tinted, slit pupils, hard brows
        <>
          <circle cx="88"  cy="93" r="9" fill="#5a1a1a"/>
          <circle cx="112" cy="93" r="9" fill="#5a1a1a"/>
          <circle cx="88"  cy="93" r="7" fill="#c03030" opacity="0.6"/>
          <circle cx="112" cy="93" r="7" fill="#c03030" opacity="0.6"/>
          <ellipse cx="88"  cy="93" rx="2.5" ry="7" fill="#1a0808"/>
          <ellipse cx="112" cy="93" rx="2.5" ry="7" fill="#1a0808"/>
          <circle cx="91"  cy="89" r="2" fill="white" opacity="0.7"/>
          <circle cx="115" cy="89" r="2" fill="white" opacity="0.7"/>
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
        // Normal / worried
        <>
          <circle cx="88"  cy="93" r={9 - eyeHappy*2} fill="#5a3e6e"/>
          <circle cx="112" cy="93" r={9 - eyeHappy*2} fill="#5a3e6e"/>
          <circle cx="91"  cy="90" r="2.5" fill="white" opacity="0.9"/>
          <circle cx="115" cy="90" r="2.5" fill="white" opacity="0.9"/>
          {isWorried && (
            <>
              <path d="M81,83 Q88,79 95,82" stroke="#5a3e6e" strokeWidth="2.2" fill="none" strokeLinecap="round"
                transform={`rotate(${anxiety*25}, 88, 82)`}/>
              <path d="M105,82 Q112,79 119,83" stroke="#5a3e6e" strokeWidth="2.2" fill="none" strokeLinecap="round"
                transform={`rotate(${-anxiety*25}, 112, 82)`}/>
            </>
          )}
        </>
      )}

      {/* Cheek blush — only when happy */}
      <ellipse cx="74"  cy="103" rx="10" ry="6" fill="#f9a8d4" opacity={blushOpacity * 0.7}/>
      <ellipse cx="126" cy="103" rx="10" ry="6" fill="#f9a8d4" opacity={blushOpacity * 0.7}/>

      {/* Nose */}
      <ellipse cx="100" cy="103" rx="4" ry="3"
        fill={isRaging ? '#cc0000' : isAngry ? '#d04030' : h > 0.5 ? '#f472b6' : '#9b7bb8'}/>

      {/* Whiskers — flared when angry/raging */}
      {[
        [56,100,84,104],[54,106,83,107],[56,112,84,110],
        [116,104,144,100],[117,107,146,106],[116,110,144,112],
      ].map(([x1,y1,x2,y2],i) => (
        <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
          stroke={isRaging ? '#cc6644' : '#9b8dbf'}
          strokeWidth={isRaging ? 1.8 : 1.2}
          opacity={isRaging ? 1 : isAngry ? 0.9 : 0.6}
          strokeLinecap="round"/>
      ))}

      {/* Mouth */}
      {mouthCurve === 'hiss' && (
        // FULL HISS — wide open, many teeth
        <>
          <path d="M84,108 Q92,122 100,114 Q108,122 116,108"
            stroke="#2a0000" strokeWidth="2.5" fill="rgba(160,0,0,0.35)" strokeLinecap="round"/>
          {[90,96,100,104,110].map((x,i) => (
            <line key={i} x1={x} y1="109" x2={x+(i%2?1:-1)} y2={114+i%2*4}
              stroke="white" strokeWidth="1.8" opacity="0.9" strokeLinecap="round"/>
          ))}
        </>
      )}
      {mouthCurve === 'angry' && (
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
          <path d="M93,110 Q88,113 85,110" stroke="#5a3e6e" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
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
            stroke={isRaging ? '#ff4444' : isAngry ? '#f87171' : '#f472b6'}
            strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.7"/>
          <path d="M120,125 Q130,115 140,125"
            stroke="#a78bfa" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.6"/>
          <path d="M85,150 Q95,140 105,150 Q115,160 125,148"
            stroke="#34d399" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.5"/>
        </g>
      )}

      {/* Sweat drops */}
      {sweat && (
        <g opacity="0.9">
          <path d="M142,58 Q138,50 142,44 Q146,50 142,58 Z"
            fill={isRaging ? '#ff9999' : '#93c5fd'}/>
          <circle cx="142" cy="59" r="4"
            fill={isRaging ? '#ff9999' : '#93c5fd'}/>
          {isRaging && (
            <>
              <path d="M152,65 Q149,59 152,54 Q155,59 152,65 Z" fill="#ff9999"/>
              <circle cx="152" cy="66" r="3" fill="#ff9999"/>
            </>
          )}
        </g>
      )}

      {/* Sparkles when happy */}
      {h > 0.7 && isCalm && (
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
          <circle cx="0"   cy="0"  r="14" fill="#9ca3af" opacity="0.5"/>
          <circle cx="-18" cy="-6" r="10" fill="#9ca3af" opacity="0.4"/>
          <circle cx="-32" cy="-2" r="7"  fill="#9ca3af" opacity="0.3"/>
          <text x="-5" y="-18" fontSize="20" opacity="0.85">💢</text>
          <text x="-22" y="-8" fontSize="16" opacity="0.7">🔥</text>
        </g>
      )}
    </svg>
  );
}

function interpolateColor(hex1, hex2, t) {
  t = Math.max(0, Math.min(1, t));
  const r1=parseInt(hex1.slice(1,3),16), g1=parseInt(hex1.slice(3,5),16), b1=parseInt(hex1.slice(5,7),16);
  const r2=parseInt(hex2.slice(1,3),16), g2=parseInt(hex2.slice(3,5),16), b2=parseInt(hex2.slice(5,7),16);
  return `rgb(${Math.round(r1+(r2-r1)*t)},${Math.round(g1+(g2-g1)*t)},${Math.round(b1+(b2-b1)*t)})`;
}
