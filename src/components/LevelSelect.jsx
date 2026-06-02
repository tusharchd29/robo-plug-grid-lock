import React from 'react';
import { useGameStore } from '../store/gameStore';
import { LEVELS } from '../levels/levels';
import styles from './LevelSelect.module.css';

export default function LevelSelect({ onSelect }) {
  const { unlockedLevels, levelStars, currentLevelIndex } = useGameStore();

  return (
    <div className={styles.wrap}>
      <div className={styles.header}>
        <div className={styles.title}>Robo-Plug</div>
        <div className={styles.subtitle}>Grid Lock</div>
        <div className={styles.tagline}>Route the conduits. Free the bot.</div>
      </div>

      <div className={styles.grid}>
        {LEVELS.map((level, i) => {
          const locked = i >= unlockedLevels;
          const stars  = levelStars[level.id] || 0;
          const diff   = i < 6 ? 'easy' : i < 11 ? 'mid' : 'hard';

          return (
            <button
              key={level.id}
              className={`${styles.levelBtn} ${locked ? styles.locked : ''} ${i === currentLevelIndex ? styles.current : ''}`}
              onClick={() => !locked && onSelect(i)}
              disabled={locked}
            >
              <div className={styles.levelNum}>{level.id}</div>
              <div className={styles.levelStars}>
                {[1,2,3].map(s => (
                  <span key={s} className={s <= stars ? styles.starFilled : styles.starEmpty}>★</span>
                ))}
              </div>
              <div className={`${styles.diffPill} ${styles[diff]}`}>
                {diff === 'easy' ? 'Easy' : diff === 'mid' ? 'Medium' : 'Hard'}
              </div>
              {locked && <div className={styles.lockIcon}>🔒</div>}
            </button>
          );
        })}
      </div>
    </div>
  );
}
