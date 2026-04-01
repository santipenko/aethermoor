// --- SECTION: Input Manager ---
const InputManager = (() => {
  let _canvas=null, _ts=CONFIG.TILE_SIZE;
  let _mouseCanvasX = -1, _mouseCanvasY = -1;
  function setCanvas(c,ts){ _canvas=c; _ts=ts; }
  function getMousePos(){ return { x: _mouseCanvasX, y: _mouseCanvasY }; }
  function screenToGrid(cx,cy){
    const r=_canvas.getBoundingClientRect();
    const sx=_canvas.width/r.width, sy=_canvas.height/r.height;
    const col=Math.floor((cx-r.left)*sx/_ts), row=Math.floor((cy-r.top)*sy/_ts);
    if(col<0||row<0||col>=CONFIG.GRID_COLS||row>=CONFIG.GRID_ROWS)return null;
    return {x:col,y:row};
  }
  function screenToCanvas(cx,cy){
    const r=_canvas.getBoundingClientRect();
    const sx=_canvas.width/r.width, sy=_canvas.height/r.height;
    return {x:(cx-r.left)*sx, y:(cy-r.top)*sy};
  }
  function handleInteraction(gridX,gridY,cvX,cvY){
    if(GameState.phase!=='battle')return;
    if(GameState.showActionMenu&&GameState.actionMenuUnit){
      const hit=ActionMenu.hitTest(cvX,cvY);
      if(hit!==null){ ActionMenu.handleSelection(hit); return; }
      GameState.showActionMenu=false; GameState.actionMenuUnit=null; GameState.selectedUnit=null; Renderer.draw(); return;
    }
    if(GameState.pendingAbility){
      const isTarget=GameState.validTargetTiles.some(t=>t.x===gridX&&t.y===gridY);
      if(isTarget){
        const unit=getUnit(GameState.currentTurn);
        AbilitySystem.execute(unit,GameState.pendingAbility,gridX,gridY);
      } else {
        GameState.pendingAbility=null; GameState.validTargetTiles=[];
        if(!GameState.unitActed){ GameState.showActionMenu=true; GameState.actionMenuUnit=GameState.currentTurn; }
        Renderer.draw();
      }
      return;
    }
    // For Revive: fallen units are invisible (hp===0 filtered by getUnitAt),
    // so check validTargetTiles directly before falling through to normal unit selection
    if(GameState.pendingAbility==='Revive'){
      const isTarget=GameState.validTargetTiles.some(t=>t.x===gridX&&t.y===gridY);
      if(isTarget){ const unit=getUnit(GameState.currentTurn); AbilitySystem.execute(unit,'Revive',gridX,gridY); return; }
    }
    const cu=getUnitAt(gridX,gridY);
    if(GameState.selectedUnit){
      const su=getUnit(GameState.selectedUnit);
      if(cu&&cu.id===GameState.selectedUnit){
        if(su.id===GameState.currentTurn&&su.team==='player'&&!GameState.unitActed){
          GameState.showActionMenu=true; GameState.actionMenuUnit=su.id; Renderer.draw(); return;
        }
        GameState.selectedUnit=null; GameState.validMoveTiles=[]; Renderer.draw(); return;
      }
      const isVM=GameState.validMoveTiles.some(t=>t.x===gridX&&t.y===gridY);
      if(isVM&&su&&su.id===GameState.currentTurn){ MovementSystem.moveUnit(GameState.selectedUnit,gridX,gridY); return; }
      if(cu){ MovementSystem.selectUnit(cu.id); return; }
      GameState.selectedUnit=null; GameState.validMoveTiles=[]; Renderer.draw(); return;
    }
    if(cu)MovementSystem.selectUnit(cu.id);
  }
  function handleClick(e){
    e.preventDefault(); if(!_canvas)return;
    const cv=screenToCanvas(e.clientX,e.clientY);
    const grid=screenToGrid(e.clientX,e.clientY);
    if(!grid){
      if(GameState.showActionMenu){ const h=ActionMenu.hitTest(cv.x,cv.y); if(h!==null){ActionMenu.handleSelection(h);return;} GameState.showActionMenu=false;GameState.actionMenuUnit=null;Renderer.draw(); }
      return;
    }
    handleInteraction(grid.x,grid.y,cv.x,cv.y);
  }
  function handleTouch(e){
    e.preventDefault(); if(!_canvas)return;
    const t=e.changedTouches[0]; if(!t)return;
    const cv=screenToCanvas(t.clientX,t.clientY);
    const grid=screenToGrid(t.clientX,t.clientY);
    if(!grid){
      if(GameState.showActionMenu){ const h=ActionMenu.hitTest(cv.x,cv.y); if(h!==null){ActionMenu.handleSelection(h);return;} GameState.showActionMenu=false;GameState.actionMenuUnit=null;Renderer.draw(); }
      return;
    }
    handleInteraction(grid.x,grid.y,cv.x,cv.y);
  }
  function handleMouseMove(e){
    if(!_canvas)return;
    const cv=screenToCanvas(e.clientX,e.clientY);
    _mouseCanvasX=cv.x; _mouseCanvasY=cv.y;
    const g=screenToGrid(e.clientX,e.clientY);
    if(!g){GameState.hoveredTile=null;Renderer.draw();return;}
    if(!GameState.hoveredTile||GameState.hoveredTile.x!==g.x||GameState.hoveredTile.y!==g.y){GameState.hoveredTile=g;Renderer.draw();}
  }
  function attach(canvas,ts){
    setCanvas(canvas,ts);
    if(canvas._inputAttached) return;
    canvas._inputAttached = true;
    canvas.addEventListener('click',handleClick,{passive:false});
    canvas.addEventListener('touchend',handleTouch,{passive:false});
    canvas.addEventListener('mousemove',handleMouseMove,{passive:true});
    canvas.addEventListener('touchstart',e=>e.preventDefault(),{passive:false});
  }
  return { attach, screenToGrid, setCanvas, getMousePos };
})();

