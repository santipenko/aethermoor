// =============================================================================
// TACTICAL RPG ENGINE
// =============================================================================

// --- SECTION: Schemas ---
const UnitSchema = { id:'', name:'', job:'', hp:0, maxHp:0, mp:0, maxMp:0, speed:0, attack:0, defense:0, moveRange:0, x:0, y:0, team:'player', statusEffects:[], abilities:[] };
const TileSchema = { x:0, y:0, terrain:'normal', occupied:false, elevation:0 };
const GameStateSchema = { currentTurn:null, turnQueue:[], units:[], map:[], phase:'battle' };

// --- SECTION: Config ---
const CONFIG = {
  GRID_COLS: 8, GRID_ROWS: 8, TILE_SIZE: 64, MIN_TILE_SIZE: 44,
  COLORS: {
    TILE_NORMAL:   '#1a2634',
    TILE_HIGH:     '#1e3045',
    TILE_OBSTACLE: '#0d1117',
    TILE_WATER:    '#0a1e35',
    TILE_BORDER:   '#243650',
    TILE_HIGHLIGHT:'rgba(80,200,255,0.32)',
    TILE_SELECTED: 'rgba(255,220,60,0.48)',
    TILE_HOVER:    'rgba(255,255,255,0.07)',
    TILE_TARGET:   'rgba(255,80,80,0.38)',
    TILE_HEAL_TARGET:'rgba(80,255,120,0.38)',
    TEAM_PLAYER:   '#4fc3f7',
    TEAM_ENEMY:    '#ef5350',
    HP_BAR_BG:     '#111828',
    HP_BAR_FILL:   '#4caf50',
    MP_BAR_FILL:   '#2196f3',
    TEXT_LIGHT:    '#e0f0ff',
    TEXT_DIM:      '#4a6070',
    PANEL_BG:      'rgba(6,12,22,0.95)',
    ACCENT:        '#00e5ff',
    GOLD:          '#ffd740',
    TURN_INDICATOR:'#ffd740',
    // New terrain polish colors
    TILE_HIGH_EDGE:  '#0d1e2e',
    TILE_HIGH_LIGHT: '#2a4560',
    WATER_SHIMMER:   'rgba(80,180,255,0.18)',
    OBSTACLE_CRACK:  'rgba(180,200,220,0.08)',
    NORMAL_GRAIN:    'rgba(255,255,255,0.022)',
    // Job accent colors
    JOB_ACCENT: {
      'Knight':     '#90caf9',
      'Mage':       '#ce93d8',
      'Archer':     '#a5d6a7',
      'Dark Knight':'#7c4dff',
      'Healer':     '#f48fb1',
      'Thief':      '#ffe082',
      'Paladin':    '#80deea',
      'Berserker':  '#ff8a65',
      'Squire':     '#90caf9',
    },
  },
  TERRAIN_MOVE_COST: { normal:1, high:1, obstacle:Infinity, water:Infinity },
};

