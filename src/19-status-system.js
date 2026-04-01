// --- SECTION: Status System ---
const StatusSystem = {
  apply(unit, effectName, turns){
    unit.statusEffects = unit.statusEffects.filter(se => se.name !== effectName);
    unit.statusEffects.push({ name:effectName, turnsLeft:turns });
    GameEvents.emit('unit:statusApplied', { unit, effect:effectName });
    Renderer.draw();
  },
  tick(unit){
    const expired = [];
    for(const se of unit.statusEffects){
      if(se.name === 'poison'){
        const dmg = 5;
        unit.hp = Math.max(0, unit.hp - dmg);
        GameEvents.emit('unit:damaged', { unit, damage:dmg, attackerId:'poison' });
        GameState.floatingTexts.push({x:unit.x,y:unit.y,text:`☠${dmg}`,color:'#a0ff60',age:0,maxAge:28});
        if(unit.hp <= 0){
          GameEvents.emit('unit:defeated', { unit, attackerId:'poison' });
          GameState.map[unit.y][unit.x].occupied = false;
        }
      } else if(se.name === 'stun'){
        se._wasStunned = true;
      } else if(se.name === 'slow' && !se._applied){
        se._originalSpeed = unit.speed;
        unit.speed = Math.floor(unit.speed / 2);
        se._applied = true;
      }
      se.turnsLeft--;
      if(se.turnsLeft <= 0){
        expired.push(se);
        if(se.name === 'slow' && se._applied && se._originalSpeed !== undefined)
          unit.speed = se._originalSpeed;
      }
    }
    unit.statusEffects = unit.statusEffects.filter(se => !expired.includes(se));
    const wasStunned = expired.some(se => se.name === 'stun' && se._wasStunned) ||
                       unit.statusEffects.some(se => se.name === 'stun' && se._wasStunned);
    if(wasStunned) GameState._skipCurrentTurn = true;
  },
};

