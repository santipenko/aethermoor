// --- SECTION: Init ---
let _coreListenersRegistered = false;
const _origRegisterCoreListeners = registerCoreListeners;
registerCoreListeners = function() {
  if (_coreListenersRegistered) return;
  _coreListenersRegistered = true;
  _origRegisterCoreListeners();
};

function init(){
  const canvas=document.getElementById('game-canvas');
  if(!canvas){console.error('[Engine] No #game-canvas');return;}

  // Load map_1 to populate units and map
  MapSystem.load('map_1');

  const ts=Renderer.init(canvas);
  InputManager.attach(canvas,ts);
  registerCoreListeners();

  // Start water animation if needed
  WaterAnim.check();

  // TurnSystem.start() is NOT called here — NarrativeController.begin() owns startup
  // so the title screen can intercept first. Renderer.draw() gives an initial frame.
  Renderer.draw();

  // Update map button label
  const btn = document.getElementById('map-select-btn');
  if (btn) btn.textContent = `${MAP_DEFINITIONS['map_1'].label.split(' ')[0].toUpperCase()} ▸`;

  window.addEventListener('resize',()=>{
    const ns=Renderer.init(canvas);
    InputManager.setCanvas(canvas,ns);
    WaterAnim.check();
    Renderer.draw();
  });

  console.log('%c[GameEngine] Initialized','color:#00e5ff;font-weight:bold');
}

window.GameEngine={init,GameEvents,GameState,schemas:{UnitSchema,TileSchema,GameStateSchema},utils:{getUnit,getUnitAt,syncMapOccupancy},systems:{TurnSystem,MovementSystem,InputManager,Renderer,MapSystem},config:CONFIG};
window.MovementSystem=MovementSystem;
