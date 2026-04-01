// --- SECTION: Map System ---
const MapSystem = (() => {
  function buildMap(def) {
    const obs = new Set(def.obstacle || []);
    const hi  = new Set(def.high     || []);
    const wat = new Set(def.water    || []);
    const map = [];
    for(let r=0;r<def.rows;r++){
      map[r]=[];
      for(let c=0;c<def.cols;c++){
        const k=`${c},${r}`;
        let terrain='normal', elevation=0;
        if(obs.has(k)){ terrain='obstacle'; elevation=2; }
        else if(hi.has(k)){ terrain='high'; elevation=1; }
        else if(wat.has(k)){ terrain='water'; elevation=-1; }
        map[r][c]=Object.assign({},TileSchema,{x:c,y:r,terrain,elevation,occupied:false});
      }
    }
    return map;
  }

  function load(mapId) {
    const def = MAP_DEFINITIONS[mapId];
    if (!def) { console.error('[MapSystem] Unknown map:', mapId); return; }
    GameState.currentMapId = mapId;

    // Build fresh map
    GameState.map = buildMap(def);

    // Reset units with map-specific starting positions (preserve HP/MP/etc freshly)
    const allStarts = [...(def.playerStart||[]), ...(def.enemyStart||[])];
    GameState.units = BASE_UNITS.map(template => {
      const override = allStarts.find(s => s.id === template.id);
      const u = Object.assign({}, template, { statusEffects:[], hp:template.maxHp, mp:template.maxMp });
      if (override) { u.x = override.x; u.y = override.y; }
      return u;
    });

    syncMapOccupancy();
    console.log(`%c[MapSystem] Loaded "${def.label}"`, 'color:#00e5ff;font-weight:bold');
    return def;
  }

  function cycleMap() {
    const ids = Object.keys(MAP_DEFINITIONS);
    const cur = ids.indexOf(GameState.currentMapId);
    const next = ids[(cur + 1) % ids.length];
    // Full restart on map change
    GameState.phase = 'battle';
    document.getElementById('end-overlay').style.display = 'none';
    load(next);

    // Reset turn system
    GameState.currentTurn = null;
    GameState.turnQueue = [];
    GameState.selectedUnit = null;
    GameState.validMoveTiles = [];
    GameState.unitMoved = false;
    GameState.unitActed = false;
    GameState.showActionMenu = false;
    GameState.actionMenuUnit = null;
    GameState.pendingAbility = null;
    GameState.validTargetTiles = [];
    GameState.floatingTexts = [];
    GameState.activeVFX = [];
    GameState.turnNumber = 0;

    TurnSystem.start();
    Renderer.draw();

    // Update map button label
    const btn = document.getElementById('map-select-btn');
    if (btn) btn.textContent = `${MAP_DEFINITIONS[next].label.split(' ')[0].toUpperCase()} ▸`;
  }

  return { load, buildMap, cycleMap };
})();

// Legacy shim — generate initial map from map_1 definition
function generateMap(cols,rows){ return MapSystem.buildMap(MAP_DEFINITIONS.map_1); }

