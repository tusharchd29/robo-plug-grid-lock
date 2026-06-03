// ─── LEVEL DEFINITIONS ──────────────────────────────────────────────────────
// cols, rows     — grid size
// targetMoves    — par (3 stars if ≤ target)
// maxMoves       — hard cap (game over)
// conduits[]     — { id, color, axis:'H'|'V', headRow, headCol, length }
// exits[]        — terminals just outside grid edge
//                  side 'top': row=-1, side 'bottom': row=rows
//                  side 'left': col=-1, side 'right': col=cols
// deadZones[]    — [[row,col], ...]

export const LEVELS = [

  // ── L1: 4×4 tutorial — 3 conduits, totally open ─────────────────────────
  {
    id:1, cols:4, rows:4, targetMoves:3, maxMoves:12, deadZones:[],
    conduits:[
      { id:'c1', color:'#fb7185', axis:'H', headRow:0, headCol:0, length:2 },
      { id:'c2', color:'#34d399', axis:'V', headRow:1, headCol:3, length:2 },
      { id:'c3', color:'#60a5fa', axis:'H', headRow:3, headCol:1, length:2 },
    ],
    exits:[
      { id:'e1', color:'#fb7185', row:0,  col:4,  side:'right'  },
      { id:'e2', color:'#34d399', row:-1, col:3,  side:'top'    },
      { id:'e3', color:'#60a5fa', row:3,  col:4,  side:'right'  },
    ],
  },

  // ── L2: 4×4 — 4 conduits, basic blocking ────────────────────────────────
  {
    id:2, cols:4, rows:4, targetMoves:4, maxMoves:14, deadZones:[],
    conduits:[
      { id:'c1', color:'#fb7185', axis:'H', headRow:0, headCol:0, length:2 },
      { id:'c2', color:'#34d399', axis:'V', headRow:1, headCol:3, length:2 },
      { id:'c3', color:'#facc15', axis:'H', headRow:2, headCol:0, length:2 },
      { id:'c4', color:'#c084fc', axis:'V', headRow:0, headCol:2, length:1 },
    ],
    exits:[
      { id:'e1', color:'#fb7185', row:0,  col:4,  side:'right'  },
      { id:'e2', color:'#34d399', row:4,  col:3,  side:'bottom' },
      { id:'e3', color:'#facc15', row:2,  col:4,  side:'right'  },
      { id:'e4', color:'#c084fc', row:-1, col:2,  side:'top'    },
    ],
  },

  // ── L3: 5×5 — 5 conduits, intro routing ─────────────────────────────────
  {
    id:3, cols:5, rows:5, targetMoves:5, maxMoves:16, deadZones:[],
    conduits:[
      { id:'c1', color:'#fb7185', axis:'H', headRow:0, headCol:0, length:2 },
      { id:'c2', color:'#34d399', axis:'V', headRow:0, headCol:4, length:2 },
      { id:'c3', color:'#60a5fa', axis:'H', headRow:2, headCol:1, length:2 },
      { id:'c4', color:'#facc15', axis:'V', headRow:3, headCol:3, length:2 },
      { id:'c5', color:'#c084fc', axis:'H', headRow:4, headCol:0, length:2 },
    ],
    exits:[
      { id:'e1', color:'#fb7185', row:0,  col:5,  side:'right'  },
      { id:'e2', color:'#34d399', row:-1, col:4,  side:'top'    },
      { id:'e3', color:'#60a5fa', row:2,  col:5,  side:'right'  },
      { id:'e4', color:'#facc15', row:5,  col:3,  side:'bottom' },
      { id:'e5', color:'#c084fc', row:4,  col:-1, side:'left'   },
    ],
  },

  // ── L4: 5×5 — conduits block each other ─────────────────────────────────
  {
    id:4, cols:5, rows:5, targetMoves:6, maxMoves:18, deadZones:[],
    conduits:[
      { id:'c1', color:'#fb7185', axis:'H', headRow:1, headCol:0, length:2 },
      { id:'c2', color:'#34d399', axis:'V', headRow:0, headCol:3, length:2 },
      { id:'c3', color:'#60a5fa', axis:'H', headRow:2, headCol:3, length:2 },
      { id:'c4', color:'#facc15', axis:'V', headRow:2, headCol:0, length:2 },
      { id:'c5', color:'#c084fc', axis:'H', headRow:4, headCol:2, length:3 },
    ],
    exits:[
      { id:'e1', color:'#fb7185', row:1,  col:5,  side:'right'  },
      { id:'e2', color:'#34d399', row:-1, col:3,  side:'top'    },
      { id:'e3', color:'#60a5fa', row:2,  col:5,  side:'right'  },
      { id:'e4', color:'#facc15', row:5,  col:0,  side:'bottom' },
      { id:'e5', color:'#c084fc', row:4,  col:5,  side:'right'  },
    ],
  },

  // ── L5: 5×5 — length-3 conduits ─────────────────────────────────────────
  {
    id:5, cols:5, rows:5, targetMoves:7, maxMoves:20, deadZones:[],
    conduits:[
      { id:'c1', color:'#fb7185', axis:'H', headRow:0, headCol:0, length:3 },
      { id:'c2', color:'#34d399', axis:'V', headRow:0, headCol:4, length:2 },
      { id:'c3', color:'#60a5fa', axis:'H', headRow:2, headCol:0, length:2 },
      { id:'c4', color:'#facc15', axis:'V', headRow:2, headCol:2, length:2 },
      { id:'c5', color:'#c084fc', axis:'H', headRow:4, headCol:2, length:3 },
      { id:'c6', color:'#f97316', axis:'V', headRow:3, headCol:0, length:2 },
    ],
    exits:[
      { id:'e1', color:'#fb7185', row:0,  col:5,  side:'right'  },
      { id:'e2', color:'#34d399', row:-1, col:4,  side:'top'    },
      { id:'e3', color:'#60a5fa', row:2,  col:5,  side:'right'  },
      { id:'e4', color:'#facc15', row:5,  col:2,  side:'bottom' },
      { id:'e5', color:'#c084fc', row:4,  col:5,  side:'right'  },
      { id:'e6', color:'#f97316', row:5,  col:0,  side:'bottom' },
    ],
  },

  // ── L6: 5×5 — first dead zone ────────────────────────────────────────────
  {
    id:6, cols:5, rows:5, targetMoves:7, maxMoves:20, deadZones:[[2,2]],
    conduits:[
      { id:'c1', color:'#fb7185', axis:'H', headRow:0, headCol:0, length:2 },
      { id:'c2', color:'#34d399', axis:'V', headRow:0, headCol:4, length:2 },
      { id:'c3', color:'#60a5fa', axis:'H', headRow:2, headCol:3, length:2 },
      { id:'c4', color:'#facc15', axis:'V', headRow:3, headCol:1, length:2 },
      { id:'c5', color:'#c084fc', axis:'H', headRow:4, headCol:3, length:2 },
    ],
    exits:[
      { id:'e1', color:'#fb7185', row:0,  col:5,  side:'right'  },
      { id:'e2', color:'#34d399', row:-1, col:4,  side:'top'    },
      { id:'e3', color:'#60a5fa', row:2,  col:5,  side:'right'  },
      { id:'e4', color:'#facc15', row:5,  col:1,  side:'bottom' },
      { id:'e5', color:'#c084fc', row:4,  col:5,  side:'right'  },
    ],
  },

  // ── L7: 5×5 — two dead zones ─────────────────────────────────────────────
  {
    id:7, cols:5, rows:5, targetMoves:8, maxMoves:22, deadZones:[[1,1],[3,3]],
    conduits:[
      { id:'c1', color:'#fb7185', axis:'H', headRow:0, headCol:2, length:2 },
      { id:'c2', color:'#34d399', axis:'V', headRow:0, headCol:0, length:1 },
      { id:'c3', color:'#60a5fa', axis:'H', headRow:2, headCol:0, length:2 },
      { id:'c4', color:'#facc15', axis:'V', headRow:2, headCol:4, length:2 },
      { id:'c5', color:'#c084fc', axis:'H', headRow:4, headCol:0, length:3 },
      { id:'c6', color:'#f97316', axis:'V', headRow:3, headCol:1, length:1 },
    ],
    exits:[
      { id:'e1', color:'#fb7185', row:0,  col:5,  side:'right'  },
      { id:'e2', color:'#34d399', row:5,  col:0,  side:'bottom' },
      { id:'e3', color:'#60a5fa', row:2,  col:-1, side:'left'   },
      { id:'e4', color:'#facc15', row:-1, col:4,  side:'top'    },
      { id:'e5', color:'#c084fc', row:4,  col:5,  side:'right'  },
      { id:'e6', color:'#f97316', row:5,  col:1,  side:'bottom' },
    ],
  },

  // ── L8: 6×6 intro ────────────────────────────────────────────────────────
  {
    id:8, cols:6, rows:6, targetMoves:8, maxMoves:24, deadZones:[[2,2]],
    conduits:[
      { id:'c1', color:'#fb7185', axis:'H', headRow:0, headCol:0, length:2 },
      { id:'c2', color:'#34d399', axis:'V', headRow:0, headCol:5, length:2 },
      { id:'c3', color:'#60a5fa', axis:'H', headRow:2, headCol:3, length:2 },
      { id:'c4', color:'#facc15', axis:'V', headRow:3, headCol:1, length:2 },
      { id:'c5', color:'#c084fc', axis:'H', headRow:4, headCol:3, length:3 },
      { id:'c6', color:'#f97316', axis:'V', headRow:0, headCol:4, length:1 },
    ],
    exits:[
      { id:'e1', color:'#fb7185', row:0,  col:6,  side:'right'  },
      { id:'e2', color:'#34d399', row:-1, col:5,  side:'top'    },
      { id:'e3', color:'#60a5fa', row:2,  col:6,  side:'right'  },
      { id:'e4', color:'#facc15', row:6,  col:1,  side:'bottom' },
      { id:'e5', color:'#c084fc', row:4,  col:6,  side:'right'  },
      { id:'e6', color:'#f97316', row:-1, col:4,  side:'top'    },
    ],
  },

  // ── L9: 6×6 dense ────────────────────────────────────────────────────────
  {
    id:9, cols:6, rows:6, targetMoves:9, maxMoves:26, deadZones:[[1,2],[4,3]],
    conduits:[
      { id:'c1', color:'#fb7185', axis:'H', headRow:0, headCol:0, length:2 },
      { id:'c2', color:'#34d399', axis:'V', headRow:0, headCol:5, length:1 },
      { id:'c3', color:'#60a5fa', axis:'H', headRow:2, headCol:0, length:2 },
      { id:'c4', color:'#facc15', axis:'V', headRow:2, headCol:4, length:2 },
      { id:'c5', color:'#c084fc', axis:'H', headRow:4, headCol:0, length:2 },
      { id:'c6', color:'#f97316', axis:'V', headRow:3, headCol:1, length:1 },
      { id:'c7', color:'#06b6d4', axis:'H', headRow:5, headCol:4, length:2 },
    ],
    exits:[
      { id:'e1', color:'#fb7185', row:0,  col:6,  side:'right'  },
      { id:'e2', color:'#34d399', row:-1, col:5,  side:'top'    },
      { id:'e3', color:'#60a5fa', row:2,  col:-1, side:'left'   },
      { id:'e4', color:'#facc15', row:-1, col:4,  side:'top'    },
      { id:'e5', color:'#c084fc', row:4,  col:-1, side:'left'   },
      { id:'e6', color:'#f97316', row:6,  col:1,  side:'bottom' },
      { id:'e7', color:'#06b6d4', row:5,  col:6,  side:'right'  },
    ],
  },

  // ── L10: 6×6 three dead zones ────────────────────────────────────────────
  {
    id:10, cols:6, rows:6, targetMoves:10, maxMoves:28, deadZones:[[1,1],[2,4],[4,2]],
    conduits:[
      { id:'c1', color:'#fb7185', axis:'H', headRow:0, headCol:2, length:2 },
      { id:'c2', color:'#34d399', axis:'V', headRow:0, headCol:5, length:2 },
      { id:'c3', color:'#60a5fa', axis:'H', headRow:2, headCol:0, length:2 },
      { id:'c4', color:'#facc15', axis:'V', headRow:3, headCol:3, length:2 },
      { id:'c5', color:'#c084fc', axis:'H', headRow:4, headCol:4, length:2 },
      { id:'c6', color:'#f97316', axis:'V', headRow:3, headCol:0, length:1 },
      { id:'c7', color:'#06b6d4', axis:'H', headRow:5, headCol:0, length:2 },
    ],
    exits:[
      { id:'e1', color:'#fb7185', row:0,  col:6,  side:'right'  },
      { id:'e2', color:'#34d399', row:-1, col:5,  side:'top'    },
      { id:'e3', color:'#60a5fa', row:2,  col:-1, side:'left'   },
      { id:'e4', color:'#facc15', row:6,  col:3,  side:'bottom' },
      { id:'e5', color:'#c084fc', row:4,  col:6,  side:'right'  },
      { id:'e6', color:'#f97316', row:6,  col:0,  side:'bottom' },
      { id:'e7', color:'#06b6d4', row:5,  col:-1, side:'left'   },
    ],
  },

  // ── L11: 6×6 ─────────────────────────────────────────────────────────────
  {
    id:11, cols:6, rows:6, targetMoves:10, maxMoves:28, deadZones:[[0,3],[5,5]],
    conduits:[
      { id:'c1', color:'#fb7185', axis:'H', headRow:1, headCol:0, length:2 },
      { id:'c2', color:'#34d399', axis:'V', headRow:0, headCol:5, length:2 },
      { id:'c3', color:'#60a5fa', axis:'H', headRow:2, headCol:1, length:3 },
      { id:'c4', color:'#facc15', axis:'V', headRow:3, headCol:2, length:2 },
      { id:'c5', color:'#c084fc', axis:'H', headRow:4, headCol:0, length:2 },
      { id:'c6', color:'#f97316', axis:'V', headRow:1, headCol:4, length:2 },
      { id:'c7', color:'#06b6d4', axis:'H', headRow:5, headCol:0, length:2 },
    ],
    exits:[
      { id:'e1', color:'#fb7185', row:1,  col:-1, side:'left'   },
      { id:'e2', color:'#34d399', row:-1, col:5,  side:'top'    },
      { id:'e3', color:'#60a5fa', row:2,  col:6,  side:'right'  },
      { id:'e4', color:'#facc15', row:6,  col:2,  side:'bottom' },
      { id:'e5', color:'#c084fc', row:4,  col:-1, side:'left'   },
      { id:'e6', color:'#f97316', row:6,  col:4,  side:'bottom' },
      { id:'e7', color:'#06b6d4', row:5,  col:-1, side:'left'   },
    ],
  },

  // ── L12: 6×6 tight spacing ───────────────────────────────────────────────
  {
    id:12, cols:6, rows:6, targetMoves:11, maxMoves:30, deadZones:[[1,3],[4,4]],
    conduits:[
      { id:'c1', color:'#fb7185', axis:'H', headRow:0, headCol:0, length:3 },
      { id:'c2', color:'#34d399', axis:'V', headRow:0, headCol:5, length:3 },
      { id:'c3', color:'#60a5fa', axis:'H', headRow:2, headCol:2, length:2 },
      { id:'c4', color:'#facc15', axis:'V', headRow:2, headCol:0, length:2 },
      { id:'c5', color:'#c084fc', axis:'H', headRow:3, headCol:3, length:2 },
      { id:'c6', color:'#f97316', axis:'V', headRow:4, headCol:2, length:2 },
      { id:'c7', color:'#06b6d4', axis:'H', headRow:5, headCol:0, length:2 },
    ],
    exits:[
      { id:'e1', color:'#fb7185', row:0,  col:6,  side:'right'  },
      { id:'e2', color:'#34d399', row:-1, col:5,  side:'top'    },
      { id:'e3', color:'#60a5fa', row:2,  col:6,  side:'right'  },
      { id:'e4', color:'#facc15', row:6,  col:0,  side:'bottom' },
      { id:'e5', color:'#c084fc', row:3,  col:6,  side:'right'  },
      { id:'e6', color:'#f97316', row:6,  col:2,  side:'bottom' },
      { id:'e7', color:'#06b6d4', row:5,  col:-1, side:'left'   },
    ],
  },

  // ── L13: 6×6 eight conduits ──────────────────────────────────────────────
  {
    id:13, cols:6, rows:6, targetMoves:12, maxMoves:32, deadZones:[[0,2],[3,5]],
    conduits:[
      { id:'c1', color:'#fb7185', axis:'H', headRow:1, headCol:0, length:2 },
      { id:'c2', color:'#34d399', axis:'V', headRow:0, headCol:4, length:2 },
      { id:'c3', color:'#60a5fa', axis:'H', headRow:2, headCol:1, length:2 },
      { id:'c4', color:'#facc15', axis:'V', headRow:3, headCol:0, length:2 },
      { id:'c5', color:'#c084fc', axis:'H', headRow:4, headCol:3, length:2 },
      { id:'c6', color:'#f97316', axis:'V', headRow:1, headCol:3, length:2 },
      { id:'c7', color:'#06b6d4', axis:'H', headRow:5, headCol:1, length:3 },
      { id:'c8', color:'#a78bfa', axis:'V', headRow:3, headCol:2, length:2 },
    ],
    exits:[
      { id:'e1', color:'#fb7185', row:1,  col:6,  side:'right'  },
      { id:'e2', color:'#34d399', row:-1, col:4,  side:'top'    },
      { id:'e3', color:'#60a5fa', row:2,  col:-1, side:'left'   },
      { id:'e4', color:'#facc15', row:6,  col:0,  side:'bottom' },
      { id:'e5', color:'#c084fc', row:4,  col:6,  side:'right'  },
      { id:'e6', color:'#f97316', row:-1, col:3,  side:'top'    },
      { id:'e7', color:'#06b6d4', row:5,  col:6,  side:'right'  },
      { id:'e8', color:'#a78bfa', row:6,  col:2,  side:'bottom' },
    ],
  },

  // ── L14: 6×6 complex routing ─────────────────────────────────────────────
  {
    id:14, cols:6, rows:6, targetMoves:13, maxMoves:34, deadZones:[[0,0],[1,4],[4,5]],
    conduits:[
      { id:'c1', color:'#fb7185', axis:'H', headRow:0, headCol:1, length:3 },
      { id:'c2', color:'#34d399', axis:'V', headRow:0, headCol:5, length:2 },
      { id:'c3', color:'#60a5fa', axis:'H', headRow:2, headCol:0, length:2 },
      { id:'c4', color:'#facc15', axis:'V', headRow:2, headCol:3, length:2 },
      { id:'c5', color:'#c084fc', axis:'H', headRow:3, headCol:0, length:2 },
      { id:'c6', color:'#f97316', axis:'V', headRow:1, headCol:2, length:2 },
      { id:'c7', color:'#06b6d4', axis:'H', headRow:5, headCol:0, length:2 },
      { id:'c8', color:'#a78bfa', axis:'V', headRow:4, headCol:1, length:1 },
    ],
    exits:[
      { id:'e1', color:'#fb7185', row:0,  col:6,  side:'right'  },
      { id:'e2', color:'#34d399', row:-1, col:5,  side:'top'    },
      { id:'e3', color:'#60a5fa', row:2,  col:-1, side:'left'   },
      { id:'e4', color:'#facc15', row:6,  col:3,  side:'bottom' },
      { id:'e5', color:'#c084fc', row:3,  col:-1, side:'left'   },
      { id:'e6', color:'#f97316', row:6,  col:2,  side:'bottom' },
      { id:'e7', color:'#06b6d4', row:5,  col:6,  side:'right'  },
      { id:'e8', color:'#a78bfa', row:6,  col:1,  side:'bottom' },
    ],
  },

  // ── L15: 6×6 expert — 4 dead zones (verified solvable) ──────────────────
  // Solution order: c2↑ → c1→ → c3→ → c6↓ → c7← → c4↓ → c8↑ → c5←
  {
    id:15, cols:6, rows:6, targetMoves:14, maxMoves:36, deadZones:[[0,1],[1,4],[4,2],[5,4]],
    conduits:[
      { id:'c1', color:'#fb7185', axis:'H', headRow:0, headCol:2, length:3 }, // [0,2-4]  → exit right row0
      { id:'c2', color:'#34d399', axis:'V', headRow:0, headCol:5, length:2 }, // [0,5][1,5] → exit top col5
      { id:'c3', color:'#60a5fa', axis:'H', headRow:2, headCol:3, length:2 }, // [2,3-4] → exit right row2
      { id:'c4', color:'#facc15', axis:'V', headRow:2, headCol:0, length:2 }, // [2,0][3,0] → exit bottom col0
      { id:'c5', color:'#c084fc', axis:'H', headRow:4, headCol:3, length:2 }, // [4,3-4] → exit left row4
      { id:'c6', color:'#f97316', axis:'V', headRow:1, headCol:2, length:2 }, // [1,2][2,2] → exit bottom col2
      { id:'c7', color:'#06b6d4', axis:'H', headRow:5, headCol:1, length:2 }, // [5,1-2] → exit left row5
      { id:'c8', color:'#a78bfa', axis:'V', headRow:3, headCol:3, length:1 }, // [3,3] → exit top col3
    ],
    exits:[
      { id:'e1', color:'#fb7185', row:0,  col:6,  side:'right'  },
      { id:'e2', color:'#34d399', row:-1, col:5,  side:'top'    },
      { id:'e3', color:'#60a5fa', row:2,  col:6,  side:'right'  },
      { id:'e4', color:'#facc15', row:6,  col:0,  side:'bottom' },
      { id:'e5', color:'#c084fc', row:4,  col:-1, side:'left'   },
      { id:'e6', color:'#f97316', row:6,  col:2,  side:'bottom' },
      { id:'e7', color:'#06b6d4', row:5,  col:-1, side:'left'   },
      { id:'e8', color:'#a78bfa', row:-1, col:3,  side:'top'    },
    ],
  },
];
