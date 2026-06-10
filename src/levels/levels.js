// ─── LEVEL DEFINITIONS ──────────────────────────────────────────────────────
export const LEVELS = [

  // ── L1: 4x4 tutorial — 3 conduits, wide open ─────────────────────────────
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

  // ── L2: 4x4 — 4 conduits, one needs to move first ────────────────────────
  {
    id:2, cols:4, rows:4, targetMoves:4, maxMoves:14, deadZones:[],
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

  // ── L3: 4x4 — 4 conduits, basic cross-block ──────────────────────────────
  {
    id:3, cols:4, rows:4, targetMoves:5, maxMoves:14, deadZones:[],
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

  // ── L4: 5x5 — 5 conduits, intro to planning ──────────────────────────────
  {
    id:4, cols:5, rows:5, targetMoves:5, maxMoves:16, deadZones:[],
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

  // ── L5: 5x5 — first real puzzle: 2-layer block ───────────────────────────
  // Green blocks pink. Yellow blocks green. Must: yellow→ green↑ pink→
  {
    id:5, cols:5, rows:5, targetMoves:6, maxMoves:18, deadZones:[],
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

  // ── L6: 5x5 — first dead zone, routes around it ──────────────────────────
  {
    id:6, cols:5, rows:5, targetMoves:7, maxMoves:20, deadZones:[[2,2]],
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

  // ── L7: 5x5 — 3-layer unblock chain ──────────────────────────────────────
  {
    id:7, cols:5, rows:5, targetMoves:8, maxMoves:22, deadZones:[[1,3]],
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

  // ── L8: 5x5 — two dead zones, 6 conduits ─────────────────────────────────
  {
    id:8, cols:5, rows:5, targetMoves:9, maxMoves:24, deadZones:[[1,1],[3,3]],
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

  // ── L9: 6x6 — welcome to 6x6, intro blocking ─────────────────────────────
  {
    id:9, cols:6, rows:6, targetMoves:8, maxMoves:24, deadZones:[[2,2]],
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

  // ── L10: 6x6 — 7 conduits, requires sequencing ───────────────────────────
  {
    id:10, cols:6, rows:6, targetMoves:10, maxMoves:28, deadZones:[[1,2],[4,3]],
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
    id:11, cols:6, rows:6, targetMoves:10, maxMoves:28, deadZones:[[0,3],[5,2]],
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
    id:12, cols:6, rows:6, targetMoves:11, maxMoves:30, deadZones:[[1,4],[4,1]],
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

  // ── L14: 6x6 — tight corridors, 3 dead zones ─────────────────────────────
  {
    id:14, cols:6, rows:6, targetMoves:13, maxMoves:34, deadZones:[[0,0],[2,3],[4,5]],
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
  // Solution: c2↑ c1→ c3→ c6↓ c7← c4↓ c8↑ c5←
  {
    id:15, cols:6, rows:6, targetMoves:14, maxMoves:36, deadZones:[[0,1],[1,4],[4,2],[5,4]],
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

  // ── L16: 7x7 — bigger grid intro, 9 conduits ─────────────────────────────
  {
    id:16, cols:7, rows:7, targetMoves:14, maxMoves:38, deadZones:[[1,2],[3,4],[5,1]],
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

  // ── L17: 7x7 — strategic dead zones force rerouting ──────────────────────
  {
    id:17, cols:7, rows:7, targetMoves:15, maxMoves:40, deadZones:[[0,3],[2,1],[4,5],[6,2]],
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

  // ── L18: 7x7 — 10 conduits, dense but fair ───────────────────────────────
  {
    id:18, cols:7, rows:7, targetMoves:17, maxMoves:42, deadZones:[[0,2],[2,5],[4,0],[5,3],[6,6]],
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

  // ── L19: 8x8 — big grid, 11 conduits, plan ahead ─────────────────────────
  {
    id:19, cols:8, rows:8, targetMoves:18, maxMoves:44, deadZones:[[0,4],[2,1],[3,6],[5,3],[6,0],[7,5]],
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

  // ── L20: 8x8 — MASTER LEVEL, 12 conduits, maximum challenge ──────────────
  {
    id:20, cols:8, rows:8, targetMoves:20, maxMoves:48, deadZones:[[0,2],[1,6],[3,1],[4,6],[5,3],[6,0],[7,4]],
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
];
