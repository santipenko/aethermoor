// --- SECTION: AI System ---
// (Unchanged from original — do not modify)
// =============================================================================
const AISystem = (() => {

  function _manhattan(ax, ay, bx, by) {
    return Math.abs(ax - bx) + Math.abs(ay - by);
  }

  function _chebyshev(ax, ay, bx, by) {
    return Math.max(Math.abs(ax - bx), Math.abs(ay - by));
  }

  function _selectTarget(unit) {
    const players = GameState.units.filter(u =>
      u.team === 'player' &&
      u.hp > 0 &&
      !u.statusEffects.some(se => se.name === 'hidden') // skip hidden units
    );
    if (!players.length) return null;
    players.sort((a, b) => {
      if (a.hp !== b.hp) return a.hp - b.hp;
      return _manhattan(unit.x, unit.y, a.x, a.y)
           - _manhattan(unit.x, unit.y, b.x, b.y);
    });
    return players[0];
  }

  function _selectAbility(unit, target) {
    const profile = AGGRESSION_PROFILES[unit.job] || {};
    const preferred = profile.abilityPriority || [];
    const rest = (unit.abilities || []).filter(
      id => id !== 'Wait' && id !== 'Attack' && !preferred.includes(id)
    );
    const ordered = [...preferred, ...rest, 'Attack'];

    for (const id of ordered) {
      if (!(unit.abilities || []).includes(id)) continue;
      const ab = ABILITIES[id];
      if (!ab || ab.type === 'wait') continue;
      if (!AbilitySystem.canUse(unit, id)) continue;
      if (!ab.aoe) {
        const dist = _chebyshev(unit.x, unit.y, target.x, target.y);
        if (dist < 1 || dist > ab.range) continue;
      } else {
        const targets = AbilitySystem.getValidTargets(unit, id);
        if (!targets.length) continue;
      }
      return id;
    }
    return null;
  }

  function _bestAoETarget(unit, abilityId, target) {
    const ab = ABILITIES[abilityId];
    if (!ab || !ab.aoe || !ab.aoeTiles) return { x: target.x, y: target.y };

    const candidates = AbilitySystem.getValidTargets(unit, abilityId);
    let bestTile = { x: target.x, y: target.y };
    let bestScore = -Infinity;

    for (const tile of candidates) {
      const splash = ab.aoeTiles(tile.x, tile.y, unit);
      let score = 0;
      for (const st of splash) {
        const u = getUnitAt(st.x, st.y);
        if (!u) continue;
        score += (u.team !== unit.team) ? 2 : -5;
      }
      score += Math.max(0, 3 - _manhattan(tile.x, tile.y, target.x, target.y));
      if (score > bestScore) { bestScore = score; bestTile = tile; }
    }
    return bestTile;
  }

  function _moveToward(unit, targetX, targetY) {
    const reach = MovementSystem.getReachableTiles(unit);
    if (!reach.length) return false;

    let options = reach.filter(t => !(t.x === targetX && t.y === targetY));
    if (!options.length) options = reach;

    options.sort((a, b) =>
      _manhattan(a.x, a.y, targetX, targetY) -
      _manhattan(b.x, b.y, targetX, targetY)
    );
    return _applyMove(unit, options[0]);
  }

  function _moveAwayFrom(unit, fromX, fromY) {
    const reach = MovementSystem.getReachableTiles(unit);
    if (!reach.length) return false;
    reach.sort((a, b) =>
      _manhattan(b.x, b.y, fromX, fromY) -
      _manhattan(a.x, a.y, fromX, fromY)
    );
    return _applyMove(unit, reach[0]);
  }

  function _moveToIdealRange(unit, targetX, targetY, idealRange) {
    const reach = MovementSystem.getReachableTiles(unit);
    if (!reach.length) return false;

    reach.sort((a, b) => {
      const da = Math.abs(_manhattan(a.x, a.y, targetX, targetY) - idealRange);
      const db = Math.abs(_manhattan(b.x, b.y, targetX, targetY) - idealRange);
      return da - db;
    });
    return _applyMove(unit, reach[0]);
  }

  function _applyMove(unit, tile) {
    if (!tile) return false;
    GameState.map[unit.y][unit.x].occupied = false;
    unit.x = tile.x; unit.y = tile.y;
    GameState.map[tile.y][tile.x].occupied = true;
    GameState.unitMoved = true;
    GameEvents.emit('unit:moved', { unit, toX: tile.x, toY: tile.y });
    Renderer.draw();
    return true;
  }

  function _flash(unit, text, color) {
    GameState.floatingTexts.push({ x: unit.x, y: unit.y, text, color, age: 0, maxAge: 30 });
  }

  const AGGRESSION_PROFILES = {
    'Knight':      { abilityPriority: ['Shield Bash', 'Attack'], attackOnlyIfAdjacent: true },
    'Mage':        { abilityPriority: ['Fireball', 'Attack'], retreatIfAdjacent: true },
    'Archer':      { abilityPriority: ['Arrow Shot', 'Attack'], idealRange: 2 },
    'Dark Knight': { abilityPriority: ['Dark Wave', 'Attack'], alwaysChase: true },
    'Healer':      { abilityPriority: ['Revive', 'Mend', 'Attack'], preferHealAllies: true },
    'Thief':       { abilityPriority: ['Steal Mana', 'Smoke Bomb', 'Attack'], targetHighestMp: true },
    'Paladin':     { abilityPriority: ['Barrier', 'Holy Lance', 'Attack'], preferBarrierAllies: true },
    'Berserker':   { abilityPriority: ['Rampage', 'Attack'], alwaysChase: true },
    'Commander':   { abilityPriority: ['Shield Wall', 'Rally', 'Attack'], alwaysChase: false },
    'Arcanist':    { abilityPriority: ['Suppress', 'Fireball', 'Attack'], retreatIfAdjacent: true },
  };

  function _turnKnight(unit, target) {
    const dist = _chebyshev(unit.x, unit.y, target.x, target.y);
    if (dist === 1) { _attackPhase(unit, target, 0); return; }
    _moveToward(unit, target.x, target.y);
    setTimeout(() => {
      const u = getUnit(unit.id); if (!u || u.hp <= 0) { TurnSystem.endTurn(); return; }
      const t = getUnit(target.id);
      const realTarget = (t && t.hp > 0) ? t : _selectTarget(u);
      if (!realTarget) { TurnSystem.endTurn(); return; }
      const newDist = _chebyshev(u.x, u.y, realTarget.x, realTarget.y);
      if (newDist === 1) { _attackPhase(u, realTarget, 0); }
      else { _flash(u, 'GUARD', '#4fc3f7'); Renderer.draw(); setTimeout(() => TurnSystem.endTurn(), 350); }
    }, 480);
  }

  function _turnMage(unit, target) {
    const players = GameState.units.filter(u => u.team === 'player' && u.hp > 0);
    const threat = players.find(p => _chebyshev(unit.x, unit.y, p.x, p.y) === 1);
    if (threat) {
      _moveAwayFrom(unit, threat.x, threat.y);
      setTimeout(() => {
        const u = getUnit(unit.id); if (!u || u.hp <= 0) { TurnSystem.endTurn(); return; }
        const t = getUnit(target.id);
        const realTarget = (t && t.hp > 0) ? t : _selectTarget(u);
        if (!realTarget) { TurnSystem.endTurn(); return; }
        _attackPhase(u, realTarget, 0);
      }, 500);
      return;
    }
    const abilityId = _selectAbility(unit, target);
    if (abilityId) { _attackPhase(unit, target, 0); }
    else {
      _moveToward(unit, target.x, target.y);
      setTimeout(() => {
        const u = getUnit(unit.id); if (!u || u.hp <= 0) { TurnSystem.endTurn(); return; }
        const t = getUnit(target.id);
        const realTarget = (t && t.hp > 0) ? t : _selectTarget(u);
        if (!realTarget) { TurnSystem.endTurn(); return; }
        _attackPhase(u, realTarget, 0);
      }, 480);
    }
  }

  function _turnArcher(unit, target) {
    const profile = AGGRESSION_PROFILES['Archer'];
    const ideal = profile.idealRange;
    const dist = _manhattan(unit.x, unit.y, target.x, target.y);
    const alreadyInRange = !!_selectAbility(unit, target);
    if (dist === ideal && alreadyInRange) { _attackPhase(unit, target, 0); return; }
    _moveToIdealRange(unit, target.x, target.y, ideal);
    setTimeout(() => {
      const u = getUnit(unit.id); if (!u || u.hp <= 0) { TurnSystem.endTurn(); return; }
      const t = getUnit(target.id);
      const realTarget = (t && t.hp > 0) ? t : _selectTarget(u);
      if (!realTarget) { TurnSystem.endTurn(); return; }
      _attackPhase(u, realTarget, 0);
    }, 480);
  }

  function _turnDarkKnight(unit, target) {
    const abilityId = _selectAbility(unit, target);
    if (!abilityId) {
      _moveToward(unit, target.x, target.y);
      setTimeout(() => {
        const u = getUnit(unit.id); if (!u || u.hp <= 0) { TurnSystem.endTurn(); return; }
        const t = getUnit(target.id);
        const realTarget = (t && t.hp > 0) ? t : _selectTarget(u);
        if (!realTarget) { TurnSystem.endTurn(); return; }
        _attackPhase(u, realTarget, 0);
      }, 480);
      return;
    }
    const ab = ABILITIES[abilityId];
    const wantToClose = ab && !ab.aoe && _chebyshev(unit.x, unit.y, target.x, target.y) > 1;
    if (wantToClose) {
      _moveToward(unit, target.x, target.y);
      setTimeout(() => {
        const u = getUnit(unit.id); if (!u || u.hp <= 0) { TurnSystem.endTurn(); return; }
        const t = getUnit(target.id);
        const realTarget = (t && t.hp > 0) ? t : _selectTarget(u);
        if (!realTarget) { TurnSystem.endTurn(); return; }
        _attackPhase(u, realTarget, 0);
      }, 480);
    } else { _attackPhase(unit, target, 0); }
  }

  function _turnDefault(unit, target) {
    const abilityId = _selectAbility(unit, target);
    if (abilityId) { _attackPhase(unit, target, 0); }
    else {
      _moveToward(unit, target.x, target.y);
      setTimeout(() => {
        const u = getUnit(unit.id); if (!u || u.hp <= 0) { TurnSystem.endTurn(); return; }
        const t = getUnit(target.id);
        const realTarget = (t && t.hp > 0) ? t : _selectTarget(u);
        if (!realTarget) { TurnSystem.endTurn(); return; }
        _attackPhase(u, realTarget, 0);
      }, 480);
    }
  }

  function _attackPhase(unit, target, extraDelay) {
    setTimeout(() => {
      const u = getUnit(unit.id);
      if (!u || u.hp <= 0) { TurnSystem.endTurn(); return; }
      const t = getUnit(target.id);
      const realTarget = (t && t.hp > 0) ? t : _selectTarget(u);
      if (!realTarget) { TurnSystem.endTurn(); return; }
      const abilityId = _selectAbility(u, realTarget);
      if (!abilityId) {
        _flash(u, 'WAIT', '#607080');
        Renderer.draw();
        setTimeout(() => TurnSystem.endTurn(), 300);
        return;
      }
      const ab = ABILITIES[abilityId];
      let tx = realTarget.x, ty = realTarget.y;
      if (ab && ab.aoe && ab.aoeTiles) {
        const best = _bestAoETarget(u, abilityId, realTarget);
        tx = best.x; ty = best.y;
      }
      console.log(`%c[AI:${u.job}] ${u.name} → ${abilityId} @ (${tx},${ty})`,'color:#ef9a9a;font-style:italic');
      AbilitySystem.execute(u, abilityId, tx, ty);
    }, 350 + extraDelay);
  }

  function _turnBerserker(unit, target) {
    const enemies = GameState.units.filter(u => u.team !== unit.team && u.hp > 0);
    const adjacent = enemies.filter(e => _chebyshev(unit.x, unit.y, e.x, e.y) === 1);
    if (adjacent.length > 0) {
      _attackPhase(unit, adjacent[0], 0);
    } else {
      _moveToward(unit, target.x, target.y);
      setTimeout(() => {
        const u = getUnit(unit.id); if (!u || u.hp <= 0) { TurnSystem.endTurn(); return; }
        const t = getUnit(target.id);
        const realTarget = (t && t.hp > 0) ? t : _selectTarget(u);
        if (!realTarget) { TurnSystem.endTurn(); return; }
        _attackPhase(u, realTarget, 0);
      }, 480);
    }
  }

  function _turnHealer(unit, target) {
    const allies = GameState.units.filter(u => u.team === unit.team && u.hp > 0 && u.id !== unit.id);
    const wounded = allies.filter(a => a.hp < a.maxHp * 0.6)
      .sort((a, b) => (a.hp / a.maxHp) - (b.hp / b.maxHp));
    const fallen = GameState.units.filter(u => u.team === unit.team && u.hp === 0);
    for (const f of fallen) {
      if (_chebyshev(unit.x, unit.y, f.x, f.y) <= 1 && AbilitySystem.canUse(unit, 'Revive')) {
        setTimeout(() => AbilitySystem.execute(unit, 'Revive', f.x, f.y), 350);
        return;
      }
    }
    for (const w of wounded) {
      if (_chebyshev(unit.x, unit.y, w.x, w.y) <= 2 && AbilitySystem.canUse(unit, 'Mend')) {
        setTimeout(() => AbilitySystem.execute(unit, 'Mend', w.x, w.y), 350);
        return;
      }
    }
    if (wounded.length > 0) {
      const moveTarget = wounded[0];
      const dist = _chebyshev(unit.x, unit.y, moveTarget.x, moveTarget.y);
      if (dist > 2) {
        _moveToward(unit, moveTarget.x, moveTarget.y);
        setTimeout(() => {
          const u = getUnit(unit.id); if (!u || u.hp <= 0) { TurnSystem.endTurn(); return; }
          const stillWounded = GameState.units.filter(a => a.team === u.team && a.hp > 0 && a.id !== u.id && a.hp < a.maxHp * 0.6)
            .sort((a, b) => (a.hp / a.maxHp) - (b.hp / b.maxHp));
          if (stillWounded.length > 0 && _chebyshev(u.x, u.y, stillWounded[0].x, stillWounded[0].y) <= 2 && AbilitySystem.canUse(u, 'Mend')) {
            setTimeout(() => AbilitySystem.execute(u, 'Mend', stillWounded[0].x, stillWounded[0].y), 200);
          } else {
            setTimeout(() => TurnSystem.endTurn(), 300);
          }
        }, 480);
        return;
      }
    }
    const abilityId = _selectAbility(unit, target);
    if (abilityId && abilityId !== 'Mend' && abilityId !== 'Revive') {
      _attackPhase(unit, target, 0);
    } else {
      setTimeout(() => TurnSystem.endTurn(), 300);
    }
  }

  function doTurn(unit) {
    if (GameState.phase !== 'battle') return;
    const u = getUnit(unit.id);
    if (!u || u.hp <= 0) { TurnSystem.endTurn(); return; }
    const target = _selectTarget(u);
    if (!target) { TurnSystem.endTurn(); return; }
    console.log(`%c[AI:${u.job}] ${u.name} activates — targeting ${target.name} (HP ${target.hp})`,'color:#ef9a9a;font-weight:bold');
    GameState.selectedUnit = u.id;
    Renderer.draw();
    switch (u.job) {
      case 'Knight':      _turnKnight(u, target);     break;
      case 'Mage':        _turnMage(u, target);        break;
      case 'Archer':      _turnArcher(u, target);      break;
      case 'Dark Knight': _turnDarkKnight(u, target);  break;
      case 'Berserker':   _turnBerserker(u, target);   break;
      case 'Healer':      _turnHealer(u, target);      break;
      case 'Commander':   _turnDefault(u, target);     break;
      case 'Arcanist':    _turnMage(u, target);        break;
      default:            _turnDefault(u, target);      break;
    }
  }

  return { doTurn, _selectTarget, _selectAbility, AGGRESSION_PROFILES };
})();
