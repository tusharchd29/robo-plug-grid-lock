import React, { useRef, useState, useEffect } from 'react';
import { useGameStore, GAME_STATE } from '../store/gameStore';
import { getConduitCells, canMoveInDir, DIR } from '../engine/gameEngine';
import styles from './Grid.module.css';

const CELL_SIZE = 64; // px per grid cell

export default function Grid() {
  const {
    cols, rows, grid, conduits, exits, deadZones,
    selectedConduitId, gameState, nudgeConduitId,
    exitingConduitId, animatingRobotId,
    selectConduit, attemptMove,
  } = useGameStore();

  const [dragStart, setDragStart] = useState(null);
  const boardRef = useRef(null);

  const boardW = cols * CELL_SIZE;
  const boardH = rows * CELL_SIZE;
  const PADDING = 52; // space for exit robots around the grid

  function getEventPos(e) {
    const touch = e.touches?.[0] || e;
    const rect = boardRef.current.getBoundingClientRect();
    return { x: touch.clientX - rect.left, y: touch.clientY - rect.top };
  }

  function handleConduitPointerDown(e, conduit) {
    if (gameState !== GAME_STATE.IDLE) return;
    e.stopPropagation();
    selectConduit(conduit.id);
    setDragStart(getEventPos(e));
  }

  function handlePointerUp(e) {
    if (!dragStart || !selectedConduitId) { setDragStart(null); return; }
    const pos = getEventPos(e);
    const dx = pos.x - dragStart.x;
    const dy = pos.y - dragStart.y;
    const absDx = Math.abs(dx), absDy = Math.abs(dy);
    if (Math.max(absDx, absDy) < 12) { setDragStart(null); return; }

    let dir;
    if (absDx > absDy) dir = dx > 0 ? DIR.RIGHT : DIR.LEFT;
    else               dir = dy > 0 ? DIR.DOWN  : DIR.UP;

    attemptMove(selectedConduitId, dir);
    setDragStart(null);
  }

  // Keyboard arrow support
  useEffect(() => {
    function onKey(e) {
      if (!selectedConduitId || gameState !== GAME_STATE.IDLE) return;
      const map = { ArrowRight: DIR.RIGHT, ArrowLeft: DIR.LEFT, ArrowDown: DIR.DOWN, ArrowUp: DIR.UP };
      if (map[e.key]) { e.preventDefault(); attemptMove(selectedConduitId, map[e.key]); }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selectedConduitId, gameState, attemptMove]);

  // Render exit terminals around the border
  function renderExits() {
    return exits.map(exit => {
      const { id, color, row, col, side, satisfied } = exit;
      const isAnimating = animatingRobotId === id;

      let style = {};
      if (side === 'right')  { style = { left: boardW + PADDING + 4, top: row * CELL_SIZE + PADDING }; }
      if (side === 'left')   { style = { left: 0,                    top: row * CELL_SIZE + PADDING }; }
      if (side === 'top')    { style = { left: col * CELL_SIZE + PADDING, top: 0 }; }
      if (side === 'bottom') { style = { left: col * CELL_SIZE + PADDING, top: boardH + PADDING + 4 }; }

      return (
        <div
          key={id}
          className={`${styles.robot} ${satisfied ? styles.satisfied : ''} ${isAnimating ? styles.booting : ''}`}
          style={{ ...style, '--robot-color': color }}
        >
          <div className={styles.robotFace}>
            {satisfied ? '^_^' : isAnimating ? 'O_O' : '>_<'}
          </div>
          <div className={styles.robotColorDot} style={{ background: color }} />
        </div>
      );
    });
  }

  // Render conduit blocks
  function renderConduits() {
    return conduits.map(conduit => {
      const cells = getConduitCells(conduit);
      const isSelected = selectedConduitId === conduit.id;
      const isNudging  = nudgeConduitId === conduit.id;

      const minR = Math.min(...cells.map(([r]) => r));
      const minC = Math.min(...cells.map(([, c]) => c));
      const maxR = Math.max(...cells.map(([r]) => r));
      const maxC = Math.max(...cells.map(([, c]) => c));

      const x = minC * CELL_SIZE + PADDING + 4;
      const y = minR * CELL_SIZE + PADDING + 4;
      const w = (maxC - minC + 1) * CELL_SIZE - 8;
      const h = (maxR - minR + 1) * CELL_SIZE - 8;

      return (
        <div
          key={conduit.id}
          className={`
            ${styles.conduit}
            ${isSelected ? styles.selected : ''}
            ${isNudging  ? styles.nudge   : ''}
            ${conduit.axis === 'H' ? styles.horizontal : styles.vertical}
          `}
          style={{
            left: x, top: y, width: w, height: h,
            '--conduit-color': conduit.color,
            '--conduit-color-light': conduit.color + '33',
          }}
          onMouseDown={e => handleConduitPointerDown(e, conduit)}
          onTouchStart={e => handleConduitPointerDown(e, conduit)}
        >
          <div className={styles.conduitInner}>
            <div className={styles.conduitLine} />
            <div className={styles.conduitLine} />
            <div className={styles.conduitEndcap} />
            <div className={styles.conduitEndcap} style={{ [conduit.axis === 'H' ? 'right' : 'bottom']: 6 }} />
          </div>
          {isSelected && (
            <div className={styles.arrows}>
              {conduit.axis === 'H' && <><span className={styles.arrow} style={{ left: -28 }}>◀</span><span className={styles.arrow} style={{ right: -28 }}>▶</span></>}
              {conduit.axis === 'V' && <><span className={styles.arrow} style={{ top: -28 }}>▲</span><span className={styles.arrow} style={{ bottom: -28 }}>▼</span></>}
            </div>
          )}
        </div>
      );
    });
  }

  // Render dead zones
  function renderDeadZones() {
    return deadZones.map(([r, c], i) => (
      <div
        key={i}
        className={styles.deadZone}
        style={{
          left: c * CELL_SIZE + PADDING,
          top:  r * CELL_SIZE + PADDING,
          width: CELL_SIZE, height: CELL_SIZE,
        }}
      >
        <span className={styles.deadX}>✕</span>
      </div>
    ));
  }

  // Grid lines
  function renderGridLines() {
    const lines = [];
    for (let r = 0; r <= rows; r++) {
      lines.push(
        <div key={`h${r}`} className={styles.gridLineH} style={{ top: r * CELL_SIZE + PADDING, left: PADDING, width: boardW }} />
      );
    }
    for (let c = 0; c <= cols; c++) {
      lines.push(
        <div key={`v${c}`} className={styles.gridLineV} style={{ left: c * CELL_SIZE + PADDING, top: PADDING, height: boardH }} />
      );
    }
    return lines;
  }

  const totalW = boardW + PADDING * 2;
  const totalH = boardH + PADDING * 2;

  return (
    <div className={styles.outerWrap}
      onMouseUp={handlePointerUp}
      onTouchEnd={handlePointerUp}
    >
      <div
        ref={boardRef}
        className={styles.board}
        style={{ width: totalW, height: totalH }}
        onMouseDown={e => {
          if (e.target === boardRef.current) selectConduit(null);
        }}
      >
        {/* Grid border */}
        <div
          className={styles.gridBorder}
          style={{ left: PADDING, top: PADDING, width: boardW, height: boardH }}
        />
        {renderGridLines()}
        {renderDeadZones()}
        {renderConduits()}
        {renderExits()}
      </div>
    </div>
  );
}
