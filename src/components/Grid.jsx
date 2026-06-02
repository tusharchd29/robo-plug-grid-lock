import React, { useRef, useState, useEffect, useCallback } from 'react';
import { useGameStore, GAME_STATE } from '../store/gameStore';
import { getConduitCells, DIR } from '../engine/gameEngine';
import styles from './Grid.module.css';

const CELL_SIZE = 64;
const PADDING   = 52;
const DRAG_THRESHOLD = 10; // px before a drag is registered

export default function Grid() {
  const {
    cols, rows, conduits, exits, deadZones,
    selectedConduitId, gameState, nudgeConduitId, animatingRobotId,
    selectConduit, attemptMove,
  } = useGameStore();

  const boardRef      = useRef(null);
  const pointerState  = useRef(null); // { conduitId, startX, startY, pointerId }

  const boardW = cols * CELL_SIZE;
  const boardH = rows * CELL_SIZE;
  const totalW = boardW + PADDING * 2;
  const totalH = boardH + PADDING * 2;

  // ── Pointer down on a conduit ────────────────────────────────────────────
  const onConduitPointerDown = useCallback((e, conduit) => {
    if (gameState !== GAME_STATE.IDLE) return;
    e.stopPropagation();
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);

    selectConduit(conduit.id);
    pointerState.current = {
      conduitId: conduit.id,
      startX: e.clientX,
      startY: e.clientY,
      pointerId: e.pointerId,
      moved: false,
    };
  }, [gameState, selectConduit]);

  // ── Pointer up anywhere ──────────────────────────────────────────────────
  const onConduitPointerUp = useCallback((e, conduit) => {
    const ps = pointerState.current;
    if (!ps || ps.conduitId !== conduit.id) return;

    const dx = e.clientX - ps.startX;
    const dy = e.clientY - ps.startY;
    const absDx = Math.abs(dx);
    const absDy = Math.abs(dy);
    const dist  = Math.max(absDx, absDy);

    pointerState.current = null;

    if (dist < DRAG_THRESHOLD) {
      // Tap — just selection (already done on pointerdown)
      return;
    }

    // Determine direction from drag vector
    let dir;
    if (absDx >= absDy) dir = dx > 0 ? DIR.RIGHT : DIR.LEFT;
    else                dir = dy > 0 ? DIR.DOWN  : DIR.UP;

    attemptMove(conduit.id, dir);
  }, [attemptMove]);

  // ── Click on board background → deselect ────────────────────────────────
  const onBoardPointerDown = useCallback((e) => {
    if (e.target === boardRef.current || e.target.classList.contains(styles.gridLineH) ||
        e.target.classList.contains(styles.gridLineV) || e.target.classList.contains(styles.gridBorder)) {
      selectConduit(null);
      pointerState.current = null;
    }
  }, [selectConduit]);

  // ── Keyboard arrows ───────────────────────────────────────────────────────
  useEffect(() => {
    const onKey = (e) => {
      if (!selectedConduitId || gameState !== GAME_STATE.IDLE) return;
      const map = {
        ArrowRight: DIR.RIGHT, ArrowLeft: DIR.LEFT,
        ArrowDown: DIR.DOWN,   ArrowUp:   DIR.UP,
      };
      if (map[e.key]) {
        e.preventDefault();
        attemptMove(selectedConduitId, map[e.key]);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selectedConduitId, gameState, attemptMove]);

  // ── Render conduits ───────────────────────────────────────────────────────
  function renderConduits() {
    return conduits.map(conduit => {
      const cells     = getConduitCells(conduit);
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
          className={[
            styles.conduit,
            isSelected ? styles.selected : '',
            isNudging  ? styles.nudge    : '',
            conduit.axis === 'H' ? styles.horizontal : styles.vertical,
          ].join(' ')}
          style={{
            left: x, top: y, width: w, height: h,
            '--conduit-color':       conduit.color,
            '--conduit-color-light': conduit.color + '33',
            touchAction: 'none',
          }}
          onPointerDown={e => onConduitPointerDown(e, conduit)}
          onPointerUp={e   => onConduitPointerUp(e, conduit)}
          onPointerCancel={() => { pointerState.current = null; }}
        >
          <div className={styles.conduitInner}>
            <div className={styles.conduitLine} />
            <div className={styles.conduitLine} />
            <div className={styles.conduitEndcap} />
            <div className={styles.conduitEndcap} />
          </div>

          {isSelected && (
            <div className={styles.arrowHints}>
              {conduit.axis === 'H' && (
                <>
                  <span className={`${styles.arrow} ${styles.arrowLeft}`}>◀</span>
                  <span className={`${styles.arrow} ${styles.arrowRight}`}>▶</span>
                </>
              )}
              {conduit.axis === 'V' && (
                <>
                  <span className={`${styles.arrow} ${styles.arrowUp}`}>▲</span>
                  <span className={`${styles.arrow} ${styles.arrowDown}`}>▼</span>
                </>
              )}
            </div>
          )}
        </div>
      );
    });
  }

  // ── Render exit robots ────────────────────────────────────────────────────
  function renderExits() {
    return exits.map(exit => {
      const { id, color, row, col, side, satisfied } = exit;
      const isAnimating = animatingRobotId === id;

      let style = {};
      if (side === 'right')  style = { left: boardW + PADDING + 6, top: row * CELL_SIZE + PADDING + 8 };
      if (side === 'left')   style = { left: 2,                    top: row * CELL_SIZE + PADDING + 8 };
      if (side === 'top')    style = { left: col * CELL_SIZE + PADDING + 8, top: 2 };
      if (side === 'bottom') style = { left: col * CELL_SIZE + PADDING + 8, top: boardH + PADDING + 6 };

      return (
        <div
          key={id}
          className={[
            styles.robot,
            satisfied    ? styles.satisfied : '',
            isAnimating  ? styles.booting   : '',
          ].join(' ')}
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

  // ── Render dead zones ─────────────────────────────────────────────────────
  function renderDeadZones() {
    return deadZones.map(([r, c], i) => (
      <div
        key={i}
        className={styles.deadZone}
        style={{
          left:   c * CELL_SIZE + PADDING,
          top:    r * CELL_SIZE + PADDING,
          width:  CELL_SIZE,
          height: CELL_SIZE,
        }}
      >
        <span className={styles.deadX}>✕</span>
      </div>
    ));
  }

  // ── Render grid lines ─────────────────────────────────────────────────────
  function renderGridLines() {
    const lines = [];
    for (let r = 0; r <= rows; r++) {
      lines.push(
        <div key={`h${r}`} className={styles.gridLineH}
          style={{ top: r * CELL_SIZE + PADDING, left: PADDING, width: boardW }} />
      );
    }
    for (let c = 0; c <= cols; c++) {
      lines.push(
        <div key={`v${c}`} className={styles.gridLineV}
          style={{ left: c * CELL_SIZE + PADDING, top: PADDING, height: boardH }} />
      );
    }
    return lines;
  }

  return (
    <div className={styles.outerWrap}>
      <div
        ref={boardRef}
        className={styles.board}
        style={{ width: totalW, height: totalH, touchAction: 'none' }}
        onPointerDown={onBoardPointerDown}
      >
        <div className={styles.gridBorder}
          style={{ left: PADDING, top: PADDING, width: boardW, height: boardH }} />
        {renderGridLines()}
        {renderDeadZones()}
        {renderConduits()}
        {renderExits()}
      </div>
    </div>
  );
}
