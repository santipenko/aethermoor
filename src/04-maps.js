// --- SECTION: Map Definitions ---
const MAP_DEFINITIONS = {
  map_1: {
    label: 'Ruins of Aethermoor',
    cols: 8, rows: 8,
    obstacle: ['3,2','3,3','4,4','6,5','1,1','7,6'],
    high:     ['2,2','5,3','4,5','7,2'],
    water:    ['0,4','0,5','1,4'],
    playerStart: [
      { id:'p1', x:1, y:5 },
      { id:'p2', x:2, y:6 },
      { id:'p3', x:0, y:6 },
      { id:'p4', x:1, y:6 },
    ],
    enemyStart: [
      { id:'e1', x:5, y:2 },
      { id:'e2', x:6, y:1 },
      { id:'e3', x:4, y:1 },
      { id:'e4', x:7, y:0 },
    ],
  },
  map_2: {
    label: 'Ashfen Causeway',
    cols: 8, rows: 8,
    // Choke point of obstacles through center; wide water on west; high ground at edges
    obstacle: ['3,3','4,3','3,4','4,4','3,5'],
    high:     ['0,0','1,0','7,0','6,0','0,7','1,7','7,7','6,7','0,1','7,1'],
    water:    ['0,2','0,3','0,4','0,5','1,2','1,3','1,4','1,5','2,3','2,4'],
    playerStart: [
      { id:'p1', x:2, y:6 },
      { id:'p2', x:3, y:7 },
      { id:'p3', x:2, y:5 },
      { id:'p4', x:3, y:6 },
    ],
    enemyStart: [
      { id:'e1', x:5, y:1 },
      { id:'e2', x:6, y:2 },
      { id:'e3', x:5, y:0 },
      { id:'e4', x:7, y:1 },
    ],
  },

  // ── Map 3: Ironhold Passage ─────────────────────────────────
  // Narrow corridors with chokepoints. Two vertical wall segments (x=2, x=5)
  // create three lanes: left (x=0–1), center (x=3–4), right (x=6–7).
  // A horizontal barrier at y=3 forces units to commit to a lane early.
  // High ground rewards whoever seizes the passage entrances first.
  map_3: {
    label: 'Ironhold Passage',
    cols: 8, rows: 8,
    // Left divider wall: x=2, rows 1–5
    // Right divider wall: x=5, rows 1–5
    // Center horizontal pinch: (3,3) and (4,3)
    obstacle: [
      '2,1','2,2','2,3','2,4','2,5',
      '5,1','5,2','5,3','5,4','5,5',
      '3,3','4,3',
    ],
    // High ground at lane entrances — center-left and center-right passage mouths
    high: [
      '1,3','1,4',   // left lane entrance (mid)
      '6,3','6,4',   // right lane entrance (mid)
      '3,2','4,2',   // top of center lane
      '3,4','4,4',   // bottom of center lane (below pinch)
    ],
    // Minimal water — two tiles at far edge corners only
    water: ['0,0','7,0'],
    // Players start bottom-center, funneled into the three lanes
    playerStart: [
      { id:'p1', x:3, y:6 },
      { id:'p2', x:4, y:6 },
      { id:'p3', x:3, y:7 },
      { id:'p4', x:4, y:7 },
    ],
    // Enemies start top-center, mirroring player approach
    // (3,1) and (4,1) are clear — wall at x=2,x=5 starts at y=1 but x=3,4 are open
    enemyStart: [
      { id:'e1', x:3, y:1 },
      { id:'e2', x:4, y:1 },
      { id:'e3', x:3, y:0 },
      { id:'e4', x:4, y:0 },
    ],
  },

  // ── Map 4: Thornmire Shallows ───────────────────────────────
  // Heavy water (27 tiles, ~42%) forces island-hopping via a narrow central land
  // bridge. Ranged and mobile units shine; melee must navigate carefully.
  // Land: SW island (players), NE island (enemies), central bridge, NW/SE corners.
  // Water covers all else — verified no unit start is on water.
  map_4: {
    label: 'Thornmire Shallows',
    cols: 8, rows: 8,
    obstacle: [],
    // High ground on island edges and the central bridge for strategic value
    high: [
      '5,0','5,1','5,2',  // NE island western ridge
      '0,5','1,5',        // SW island northern edge
      '4,2','3,4',        // bridge stepping stones
    ],
    // 27 water tiles — every tile NOT part of an island or bridge
    // Land tiles: NW corner (0-1,0-2), NE island (5-7,0-2),
    //             bridge (3-4,3-4 + 2,4 + 4,2 + 5,3-4),
    //             SW island (0-2,5-7), SE corner (6-7,5-7)
    water: [
      '2,0','3,0','4,0',
      '2,1','3,1','4,1',
      '2,2','3,2',
      '1,3','2,3','6,3','7,3',
      '0,4','1,4','6,4','7,4',
      '3,5','4,5','5,5',
      '3,6','4,6','5,6',
      '3,7','4,7','5,7',
    ],
    // Players on SW island (x=0–2, y=5–7)
    playerStart: [
      { id:'p1', x:0, y:6 },
      { id:'p2', x:1, y:6 },
      { id:'p3', x:0, y:7 },
      { id:'p4', x:1, y:7 },
    ],
    // Enemies on NE island (x=5–7, y=0–2)
    // Note: (5,0) is high ground — valid start position
    enemyStart: [
      { id:'e1', x:6, y:1 },
      { id:'e2', x:7, y:1 },
      { id:'e3', x:6, y:0 },
      { id:'e4', x:7, y:0 },
    ],
  },

  // ── Map 5: Verdant Escarpment ───────────────────────────────
  // Asymmetric terrain — enemies command 21 high-ground tiles across rows 0–2.
  // Players stage on flat ground (rows 5–7) and must push uphill through a
  // transition zone of obstacles and scattered high tiles (rows 3–4).
  // This map is intentionally hard for the player.
  map_5: {
    label: 'Verdant Escarpment',
    cols: 8, rows: 8,
    // Obstacles: flanking walls in rows 0–2 and a dense transition barrier in rows 3–4
    obstacle: [
      '7,1','0,2','7,2',          // high plateau walls
      '2,3','3,3','5,3','6,3',    // upper transition barrier
      '1,4','4,4','6,4',          // lower transition barrier
    ],
    // High ground: entire plateau (rows 0–2 minus obstacles) plus scattered outcrops
    high: [
      // Row 0 — full ridge
      '0,0','1,0','2,0','3,0','4,0','5,0','6,0','7,0',
      // Row 1 — plateau (obstacle at 7,1)
      '0,1','1,1','2,1','3,1','4,1','5,1','6,1',
      // Row 2 — fortified edge (obstacles at 0,2 and 7,2)
      '1,2','2,2','3,2','4,2','5,2','6,2',
      // Scattered outcrops in transition zone
      '0,3','4,3','7,3',
      '3,4','7,4',
    ],
    water: [],
    // Players stage on flat bottom rows — well clear of obstacles
    playerStart: [
      { id:'p1', x:3, y:6 },
      { id:'p2', x:4, y:6 },
      { id:'p3', x:3, y:7 },
      { id:'p4', x:4, y:7 },
    ],
    // Enemies hold the high plateau — all start on high-ground tiles
    enemyStart: [
      { id:'e1', x:3, y:0 },
      { id:'e2', x:5, y:0 },
      { id:'e3', x:2, y:1 },
      { id:'e4', x:4, y:1 },
    ],
  },

  // ── Map 6: The Shattered Keep ──────────────────────────────
  // Climactic fortress interior: ruined outer walls with three breach points,
  // a high-ground central courtyard, and two water pools flanking the mid-zone.
  // Enemies hold the fortified interior; players breach from the south.
  map_6: {
    label: 'The Shattered Keep',
    cols: 8, rows: 8,
    // Ruined outer ring — top corners + side stubs + inner fortification pillars
    // Three natural breach gaps: far-left col (x=0,y=0 open), center (x=3-4,y=0),
    // and far-right (x=7,y=0 open) — enemies occupy center-top gap tiles
    obstacle: [
      '1,0','6,0',              // ruined top parapet (gaps at 0,3-4,7)
      '0,1','0,2','7,1','7,2',  // outer side walls (top half)
      '2,2','5,2',              // inner fortification pillars
      '1,3','6,3',              // mid-zone corridor pinch
      '2,4','5,4',              // mid-zone second pinch
      '0,5','7,5',              // lower side obstacles
    ],
    // Central courtyard high ground — controls the fight
    high: [
      '3,2','4,2',
      '3,3','4,3',
      '3,4','4,4',
      '2,1','5,1',  // flanking high for defenders
    ],
    // Two water pools flanking the mid-zone (SW and SE pockets)
    water: [
      '1,4','1,5','2,5',  // SW pool (3 tiles)
      '5,5','6,5','6,4',  // SE pool (3 tiles)
    ],
    // Players breach from the south — positions clear of obstacles and water
    playerStart: [
      { id:'p1', x:3, y:6 },
      { id:'p2', x:4, y:6 },
      { id:'p3', x:3, y:7 },
      { id:'p4', x:4, y:7 },
    ],
    // Enemies hold the fortified center-top
    // (2,0),(3,0),(4,0),(5,0) are open (obstacles at 1,0 and 6,0 only)
    enemyStart: [
      { id:'e1', x:3, y:0 },
      { id:'e2', x:4, y:0 },
      { id:'e3', x:2, y:0 },
      { id:'e4', x:5, y:0 },
    ],
  },
};

// Base unit templates — positions overridden per map
const BASE_UNITS = [
  createUnit({ id:'p1', name:'Aldric',    job:'Knight',     hp:140,maxHp:140, mp:20, maxMp:20,  speed:3, attack:16, defense:16, moveRange:3, x:1,y:5, team:'player', abilities:['Attack','Shield Bash','Wait'] }),
  createUnit({ id:'p2', name:'Lyra',      job:'Mage',       hp:65, maxHp:65,  mp:90, maxMp:90,  speed:8, attack:24, defense:5,  moveRange:4, x:2,y:6, team:'player', abilities:['Attack','Fireball','Heal','Wait'] }),
  createUnit({ id:'p3', name:'Kael',      job:'Paladin',    hp:120,maxHp:120, mp:60, maxMp:60,  speed:4, attack:14, defense:18, moveRange:3, x:0,y:6, team:'player', abilities:['Attack','Holy Lance','Barrier','Wait'] }),
  createUnit({ id:'p4', name:'Zara',      job:'Thief',      hp:80, maxHp:80,  mp:40, maxMp:40,  speed:9, attack:14, defense:6,  moveRange:5, x:1,y:6, team:'player', abilities:['Attack','Steal Mana','Smoke Bomb','Wait'] }),
  createUnit({ id:'e1', name:'Grunt',     job:'Archer',     hp:85, maxHp:85,  mp:20, maxMp:20,  speed:6, attack:15, defense:8,  moveRange:3, x:5,y:2, team:'enemy',  abilities:['Attack','Arrow Shot','Wait'] }),
  createUnit({ id:'e2', name:'Darkwraith',job:'Dark Knight',hp:115,maxHp:115, mp:50, maxMp:50,  speed:4, attack:22, defense:12, moveRange:2, x:6,y:1, team:'enemy',  abilities:['Attack','Dark Wave','Wait'] }),
  createUnit({ id:'e3', name:'Brute',     job:'Berserker',  hp:130,maxHp:130, mp:0,  maxMp:0,   speed:5, attack:28, defense:7,  moveRange:3, x:4,y:1, team:'enemy',  abilities:['Attack','Rampage','Wait'] }),
  createUnit({ id:'e4', name:'Sister',    job:'Healer',     hp:75, maxHp:75,  mp:100,maxMp:100, speed:7, attack:8,  defense:8,  moveRange:4, x:7,y:0, team:'enemy',  abilities:['Attack','Mend','Revive','Wait'] }),
];

