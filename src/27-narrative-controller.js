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
      // Player selected a node
      const node = WORLD_MAP_NODES[nodeId];
      if (!node) return;

      RosterScreen.show(
        node.label,
        (selectedIds) => {
          // Player confirmed roster — record deploy and start battle
          SaveSystem.recordDeploy(nodeId, selectedIds);
          _startBattle(node.mapId, nodeId, selectedIds);
        },
        () => {
          // Player pressed back — return to world map
          _goToWorldMap();
        }
      );
    });
  }

  function _startBattle(mapId, nodeId, deployedCharacterIds) {
    // Load map with optional deploy list
    MapSystem.load(mapId, deployedCharacterIds || null);
    _currentAct = mapId;

    // Reset turn state
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

    // Pre-battle scenes: banter for maps 1–4, new scenes for maps 5–6.
    // Maps 3 and 4 chain banter → pre-battle scene before starting.
    Renderer.draw();
    const _banterIndex = { map_1:0, map_2:1, map_3:2, map_4:3 }[mapId];
    const _preBattleMap = { map_5: StoryScript.PRE_BATTLE_5, map_6: StoryScript.PRE_BATTLE_6 };
    const _preBattle = _preBattleMap[mapId];
    const _startTurn = () => { TurnSystem.start(); Renderer.draw(); };

    if (mapId === 'map_3' || mapId === 'map_4') {
      // Chain: existing banter → new pre-battle scene
      const _banter = StoryScript.PRE_BATTLE_BANTER[_banterIndex];
      const _scene = mapId === 'map_3' ? StoryScript.PRE_BATTLE_3 : StoryScript.PRE_BATTLE_4;
      CutsceneEngine.play(_banter, () => {
        CutsceneEngine.play(_scene, _startTurn);
      });
    } else if (_banterIndex !== undefined && StoryScript.PRE_BATTLE_BANTER[_banterIndex]) {
      // Maps 1 and 2 — banter only
      CutsceneEngine.play(StoryScript.PRE_BATTLE_BANTER[_banterIndex], _startTurn);
    } else if (_preBattle) {
      // Maps 5 and 6 — new pre-battle only
      CutsceneEngine.play(_preBattle, _startTurn);
    } else {
      _startTurn();
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

  function _onMap1Victory() {
    SaveSystem.completeNode('act1_m1', 'main');
    SaveSystem.save();
    _transition(StoryScript.MID);
  }

  function _onMap2Victory() {
    SaveSystem.completeNode('act1_m2', 'main');
    SaveSystem.save();
    _transition(StoryScript.TRANSITION_2_3);
  }

  function _onMap3Victory() {
    SaveSystem.completeNode('act1_m3', 'main');
    SaveSystem.save();
    _transition(StoryScript.TRANSITION_3_4);
  }

  function _onMap4Victory() {
    SaveSystem.completeNode('act1_m4', 'main');
    SaveSystem.save();
    _transition(StoryScript.TRANSITION_4_5);
  }

  function _onMap5Victory() {
    SaveSystem.completeNode('act1_m5', 'main');
    SaveSystem.save();
    _transition(StoryScript.TRANSITION_5_6);
  }

  function _onMap6Victory() {
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

  function _onDefeat() {
    SoundSystem.stopDrone();
    SoundSystem.play('defeat');
    setTimeout(() => {
      document.getElementById('end-overlay').style.display = 'none';
      CutsceneEngine.play(StoryScript.DEFEAT_SCENE, () => {
        // Show the defeat screen after cutscene
        const o = document.getElementById('end-overlay');
        o.querySelector('#end-title').textContent = 'DEFEAT';
        o.querySelector('#end-title').style.color = '#ef5350';
        o.querySelector('#end-message').textContent = 'The ruins claim you.';
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
      };
      const handler = routes[_currentAct];
      if (handler) handler();
    });
    GameEvents.on('battle:loss', () => {
      _onDefeat();
    });
  }

  function begin() {
    SoundSystem.ensureInit();
    SoundSystem.play('click');
    _hideTitleScreen();
    setTimeout(() => {
      // Initialize engine silently (without starting battle)
      const canvas = document.getElementById('game-canvas');
      MapSystem.load('map_1');
      Renderer.init(canvas);
      InputManager.attach(canvas, Renderer.getTileSize());

      _registerBattleEvents();
      // Register core listeners from main engine
      registerCoreListeners();

      // Play intro cutscene then start battle (Act 1 map_1 needs no roster — linear)
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
      // Load any map temporarily to initialize the engine
      MapSystem.load(saveData.mapId || 'map_1');
      Renderer.init(canvas);
      InputManager.attach(canvas, Renderer.getTileSize());

      _registerBattleEvents();
      registerCoreListeners();

      // Route to world map — player picks their next mission
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
      // Horizontal scan line sweep
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
    // Animate title content in
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
