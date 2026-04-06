// --- SECTION: Roster Screen ---
const RosterScreen = (() => {

  let _selectedIds = [];
  let _onConfirm = null; // callback(selectedIds)
  let _onBack = null;    // callback()
  let _missionLabel = '';

  function show(missionLabel, onConfirm, onBack) {
    _selectedIds = [];
    _onConfirm = onConfirm;
    _onBack = onBack;
    _missionLabel = missionLabel;
    _render();
    document.getElementById('roster-overlay').style.display = 'flex';
  }

  function hide() {
    document.getElementById('roster-overlay').style.display = 'none';
  }

  function _render() {
    document.getElementById('roster-mission-label').textContent = _missionLabel;
    _updateCount();

    const available = SaveSystem.getAvailableRoster();

    const cardList = document.getElementById('roster-card-list');
    cardList.innerHTML = '';

    available.forEach(ch => {
      // Find base unit for stats display
      const baseUnit = BASE_UNITS.find(u => u.id === ch.id);
      const job = ch.currentJob || ch.uniqueJob;
      const level = ch.level || 1;

      const isSelected = _selectedIds.includes(ch.id);

      const card = document.createElement('div');
      card.id = `roster-card-${ch.id}`;
      card.style.cssText = `
        display:flex;align-items:center;justify-content:space-between;
        padding:12px 14px;
        border:1px solid ${isSelected ? 'var(--accent)' : 'rgba(0,229,255,0.15)'};
        background:${isSelected ? 'rgba(0,60,90,0.7)' : 'rgba(4,9,18,0.7)'};
        cursor:pointer;
        font-family:'Courier New',monospace;
        transition:border 0.1s,background 0.1s;
      `;

      const hp  = baseUnit ? baseUnit.maxHp : '?';
      const mp  = baseUnit ? baseUnit.maxMp : '?';
      const atk = baseUnit ? baseUnit.attack : '?';
      const def = baseUnit ? baseUnit.defense : '?';
      const spd = baseUnit ? baseUnit.speed : '?';

      // Job icon lookup — mirrors ICON_CHARS in renderer
      const JOB_ICONS = {
        'knight':'⚔','vanguard_knight':'⚔','mage':'✦','arcanist':'✦',
        'paladin':'†','thief':'◈','shadowblade':'◈','archer':'◎',
        'dark_knight':'☽','healer':'✚','berserker':'⚡',
        'scout':'◎','vanguard':'⚔','warden':'✦','surveyor':'◎',
        'archivist':'✚','lorekeeper':'✦','artificer':'☽','inquisitor':'⚔',
      };
      const icon = JOB_ICONS[job] || '◈';

      card.innerHTML = `
        <div style="display:flex;align-items:center;gap:14px;">
          <div style="
            width:36px;height:36px;
            border-radius:50%;
            background:linear-gradient(135deg,#7bdcfc,#1565c0);
            display:flex;align-items:center;justify-content:center;
            font-size:16px;flex-shrink:0;
            border:2px solid ${isSelected ? 'var(--accent)' : 'rgba(0,229,255,0.3)'};
          ">${icon}</div>
          <div>
            <div style="
              font-size:clamp(10px,2.2vw,13px);
              color:var(--text);
              letter-spacing:0.1em;
              font-weight:bold;
            ">${ch.id.charAt(0).toUpperCase() + ch.id.slice(1)}</div>
            <div style="
              font-size:clamp(8px,1.8vw,10px);
              color:var(--text-dim);
              letter-spacing:0.08em;
              margin-top:2px;
            ">${job.toUpperCase()} · LV${level}</div>
          </div>
        </div>
        <div style="
          font-size:clamp(7px,1.6vw,9px);
          color:var(--text-dim);
          letter-spacing:0.06em;
          text-align:right;
          line-height:1.6;
        ">
          HP ${hp} · MP ${mp}<br>
          ATK ${atk} · DEF ${def} · SPD ${spd}
        </div>
        <div style="
          margin-left:12px;
          font-size:clamp(9px,1.8vw,11px);
          color:${isSelected ? 'var(--accent)' : 'var(--text-dim)'};
          letter-spacing:0.1em;
          flex-shrink:0;
        ">${isSelected ? '● SEL' : '○'}</div>
      `;

      card.addEventListener('click', () => _toggleCharacter(ch.id));
      card.addEventListener('touchend', e => { e.preventDefault(); _toggleCharacter(ch.id); });

      cardList.appendChild(card);
    });
  }

  function _toggleCharacter(characterId) {
    if (_selectedIds.includes(characterId)) {
      _selectedIds = _selectedIds.filter(id => id !== characterId);
    } else {
      if (_selectedIds.length >= 5) return; // cap at 5
      _selectedIds.push(characterId);
    }
    _render();
  }

  function _updateCount() {
    const count = _selectedIds.length;
    const countEl = document.getElementById('roster-count');
    if (countEl) countEl.textContent = `${count} / 5 selected`;
    const confirmBtn = document.getElementById('roster-confirm-btn');
    if (confirmBtn) {
      confirmBtn.style.display = count > 0 ? 'block' : 'none';
    }
  }

  function confirm() {
    if (_selectedIds.length === 0) return;
    hide();
    if (_onConfirm) _onConfirm([..._selectedIds]);
  }

  function back() {
    hide();
    if (_onBack) _onBack();
  }

  return { show, hide, confirm, back };

})();
