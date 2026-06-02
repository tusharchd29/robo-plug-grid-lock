import React, { useRef, useEffect, useCallback } from 'react';
import { useGameStore, GAME_STATE } from '../store/gameStore';
import { getConduitCells, DIR } from '../engine/gameEngine';
import styles from './Grid.module.css';

const PADDING = 44;
const DRAG_THRESHOLD = 6;

// Compute cell size based on available container width
function getCellSize(cols, rows, maxW, maxH) {
  const usable = Math.min(maxW - PADDING * 2, maxH - PADDING * 2);
  const byCol  = Math.floor((maxW  - PADDING * 2) / cols);
  const byRow  = Math.floor((maxH  - PADDING * 2) / rows);
  return Math.max(36, Math.min(64, byCol, byRow));
}

export default function Grid() {
  const {
    cols, rows, conduits, exits, deadZones,
    selectedConduitId, gameState, nudgeConduitId, animatingRobotId,
    selectConduit, attemptMove,
  } = useGameStore();

  const wrapRef  = useRef(null);
  const drag     = useRef(null);
  const cellSize = useRef(52);

  // Measure container and pick cell size
  const [cs, setCs] = React.useState(52);
  useEffect(() => {
    function measure() {
      if (!wrapRef.current) return;
      const { width, height } = wrapRef.current.getBoundingClientRect();
      const next = getCellSize(cols, rows, width, height);
      setCs(next);
      cellSize.current = next;
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

  // ── Global pointer up on window ───────────────────────────────────────────
  useEffect(() => {
    function onUp(e) {
      if (!drag.current) return;
      const { conduitId, startX, startY } = drag.current;
      drag.current = null;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      if (Math.max(Math.abs(dx), Math.abs(dy)) < DRAG_THRESHOLD) return;
      let dir;
      if (Math.abs(dx) >= Math.abs(dy)) dir = dx > 0 ? DIR.RIGHT : DIR.LEFT;
      else                               dir = dy > 0 ? DIR.DOWN  : DIR.UP;
      attemptMove(conduitId, dir);
    }
    window.addEventListener('pointerup', onUp);
    return () => window.removeEventListener('pointerup', onUp);
  }, [attemptMove]);

  // ── Keyboard ──────────────────────────────────────────────────────────────
  useEffect(() => {
    function onKey(e) {
      if (!selectedConduitId || gameState !== GAME_STATE.IDLE) return;
      const map = { ArrowRight:DIR.RIGHT, ArrowLeft:DIR.LEFT, ArrowDown:DIR.DOWN, ArrowUp:DIR.UP };
      if (map[e.key]) { e.preventDefault(); attemptMove(selectedConduitId, map[e.key]); }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selectedConduitId, gameState, attemptMove]);

  const onConduitDown = useCallback((e, conduit) => {
    if (gameState !== GAME_STATE.IDLE) return;
    e.preventDefault(); e.stopPropagation();
    selectConduit(conduit.id);
    drag.current = { conduitId: conduit.id, startX: e.clientX, startY: e.clientY };
  }, [gameState, selectConduit]);

  const onBoardDown = useCallback((e) => {
    if (!e.target.closest('[data-conduit]')) {
      selectConduit(null); drag.current = null;
    }
  }, [selectConduit]);

  function renderConduits() {
    return conduits.map(conduit => {
      const cells      = getConduitCells(conduit);
      const isSelected = selectedConduitId === conduit.id;
      const isNudging  = nudgeConduitId === conduit.id;
      const minR = Math.min(...cells.map(([r])=>r));
      const minC = Math.min(...cells.map(([,c])=>c));
      const maxR = Math.max(...cells.map(([r])=>r));
      const maxC = Math.max(...cells.map(([,c])=>c));
      const x = minC*CELL + PADDING + 3;
      const y = minR*CELL + PADDING + 3;
      const w = (maxC-minC+1)*CELL - 6;
      const h = (maxR-minR+1)*CELL - 6;

      return (
        <div key={conduit.id} data-conduit={conduit.id}
          className={[styles.conduit, isSelected?styles.selected:'', isNudging?styles.nudge:'',
            conduit.axis==='H'?styles.horizontal:styles.vertical].join(' ')}
          style={{ left:x, top:y, width:w, height:h,
            '--conduit-color': conduit.color,
            '--conduit-color-light': conduit.color+'33' }}
          onPointerDown={e => onConduitDown(e, conduit)}
        >
          <div className={styles.conduitInner}>
            <div className={styles.conduitLine}/>
            <div className={styles.conduitLine}/>
            <div className={styles.conduitEndcap}/>
            <div className={styles.conduitEndcap}/>
          </div>
          {isSelected && (
            <div className={styles.arrowHints} aria-hidden="true">
              {conduit.axis==='H' && <><span className={`${styles.arrow} ${styles.arrowLeft}`}>◀</span><span className={`${styles.arrow} ${styles.arrowRight}`}>▶</span></>}
              {conduit.axis==='V' && <><span className={`${styles.arrow} ${styles.arrowUp}`}>▲</span><span className={`${styles.arrow} ${styles.arrowDown}`}>▼</span></>}
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
      const RS = Math.min(CELL - 6, 38); // robot size
      let style = {};
      const rOff = (CELL - RS) / 2;
      if (side==='right')  style = { left: boardW+PADDING+4,         top: row*CELL+PADDING+rOff };
      if (side==='left')   style = { left: 4,                        top: row*CELL+PADDING+rOff };
      if (side==='top')    style = { left: col*CELL+PADDING+rOff,    top: 4 };
      if (side==='bottom') style = { left: col*CELL+PADDING+rOff,    top: boardH+PADDING+4 };
      return (
        <div key={id}
          className={[styles.robot, satisfied?styles.satisfied:'', isAnimating?styles.booting:''].join(' ')}
          style={{ ...style, '--robot-color':color, width:RS, height:RS, fontSize: Math.max(7, RS*0.24) }}
        >
          <div className={styles.robotFace}>{satisfied?'^_^':isAnimating?'O_O':'>_<'}</div>
          <div className={styles.robotColorDot} style={{ background:color }}/>
        </div>
      );
    });
  }

  function renderDeadZones() {
    return deadZones.map(([r,c],i) => (
      <div key={i} className={styles.deadZone}
        style={{ left:c*CELL+PADDING, top:r*CELL+PADDING, width:CELL, height:CELL }}>
        <span className={styles.deadX}>✕</span>
      </div>
    ));
  }

  function renderGridLines() {
    const lines = [];
    for (let r=0; r<=rows; r++)
      lines.push(<div key={`h${r}`} className={styles.gridLineH}
        style={{ top:r*CELL+PADDING, left:PADDING, width:boardW }}/>);
    for (let c=0; c<=cols; c++)
      lines.push(<div key={`v${c}`} className={styles.gridLineV}
        style={{ left:c*CELL+PADDING, top:PADDING, height:boardH }}/>);
    return lines;
  }

  return (
    <div ref={wrapRef} className={styles.outerWrap}>
      <div className={styles.board}
        style={{ width:totalW, height:totalH, touchAction:'none' }}
        onPointerDown={onBoardDown}
      >
        <div className={styles.gridBorder}
          style={{ left:PADDING, top:PADDING, width:boardW, height:boardH }}/>
        {renderGridLines()}
        {renderDeadZones()}
        {renderConduits()}
        {renderExits()}
      </div>
    </div>
  );
}
