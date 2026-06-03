import React, { useState } from 'react';
import { useGameStore, GAME_STATE } from './store/gameStore';
import Grid from './components/Grid';
import CatCharacter from './components/CatCharacter';
import HUD from './components/HUD';
import LevelSelect from './components/LevelSelect';
import { WinOverlay, GameOverOverlay } from './components/Overlays';
import styles from './App.module.css';

export default function App() {
  const [screen, setScreen] = useState('select');
  const { gameState, currentLevelIndex, levelDef, loadLevel, satisfiedCount, totalBots } = useGameStore();
  const happiness = totalBots > 0 ? satisfiedCount / totalBots : 0;

  function handleSelectLevel(index) {
    loadLevel(index);
    setScreen('game');
  }

  return (
    <div className={styles.root}>
      {/* Soft background blobs */}
      <div className={styles.blob1} />
      <div className={styles.blob2} />
      <div className={styles.blob3} />

      {screen === 'select' && (
        <div className={styles.selectScreen}>
          <LevelSelect onSelect={handleSelectLevel} />
        </div>
      )}

      {screen === 'game' && (
        <div className={styles.gameLayout}>

          {/* Top bar */}
          <div className={styles.topBar}>
            <button className={styles.backBtn} onClick={() => setScreen('select')}>
              <span>←</span> Levels
            </button>
            <div className={styles.levelBadge}>✦ Level {levelDef?.id ?? currentLevelIndex + 1}</div>
            <div style={{ width: 80 }} />
          </div>

          {/* Cat + mood */}
          <div className={styles.catZone}>
            <div className={styles.catWrap}>
              <CatCharacter happiness={happiness} />
            </div>
            <div className={styles.moodLabel}>
              {happiness === 0 && '😿 Help me...'}
              {happiness > 0 && happiness < 0.5 && '🙀 Keep going!'}
              {happiness >= 0.5 && happiness < 1 && '😸 Almost free!'}
              {happiness >= 1 && '😻 Purrrfect!'}
            </div>
          </div>

          {/* Grid */}
          <div className={styles.gridZone}>
            <Grid />
          </div>

          {/* Bottom HUD */}
          <div className={styles.hudBar}>
            <HUD compact />
          </div>

        </div>
      )}

      {screen === 'game' && gameState === GAME_STATE.LEVEL_WIN  && <WinOverlay  onLevelSelect={() => setScreen('select')} />}
      {screen === 'game' && gameState === GAME_STATE.GAME_OVER  && <GameOverOverlay onLevelSelect={() => setScreen('select')} />}
    </div>
  );
}
