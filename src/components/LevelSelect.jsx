import React from 'react';
import { useGameStore } from '../store/gameStore';
import { LEVELS } from '../levels/levels';
import styles from './LevelSelect.module.css';

const YARN_COLORS = ['#f472b6','#fb923c','#a3e635','#34d399','#38bdf8','#818cf8','#e879f9','#fb7185'];

// Gate: L8 (index 7) onwards requires 2-star on all previous levels
function isStarGated(index, levelStars) {
  if (index < 7) return false; // L1–L7 free
  for (let i = 0; i < index; i++) {
    const stars = levelStars[LEVELS[i].id] || 0;
    if (stars < 2) return true;
  }
  return false;
}

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
          const locked    = i >= unlockedLevels;
          const starGated = !locked && isStarGated(i, levelStars);
          const stars     = levelStars[level.id] || 0;
          const diff      = i < 6 ? 'easy' : i < 11 ? 'medium' : i < 20 ? 'hard' : 'expert';
          const yarnCol   = YARN_COLORS[i % YARN_COLORS.length];
          const isBlocked = locked || starGated;

          return (
            <button
              key={level.id}
              className={`${styles.card} ${isBlocked ? styles.locked : ''} ${i === currentLevelIndex ? styles.current : ''} ${diff === 'expert' ? styles.expertCard : ''}`}
              style={{ '--yarn': yarnCol }}
              onClick={() => !isBlocked && onSelect(i)}
              disabled={isBlocked}
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
                {diff === 'easy' ? '😺' : diff === 'medium' ? '😼' : diff === 'hard' ? '🙀' : '💀'}
              </div>

              {locked && <div className={styles.lockOverlay}>🔒</div>}
              {starGated && !locked && (
                <div className={styles.lockOverlay} title="Earn ★★ on all previous levels">⭐🔒</div>
              )}
            </button>
          );
        })}
      </div>

      <div className={styles.footer}>🧶 Untangle all the yarn to free her! 🧶</div>
      <div className={styles.footer} style={{fontSize:'0.7rem', opacity:0.6, marginTop:4}}>
        ⭐🔒 = Earn 2★ on all previous levels to unlock
      </div>
    </div>
  );
}
