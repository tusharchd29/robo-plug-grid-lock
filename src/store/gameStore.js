import { create } from 'zustand';
import { LEVELS } from '../levels/levels';
import {
  buildGrid, getConduitCells, calcMaxSteps,
  moveConduit, removeConduit, calcStars, isLevelComplete, canMoveInDir, DIR
} from '../engine/gameEngine';

export const GAME_STATE = {
  IDLE: 'IDLE',
  MOVING: 'MOVING',
  REACTIVE_ANIMATION: 'REACTIVE_ANIMATION',
  LEVEL_WIN: 'LEVEL_WIN',
  GAME_OVER: 'GAME_OVER',
};

function initLevel(levelDef) {
  const conduits = levelDef.conduits.map(c => ({ ...c }));
  const grid = buildGrid(levelDef.cols, levelDef.rows, conduits, levelDef.deadZones);
  return {
    levelDef,
    cols: levelDef.cols,
    rows: levelDef.rows,
    grid,
    conduits,
    exits: levelDef.exits.map(e => ({ ...e, satisfied: false })),
    deadZones: levelDef.deadZones || [],
    movesUsed: 0,
    maxMoves: levelDef.maxMoves,
    targetMoves: levelDef.targetMoves,
    satisfiedCount: 0,
    totalBots: levelDef.exits.length,
    selectedConduitId: null,
    gameState: GAME_STATE.IDLE,
    animatingRobotId: null,
    exitingConduitId: null,
    nudgeConduitId: null,
    stars: 0,
    history: [],
  };
}

export const useGameStore = create((set, get) => ({
  currentLevelIndex: 0,
  unlockedLevels: 1,
  levelStars: {},    // { levelId: stars }
  ...initLevel(LEVELS[0]),

  // ── Load a level ──────────────────────────────────────────────────────────
  loadLevel(index) {
    const levelDef = LEVELS[index];
    set({ currentLevelIndex: index, ...initLevel(levelDef) });
  },

  // ── Select / deselect conduit ────────────────────────────────────────────
  selectConduit(id) {
    const { gameState } = get();
    if (gameState !== GAME_STATE.IDLE) return;
    set(s => ({
      selectedConduitId: s.selectedConduitId === id ? null : id,
    }));
  },

  // ── Attempt move ──────────────────────────────────────────────────────────
  attemptMove(conduitId, dir) {
    const s = get();
    if (s.gameState !== GAME_STATE.IDLE) return;

    const conduit = s.conduits.find(c => c.id === conduitId);
    if (!conduit) return;

    // Axis check
    if (!canMoveInDir(conduit, dir)) {
      set({ nudgeConduitId: conduitId });
      setTimeout(() => set({ nudgeConduitId: null }), 400);
      return;
    }

    const { steps, exitsAt } = calcMaxSteps(
      conduit, dir, s.grid, s.cols, s.rows, s.exits
    );

    if (steps === 0 && !exitsAt) {
      // Blocked — nudge animation
      set({ nudgeConduitId: conduitId });
      setTimeout(() => set({ nudgeConduitId: null }), 400);
      return;
    }

    // Save history snapshot for undo
    const snapshot = {
      grid: s.grid.map(r => [...r]),
      conduits: s.conduits.map(c => ({ ...c })),
      exits: s.exits.map(e => ({ ...e })),
      movesUsed: s.movesUsed,
      satisfiedCount: s.satisfiedCount,
    };

    // Start move animation
    set({ gameState: GAME_STATE.MOVING, selectedConduitId: conduitId });

    // After animation delay, apply state
    setTimeout(() => {
      const curr = get();
      if (exitsAt) {
        // Conduit exits the grid
        const newGrid = removeConduit(conduit, curr.grid);
        const newConduits = curr.conduits.filter(c => c.id !== conduitId);
        const newExits = curr.exits.map(e =>
          e.id === exitsAt.id ? { ...e, satisfied: true } : e
        );
        const newSatisfied = curr.satisfiedCount + 1;
        const newMoves = curr.movesUsed + 1;

        set({
          grid: newGrid,
          conduits: newConduits,
          exits: newExits,
          satisfiedCount: newSatisfied,
          movesUsed: newMoves,
          exitingConduitId: null,
          gameState: GAME_STATE.REACTIVE_ANIMATION,
          animatingRobotId: exitsAt.id,
          history: [...curr.history, snapshot],
          selectedConduitId: null,
        });

        // After robot animation, check win
        setTimeout(() => {
          const afterAnim = get();
          if (isLevelComplete(afterAnim.satisfiedCount, afterAnim.totalBots)) {
            const stars = calcStars(afterAnim.movesUsed, afterAnim.targetMoves);
            const newUnlocked = Math.max(
              afterAnim.unlockedLevels,
              Math.min(afterAnim.currentLevelIndex + 2, LEVELS.length)
            );
            set({
              gameState: GAME_STATE.LEVEL_WIN,
              stars,
              animatingRobotId: null,
              unlockedLevels: newUnlocked,
              levelStars: {
                ...afterAnim.levelStars,
                [afterAnim.levelDef.id]: Math.max(
                  afterAnim.levelStars[afterAnim.levelDef.id] || 0,
                  stars
                ),
              },
            });
          } else {
            set({ gameState: GAME_STATE.IDLE, animatingRobotId: null });
          }
        }, 900);

      } else {
        // Normal slide
        const { conduit: moved, grid: newGrid } = moveConduit(
          conduit, steps, dir, curr.grid
        );
        const newConduits = curr.conduits.map(c =>
          c.id === conduitId ? moved : c
        );
        const newMoves = curr.movesUsed + 1;

        if (newMoves >= curr.maxMoves && curr.satisfiedCount < curr.totalBots) {
          set({
            grid: newGrid,
            conduits: newConduits,
            movesUsed: newMoves,
            gameState: GAME_STATE.GAME_OVER,
            history: [...curr.history, snapshot],
            selectedConduitId: null,
          });
        } else {
          set({
            grid: newGrid,
            conduits: newConduits,
            movesUsed: newMoves,
            gameState: GAME_STATE.IDLE,
            history: [...curr.history, snapshot],
            selectedConduitId: null,
          });
        }
      }
    }, 320);
  },

  // ── Undo last move ────────────────────────────────────────────────────────
  undo() {
    const { history, gameState } = get();
    if (gameState !== GAME_STATE.IDLE && gameState !== GAME_STATE.GAME_OVER) return;
    if (history.length === 0) return;
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

  // ── Restart current level ─────────────────────────────────────────────────
  restart() {
    const { currentLevelIndex, unlockedLevels, levelStars } = get();
    set({
      ...initLevel(LEVELS[currentLevelIndex]),
      unlockedLevels,
      levelStars,
      currentLevelIndex,
    });
  },

  // ── Next level ────────────────────────────────────────────────────────────
  nextLevel() {
    const { currentLevelIndex, unlockedLevels, levelStars } = get();
    const next = currentLevelIndex + 1;
    if (next >= LEVELS.length) return;
    set({
      ...initLevel(LEVELS[next]),
      currentLevelIndex: next,
      unlockedLevels,
      levelStars,
    });
  },
}));
