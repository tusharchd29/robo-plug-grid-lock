// ─── LEVEL DEFINITIONS ──────────────────────────────────────────────────────
// maxMoves tightened to targetMoves + 2 for all levels (harder ceiling)
export const LEVELS = [

  // ── L1: 4x4 tutorial ──────────────────────────────────────────────────────
  {
    id:1, cols:4, rows:4, targetMoves:3, maxMoves:5, deadZones:[],
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

  // ── L2: 4x4 ───────────────────────────────────────────────────────────────
  {
    id:2, cols:4, rows:4, targetMoves:4, maxMoves:6, deadZones:[],
    conduits:[
      { id:'c1', color:'#fb7185', axis:'H', headRow:0, headCol:0, length:2 },
      { id:'c2', color:'#34d399', axis:'V', headRow:0, headCol:3, length:2 },
      { id:'c3', color:'#facc15', axis:'H', headRow:2, headCol:1, length:2 },
      { id:'c4', color:'#c084fc', axis:'V', headRow:2, headCol:0, length:2 },
    ],
    exits:[
      { id:'e1', color:'#fb7185', row:0,  col:4,  side:'right'  },
      { id:'e2', color:'#34d399', row:-1, col:3,  side:'top'    },
      { id:'e3', color:'#facc15', row:2,  col:4,  side:'right'  },
      { id:'e4', color:'#c084fc', row:4,  col:0,  side:'bottom' },
    ],
  },

  // ── L3: 4x4 ───────────────────────────────────────────────────────────────
  {
    id:3, cols:4, rows:4, targetMoves:5, maxMoves:7, deadZones:[],
    conduits:[
      { id:'c1', color:'#fb7185', axis:'H', headRow:0, headCol:1, length:2 },
      { id:'c2', color:'#34d399', axis:'V', headRow:0, headCol:0, length:2 },
      { id:'c3', color:'#60a5fa', axis:'H', headRow:2, headCol:0, length:2 },
      { id:'c4', color:'#facc15', axis:'V', headRow:1, headCol:3, length:3 },
    ],
    exits:[
      { id:'e1', color:'#fb7185', row:0,  col:4,  side:'right'  },
      { id:'e2', color:'#34d399', row:4,  col:0,  side:'bottom' },
      { id:'e3', color:'#60a5fa', row:2,  col:-1, side:'left'   },
      { id:'e4', color:'#facc15', row:-1, col:3,  side:'top'    },
    ],
  },

  // ── L4: 5x5 ───────────────────────────────────────────────────────────────
  {
    id:4, cols:5, rows:5, targetMoves:5, maxMoves:7, deadZones:[],
    conduits:[
      { id:'c1', color:'#fb7185', axis:'H', headRow:0, headCol:0, length:2 },
      { id:'c2', color:'#34d399', axis:'V', headRow:0, headCol:4, length:2 },
      { id:'c3', color:'#60a5fa', axis:'H', headRow:2, headCol:1, length:2 },
      { id:'c4', color:'#facc15', axis:'V', headRow:3, headCol:0, length:2 },
      { id:'c5', color:'#c084fc', axis:'H', headRow:4, headCol:2, length:2 },
    ],
    exits:[
      { id:'e1', color:'#fb7185', row:0,  col:5,  side:'right'  },
      { id:'e2', color:'#34d399', row:-1, col:4,  side:'top'    },
      { id:'e3', color:'#60a5fa', row:2,  col:5,  side:'right'  },
      { id:'e4', color:'#facc15', row:5,  col:0,  side:'bottom' },
      { id:'e5', color:'#c084fc', row:4,  col:5,  side:'right'  },
    ],
  },

  // ── L5: 5x5 ───────────────────────────────────────────────────────────────
  {
    id:5, cols:5, rows:5, targetMoves:6, maxMoves:8, deadZones:[],
    conduits:[
      { id:'c1', color:'#fb7185', axis:'H', headRow:1, headCol:0, length:2 },
      { id:'c2', color:'#34d399', axis:'V', headRow:0, headCol:2, length:3 },
      { id:'c3', color:'#facc15', axis:'H', headRow:2, headCol:3, length:2 },
      { id:'c4', color:'#60a5fa', axis:'V', headRow:3, headCol:4, length:2 },
      { id:'c5', color:'#c084fc', axis:'H', headRow:4, headCol:0, length:3 },
    ],
    exits:[
      { id:'e1', color:'#fb7185', row:1,  col:5,  side:'right'  },
      { id:'e2', color:'#34d399', row:-1, col:2,  side:'top'    },
      { id:'e3', color:'#facc15', row:2,  col:5,  side:'right'  },
      { id:'e4', color:'#60a5fa', row:-1, col:4,  side:'top'    },
      { id:'e5', color:'#c084fc', row:4,  col:-1, side:'left'   },
    ],
  },

  // ── L6: 5x5 — first dead zone ─────────────────────────────────────────────
  {
    id:6, cols:5, rows:5, targetMoves:7, maxMoves:9, deadZones:[[2,2]],
    conduits:[
      { id:'c1', color:'#fb7185', axis:'H', headRow:0, headCol:0, length:2 },
      { id:'c2', color:'#34d399', axis:'V', headRow:0, headCol:4, length:2 },
      { id:'c3', color:'#60a5fa', axis:'H', headRow:2, headCol:3, length:2 },
      { id:'c4', color:'#facc15', axis:'V', headRow:3, headCol:1, length:2 },
      { id:'c5', color:'#c084fc', axis:'H', headRow:4, headCol:2, length:3 },
    ],
    exits:[
      { id:'e1', color:'#fb7185', row:0,  col:5,  side:'right'  },
      { id:'e2', color:'#34d399', row:-1, col:4,  side:'top'    },
      { id:'e3', color:'#60a5fa', row:2,  col:5,  side:'right'  },
      { id:'e4', color:'#facc15', row:5,  col:1,  side:'bottom' },
      { id:'e5', color:'#c084fc', row:4,  col:5,  side:'right'  },
    ],
  },

  // ── L7: 5x5 — 3-layer chain ───────────────────────────────────────────────
  {
    id:7, cols:5, rows:5, targetMoves:8, maxMoves:10, deadZones:[[1,3]],
    conduits:[
      { id:'c1', color:'#fb7185', axis:'H', headRow:0, headCol:0, length:3 },
      { id:'c2', color:'#34d399', axis:'V', headRow:0, headCol:3, length:2 },
      { id:'c3', color:'#60a5fa', axis:'H', headRow:2, headCol:1, length:2 },
      { id:'c4', color:'#facc15', axis:'V', headRow:2, headCol:0, length:2 },
      { id:'c5', color:'#c084fc', axis:'H', headRow:4, headCol:1, length:3 },
      { id:'c6', color:'#f97316', axis:'V', headRow:3, headCol:4, length:2 },
    ],
    exits:[
      { id:'e1', color:'#fb7185', row:0,  col:5,  side:'right'  },
      { id:'e2', color:'#34d399', row:-1, col:3,  side:'top'    },
      { id:'e3', color:'#60a5fa', row:2,  col:5,  side:'right'  },
      { id:'e4', color:'#facc15', row:5,  col:0,  side:'bottom' },
      { id:'e5', color:'#c084fc', row:4,  col:5,  side:'right'  },
      { id:'e6', color:'#f97316', row:-1, col:4,  side:'top'    },
    ],
  },

  // ── L8: 5x5 — two dead zones ──────────────────────────────────────────────
  {
    id:8, cols:5, rows:5, targetMoves:9, maxMoves:11, deadZones:[[1,1],[3,3]],
    conduits:[
      { id:'c1', color:'#fb7185', axis:'H', headRow:0, headCol:2, length:2 },
      { id:'c2', color:'#34d399', axis:'V', headRow:0, headCol:0, length:1 },
      { id:'c3', color:'#60a5fa', axis:'H', headRow:2, headCol:0, length:1 },
      { id:'c4', color:'#facc15', axis:'V', headRow:2, headCol:4, length:2 },
      { id:'c5', color:'#c084fc', axis:'H', headRow:4, headCol:0, length:2 },
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

  // ── L9: 6x6 ───────────────────────────────────────────────────────────────
  {
    id:9, cols:6, rows:6, targetMoves:8, maxMoves:10, deadZones:[[2,2]],
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

  // ── L10: 6x6 ──────────────────────────────────────────────────────────────
  {
    id:10, cols:6, rows:6, targetMoves:10, maxMoves:12, deadZones:[[1,2],[4,3]],
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

  // ── L11: 6x6 — exits on all 4 sides ──────────────────────────────────────
  {
    id:11, cols:6, rows:6, targetMoves:10, maxMoves:12, deadZones:[[0,3],[5,2]],
    conduits:[
      { id:'c1', color:'#fb7185', axis:'H', headRow:1, headCol:0, length:2 },
      { id:'c2', color:'#34d399', axis:'V', headRow:0, headCol:5, length:2 },
      { id:'c3', color:'#60a5fa', axis:'H', headRow:2, headCol:1, length:3 },
      { id:'c4', color:'#facc15', axis:'V', headRow:3, headCol:4, length:2 },
      { id:'c5', color:'#c084fc', axis:'H', headRow:4, headCol:0, length:2 },
      { id:'c6', color:'#f97316', axis:'V', headRow:1, headCol:4, length:2 },
      { id:'c7', color:'#06b6d4', axis:'H', headRow:5, headCol:3, length:3 },
    ],
    exits:[
      { id:'e1', color:'#fb7185', row:1,  col:-1, side:'left'   },
      { id:'e2', color:'#34d399', row:-1, col:5,  side:'top'    },
      { id:'e3', color:'#60a5fa', row:2,  col:6,  side:'right'  },
      { id:'e4', color:'#facc15', row:6,  col:4,  side:'bottom' },
      { id:'e5', color:'#c084fc', row:4,  col:-1, side:'left'   },
      { id:'e6', color:'#f97316', row:6,  col:4,  side:'bottom' },
      { id:'e7', color:'#06b6d4', row:5,  col:6,  side:'right'  },
    ],
  },

  // ── L12: 6x6 — length-3 conduits block each other ────────────────────────
  {
    id:12, cols:6, rows:6, targetMoves:11, maxMoves:13, deadZones:[[1,4],[4,1]],
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

  // ── L13: 6x6 — 8 conduits, multi-layer unblock ───────────────────────────
  {
    id:13, cols:6, rows:6, targetMoves:12, maxMoves:14, deadZones:[[0,2],[3,5]],
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

  // ── L14: 6x6 — tight corridors, 3 dead zones ─────────────────────────────
  {
    id:14, cols:6, rows:6, targetMoves:13, maxMoves:15, deadZones:[[0,0],[2,3],[4,5]],
    conduits:[
      { id:'c1', color:'#fb7185', axis:'H', headRow:0, headCol:1, length:3 },
      { id:'c2', color:'#34d399', axis:'V', headRow:0, headCol:5, length:2 },
      { id:'c3', color:'#60a5fa', axis:'H', headRow:2, headCol:0, length:2 },
      { id:'c4', color:'#facc15', axis:'V', headRow:2, headCol:4, length:2 },
      { id:'c5', color:'#c084fc', axis:'H', headRow:3, headCol:0, length:2 },
      { id:'c6', color:'#f97316', axis:'V', headRow:1, headCol:2, length:1 },
      { id:'c7', color:'#06b6d4', axis:'H', headRow:5, headCol:0, length:2 },
      { id:'c8', color:'#a78bfa', axis:'V', headRow:4, headCol:1, length:1 },
    ],
    exits:[
      { id:'e1', color:'#fb7185', row:0,  col:6,  side:'right'  },
      { id:'e2', color:'#34d399', row:-1, col:5,  side:'top'    },
      { id:'e3', color:'#60a5fa', row:2,  col:-1, side:'left'   },
      { id:'e4', color:'#facc15', row:6,  col:4,  side:'bottom' },
      { id:'e5', color:'#c084fc', row:3,  col:-1, side:'left'   },
      { id:'e6', color:'#f97316', row:6,  col:2,  side:'bottom' },
      { id:'e7', color:'#06b6d4', row:5,  col:6,  side:'right'  },
      { id:'e8', color:'#a78bfa', row:6,  col:1,  side:'bottom' },
    ],
  },

  // ── L15: 6x6 — 4 dead zones, expert 6x6 ─────────────────────────────────
  {
    id:15, cols:6, rows:6, targetMoves:14, maxMoves:16, deadZones:[[0,1],[1,4],[4,2],[5,4]],
    conduits:[
      { id:'c1', color:'#fb7185', axis:'H', headRow:0, headCol:2, length:3 },
      { id:'c2', color:'#34d399', axis:'V', headRow:0, headCol:5, length:2 },
      { id:'c3', color:'#60a5fa', axis:'H', headRow:2, headCol:3, length:2 },
      { id:'c4', color:'#facc15', axis:'V', headRow:2, headCol:0, length:2 },
      { id:'c5', color:'#c084fc', axis:'H', headRow:4, headCol:3, length:2 },
      { id:'c6', color:'#f97316', axis:'V', headRow:1, headCol:2, length:1 },
      { id:'c7', color:'#06b6d4', axis:'H', headRow:5, headCol:1, length:2 },
      { id:'c8', color:'#a78bfa', axis:'V', headRow:3, headCol:3, length:1 },
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

  // ── L16: 7x7 ──────────────────────────────────────────────────────────────
  {
    id:16, cols:7, rows:7, targetMoves:14, maxMoves:16, deadZones:[[1,2],[3,4],[5,1]],
    conduits:[
      { id:'c1', color:'#fb7185', axis:'H', headRow:0, headCol:0, length:3 },
      { id:'c2', color:'#34d399', axis:'V', headRow:0, headCol:6, length:2 },
      { id:'c3', color:'#60a5fa', axis:'H', headRow:2, headCol:0, length:2 },
      { id:'c4', color:'#facc15', axis:'V', headRow:1, headCol:4, length:2 },
      { id:'c5', color:'#c084fc', axis:'H', headRow:3, headCol:0, length:2 },
      { id:'c6', color:'#f97316', axis:'V', headRow:4, headCol:3, length:2 },
      { id:'c7', color:'#06b6d4', axis:'H', headRow:5, headCol:2, length:3 },
      { id:'c8', color:'#a78bfa', axis:'V', headRow:3, headCol:5, length:2 },
      { id:'c9', color:'#e879f9', axis:'H', headRow:1, headCol:5, length:2 },
    ],
    exits:[
      { id:'e1', color:'#fb7185', row:0,  col:7,  side:'right'  },
      { id:'e2', color:'#34d399', row:-1, col:6,  side:'top'    },
      { id:'e3', color:'#60a5fa', row:2,  col:-1, side:'left'   },
      { id:'e4', color:'#facc15', row:7,  col:4,  side:'bottom' },
      { id:'e5', color:'#c084fc', row:3,  col:-1, side:'left'   },
      { id:'e6', color:'#f97316', row:7,  col:3,  side:'bottom' },
      { id:'e7', color:'#06b6d4', row:5,  col:7,  side:'right'  },
      { id:'e8', color:'#a78bfa', row:-1, col:5,  side:'top'    },
      { id:'e9', color:'#e879f9', row:1,  col:7,  side:'right'  },
    ],
  },

  // ── L17: 7x7 — strategic dead zones ──────────────────────────────────────
  {
    id:17, cols:7, rows:7, targetMoves:15, maxMoves:17, deadZones:[[0,3],[2,1],[4,5],[6,2]],
    conduits:[
      { id:'c1', color:'#fb7185', axis:'H', headRow:0, headCol:4, length:3 },
      { id:'c2', color:'#34d399', axis:'V', headRow:0, headCol:0, length:2 },
      { id:'c3', color:'#60a5fa', axis:'H', headRow:2, headCol:2, length:2 },
      { id:'c4', color:'#facc15', axis:'V', headRow:1, headCol:6, length:3 },
      { id:'c5', color:'#c084fc', axis:'H', headRow:3, headCol:0, length:2 },
      { id:'c6', color:'#f97316', axis:'V', headRow:3, headCol:3, length:2 },
      { id:'c7', color:'#06b6d4', axis:'H', headRow:5, headCol:3, length:3 },
      { id:'c8', color:'#a78bfa', axis:'V', headRow:5, headCol:1, length:2 },
      { id:'c9', color:'#e879f9', axis:'H', headRow:6, headCol:3, length:3 },
    ],
    exits:[
      { id:'e1', color:'#fb7185', row:0,  col:7,  side:'right'  },
      { id:'e2', color:'#34d399', row:7,  col:0,  side:'bottom' },
      { id:'e3', color:'#60a5fa', row:2,  col:7,  side:'right'  },
      { id:'e4', color:'#facc15', row:-1, col:6,  side:'top'    },
      { id:'e5', color:'#c084fc', row:3,  col:-1, side:'left'   },
      { id:'e6', color:'#f97316', row:7,  col:3,  side:'bottom' },
      { id:'e7', color:'#06b6d4', row:5,  col:7,  side:'right'  },
      { id:'e8', color:'#a78bfa', row:7,  col:1,  side:'bottom' },
      { id:'e9', color:'#e879f9', row:6,  col:7,  side:'right'  },
    ],
  },

  // ── L18: 7x7 — 10 conduits ────────────────────────────────────────────────
  {
    id:18, cols:7, rows:7, targetMoves:17, maxMoves:19, deadZones:[[0,2],[2,5],[4,0],[5,3],[6,6]],
    conduits:[
      { id:'c1',  color:'#fb7185', axis:'H', headRow:0, headCol:3, length:3 },
      { id:'c2',  color:'#34d399', axis:'V', headRow:0, headCol:6, length:2 },
      { id:'c3',  color:'#60a5fa', axis:'H', headRow:1, headCol:0, length:2 },
      { id:'c4',  color:'#facc15', axis:'V', headRow:2, headCol:4, length:2 },
      { id:'c5',  color:'#c084fc', axis:'H', headRow:3, headCol:1, length:2 },
      { id:'c6',  color:'#f97316', axis:'V', headRow:2, headCol:1, length:2 },
      { id:'c7',  color:'#06b6d4', axis:'H', headRow:4, headCol:1, length:3 },
      { id:'c8',  color:'#a78bfa', axis:'V', headRow:4, headCol:5, length:2 },
      { id:'c9',  color:'#e879f9', axis:'H', headRow:6, headCol:0, length:2 },
      { id:'c10', color:'#10b981', axis:'V', headRow:5, headCol:0, length:1 },
    ],
    exits:[
      { id:'e1',  color:'#fb7185', row:0,  col:7,  side:'right'  },
      { id:'e2',  color:'#34d399', row:-1, col:6,  side:'top'    },
      { id:'e3',  color:'#60a5fa', row:1,  col:-1, side:'left'   },
      { id:'e4',  color:'#facc15', row:7,  col:4,  side:'bottom' },
      { id:'e5',  color:'#c084fc', row:3,  col:7,  side:'right'  },
      { id:'e6',  color:'#f97316', row:7,  col:1,  side:'bottom' },
      { id:'e7',  color:'#06b6d4', row:4,  col:7,  side:'right'  },
      { id:'e8',  color:'#a78bfa', row:-1, col:5,  side:'top'    },
      { id:'e9',  color:'#e879f9', row:6,  col:-1, side:'left'   },
      { id:'e10', color:'#10b981', row:7,  col:0,  side:'bottom' },
    ],
  },

  // ── L19: 8x8 — 11 conduits ────────────────────────────────────────────────
  {
    id:19, cols:8, rows:8, targetMoves:18, maxMoves:20, deadZones:[[0,4],[2,1],[3,6],[5,3],[6,0],[7,5]],
    conduits:[
      { id:'c1',  color:'#fb7185', axis:'H', headRow:0, headCol:0, length:3 },
      { id:'c2',  color:'#34d399', axis:'V', headRow:0, headCol:7, length:2 },
      { id:'c3',  color:'#60a5fa', axis:'H', headRow:1, headCol:2, length:3 },
      { id:'c4',  color:'#facc15', axis:'V', headRow:2, headCol:5, length:2 },
      { id:'c5',  color:'#c084fc', axis:'H', headRow:3, headCol:0, length:2 },
      { id:'c6',  color:'#f97316', axis:'V', headRow:3, headCol:2, length:2 },
      { id:'c7',  color:'#06b6d4', axis:'H', headRow:4, headCol:4, length:3 },
      { id:'c8',  color:'#a78bfa', axis:'V', headRow:5, headCol:6, length:2 },
      { id:'c9',  color:'#e879f9', axis:'H', headRow:6, headCol:1, length:3 },
      { id:'c10', color:'#10b981', axis:'V', headRow:6, headCol:4, length:2 },
      { id:'c11', color:'#f43f5e', axis:'H', headRow:7, headCol:0, length:2 },
    ],
    exits:[
      { id:'e1',  color:'#fb7185', row:0,  col:8,  side:'right'  },
      { id:'e2',  color:'#34d399', row:-1, col:7,  side:'top'    },
      { id:'e3',  color:'#60a5fa', row:1,  col:8,  side:'right'  },
      { id:'e4',  color:'#facc15', row:8,  col:5,  side:'bottom' },
      { id:'e5',  color:'#c084fc', row:3,  col:-1, side:'left'   },
      { id:'e6',  color:'#f97316', row:8,  col:2,  side:'bottom' },
      { id:'e7',  color:'#06b6d4', row:4,  col:8,  side:'right'  },
      { id:'e8',  color:'#a78bfa', row:-1, col:6,  side:'top'    },
      { id:'e9',  color:'#e879f9', row:6,  col:8,  side:'right'  },
      { id:'e10', color:'#10b981', row:8,  col:4,  side:'bottom' },
      { id:'e11', color:'#f43f5e', row:7,  col:-1, side:'left'   },
    ],
  },

  // ── L20: 8x8 — MASTER LEVEL ───────────────────────────────────────────────
  {
    id:20, cols:8, rows:8, targetMoves:20, maxMoves:22, deadZones:[[0,2],[1,6],[3,1],[4,6],[5,3],[6,0],[7,4]],
    conduits:[
      { id:'c1',  color:'#fb7185', axis:'H', headRow:0, headCol:3, length:3 },
      { id:'c2',  color:'#34d399', axis:'V', headRow:0, headCol:7, length:2 },
      { id:'c3',  color:'#60a5fa', axis:'H', headRow:1, headCol:0, length:2 },
      { id:'c4',  color:'#facc15', axis:'V', headRow:2, headCol:5, length:2 },
      { id:'c5',  color:'#c084fc', axis:'H', headRow:3, headCol:2, length:2 },
      { id:'c6',  color:'#f97316', axis:'V', headRow:2, headCol:3, length:1 },
      { id:'c7',  color:'#06b6d4', axis:'H', headRow:4, headCol:0, length:2 },
      { id:'c8',  color:'#a78bfa', axis:'V', headRow:4, headCol:4, length:2 },
      { id:'c9',  color:'#e879f9', axis:'H', headRow:5, headCol:4, length:3 },
      { id:'c10', color:'#10b981', axis:'V', headRow:5, headCol:2, length:2 },
      { id:'c11', color:'#f43f5e', axis:'H', headRow:6, headCol:1, length:3 },
      { id:'c12', color:'#fbbf24', axis:'V', headRow:6, headCol:6, length:2 },
    ],
    exits:[
      { id:'e1',  color:'#fb7185', row:0,  col:8,  side:'right'  },
      { id:'e2',  color:'#34d399', row:-1, col:7,  side:'top'    },
      { id:'e3',  color:'#60a5fa', row:1,  col:-1, side:'left'   },
      { id:'e4',  color:'#facc15', row:8,  col:5,  side:'bottom' },
      { id:'e5',  color:'#c084fc', row:3,  col:8,  side:'right'  },
      { id:'e6',  color:'#f97316', row:8,  col:3,  side:'bottom' },
      { id:'e7',  color:'#06b6d4', row:4,  col:-1, side:'left'   },
      { id:'e8',  color:'#a78bfa', row:-1, col:4,  side:'top'    },
      { id:'e9',  color:'#e879f9', row:5,  col:8,  side:'right'  },
      { id:'e10', color:'#10b981', row:8,  col:2,  side:'bottom' },
      { id:'e11', color:'#f43f5e', row:6,  col:8,  side:'right'  },
      { id:'e12', color:'#fbbf24', row:-1, col:6,  side:'top'    },
    ],
  },

  // ════════════════════════════════════════════════════════════════
  // EXPERT TIER: L21–L25 — 8x8 grids, brutal blocking, 13s timer
  // ════════════════════════════════════════════════════════════════

  // ── L21: EXPERT — The Crossroads ──────────────────────────────────────────
  // Dense 8x8, 5 dead zones forming an X-cross in center, 12 conduits
  // Every conduit is blocked by at least 2 others. Must sequence carefully.
  {
    id:21, cols:8, rows:8, targetMoves:22, maxMoves:24,
    deadZones:[[2,3],[2,4],[3,2],[4,5],[5,3]],
    conduits:[
      { id:'c1',  color:'#fb7185', axis:'H', headRow:0, headCol:0, length:3 },
      { id:'c2',  color:'#34d399', axis:'V', headRow:0, headCol:5, length:3 },
      { id:'c3',  color:'#60a5fa', axis:'H', headRow:1, headCol:4, length:3 },
      { id:'c4',  color:'#facc15', axis:'V', headRow:1, headCol:1, length:2 },
      { id:'c5',  color:'#c084fc', axis:'H', headRow:3, headCol:0, length:2 },
      { id:'c6',  color:'#f97316', axis:'V', headRow:3, headCol:6, length:2 },
      { id:'c7',  color:'#06b6d4', axis:'H', headRow:4, headCol:1, length:2 },
      { id:'c8',  color:'#a78bfa', axis:'V', headRow:5, headCol:0, length:2 },
      { id:'c9',  color:'#e879f9', axis:'H', headRow:5, headCol:4, length:3 },
      { id:'c10', color:'#10b981', axis:'V', headRow:6, headCol:3, length:2 },
      { id:'c11', color:'#f43f5e', axis:'H', headRow:7, headCol:0, length:3 },
      { id:'c12', color:'#fbbf24', axis:'V', headRow:6, headCol:7, length:2 },
    ],
    exits:[
      { id:'e1',  color:'#fb7185', row:0,  col:8,  side:'right'  },
      { id:'e2',  color:'#34d399', row:-1, col:5,  side:'top'    },
      { id:'e3',  color:'#60a5fa', row:1,  col:8,  side:'right'  },
      { id:'e4',  color:'#facc15', row:8,  col:1,  side:'bottom' },
      { id:'e5',  color:'#c084fc', row:3,  col:-1, side:'left'   },
      { id:'e6',  color:'#f97316', row:-1, col:6,  side:'top'    },
      { id:'e7',  color:'#06b6d4', row:4,  col:8,  side:'right'  },
      { id:'e8',  color:'#a78bfa', row:8,  col:0,  side:'bottom' },
      { id:'e9',  color:'#e879f9', row:5,  col:8,  side:'right'  },
      { id:'e10', color:'#10b981', row:8,  col:3,  side:'bottom' },
      { id:'e11', color:'#f43f5e', row:7,  col:-1, side:'left'   },
      { id:'e12', color:'#fbbf24', row:-1, col:7,  side:'top'    },
    ],
  },

  // ── L22: EXPERT — The Maze ────────────────────────────────────────────────
  // 8x8, 6 dead zones carving channels, 12 conduits with long pieces
  {
    id:22, cols:8, rows:8, targetMoves:24, maxMoves:26,
    deadZones:[[0,5],[1,2],[3,5],[4,2],[6,4],[7,1]],
    conduits:[
      { id:'c1',  color:'#fb7185', axis:'H', headRow:0, headCol:0, length:2 },
      { id:'c2',  color:'#34d399', axis:'V', headRow:0, headCol:6, length:3 },
      { id:'c3',  color:'#60a5fa', axis:'H', headRow:1, headCol:3, length:3 },
      { id:'c4',  color:'#facc15', axis:'V', headRow:2, headCol:0, length:2 },
      { id:'c5',  color:'#c084fc', axis:'H', headRow:2, headCol:5, length:2 },
      { id:'c6',  color:'#f97316', axis:'V', headRow:3, headCol:3, length:2 },
      { id:'c7',  color:'#06b6d4', axis:'H', headRow:4, headCol:3, length:3 },
      { id:'c8',  color:'#a78bfa', axis:'V', headRow:4, headCol:7, length:2 },
      { id:'c9',  color:'#e879f9', axis:'H', headRow:5, headCol:0, length:3 },
      { id:'c10', color:'#10b981', axis:'V', headRow:6, headCol:5, length:2 },
      { id:'c11', color:'#f43f5e', axis:'H', headRow:6, headCol:2, length:2 },
      { id:'c12', color:'#fbbf24', axis:'V', headRow:5, headCol:1, length:2 },
    ],
    exits:[
      { id:'e1',  color:'#fb7185', row:0,  col:-1, side:'left'   },
      { id:'e2',  color:'#34d399', row:-1, col:6,  side:'top'    },
      { id:'e3',  color:'#60a5fa', row:1,  col:8,  side:'right'  },
      { id:'e4',  color:'#facc15', row:8,  col:0,  side:'bottom' },
      { id:'e5',  color:'#c084fc', row:2,  col:8,  side:'right'  },
      { id:'e6',  color:'#f97316', row:8,  col:3,  side:'bottom' },
      { id:'e7',  color:'#06b6d4', row:4,  col:8,  side:'right'  },
      { id:'e8',  color:'#a78bfa', row:-1, col:7,  side:'top'    },
      { id:'e9',  color:'#e879f9', row:5,  col:-1, side:'left'   },
      { id:'e10', color:'#10b981', row:8,  col:5,  side:'bottom' },
      { id:'e11', color:'#f43f5e', row:6,  col:-1, side:'left'   },
      { id:'e12', color:'#fbbf24', row:8,  col:1,  side:'bottom' },
    ],
  },

  // ── L23: EXPERT — Chain Reaction ──────────────────────────────────────────
  // 8x8, 6 dead zones, 13 conduits — every exit requires 3+ unblocks
  {
    id:23, cols:8, rows:8, targetMoves:26, maxMoves:28,
    deadZones:[[1,3],[2,6],[4,1],[5,5],[6,2],[7,6]],
    conduits:[
      { id:'c1',  color:'#fb7185', axis:'H', headRow:0, headCol:0, length:2 },
      { id:'c2',  color:'#34d399', axis:'V', headRow:0, headCol:4, length:2 },
      { id:'c3',  color:'#60a5fa', axis:'H', headRow:0, headCol:6, length:2 },
      { id:'c4',  color:'#facc15', axis:'V', headRow:1, headCol:0, length:2 },
      { id:'c5',  color:'#c084fc', axis:'H', headRow:2, headCol:2, length:2 },
      { id:'c6',  color:'#f97316', axis:'V', headRow:2, headCol:5, length:2 },
      { id:'c7',  color:'#06b6d4', axis:'H', headRow:3, headCol:3, length:3 },
      { id:'c8',  color:'#a78bfa', axis:'V', headRow:3, headCol:7, length:2 },
      { id:'c9',  color:'#e879f9', axis:'H', headRow:4, headCol:2, length:3 },
      { id:'c10', color:'#10b981', axis:'V', headRow:5, headCol:3, length:2 },
      { id:'c11', color:'#f43f5e', axis:'H', headRow:5, headCol:6, length:2 },
      { id:'c12', color:'#fbbf24', axis:'V', headRow:6, headCol:0, length:2 },
      { id:'c13', color:'#818cf8', axis:'H', headRow:7, headCol:3, length:3 },
    ],
    exits:[
      { id:'e1',  color:'#fb7185', row:0,  col:-1, side:'left'   },
      { id:'e2',  color:'#34d399', row:-1, col:4,  side:'top'    },
      { id:'e3',  color:'#60a5fa', row:0,  col:8,  side:'right'  },
      { id:'e4',  color:'#facc15', row:8,  col:0,  side:'bottom' },
      { id:'e5',  color:'#c084fc', row:2,  col:-1, side:'left'   },
      { id:'e6',  color:'#f97316', row:-1, col:5,  side:'top'    },
      { id:'e7',  color:'#06b6d4', row:3,  col:8,  side:'right'  },
      { id:'e8',  color:'#a78bfa', row:-1, col:7,  side:'top'    },
      { id:'e9',  color:'#e879f9', row:4,  col:8,  side:'right'  },
      { id:'e10', color:'#10b981', row:8,  col:3,  side:'bottom' },
      { id:'e11', color:'#f43f5e', row:5,  col:8,  side:'right'  },
      { id:'e12', color:'#fbbf24', row:8,  col:0,  side:'bottom' },
      { id:'e13', color:'#818cf8', row:7,  col:8,  side:'right'  },
    ],
  },

  // ── L24: EXPERT — The Lockdown ────────────────────────────────────────────
  // 8x8, 7 dead zones, 13 conduits — dense center, exits on all sides
  {
    id:24, cols:8, rows:8, targetMoves:28, maxMoves:30,
    deadZones:[[0,3],[1,6],[3,0],[4,4],[5,7],[6,1],[7,5]],
    conduits:[
      { id:'c1',  color:'#fb7185', axis:'H', headRow:0, headCol:4, length:3 },
      { id:'c2',  color:'#34d399', axis:'V', headRow:0, headCol:1, length:2 },
      { id:'c3',  color:'#60a5fa', axis:'H', headRow:1, headCol:0, length:2 },
      { id:'c4',  color:'#facc15', axis:'V', headRow:1, headCol:4, length:2 },
      { id:'c5',  color:'#c084fc', axis:'H', headRow:2, headCol:3, length:2 },
      { id:'c6',  color:'#f97316', axis:'V', headRow:2, headCol:6, length:2 },
      { id:'c7',  color:'#06b6d4', axis:'H', headRow:3, headCol:1, length:3 },
      { id:'c8',  color:'#a78bfa', axis:'V', headRow:4, headCol:2, length:2 },
      { id:'c9',  color:'#e879f9', axis:'H', headRow:4, headCol:5, length:2 },
      { id:'c10', color:'#10b981', axis:'V', headRow:5, headCol:4, length:2 },
      { id:'c11', color:'#f43f5e', axis:'H', headRow:6, headCol:2, length:3 },
      { id:'c12', color:'#fbbf24', axis:'V', headRow:6, headCol:7, length:2 },
      { id:'c13', color:'#818cf8', axis:'H', headRow:7, headCol:0, length:3 },
    ],
    exits:[
      { id:'e1',  color:'#fb7185', row:0,  col:8,  side:'right'  },
      { id:'e2',  color:'#34d399', row:-1, col:1,  side:'top'    },
      { id:'e3',  color:'#60a5fa', row:1,  col:-1, side:'left'   },
      { id:'e4',  color:'#facc15', row:8,  col:4,  side:'bottom' },
      { id:'e5',  color:'#c084fc', row:2,  col:8,  side:'right'  },
      { id:'e6',  color:'#f97316', row:-1, col:6,  side:'top'    },
      { id:'e7',  color:'#06b6d4', row:3,  col:8,  side:'right'  },
      { id:'e8',  color:'#a78bfa', row:8,  col:2,  side:'bottom' },
      { id:'e9',  color:'#e879f9', row:4,  col:-1, side:'left'   },
      { id:'e10', color:'#10b981', row:8,  col:4,  side:'bottom' },
      { id:'e11', color:'#f43f5e', row:6,  col:8,  side:'right'  },
      { id:'e12', color:'#fbbf24', row:-1, col:7,  side:'top'    },
      { id:'e13', color:'#818cf8', row:7,  col:-1, side:'left'   },
    ],
  },

  // ── L25: EXPERT — NIGHTMARE MODE ──────────────────────────────────────────
  // 8x8, 8 dead zones forming a cage, 14 conduits, exits on all 4 sides
  // This is the hardest level — no room for error, 3 undos won't save you
  {
    id:25, cols:8, rows:8, targetMoves:30, maxMoves:32,
    deadZones:[[0,2],[1,5],[2,0],[3,7],[4,3],[5,6],[6,1],[7,4]],
    conduits:[
      { id:'c1',  color:'#fb7185', axis:'H', headRow:0, headCol:3, length:2 },
      { id:'c2',  color:'#34d399', axis:'V', headRow:0, headCol:6, length:2 },
      { id:'c3',  color:'#60a5fa', axis:'H', headRow:1, headCol:0, length:2 },
      { id:'c4',  color:'#facc15', axis:'V', headRow:1, headCol:3, length:2 },
      { id:'c5',  color:'#c084fc', axis:'H', headRow:2, headCol:4, length:3 },
      { id:'c6',  color:'#f97316', axis:'V', headRow:2, headCol:1, length:2 },
      { id:'c7',  color:'#06b6d4', axis:'H', headRow:3, headCol:2, length:3 },
      { id:'c8',  color:'#a78bfa', axis:'V', headRow:3, headCol:5, length:2 },
      { id:'c9',  color:'#e879f9', axis:'H', headRow:4, headCol:0, length:2 },
      { id:'c10', color:'#10b981', axis:'V', headRow:4, headCol:4, length:2 },
      { id:'c11', color:'#f43f5e', axis:'H', headRow:5, headCol:2, length:2 },
      { id:'c12', color:'#fbbf24', axis:'V', headRow:5, headCol:7, length:2 },
      { id:'c13', color:'#818cf8', axis:'H', headRow:6, headCol:3, length:3 },
      { id:'c14', color:'#e11d48', axis:'V', headRow:6, headCol:0, length:2 },
    ],
    exits:[
      { id:'e1',  color:'#fb7185', row:0,  col:8,  side:'right'  },
      { id:'e2',  color:'#34d399', row:-1, col:6,  side:'top'    },
      { id:'e3',  color:'#60a5fa', row:1,  col:-1, side:'left'   },
      { id:'e4',  color:'#facc15', row:8,  col:3,  side:'bottom' },
      { id:'e5',  color:'#c084fc', row:2,  col:8,  side:'right'  },
      { id:'e6',  color:'#f97316', row:8,  col:1,  side:'bottom' },
      { id:'e7',  color:'#06b6d4', row:3,  col:8,  side:'right'  },
      { id:'e8',  color:'#a78bfa', row:-1, col:5,  side:'top'    },
      { id:'e9',  color:'#e879f9', row:4,  col:-1, side:'left'   },
      { id:'e10', color:'#10b981', row:-1, col:4,  side:'top'    },
      { id:'e11', color:'#f43f5e', row:5,  col:-1, side:'left'   },
      { id:'e12', color:'#fbbf24', row:-1, col:7,  side:'top'    },
      { id:'e13', color:'#818cf8', row:6,  col:8,  side:'right'  },
      { id:'e14', color:'#e11d48', row:8,  col:0,  side:'bottom' },
    ],
  },
];
