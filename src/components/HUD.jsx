import React from 'react';
import { useGameStore, POWER_STATE } from '../store/gameStore';
import styles from './HUD.module.css';

export default function HUD() {
  const {
    movesUsed, targetMoves, satisfiedCount, totalBots,
    timeLeft, levelTime, undo, restart, undosLeft,
    powerCharges, powerState, activatePower,
  } = useGameStore();

  const stars = movesUsed === 0 ? 0 : movesUsed <= targetMoves ? 3 : movesUsed <= targetMoves + 3 ? 2 : 1;
  const isPowerPending = powerState === POWER_STATE.PENDING_SELECT || powerState === POWER_STATE.GHOST_ARMED;

  // Timer turns red in last 3 seconds
  const timeFrac   = levelTime > 0 ? timeLeft / levelTime : 1;
  const timerDanger = timeLeft <= 3 && timeLeft > 0;

  return (
    <div className={styles.bar}>
      {/* Yarn freed */}
      <div className={styles.stat}>
        <span className={styles.icon}>🧶</span>
        <span className={styles.val}>{satisfiedCount}<span className={styles.of}>/{totalBots}</span></span>
        <span className={styles.lbl}>freed</span>
      </div>

      <div className={styles.div}/>

      {/* Moves */}
      <div className={styles.stat}>
        <span className={styles.icon}>👣</span>
        <span className={`${styles.val} ${movesUsed > targetMoves ? styles.warn : ''}`}>{movesUsed}</span>
        <span className={styles.lbl}>moves</span>
      </div>

      <div className={styles.div}/>

      {/* Stars */}
      <div className={styles.stars}>
        {[1,2,3].map(s => (
          <span key={s} className={`${styles.star} ${s <= stars && movesUsed > 0 ? styles.on : ''}`}>★</span>
        ))}
      </div>

      <div className={styles.div}/>

      {/* Timer — red pulse when danger */}
      <div className={`${styles.stat} ${timerDanger ? styles.timerDanger : ''}`}>
        <span className={styles.icon}>⏱</span>
        <span className={`${styles.val} ${timerDanger ? styles.warn : ''}`}>{Math.ceil(timeLeft)}</span>
        <span className={styles.lbl}>sec</span>
      </div>

      {/* Spacer */}
      <div style={{ flex: 1 }}/>

      {/* ⚡ Power charges */}
      <button
        className={`${styles.powerBtn} ${isPowerPending ? styles.powerBtnActive : ''} ${powerCharges === 0 ? styles.powerBtnDepleted : ''}`}
        onClick={activatePower}
        disabled={powerCharges === 0}
        title={powerCharges === 0 ? 'No hammers left' : 'Use hammer — smash through blockers!'}
      >
        <span className={styles.powerBolts}>
          {[0,1,2].map(i => (
            <span key={i} className={`${styles.bolt} ${i < powerCharges ? styles.boltOn : styles.boltOff}`}>🔨</span>
          ))}
        </span>
      </button>

      {/* Undo — shows remaining count */}
      <button
        className={`${styles.btn} ${undosLeft === 0 ? styles.btnDepleted : ''}`}
        onClick={undo}
        disabled={undosLeft === 0}
        title={`Undo (${undosLeft} left, costs 1 move)`}
      >
        ↩<span className={styles.undoCount}>{undosLeft}</span>
      </button>
      <button className={styles.btn} onClick={restart}>↺</button>
    </div>
  );
}
