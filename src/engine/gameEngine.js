// ─── GAME ENGINE ────────────────────────────────────────────────────────────
// Pure functions — no side effects, no React, no state.
// All movement math and collision detection lives here.

export const CELL = { EMPTY: 0, DEAD: 'X' };
export const DIR  = { UP: 'UP', DOWN: 'DOWN', LEFT: 'LEFT', RIGHT: 'RIGHT' };

// Build a fresh grid from a level definition
export function buildGrid(cols, rows, conduits, deadZones = []) {
  const grid = Array.from({ length: rows }, () => Array(cols).fill(CELL.EMPTY));

  deadZones.forEach(([r, c]) => {
    grid[r][c] = CELL.DEAD;
  });

  conduits.forEach(conduit => {
    conduit.cells.forEach(([r, c]) => {
      grid[r][c] = conduit.id;
    });
  });

  return grid;
}

// Return occupied cells for a conduit given its current head position
export function getConduitCells(conduit) {
  const { headRow, headCol, length, axis } = conduit;
  const cells = [];
  for (let i = 0; i < length; i++) {
    if (axis === 'H') cells.push([headRow, headCol + i]);
    else              cells.push([headRow + i, headCol]);
  }
  return cells;
}

// Given a direction, return how the head moves (+1 or -1 per step)
function dirDelta(dir) {
  if (dir === DIR.RIGHT) return { dr: 0, dc: 1 };
  if (dir === DIR.LEFT)  return { dr: 0, dc: -1 };
  if (dir === DIR.DOWN)  return { dr: 1, dc: 0 };
  if (dir === DIR.UP)    return { dr: -1, dc: 0 };
}

// Check axis compatibility
export function canMoveInDir(conduit, dir) {
  if (conduit.axis === 'H') return dir === DIR.LEFT || dir === DIR.RIGHT;
  return dir === DIR.UP || dir === DIR.DOWN;
}

// Compute how many steps a conduit can slide in a direction before hitting
// another conduit, a dead zone, or the grid boundary (exclusive of exits)
export function calcMaxSteps(conduit, dir, grid, cols, rows, exits) {
  if (!canMoveInDir(conduit, dir)) return 0;

  const { dr, dc } = dirDelta(dir);
  const cells = getConduitCells(conduit);

  // Leading edge cells (the cells in the direction of travel)
  const leading = dir === DIR.RIGHT || dir === DIR.DOWN
    ? [cells[cells.length - 1]]
    : [cells[0]];

  let steps = 0;
  while (true) {
    const nextR = leading[0][0] + dr * (steps + 1);
    const nextC = leading[0][1] + dc * (steps + 1);

    // Check if we're stepping onto an exit terminal
    const exitHere = exits.find(e => e.row === nextR && e.col === nextC);
    if (exitHere) {
      // Can exit only if it's aligned with this conduit's color
      if (exitHere.color === conduit.color) {
        steps++;
        return { steps, exitsAt: exitHere };
      }
      // Wrong color exit — blocks movement
      return { steps, exitsAt: null };
    }

    // Out of bounds = wall (no exit here)
    if (nextR < 0 || nextR >= rows || nextC < 0 || nextC >= cols) {
      return { steps, exitsAt: null };
    }

    // Check grid cell
    const cell = grid[nextR][nextC];
    if (cell !== CELL.EMPTY) return { steps, exitsAt: null };

    steps++;
  }
}

// Move a conduit by `steps` in `dir`, return new conduit + updated grid
export function moveConduit(conduit, steps, dir, grid) {
  if (steps === 0) return { conduit, grid };

  const { dr, dc } = dirDelta(dir);
  const newGrid = grid.map(r => [...r]);

  // Clear old cells
  getConduitCells(conduit).forEach(([r, c]) => {
    newGrid[r][c] = CELL.EMPTY;
  });

  const newConduit = {
    ...conduit,
    headRow: conduit.headRow + dr * steps,
    headCol: conduit.headCol + dc * steps,
  };

  // Write new cells
  getConduitCells(newConduit).forEach(([r, c]) => {
    newGrid[r][c] = newConduit.id;
  });

  return { conduit: newConduit, grid: newGrid };
}

// Remove a conduit from the grid (when it exits)
export function removeConduit(conduit, grid) {
  const newGrid = grid.map(r => [...r]);
  getConduitCells(conduit).forEach(([r, c]) => {
    if (r >= 0 && r < newGrid.length && c >= 0 && c < newGrid[0].length)
      newGrid[r][c] = CELL.EMPTY;
  });
  return newGrid;
}

// Compute star rating
export function calcStars(movesUsed, targetMoves) {
  if (movesUsed <= targetMoves)         return 3;
  if (movesUsed <= targetMoves + 3)     return 2;
  return 1;
}

// Check if all robots satisfied
export function isLevelComplete(satisfiedRobots, totalRobots) {
  return satisfiedRobots >= totalRobots;
}
