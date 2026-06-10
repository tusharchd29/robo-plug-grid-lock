import React from 'react';
import { useGameStore, POWER_STATE } from '../store/gameStore';
import styles from './HUD.module.css';

export default function HUD() {
  const {
    movesUsed, targetMoves, satisfiedCount, totalBots,
    timeLeft, undo, restart,
    powerCharges, powerState, activatePower,
  } = useGameStore();

  const stars = movesUsed === 0 ? 0 : movesUsed <= targetMoves ? 3 : movesUsed <= targetMoves + 3 ? 2 : 1;
  const isPowerPending = powerState === POWER_STATE.PENDING_SELECT || powerState === POWER_STATE.GHOST_ARMED;

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

      {/* Buttons */}
      <button className={styles.btn} onClick={undo}>↩</button>
      <button className={styles.btn} onClick={restart}>↺</button>
    </div>
  );
}
