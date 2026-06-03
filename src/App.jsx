import React, { useState } from 'react';
import { useGameStore, GAME_STATE } from './store/gameStore';
import Grid from './components/Grid';
import CatCharacter from './components/CatCharacter';
import TimerRing from './components/TimerRing';
import HUD from './components/HUD';
import LevelSelect from './components/LevelSelect';
import { WinOverlay, GameOverOverlay } from './components/Overlays';
import styles from './App.module.css';

const TOTAL_TIME = 15;

export default function App() {
  const [screen, setScreen] = useState('select');
  const {
    gameState, currentLevelIndex, levelDef, loadLevel,
    satisfiedCount, totalBots, timeLeft, timerActive,
  } = useGameStore();

  const timeRatio     = timeLeft / TOTAL_TIME;
  const progressRatio = totalBots > 0 ? satisfiedCount / totalBots : 0;
  const anxiety       = timerActive ? Math.max(0, (1 - timeRatio) * (1 - progressRatio)) : 0;
  const hope          = progressRatio;

  // Mood label
  const moodLabel = (() => {
    if (!timerActive && progressRatio === 0) return '😺 Touch a yarn to start!';
    if (progressRatio >= 1)                  return '😻 Purrrfect! All free!';
    if (anxiety > 0.75)                      return '🙀 HURRY HURRY HURRY!!';
    if (anxiety > 0.5)                       return '😿 I\'m running out of time...';
    if (hope > 0.5)                          return '😸 Almost there, keep going!';
    if (hope > 0)                            return '🐱 Yes! Keep untangling!';
    return '😾 Help me get free...';
  })();

  function handleSelectLevel(index) {
    loadLevel(index);
    setScreen('game');
  }

  return (
    <div className={styles.root}>
      <div className={styles.blob1}/>
      <div className={styles.blob2}/>
      <div className={styles.blob3}/>

      {screen === 'select' && (
        <div className={styles.selectScreen}>
          <LevelSelect onSelect={handleSelectLevel}/>
        </div>
      )}

      {screen === 'game' && (
        <div className={styles.gameLayout}>

          {/* Top bar */}
          <div className={styles.topBar}>
            <button className={styles.backBtn} onClick={() => setScreen('select')}>← Levels</button>
            <div className={styles.levelBadge}>✦ Level {levelDef?.id ?? currentLevelIndex + 1}</div>
            <div style={{ width: 80 }}/>
          </div>

          {/* Cat + timer ring */}
          <div className={styles.catZone}>
            <TimerRing timeLeft={timeLeft} anxiety={anxiety} hope={hope}>
              <CatCharacter
                timeRatio={timeRatio}
                progressRatio={progressRatio}
                timerStarted={timerActive}
              />
            </TimerRing>
            <div
              className={styles.moodLabel}
              style={{ color: anxiety > 0.6 ? '#e03060' : anxiety > 0.3 ? '#e07030' : '#c060a0' }}
            >
              {moodLabel}
            </div>
          </div>

          {/* Puzzle grid */}
          <div className={styles.gridZone}>
            <Grid/>
          </div>

          {/* Bottom HUD */}
          <div className={styles.hudBar}>
            <HUD/>
          </div>

        </div>
      )}

      {screen === 'game' && gameState === GAME_STATE.LEVEL_WIN  && <WinOverlay  onLevelSelect={() => setScreen('select')}/>}
      {screen === 'game' && gameState === GAME_STATE.GAME_OVER  && <GameOverOverlay onLevelSelect={() => setScreen('select')}/>}
    </div>
  );
}
