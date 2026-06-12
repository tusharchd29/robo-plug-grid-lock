import React, { useState, useEffect } from 'react';
import { useGameStore, GAME_STATE, POWER_STATE, RECHARGE_TYPE } from '../store/gameStore';
import { LEVELS } from '../levels/levels';
import styles from './Overlays.module.css';

export function WinOverlay({ onLevelSelect }) {
  const { stars, movesUsed, targetMoves, timeLeft, currentLevelIndex, nextLevel, restart } = useGameStore();
  const isLast = currentLevelIndex >= LEVELS.length - 1;
  const timeBonus = Math.ceil(timeLeft);

  return (
    <div className={styles.backdrop}>
      <div className={styles.modal}>
        <div className={styles.bigEmoji}>😻</div>
        <div className={styles.title}>Kitty is free!</div>
        <div className={styles.sub}>All yarn untangled! 🧶</div>

        <div className={styles.starsRow}>
          {[1,2,3].map(s => (
            <span key={s} className={`${styles.bigStar} ${s <= stars ? styles.on : ''}`}>★</span>
          ))}
        </div>

        <div className={styles.stats}>
          <div className={styles.statChip}>👣 {movesUsed} moves</div>
          <div className={styles.statChip}>⏱ {timeBonus}s left</div>
        </div>

        <div className={styles.btnRow}>
          <button className={styles.btnSec} onClick={onLevelSelect}>Levels</button>
          <button className={styles.btnSec} onClick={restart}>Retry</button>
          {!isLast && (
            <button className={styles.btnPrim} onClick={nextLevel}>Next ▶</button>
          )}
        </div>
      </div>
    </div>
  );
}

export function GameOverOverlay({ onLevelSelect }) {
  const { restart } = useGameStore();

  return (
    <div className={styles.backdrop}>
      <div className={styles.modal}>
        <div className={styles.bigEmoji}>😿</div>
        <div className={styles.title}>Time's up!</div>
        <div className={styles.sub}>Poor kitty... try again! 🧶</div>

        <div className={styles.btnRow}>
          <button className={styles.btnSec} onClick={onLevelSelect}>Levels</button>
          <button className={styles.btnPrim} onClick={restart}>Try Again 🐱</button>
        </div>
      </div>
    </div>
  );
}

export function MathChallengeOverlay() {
  const { mathQuestion, mathShake, submitMathAnswer, cancelPower, powerState } = useGameStore();
  const [input, setInput] = useState('');
  const [localShake, setLocalShake] = useState(false);

  useEffect(() => {
    if (mathShake) {
      setLocalShake(true);
      setInput('');
      const t = setTimeout(() => setLocalShake(false), 500);
      return () => clearTimeout(t);
    }
  }, [mathShake]);

  if (powerState !== POWER_STATE.MATH_CHALLENGE || !mathQuestion) return null;

  function handleSubmit() {
    if (!input.trim()) return;
    submitMathAnswer(input.trim());
    setInput('');
  }

  function handleKey(e) {
    if (e.key === 'Enter') handleSubmit();
    if (e.key === 'Escape') cancelPower();
  }

  return (
    <div className={styles.backdrop}>
      <div className={`${styles.modal} ${localShake ? styles.shake : ''}`}>
        <div className={styles.powerEmoji}>⚡</div>
        <div className={styles.title}>Power Unlock!</div>
        <div className={styles.sub}>Answer correctly to activate ghost mode</div>

        <div className={styles.mathBox}>
          <span className={styles.mathExpr}>
            {mathQuestion.a} {mathQuestion.op} {mathQuestion.b} = ?
          </span>
          <input
            className={styles.mathInput}
            type="number"
            inputMode="numeric"
            pattern="[0-9]*"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            autoFocus
            placeholder="?"
          />
        </div>

        {localShake && <div className={styles.wrongHint}>❌ Try again!</div>}

        <div className={styles.btnRow}>
          <button className={styles.btnSec} onClick={cancelPower}>Cancel</button>
          <button className={styles.btnPrim} onClick={handleSubmit}>Submit ▶</button>
        </div>
      </div>
    </div>
  );
}

// ── Universal Recharge Overlay ────────────────────────────────────────────
export function RechargeOverlay() {
  const {
    rechargeType, rechargeProgress, rechargeNeeded,
    rechargeMathQuestion, rechargeMathShake,
    submitRechargeAnswer, dismissRecharge, timerRescuesLeft,
  } = useGameStore();

  const [input, setInput] = useState('');
  const [localShake, setLocalShake] = useState(false);

  useEffect(() => {
    setInput('');
    setLocalShake(false);
  }, [rechargeType, rechargeProgress]);

  useEffect(() => {
    if (rechargeMathShake) {
      setLocalShake(true);
      setInput('');
      const t = setTimeout(() => setLocalShake(false), 500);
      return () => clearTimeout(t);
    }
  }, [rechargeMathShake]);

  if (rechargeType === RECHARGE_TYPE.NONE || !rechargeMathQuestion) return null;

  function handleSubmit() {
    if (!input.trim()) return;
    submitRechargeAnswer(input.trim());
    setInput('');
  }

  function handleKey(e) {
    if (e.key === 'Enter') handleSubmit();
  }

  // Config per type
  const config = {
    [RECHARGE_TYPE.TIMER]: {
      emoji: '⏱',
      title: "Time's up!",
      sub: `Answer to continue — ${timerRescuesLeft} rescue${timerRescuesLeft !== 1 ? 's' : ''} left`,
      dismissLabel: 'Give Up 😿',
      dismissStyle: 'btnSec',
      color: '#f97316',
    },
    [RECHARGE_TYPE.GHOST]: {
      emoji: '🔨',
      title: 'Hammers Depleted!',
      sub: `Answer ${rechargeNeeded} question${rechargeNeeded > 1 ? 's' : ''} to recharge all 3`,
      dismissLabel: 'Cancel',
      dismissStyle: 'btnSec',
      color: '#fbbf24',
    },
    [RECHARGE_TYPE.UNDO]: {
      emoji: '↩',
      title: 'Undos Depleted!',
      sub: `Answer ${rechargeNeeded} question${rechargeNeeded > 1 ? 's' : ''} to recharge all 3`,
      dismissLabel: 'Cancel',
      dismissStyle: 'btnSec',
      color: '#60a5fa',
    },
  }[rechargeType];

  // Progress dots for multi-question recharge
  const showProgress = rechargeNeeded > 1;

  return (
    <div className={styles.backdrop}>
      <div className={`${styles.modal} ${localShake ? styles.shake : ''}`}
           style={{ '--recharge-color': config.color }}>
        <div className={styles.rechargeEmoji}>{config.emoji}</div>
        <div className={styles.title}>{config.title}</div>
        <div className={styles.sub}>{config.sub}</div>

        {showProgress && (
          <div className={styles.progressDots}>
            {Array.from({ length: rechargeNeeded }).map((_, i) => (
              <div
                key={i}
                className={`${styles.dot} ${i < rechargeProgress ? styles.dotDone : ''}`}
                style={i < rechargeProgress ? { background: config.color } : {}}
              />
            ))}
          </div>
        )}

        <div className={styles.mathBox}>
          <span className={styles.mathExpr}>
            {rechargeMathQuestion.a} {rechargeMathQuestion.op} {rechargeMathQuestion.b} = ?
          </span>
          <input
            className={styles.mathInput}
            type="number"
            inputMode="numeric"
            pattern="[0-9]*"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            autoFocus
            placeholder="?"
            style={{ borderColor: config.color }}
          />
        </div>

        {localShake && <div className={styles.wrongHint}>❌ Wrong! Try again</div>}

        <div className={styles.btnRow}>
          <button className={styles[config.dismissStyle]} onClick={dismissRecharge}>
            {config.dismissLabel}
          </button>
          <button
            className={styles.btnPrim}
            style={{ background: config.color }}
            onClick={handleSubmit}
          >
            Submit ▶
          </button>
        </div>
      </div>
    </div>
  );
}
