import React, { useRef, useEffect, useCallback } from 'react';
import { useGameStore, GAME_STATE } from '../store/gameStore';
import { getConduitCells, DIR } from '../engine/gameEngine';
import YarnBall from './YarnBall';
import styles from './Grid.module.css';

const PADDING = 32;
const DRAG_THRESHOLD = 8;

function getCellSize(cols, rows, maxW, maxH) {
  const byCol = Math.floor((maxW - PADDING * 2) / cols);
  const byRow = Math.floor((maxH - PADDING * 2) / rows);
  return Math.max(44, Math.min(76, Math.min(byCol, byRow)));
}

export default function Grid() {
  const {
    cols, rows, conduits, exits, deadZones,
    selectedConduitId, gameState, nudgeConduitId, animatingRobotId,
    selectConduit, attemptMove,
  } = useGameStore();

  const wrapRef = useRef(null);
  const drag    = useRef(null);
  const [cs, setCs] = React.useState(52);

  useEffect(() => {
    function measure() {
      if (!wrapRef.current) return;
      const { width, height } = wrapRef.current.getBoundingClientRect();
      setCs(getCellSize(cols, rows, width, height));
    }
    measure();
    const ro = new ResizeObserver(measure);
    if (wrapRef.current) ro.observe(wrapRef.current);
    return () => ro.disconnect();
  }, [cols, rows]);

  const CELL = cs;
  const boardW = cols * CELL;
  const boardH = rows * CELL;
  const totalW = boardW + PADDING * 2;
  const totalH = boardH + PADDING * 2;

  // Touch/pointer up
  useEffect(() => {
    function getXY(e) {
      if (e.changedTouches?.length) return { x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY };
      return { x: e.clientX, y: e.clientY };
    }
    function onUp(e) {
      if (!drag.current) return;
      const { conduitId, startX, startY } = drag.current;
      drag.current = null;
      const { x, y } = getXY(e);
      const dx = x - startX, dy = y - startY;
      if (Math.max(Math.abs(dx), Math.abs(dy)) < DRAG_THRESHOLD) return;
      const dir = Math.abs(dx) >= Math.abs(dy)
        ? (dx > 0 ? DIR.RIGHT : DIR.LEFT)
        : (dy > 0 ? DIR.DOWN : DIR.UP);
      attemptMove(conduitId, dir);
    }
    window.addEventListener('pointerup', onUp);
    window.addEventListener('touchend', onUp, { passive: true });
    return () => { window.removeEventListener('pointerup', onUp); window.removeEventListener('touchend', onUp); };
  }, [attemptMove]);

  // Keyboard
  useEffect(() => {
    function onKey(e) {
      if (!selectedConduitId || gameState !== GAME_STATE.IDLE) return;
      const map = { ArrowRight: DIR.RIGHT, ArrowLeft: DIR.LEFT, ArrowDown: DIR.DOWN, ArrowUp: DIR.UP };
      if (map[e.key]) { e.preventDefault(); attemptMove(selectedConduitId, map[e.key]); }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selectedConduitId, gameState, attemptMove]);

  const onConduitDown = useCallback((e, conduit) => {
    if (gameState !== GAME_STATE.IDLE) return;
    e.preventDefault(); e.stopPropagation();
    selectConduit(conduit.id);
    const startX = e.touches?.[0]?.clientX ?? e.clientX;
    const startY = e.touches?.[0]?.clientY ?? e.clientY;
    drag.current = { conduitId: conduit.id, startX, startY };
  }, [gameState, selectConduit]);

  const onBoardDown = useCallback((e) => {
    if (!e.target.closest('[data-conduit]')) { selectConduit(null); drag.current = null; }
  }, [selectConduit]);

  function renderConduits() {
    return conduits.map(conduit => {
      const cells = getConduitCells(conduit);
      const isSelected = selectedConduitId === conduit.id;
      const isNudging  = nudgeConduitId === conduit.id;
      const minR = Math.min(...cells.map(([r]) => r));
      const minC = Math.min(...cells.map(([, c]) => c));
      const maxR = Math.max(...cells.map(([r]) => r));
      const maxC = Math.max(...cells.map(([, c]) => c));
      const x = minC * CELL + PADDING + 4;
      const y = minR * CELL + PADDING + 4;
      const w = (maxC - minC + 1) * CELL - 8;
      const h = (maxR - minR + 1) * CELL - 8;
      const isH = conduit.axis === 'H';

      return (
        <div
          key={conduit.id}
          data-conduit={conduit.id}
          className={[
            styles.yarn,
            isH ? styles.yarnH : styles.yarnV,
            isSelected ? styles.selected : '',
            isNudging ? styles.nudge : '',
          ].join(' ')}
          style={{
            left: x, top: y, width: w, height: h,
            '--yarn-color': conduit.color,
            '--yarn-color-mid': conduit.color + 'cc',
            '--yarn-color-light': conduit.color + '44',
          }}
          onPointerDown={e => onConduitDown(e, conduit)}
        >
          {/* Yarn strand body */}
          <div className={styles.yarnBody}>
            <div className={styles.yarnShadow} />
            <div className={styles.yarnMain} />
            <div className={styles.yarnSheen} />
            {/* Twist marks */}
            {Array.from({ length: Math.max(1, Math.floor((isH ? w : h) / 18)) }).map((_, i) => (
              <div key={i} className={isH ? styles.twistH : styles.twistV}
                style={{ [isH ? 'left' : 'top']: `${12 + i * 18}px` }} />
            ))}
          </div>
          {/* End caps */}
          <div className={isH ? styles.capLeft : styles.capTop} />
          <div className={isH ? styles.capRight : styles.capBottom} />
          {/* Selected glow */}
          {isSelected && <div className={styles.selectedGlow} />}
          {/* Direction arrows when selected */}
          {isSelected && (
            <div className={styles.arrows}>
              {isH ? (
                <>
                  <span className={`${styles.arrow} ${styles.arrowL}`}>◂</span>
                  <span className={`${styles.arrow} ${styles.arrowR}`}>▸</span>
                </>
              ) : (
                <>
                  <span className={`${styles.arrow} ${styles.arrowU}`}>▴</span>
                  <span className={`${styles.arrow} ${styles.arrowD}`}>▾</span>
                </>
              )}
            </div>
          )}
        </div>
      );
    });
  }

  function renderExits() {
    return exits.map(exit => {
      const { id, color, row, col, side, satisfied } = exit;
      const isAnimating = animatingRobotId === id;
      const ballSize = Math.min(CELL - 4, 40);
      const half = (CELL - ballSize) / 2;
      let style = {};
      if (side === 'right')  style = { left: boardW + PADDING + 2,      top: row * CELL + PADDING + half };
      if (side === 'left')   style = { left: 2,                          top: row * CELL + PADDING + half };
      if (side === 'top')    style = { left: col * CELL + PADDING + half, top: 2 };
      if (side === 'bottom') style = { left: col * CELL + PADDING + half, top: boardH + PADDING + 2 };
      return (
        <div key={id} className={styles.exitSlot} style={{ ...style, position: 'absolute' }}>
          <YarnBall color={color} satisfied={satisfied} size={ballSize} animating={isAnimating} />
        </div>
      );
    });
  }

  function renderDeadZones() {
    return deadZones.map(([r, c], i) => (
      <div key={i} className={styles.deadZone}
        style={{ left: c * CELL + PADDING, top: r * CELL + PADDING, width: CELL, height: CELL }}>
        <span className={styles.deadX}>🐾</span>
      </div>
    ));
  }

  function renderGridLines() {
    const lines = [];
    for (let r = 0; r <= rows; r++)
      lines.push(<div key={`h${r}`} className={styles.lineH}
        style={{ top: r * CELL + PADDING, left: PADDING, width: boardW }} />);
    for (let c = 0; c <= cols; c++)
      lines.push(<div key={`v${c}`} className={styles.lineV}
        style={{ left: c * CELL + PADDING, top: PADDING, height: boardH }} />);
    return lines;
  }

  return (
    <div ref={wrapRef} className={styles.outerWrap}>
      <div className={styles.board}
        style={{ width: totalW, height: totalH, touchAction: 'none' }}
        onPointerDown={onBoardDown}
      >
        <div className={styles.gridBg}
          style={{ left: PADDING, top: PADDING, width: boardW, height: boardH }} />
        {renderGridLines()}
        {renderDeadZones()}
        {renderConduits()}
        {renderExits()}
      </div>
    </div>
  );
}
