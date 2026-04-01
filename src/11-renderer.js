// --- SECTION: Renderer ---
const Renderer = (() => {
  let _canvas=null,_ctx=null,_ts=CONFIG.TILE_SIZE;
  const ICON_CHARS={'Knight':'⚔','Mage':'✦','Archer':'◎','Dark Knight':'☽','Squire':'◈','Healer':'✚','Thief':'◈','Paladin':'†','Berserker':'⚡'};

  function init(canvas){
    _canvas=canvas; _ctx=canvas.getContext('2d');
    // Fit canvas to available space between header and footer
    const container = document.getElementById('canvas-container');
    const cw = container.clientWidth;
    const ch = container.clientHeight;
    const sm = Math.min(cw, ch);
    _ts = Math.min(80, Math.max(CONFIG.MIN_TILE_SIZE, Math.floor(sm / CONFIG.GRID_COLS)));
    _canvas.width  = _ts * CONFIG.GRID_COLS;
    _canvas.height = _ts * CONFIG.GRID_ROWS;
    _ctx.imageSmoothingEnabled = false;
    // Invalidate grain cache on resize
    _grainPattern = null;
    _grainTs = 0;
    return _ts;
  }

  function getTileColor(tile){
    return {normal:CONFIG.COLORS.TILE_NORMAL,high:CONFIG.COLORS.TILE_HIGH,obstacle:CONFIG.COLORS.TILE_OBSTACLE,water:CONFIG.COLORS.TILE_WATER}[tile.terrain]||CONFIG.COLORS.TILE_NORMAL;
  }

  function drawTile(tile){
    const {x,y}=tile, px=x*_ts, py=y*_ts, ts=_ts, ctx=_ctx;

    // --- Polished terrain drawing ---
    switch (tile.terrain) {
      case 'normal':   drawTerrainNormal(ctx, tile, px, py, ts);   break;
      case 'high':     drawTerrainHigh(ctx, tile, px, py, ts);     break;
      case 'water':    drawTerrainWater(ctx, tile, px, py, ts);    break;
      case 'obstacle': drawTerrainObstacle(ctx, tile, px, py, ts); break;
      default:
        ctx.fillStyle = getTileColor(tile);
        ctx.fillRect(px, py, ts, ts);
    }

    // Hover highlight
    if(GameState.hoveredTile&&GameState.hoveredTile.x===x&&GameState.hoveredTile.y===y&&tile.terrain!=='obstacle'&&tile.terrain!=='water'){
      ctx.fillStyle=CONFIG.COLORS.TILE_HOVER; ctx.fillRect(px,py,ts,ts);
    }

    // Move range highlight
    if(GameState.validMoveTiles.some(t=>t.x===x&&t.y===y)){
      ctx.fillStyle=CONFIG.COLORS.TILE_HIGHLIGHT; ctx.fillRect(px,py,ts,ts);
      ctx.strokeStyle='rgba(80,200,255,0.75)'; ctx.lineWidth=1.5; ctx.setLineDash([4,4]);
      ctx.strokeRect(px+2,py+2,ts-4,ts-4); ctx.setLineDash([]);
    }

    // Target highlight
    if(GameState.validTargetTiles.some(t=>t.x===x&&t.y===y)){
      const isHeal=GameState.pendingAbility&&ABILITIES[GameState.pendingAbility]&&ABILITIES[GameState.pendingAbility].type==='heal';
      ctx.fillStyle=isHeal?CONFIG.COLORS.TILE_HEAL_TARGET:CONFIG.COLORS.TILE_TARGET; ctx.fillRect(px,py,ts,ts);
      ctx.strokeStyle=isHeal?'rgba(80,255,120,0.85)':'rgba(255,80,80,0.85)'; ctx.lineWidth=1.5; ctx.setLineDash([3,3]);
      ctx.strokeRect(px+2,py+2,ts-4,ts-4); ctx.setLineDash([]);
    }

    // Grid line
    ctx.strokeStyle=CONFIG.COLORS.TILE_BORDER; ctx.lineWidth=0.5; ctx.strokeRect(px,py,ts,ts);

    // Elevation badge — tile-relative font
    if(tile.elevation!==0){
      const elFs = Math.max(7, Math.floor(ts * 0.15));
      ctx.font=`${elFs}px monospace`; ctx.fillStyle='rgba(180,200,220,0.38)';
      ctx.textAlign='left'; ctx.textBaseline='top';
      ctx.fillText(tile.elevation>0?`+${tile.elevation}`:`${tile.elevation}`,px+3,py+3);
    }
  }

  function drawUnit(unit){
    const {x,y}=unit, px=x*_ts, py=y*_ts, ts=_ts, ctx=_ctx;
    const isSel=GameState.selectedUnit===unit.id, isAct=GameState.currentTurn===unit.id;
    const isP=unit.team==='player', tc=isP?CONFIG.COLORS.TEAM_PLAYER:CONFIG.COLORS.TEAM_ENEMY;
    const cx=px+ts/2, cy=py+ts/2, rad=ts*0.31;
    const accent=CONFIG.COLORS.JOB_ACCENT[unit.job]||'#90caf9';
    const job=unit.job;

    // Selection ring
    if(isSel){
      ctx.save();
      ctx.shadowColor=CONFIG.COLORS.TILE_SELECTED;
      ctx.shadowBlur=14;
      ctx.strokeStyle=CONFIG.COLORS.TILE_SELECTED;
      ctx.lineWidth=2.5;
      ctx.beginPath(); ctx.arc(cx,cy,rad+6,0,Math.PI*2); ctx.stroke();
      ctx.restore();
    }

    // Active-turn dashed ring
    if(isAct){
      ctx.save();
      ctx.strokeStyle=CONFIG.COLORS.TURN_INDICATOR;
      ctx.lineWidth=1.8; ctx.setLineDash([3,3]);
      ctx.beginPath(); ctx.arc(cx,cy,rad+9,0,Math.PI*2); ctx.stroke();
      ctx.setLineDash([]);
      ctx.restore();
    }

    // Drop shadow ellipse
    ctx.beginPath();
    ctx.ellipse(cx,py+ts-5,rad*0.75,rad*0.22,0,0,Math.PI*2);
    ctx.fillStyle='rgba(0,0,0,0.28)'; ctx.fill();

    // ── Job-specific shape decorations (drawn before body) ──────
    if(job==='Dark Knight'||job==='Berserker'){
      // Jagged angular accent marks around circle
      ctx.save();
      const spikes=6;
      const spikeOuter=rad+ts*0.13, spikeInner=rad+ts*0.04;
      ctx.strokeStyle=accent; ctx.lineWidth=1.5; ctx.globalAlpha=0.75;
      for(let i=0;i<spikes;i++){
        const a0=(i/spikes)*Math.PI*2-Math.PI/2;
        const a1=((i+0.5)/spikes)*Math.PI*2-Math.PI/2;
        const a2=((i+1)/spikes)*Math.PI*2-Math.PI/2;
        const ox=Math.cos(a0)*spikeInner, oy=Math.sin(a0)*spikeInner;
        const mx=Math.cos(a1)*spikeOuter, my2=Math.sin(a1)*spikeOuter;
        const ex=Math.cos(a2)*spikeInner, ey=Math.sin(a2)*spikeInner;
        ctx.beginPath();
        ctx.moveTo(cx+ox, cy+oy);
        ctx.lineTo(cx+mx, cy+my2);
        ctx.lineTo(cx+ex, cy+ey);
        ctx.stroke();
      }
      ctx.restore();
    }

    if(job==='Archer'||job==='Thief'){
      // Sharp outer ring (thinner, agile feel)
      ctx.save();
      ctx.strokeStyle=accent; ctx.lineWidth=1.2; ctx.globalAlpha=0.7;
      ctx.setLineDash([2,2]);
      ctx.beginPath(); ctx.arc(cx,cy,rad+ts*0.09,0,Math.PI*2); ctx.stroke();
      ctx.setLineDash([]);
      ctx.restore();
    }

    // Unit body — gradient fill using team color
    const effectiveRad = (job==='Archer'||job==='Thief') ? rad*0.92 : rad;
    ctx.beginPath(); ctx.arc(cx,cy,effectiveRad,0,Math.PI*2);
    const g=ctx.createRadialGradient(cx-effectiveRad*0.3,cy-effectiveRad*0.3,effectiveRad*0.08,cx,cy,effectiveRad);
    g.addColorStop(0,isP?'#7bdcfc':'#f48880');
    g.addColorStop(1,isP?'#1565c0':'#b71c1c');
    ctx.fillStyle=g; ctx.fill();

    // Job-specific border style
    if(job==='Knight'||job==='Paladin'){
      // Thick solid border — defensive, sturdy
      ctx.strokeStyle=accent; ctx.lineWidth=isSel?3.5:2.8;
      ctx.beginPath(); ctx.arc(cx,cy,effectiveRad,0,Math.PI*2); ctx.stroke();
    } else if(job==='Mage'||job==='Healer'){
      // Normal border + inner glow ring
      ctx.strokeStyle=tc; ctx.lineWidth=isSel?2.5:1.5;
      ctx.beginPath(); ctx.arc(cx,cy,effectiveRad,0,Math.PI*2); ctx.stroke();
      ctx.save();
      ctx.strokeStyle=accent; ctx.lineWidth=1.2; ctx.globalAlpha=0.55;
      ctx.shadowColor=accent; ctx.shadowBlur=8;
      ctx.beginPath(); ctx.arc(cx,cy,effectiveRad*0.68,0,Math.PI*2); ctx.stroke();
      ctx.restore();
    } else {
      // Default border using accent
      ctx.strokeStyle=accent; ctx.lineWidth=isSel?2.5:1.8;
      ctx.beginPath(); ctx.arc(cx,cy,effectiveRad,0,Math.PI*2); ctx.stroke();
    }

    // Job icon — tile-relative font
    const iconFs = Math.max(10, Math.floor(ts * 0.3));
    ctx.font=`bold ${iconFs}px serif`;
    ctx.textAlign='center'; ctx.textBaseline='middle';
    ctx.fillStyle='#fff'; ctx.shadowColor='rgba(0,0,0,0.8)'; ctx.shadowBlur=4;
    ctx.fillText(ICON_CHARS[unit.job]||'*',cx,cy); ctx.shadowBlur=0;

    // Status effect icons — tile-relative font
    if(unit.statusEffects&&unit.statusEffects.length>0){
      const SI={poison:'☠',stun:'★',slow:'⧖',shield:'◉'};
      const seFs = Math.max(7, Math.floor(ts * 0.17));
      unit.statusEffects.forEach((se,i)=>{
        ctx.font=`${seFs}px serif`;
        ctx.textAlign='left'; ctx.textBaseline='top';
        ctx.fillStyle=se.name==='poison'?'#a0ff60':se.name==='stun'?'#ffee00':'#80c8ff';
        ctx.shadowColor='#000'; ctx.shadowBlur=3;
        ctx.fillText(SI[se.name]||'?', px+2+i*Math.floor(ts*0.19), py+ts*0.42);
        ctx.shadowBlur=0;
      });
    }

    // HP bar
    const bw=ts-8, bh=Math.max(4,Math.floor(ts*0.08));
    const bx=px+4, by=py+ts-bh-5;
    const hp=unit.hp/unit.maxHp;
    ctx.fillStyle=CONFIG.COLORS.HP_BAR_BG; ctx.fillRect(bx,by,bw,bh);
    ctx.fillStyle=hp>0.5?CONFIG.COLORS.HP_BAR_FILL:hp>0.25?'#ffc107':'#f44336';
    ctx.fillRect(bx,by,Math.round(bw*hp),bh);
    ctx.strokeStyle='rgba(0,0,0,0.5)'; ctx.lineWidth=0.5; ctx.strokeRect(bx,by,bw,bh);

    // Unit name — tile-relative font
    const nfs=Math.max(8, Math.floor(ts*0.135));
    ctx.font=`${nfs}px 'Courier New',monospace`;
    ctx.textAlign='center'; ctx.textBaseline='bottom';
    ctx.fillStyle=tc; ctx.shadowColor='#000'; ctx.shadowBlur=3;
    ctx.fillText(unit.name,cx,py+4+nfs); ctx.shadowBlur=0;
  }

  // --- SECTION: HUD Polish ---
  function drawUI(){
    const ctx=_ctx, cw=_canvas.width, ch=_canvas.height;
    const au=getUnit(GameState.currentTurn); if(!au)return;

    // Compute font sizes relative to canvas width and tile size
    const uf = Math.max(8, Math.min(Math.floor(_ts*0.155), Math.floor(cw*0.022)));
    const ph = Math.max(22, Math.floor(_ts*0.38));

    // ── Top strip ──────────────────────────────────────────────
    // Background with subtle gradient
    const topGrad = ctx.createLinearGradient(0, 0, 0, ph);
    topGrad.addColorStop(0, 'rgba(4,8,18,0.98)');
    topGrad.addColorStop(1, 'rgba(8,16,28,0.94)');
    ctx.fillStyle = topGrad;
    ctx.fillRect(0, 0, cw, ph);

    // Accent border line
    ctx.strokeStyle = CONFIG.COLORS.ACCENT;
    ctx.lineWidth = 0.8;
    ctx.strokeRect(0, 0, cw, ph);

    // Bottom glow of top strip
    const grd = ctx.createLinearGradient(0, ph-2, 0, ph+3);
    grd.addColorStop(0, 'rgba(0,229,255,0.25)');
    grd.addColorStop(1, 'rgba(0,229,255,0)');
    ctx.fillStyle = grd;
    ctx.fillRect(0, ph-2, cw, 5);

    // Round number badge
    const roundLabel = `R${(GameState.turnNumber||0)+1}`;
    const rndFs = Math.max(7, Math.floor(uf * 0.85));
    ctx.font = `bold ${rndFs}px 'Courier New',monospace`;
    const rndW = ctx.measureText(roundLabel).width + 8;
    const rndX = 4, rndY = Math.floor((ph - rndFs - 4) / 2);
    ctx.fillStyle = 'rgba(0,60,80,0.7)';
    ctx.fillRect(rndX, rndY, rndW, rndFs + 4);
    ctx.strokeStyle = 'rgba(0,229,255,0.4)';
    ctx.lineWidth = 0.8;
    ctx.strokeRect(rndX, rndY, rndW, rndFs + 4);
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillStyle = CONFIG.COLORS.ACCENT;
    ctx.fillText(roundLabel, rndX + rndW / 2, rndY + (rndFs + 4) / 2);

    // Active unit info
    const tc = au.team==='player' ? CONFIG.COLORS.TEAM_PLAYER : CONFIG.COLORS.TEAM_ENEMY;
    const infoX = rndX + rndW + 6;

    ctx.font = `bold ${uf}px 'Courier New',monospace`;
    ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
    ctx.fillStyle = CONFIG.COLORS.TURN_INDICATOR;
    ctx.fillText('►', infoX, ph / 2);

    const arrowW = ctx.measureText('► ').width;
    ctx.fillStyle = tc;
    ctx.fillText(`${au.name}`, infoX + arrowW, ph / 2);
    const nameW = ctx.measureText(`${au.name} `).width;

    ctx.fillStyle = CONFIG.COLORS.TEXT_DIM;
    ctx.font = `${Math.max(7, Math.floor(uf * 0.85))}px 'Courier New',monospace`;
    ctx.fillText(`(${au.job})`, infoX + arrowW + nameW, ph / 2);

    // Turn queue preview — right side
    // Show up to 4 upcoming units
    const qp = [GameState.currentTurn, ...GameState.turnQueue].slice(0, 5);
    let qx = cw - 4;
    ctx.font = `${Math.max(7, Math.floor(uf * 0.88))}px 'Courier New',monospace`;
    ctx.textBaseline = 'middle';
    for (let i = qp.length - 1; i >= 0; i--) {
      const u = getUnit(qp[i]); if (!u) continue;
      const qc = u.team==='player' ? CONFIG.COLORS.TEAM_PLAYER : CONFIG.COLORS.TEAM_ENEMY;
      ctx.font = `${i===0 ? 'bold ' : ''}${Math.max(7, Math.floor(uf*(i===0?1:0.85)))}px 'Courier New',monospace`;
      // Pulse the active unit name in the queue
      if(i===0){
        const pulse = 0.7 + 0.3 * (0.5 + 0.5 * Math.sin(Date.now() * 0.005));
        ctx.globalAlpha = pulse;
        ctx.fillStyle = CONFIG.COLORS.TURN_INDICATOR;
      } else {
        ctx.globalAlpha = 1;
        ctx.fillStyle = qc;
      }
      ctx.textAlign = 'right';
      ctx.fillText(u.name, qx, ph / 2);
      ctx.globalAlpha = 1;
      qx -= ctx.measureText(u.name).width + 8;
      if (i > 0) {
        ctx.fillStyle = CONFIG.COLORS.TEXT_DIM;
        ctx.fillText('→', qx + 4, ph / 2);
        qx -= 11;
      }
    }

    // ── Bottom strip (selected unit detail) ────────────────────
    const sel = getUnit(GameState.selectedUnit);
    if (sel && !GameState.showActionMenu) {
      const dh = Math.max(36, Math.floor(_ts * 0.58));
      const dy = ch - dh;

      // Background gradient
      const botGrad = ctx.createLinearGradient(0, dy, 0, ch);
      botGrad.addColorStop(0, 'rgba(8,16,28,0.94)');
      botGrad.addColorStop(1, 'rgba(4,8,18,0.98)');
      ctx.fillStyle = botGrad;
      ctx.fillRect(0, dy, cw, dh);

      // Top glow line
      const glowGrd = ctx.createLinearGradient(0, dy-3, 0, dy+2);
      glowGrd.addColorStop(0, 'rgba(0,229,255,0)');
      glowGrd.addColorStop(1, 'rgba(0,229,255,0.22)');
      ctx.fillStyle = glowGrd;
      ctx.fillRect(0, dy - 3, cw, 5);

      const sc = sel.team==='player' ? CONFIG.COLORS.TEAM_PLAYER : CONFIG.COLORS.TEAM_ENEMY;
      ctx.strokeStyle = sc;
      ctx.lineWidth = 0.8;
      ctx.strokeRect(0, dy, cw, dh);

      // Name + job
      const bUf = Math.max(8, Math.floor(uf * 1.05));
      ctx.font = `bold ${bUf}px 'Courier New',monospace`;
      ctx.textAlign = 'left'; ctx.textBaseline = 'top';
      ctx.fillStyle = sc;
      ctx.fillText(`${sel.name}`, 8, dy + 5);
      const snw = ctx.measureText(`${sel.name} `).width;

      ctx.font = `${Math.max(7, Math.floor(bUf * 0.8))}px 'Courier New',monospace`;
      ctx.fillStyle = CONFIG.COLORS.TEXT_DIM;
      ctx.fillText(`· ${sel.job}`, 8 + snw, dy + 6);

      // Stats row
      const suf = Math.max(7, Math.floor(uf * 0.82));
      ctx.font = `${suf}px 'Courier New',monospace`;
      ctx.fillStyle = CONFIG.COLORS.TEXT_DIM;
      ctx.textBaseline = 'bottom';
      ctx.fillText(`ATK:${sel.attack}  DEF:${sel.defense}  MOV:${sel.moveRange}  SPD:${sel.speed}`, 8, dy + dh - 4);

      // Abilities list (right side)
      ctx.font = `${Math.max(7, Math.floor(suf * 0.9))}px 'Courier New',monospace`;
      ctx.textAlign = 'right'; ctx.textBaseline = 'bottom';
      ctx.fillStyle = CONFIG.COLORS.ACCENT;
      const abText = sel.abilities.join(' · ');
      // Truncate if too wide
      const maxAbW = cw * 0.45;
      let abDisplay = abText;
      while (ctx.measureText(abDisplay).width > maxAbW && abDisplay.length > 3) {
        abDisplay = abDisplay.slice(0, abDisplay.lastIndexOf(' ·'));
        if (!abDisplay.includes('·')) break;
      }
      ctx.fillText(abDisplay, cw - 6, dy + dh - 4);

      // ── Mini HP and MP bars ──────────────────────────────────
      const barW = Math.min(cw * 0.28, 110);
      const barH = Math.max(5, Math.floor(dh * 0.14));
      const barX = 8;
      const midY = dy + dh * 0.5;

      // HP bar
      const hpRatio = sel.hp / sel.maxHp;
      ctx.fillStyle = CONFIG.COLORS.HP_BAR_BG;
      ctx.fillRect(barX, midY - barH - 2, barW, barH);
      ctx.fillStyle = hpRatio > 0.5 ? CONFIG.COLORS.HP_BAR_FILL : hpRatio > 0.25 ? '#ffc107' : '#f44336';
      ctx.fillRect(barX, midY - barH - 2, Math.round(barW * hpRatio), barH);
      ctx.strokeStyle = 'rgba(0,0,0,0.4)'; ctx.lineWidth = 0.5;
      ctx.strokeRect(barX, midY - barH - 2, barW, barH);
      // HP label
      const barLabelFs = Math.max(7, Math.floor(barH * 1.1));
      ctx.font = `${barLabelFs}px 'Courier New',monospace`;
      ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
      ctx.fillStyle = '#4caf50';
      ctx.fillText(`HP`, barX, midY - barH * 0.5 - 2 - barH - 1);

      // HP numbers right of bar
      ctx.fillStyle = CONFIG.COLORS.TEXT_DIM;
      ctx.textAlign = 'left';
      ctx.fillText(`${sel.hp}/${sel.maxHp}`, barX + barW + 4, midY - barH - 2 + barH / 2);

      // MP bar
      const mpRatio = sel.maxMp > 0 ? sel.mp / sel.maxMp : 0;
      ctx.fillStyle = CONFIG.COLORS.HP_BAR_BG;
      ctx.fillRect(barX, midY + 2, barW, barH);
      ctx.fillStyle = CONFIG.COLORS.MP_BAR_FILL;
      ctx.fillRect(barX, midY + 2, Math.round(barW * mpRatio), barH);
      ctx.strokeStyle = 'rgba(0,0,0,0.4)'; ctx.lineWidth = 0.5;
      ctx.strokeRect(barX, midY + 2, barW, barH);
      // MP label
      ctx.fillStyle = '#2196f3';
      ctx.fillText(`MP`, barX, midY + 2 + barH / 2 - barH - 1);

      // MP numbers
      ctx.fillStyle = CONFIG.COLORS.TEXT_DIM;
      ctx.textAlign = 'left';
      ctx.fillText(`${sel.mp}/${sel.maxMp}`, barX + barW + 4, midY + 2 + barH / 2);
    }
  }

  function drawFloatingTexts(){
    const ctx=_ctx,ts=_ts;
    GameState.floatingTexts=GameState.floatingTexts.filter(ft=>ft.age<ft.maxAge);
    for(const ft of GameState.floatingTexts){
      const alpha=1-ft.age/ft.maxAge, rise=(ft.age/ft.maxAge)*ts*0.8;
      const ftFs = Math.max(10, Math.floor(ts * 0.27));
      ctx.save(); ctx.globalAlpha=alpha;
      ctx.font=`bold ${ftFs}px 'Courier New',monospace`;
      ctx.textAlign='center'; ctx.textBaseline='middle';
      ctx.fillStyle=ft.color||'#fff'; ctx.shadowColor='#000'; ctx.shadowBlur=5;
      ctx.fillText(ft.text,ft.x*ts+ts/2,ft.y*ts+ts/2-rise);
      ctx.restore(); ft.age++;
    }
    if(GameState.floatingTexts.length>0) requestAnimationFrame(()=>Renderer.draw());
  }

  function draw(){
    if(!_ctx)return;
    _ctx.clearRect(0,0,_canvas.width,_canvas.height);
    for(let r=0;r<CONFIG.GRID_ROWS;r++) for(let c=0;c<CONFIG.GRID_COLS;c++) drawTile(GameState.map[r][c]);

    // Selected unit tile highlight
    if(GameState.selectedUnit){
      const su=getUnit(GameState.selectedUnit);
      if(su){ _ctx.fillStyle=CONFIG.COLORS.TILE_SELECTED; _ctx.fillRect(su.x*_ts,su.y*_ts,_ts,_ts); }
    }

    GameState.units.forEach(u=>{ if(u.hp>0)drawUnit(u); });
    drawUI();
    drawFloatingTexts();
    if(GameState.showActionMenu&&GameState.actionMenuUnit) ActionMenu.draw(_ctx,_canvas.width,_canvas.height,_ts);
    VFXSystem.drawAll(_ctx);
  }

  function getTileSize(){ return _ts; }
  return { init, draw, getTileSize };
})();

