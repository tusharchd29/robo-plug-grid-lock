// ─── GAME ENGINE ────────────────────────────────────────────────────────────
// Pure functions — no side effects, no React, no state.

export const CELL = { EMPTY: 0, DEAD: 'X' };
export const DIR  = { UP: 'UP', DOWN: 'DOWN', LEFT: 'LEFT', RIGHT: 'RIGHT' };

// Return occupied cells for a conduit given its head position
export function getConduitCells(conduit) {
  const { headRow, headCol, length, axis } = conduit;
  const cells = [];
  for (let i = 0; i < length; i++) {
    if (axis === 'H') cells.push([headRow, headCol + i]);
    else              cells.push([headRow + i, headCol]);
  }
  return cells;
}

// Build a fresh grid from a level definition
export function buildGrid(cols, rows, conduits, deadZones = []) {
  const grid = Array.from({ length: rows }, () => Array(cols).fill(CELL.EMPTY));

  deadZones.forEach(([r, c]) => {
    if (r >= 0 && r < rows && c >= 0 && c < cols) grid[r][c] = CELL.DEAD;
  });

  conduits.forEach(conduit => {
    getConduitCells(conduit).forEach(([r, c]) => {
      if (r >= 0 && r < rows && c >= 0 && c < cols) grid[r][c] = conduit.id;
    });
  });

  return grid;
}

// Direction delta
function dirDelta(dir) {
  if (dir === DIR.RIGHT) return { dr: 0, dc: 1 };
  if (dir === DIR.LEFT)  return { dr: 0, dc: -1 };
  if (dir === DIR.DOWN)  return { dr: 1, dc: 0 };
  if (dir === DIR.UP)    return { dr: -1, dc: 0 };
  return { dr: 0, dc: 0 };
}

// Check axis compatibility
export function canMoveInDir(conduit, dir) {
  if (conduit.axis === 'H') return dir === DIR.LEFT || dir === DIR.RIGHT;
  return dir === DIR.UP || dir === DIR.DOWN;
}

// Compute how many steps a conduit can slide.
// Exits live just outside the grid boundary (row=-1, row=rows, col=-1, col=cols).
// Returns { steps, exitsAt } — exitsAt is the exit object or null.
export function calcMaxSteps(conduit, dir, grid, cols, rows, exits) {
  if (!canMoveInDir(conduit, dir)) return { steps: 0, exitsAt: null };

  const { dr, dc } = dirDelta(dir);
  const cells = getConduitCells(conduit);

  // Leading edge cell (front in direction of travel)
  const leadCell = (dir === DIR.RIGHT || dir === DIR.DOWN)
    ? cells[cells.length - 1]
    : cells[0];

  let steps = 0;

  while (true) {
    const nextR = leadCell[0] + dr * (steps + 1);
    const nextC = leadCell[1] + dc * (steps + 1);

    const outOfBounds = nextR < 0 || nextR >= rows || nextC < 0 || nextC >= cols;

    if (outOfBounds) {
      // Is there a matching unsatisfied exit just beyond this edge?
      const exitHere = exits.find(e =>
        !e.satisfied && e.row === nextR && e.col === nextC && e.color === conduit.color
      );
      if (exitHere) return { steps: steps + 1, exitsAt: exitHere };
      return { steps, exitsAt: null };
    }

    // Inside grid — check for blocker
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
    if (r >= 0 && r < newGrid.length && c >= 0 && c < newGrid[0].length)
      newGrid[r][c] = CELL.EMPTY;
  });

  const newConduit = {
    ...conduit,
    headRow: conduit.headRow + dr * steps,
    headCol: conduit.headCol + dc * steps,
  };

  // Write new cells
  getConduitCells(newConduit).forEach(([r, c]) => {
    if (r >= 0 && r < newGrid.length && c >= 0 && c < newGrid[0].length)
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
  if (movesUsed <= targetMoves)     return 3;
  if (movesUsed <= targetMoves + 3) return 2;
  return 1;
}

// Check if all robots satisfied
export function isLevelComplete(satisfiedRobots, totalRobots) {
  return satisfiedRobots >= totalRobots;
}
