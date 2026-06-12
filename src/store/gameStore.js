import { create } from 'zustand';
import { LEVELS } from '../levels/levels';
import {
  buildGrid, calcMaxSteps, calcGhostSteps, moveConduit, removeConduit,
  calcStars, isLevelComplete, canMoveInDir, DIR
} from '../engine/gameEngine';

export const GAME_STATE = {
  IDLE: 'IDLE',
  MOVING: 'MOVING',
  REACTIVE_ANIMATION: 'REACTIVE_ANIMATION',
  LEVEL_WIN: 'LEVEL_WIN',
  GAME_OVER: 'GAME_OVER',
};

export const POWER_STATE = {
  IDLE: 'IDLE',
  PENDING_SELECT: 'PENDING_SELECT',
  MATH_CHALLENGE: 'MATH_CHALLENGE',
  GHOST_ARMED: 'GHOST_ARMED',
};

// Recharge modal types
export const RECHARGE_TYPE = {
  NONE: 'NONE',
  TIMER: 'TIMER',       // timer expired — answer to continue
  GHOST: 'GHOST',       // ghost charges exhausted
  UNDO: 'UNDO',         // undos exhausted
};

function getLevelTime(index) {
  if (index < 8)  return 10;
  if (index < 15) return 12;
  if (index < 20) return 15;
  return 13;
}

const MAX_POWER_CHARGES = 3;
const MAX_UNDOS         = 3;
const TIMER_RESCUE_MAX  = 3;   // max rescues per level
const RECHARGE_NEEDED   = 2;   // questions needed to recharge ghost/undo

// HARD math — for ghost power unlock
function generateHardMath() {
  const type = Math.floor(Math.random() * 3);
  if (type === 0) {
    const a = Math.floor(Math.random() * 40) + 5;
    const b = Math.floor(Math.random() * 40) + 5;
    return { a, op: '+', b, answer: a + b };
  } else if (type === 1) {
    const a = Math.floor(Math.random() * 40) + 20;
    const b = Math.floor(Math.random() * (a - 1)) + 1;
    return { a, op: '−', b, answer: a - b };
  } else {
    const a = Math.floor(Math.random() * 8) + 2;
    const b = Math.floor(Math.random() * 8) + 2;
    return { a, op: '×', b, answer: a * b };
  }
}

// EASY math — for recharges and timer rescue
function generateEasyMath() {
  const useAdd = Math.random() > 0.5;
  if (useAdd) {
    const a = Math.floor(Math.random() * 15) + 1;
    const b = Math.floor(Math.random() * 15) + 1;
    return { a, op: '+', b, answer: a + b };
  } else {
    const a = Math.floor(Math.random() * 18) + 2;
    const b = Math.floor(Math.random() * (a - 1)) + 1;
    return { a, op: '−', b, answer: a - b };
  }
}

function initLevel(levelDef, index) {
  const conduits  = levelDef.conduits.map(c => ({ ...c }));
  const deadZones = levelDef.deadZones || [];
  const grid      = buildGrid(levelDef.cols, levelDef.rows, conduits, deadZones);
  const LEVEL_TIME = getLevelTime(index);
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
    levelTime: LEVEL_TIME,
    timerActive: false,
    undosLeft: MAX_UNDOS,
    powerCharges: MAX_POWER_CHARGES,
    powerState: POWER_STATE.IDLE,
    powerConduitId: null,
    mathQuestion: null,
    mathShake: false,
    // Recharge state
    rechargeType: RECHARGE_TYPE.NONE,
    rechargeProgress: 0,          // how many correct answers so far this recharge session
    rechargeNeeded: 0,            // total correct needed (1 for timer, 2 for ghost/undo)
    rechargeMathQuestion: null,
    rechargeMathShake: false,
    timerRescuesLeft: TIMER_RESCUE_MAX,
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
  ...initLevel(LEVELS[0], 0),

  loadLevel(index) {
    clearTimer();
    const { unlockedLevels, levelStars, powerCharges } = get();
    set({
      currentLevelIndex: index,
      unlockedLevels,
      levelStars,
      ...initLevel(LEVELS[index], index),
      powerCharges,
    });
  },

  startTimer() {
    clearTimer();
    const LEVEL_TIME = getLevelTime(get().currentLevelIndex);
    set({ timerActive: true, timeLeft: LEVEL_TIME, levelTime: LEVEL_TIME });
    timerInterval = setInterval(() => {
      const s = get();
      if (s.gameState === GAME_STATE.LEVEL_WIN || s.gameState === GAME_STATE.GAME_OVER) {
        clearTimer(); return;
      }
      // Pause timer while any recharge modal is open
      if (s.rechargeType !== RECHARGE_TYPE.NONE) return;
      const next = s.timeLeft - 0.1;
      if (next <= 0) {
        clearTimer();
        // Check if timer rescue is available
        if (s.timerRescuesLeft > 0) {
          set({
            timeLeft: 0,
            timerActive: false,
            rechargeType: RECHARGE_TYPE.TIMER,
            rechargeProgress: 0,
            rechargeNeeded: 1,
            rechargeMathQuestion: generateEasyMath(),
            rechargeMathShake: false,
          });
        } else {
          set({ timeLeft: 0, timerActive: false, gameState: GAME_STATE.GAME_OVER });
        }
      } else {
        set({ timeLeft: next });
      }
    }, 100);
  },

  // ── Recharge: submit answer ──────────────────────────────────────────────
  submitRechargeAnswer(userAnswer) {
    const s = get();
    if (s.rechargeType === RECHARGE_TYPE.NONE) return;

    const correct = parseInt(userAnswer, 10) === s.rechargeMathQuestion.answer;

    if (!correct) {
      // Wrong answer — shake and give new question, no progress lost
      set({ rechargeMathShake: true, rechargeMathQuestion: generateEasyMath() });
      setTimeout(() => set({ rechargeMathShake: false }), 500);
      return;
    }

    const newProgress = s.rechargeProgress + 1;

    if (newProgress < s.rechargeNeeded) {
      // Need more correct answers — show next question
      set({
        rechargeProgress: newProgress,
        rechargeMathQuestion: generateEasyMath(),
        rechargeMathShake: false,
      });
      return;
    }

    // All answers correct — apply recharge
    if (s.rechargeType === RECHARGE_TYPE.TIMER) {
      const LEVEL_TIME = getLevelTime(s.currentLevelIndex);
      set({
        rechargeType: RECHARGE_TYPE.NONE,
        rechargeProgress: 0,
        rechargeMathQuestion: null,
        rechargeMathShake: false,
        timerRescuesLeft: s.timerRescuesLeft - 1,
        timeLeft: LEVEL_TIME,
        timerActive: true,
      });
      // Restart the interval
      get().startTimer();
    } else if (s.rechargeType === RECHARGE_TYPE.GHOST) {
      set({
        rechargeType: RECHARGE_TYPE.NONE,
        rechargeProgress: 0,
        rechargeMathQuestion: null,
        rechargeMathShake: false,
        powerCharges: MAX_POWER_CHARGES,
      });
    } else if (s.rechargeType === RECHARGE_TYPE.UNDO) {
      set({
        rechargeType: RECHARGE_TYPE.NONE,
        rechargeProgress: 0,
        rechargeMathQuestion: null,
        rechargeMathShake: false,
        undosLeft: MAX_UNDOS,
      });
    }
  },

  // Dismiss recharge modal — for timer this means accept game over
  dismissRecharge() {
    const s = get();
    if (s.rechargeType === RECHARGE_TYPE.TIMER) {
      set({
        rechargeType: RECHARGE_TYPE.NONE,
        rechargeMathQuestion: null,
        gameState: GAME_STATE.GAME_OVER,
      });
    } else {
      // For ghost/undo: just close, charges stay at 0
      set({
        rechargeType: RECHARGE_TYPE.NONE,
        rechargeProgress: 0,
        rechargeMathQuestion: null,
        rechargeMathShake: false,
      });
    }
  },

  // ── Ghost power ──────────────────────────────────────────────────────────
  selectConduit(id) {
    const s = get();
    if (s.gameState !== GAME_STATE.IDLE) return;

    if (s.powerState === POWER_STATE.PENDING_SELECT) {
      if (!id) {
        set({ powerState: POWER_STATE.IDLE, selectedConduitId: null });
        return;
      }
      set({
        powerState: POWER_STATE.MATH_CHALLENGE,
        powerConduitId: id,
        selectedConduitId: id,
        mathQuestion: generateHardMath(),
        mathShake: false,
      });
      return;
    }

    if (!s.timerActive && s.timeLeft === s.levelTime) get().startTimer();
    set(st => ({ selectedConduitId: st.selectedConduitId === id ? null : id }));
  },

  activatePower() {
    const s = get();
    if (s.gameState !== GAME_STATE.IDLE) return;
    if (s.powerState !== POWER_STATE.IDLE) {
      set({ powerState: POWER_STATE.IDLE, selectedConduitId: null });
      return;
    }
    if (s.powerCharges <= 0) {
      // Trigger ghost recharge modal
      set({
        rechargeType: RECHARGE_TYPE.GHOST,
        rechargeProgress: 0,
        rechargeNeeded: RECHARGE_NEEDED,
        rechargeMathQuestion: generateEasyMath(),
        rechargeMathShake: false,
      });
      return;
    }
    set({ powerState: POWER_STATE.PENDING_SELECT, selectedConduitId: null });
  },

  submitMathAnswer(userAnswer) {
    const s = get();
    if (s.powerState !== POWER_STATE.MATH_CHALLENGE) return;
    if (parseInt(userAnswer, 10) === s.mathQuestion.answer) {
      set({
        powerState: POWER_STATE.GHOST_ARMED,
        powerCharges: s.powerCharges - 1,
        mathQuestion: null,
        mathShake: false,
      });
    } else {
      set({ mathShake: true, mathQuestion: generateHardMath() });
      setTimeout(() => set({ mathShake: false }), 500);
    }
  },

  cancelPower() {
    set({
      powerState: POWER_STATE.IDLE,
      powerConduitId: null,
      mathQuestion: null,
      mathShake: false,
      selectedConduitId: null,
    });
  },

  attemptMove(conduitId, dir) {
    const s = get();
    if (s.gameState !== GAME_STATE.IDLE) return;

    if (!s.timerActive && s.timeLeft === s.levelTime) get().startTimer();

    const conduit = s.conduits.find(c => c.id === conduitId);
    if (!conduit) return;

    const isGhost = s.powerState === POWER_STATE.GHOST_ARMED && s.powerConduitId === conduitId;

    if (!canMoveInDir(conduit, dir)) {
      set({ nudgeConduitId: conduitId });
      setTimeout(() => set({ nudgeConduitId: null }), 400);
      if (isGhost) set({ powerState: POWER_STATE.IDLE, powerConduitId: null });
      return;
    }

    const { steps, exitsAt } = isGhost
      ? calcGhostSteps(conduit, dir, s.grid, s.cols, s.rows, s.exits)
      : calcMaxSteps(conduit, dir, s.grid, s.cols, s.rows, s.exits);

    if (steps === 0 && !exitsAt) {
      set({ nudgeConduitId: conduitId });
      setTimeout(() => set({ nudgeConduitId: null }), 400);
      if (isGhost) set({ powerState: POWER_STATE.IDLE, powerConduitId: null });
      return;
    }

    const snapshot = {
      grid:           s.grid.map(r => [...r]),
      conduits:       s.conduits.map(c => ({ ...c })),
      exits:          s.exits.map(e => ({ ...e })),
      movesUsed:      s.movesUsed,
      satisfiedCount: s.satisfiedCount,
      undosLeft:      s.undosLeft,
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
          powerState: POWER_STATE.IDLE,
          powerConduitId: null,
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
          powerState: POWER_STATE.IDLE,
          powerConduitId: null,
        });
      }
    }, 280);
  },

  undo() {
    const s = get();
    if (s.gameState !== GAME_STATE.IDLE && s.gameState !== GAME_STATE.GAME_OVER) return;
    if (!s.history.length) return;
    if (s.undosLeft <= 0) {
      // Trigger undo recharge modal
      set({
        rechargeType: RECHARGE_TYPE.UNDO,
        rechargeProgress: 0,
        rechargeNeeded: RECHARGE_NEEDED,
        rechargeMathQuestion: generateEasyMath(),
        rechargeMathShake: false,
      });
      return;
    }
    const prev = s.history[s.history.length - 1];
    set({
      ...prev,
      movesUsed: s.movesUsed + 1,
      undosLeft: s.undosLeft - 1,
      history: s.history.slice(0, -1),
      gameState: GAME_STATE.IDLE,
      selectedConduitId: null,
      nudgeConduitId: null,
      animatingRobotId: null,
      powerState: POWER_STATE.IDLE,
      powerConduitId: null,
    });
  },

  restart() {
    clearTimer();
    const { currentLevelIndex, unlockedLevels, levelStars, powerCharges } = get();
    set({ ...initLevel(LEVELS[currentLevelIndex], currentLevelIndex), unlockedLevels, levelStars, currentLevelIndex, powerCharges });
  },

  nextLevel() {
    clearTimer();
    const { currentLevelIndex, unlockedLevels, levelStars, powerCharges } = get();
    const next = currentLevelIndex + 1;
    if (next >= LEVELS.length) return;
    set({ ...initLevel(LEVELS[next], next), currentLevelIndex: next, unlockedLevels, levelStars, powerCharges });
  },
}));
