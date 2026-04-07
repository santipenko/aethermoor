// --- SECTION: Turn System ---
const TurnSystem = (() => {
  function buildQueue(units){ return [...units].filter(u=>u.hp>0).sort((a,b)=>b.speed-a.speed||a.id.localeCompare(b.id)).map(u=>u.id); }
  function start(){ GameState.turnNumber=0; GameState.turnQueue=buildQueue(GameState.units); advanceTurn(); }
  function advanceTurn(){
    GameState.turnQueue=GameState.turnQueue.filter(id=>{ const u=getUnit(id); return u&&u.hp>0; });
    if(GameState.turnQueue.length===0){ GameState.turnQueue=buildQueue(GameState.units); GameState.turnNumber++; }
    if(checkBattleEnd())return;
    const nextId=GameState.turnQueue.shift();
    GameState.currentTurn=nextId;
    GameState.unitMoved=false; GameState.unitActed=false;
    GameState.showActionMenu=false; GameState.actionMenuUnit=null;
    GameState.pendingAbility=null; GameState.validTargetTiles=[];
    GameState.selectedUnit=null; GameState.validMoveTiles=[];
    GameState._skipCurrentTurn=false;
    const unit=getUnit(nextId);
    if(unit){ StatusSystem.tick(unit); }
    // Hazard damage — unit takes damage if standing on a hazard tile
    if(unit && unit.hp > 0){
      const tile = GameState.map[unit.y] && GameState.map[unit.y][unit.x];
      if(tile && tile.terrain === 'hazard'){
        const hazardDmg = 8;
        unit.hp = Math.max(0, unit.hp - hazardDmg);
        GameEvents.emit('unit:damaged', { unit, damage: hazardDmg, attackerId: 'hazard' });
        GameState.floatingTexts.push({
          x: unit.x, y: unit.y,
          text: `\uD83D\uDD25${hazardDmg}`,
          color: '#ff6600',
          age: 0, maxAge: 30
        });
        if(unit.hp <= 0){
          GameState.map[unit.y][unit.x].occupied = false;
          GameEvents.emit('unit:defeated', { unit, attackerId: 'hazard' });
        }
      }
    }
    if(checkBattleEnd())return;
    const fresh=getUnit(nextId);
    if(!fresh||fresh.hp<=0){ advanceTurn(); return; }
    GameEvents.emit('turn:start',{unit:fresh,turnNumber:GameState.turnNumber});
  }
  function endTurn(){
    const unit=getUnit(GameState.currentTurn);
    GameEvents.emit('turn:end',{unit});
    GameState.selectedUnit=null; GameState.validMoveTiles=[];
    GameState.unitMoved=false; GameState.unitActed=false;
    GameState.showActionMenu=false; GameState.actionMenuUnit=null;
    GameState.pendingAbility=null; GameState.validTargetTiles=[];
    GameState._preMoveSnapshot=null;
    const undoBtn = document.getElementById('undo-move-btn');
    if(undoBtn) undoBtn.style.display='none';
    advanceTurn(); Renderer.draw();
  }
  function checkBattleEnd(){
    const pl=GameState.units.filter(u=>u.team==='player'&&u.hp>0);
    const en=GameState.units.filter(u=>u.team==='enemy'&&u.hp>0);
    if(pl.length===0){ GameState.phase='menu'; GameEvents.emit('battle:loss',{message:'All player units defeated.'}); return true; }
    if(en.length===0){ GameState.phase='menu'; GameEvents.emit('battle:win',{message:'All enemies defeated!'}); return true; }
    return false;
  }
  return { start, advanceTurn, endTurn, buildQueue, checkBattleEnd };
})();
