// --- SECTION: VFX System ---
const VFXSystem = (() => {
  // Each VFX entry: { type, startTime, duration, ...params }
  function _spawn(vfx){ GameState.activeVFX.push(vfx); }

  function spawnForAbility(unit, abilityId, targetX, targetY){
    const ts = Renderer.getTileSize();
    const now = Date.now();
    const cx = (targetX + 0.5) * ts, cy = (targetY + 0.5) * ts;
    const ux = (unit.x + 0.5) * ts, uy = (unit.y + 0.5) * ts;

    switch(abilityId){
      case 'Attack':
        _spawn({ type:'flash', startTime:now, duration:200, cx, cy, color:'rgba(255,255,255,', ts });
        break;
      case 'Shield Bash':
      case 'Rampage':
        _spawn({ type:'impact_burst', startTime:now, duration:250, cx, cy, ts, color:'255,160,60' });
        break;
      case 'Fireball':
      case 'Ley Weave':
        _spawn({ type:'fireball', startTime:now, duration:400, cx, cy, ts });
        break;
      case 'Heal':
      case 'Mend':
      case 'Revive':
        _spawn({ type:'heal_particles', startTime:now, duration:500, cx, cy, ts });
        break;
      case 'Dark Wave':
        _spawn({ type:'dark_wave', startTime:now, duration:400, ux, uy, cx, cy, ts });
        break;
      case 'Arrow Shot':
      case 'Scout Shot':
        _spawn({ type:'line_shot', startTime:now, duration:300, ux, uy, cx, cy, color:'150,230,120', ts });
        break;
      case 'Holy Lance':
        _spawn({ type:'line_shot', startTime:now, duration:300, ux, uy, cx, cy, color:'255,245,180', ts });
        break;
      case 'Barrier':
      case 'Cover':
      case 'Fortify':
        _spawn({ type:'barrier_ring', startTime:now, duration:400, cx, cy, ts });
        break;
      case 'Shield Wall':
        _spawn({ type:'barrier_ring', startTime:now, duration:500, cx, cy, ts });
        _spawn({ type:'barrier_ring', startTime:now+80, duration:500,
          cx:(unit.x+0.5)*ts, cy:(unit.y+0.5)*ts, ts });
        break;
      case 'Smoke Bomb':
      case 'Vanish':
        _spawn({ type:'smoke', startTime:now, duration:500,
          cx: (unit.x + 0.5) * ts, cy: (unit.y + 0.5) * ts, ts });
        break;
      case 'Steal Mana':
        _spawn({ type:'steal_mana', startTime:now, duration:400, ux, uy, cx, cy, ts });
        break;
      case 'Root':
      case 'Call Earth':
        _spawn({ type:'root_tendrils', startTime:now, duration:500, cx, cy, ts });
        break;
      case 'Ley Pulse':
        _spawn({ type:'ley_pulse', startTime:now, duration:450, cx, cy, ts });
        break;
      case 'Rally':
      case 'Battle Cry':
        _spawn({ type:'rally_burst', startTime:now, duration:400,
          cx:(unit.x+0.5)*ts, cy:(unit.y+0.5)*ts, ts });
        break;
      case 'Suppress':
      case 'Intimidate':
      case 'Dispel':
      case 'Foreknowledge':
        _spawn({ type:'suppress_shroud', startTime:now, duration:500, cx, cy, ts });
        break;
    }
  }

  function drawAll(ctx){
    const now = Date.now();
    GameState.activeVFX = GameState.activeVFX.filter(v => (now - v.startTime) < v.duration);
    for(const v of GameState.activeVFX){
      const t = Math.min(1, (now - v.startTime) / v.duration); // 0→1
      ctx.save();
      ctx.globalCompositeOperation = 'source-over';
      try { _drawVFX(ctx, v, t); } catch(e){}
      ctx.restore();
    }
    if(GameState.activeVFX.length > 0 && GameState.phase === 'battle'){
      requestAnimationFrame(() => Renderer.draw());
    }
  }

  function _drawVFX(ctx, v, t){
    switch(v.type){

      case 'flash': {
        // White flash fading out over 200ms
        const alpha = (1 - t) * 0.65;
        ctx.fillStyle = `rgba(255,255,255,${alpha.toFixed(3)})`;
        const r = v.ts * 0.52;
        ctx.beginPath(); ctx.arc(v.cx, v.cy, r, 0, Math.PI*2); ctx.fill();
        break;
      }

      case 'fireball': {
        // Expanding ring: radius 0→1.5 tiles, fades after 60%
        const maxR = v.ts * 1.5;
        const r = t * maxR;
        const fadeT = t < 0.6 ? 1 : 1 - (t - 0.6) / 0.4;
        // Outer fire ring
        const grd = ctx.createRadialGradient(v.cx, v.cy, r*0.3, v.cx, v.cy, r);
        grd.addColorStop(0, `rgba(255,200,60,${(0.8*fadeT).toFixed(3)})`);
        grd.addColorStop(0.5, `rgba(255,100,20,${(0.6*fadeT).toFixed(3)})`);
        grd.addColorStop(1, `rgba(180,30,0,0)`);
        ctx.beginPath(); ctx.arc(v.cx, v.cy, r, 0, Math.PI*2);
        ctx.fillStyle = grd; ctx.fill();
        // Bright core flash at start
        if(t < 0.25){
          const coreAlpha = (1 - t/0.25) * 0.7;
          ctx.beginPath(); ctx.arc(v.cx, v.cy, r*0.4, 0, Math.PI*2);
          ctx.fillStyle = `rgba(255,240,180,${coreAlpha.toFixed(3)})`; ctx.fill();
        }
        break;
      }

      case 'heal_particles': {
        // 4 small cross shapes rising upward, staggered
        const crosses = 4;
        for(let i=0; i<crosses; i++){
          const phase = (t + i/crosses) % 1;
          const alpha = phase < 0.8 ? 1 : 1 - (phase-0.8)/0.2;
          const spread = v.ts * 0.32;
          const ox = Math.cos(i * Math.PI*2/crosses) * spread * 0.7;
          const rise = phase * v.ts * 0.85;
          const px = v.cx + ox, py = v.cy - rise;
          const arm = Math.max(3, v.ts * 0.09);
          ctx.strokeStyle = `rgba(80,255,140,${alpha.toFixed(3)})`;
          ctx.lineWidth = Math.max(1.5, v.ts * 0.04);
          ctx.lineCap = 'round';
          ctx.beginPath(); ctx.moveTo(px-arm, py); ctx.lineTo(px+arm, py); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(px, py-arm); ctx.lineTo(px, py+arm); ctx.stroke();
        }
        break;
      }

      case 'dark_wave': {
        // Sweeping purple horizontal line from caster toward target
        const alpha = t < 0.75 ? 1 : 1-(t-0.75)/0.25;
        const px = v.ux + (v.cx - v.ux) * t;
        const py = v.uy + (v.cy - v.uy) * t;
        const len = v.ts * 0.6;
        const ang = Math.atan2(v.cy - v.uy, v.cx - v.ux);
        const perpX = Math.sin(ang) * len, perpY = -Math.cos(ang) * len;
        ctx.strokeStyle = `rgba(160,80,255,${alpha.toFixed(3)})`;
        ctx.lineWidth = Math.max(2, v.ts * 0.07);
        ctx.shadowColor = '#7c4dff'; ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.moveTo(px - perpX, py - perpY);
        ctx.lineTo(px + perpX, py + perpY);
        ctx.stroke();
        // Leading glow dot
        ctx.beginPath(); ctx.arc(px, py, v.ts*0.06, 0, Math.PI*2);
        ctx.fillStyle = `rgba(200,140,255,${alpha.toFixed(3)})`; ctx.fill();
        break;
      }

      case 'line_shot': {
        // Thin line from caster to target, fades
        const alpha = 1 - t;
        ctx.strokeStyle = `rgba(${v.color},${alpha.toFixed(3)})`;
        ctx.lineWidth = Math.max(1.5, v.ts * 0.04);
        ctx.lineCap = 'round';
        ctx.shadowColor = `rgba(${v.color},0.8)`; ctx.shadowBlur = 6;
        ctx.beginPath(); ctx.moveTo(v.ux, v.uy); ctx.lineTo(v.cx, v.cy); ctx.stroke();
        // Arrowhead dot at target end
        const dotAlpha = (1-t) * 0.9;
        ctx.beginPath(); ctx.arc(v.cx, v.cy, v.ts*0.06, 0, Math.PI*2);
        ctx.fillStyle = `rgba(${v.color},${dotAlpha.toFixed(3)})`; ctx.fill();
        break;
      }

      case 'impact_burst': {
        // Expanding starburst, fades
        const alpha = 1 - t;
        const r = t * v.ts * 0.72;
        const rays = 8;
        ctx.strokeStyle = `rgba(${v.color},${alpha.toFixed(3)})`;
        ctx.lineWidth = Math.max(1.5, v.ts * 0.045);
        ctx.lineCap = 'round';
        for(let i=0; i<rays; i++){
          const a = (i/rays)*Math.PI*2;
          const inner = r*0.2, outer = r;
          ctx.beginPath();
          ctx.moveTo(v.cx + Math.cos(a)*inner, v.cy + Math.sin(a)*inner);
          ctx.lineTo(v.cx + Math.cos(a)*outer, v.cy + Math.sin(a)*outer);
          ctx.stroke();
        }
        // Core flash
        ctx.beginPath(); ctx.arc(v.cx, v.cy, r*0.3, 0, Math.PI*2);
        ctx.fillStyle = `rgba(${v.color},${(alpha*0.6).toFixed(3)})`; ctx.fill();
        break;
      }

      case 'barrier_ring': {
        // Blue/teal expanding ring
        const r = t * v.ts * 0.62 + v.ts * 0.32;
        const alpha = t < 0.6 ? 1 : 1-(t-0.6)/0.4;
        ctx.strokeStyle = `rgba(80,220,255,${alpha.toFixed(3)})`;
        ctx.lineWidth = Math.max(2, v.ts * 0.07);
        ctx.shadowColor = '#00e5ff'; ctx.shadowBlur = 12;
        ctx.beginPath(); ctx.arc(v.cx, v.cy, r, 0, Math.PI*2); ctx.stroke();
        // Inner shimmer
        ctx.strokeStyle = `rgba(180,240,255,${(alpha*0.4).toFixed(3)})`;
        ctx.lineWidth = Math.max(1, v.ts*0.03);
        ctx.beginPath(); ctx.arc(v.cx, v.cy, r*0.6, 0, Math.PI*2); ctx.stroke();
        break;
      }

      case 'smoke': {
        // Expanding grey cloud
        const r = t * v.ts * 1.1;
        const alpha = t < 0.5 ? t*1.2 : (1-t)*1.2;
        const grd = ctx.createRadialGradient(v.cx, v.cy, 0, v.cx, v.cy, r);
        grd.addColorStop(0,   `rgba(170,185,195,${(alpha*0.7).toFixed(3)})`);
        grd.addColorStop(0.5, `rgba(120,135,145,${(alpha*0.5).toFixed(3)})`);
        grd.addColorStop(1,   `rgba(80,90,100,0)`);
        ctx.beginPath(); ctx.arc(v.cx, v.cy, r, 0, Math.PI*2);
        ctx.fillStyle = grd; ctx.fill();
        break;
      }

      case 'steal_mana': {
        // Blue particles flowing from target toward caster
        const particleCount = 5;
        for(let i=0; i<particleCount; i++){
          const phase = ((t * 1.4) + i/particleCount) % 1;
          if(phase > 1) continue;
          const alpha = phase < 0.8 ? 1 : 1-(phase-0.8)/0.2;
          const px = v.cx + (v.ux - v.cx) * phase;
          const py = v.cy + (v.uy - v.cy) * phase;
          const wobble = Math.sin(phase * Math.PI * 4 + i) * v.ts * 0.09;
          const perpX = -(v.cy - v.uy) / Math.hypot(v.cx-v.ux, v.cy-v.uy) * wobble;
          const perpY =  (v.cx - v.ux) / Math.hypot(v.cx-v.ux, v.cy-v.uy) * wobble;
          ctx.beginPath(); ctx.arc(px+perpX, py+perpY, Math.max(2, v.ts*0.055), 0, Math.PI*2);
          ctx.fillStyle = `rgba(80,150,255,${alpha.toFixed(3)})`; ctx.fill();
          ctx.shadowColor = '#2196f3'; ctx.shadowBlur = 6;
        }
        break;
      }

      case 'root_tendrils': {
        // Green tendrils rising from ground, spreading outward
        const alpha = t < 0.7 ? 1 : 1-(t-0.7)/0.3;
        const reach = t * v.ts * 0.55;
        const tendrils = 5;
        ctx.strokeStyle = `rgba(60,200,80,${alpha.toFixed(3)})`;
        ctx.lineWidth = Math.max(1.5, v.ts * 0.04);
        ctx.lineCap = 'round';
        for(let i=0; i<tendrils; i++){
          const angle = (i/tendrils)*Math.PI*2 - Math.PI/2;
          const wobble = Math.sin(t * Math.PI * 3 + i) * v.ts * 0.06;
          ctx.beginPath();
          ctx.moveTo(v.cx, v.cy + v.ts * 0.3);
          ctx.quadraticCurveTo(
            v.cx + Math.cos(angle)*reach*0.5 + wobble,
            v.cy + Math.sin(angle)*reach*0.5,
            v.cx + Math.cos(angle)*reach,
            v.cy + Math.sin(angle)*reach - v.ts*0.1
          );
          ctx.stroke();
        }
        // Center glow
        ctx.beginPath();
        ctx.arc(v.cx, v.cy, v.ts*0.08, 0, Math.PI*2);
        ctx.fillStyle = `rgba(80,255,100,${alpha.toFixed(3)})`;
        ctx.fill();
        break;
      }

      case 'ley_pulse': {
        // Expanding ring of arcane energy, teal/purple
        const r1 = t * v.ts * 1.2;
        const r2 = t * v.ts * 0.8;
        const alpha = t < 0.65 ? 1 : 1-(t-0.65)/0.35;
        // Outer ring
        ctx.strokeStyle = `rgba(80,220,255,${alpha.toFixed(3)})`;
        ctx.lineWidth = Math.max(2, v.ts * 0.06);
        ctx.shadowColor = '#00e5ff'; ctx.shadowBlur = 10;
        ctx.beginPath(); ctx.arc(v.cx, v.cy, r1, 0, Math.PI*2); ctx.stroke();
        // Inner ring slightly delayed
        if(t > 0.15){
          const t2 = (t - 0.15) / 0.85;
          const alpha2 = t2 < 0.65 ? 0.7 : 0.7*(1-(t2-0.65)/0.35);
          ctx.strokeStyle = `rgba(160,100,255,${alpha2.toFixed(3)})`;
          ctx.lineWidth = Math.max(1.5, v.ts * 0.04);
          ctx.beginPath(); ctx.arc(v.cx, v.cy, r2*t2, 0, Math.PI*2); ctx.stroke();
        }
        // Core flash
        if(t < 0.2){
          const coreA = (1 - t/0.2) * 0.8;
          ctx.beginPath(); ctx.arc(v.cx, v.cy, v.ts*0.25, 0, Math.PI*2);
          ctx.fillStyle = `rgba(120,240,255,${coreA.toFixed(3)})`; ctx.fill();
        }
        break;
      }

      case 'rally_burst': {
        // Golden starburst radiating from caster outward
        const alpha = 1 - t;
        const r = t * v.ts * 1.0;
        const rays = 10;
        ctx.strokeStyle = `rgba(255,215,60,${alpha.toFixed(3)})`;
        ctx.lineWidth = Math.max(1.5, v.ts * 0.04);
        ctx.lineCap = 'round';
        ctx.shadowColor = '#ffd740'; ctx.shadowBlur = 8;
        for(let i=0; i<rays; i++){
          const a = (i/rays)*Math.PI*2;
          const inner = r*0.25, outer = r;
          ctx.beginPath();
          ctx.moveTo(v.cx + Math.cos(a)*inner, v.cy + Math.sin(a)*inner);
          ctx.lineTo(v.cx + Math.cos(a)*outer, v.cy + Math.sin(a)*outer);
          ctx.stroke();
        }
        // Warm center glow
        ctx.beginPath(); ctx.arc(v.cx, v.cy, r*0.25, 0, Math.PI*2);
        ctx.fillStyle = `rgba(255,220,100,${(alpha*0.7).toFixed(3)})`; ctx.fill();
        break;
      }

      case 'suppress_shroud': {
        // Dark descending veil over target
        const alpha = t < 0.5 ? t*1.8 : 1 - (t-0.5)*1.4;
        const h = t * v.ts * 0.9;
        // Descending dark rectangle
        ctx.fillStyle = `rgba(40,0,80,${(alpha*0.7).toFixed(3)})`;
        ctx.fillRect(v.cx - v.ts*0.4, v.cy - h, v.ts*0.8, h);
        // Dark particles falling
        const particles = 4;
        for(let i=0; i<particles; i++){
          const phase = (t + i/particles) % 1;
          const px = v.cx + (i - particles/2) * v.ts * 0.18;
          const py = v.cy - phase * v.ts * 0.7;
          const palpha = phase < 0.8 ? 1 : 1-(phase-0.8)/0.2;
          ctx.beginPath();
          ctx.arc(px, py, Math.max(2, v.ts*0.04), 0, Math.PI*2);
          ctx.fillStyle = `rgba(160,60,255,${(palpha*alpha).toFixed(3)})`;
          ctx.fill();
        }
        // Suppress icon flash
        if(t < 0.3){
          const iconA = (1 - t/0.3) * 0.9;
          const iconFs = Math.max(12, Math.floor(v.ts * 0.35));
          ctx.font = `bold ${iconFs}px serif`;
          ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
          ctx.fillStyle = `rgba(180,80,255,${iconA.toFixed(3)})`;
          ctx.fillText(')', v.cx, v.cy);
        }
        break;
      }
    }
  }

  return { spawnForAbility, drawAll };
})();
