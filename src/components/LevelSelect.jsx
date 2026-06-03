import React from 'react';
import { useGameStore } from '../store/gameStore';
import { LEVELS } from '../levels/levels';
import styles from './LevelSelect.module.css';

const YARN_COLORS = ['#f472b6','#fb923c','#a3e635','#34d399','#38bdf8','#818cf8','#e879f9','#fb7185'];

export default function LevelSelect({ onSelect }) {
  const { unlockedLevels, levelStars, currentLevelIndex } = useGameStore();

  return (
    <div className={styles.wrap}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.catIcon}>🐱</div>
        <div className={styles.title}>Yarn Tangle</div>
        <div className={styles.subtitle}>Help the kitty get free!</div>
        <div className={styles.paws}>🐾 🧶 🐾</div>
      </div>

      {/* Level grid */}
      <div className={styles.grid}>
        {LEVELS.map((level, i) => {
          const locked  = i >= unlockedLevels;
          const stars   = levelStars[level.id] || 0;
          const diff    = i < 6 ? 'easy' : i < 11 ? 'medium' : 'hard';
          const yarnCol = YARN_COLORS[i % YARN_COLORS.length];

          return (
            <button
              key={level.id}
              className={`${styles.card} ${locked ? styles.locked : ''} ${i === currentLevelIndex ? styles.current : ''}`}
              style={{ '--yarn': yarnCol }}
              onClick={() => !locked && onSelect(i)}
              disabled={locked}
            >
              {/* Yarn accent dot */}
              <div className={styles.yarnDot} />

              <div className={styles.num}>{level.id}</div>

              <div className={styles.stars}>
                {[1,2,3].map(s => (
                  <span key={s} className={s <= stars ? styles.starOn : styles.starOff}>★</span>
                ))}
              </div>

              <div className={`${styles.pill} ${styles[diff]}`}>
                {diff === 'easy' ? '😺' : diff === 'medium' ? '😼' : '🙀'}
              </div>

              {locked && <div className={styles.lockOverlay}>🔒</div>}
            </button>
          );
        })}
      </div>

      <div className={styles.footer}>🧶 Untangle all the yarn to free her! 🧶</div>
    </div>
  );
}
