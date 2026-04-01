// --- SECTION: Save System ---
// localStorage-backed save with unit state, map, and round number.
// =============================================================================
const SaveSystem = (() => {
  const KEY = 'aethermoor_save_v1';

  function save() {
    const data = {
      mapId: GameState.currentMapId,
      turnNumber: GameState.turnNumber,
      units: GameState.units.map(u => ({
        id: u.id, hp: u.hp, mp: u.mp,
      })),
      timestamp: Date.now(),
    };
    try {
      localStorage.setItem(KEY, JSON.stringify(data));
      _showToast();
      console.log('[SaveSystem] Saved:', data);
    } catch(e) { console.warn('[SaveSystem] Save failed:', e); }
  }

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch(e) { return null; }
  }

  function clear() {
    localStorage.removeItem(KEY);
  }

  function applyToState(saveData) {
    if (!saveData) return;
    // Restore HP/MP
    for (const saved of saveData.units) {
      const u = GameState.units.find(x => x.id === saved.id);
      if (u) { u.hp = saved.hp; u.mp = saved.mp; }
    }
    GameState.turnNumber = saveData.turnNumber || 0;
  }

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

  return { save, load, clear, applyToState };
})();

// =============================================================================
