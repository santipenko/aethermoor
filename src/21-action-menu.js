// --- SECTION: Action Menu ---
const ActionMenu = (() => {
  let _btns = [];
  const BTN_MIN_H = 44;
  function _roundRect(ctx,x,y,w,h,r){
    ctx.beginPath(); ctx.moveTo(x+r,y); ctx.lineTo(x+w-r,y);
    ctx.quadraticCurveTo(x+w,y,x+w,y+r); ctx.lineTo(x+w,y+h-r);
    ctx.quadraticCurveTo(x+w,y+h,x+w-r,y+h); ctx.lineTo(x+r,y+h);
    ctx.quadraticCurveTo(x,y+h,x,y+h-r); ctx.lineTo(x,y+r);
    ctx.quadraticCurveTo(x,y,x+r,y); ctx.closePath();
  }
  const ABILITY_ICONS = { 'Attack':'⚔','Shield Bash':'O','Fireball':'*','Heal':'+','Arrow Shot':'~','Dark Wave':')','Wait':'z' };

  function draw(ctx, cw, ch, ts){
    const unit = getUnit(GameState.actionMenuUnit); if(!unit)return;
    const abilities = AbilitySystem.getAbilities(unit);
    _btns = [];

    // Tile-relative font sizing — clamp for small screens
    const fs = Math.max(9, Math.min(Math.floor(ts * 0.165), Math.floor(cw * 0.028)));
    const btnH = Math.max(BTN_MIN_H, Math.floor(ts * 0.62));
    const pad = 10;
    const menuW = Math.min(cw * 0.58, 220, Math.max(160, ts * 3.4));
    const headerH = fs + 10;
    const totalH = abilities.length * btnH + pad * 2 + headerH;

    let mx = unit.x * ts + ts * 1.05;
    if(mx + menuW > cw - 4) mx = unit.x * ts - menuW - ts * 0.05;
    mx = Math.max(2, Math.min(cw - menuW - 2, mx));
    let my = unit.y * ts - totalH * 0.28;
    my = Math.max(2, Math.min(ch - totalH - 2, my));

    ctx.save();

    // Menu background
    ctx.fillStyle = 'rgba(4,9,18,0.97)';
    ctx.strokeStyle = CONFIG.COLORS.ACCENT;
    ctx.lineWidth = 1.5;
    _roundRect(ctx, mx, my, menuW, totalH, 7);
    ctx.fill(); ctx.stroke();

    // Inner glow border
    ctx.strokeStyle = 'rgba(0,200,255,0.1)';
    ctx.lineWidth = 3;
    _roundRect(ctx, mx+2, my+2, menuW-4, totalH-4, 5);
    ctx.stroke();

    // Header
    ctx.font = `bold ${fs}px 'Courier New',monospace`;
    ctx.textAlign = 'left'; ctx.textBaseline = 'top';
    ctx.fillStyle = CONFIG.COLORS.GOLD;
    ctx.fillText(`${unit.name}`, mx + pad, my + pad);

    // MP display
    const mpFs = Math.max(8, Math.floor(fs * 0.82));
    ctx.font = `${mpFs}px 'Courier New',monospace`;
    ctx.textAlign = 'right';
    ctx.fillStyle = CONFIG.COLORS.MP_BAR_FILL;
    ctx.fillText(`MP ${unit.mp}/${unit.maxMp}`, mx + menuW - pad, my + pad + (fs - mpFs) * 0.5);

    // Divider
    ctx.strokeStyle = 'rgba(0,229,255,0.14)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(mx + pad, my + pad + headerH - 2);
    ctx.lineTo(mx + menuW - pad, my + pad + headerH - 2);
    ctx.stroke();

    // Ability buttons
    abilities.forEach((ab, i) => {
      const bx = mx + pad, by = my + pad + headerH + i * btnH, bw = menuW - pad * 2, bh = btnH - 4;
      const ok = AbilitySystem.canUse(unit, ab.id);

      // Check hover state
      const mp = InputManager.getMousePos();
      const isHovered = ok && mp.x >= bx && mp.x <= bx+bw && mp.y >= by && mp.y <= by+bh;

      ctx.fillStyle = ok
        ? (isHovered
            ? (ab.id==='Wait' ? 'rgba(55,70,85,0.92)' : 'rgba(0,75,105,0.97)')
            : (ab.id==='Wait' ? 'rgba(30,40,52,0.75)' : 'rgba(0,45,65,0.88)'))
        : 'rgba(12,15,22,0.75)';
      _roundRect(ctx, bx, by, bw, bh, 4); ctx.fill();

      // Hover: add bright inner fill layer
      if(isHovered){
        ctx.save();
        ctx.globalAlpha=0.08;
        ctx.fillStyle='#ffffff';
        _roundRect(ctx, bx, by, bw, bh, 4); ctx.fill();
        ctx.restore();
      }

      ctx.strokeStyle = ok
        ? (isHovered
            ? (ab.id==='Wait' ? 'rgba(130,160,180,0.7)' : '#00e5ff')
            : (ab.id==='Wait' ? 'rgba(90,110,130,0.45)' : CONFIG.COLORS.ACCENT))
        : 'rgba(40,55,70,0.3)';
      ctx.lineWidth = (ok && ab.id !== 'Wait') ? (isHovered ? 1.8 : 1) : 0.5;
      _roundRect(ctx, bx, by, bw, bh, 4); ctx.stroke();

      // Ability name
      ctx.font = `${ok ? 'bold ' : ''}${fs}px 'Courier New',monospace`;
      ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
      ctx.fillStyle = ok ? (ab.id==='Wait' ? CONFIG.COLORS.TEXT_DIM : CONFIG.COLORS.TEXT_LIGHT) : 'rgba(70,90,110,0.55)';
      ctx.fillText(`${ABILITY_ICONS[ab.id]||'?'} ${ab.name}`, bx + 10, by + bh / 2);

      // MP cost badge
      if(ab.mpCost > 0){
        const mpBadgeFs = Math.max(7, Math.floor(fs * 0.78));
        ctx.font = `${mpBadgeFs}px 'Courier New',monospace`;
        ctx.textAlign = 'right';
        ctx.fillStyle = ok ? '#6090ff' : 'rgba(40,60,130,0.5)';
        ctx.fillText(`${ab.mpCost}MP`, bx + bw - 6, by + bh / 2);
      }

      _btns.push({ x:bx, y:by, w:bw, h:bh, abilityId:ab.id, canUse:ok });
    });

    ctx.restore();
  }

  function hitTest(cx,cy){
    for(let i=0;i<_btns.length;i++){
      const b=_btns[i];
      if(cx>=b.x&&cx<=b.x+b.w&&cy>=b.y&&cy<=b.y+b.h) return i;
    }
    return null;
  }

  function handleSelection(idx){
    const btn=_btns[idx]; if(!btn||!btn.canUse)return;
    const unit=getUnit(GameState.actionMenuUnit); if(!unit)return;
    if(btn.abilityId==='Wait'){
      GameState.showActionMenu=false; GameState.actionMenuUnit=null;
      TurnSystem.endTurn(); return;
    }
    const targets=AbilitySystem.getValidTargets(unit,btn.abilityId);
    if(targets.length===0){
      GameState.floatingTexts.push({x:unit.x,y:unit.y,text:'NO TARGET',color:'#ff9900',age:0,maxAge:30});
      Renderer.draw(); return;
    }
    GameState.showActionMenu=false;
    GameState.pendingAbility=btn.abilityId;
    GameState.validTargetTiles=targets;
    Renderer.draw();
  }

  return { draw, hitTest, handleSelection };
})();

// =============================================================================
