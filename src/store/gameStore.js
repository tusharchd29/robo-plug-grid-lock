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
  };
}

export const useGameStore = create((set, get) => ({
  currentLevelIndex: 0,
  unlockedLevels: 1,
  levelStars: {},
  ...initLevel(LEVELS[0]),

  loadLevel(index) {
    const { unlockedLevels, levelStars } = get();
    set({ currentLevelIndex: index, unlockedLevels, levelStars, ...initLevel(LEVELS[index]) });
  },

  selectConduit(id) {
    if (get().gameState !== GAME_STATE.IDLE) return;
    set(s => ({ selectedConduitId: s.selectedConduitId === id ? null : id }));
  },

  attemptMove(conduitId, dir) {
    const s = get();
    if (s.gameState !== GAME_STATE.IDLE) return;

    const conduit = s.conduits.find(c => c.id === conduitId);
    if (!conduit) return;

    // Wrong axis — nudge
    if (!canMoveInDir(conduit, dir)) {
      set({ nudgeConduitId: conduitId });
      setTimeout(() => set({ nudgeConduitId: null }), 400);
      return;
    }

    const { steps, exitsAt } = calcMaxSteps(
      conduit, dir, s.grid, s.cols, s.rows, s.exits
    );

    // Completely blocked — nudge
    if (steps === 0 && !exitsAt) {
      set({ nudgeConduitId: conduitId });
      setTimeout(() => set({ nudgeConduitId: null }), 400);
      return;
    }

    // Snapshot for undo
    const snapshot = {
      grid:          s.grid.map(r => [...r]),
      conduits:      s.conduits.map(c => ({ ...c })),
      exits:         s.exits.map(e => ({ ...e })),
      movesUsed:     s.movesUsed,
      satisfiedCount: s.satisfiedCount,
    };

    // Lock input during animation
    set({ gameState: GAME_STATE.MOVING, selectedConduitId: conduitId });

    setTimeout(() => {
      const curr = get();

      if (exitsAt) {
        // ── EXIT PATH ────────────────────────────────────────────────────
        // 1. Slide inside the grid (steps - 1 cells)
        // 2. Remove the conduit from the grid
        // IMPORTANT: use the *moved* conduit reference for removeConduit

        const slideSteps   = steps - 1;
        let   workGrid     = curr.grid;
        let   movedConduit = conduit;  // will be updated if we slide first

        if (slideSteps > 0) {
          const result = moveConduit(conduit, slideSteps, dir, workGrid);
          workGrid     = result.grid;
          movedConduit = result.conduit; // ← use the post-slide conduit!
        }

        // Remove the conduit from wherever it ended up
        const newGrid     = removeConduit(movedConduit, workGrid);
        const newConduits = curr.conduits.filter(c => c.id !== conduitId);
        const newExits    = curr.exits.map(e =>
          e.id === exitsAt.id ? { ...e, satisfied: true } : e
        );
        const newSatisfied = curr.satisfiedCount + 1;
        const newMoves     = curr.movesUsed + 1;

        set({
          grid:            newGrid,
          conduits:        newConduits,
          exits:           newExits,
          satisfiedCount:  newSatisfied,
          movesUsed:       newMoves,
          gameState:       GAME_STATE.REACTIVE_ANIMATION,
          animatingRobotId: exitsAt.id,
          history:         [...curr.history, snapshot],
          selectedConduitId: null,
        });

        // After robot boot animation — check win using LOCAL variables, not stale state
        setTimeout(() => {
          if (isLevelComplete(newSatisfied, curr.totalBots)) {
            const stars       = calcStars(newMoves, curr.targetMoves);
            const newUnlocked = Math.max(
              curr.unlockedLevels,
              Math.min(curr.currentLevelIndex + 2, LEVELS.length)
            );
            set({
              gameState:    GAME_STATE.LEVEL_WIN,
              stars,
              animatingRobotId: null,
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
        // ── NORMAL SLIDE ─────────────────────────────────────────────────
        const { conduit: moved, grid: newGrid } = moveConduit(conduit, steps, dir, curr.grid);
        const newConduits = curr.conduits.map(c => c.id === conduitId ? moved : c);
        const newMoves    = curr.movesUsed + 1;
        const newHistory  = [...curr.history, snapshot];

        const isOver = newMoves >= curr.maxMoves && curr.satisfiedCount < curr.totalBots;
        set({
          grid:            newGrid,
          conduits:        newConduits,
          movesUsed:       newMoves,
          gameState:       isOver ? GAME_STATE.GAME_OVER : GAME_STATE.IDLE,
          history:         newHistory,
          selectedConduitId: null,
        });
      }
    }, 320);
  },

  undo() {
    const { history, gameState } = get();
    if (gameState !== GAME_STATE.IDLE && gameState !== GAME_STATE.GAME_OVER) return;
    if (!history.length) return;
    const prev = history[history.length - 1];
    set({
      ...prev,
      history:         history.slice(0, -1),
      gameState:       GAME_STATE.IDLE,
      selectedConduitId: null,
      nudgeConduitId:  null,
      animatingRobotId: null,
    });
  },

  restart() {
    const { currentLevelIndex, unlockedLevels, levelStars } = get();
    set({ ...initLevel(LEVELS[currentLevelIndex]), unlockedLevels, levelStars, currentLevelIndex });
  },

  nextLevel() {
    const { currentLevelIndex, unlockedLevels, levelStars } = get();
    const next = currentLevelIndex + 1;
    if (next >= LEVELS.length) return;
    set({ ...initLevel(LEVELS[next]), currentLevelIndex: next, unlockedLevels, levelStars });
  },
}));
