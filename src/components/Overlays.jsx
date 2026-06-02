import React from 'react';
import { useGameStore, GAME_STATE } from '../store/gameStore';
import { LEVELS } from '../levels/levels';
import styles from './Overlays.module.css';

export function WinOverlay({ onLevelSelect }) {
  const { stars, movesUsed, targetMoves, currentLevelIndex, nextLevel, restart } = useGameStore();
  const isLast = currentLevelIndex >= LEVELS.length - 1;

  return (
    <div className={styles.backdrop}>
      <div className={styles.modal}>
        <div className={styles.winEmoji}>^_^</div>
        <div className={styles.winTitle}>Bot Freed!</div>
        <div className={styles.winSub}>All wool removed successfully</div>

        <div className={styles.starsRow}>
          {[1,2,3].map(s => (
            <span key={s} className={`${styles.bigStar} ${s <= stars ? styles.on : ''}`}>★</span>
          ))}
        </div>

        <div className={styles.moveStat}>
          {movesUsed} moves · target was {targetMoves}
        </div>

        <div className={styles.btnRow}>
          <button className={styles.btnSecondary} onClick={onLevelSelect}>Levels</button>
          <button className={styles.btnSecondary} onClick={restart}>Retry</button>
          {!isLast && <button className={styles.btnPrimary} onClick={nextLevel}>Next ▶</button>}
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
        <div className={styles.overEmoji}>X_X</div>
        <div className={styles.overTitle}>Gridlocked!</div>
        <div className={styles.overSub}>Ran out of moves. Recalibrate and retry.</div>
        <div className={styles.btnRow}>
          <button className={styles.btnSecondary} onClick={onLevelSelect}>Levels</button>
          <button className={styles.btnPrimary} onClick={restart}>Try Again</button>
        </div>
      </div>
    </div>
  );
}
