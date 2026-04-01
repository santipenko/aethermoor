// --- SECTION: Init Override ---
// Intercepts DOMContentLoaded to show title screen first.
// The engine's init() is NOT called here — NarrativeController.begin() handles it.
// =============================================================================
document.addEventListener('DOMContentLoaded', () => {
  // Initialize the title screen (does NOT start the engine yet)
  NarrativeController.initTitleScreen();

  // Handle first-tap audio context unlock
  document.addEventListener('pointerdown', () => {
    SoundSystem.ensureInit();
  }, { once: true });
});

// Also expose on window for onclick handlers
window.NarrativeController = NarrativeController;
window.SaveSystem = SaveSystem;
window.SoundSystem = SoundSystem;
