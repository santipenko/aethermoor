// --- SECTION: Cutscene Engine ---
// Plays a sequence of dialogue scenes as a full-screen overlay.
// =============================================================================
const CutsceneEngine = (() => {
  let _scenes = [];
  let _idx = 0;
  let _onComplete = null;
  let _typing = false;
  let _typeTimer = null;
  let _currentText = '';
  let _charIdx = 0;

  const overlay   = document.getElementById('cutscene-overlay');
  const bgTint    = document.getElementById('cs-bg-tint');
  const sceneGlyph= document.getElementById('cs-scene-glyph');
  const portrait  = document.getElementById('cs-portrait-char');
  const speakerEl = document.getElementById('cs-speaker-name');
  const textEl    = document.getElementById('cs-text');
  const counterEl = document.getElementById('cs-scene-counter');
  const hintEl    = document.getElementById('cs-advance-hint');

  function _showScene(idx) {
    if (idx >= _scenes.length) { _end(); return; }
    const s = _scenes[idx];
    _charIdx = 0;
    _currentText = s.text;

    portrait.textContent    = s.portrait || '?';
    portrait.style.color    = s.portraitColor || 'var(--accent)';
    speakerEl.textContent   = s.speaker || '';
    textEl.textContent      = '';
    counterEl.textContent   = `${idx+1} / ${_scenes.length}`;
    hintEl.style.display    = 'none';
    bgTint.style.background = s.bgTint || 'transparent';
    sceneGlyph.textContent  = s.glyph || '';

    _typing = true;
    _typeNext();
  }

  function _typeNext() {
    if (_charIdx >= _currentText.length) {
      _typing = false;
      hintEl.style.display = 'block';
      return;
    }
    textEl.textContent = _currentText.slice(0, _charIdx + 1);
    // Sound every few chars
    if (_charIdx % 3 === 0) SoundSystem.play('typeChar');
    _charIdx++;
    const delay = _currentText[_charIdx - 1] === '.' || _currentText[_charIdx - 1] === '!' ? 80 : 28;
    _typeTimer = setTimeout(_typeNext, delay);
  }

  function _advance() {
    if (_typing) {
      // Skip typewriter
      clearTimeout(_typeTimer);
      textEl.textContent = _currentText;
      _typing = false;
      hintEl.style.display = 'block';
      return;
    }
    SoundSystem.play('advance');
    _idx++;
    _showScene(_idx);
  }

  function _end() {
    overlay.style.display = 'none';
    GameState.phase = 'battle';
    if (_onComplete) { const cb = _onComplete; _onComplete = null; cb(); }
  }

  function play(scenes, onComplete) {
    _scenes = scenes;
    _idx = 0;
    _onComplete = onComplete;
    GameState.phase = 'cutscene';
    overlay.style.display = 'flex';

    // Attach interaction once
    overlay.onclick = () => _advance();
    overlay.ontouchend = (e) => { e.preventDefault(); _advance(); };

    _showScene(0);
  }

  return { play };
})();

// =============================================================================
