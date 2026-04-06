// --- SECTION: World Map Screen ---
const WorldMapScreen = (() => {

  let _onNodeSelected = null; // callback(nodeId)

  function show(onNodeSelected) {
    _onNodeSelected = onNodeSelected;
    _render();
    document.getElementById('world-map-overlay').style.display = 'flex';
  }

  function hide() {
    document.getElementById('world-map-overlay').style.display = 'none';
  }

  function _render() {
    const saveData = SaveSystem.load();
    const nodes = Object.values(WORLD_MAP_NODES);

    // Group by act
    const acts = {};
    nodes.forEach(node => {
      if (!acts[node.act]) acts[node.act] = [];
      acts[node.act].push(node);
    });

    // Determine highest act with any available node
    const availableActs = Object.keys(acts).filter(act =>
      acts[act].some(n => _isAvailable(n, saveData))
    );
    const currentAct = availableActs.length > 0
      ? Math.max(...availableActs.map(Number))
      : 1;

    document.getElementById('wm-act-label').textContent = `Act ${currentAct}`;

    const list = document.getElementById('wm-node-list');
    list.innerHTML = '';

    // Show nodes for current act only
    const actNodes = acts[currentAct] || [];
    actNodes.forEach(node => {
      const completed = _isCompleted(node, saveData);
      const available = _isAvailable(node, saveData);
      const locked = !completed && !available;

      const el = document.createElement('div');
      el.style.cssText = `
        display:flex;align-items:center;justify-content:space-between;
        padding:14px 16px;
        border:1px solid ${completed ? 'rgba(0,229,255,0.2)' : available ? 'rgba(0,229,255,0.4)' : 'rgba(255,255,255,0.06)'};
        background:${available ? 'rgba(0,45,65,0.6)' : 'rgba(4,9,18,0.6)'};
        cursor:${available ? 'pointer' : 'default'};
        opacity:${locked ? '0.4' : '1'};
        font-family:'Courier New',monospace;
      `;

      const typeLabel = node.type === 'side' ? ' [SIDE]' : node.type === 'secret' ? ' [SECRET]' : '';
      const statusLabel = completed ? '✓ COMPLETE' : locked ? '✗ LOCKED' : '► AVAILABLE';
      const statusColor = completed ? 'var(--text-dim)' : locked ? 'var(--text-dim)' : 'var(--accent)';

      el.innerHTML = `
        <div>
          <div style="
            font-size:clamp(10px,2.2vw,13px);
            color:${completed ? 'var(--text-dim)' : 'var(--text)'};
            letter-spacing:0.1em;
          ">${node.label}${typeLabel}</div>
        </div>
        <div style="
          font-size:clamp(8px,1.8vw,10px);
          color:${statusColor};
          letter-spacing:0.15em;
          white-space:nowrap;
          margin-left:12px;
        ">${statusLabel}</div>
      `;

      if (available) {
        el.addEventListener('click', () => {
          hide();
          if (_onNodeSelected) _onNodeSelected(node.id);
        });
        el.addEventListener('touchend', e => {
          e.preventDefault();
          hide();
          if (_onNodeSelected) _onNodeSelected(node.id);
        });
      }

      list.appendChild(el);
    });

    document.getElementById('wm-status').textContent =
      'Select a mission to continue.';
  }

  function _isCompleted(node, saveData) {
    return !!(saveData && saveData.worldMap && saveData.worldMap[node.id] && saveData.worldMap[node.id].completed);
  }

  function _isAvailable(node, saveData) {
    if (_isCompleted(node, saveData)) return false;
    if (!node.unlockCondition) return true;
    return SaveSystem.evaluateCondition(node.unlockCondition);
  }

  return { show, hide };

})();
