// --- SECTION: Movement System ---
const MovementSystem = (() => {
  function getReachableTiles(unit){
    const {x,y,moveRange}=unit;
    const visited=new Map(); const queue=[{x,y,cost:0}]; const reachable=[];
    visited.set(`${x},${y}`,0);
    while(queue.length>0){
      queue.sort((a,b)=>a.cost-b.cost);
      const {x:cx,y:cy,cost}=queue.shift();
      if(cost>moveRange)continue;
      // Only add to reachable if this tile is landable (not occupied by another unit)
      if(!(cx===x&&cy===y)){
        const occHere=getUnitAt(cx,cy);
        if(!occHere||occHere.id===unit.id) reachable.push({x:cx,y:cy});
      }
      for(const [dx,dy] of [[0,-1],[0,1],[-1,0],[1,0]]){
        const nx=cx+dx,ny=cy+dy;
        if(nx<0||ny<0||nx>=CONFIG.GRID_COLS||ny>=CONFIG.GRID_ROWS)continue;
        const tile=GameState.map[ny][nx];
        const mc=CONFIG.TERRAIN_MOVE_COST[tile.terrain]??Infinity;
        if(mc===Infinity)continue;
        const occ=getUnitAt(nx,ny);
        // Enemies fully block traversal — can't pass through or land on them
        if(occ&&occ.id!==unit.id&&occ.team!==unit.team)continue;
        // Allies can be passed through for pathfinding cost purposes
        const nc=cost+mc; const k=`${nx},${ny}`;
        if(!visited.has(k)||visited.get(k)>nc){ visited.set(k,nc); if(nc<=moveRange)queue.push({x:nx,y:ny,cost:nc}); }
      }
    }
    return reachable;
  }
  function selectUnit(unitId){
    const unit=getUnit(unitId); if(!unit)return;
    if(unit.id!==GameState.currentTurn||unit.team!=='player'){
      GameState.selectedUnit=unitId; GameState.validMoveTiles=[];
      GameEvents.emit('unit:selected',{unit,canAct:false}); Renderer.draw(); return;
    }
    GameState.selectedUnit=unitId;
    if(!GameState.unitMoved){ GameState.validMoveTiles=getReachableTiles(unit); }
    else { GameState.validMoveTiles=[]; }
    if(GameState.unitMoved&&!GameState.unitActed){ GameState.showActionMenu=true; GameState.actionMenuUnit=unitId; }
    GameEvents.emit('unit:selected',{unit,canAct:true,moveTiles:GameState.validMoveTiles}); Renderer.draw();
  }
  function moveUnit(unitId,toX,toY){
    const unit=getUnit(unitId); if(!unit)return false;
    const isValid=GameState.validMoveTiles.some(t=>t.x===toX&&t.y===toY); if(!isValid)return false;
    const occ=getUnitAt(toX,toY); if(occ&&occ.id!==unitId)return false;
    // Snapshot pre-move state for undo
    GameState._preMoveSnapshot={ unitId, fromX:unit.x, fromY:unit.y };
    GameState.map[unit.y][unit.x].occupied=false;
    unit.x=toX; unit.y=toY;
    GameState.map[toY][toX].occupied=true;
    GameState.validMoveTiles=[]; GameState.unitMoved=true;
    GameEvents.emit('unit:moved',{unit,toX,toY});
    GameState.showActionMenu=true; GameState.actionMenuUnit=unitId; GameState.selectedUnit=unitId;
    // Show undo button — only valid until an action is taken
    const undoBtn = document.getElementById('undo-move-btn');
    if(undoBtn) undoBtn.style.display='inline-block';
    Renderer.draw(); return true;
  }
  function undoMove(){
    const snap = GameState._preMoveSnapshot;
    if(!snap || GameState.unitActed) return false;
    const unit = getUnit(snap.unitId); if(!unit) return false;
    // Restore position
    GameState.map[unit.y][unit.x].occupied = false;
    unit.x = snap.fromX; unit.y = snap.fromY;
    GameState.map[snap.fromY][snap.fromX].occupied = true;
    // Reset move state
    GameState.unitMoved = false;
    GameState._preMoveSnapshot = null;
    GameState.showActionMenu = false;
    GameState.actionMenuUnit = null;
    // Restore move highlights
    GameState.validMoveTiles = getReachableTiles(unit);
    GameState.selectedUnit = unit.id;
    const undoBtn = document.getElementById('undo-move-btn');
    if(undoBtn) undoBtn.style.display='none';
    Renderer.draw();
    return true;
  }
  return { getReachableTiles, selectUnit, moveUnit, undoMove };
})();

