// --- SECTION: Core Event Listeners ---
function registerCoreListeners(){
  GameEvents.on('turn:start',({unit,turnNumber})=>{
    console.log(`%c[Turn Start] Round ${turnNumber+1} — ${unit.name} (${unit.team})`,'color:#ffd740;font-weight:bold');
    if(GameState._skipCurrentTurn){
      GameState._skipCurrentTurn=false;
      console.log(`%c[Status] ${unit.name} is stunned — skipping turn.`,'color:#ffee00');
      GameState.floatingTexts.push({x:unit.x,y:unit.y,text:'STUNNED!',color:'#ffee00',age:0,maxAge:40});
      Renderer.draw();
      setTimeout(()=>TurnSystem.endTurn(),700);
      return;
    }
    if(unit.team==='enemy'){
      setTimeout(()=>AISystem.doTurn(unit), 500);
    } else {
      GameState.selectedUnit=unit.id;
      GameState.validMoveTiles=MovementSystem.getReachableTiles(unit);
      Renderer.draw();
    }
  });
  GameEvents.on('turn:end',({unit})=>console.log(`%c[Turn End] ${unit.name}'s turn over`,'color:#607080'));
  GameEvents.on('unit:selected',({unit,canAct})=>console.log(`[Selected] ${unit.name} canAct:${canAct}`));
  GameEvents.on('unit:moved',({unit,toX,toY})=>console.log(`[Move] ${unit.name} → (${toX},${toY})`));
  GameEvents.on('unit:damaged',({unit,damage})=>{
    GameState.floatingTexts.push({x:unit.x,y:unit.y,text:`-${damage}`,color:'#ff5555',age:0,maxAge:30});
    Renderer.draw();
  });
  GameEvents.on('unit:healed',({unit,amount})=>{
    GameState.floatingTexts.push({x:unit.x,y:unit.y,text:`+${amount}`,color:'#55ff88',age:0,maxAge:30});
    Renderer.draw();
  });
  GameEvents.on('unit:defeated',({unit})=>{
    GameState.floatingTexts.push({x:unit.x,y:unit.y,text:'KO!',color:'#ffcc00',age:0,maxAge:45});
    Renderer.draw();
  });
  GameEvents.on('unit:statusApplied',({unit,effect})=>{
    GameState.floatingTexts.push({x:unit.x,y:unit.y,text:effect.toUpperCase(),color:effect==='poison'?'#a0ff60':effect==='stun'?'#ffee00':'#80c8ff',age:0,maxAge:35});
  });
  GameEvents.on('ability:used',({unit,abilityId,targetX,targetY})=>{
    console.log(`[Ability] ${unit.name} used ${abilityId}`);
    VFXSystem.spawnForAbility(unit, abilityId, targetX, targetY);
  });
  // NOTE: battle:win and battle:loss are handled exclusively by NarrativeController._registerBattleEvents()

  // ── Pulse driver: keeps HUD turn-queue name pulsing while in battle ──
  // Only runs at ~12fps to stay cheap. Stops itself when battle ends.
  let _pulseRafId = null;
  function _pulseTick(){
    if(GameState.phase !== 'battle'){ _pulseRafId = null; return; }
    // Only redraw if no other animation is already driving frames
    if(GameState.floatingTexts.length === 0 && GameState.activeVFX.length === 0){
      Renderer.draw();
    }
    _pulseRafId = setTimeout(()=>requestAnimationFrame(_pulseTick), 80);
  }
  // Kick off pulse loop on first turn:start
  GameEvents.once('turn:start', () => { if(!_pulseRafId) _pulseTick(); });
}

function showEndScreen(title,color,message){
  const o=document.getElementById('end-overlay'); if(!o)return;
  o.querySelector('#end-title').textContent=title;
  o.querySelector('#end-title').style.color=color;
  o.querySelector('#end-message').textContent=message;
  o.style.display='flex';
}

