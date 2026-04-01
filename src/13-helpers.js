// --- SECTION: Utility Helpers ---
function getUnit(id){ return GameState.units.find(u=>u.id===id)||null; }
function getUnitAt(x,y){ return GameState.units.find(u=>u.x===x&&u.y===y&&u.hp>0)||null; }
function syncMapOccupancy(){
  for(let r=0;r<CONFIG.GRID_ROWS;r++) for(let c=0;c<CONFIG.GRID_COLS;c++) GameState.map[r][c].occupied=false;
  GameState.units.forEach(u=>{ if(u.hp>0)GameState.map[u.y][u.x].occupied=true; });
}

