// --- SECTION: Terrain Visuals ---
// Water shimmer animation state
const WaterAnim = {
  phase: 0,
  rafId: null,
  active: false,
  start() {
    if (this.active) return;
    this.active = true;
    const tick = () => {
      this.phase = (this.phase + 0.04) % (Math.PI * 2);
      Renderer.draw();
      this.rafId = requestAnimationFrame(tick);
    };
    this.rafId = requestAnimationFrame(tick);
  },
  stop() {
    if (this.rafId) cancelAnimationFrame(this.rafId);
    this.active = false;
    this.rafId = null;
  },
  check() {
    const hasWater = GameState.map.some(row => row.some(t => t.terrain === 'water'));
    const hasHazard = GameState.map.some(row => row.some(t => t.terrain === 'hazard'));
    if ((hasWater || hasHazard) && !this.active) this.start();
    else if (!hasWater && !hasHazard && this.active) this.stop();
  },
};

// Pre-baked grain pattern for normal tiles (seeded deterministic noise)
function makeGrainPattern(ctx, ts) {
  const offscreen = document.createElement('canvas');
  offscreen.width = ts; offscreen.height = ts;
  const octx = offscreen.getContext('2d');
  // subtle dot noise
  octx.fillStyle = CONFIG.COLORS.TILE_NORMAL;
  octx.fillRect(0, 0, ts, ts);
  const seed = [17, 53, 97, 131, 179, 211, 251];
  for (let i = 0; i < 22; i++) {
    const x = (seed[i % 7] * (i + 3) * 7) % ts;
    const y = (seed[(i + 2) % 7] * (i + 5) * 11) % ts;
    octx.fillStyle = CONFIG.COLORS.NORMAL_GRAIN;
    octx.fillRect(x, y, 2, 2);
  }
  return ctx.createPattern(offscreen, 'repeat');
}

// Cache patterns per tile size
let _grainPattern = null;
let _grainTs = 0;

function drawTerrainNormal(ctx, tile, px, py, ts) {
  if (_grainTs !== ts || !_grainPattern) {
    _grainPattern = makeGrainPattern(ctx, ts);
    _grainTs = ts;
  }
  ctx.fillStyle = CONFIG.COLORS.TILE_NORMAL;
  ctx.fillRect(px, py, ts, ts);
  if (_grainPattern) {
    ctx.fillStyle = _grainPattern;
    ctx.fillRect(px, py, ts, ts);
  }
}

function drawTerrainHigh(ctx, tile, px, py, ts) {
  // Base fill (lighter than normal)
  ctx.fillStyle = CONFIG.COLORS.TILE_HIGH;
  ctx.fillRect(px, py, ts, ts);

  // Top face — subtle highlight along top and left
  ctx.strokeStyle = CONFIG.COLORS.TILE_HIGH_LIGHT;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(px, py + ts - 1);
  ctx.lineTo(px, py);
  ctx.lineTo(px + ts - 1, py);
  ctx.stroke();

  // Bottom / right — dark edge implying elevation
  const edgeH = Math.max(3, Math.floor(ts * 0.08));
  ctx.fillStyle = CONFIG.COLORS.TILE_HIGH_EDGE;
  ctx.fillRect(px, py + ts - edgeH, ts, edgeH);

  // Right edge
  const edgeW = Math.max(3, Math.floor(ts * 0.06));
  ctx.fillStyle = CONFIG.COLORS.TILE_HIGH_EDGE;
  ctx.fillRect(px + ts - edgeW, py, edgeW, ts);

  // Crosshatch hatching lines for texture
  ctx.save();
  ctx.rect(px, py, ts, ts - edgeH);
  ctx.clip();
  ctx.strokeStyle = 'rgba(100,170,220,0.07)';
  ctx.lineWidth = 0.8;
  for (let i = -ts; i < ts * 2; i += 9) {
    ctx.beginPath();
    ctx.moveTo(px + i, py);
    ctx.lineTo(px + i + ts, py + ts);
    ctx.stroke();
  }
  ctx.restore();
}

function drawTerrainWater(ctx, tile, px, py, ts) {
  const phase = WaterAnim.phase;

  // Deep base
  ctx.fillStyle = CONFIG.COLORS.TILE_WATER;
  ctx.fillRect(px, py, ts, ts);

  // Animated shimmer layer
  const alpha1 = 0.12 + 0.06 * Math.sin(phase + tile.x * 0.9);
  ctx.fillStyle = `rgba(60,160,255,${alpha1.toFixed(3)})`;
  ctx.fillRect(px, py, ts, ts);

  // Wave lines
  ctx.save();
  ctx.rect(px, py, ts, ts);
  ctx.clip();
  for (let wi = 0; wi < 3; wi++) {
    const wPhase = phase + wi * 1.1 + tile.x * 0.5 + tile.y * 0.3;
    const wy = py + ts * (0.28 + wi * 0.22) + Math.sin(wPhase) * (ts * 0.04);
    const alpha = 0.15 + 0.08 * Math.sin(phase * 0.7 + wi);
    ctx.strokeStyle = `rgba(120,210,255,${alpha.toFixed(3)})`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(px, wy);
    ctx.bezierCurveTo(
      px + ts * 0.3, wy - ts * 0.04 * Math.sin(wPhase * 1.3),
      px + ts * 0.7, wy + ts * 0.04 * Math.sin(wPhase * 0.9),
      px + ts, wy
    );
    ctx.stroke();
  }
  ctx.restore();

  // Glint sparkle
  const glintA = Math.max(0, 0.5 * Math.sin(phase * 2.1 + tile.x * 1.3 + tile.y * 0.7));
  if (glintA > 0.1) {
    const gx = px + ts * 0.55, gy = py + ts * 0.3;
    ctx.fillStyle = `rgba(200,240,255,${(glintA * 0.7).toFixed(3)})`;
    ctx.beginPath();
    ctx.arc(gx, gy, ts * 0.04, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawTerrainObstacle(ctx, tile, px, py, ts) {
  // Dark base
  ctx.fillStyle = CONFIG.COLORS.TILE_OBSTACLE;
  ctx.fillRect(px, py, ts, ts);

  // Rock cluster shapes
  ctx.save();
  ctx.rect(px, py, ts, ts);
  ctx.clip();

  const rockPositions = [
    { rx: 0.22, ry: 0.4,  rw: 0.28, rh: 0.3,  r: 4 },
    { rx: 0.48, ry: 0.28, rw: 0.22, rh: 0.28,  r: 3 },
    { rx: 0.55, ry: 0.52, rw: 0.26, rh: 0.24,  r: 3 },
    { rx: 0.2,  ry: 0.65, rw: 0.18, rh: 0.2,   r: 3 },
  ];

  rockPositions.forEach(({ rx, ry, rw, rh, r }) => {
    const x = px + rx * ts, y = py + ry * ts;
    const w = rw * ts, h = rh * ts;
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();

    // Rock gradient
    const rg = ctx.createLinearGradient(x, y, x + w, y + h);
    rg.addColorStop(0, 'rgba(60,75,90,0.9)');
    rg.addColorStop(1, 'rgba(20,28,36,0.9)');
    ctx.fillStyle = rg;
    ctx.fill();
    ctx.strokeStyle = 'rgba(80,100,120,0.4)';
    ctx.lineWidth = 0.5;
    ctx.stroke();
  });

  // Crack lines
  const cracks = [
    [0.35, 0.35, 0.45, 0.6],
    [0.5,  0.3,  0.65, 0.55],
    [0.25, 0.5,  0.38, 0.68],
  ];
  ctx.strokeStyle = CONFIG.COLORS.OBSTACLE_CRACK;
  ctx.lineWidth = 0.7;
  for (const [x1, y1, x2, y2] of cracks) {
    const mx = (x1 + x2) / 2 + (Math.random() * 0.06 - 0.03);
    const my = (y1 + y2) / 2 + (Math.random() * 0.06 - 0.03);
    ctx.beginPath();
    ctx.moveTo(px + x1 * ts, py + y1 * ts);
    ctx.quadraticCurveTo(px + mx * ts, py + my * ts, px + x2 * ts, py + y2 * ts);
    ctx.stroke();
  }
  ctx.restore();
}

function drawTerrainHazard(ctx, tile, px, py, ts) {
  const phase = WaterAnim.phase;

  // Dark base
  ctx.fillStyle = CONFIG.COLORS.TILE_HAZARD;
  ctx.fillRect(px, py, ts, ts);

  // Animated fire shimmer
  const alpha1 = 0.18 + 0.10 * Math.sin(phase * 1.3 + tile.x * 0.7);
  ctx.fillStyle = `rgba(255,80,0,${alpha1.toFixed(3)})`;
  ctx.fillRect(px, py, ts, ts);

  // Fire flicker lines
  ctx.save();
  ctx.rect(px, py, ts, ts);
  ctx.clip();
  for(let fi = 0; fi < 3; fi++){
    const fPhase = phase * 1.8 + fi * 1.2 + tile.x * 0.4 + tile.y * 0.3;
    const fy = py + ts * (0.5 + fi * 0.18) - Math.abs(Math.sin(fPhase)) * ts * 0.3;
    const falpha = 0.2 + 0.12 * Math.sin(phase * 1.1 + fi);
    ctx.strokeStyle = `rgba(255,160,40,${falpha.toFixed(3)})`;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(px + ts * 0.2, fy + ts * 0.1);
    ctx.bezierCurveTo(
      px + ts * 0.35, fy - ts * 0.08 * Math.sin(fPhase),
      px + ts * 0.65, fy + ts * 0.08 * Math.sin(fPhase * 0.9),
      px + ts * 0.8, fy + ts * 0.1
    );
    ctx.stroke();
  }
  ctx.restore();

  // Top glow
  const glintA = Math.max(0, 0.4 * Math.sin(phase * 2.4 + tile.x * 1.1 + tile.y * 0.6));
  if(glintA > 0.08){
    ctx.fillStyle = `rgba(255,200,60,${(glintA * 0.6).toFixed(3)})`;
    ctx.beginPath();
    ctx.arc(px + ts * 0.5, py + ts * 0.25, ts * 0.06, 0, Math.PI * 2);
    ctx.fill();
  }
}
