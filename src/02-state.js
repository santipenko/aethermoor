// --- SECTION: Game State ---
const GameState = {
  currentTurn: null, turnQueue: [], units: [], map: [], phase: 'battle',
  selectedUnit: null, validMoveTiles: [], hoveredTile: null, turnNumber: 0,
  unitMoved: false, unitActed: false,
  showActionMenu: false, actionMenuUnit: null,
  pendingAbility: null, validTargetTiles: [],
  floatingTexts: [], _skipCurrentTurn: false,
  currentMapId: 'map_1',
  activeVFX: [],
  _preMoveSnapshot: null,
};

