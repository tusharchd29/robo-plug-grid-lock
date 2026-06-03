import React from 'react';
import { useGameStore, GAME_STATE } from '../store/gameStore';
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
