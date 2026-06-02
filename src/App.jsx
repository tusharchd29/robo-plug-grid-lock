import React, { useState } from 'react';
import { useGameStore, GAME_STATE } from './store/gameStore';
import Grid from './components/Grid';
import CentralBot from './components/CentralBot';
import HUD from './components/HUD';
import LevelSelect from './components/LevelSelect';
import { WinOverlay, GameOverOverlay } from './components/Overlays';
import styles from './App.module.css';

export default function App() {
  const [screen, setScreen] = useState('select');
  const { gameState, currentLevelIndex, levelDef, loadLevel } = useGameStore();

  function handleSelectLevel(index) {
    loadLevel(index);
    setScreen('game');
  }

  return (
    <div className={styles.root}>
      <div className={`${styles.blob} ${styles.blob1}`} />
      <div className={`${styles.blob} ${styles.blob2}`} />
      <div className={`${styles.blob} ${styles.blob3}`} />

      {screen === 'select' && (
        <LevelSelect onSelect={handleSelectLevel} />
      )}

      {screen === 'game' && (
        <div className={styles.gameLayout}>
          <div className={styles.topBar}>
            <button className={styles.backBtn} onClick={() => setScreen('select')}>
              ← Levels
            </button>
            <div className={styles.levelBadge}>
              Level {levelDef?.id || currentLevelIndex + 1}
            </div>
            <div style={{ width: 70 }} />
          </div>

          <div className={styles.mainArea}>
            <div className={styles.sidebar}>
              <HUD />
              <CentralBot />
            </div>
            <div className={styles.gridArea}>
              <Grid />
            </div>
          </div>
        </div>
      )}

      {screen === 'game' && gameState === GAME_STATE.LEVEL_WIN && (
        <WinOverlay onLevelSelect={() => setScreen('select')} />
      )}
      {screen === 'game' && gameState === GAME_STATE.GAME_OVER && (
        <GameOverOverlay onLevelSelect={() => setScreen('select')} />
      )}
    </div>
  );
}
