import { create } from 'zustand';
import { LEVELS } from '../levels/levels';
import {
  buildGrid, calcMaxSteps, moveConduit, removeConduit,
  calcStars, isLevelComplete, canMoveInDir, DIR
} from '../engine/gameEngine';

export const GAME_STATE = {
  IDLE: 'IDLE',
  MOVING: 'MOVING',
  REACTIVE_ANIMATION: 'REACTIVE_ANIMATION',
  LEVEL_WIN: 'LEVEL_WIN',
  GAME_OVER: 'GAME_OVER',
};

const LEVEL_TIME = 15; // seconds

function initLevel(levelDef) {
  const conduits  = levelDef.conduits.map(c => ({ ...c }));
  const deadZones = levelDef.deadZones || [];
  const grid      = buildGrid(levelDef.cols, levelDef.rows, conduits, deadZones);
  return {
    levelDef,
    cols: levelDef.cols,
    rows: levelDef.rows,
    grid,
    conduits,
    exits: levelDef.exits.map(e => ({ ...e, satisfied: false })),
    deadZones,
    movesUsed: 0,
    maxMoves: levelDef.maxMoves,
    targetMoves: levelDef.targetMoves,
    satisfiedCount: 0,
    totalBots: levelDef.exits.length,
    selectedConduitId: null,
    gameState: GAME_STATE.IDLE,
    animatingRobotId: null,
    nudgeConduitId: null,
    stars: 0,
    history: [],
    timeLeft: LEVEL_TIME,
    timerActive: false,
  };
}

let timerInterval = null;

function clearTimer() {
  if (timerInterval) { clearInterval(timerInterval); timerInterval = null; }
}

export const useGameStore = create((set, get) => ({
  currentLevelIndex: 0,
  unlockedLevels: 1,
  levelStars: {},
  ...initLevel(LEVELS[0]),

  loadLevel(index) {
    clearTimer();
    const { unlockedLevels, levelStars } = get();
    set({ currentLevelIndex: index, unlockedLevels, levelStars, ...initLevel(LEVELS[index]) });
  },

  startTimer() {
    clearTimer();
    set({ timerActive: true, timeLeft: LEVEL_TIME });
    timerInterval = setInterval(() => {
      const { timeLeft, gameState, satisfiedCount, totalBots } = get();
      if (gameState === GAME_STATE.LEVEL_WIN || gameState === GAME_STATE.GAME_OVER) {
        clearTimer();
        return;
      }
      const next = timeLeft - 0.1;
      if (next <= 0) {
        clearTimer();
        set({ timeLeft: 0, timerActive: false, gameState: GAME_STATE.GAME_OVER });
      } else {
        set({ timeLeft: next });
      }
    }, 100);
  },

  selectConduit(id) {
    const s = get();
    if (s.gameState !== GAME_STATE.IDLE) return;
    // Start timer on first interaction
    if (!s.timerActive && s.timeLeft === LEVEL_TIME) {
      get().startTimer();
    }
    set(st => ({ selectedConduitId: st.selectedConduitId === id ? null : id }));
  },

  attemptMove(conduitId, dir) {
    const s = get();
    if (s.gameState !== GAME_STATE.IDLE) return;

    // Start timer on first move if not started
    if (!s.timerActive && s.timeLeft === LEVEL_TIME) {
      get().startTimer();
    }

    const conduit = s.conduits.find(c => c.id === conduitId);
    if (!conduit) return;

    if (!canMoveInDir(conduit, dir)) {
      set({ nudgeConduitId: conduitId });
      setTimeout(() => set({ nudgeConduitId: null }), 400);
      return;
    }

    const { steps, exitsAt } = calcMaxSteps(conduit, dir, s.grid, s.cols, s.rows, s.exits);

    if (steps === 0 && !exitsAt) {
      set({ nudgeConduitId: conduitId });
      setTimeout(() => set({ nudgeConduitId: null }), 400);
      return;
    }

    const snapshot = {
      grid:           s.grid.map(r => [...r]),
      conduits:       s.conduits.map(c => ({ ...c })),
      exits:          s.exits.map(e => ({ ...e })),
      movesUsed:      s.movesUsed,
      satisfiedCount: s.satisfiedCount,
    };

    set({ gameState: GAME_STATE.MOVING, selectedConduitId: conduitId });

    setTimeout(() => {
      const curr = get();

      if (exitsAt) {
        const slideSteps   = steps - 1;
        let   workGrid     = curr.grid;
        let   movedConduit = conduit;

        if (slideSteps > 0) {
          const result = moveConduit(conduit, slideSteps, dir, workGrid);
          workGrid     = result.grid;
          movedConduit = result.conduit;
        }

        const newGrid      = removeConduit(movedConduit, workGrid);
        const newConduits  = curr.conduits.filter(c => c.id !== conduitId);
        const newExits     = curr.exits.map(e => e.id === exitsAt.id ? { ...e, satisfied: true } : e);
        const newSatisfied = curr.satisfiedCount + 1;
        const newMoves     = curr.movesUsed + 1;

        set({
          grid: newGrid, conduits: newConduits, exits: newExits,
          satisfiedCount: newSatisfied, movesUsed: newMoves,
          gameState: GAME_STATE.REACTIVE_ANIMATION,
          animatingRobotId: exitsAt.id,
          history: [...curr.history, snapshot],
          selectedConduitId: null,
        });

        setTimeout(() => {
          if (isLevelComplete(newSatisfied, curr.totalBots)) {
            clearTimer();
            const stars       = calcStars(newMoves, curr.targetMoves);
            const newUnlocked = Math.max(curr.unlockedLevels, Math.min(curr.currentLevelIndex + 2, LEVELS.length));
            set({
              gameState: GAME_STATE.LEVEL_WIN, stars,
              animatingRobotId: null,
              timerActive: false,
              unlockedLevels: newUnlocked,
              levelStars: {
                ...curr.levelStars,
                [curr.levelDef.id]: Math.max(curr.levelStars[curr.levelDef.id] || 0, stars),
              },
            });
          } else {
            set({ gameState: GAME_STATE.IDLE, animatingRobotId: null });
          }
        }, 900);

      } else {
        const { conduit: moved, grid: newGrid } = moveConduit(conduit, steps, dir, curr.grid);
        const newConduits = curr.conduits.map(c => c.id === conduitId ? moved : c);
        const newMoves    = curr.movesUsed + 1;
        set({
          grid: newGrid, conduits: newConduits,
          movesUsed: newMoves,
          gameState: GAME_STATE.IDLE,
          history: [...curr.history, snapshot],
          selectedConduitId: null,
        });
      }
    }, 280);
  },

  undo() {
    const { history, gameState } = get();
    if (gameState !== GAME_STATE.IDLE && gameState !== GAME_STATE.GAME_OVER) return;
    if (!history.length) return;
    const prev = history[history.length - 1];
    set({
      ...prev,
      history: history.slice(0, -1),
      gameState: GAME_STATE.IDLE,
      selectedConduitId: null,
      nudgeConduitId: null,
      animatingRobotId: null,
    });
  },

  restart() {
    clearTimer();
    const { currentLevelIndex, unlockedLevels, levelStars } = get();
    set({ ...initLevel(LEVELS[currentLevelIndex]), unlockedLevels, levelStars, currentLevelIndex });
  },

  nextLevel() {
    clearTimer();
    const { currentLevelIndex, unlockedLevels, levelStars } = get();
    const next = currentLevelIndex + 1;
    if (next >= LEVELS.length) return;
    set({ ...initLevel(LEVELS[next]), currentLevelIndex: next, unlockedLevels, levelStars });
  },
}));
