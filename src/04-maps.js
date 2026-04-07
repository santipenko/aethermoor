// --- SECTION: Map Definitions ---
const MAP_DEFINITIONS = {
  map_1: {
    label: 'Ruins of Aethermoor',
    cols: 8, rows: 8,
    obstacle: ['3,2','3,3','4,4','6,5','1,1','7,6'],
    high:     ['2,2','5,3','4,5','7,2'],
    water:    ['0,4','0,5','1,4'],
    playerStart: [
      { id:'aldric', x:1, y:5 },
      { id:'lyra',   x:2, y:6 },
      { id:'kael',   x:0, y:6 },
      { id:'zara',   x:1, y:6 },
    ],
    enemyStart: [
      { id:'grunt',      x:5, y:2 },
      { id:'darkwraith', x:6, y:1 },
      { id:'brute',      x:4, y:1 },
      { id:'sister',     x:7, y:0 },
    ],
  },
  map_2: {
    label: 'Ashfen Causeway',
    cols: 8, rows: 8,
    obstacle: ['3,3','4,3','3,4','4,4','3,5'],
    high:     ['0,0','1,0','7,0','6,0','0,7','1,7','7,7','6,7','0,1','7,1'],
    water:    ['0,2','0,3','0,4','0,5','1,2','1,3','1,4','1,5','2,3','2,4'],
    playerStart: [
      { id:'aldric', x:2, y:6 },
      { id:'lyra',   x:3, y:7 },
      { id:'kael',   x:2, y:5 },
      { id:'zara',   x:3, y:6 },
    ],
    enemyStart: [
      { id:'grunt',      x:5, y:1 },
      { id:'darkwraith', x:6, y:2 },
      { id:'brute',      x:5, y:0 },
      { id:'sister',     x:7, y:1 },
    ],
  },

  // ── Map 3: Ironhold Passage ─────────────────────────────────
  map_3: {
    label: 'Ironhold Passage',
    cols: 8, rows: 8,
    obstacle: [
      '2,1','2,2','2,3','2,4','2,5',
      '5,1','5,2','5,3','5,4','5,5',
      '3,3','4,3',
    ],
    high: [
      '1,3','1,4',
      '6,3','6,4',
      '3,2','4,2',
      '3,4','4,4',
    ],
    water: ['0,0','7,0'],
    playerStart: [
      { id:'aldric', x:3, y:6 },
      { id:'lyra',   x:4, y:6 },
      { id:'kael',   x:3, y:7 },
      { id:'zara',   x:4, y:7 },
    ],
    enemyStart: [
      { id:'grunt',      x:3, y:1 },
      { id:'darkwraith', x:4, y:1 },
      { id:'brute',      x:3, y:0 },
      { id:'sister',     x:4, y:0 },
    ],
  },

  // ── Map 4: Thornmire Shallows ───────────────────────────────
  map_4: {
    label: 'Thornmire Shallows',
    cols: 8, rows: 8,
    obstacle: [],
    high: [
      '5,0','5,1','5,2',
      '0,5','1,5',
      '4,2','3,4',
    ],
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
    playerStart: [
      { id:'aldric', x:0, y:6 },
      { id:'lyra',   x:1, y:6 },
      { id:'kael',   x:0, y:7 },
      { id:'zara',   x:1, y:7 },
    ],
    enemyStart: [
      { id:'grunt',      x:6, y:1 },
      { id:'darkwraith', x:7, y:1 },
      { id:'brute',      x:6, y:0 },
      { id:'sister',     x:7, y:0 },
    ],
  },

  // ── Map 5: Verdant Escarpment ───────────────────────────────
  map_5: {
    label: 'Verdant Escarpment',
    cols: 8, rows: 8,
    obstacle: [
      '7,1','0,2','7,2',
      '2,3','3,3','5,3','6,3',
      '1,4','4,4','6,4',
    ],
    high: [
      '0,0','1,0','2,0','3,0','4,0','5,0','6,0','7,0',
      '0,1','1,1','2,1','3,1','4,1','5,1','6,1',
      '1,2','2,2','3,2','4,2','5,2','6,2',
      '0,3','4,3','7,3',
      '3,4','7,4',
    ],
    water: [],
    playerStart: [
      { id:'aldric', x:3, y:6 },
      { id:'lyra',   x:4, y:6 },
      { id:'kael',   x:3, y:7 },
      { id:'zara',   x:4, y:7 },
    ],
    enemyStart: [
      { id:'grunt',      x:3, y:0 },
      { id:'darkwraith', x:5, y:0 },
      { id:'brute',      x:2, y:1 },
      { id:'sister',     x:4, y:1 },
    ],
  },

  // ── Map 6: The Shattered Keep ──────────────────────────────
  map_6: {
    label: 'The Shattered Keep',
    cols: 8, rows: 8,
    obstacle: [
      '1,0','6,0',
      '0,1','0,2','7,1','7,2',
      '2,2','5,2',
      '1,3','6,3',
      '2,4','5,4',
      '0,5','7,5',
    ],
    high: [
      '3,2','4,2',
      '3,3','4,3',
      '3,4','4,4',
      '2,1','5,1',
    ],
    water: [
      '1,4','1,5','2,5',
      '5,5','6,5','6,4',
    ],
    playerStart: [
      { id:'aldric', x:3, y:6 },
      { id:'lyra',   x:4, y:6 },
      { id:'kael',   x:3, y:7 },
      { id:'zara',   x:4, y:7 },
    ],
    enemyStart: [
      { id:'grunt',      x:3, y:0 },
      { id:'darkwraith', x:4, y:0 },
      { id:'brute',      x:2, y:0 },
      { id:'sister',     x:5, y:0 },
    ],
  },

  // ── Act 2 Maps ──────────────────────────────────────────────

  // act2_m1 — The Ashfen Wood (8×10)
  act2_m1: {
    label: 'The Ashfen Wood',
    cols: 8, rows: 10,
    obstacle: [
      '1,1','2,1','1,2',
      '5,1','6,1','6,2',
      '0,4','1,4',
      '6,4','7,4',
      '2,6','3,6',
      '5,7','6,7','5,8',
    ],
    high: [
      '3,1','4,1',
      '3,4','4,4',
      '0,7','1,7','7,7','7,8',
    ],
    water: [],
    hazard: [],
    playerStart: [
      { id:'aldric', x:2, y:8 },
      { id:'lyra',   x:3, y:9 },
      { id:'kael',   x:4, y:9 },
      { id:'zara',   x:5, y:8 },
    ],
    enemyStart: [
      { id:'grunt',  x:2, y:1 },
      { id:'brute',  x:4, y:0 },
      { id:'varek',  x:5, y:2 },
      { id:'sister', x:3, y:0 },
    ],
  },

  // act2_m2 — Cinder Hollow (8×8)
  act2_m2: {
    label: 'Cinder Hollow',
    cols: 8, rows: 8,
    obstacle: [
      '2,1','3,1','4,1',
      '2,2','4,2',
      '5,3','5,4',
      '1,5','1,6',
    ],
    high: [
      '0,0','0,1',
      '7,0','7,1',
      '3,4','4,4',
    ],
    water: [],
    hazard: [
      '1,1','1,2','1,3',
      '3,2',
      '5,1','6,1','6,2',
      '2,6','3,6','4,6',
      '6,5','7,5','7,6',
    ],
    playerStart: [
      { id:'aldric', x:2, y:7 },
      { id:'lyra',   x:3, y:7 },
      { id:'kael',   x:4, y:7 },
      { id:'zara',   x:5, y:7 },
      { id:'rynn',   x:1, y:7 },
    ],
    enemyStart: [
      { id:'varek',  x:3, y:0 },
      { id:'grunt',  x:5, y:2 },
      { id:'brute',  x:1, y:4 },
      { id:'sister', x:6, y:3 },
    ],
  },

  // act2_m3 — The Sunken Road (6×12)
  act2_m3: {
    label: 'The Sunken Road',
    cols: 6, rows: 12,
    obstacle: [
      '2,1','2,2','2,3',
      '2,5','2,6','2,7',
      '2,9','2,10','2,11',
      '3,1','3,2','3,3',
      '3,5','3,6','3,7',
      '3,9','3,10','3,11',
    ],
    high: [
      '1,4','4,4',
      '1,8','4,8',
      '0,0','5,0',
      '0,11','5,11',
    ],
    water: [],
    hazard: [],
    playerStart: [
      { id:'aldric', x:0, y:10 },
      { id:'lyra',   x:1, y:11 },
      { id:'kael',   x:0, y:11 },
      { id:'zara',   x:5, y:10 },
      { id:'rynn',   x:5, y:11 },
    ],
    enemyStart: [
      { id:'grunt',  x:1, y:1 },
      { id:'brute',  x:0, y:0 },
      { id:'varek',  x:4, y:1 },
      { id:'sister', x:5, y:0 },
    ],
  },

  // act2_side1 — The Ley Scar (8×8)
  act2_side1: {
    label: 'The Ley Scar',
    cols: 8, rows: 8,
    obstacle: [
      '3,3','4,3','3,4','4,4',
    ],
    high: [
      '0,0','1,0','6,0','7,0',
      '0,7','1,7','6,7','7,7',
      '2,2','5,2','2,5','5,5',
    ],
    water: [
      '2,3','2,4',
      '5,3','5,4',
      '3,1','4,1',
      '3,6','4,6',
    ],
    hazard: [],
    playerStart: [
      { id:'aldric', x:0, y:6 },
      { id:'lyra',   x:1, y:7 },
      { id:'kael',   x:0, y:7 },
      { id:'zara',   x:1, y:6 },
      { id:'rynn',   x:2, y:7 },
    ],
    enemyStart: [
      { id:'solen',   x:4, y:0 },
      { id:'grunt',   x:3, y:0 },
      { id:'grunt_b', x:5, y:1 },
      { id:'sister',  x:4, y:1 },
    ],
  },

  // act2_m4 — Thornback Ridge (10×8)
  act2_m4: {
    label: 'Thornback Ridge',
    cols: 10, rows: 8,
    obstacle: [
      '2,1','2,6',
      '4,2','4,5',
      '6,1','6,2','6,5','6,6',
      '7,3','8,3',
    ],
    high: [
      '5,3','5,4',
      '7,0','8,0','9,0',
      '7,7','8,7','9,7',
      '7,1','7,2','7,5','7,6',
      '8,2','8,5','9,2','9,5',
    ],
    water: [
      '0,3','0,4','1,3','1,4',
    ],
    hazard: [],
    playerStart: [
      { id:'aldric', x:0, y:2 },
      { id:'lyra',   x:0, y:5 },
      { id:'kael',   x:1, y:2 },
      { id:'zara',   x:0, y:3 },
      { id:'rynn',   x:1, y:5 },
    ],
    enemyStart: [
      { id:'varek',  x:8, y:3 },
      { id:'solen',  x:9, y:2 },
      { id:'grunt',  x:7, y:1 },
      { id:'brute',  x:7, y:6 },
      { id:'sister', x:9, y:5 },
    ],
  },

  // act2_m5 — The Relay Station (8×8)
  act2_m5: {
    label: 'The Relay Station',
    cols: 8, rows: 8,
    obstacle: [
      '1,1','6,1',
      '0,2','7,2',
      '2,2','5,2',
      '2,5','5,5',
      '0,5','7,5',
    ],
    high: [
      '3,2','4,2',
      '3,3','4,3',
      '3,4','4,4',
      '2,1','5,1',
    ],
    water: [
      '1,3','1,4',
      '6,3','6,4',
    ],
    hazard: [],
    playerStart: [
      { id:'aldric', x:2, y:7 },
      { id:'lyra',   x:3, y:7 },
      { id:'kael',   x:4, y:7 },
      { id:'zara',   x:5, y:7 },
      { id:'rynn',   x:1, y:6 },
    ],
    enemyStart: [
      { id:'solen',   x:3, y:1 },
      { id:'varek',   x:4, y:2 },
      { id:'grunt',   x:2, y:3 },
      { id:'brute',   x:5, y:3 },
      { id:'sister',  x:3, y:0 },
      { id:'grunt_b', x:5, y:0 },
    ],
  },
};

// Base unit templates — positions overridden per map
const BASE_UNITS = [
  // ── Player characters ──────────────────────────────────────
  createUnit({ id:'aldric',     name:'Aldric',    job:'Knight',     hp:140,maxHp:140, mp:20, maxMp:20,  speed:3, attack:16, defense:16, moveRange:3, x:1,y:5, team:'player', abilities:['Attack','Shield Bash','Wait'] }),
  createUnit({ id:'lyra',       name:'Lyra',      job:'Mage',       hp:65, maxHp:65,  mp:90, maxMp:90,  speed:8, attack:24, defense:5,  moveRange:4, x:2,y:6, team:'player', abilities:['Attack','Fireball','Heal','Wait'] }),
  createUnit({ id:'kael',       name:'Kael',      job:'Paladin',    hp:120,maxHp:120, mp:60, maxMp:60,  speed:4, attack:14, defense:18, moveRange:3, x:0,y:6, team:'player', abilities:['Attack','Holy Lance','Barrier','Wait'] }),
  createUnit({ id:'zara',       name:'Zara',      job:'Thief',      hp:80, maxHp:80,  mp:40, maxMp:40,  speed:9, attack:14, defense:6,  moveRange:5, x:1,y:6, team:'player', abilities:['Attack','Steal Mana','Smoke Bomb','Wait'] }),
  // Act 2 recruits
  createUnit({ id:'rynn',       name:'Rynn',      job:'Scout',      hp:72, maxHp:72,  mp:40, maxMp:40,  speed:10, attack:13, defense:6,  moveRange:5, x:0,y:0, team:'player', abilities:['Attack','Scout Shot','Vanish','Wait'] }),
  createUnit({ id:'eska',       name:'Eska',      job:'Warden',     hp:78, maxHp:78,  mp:70, maxMp:70,  speed:6,  attack:11, defense:10, moveRange:3, x:0,y:0, team:'player', abilities:['Attack','Root','Ley Pulse','Wait'] }),
  // ── Enemy characters ───────────────────────────────────────
  createUnit({ id:'grunt',      name:'Grunt',     job:'Archer',     hp:85, maxHp:85,  mp:20, maxMp:20,  speed:6, attack:15, defense:8,  moveRange:3, x:5,y:2, team:'enemy',  abilities:['Attack','Arrow Shot','Wait'] }),
  createUnit({ id:'darkwraith', name:'Darkwraith',job:'Dark Knight',hp:115,maxHp:115, mp:50, maxMp:50,  speed:4, attack:22, defense:12, moveRange:2, x:6,y:1, team:'enemy',  abilities:['Attack','Dark Wave','Wait'] }),
  createUnit({ id:'brute',      name:'Brute',     job:'Berserker',  hp:130,maxHp:130, mp:0,  maxMp:0,   speed:5, attack:28, defense:7,  moveRange:3, x:4,y:1, team:'enemy',  abilities:['Attack','Rampage','Wait'] }),
  createUnit({ id:'sister',     name:'Sister',    job:'Healer',     hp:75, maxHp:75,  mp:100,maxMp:100, speed:7, attack:8,  defense:8,  moveRange:4, x:7,y:0, team:'enemy',  abilities:['Attack','Mend','Revive','Wait'] }),
  // Act 2 enemies
  createUnit({ id:'varek',      name:'Varek',     job:'Commander',  hp:145,maxHp:145, mp:30, maxMp:30,  speed:4, attack:20, defense:15, moveRange:3, x:0,y:0, team:'enemy',  abilities:['Attack','Rally','Shield Wall','Wait'] }),
  createUnit({ id:'solen',      name:'Solen',     job:'Arcanist',   hp:68, maxHp:68,  mp:110,maxMp:110, speed:7, attack:22, defense:6,  moveRange:4, x:0,y:0, team:'enemy',  abilities:['Attack','Fireball','Suppress','Wait'] }),
  createUnit({ id:'grunt_b',    name:'Grunt',     job:'Archer',     hp:85, maxHp:85,  mp:20, maxMp:20,  speed:6, attack:15, defense:8,  moveRange:3, x:0,y:0, team:'enemy',  abilities:['Attack','Arrow Shot','Wait'] }),
];
