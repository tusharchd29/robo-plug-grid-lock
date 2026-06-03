import React from 'react';
import { useGameStore } from '../store/gameStore';
import styles from './HUD.module.css';

export default function HUD({ compact = false }) {
  const { movesUsed, maxMoves, targetMoves, satisfiedCount, totalBots, undo, restart } = useGameStore();

  const pct   = maxMoves > 0 ? (movesUsed / maxMoves) * 100 : 0;
  const stars = movesUsed === 0 ? 0 : movesUsed <= targetMoves ? 3 : movesUsed <= targetMoves + 3 ? 2 : 1;

  return (
    <div className={styles.bar}>
      {/* Yarn balls freed */}
      <div className={styles.stat}>
        <span className={styles.statIcon}>🧶</span>
        <span className={styles.statVal}>{satisfiedCount}<span className={styles.statOf}>/{totalBots}</span></span>
        <span className={styles.statLabel}>freed</span>
      </div>

      <div className={styles.divider} />

      {/* Moves */}
      <div className={styles.stat}>
        <span className={styles.statIcon}>👣</span>
        <span className={`${styles.statVal} ${movesUsed > targetMoves ? styles.warn : ''}`}>{movesUsed}</span>
        <span className={styles.statLabel}>moves</span>
      </div>

      <div className={styles.divider} />

      {/* Stars */}
      <div className={styles.stars}>
        {[1,2,3].map(s => (
          <span key={s} className={`${styles.star} ${s <= stars && movesUsed > 0 ? styles.on : ''}`}>★</span>
        ))}
      </div>

      <div className={styles.divider} />

      {/* Move bar */}
      <div className={styles.barWrap}>
        <div className={styles.barTrack}>
          <div
            className={`${styles.barFill} ${pct > 75 ? styles.danger : pct > 50 ? styles.warn2 : ''}`}
            style={{ width: `${Math.min(pct, 100)}%` }}
          />
        </div>
        <span className={styles.barLabel}>{movesUsed}/{maxMoves}</span>
      </div>

      <div className={styles.divider} />

      {/* Buttons */}
      <div className={styles.btns}>
        <button className={styles.btn} onClick={undo} title="Undo">↩</button>
        <button className={styles.btn} onClick={restart} title="Restart">↺</button>
      </div>
    </div>
  );
}
