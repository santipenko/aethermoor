// --- SECTION: Save System ---
// localStorage-backed save with unit state, map, and round number.
// Extended for Act 2+: roster, flags, worldMap, deployRecords, unlock conditions.
// =============================================================================
const SaveSystem = (() => {
  const KEY = 'aethermoor_save_v1';

  // ── Default roster — full 15-character initial state ─────────────────────
  const DEFAULT_ROSTER = {
    aldric: {
      id: 'aldric', recruited: true, available: true,
      uniqueJob: 'vanguard_knight', currentJob: 'knight',
      unlockedJobs: ['knight'], xp: 0, level: 1,
      statGrowth: { hp: 8, mp: 2, attack: 2, defense: 2, speed: 1 },
      equipment: []
    },
    lyra: {
      id: 'lyra', recruited: true, available: true,
      uniqueJob: 'arcanist', currentJob: 'mage',
      unlockedJobs: ['mage'], xp: 0, level: 1,
      statGrowth: { hp: 5, mp: 6, attack: 3, defense: 1, speed: 1 },
      equipment: []
    },
    kael: {
      id: 'kael', recruited: true, available: true,
      uniqueJob: 'paladin', currentJob: 'paladin',
      unlockedJobs: ['paladin', 'knight'], xp: 0, level: 1,
      statGrowth: { hp: 9, mp: 3, attack: 2, defense: 3, speed: 1 },
      equipment: []
    },
    zara: {
      id: 'zara', recruited: true, available: true,
      uniqueJob: 'shadowblade', currentJob: 'thief',
      unlockedJobs: ['thief'], xp: 0, level: 1,
      statGrowth: { hp: 6, mp: 3, attack: 3, defense: 1, speed: 3 },
      equipment: []
    },
    rynn: {
      id: 'rynn', recruited: false, available: false,
      uniqueJob: 'scout', currentJob: 'scout',
      unlockedJobs: [], xp: 0, level: 1,
      statGrowth: { hp: 6, mp: 2, attack: 2, defense: 1, speed: 4 },
      equipment: []
    },
    tobin: {
      id: 'tobin', recruited: false, available: false,
      uniqueJob: 'vanguard', currentJob: 'vanguard',
      unlockedJobs: ['knight'], xp: 0, level: 1,
      statGrowth: { hp: 8, mp: 1, attack: 3, defense: 2, speed: 1 },
      equipment: []
    },
    eska: {
      id: 'eska', recruited: false, available: false,
      uniqueJob: 'warden', currentJob: 'warden',
      unlockedJobs: ['mage', 'healer'], xp: 0, level: 1,
      statGrowth: { hp: 6, mp: 5, attack: 1, defense: 2, speed: 2 },
      equipment: []
    },
    sera: {
      id: 'sera', recruited: false, available: false,
      uniqueJob: 'surveyor', currentJob: 'surveyor',
      unlockedJobs: ['archer'], xp: 0, level: 1,
      statGrowth: { hp: 5, mp: 4, attack: 2, defense: 1, speed: 2 },
      equipment: []
    },
    orin: {
      id: 'orin', recruited: false, available: false,
      uniqueJob: 'archivist', currentJob: 'archivist',
      unlockedJobs: ['healer'], xp: 0, level: 1,
      statGrowth: { hp: 6, mp: 5, attack: 1, defense: 2, speed: 1 },
      equipment: []
    },
    cael: {
      id: 'cael', recruited: false, available: false,
      uniqueJob: 'lorekeeper', currentJob: 'lorekeeper',
      unlockedJobs: [], xp: 0, level: 1,
      statGrowth: { hp: 5, mp: 4, attack: 1, defense: 1, speed: 1 },
      equipment: []
    },
    maren: {
      id: 'maren', recruited: false, available: false,
      uniqueJob: 'artificer', currentJob: 'artificer',
      unlockedJobs: ['dark_knight'], xp: 0, level: 1,
      statGrowth: { hp: 6, mp: 4, attack: 2, defense: 1, speed: 2 },
      equipment: []
    },
    davan: {
      id: 'davan', recruited: false, available: false,
      uniqueJob: 'inquisitor', currentJob: 'inquisitor',
      unlockedJobs: ['dark_knight', 'knight'], xp: 0, level: 1,
      statGrowth: { hp: 7, mp: 3, attack: 3, defense: 2, speed: 1 },
      equipment: []
    },
    darkwraith: {
      id: 'darkwraith', recruited: false, available: false,
      uniqueJob: 'dark_knight', currentJob: 'dark_knight',
      unlockedJobs: [], xp: 0, level: 1,
      statGrowth: { hp: 8, mp: 4, attack: 4, defense: 2, speed: 2 },
      equipment: []
    },
    sister: {
      id: 'sister', recruited: false, available: false,
      uniqueJob: 'healer', currentJob: 'healer',
      unlockedJobs: [], xp: 0, level: 1,
      statGrowth: { hp: 6, mp: 6, attack: 1, defense: 2, speed: 2 },
      equipment: []
    },
    brute: {
      id: 'brute', recruited: false, available: false,
      uniqueJob: 'berserker', currentJob: 'berserker',
      unlockedJobs: [], xp: 0, level: 1,
      statGrowth: { hp: 12, mp: 1, attack: 5, defense: 2, speed: 2 },
      equipment: []
    }
  };

  // ── Top-level defaults for missing keys on old saves ─────────────────────
  const SAVE_DEFAULTS = {
    schemaVersion: 1,
    flags: {},
    deployRecords: {},
    worldMap: {},
    roster: DEFAULT_ROSTER
  };

  // ── Internal: read raw data from localStorage ─────────────────────────────
  function _readRaw() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch(e) { return null; }
  }

  // ── Internal: apply top-level defaults to loaded data ────────────────────
  function _applyDefaults(data) {
    if (!data) data = {};
    for (const k of Object.keys(SAVE_DEFAULTS)) {
      if (!(k in data)) {
        // Deep-copy the default value so mutations don't affect the template
        data[k] = JSON.parse(JSON.stringify(SAVE_DEFAULTS[k]));
      }
    }
    return data;
  }

  // ── Internal: write data object to localStorage ───────────────────────────
  function _write(data) {
    try {
      localStorage.setItem(KEY, JSON.stringify(data));
      return true;
    } catch(e) {
      console.warn('[SaveSystem] Write failed:', e);
      return false;
    }
  }

  // ── Internal: show save toast ─────────────────────────────────────────────
  function _showToast() {
    const t = document.getElementById('save-toast');
    if (!t) return;
    t.style.display = 'block';
    t.style.opacity = '1';
    clearTimeout(t._tid);
    t._tid = setTimeout(() => {
      t.style.transition = 'opacity 0.5s';
      t.style.opacity = '0';
      setTimeout(() => { t.style.display = 'none'; t.style.transition = ''; }, 520);
    }, 2000);
  }

  // ── XP threshold helper ───────────────────────────────────────────────────
  function _xpThreshold(level) {
    return 100 * level;
  }

  // =========================================================================
  // EXISTING PUBLIC METHODS — preserved exactly
  // =========================================================================

  function save() {
    const data = _applyDefaults(_readRaw());
    // Overwrite the live combat fields with current GameState
    data.mapId = GameState.currentMapId;
    data.turnNumber = GameState.turnNumber;
    data.units = GameState.units.map(u => ({
      id: u.id, hp: u.hp, mp: u.mp,
    }));
    data.timestamp = Date.now();
    _write(data);
    _showToast();
    console.log('[SaveSystem] Saved:', data);
  }

  function load() {
    const raw = _readRaw();
    if (!raw) return null;
    return _applyDefaults(raw);
  }

  function clear() {
    localStorage.removeItem(KEY);
  }

  function applyToState(saveData) {
    if (!saveData) return;
    // Restore HP/MP
    for (const saved of saveData.units || []) {
      const u = GameState.units.find(x => x.id === saved.id);
      if (u) { u.hp = saved.hp; u.mp = saved.mp; }
    }
    GameState.turnNumber = saveData.turnNumber || 0;
  }

  // =========================================================================
  // NEW PUBLIC METHODS
  // =========================================================================

  // ── Story flags ───────────────────────────────────────────────────────────

  function setFlag(flagName) {
    const data = _applyDefaults(_readRaw());
    data.flags[flagName] = true;
    _write(data);
  }

  function getFlag(flagName) {
    const data = _applyDefaults(_readRaw());
    return data.flags[flagName] === true;
  }

  // ── Deploy records ────────────────────────────────────────────────────────

  function recordDeploy(mapId, characterIds) {
    const data = _applyDefaults(_readRaw());
    data.deployRecords[mapId] = characterIds;
    _write(data);
  }

  // ── World map nodes ───────────────────────────────────────────────────────

  function completeNode(mapId, type) {
    const data = _applyDefaults(_readRaw());
    data.worldMap[mapId] = { completed: true, type: type };
    _write(data);
  }

  // ── Roster management ─────────────────────────────────────────────────────

  function recruitCharacter(characterId) {
    const data = _applyDefaults(_readRaw());
    if (!data.roster[characterId]) {
      console.warn('[SaveSystem] recruitCharacter: unknown character:', characterId);
      return;
    }
    data.roster[characterId].recruited = true;
    data.roster[characterId].available = true;
    _write(data);
  }

  function setCharacterAvailable(characterId, bool) {
    const data = _applyDefaults(_readRaw());
    if (!data.roster[characterId]) {
      console.warn('[SaveSystem] setCharacterAvailable: unknown character:', characterId);
      return;
    }
    data.roster[characterId].available = bool;
    _write(data);
  }

  function setCharacterJob(characterId, jobId) {
    const data = _applyDefaults(_readRaw());
    if (!data.roster[characterId]) {
      console.warn('[SaveSystem] setCharacterJob: unknown character:', characterId);
      return;
    }
    data.roster[characterId].currentJob = jobId;
    _write(data);
  }

  function unlockJob(characterId, jobId) {
    const data = _applyDefaults(_readRaw());
    if (!data.roster[characterId]) {
      console.warn('[SaveSystem] unlockJob: unknown character:', characterId);
      return;
    }
    if (!data.roster[characterId].unlockedJobs.includes(jobId)) {
      data.roster[characterId].unlockedJobs.push(jobId);
    }
    _write(data);
  }

  // ── XP and level-up ──────────────────────────────────────────────────────

  function addXP(characterId, amount) {
    const data = _applyDefaults(_readRaw());
    const ch = data.roster[characterId];
    if (!ch) {
      console.warn('[SaveSystem] addXP: unknown character:', characterId);
      return;
    }

    const LEVEL_CAP = 20;
    ch.xp += amount;

    // Handle potentially multiple level-ups
    let leveled = false;
    while (ch.level < LEVEL_CAP) {
      const threshold = _xpThreshold(ch.level);
      if (ch.xp < threshold) break;
      ch.xp -= threshold;
      ch.level++;
      leveled = true;

      // Apply stat growth to roster entry
      const g = ch.statGrowth;
      // Store grown stats on the roster entry so future loads can apply them
      if (!ch.grownStats) {
        ch.grownStats = { hp: 0, mp: 0, attack: 0, defense: 0, speed: 0 };
      }
      ch.grownStats.hp       = (ch.grownStats.hp       || 0) + g.hp;
      ch.grownStats.mp       = (ch.grownStats.mp       || 0) + g.mp;
      ch.grownStats.attack   = (ch.grownStats.attack   || 0) + g.attack;
      ch.grownStats.defense  = (ch.grownStats.defense  || 0) + g.defense;
      ch.grownStats.speed    = (ch.grownStats.speed    || 0) + g.speed;

      // Apply to live GameState unit if loaded
      if (typeof GameState !== 'undefined') {
        const liveUnit = GameState.units.find(u => u.id === characterId);
        if (liveUnit) {
          liveUnit.maxHp     += g.hp;
          liveUnit.hp         = Math.min(liveUnit.hp + g.hp, liveUnit.maxHp);
          liveUnit.maxMp     += g.mp;
          liveUnit.mp         = Math.min(liveUnit.mp + g.mp, liveUnit.maxMp);
          liveUnit.attack    += g.attack;
          liveUnit.defense   += g.defense;
          liveUnit.speed     += g.speed;
        }
      }

      console.log(`%c[SaveSystem] ${characterId} leveled up to ${ch.level}!`, 'color:#ffd740;font-weight:bold');

      // Emit event if GameEvents is available
      if (typeof GameEvents !== 'undefined') {
        GameEvents.emit('CHARACTER_LEVELED', { characterId, newLevel: ch.level });
      }
    }

    _write(data);
  }

  // ── Unlock condition evaluation ───────────────────────────────────────────

  function evaluateCondition(condition) {
    const data = _applyDefaults(_readRaw());
    return _evalCondition(condition, data);
  }

  function _evalCondition(condition, saveData) {
    if (!condition || !condition.type) return false;

    switch (condition.type) {
      case 'flag':
        return saveData.flags[condition.flag] === true;

      case 'character_present': {
        const record = saveData.deployRecords[condition.mapId];
        if (!Array.isArray(record)) return false;
        return record.includes(condition.characterId);
      }

      case 'map_completed': {
        const node = saveData.worldMap[condition.mapId];
        return !!(node && node.completed === true);
      }

      case 'character_recruited': {
        const ch = saveData.roster[condition.characterId];
        return !!(ch && ch.recruited === true);
      }

      case 'all_of':
        if (!Array.isArray(condition.conditions)) return false;
        return condition.conditions.every(c => _evalCondition(c, saveData));

      case 'any_of':
        if (!Array.isArray(condition.conditions)) return false;
        return condition.conditions.some(c => _evalCondition(c, saveData));

      default:
        console.warn('[SaveSystem] evaluateCondition: unknown type:', condition.type);
        return false;
    }
  }

  // ── Roster query ──────────────────────────────────────────────────────────

  function getAvailableRoster() {
    const data = _applyDefaults(_readRaw());
    return Object.values(data.roster).filter(ch => ch.recruited && ch.available);
  }

  // =========================================================================
  // UNLOCK CONDITIONS — canonical definitions for known characters
  // =========================================================================

  const UNLOCK_CONDITIONS = {

    cael: {
      type: 'all_of', conditions: [
        { type: 'character_recruited', characterId: 'orin' },
        { type: 'map_completed', mapId: 'act3_side2' }
      ]
    },

    brute: {
      type: 'all_of', conditions: [
        { type: 'flag', flag: 'brute_spared_act2' },
        { type: 'map_completed', mapId: 'act4_m3' }
      ]
    },

    sister: {
      type: 'flag', flag: 'sister_protected_act3'
    },

    darkwraith: {
      type: 'all_of', conditions: [
        { type: 'flag', flag: 'keep_completed' },
        { type: 'flag', flag: 'darkwraith_spared' },
        { type: 'map_completed', mapId: 'act4_m5' }
      ]
    },

    davan_auto: {
      type: 'all_of', conditions: [
        { type: 'flag', flag: 'conclave_opposed_act3' },
        { type: 'flag', flag: 'conclave_cache_destroyed' }
      ]
    },

    eska: {
      type: 'map_completed', mapId: 'act2_side1'
    },

    maren: {
      type: 'map_completed', mapId: 'act4_side1'
    }

  };

  // =========================================================================
  // PUBLIC API
  // =========================================================================

  return {
    // Existing methods
    save,
    load,
    clear,
    applyToState,

    // New methods
    setFlag,
    getFlag,
    recordDeploy,
    completeNode,
    recruitCharacter,
    setCharacterAvailable,
    setCharacterJob,
    unlockJob,
    addXP,
    evaluateCondition,
    getAvailableRoster,

    // Unlock conditions reference
    UNLOCK_CONDITIONS,
  };
})();

// =============================================================================
