// =============================================================================
// --- SECTION: Sound System ---
// Web Audio API procedural sound generation. No files, no libraries.
// =============================================================================
const SoundSystem = (() => {
  let _ctx = null;
  let _droneOsc = null, _droneGain = null;
  let _initialized = false;

  function _init() {
    if (_initialized) return;
    try {
      _ctx = new (window.AudioContext || window.webkitAudioContext)();
      _initialized = true;
    } catch(e) { console.warn('[SoundSystem] Web Audio not available'); }
  }

  function _tone(freq, startTime, dur, vol, type='sine', ctx=_ctx) {
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain); gain.connect(ctx.destination);
    osc.type = type;
    osc.frequency.setValueAtTime(freq, startTime);
    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(vol, startTime + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + dur);
    osc.start(startTime);
    osc.stop(startTime + dur + 0.05);
  }

  const SOUNDS = {
    click() {
      if (!_ctx) return;
      const t = _ctx.currentTime;
      _tone(880, t, 0.06, 0.15, 'square');
      _tone(440, t + 0.04, 0.08, 0.08, 'sine');
    },
    battleStart() {
      if (!_ctx) return;
      const t = _ctx.currentTime;
      // Rising fanfare: C4 E4 G4 C5
      [[261,0],[329,0.18],[392,0.36],[523,0.54]].forEach(([f,d]) => {
        _tone(f, t+d, 0.28, 0.18, 'sawtooth');
        _tone(f*2, t+d, 0.18, 0.06, 'sine');
      });
    },
    victory() {
      if (!_ctx) return;
      const t = _ctx.currentTime;
      // G4 A4 B4 D5 G5 — triumphant
      [[392,0],[440,0.14],[493,0.28],[587,0.42],[784,0.58],[784,0.78]].forEach(([f,d]) => {
        _tone(f, t+d, 0.22, 0.16, 'triangle');
        _tone(f*1.5, t+d, 0.16, 0.05, 'sine');
      });
    },
    defeat() {
      if (!_ctx) return;
      const t = _ctx.currentTime;
      // Descending minor: A4 F4 D4 A3
      [[440,0],[349,0.22],[293,0.48],[220,0.80]].forEach(([f,d]) => {
        _tone(f, t+d, 0.35, 0.14, 'sawtooth');
      });
    },
    typeChar() {
      if (!_ctx) return;
      const t = _ctx.currentTime;
      const freq = 600 + Math.random() * 200;
      _tone(freq, t, 0.03, 0.04, 'square');
    },
    advance() {
      if (!_ctx) return;
      const t = _ctx.currentTime;
      _tone(660, t, 0.06, 0.08, 'sine');
      _tone(880, t+0.05, 0.08, 0.06, 'sine');
    },
  };

  function startDrone() {
    if (!_ctx || _droneOsc) return;
    _droneOsc = _ctx.createOscillator();
    _droneGain = _ctx.createGain();
    const filter = _ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 200;
    filter.Q.value = 0.8;
    _droneOsc.connect(filter);
    filter.connect(_droneGain);
    _droneGain.connect(_ctx.destination);
    _droneOsc.type = 'sawtooth';
    _droneOsc.frequency.value = 55; // A1
    _droneGain.gain.setValueAtTime(0, _ctx.currentTime);
    _droneGain.gain.linearRampToValueAtTime(0.04, _ctx.currentTime + 2);
    _droneOsc.start();
  }

  function stopDrone() {
    if (!_droneOsc || !_ctx) return;
    _droneGain.gain.linearRampToValueAtTime(0, _ctx.currentTime + 1.5);
    _droneOsc.stop(_ctx.currentTime + 1.6);
    _droneOsc = null; _droneGain = null;
  }

  function play(soundId) {
    if (!_initialized) return;
    if (SOUNDS[soundId]) SOUNDS[soundId]();
  }

  function ensureInit() { _init(); }

  return { play, ensureInit, startDrone, stopDrone };
})();

// =============================================================================
