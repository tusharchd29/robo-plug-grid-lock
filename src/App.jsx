import React, { useState, Component } from 'react';
import { useGameStore, GAME_STATE } from './store/gameStore';
import Grid from './components/Grid';
import CatCharacter from './components/CatCharacter';
import TimerRing from './components/TimerRing';
import HUD from './components/HUD';
import LevelSelect from './components/LevelSelect';
import { WinOverlay, GameOverOverlay, MathChallengeOverlay } from './components/Overlays';
import styles from './App.module.css';

const TOTAL_TIME = 15;

class ErrorBoundary extends Component {
  constructor(props) { super(props); this.state = { error: null }; }
  static getDerivedStateFromError(e) { return { error: e }; }
  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: 32, fontFamily: 'Nunito,sans-serif', color: '#c0304a', background: '#fff8f3', height: '100dvh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
          <div style={{ fontSize: 48 }}>🙀</div>
          <div style={{ fontSize: 20, fontWeight: 900 }}>Something crashed!</div>
          <div style={{ fontSize: 13, color: '#888', maxWidth: 340, textAlign: 'center', wordBreak: 'break-all' }}>
            {this.state.error?.message || String(this.state.error)}
          </div>
          <button onClick={() => this.setState({ error: null })} style={{ marginTop: 16, padding: '10px 24px', background: '#f472b6', color: 'white', border: 'none', borderRadius: 12, fontWeight: 800, fontSize: 15, cursor: 'pointer' }}>
            Try Again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

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

  const moodLabel = (() => {
    if (!timerActive && progressRatio === 0) return '😺 Touch a yarn to start!';
    if (progressRatio >= 1)                  return '😻 Purrrfect! All free!';
    if (anxiety > 0.85)                      return '🙀 GET ME OUT GET ME OUT!!';
    if (anxiety > 0.65)                      return '😾 I am SO done with this!!';
    if (anxiety > 0.35)                      return '😿 Hurry... I\'m getting nervous...';
    if (anxiety > 0.05)                      return '😼 Hmm... tick tock...';
    if (hope > 0.5)                          return '😸 Almost there, keep going!';
    if (hope > 0)                            return '🐱 Yes! Keep untangling!';
    return '😾 Help me get free...';
  })();

  function handleSelectLevel(index) {
    loadLevel(index);
    setScreen('game');
  }

  return (
    <ErrorBoundary>
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
            <div className={styles.topBar}>
              <button className={styles.backBtn} onClick={() => setScreen('select')}>← Levels</button>
              <div className={styles.levelBadge}>✦ Level {levelDef?.id ?? currentLevelIndex + 1}</div>
              <div style={{ width: 80 }}/>
            </div>

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

            <div className={styles.gridZone}>
              <Grid/>
            </div>

            <div className={styles.hudBar}>
              <HUD/>
            </div>
          </div>
        )}

        {screen === 'game' && gameState === GAME_STATE.LEVEL_WIN  && <WinOverlay  onLevelSelect={() => setScreen('select')}/>}
        {screen === 'game' && gameState === GAME_STATE.GAME_OVER  && <GameOverOverlay onLevelSelect={() => setScreen('select')}/>}
        {screen === 'game' && <MathChallengeOverlay />}
      </div>
    </ErrorBoundary>
  );
}
