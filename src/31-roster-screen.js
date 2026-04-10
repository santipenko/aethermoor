// --- SECTION: Roster Screen ---
const RosterScreen = (() => {

  let _selectedIds = [];
  let _onConfirm = null; // callback(selectedIds)
  let _onBack = null;    // callback()
  let _missionLabel = '';
  let _expandedCardId = null; // id of currently expanded card, null if none

  function show(missionLabel, onConfirm, onBack) {
    _selectedIds = [];
    _expandedCardId = null;
    _onConfirm = onConfirm;
    _onBack = onBack;
    _missionLabel = missionLabel;
    _render();
    document.getElementById('roster-overlay').style.display = 'flex';
  }

  function hide() {
    document.getElementById('roster-overlay').style.display = 'none';
  }

  function _renderJobOptions(ch, card) {
    const jobs = SaveSystem.getAvailableJobsForCharacter(ch.id);
    card.innerHTML = ''; // clear existing content

    // Header row with character name and collapse button
    const header = document.createElement('div');
    header.style.cssText = `
      display:flex;align-items:center;justify-content:space-between;
      padding:10px 14px;
      border-bottom:1px solid rgba(0,229,255,0.15);
      font-family:'Courier New',monospace;
    `;
    header.innerHTML = `
      <div style="font-size:clamp(10px,2.2vw,13px);color:var(--text);font-weight:bold;letter-spacing:0.1em;">
        ${ch.id.charAt(0).toUpperCase() + ch.id.slice(1)} \u2014 Select Job
      </div>
      <div style="font-size:clamp(9px,1.8vw,11px);color:var(--text-dim);cursor:pointer;padding:4px 8px;">\u2715</div>
    `;
    header.querySelector('div:last-child').addEventListener('click', e => {
      e.stopPropagation();
      _expandedCardId = null;
      _render();
    });
    header.querySelector('div:last-child').addEventListener('touchend', e => {
      e.preventDefault();
      e.stopPropagation();
      _expandedCardId = null;
      _render();
    });
    card.appendChild(header);

    // Job options
    if (jobs.length === 0) {
      const empty = document.createElement('div');
      empty.style.cssText = `padding:12px 14px;font-family:'Courier New',monospace;font-size:clamp(9px,1.8vw,11px);color:var(--text-dim);`;
      empty.textContent = 'No jobs available.';
      card.appendChild(empty);
      return;
    }

    jobs.forEach(job => {
      const row = document.createElement('div');
      row.style.cssText = `
        display:flex;align-items:center;justify-content:space-between;
        padding:10px 14px;
        border-bottom:1px solid rgba(0,229,255,0.06);
        cursor:${job.isAvailable ? 'pointer' : 'default'};
        opacity:${job.isAvailable ? '1' : '0.4'};
        background:${job.isCurrent ? 'rgba(0,60,90,0.5)' : 'transparent'};
        font-family:'Courier New',monospace;
      `;

      const lockHint = !job.isAvailable
        ? (job.flagRequired && !SaveSystem.getFlag(job.flagRequired)
            ? '\uD83D\uDD12 Story'
            : `\uD83D\uDD12 Lv${job.levelRequired}`)
        : '';

      row.innerHTML = `
        <div style="font-size:clamp(9px,2vw,12px);color:${job.isAvailable ? 'var(--text)' : 'var(--text-dim)'};letter-spacing:0.08em;">
          ${job.isCurrent ? '\u25CF ' : ''}${job.jobKey}${job.isUnique ? ' \u2605' : ''}
        </div>
        <div style="font-size:clamp(8px,1.6vw,10px);color:${job.isAvailable ? 'var(--accent)' : 'var(--text-dim)'};letter-spacing:0.1em;">
          ${job.isCurrent ? 'ACTIVE' : lockHint}
        </div>
      `;

      if (job.isAvailable && !job.isCurrent) {
        const _switchJob = () => {
          SaveSystem.setCharacterJob(ch.id, job.jobId);
          _expandedCardId = null;
          _render();
        };
        row.addEventListener('click', e => { e.stopPropagation(); _switchJob(); });
        row.addEventListener('touchend', e => { e.preventDefault(); e.stopPropagation(); _switchJob(); });
      }

      card.appendChild(row);
    });
  }

  function _render() {
    document.getElementById('roster-mission-label').textContent = _missionLabel;
    _updateCount();

    const available = SaveSystem.getAvailableRoster();

    const cardList = document.getElementById('roster-card-list');
    cardList.innerHTML = '';

    available.forEach(ch => {
      const baseUnit = BASE_UNITS.find(u => u.id === ch.id);
      const job = ch.currentJob || ch.uniqueJob;
      const level = ch.level || 1;
      const isSelected = _selectedIds.includes(ch.id);
      const isExpanded = _expandedCardId === ch.id;

      const card = document.createElement('div');
      card.id = `roster-card-${ch.id}`;
      card.style.cssText = `
        border:1px solid ${isSelected ? 'var(--accent)' : 'rgba(0,229,255,0.15)'};
        background:${isSelected ? 'rgba(0,60,90,0.7)' : 'rgba(4,9,18,0.7)'};
        font-family:'Courier New',monospace;
        transition:border 0.1s,background 0.1s;
      `;

      if (isExpanded) {
        _renderJobOptions(ch, card);
      } else {
        card.style.cssText += 'cursor:pointer;display:flex;align-items:center;justify-content:space-between;padding:12px 14px;';

        const hp  = baseUnit ? baseUnit.maxHp : '?';
        const mp  = baseUnit ? baseUnit.maxMp : '?';
        const atk = baseUnit ? baseUnit.attack : '?';
        const def = baseUnit ? baseUnit.defense : '?';
        const spd = baseUnit ? baseUnit.speed : '?';

        const JOB_ICONS = {
          'knight':'⚔','vanguard_knight':'⚔','mage':'✦','arcanist':'✦',
          'paladin':'†','thief':'◈','shadowblade':'◈','archer':'◎',
          'dark_knight':'☽','healer':'✚','berserker':'⚡',
          'scout':'◎','vanguard':'⚔','warden':'✦','surveyor':'◎',
          'archivist':'✚','lorekeeper':'✦','artificer':'☽','inquisitor':'⚔',
          'spellblade':'✦','sentinel':'◉','phantom':'◎','warlord':'!',
          'sage':'✦','invoker':'❧','reckoner':'◈',
        };
        const icon = JOB_ICONS[job] || '◈';
        const displayName = ch.id.charAt(0).toUpperCase() + ch.id.slice(1);
        const displayJob = SaveSystem.jobIdToKey ? SaveSystem.jobIdToKey(job) : job.toUpperCase();

        // Main card content area (click to expand)
        const mainArea = document.createElement('div');
        mainArea.style.cssText = 'display:flex;align-items:center;gap:14px;flex:1;min-width:0;';
        mainArea.innerHTML = `
          <div style="
            width:36px;height:36px;
            border-radius:50%;
            background:linear-gradient(135deg,#7bdcfc,#1565c0);
            display:flex;align-items:center;justify-content:center;
            font-size:16px;flex-shrink:0;
            border:2px solid ${isSelected ? 'var(--accent)' : 'rgba(0,229,255,0.3)'};
          ">${icon}</div>
          <div style="min-width:0;">
            <div style="
              font-size:clamp(10px,2.2vw,13px);
              color:var(--text);
              letter-spacing:0.1em;
              font-weight:bold;
            ">${displayName}</div>
            <div style="
              font-size:clamp(8px,1.8vw,10px);
              color:var(--text-dim);
              letter-spacing:0.08em;
              margin-top:2px;
            ">${displayJob.toUpperCase()} \u00B7 LV${level}</div>
          </div>
          <div style="
            font-size:clamp(7px,1.6vw,9px);
            color:var(--text-dim);
            letter-spacing:0.06em;
            text-align:right;
            line-height:1.6;
            margin-left:auto;
            padding-right:8px;
          ">
            HP ${hp} \u00B7 MP ${mp}<br>
            ATK ${atk} \u00B7 DEF ${def} \u00B7 SPD ${spd}
          </div>
        `;

        // Job switch button
        const jobBtn = document.createElement('div');
        jobBtn.style.cssText = `
          font-size:clamp(8px,1.6vw,10px);
          color:var(--text-dim);
          letter-spacing:0.08em;
          cursor:pointer;
          padding:4px 8px;
          border:1px solid rgba(0,229,255,0.15);
          border-radius:2px;
          white-space:nowrap;
          flex-shrink:0;
          margin-left:4px;
        `;
        jobBtn.textContent = '\u25B8 JOB';
        jobBtn.title = 'Switch job';

        // Select button
        const selBtn = document.createElement('div');
        selBtn.style.cssText = `
          margin-left:8px;
          padding:6px 10px;
          min-height:36px;
          border:1px solid ${isSelected ? 'var(--accent)' : 'rgba(0,229,255,0.2)'};
          color:${isSelected ? 'var(--accent)' : 'var(--text-dim)'};
          font-size:clamp(8px,1.6vw,10px);
          letter-spacing:0.1em;
          cursor:pointer;
          display:flex;align-items:center;
          font-family:'Courier New',monospace;
          flex-shrink:0;
          border-radius:2px;
        `;
        selBtn.textContent = isSelected ? '\u25CF SEL' : '\u25CB';

        // Expand on card main area click
        mainArea.addEventListener('click', e => {
          e.stopPropagation();
          _expandedCardId = (_expandedCardId === ch.id) ? null : ch.id;
          _render();
        });
        mainArea.addEventListener('touchend', e => {
          e.preventDefault();
          e.stopPropagation();
          _expandedCardId = (_expandedCardId === ch.id) ? null : ch.id;
          _render();
        });

        // Job button click also expands
        jobBtn.addEventListener('click', e => {
          e.stopPropagation();
          _expandedCardId = (_expandedCardId === ch.id) ? null : ch.id;
          _render();
        });
        jobBtn.addEventListener('touchend', e => {
          e.preventDefault();
          e.stopPropagation();
          _expandedCardId = (_expandedCardId === ch.id) ? null : ch.id;
          _render();
        });

        // Select button toggles selection only
        selBtn.addEventListener('click', e => {
          e.stopPropagation();
          _toggleCharacter(ch.id);
        });
        selBtn.addEventListener('touchend', e => {
          e.preventDefault();
          e.stopPropagation();
          _toggleCharacter(ch.id);
        });

        card.appendChild(mainArea);
        card.appendChild(jobBtn);
        card.appendChild(selBtn);
      }

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
    _updateCount();
    // Re-render only the count and confirm button, not full re-render
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
