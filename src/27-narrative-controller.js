// --- SECTION: Narrative Controller ---
// Orchestrates the full game flow: title → cutscene → battle → cutscene → ...
// =============================================================================
const NarrativeController = (() => {
  let _currentAct = 'map_1'; // tracks the active mapId during battle

  function _hideTitleScreen() {
    const ts = document.getElementById('title-screen');
    if (!ts) return;
    ts.style.transition = 'opacity 0.5s';
    ts.style.opacity = '0';
    setTimeout(() => { ts.style.display = 'none'; }, 520);
  }

  // ── Route player to the world map, then roster, then battle ──────────────
  function _goToWorldMap() {
    WorldMapScreen.show((nodeId) => {
      const node = WORLD_MAP_NODES[nodeId];
      if (!node) return;

      RosterScreen.show(
        node.label,
        (selectedIds) => {
          SaveSystem.recordDeploy(nodeId, selectedIds);
          _startBattle(node.mapId, nodeId, selectedIds);
        },
        () => {
          _goToWorldMap();
        }
      );
    });
  }

  // ── XP award system ───────────────────────────────────────────────────────
  const XP_RATES = {
    main:   50,
    side:   35,
    secret: 45,
  };
  const XP_PER_ENEMY = 10;

  function _awardXP(nodeId) {
    const node = WORLD_MAP_NODES[nodeId];
    if (!node) return;

    const missionXP = XP_RATES[node.type] || 50;
    const enemiesDefeated = GameState.units.filter(u => u.team === 'enemy' && u.hp <= 0).length;
    const bonusXP = enemiesDefeated * XP_PER_ENEMY;
    const totalXP = missionXP + bonusXP;

    // Award to all deployed player characters
    const deployedIds = GameState.units
      .filter(u => u.team === 'player')
      .map(u => u.id);

    const levelUps = [];
    for (const charId of deployedIds) {
      const beforeData = SaveSystem.load();
      const beforeLevel = beforeData && beforeData.roster[charId] ? beforeData.roster[charId].level : 1;
      SaveSystem.addXP(charId, totalXP);
      const afterData = SaveSystem.load();
      const afterLevel = afterData && afterData.roster[charId] ? afterData.roster[charId].level : 1;
      if (afterLevel > beforeLevel) {
        levelUps.push({ charId, newLevel: afterLevel });
      }
    }

    // Show level-up floating texts
    for (const { charId, newLevel } of levelUps) {
      const unit = GameState.units.find(u => u.id === charId);
      if (unit) {
        GameState.floatingTexts.push({
          x: unit.x, y: unit.y,
          text: `LV${newLevel}!`,
          color: '#ffd740',
          age: 0, maxAge: 60
        });
      }
    }

    if (levelUps.length > 0) Renderer.draw();

    console.log(`[XP] Awarded ${totalXP} XP to ${deployedIds.length} characters. Level-ups: ${levelUps.length}`);
  }

  function _startBattle(mapId, nodeId, deployedCharacterIds) {
    MapSystem.load(mapId, deployedCharacterIds || null);
    _currentAct = mapId;

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
    GameState.turnNumber = 0;
    GameState.phase = 'battle';

    const canvas = document.getElementById('game-canvas');
    const ts = Renderer.init(canvas);
    InputManager.setCanvas(canvas, ts);

    WaterAnim.check();
    SoundSystem.startDrone();
    SoundSystem.play('battleStart');

    Renderer.draw();

    // Check for act intro cutscene (plays once on first visit)
    const actIntros = {
      'act2_m1': { flag: 'act2_intro_played', scenes: StoryScript.ACT2_OPEN },
    };
    const intro = actIntros[mapId];

    const _runBattleScenes = () => {
      const _startTurn = () => { TurnSystem.start(); Renderer.draw(); };
      const _banterIndex = { map_1:0, map_2:1, map_3:2, map_4:3 }[mapId];
      const _preBattleMap = {
        map_5: StoryScript.PRE_BATTLE_5,
        map_6: StoryScript.PRE_BATTLE_6,
        act2_side1: StoryScript.ACT2_SIDE1_PRE,
      };

      if(mapId === 'map_3' || mapId === 'map_4'){
        const _banter = StoryScript.PRE_BATTLE_BANTER[_banterIndex];
        const _scene = mapId === 'map_3' ? StoryScript.PRE_BATTLE_3 : StoryScript.PRE_BATTLE_4;
        CutsceneEngine.play(_banter, () => { CutsceneEngine.play(_scene, _startTurn); });
      } else if(_banterIndex !== undefined && StoryScript.PRE_BATTLE_BANTER[_banterIndex]){
        CutsceneEngine.play(StoryScript.PRE_BATTLE_BANTER[_banterIndex], _startTurn);
      } else if(_preBattleMap[mapId]){
        CutsceneEngine.play(_preBattleMap[mapId], _startTurn);
      } else {
        _startTurn();
      }
    };

    if(intro && !SaveSystem.getFlag(intro.flag)){
      SaveSystem.setFlag(intro.flag);
      CutsceneEngine.play(intro.scenes, _runBattleScenes);
    } else {
      _runBattleScenes();
    }

    // Update map button
    const btn = document.getElementById('map-select-btn');
    if (btn && MAP_DEFINITIONS[mapId]) {
      btn.textContent = `${MAP_DEFINITIONS[mapId].label.split(' ')[0].toUpperCase()} ▸`;
    }

    // Ensure resize handler is registered once
    if (!window._resizeHandlerSet) {
      window._resizeHandlerSet = true;
      window.addEventListener('resize', () => {
        const c = document.getElementById('game-canvas');
        const ns = Renderer.init(c);
        InputManager.setCanvas(c, ns);
        WaterAnim.check();
        Renderer.draw();
      });
    }

    console.log(`%c[NarrativeController] Battle started: ${mapId}`, 'color:#00e5ff;font-weight:bold');
  }

  // ── Shared helper: stop drone, play victory, hide overlay, then cutscene → world map ──
  function _transition(cutsceneScenes) {
    SoundSystem.stopDrone();
    SoundSystem.play('victory');
    setTimeout(() => {
      document.getElementById('end-overlay').style.display = 'none';
      CutsceneEngine.play(cutsceneScenes, () => {
        _goToWorldMap();
      });
    }, 1800);
  }

  // ── Act 1 victory handlers ─────────────────────────────────────────────────
  function _onMap1Victory() {
    _awardXP('act1_m1');
    SaveSystem.completeNode('act1_m1', 'main');
    SaveSystem.save();
    _transition(StoryScript.MID);
  }

  function _onMap2Victory() {
    _awardXP('act1_m2');
    SaveSystem.completeNode('act1_m2', 'main');
    SaveSystem.save();
    _transition(StoryScript.TRANSITION_2_3);
  }

  function _onMap3Victory() {
    _awardXP('act1_m3');
    SaveSystem.completeNode('act1_m3', 'main');
    SaveSystem.save();
    _transition(StoryScript.TRANSITION_3_4);
  }

  function _onMap4Victory() {
    _awardXP('act1_m4');
    SaveSystem.completeNode('act1_m4', 'main');
    SaveSystem.save();
    _transition(StoryScript.TRANSITION_4_5);
  }

  function _onMap5Victory() {
    _awardXP('act1_m5');
    SaveSystem.completeNode('act1_m5', 'main');
    SaveSystem.save();
    _transition(StoryScript.TRANSITION_5_6);
  }

  function _onMap6Victory() {
    _awardXP('act1_m6');
    SaveSystem.completeNode('act1_m6', 'main');
    SoundSystem.stopDrone();
    SoundSystem.play('victory');
    setTimeout(() => {
      document.getElementById('end-overlay').style.display = 'none';
      CutsceneEngine.play(StoryScript.OUTRO, () => {
        const o = document.getElementById('end-overlay');
        o.querySelector('#end-title').textContent = 'THE END';
        o.querySelector('#end-title').style.color = 'var(--gold)';
        o.querySelector('#end-message').textContent = 'Chronicle I — Aethermoor complete.';
        o.style.display = 'flex';
        SaveSystem.clear();
      });
    }, 1800);
  }

  // ── Act 2 victory handlers ─────────────────────────────────────────────────
  function _onAct2M1Victory() {
    _awardXP('act2_m1');
    SaveSystem.completeNode('act2_m1', 'main');
    SaveSystem.recruitCharacter('rynn');
    SaveSystem.setFlag('heard_of_ley_scar');
    SaveSystem.save();
    SoundSystem.stopDrone();
    SoundSystem.play('victory');
    setTimeout(() => {
      document.getElementById('end-overlay').style.display = 'none';
      CutsceneEngine.play(StoryScript.RYNN_JOIN, () => {
        _goToWorldMap();
      });
    }, 1800);
  }

  function _onAct2M2Victory() {
    _awardXP('act2_m2');
    SaveSystem.completeNode('act2_m2', 'main');
    SaveSystem.save();
    _transition(StoryScript.ACT2_TRANSITION_2_3);
  }

  function _onAct2M3Victory() {
    _awardXP('act2_m3');
    SaveSystem.completeNode('act2_m3', 'main');
    SaveSystem.save();
    _transition(StoryScript.ACT2_TRANSITION_3_4);
  }

  function _onAct2Side1Victory() {
    _awardXP('act2_side1');
    SaveSystem.completeNode('act2_side1', 'side');
    SaveSystem.recruitCharacter('eska');
    SaveSystem.save();
    SoundSystem.stopDrone();
    SoundSystem.play('victory');
    setTimeout(() => {
      document.getElementById('end-overlay').style.display = 'none';
      CutsceneEngine.play(StoryScript.ESKA_JOIN, () => {
        _goToWorldMap();
      });
    }, 1800);
  }

  function _onAct2M4Victory() {
    _awardXP('act2_m4');
    SaveSystem.completeNode('act2_m4', 'main');
    SaveSystem.save();
    _transition(StoryScript.ACT2_TRANSITION_4_5);
  }

  function _onAct2M5Victory() {
    _awardXP('act2_m5');
    SaveSystem.completeNode('act2_m5', 'main');
    SaveSystem.save();
    SoundSystem.stopDrone();
    SoundSystem.play('victory');
    setTimeout(() => {
      document.getElementById('end-overlay').style.display = 'none';
      CutsceneEngine.play(StoryScript.ACT2_OUTRO, () => {
        const o = document.getElementById('end-overlay');
        o.querySelector('#end-title').textContent = 'ACT II COMPLETE';
        o.querySelector('#end-title').style.color = 'var(--gold)';
        o.querySelector('#end-message').textContent = 'Flight — The hunt continues.';
        o.style.display = 'flex';
      });
    }, 1800);
  }

  // ── Defeat handlers ────────────────────────────────────────────────────────
  function _onDefeat() {
    SoundSystem.stopDrone();
    SoundSystem.play('defeat');
    setTimeout(() => {
      document.getElementById('end-overlay').style.display = 'none';
      CutsceneEngine.play(StoryScript.DEFEAT_SCENE, () => {
        const o = document.getElementById('end-overlay');
        o.querySelector('#end-title').textContent = 'DEFEAT';
        o.querySelector('#end-title').style.color = '#ef5350';
        o.querySelector('#end-message').textContent = 'The ruins claim you.';
        o.style.display = 'flex';
      });
    }, 800);
  }

  function _onAct2Defeat() {
    SoundSystem.stopDrone();
    SoundSystem.play('defeat');
    setTimeout(() => {
      document.getElementById('end-overlay').style.display = 'none';
      CutsceneEngine.play(StoryScript.ACT2_DEFEAT, () => {
        const o = document.getElementById('end-overlay');
        o.querySelector('#end-title').textContent = 'DEFEAT';
        o.querySelector('#end-title').style.color = '#ef5350';
        o.querySelector('#end-message').textContent = 'The hunt catches up with you.';
        o.style.display = 'flex';
      });
    }, 800);
  }

  let _battleEventsRegistered = false;
  function _registerBattleEvents() {
    if (_battleEventsRegistered) return;
    _battleEventsRegistered = true;
    GameEvents.on('battle:win', () => {
      const routes = {
        map_1: _onMap1Victory,
        map_2: _onMap2Victory,
        map_3: _onMap3Victory,
        map_4: _onMap4Victory,
        map_5: _onMap5Victory,
        map_6: _onMap6Victory,
        act2_m1: _onAct2M1Victory,
        act2_m2: _onAct2M2Victory,
        act2_m3: _onAct2M3Victory,
        act2_side1: _onAct2Side1Victory,
        act2_m4: _onAct2M4Victory,
        act2_m5: _onAct2M5Victory,
      };
      const handler = routes[_currentAct];
      if (handler) handler();
    });
    GameEvents.on('battle:loss', () => {
      const act2Maps = ['act2_m1','act2_m2','act2_m3','act2_side1','act2_m4','act2_m5'];
      if(act2Maps.includes(_currentAct)){
        _onAct2Defeat();
      } else {
        _onDefeat();
      }
    });
  }

  function begin() {
    SoundSystem.ensureInit();
    SoundSystem.play('click');
    _hideTitleScreen();
    setTimeout(() => {
      const canvas = document.getElementById('game-canvas');
      MapSystem.load('map_1');
      Renderer.init(canvas);
      InputManager.attach(canvas, Renderer.getTileSize());

      _registerBattleEvents();
      registerCoreListeners();

      CutsceneEngine.play(StoryScript.INTRO, () => {
        _startBattle('map_1', 'act1_m1', null);
      });
    }, 600);
  }

  function continueGame() {
    SoundSystem.ensureInit();
    SoundSystem.play('click');
    const saveData = SaveSystem.load();
    if (!saveData) { begin(); return; }

    _hideTitleScreen();
    setTimeout(() => {
      const canvas = document.getElementById('game-canvas');
      MapSystem.load(saveData.mapId || 'map_1');
      Renderer.init(canvas);
      InputManager.attach(canvas, Renderer.getTileSize());

      _registerBattleEvents();
      registerCoreListeners();

      _goToWorldMap();
    }, 600);
  }

  function initTitleScreen() {
    const saveData = SaveSystem.load();
    if (saveData) {
      const btn = document.getElementById('btn-continue');
      const info = document.getElementById('title-save-info');
      if (btn) btn.style.display = 'block';
      if (info) {
        const mapLabel = MAP_DEFINITIONS[saveData.mapId] ? MAP_DEFINITIONS[saveData.mapId].label : saveData.mapId;
        const date = new Date(saveData.timestamp).toLocaleDateString();
        info.style.display = 'block';
        info.textContent = `Save: ${mapLabel} · ${date}`;
      }
    }
    _initTitleStars();
    _initTitleAnimation();
  }

  function _initTitleStars() {
    const c = document.getElementById('title-stars');
    if (!c) return;
    c.width = window.innerWidth; c.height = window.innerHeight;
    const ctx = c.getContext('2d');
    const stars = Array.from({length: 120}, () => ({
      x: Math.random(), y: Math.random(),
      r: Math.random() * 1.5 + 0.3,
      a: Math.random(),
      speed: Math.random() * 0.003 + 0.001,
    }));
    function draw() {
      ctx.clearRect(0, 0, c.width, c.height);
      stars.forEach(s => {
        s.a = 0.2 + 0.6 * Math.abs(Math.sin(Date.now() * s.speed));
        ctx.beginPath();
        ctx.arc(s.x * c.width, s.y * c.height, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(180,220,255,${s.a.toFixed(2)})`;
        ctx.fill();
      });
      const sweep = (Date.now() / 3000) % 1;
      const sg = ctx.createLinearGradient(0, sweep * c.height - 40, 0, sweep * c.height + 40);
      sg.addColorStop(0, 'rgba(0,229,255,0)');
      sg.addColorStop(0.5, 'rgba(0,229,255,0.04)');
      sg.addColorStop(1, 'rgba(0,229,255,0)');
      ctx.fillStyle = sg;
      ctx.fillRect(0, sweep * c.height - 40, c.width, 80);

      if (document.getElementById('title-screen').style.display !== 'none') {
        requestAnimationFrame(draw);
      }
    }
    draw();
    window.addEventListener('resize', () => {
      c.width = window.innerWidth; c.height = window.innerHeight;
    });
  }

  function _initTitleAnimation() {
    const content = document.getElementById('title-content');
    if (content) {
      content.style.opacity = '0';
      content.style.transform = 'translateY(20px)';
      setTimeout(() => {
        content.style.transition = 'opacity 1s ease, transform 1s ease';
        content.style.opacity = '1';
        content.style.transform = 'none';
      }, 300);
    }
  }

  return { begin, continueGame, initTitleScreen };
})();

// =============================================================================
