import React from 'react';
import { useGameStore } from '../store/gameStore';
import styles from './HUD.module.css';

export default function HUD() {
  const { movesUsed, maxMoves, targetMoves, satisfiedCount, totalBots, undo, restart } = useGameStore();
  const pct = maxMoves > 0 ? (movesUsed / maxMoves) * 100 : 0;

  const stars = movesUsed <= targetMoves ? 3
    : movesUsed <= targetMoves + 3 ? 2
    : 1;

  return (
    <div className={styles.wrap}>
      <div className={styles.statsRow}>
        <div className={styles.stat}>
          <div className={styles.statLabel}>Moves</div>
          <div className={`${styles.statVal} ${movesUsed > targetMoves ? styles.warn : ''}`}>{movesUsed}</div>
        </div>
        <div className={styles.stat}>
          <div className={styles.statLabel}>Target</div>
          <div className={styles.statVal}>{targetMoves}</div>
        </div>
        <div className={styles.stat}>
          <div className={styles.statLabel}>Plugged</div>
          <div className={`${styles.statVal} ${satisfiedCount > 0 ? styles.good : ''}`}>{satisfiedCount}/{totalBots}</div>
        </div>
      </div>

      <div className={styles.starsRow}>
        {[1,2,3].map(s => (
          <span key={s} className={`${styles.star} ${s <= stars && movesUsed > 0 ? styles.filled : ''}`}>★</span>
        ))}
      </div>

      <div className={styles.moveBarWrap}>
        <div className={styles.moveBarLabels}>
          <span>Move budget</span>
          <span>{movesUsed} / {maxMoves}</span>
        </div>
        <div className={styles.moveBarTrack}>
          <div
            className={`${styles.moveBarFill} ${pct > 75 ? styles.danger : pct > 50 ? styles.caution : ''}`}
            style={{ width: `${Math.min(pct, 100)}%` }}
          />
        </div>
      </div>

      <div className={styles.actionRow}>
        <button className={styles.btn} onClick={undo}>↩ Undo</button>
        <button className={styles.btn} onClick={restart}>↺ Restart</button>
      </div>
    </div>
  );
}
