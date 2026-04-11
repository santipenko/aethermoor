// --- SECTION: Map System ---
const MapSystem = (() => {
  function buildMap(def) {
    const obs = new Set(def.obstacle || []);
    const hi  = new Set(def.high     || []);
    const wat = new Set(def.water    || []);
    const haz = new Set(def.hazard   || []);
    const map = [];
    for(let r=0;r<def.rows;r++){
      map[r]=[];
      for(let c=0;c<def.cols;c++){
        const k=`${c},${r}`;
        let terrain='normal', elevation=0;
        if(obs.has(k)){ terrain='obstacle'; elevation=2; }
        else if(hi.has(k)){ terrain='high'; elevation=1; }
        else if(wat.has(k)){ terrain='water'; elevation=-1; }
        else if(haz.has(k)){ terrain='hazard'; elevation=0; }
        map[r][c]=Object.assign({},TileSchema,{x:c,y:r,terrain,elevation,occupied:false});
      }
    }
    return map;
  }

  function _applyJobToUnit(unit, charId) {
    // Read save data — returns null if no save exists
    const saveData = SaveSystem.load();
    if (!saveData || !saveData.roster) return;

    const rosterEntry = saveData.roster[charId];
    if (!rosterEntry) return;

    // Resolve current job ID — fall back gracefully if not set
    const jobId = rosterEntry.currentJob || null;
    if (!jobId) return;

    // Convert slug to JOBS key ('knight' → 'Knight', 'dark_knight' → 'Dark Knight')
    const jobKey = SaveSystem.jobIdToKey(jobId);
    const jobDef = JOBS[jobKey];
    if (!jobDef) return;

    // Apply job base stats
    const bs = jobDef.baseStats;
    unit.maxHp    = bs.maxHp;
    unit.maxMp    = bs.maxMp;
    unit.attack   = bs.attack;
    unit.defense  = bs.defense;
    unit.speed    = bs.speed;
    unit.moveRange = bs.moveRange;

    // Apply accumulated level growth on top of job base stats
    const grown = rosterEntry.grownStats;
    if (grown) {
      unit.maxHp    += (grown.hp       || 0);
      unit.maxMp    += (grown.mp       || 0);
      unit.attack   += (grown.attack   || 0);
      unit.defense  += (grown.defense  || 0);
      unit.speed    += (grown.speed    || 0);
      // moveRange is not part of statGrowth — job base value is authoritative
    }

    // Apply job abilities
    unit.abilities = [...jobDef.abilities];

    // Update job display name
    unit.job = jobKey;

    // HP and MP will be reset to maxHp/maxMp by the caller after this function returns
  }

  function load(mapId, deployedCharacterIds) {
    const def = MAP_DEFINITIONS[mapId];
    if (!def) { console.error('[MapSystem] Unknown map:', mapId); return; }

    // Propagate map dimensions to CONFIG before anything else reads them
    CONFIG.GRID_COLS = def.cols;
    CONFIG.GRID_ROWS = def.rows;

    GameState.currentMapId = mapId;

    // Build fresh map
    GameState.map = buildMap(def);

    // Reset units with map-specific starting positions (preserve HP/MP/etc freshly)
    const allStarts = [...(def.playerStart||[]), ...(def.enemyStart||[])];

    let unitsToLoad;

    if (deployedCharacterIds && deployedCharacterIds.length > 0) {
      // Deploy mode — roster screen has provided a selected list
      const capped = deployedCharacterIds.slice(0, 5); // enforce 5-unit cap
      const playerUnits = capped
        .map(charId => BASE_UNITS.find(u => u.id === charId))
        .filter(Boolean); // silently skip any id not found in BASE_UNITS

      const enemyUnits = BASE_UNITS.filter(u => u.team === 'enemy');

      unitsToLoad = [...playerUnits, ...enemyUnits];
    } else {
      // Fallback — use all units from BASE_UNITS (Act 1 behavior)
      unitsToLoad = BASE_UNITS;
    }

    GameState.units = unitsToLoad.map(template => {
      const override = allStarts.find(s => s.id === template.id);
      // Build base unit — stats and abilities from template first
      const u = Object.assign({}, template, { statusEffects:[] });

      // Apply current job from save data for player units
      // This overwrites stats and abilities before HP/MP are set
      if (u.team === 'player') {
        _applyJobToUnit(u, u.id);
      }

      // Reset HP and MP to current maximums (post-job-application)
      u.hp = u.maxHp;
      u.mp = u.maxMp;

      // Apply map start position override
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
