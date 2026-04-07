// --- SECTION: Ability System ---
const AbilitySystem = {
  getAbilities(unit){
    const suppressed = unit.statusEffects.some(se => se.name === 'suppressed');
    return (unit.abilities||[])
      .map(id => ABILITIES[id])
      .filter(Boolean)
      .filter(ab => !suppressed || ab.id === 'Attack' || ab.id === 'Wait');
  },
  canUse(unit, abilityId){
    const ab = ABILITIES[abilityId]; if(!ab)return false;
    if(ab.type==='wait')return true;
    return unit.mp >= ab.mpCost;
  },
  getValidTargets(actingUnit, abilityId){
    const ab = ABILITIES[abilityId]; if(!ab||ab.type==='wait')return [];
    // Smoke Bomb: self-cast, no tile targeting needed — return caster tile
    if(ab.type === 'smoke') return [{x:actingUnit.x, y:actingUnit.y}];
    // Rally, Shield Wall, Vanish: self-cast
    if(ab.type === 'rally' || ab.type === 'shield_wall' || (ab.type === 'buff' && ab.id === 'Vanish')) return [{x:actingUnit.x, y:actingUnit.y}];
    const targets = [];
    for(let row=0;row<CONFIG.GRID_ROWS;row++){
      for(let col=0;col<CONFIG.GRID_COLS;col++){
        const dist = Math.max(Math.abs(col-actingUnit.x), Math.abs(row-actingUnit.y));
        const minDist = (ab.targetType === 'ally' || ab.type === 'revive') ? 0 : 1;
        if(dist < minDist || dist > ab.range) continue;
        const tile = GameState.map[row][col];
        if(!tile) continue;
        if(ab.type === 'revive'){
          const fallen = GameState.units.find(u => u.x===col && u.y===row && u.hp===0 && u.team===actingUnit.team);
          if(fallen) targets.push({x:col,y:row});
        } else if(ab.type === 'buff' || ab.type === 'heal' || ab.targetType === 'ally'){
          const u = getUnitAt(col, row);
          if(u && u.team === actingUnit.team) targets.push({x:col,y:row});
        } else if(ab.type === 'root' || ab.type === 'suppress'){
          const u = getUnitAt(col, row);
          if(u && u.team !== actingUnit.team) targets.push({x:col,y:row});
        } else {
          if(ab.aoe){
            if(tile.terrain !== 'obstacle') targets.push({x:col,y:row});
          } else {
            const u = getUnitAt(col, row);
            if(u && u.team !== actingUnit.team) targets.push({x:col,y:row});
          }
        }
      }
    }
    return targets;
  },
  execute(actingUnit, abilityId, targetX, targetY){
    const ab = ABILITIES[abilityId]; if(!ab)return;
    if(ab.type === 'wait'){ TurnSystem.endTurn(); return; }
    if(!this.canUse(actingUnit, abilityId)){
      GameState.floatingTexts.push({x:actingUnit.x,y:actingUnit.y,text:'NO MP!',color:'#6090ff',age:0,maxAge:30});
      Renderer.draw(); return;
    }
    // Ley Pulse — once per battle
    if(abilityId === 'Ley Pulse'){
      const alreadyUsed = actingUnit.statusEffects.find(se => se.name === 'ley_spent');
      if(alreadyUsed){
        GameState.floatingTexts.push({x:actingUnit.x,y:actingUnit.y,text:'SPENT',color:'#6090ff',age:0,maxAge:30});
        Renderer.draw(); return;
      }
      StatusSystem.apply(actingUnit, 'ley_spent', 999);
    }
    actingUnit.mp = Math.max(0, actingUnit.mp - ab.mpCost);
    GameEvents.emit('ability:used', { unit:actingUnit, abilityId, targetX, targetY });
    // --- Smoke Bomb: hits nearby enemies by distance, not tile loop ---
    if(ab.type === 'smoke'){
      const enemies = GameState.units.filter(u => u.team !== actingUnit.team && u.hp > 0);
      for(const enemy of enemies){
        const dist = Math.abs(enemy.x - actingUnit.x) + Math.abs(enemy.y - actingUnit.y);
        if(dist <= 2){
          StatusSystem.apply(enemy, 'slow', 2);
          this._applyPushBack(actingUnit, enemy);
        }
      }
      GameState.unitActed=true; GameState.showActionMenu=false; GameState.actionMenuUnit=null;
      GameState.pendingAbility=null; GameState.validTargetTiles=[]; GameState.selectedUnit=null;
      Renderer.draw();
      setTimeout(()=>TurnSystem.endTurn(), 400);
      return;
    }
    // --- Rally: buff self + adjacent allies ---
    if(ab.type === 'rally'){
      StatusSystem.apply(actingUnit, 'rallied', 2);
      const dirs = [[0,-1],[0,1],[-1,0],[1,0]];
      for(const [dx,dy] of dirs){
        const nx = actingUnit.x+dx, ny = actingUnit.y+dy;
        if(nx<0||ny<0||nx>=CONFIG.GRID_COLS||ny>=CONFIG.GRID_ROWS) continue;
        const ally = getUnitAt(nx, ny);
        if(ally && ally.team === actingUnit.team && ally.id !== actingUnit.id){
          StatusSystem.apply(ally, 'rallied', 2);
        }
      }
      GameState.unitActed=true; GameState.showActionMenu=false; GameState.actionMenuUnit=null;
      GameState.pendingAbility=null; GameState.validTargetTiles=[]; GameState.selectedUnit=null;
      Renderer.draw();
      setTimeout(()=>TurnSystem.endTurn(), 400);
      return;
    }
    // --- Shield Wall: shield self + adjacent allies ---
    if(ab.type === 'shield_wall'){
      StatusSystem.apply(actingUnit, 'shield', 1);
      const dirs = [[0,-1],[0,1],[-1,0],[1,0]];
      for(const [dx,dy] of dirs){
        const nx = actingUnit.x+dx, ny = actingUnit.y+dy;
        if(nx<0||ny<0||nx>=CONFIG.GRID_COLS||ny>=CONFIG.GRID_ROWS) continue;
        const ally = getUnitAt(nx, ny);
        if(ally && ally.team === actingUnit.team && ally.id !== actingUnit.id){
          StatusSystem.apply(ally, 'shield', 1);
        }
      }
      GameState.unitActed=true; GameState.showActionMenu=false; GameState.actionMenuUnit=null;
      GameState.pendingAbility=null; GameState.validTargetTiles=[]; GameState.selectedUnit=null;
      Renderer.draw();
      setTimeout(()=>TurnSystem.endTurn(), 400);
      return;
    }
    let affectedTiles = [{x:targetX,y:targetY}];
    if(ab.aoe && ab.aoeTiles) affectedTiles = ab.aoeTiles(targetX, targetY, actingUnit);
    for(const tile of affectedTiles){
      if(tile.x<0||tile.y<0||tile.x>=CONFIG.GRID_COLS||tile.y>=CONFIG.GRID_ROWS)continue;
      const tu = getUnitAt(tile.x, tile.y);
      if(ab.type === 'damage'){
        if(!tu||tu.id===actingUnit.id)continue;
        if(!ab.aoe && tu.team===actingUnit.team)continue;
        let dmg = CombatMath.calcDamage(actingUnit, tu, ab);
        const shieldEffect = tu.statusEffects.find(se => se.name === 'shield');
        if(shieldEffect){
          dmg = Math.ceil(dmg * 0.5);
          tu.statusEffects = tu.statusEffects.filter(se => se.name !== 'shield');
          GameState.floatingTexts.push({x:tu.x,y:tu.y,text:'SHIELD',color:'#ffe066',age:0,maxAge:30});
        }
        tu.hp = Math.max(0, tu.hp - dmg);
        GameEvents.emit('unit:damaged', { unit:tu, damage:dmg, attackerId:actingUnit.id });
        if(ab.pushBack) this._applyPushBack(actingUnit, tu);
        if(ab.statusEffect && Math.random() < ab.statusChance) StatusSystem.apply(tu, ab.statusEffect, 2);
        if(tu.hp <= 0){
          GameState.map[tu.y][tu.x].occupied = false;
          GameEvents.emit('unit:defeated', { unit:tu, attackerId:actingUnit.id });
        }
      } else if(ab.type === 'heal'){
        if(!tu||tu.team!==actingUnit.team)continue;
        const amt = CombatMath.calcHeal(actingUnit, ab);
        tu.hp = Math.min(tu.maxHp, tu.hp + amt);
        GameEvents.emit('unit:healed', { unit:tu, amount:amt, sourceId:actingUnit.id });
      } else if(ab.type === 'revive'){
        const fallen = GameState.units.find(u => u.x===tile.x && u.y===tile.y && u.hp===0 && u.team===actingUnit.team);
        if(!fallen) continue;
        fallen.hp = Math.floor(fallen.maxHp * 0.25);
        GameState.map[fallen.y][fallen.x].occupied = true;
        GameEvents.emit('unit:healed', { unit:fallen, amount:fallen.hp, sourceId:actingUnit.id });
      } else if(ab.type === 'steal_mp'){
        if(!tu||tu.team===actingUnit.team) continue;
        const drained = Math.min(20, tu.mp);
        tu.mp = Math.max(0, tu.mp - 20);
        actingUnit.mp = Math.min(actingUnit.maxMp, actingUnit.mp + drained);
        const dmg = Math.max(1, ab.power + actingUnit.attack - tu.defense);
        tu.hp = Math.max(0, tu.hp - dmg);
        GameEvents.emit('unit:damaged', { unit:tu, damage:dmg, attackerId:actingUnit.id });
        GameState.floatingTexts.push({x:tu.x,y:tu.y,text:`-${drained}MP`,color:'#6090ff',age:0,maxAge:30});
        if(tu.hp <= 0){
          GameState.map[tu.y][tu.x].occupied = false;
          GameEvents.emit('unit:defeated', { unit:tu, attackerId:actingUnit.id });
        }
      } else if(ab.type === 'piercing'){
        if(!tu||tu.team===actingUnit.team) continue;
        const halfDefTu = Object.assign({}, tu, { defense: Math.floor(tu.defense * 0.5) });
        let dmg = CombatMath.calcDamage(actingUnit, halfDefTu, ab);
        const shieldEffect = tu.statusEffects.find(se => se.name === 'shield');
        if(shieldEffect){
          dmg = Math.ceil(dmg * 0.5);
          tu.statusEffects = tu.statusEffects.filter(se => se.name !== 'shield');
          GameState.floatingTexts.push({x:tu.x,y:tu.y,text:'SHIELD',color:'#ffe066',age:0,maxAge:30});
        }
        tu.hp = Math.max(0, tu.hp - dmg);
        GameEvents.emit('unit:damaged', { unit:tu, damage:dmg, attackerId:actingUnit.id });
        if(tu.hp <= 0){
          GameState.map[tu.y][tu.x].occupied = false;
          GameEvents.emit('unit:defeated', { unit:tu, attackerId:actingUnit.id });
        }
      } else if(ab.type === 'buff'){
        if(!tu) continue;
        // Vanish: self-buff (targetType:'self')
        if(ab.id === 'Vanish'){
          StatusSystem.apply(actingUnit, 'hidden', 1);
        } else {
          // Barrier: buff ally
          if(tu.team !== actingUnit.team) continue;
          if(ab.statusEffect){
            StatusSystem.apply(tu, ab.statusEffect, 1);
          } else {
            StatusSystem.apply(tu, 'shield', 1);
          }
        }
      } else if(ab.type === 'root'){
        if(!tu || tu.team === actingUnit.team) continue;
        StatusSystem.apply(tu, 'rooted', 2);
      } else if(ab.type === 'suppress'){
        if(!tu || tu.team === actingUnit.team) continue;
        StatusSystem.apply(tu, 'suppressed', 2);
      }
    }
    GameState.unitActed=true; GameState.showActionMenu=false; GameState.actionMenuUnit=null;
    GameState.pendingAbility=null; GameState.validTargetTiles=[]; GameState.selectedUnit=null;
    Renderer.draw();
    setTimeout(()=>TurnSystem.endTurn(), 400);
  },
  _applyPushBack(attacker, target){
    const dx=Math.sign(target.x-attacker.x), dy=Math.sign(target.y-attacker.y);
    const nx=target.x+dx, ny=target.y+dy;
    if(nx<0||ny<0||nx>=CONFIG.GRID_COLS||ny>=CONFIG.GRID_ROWS)return;
    const dt=GameState.map[ny][nx];
    if(dt.terrain==='obstacle'||dt.terrain==='water')return;
    if(getUnitAt(nx,ny))return;
    GameState.map[target.y][target.x].occupied=false;
    target.x=nx; target.y=ny;
    GameState.map[ny][nx].occupied=true;
  },
};
