'use strict';
const fs   = require('fs');
const path = require('path');

const SRC  = path.join(__dirname, 'src');
const DIST = path.join(__dirname, 'dist');

// ── File lists per script block ──────────────────────────────────────────────

const BLOCK_1 = [
  '00-config.js',
  '01-events.js',
  '02-state.js',
  '03-units.js',
  '04-maps.js',
  '05-map-system.js',
  '06-turn-system.js',
  '07-movement-system.js',
  '08-input-manager.js',
  '09-terrain-visuals.js',
  '10-vfx-system.js',
  '11-renderer.js',
  '13-helpers.js',
  '14-core-listeners.js',
  '15-init.js',
];

const BLOCK_2 = [
  '16-jobs.js',
  '17-abilities.js',
  '18-combat-math.js',
  '19-status-system.js',
  '20-ability-system.js',
  '21-action-menu.js',
  '22-ai-system.js',
];

const BLOCK_3 = [
  '29-world-map-data.js',
  '30-world-map-screen.js',
  '31-roster-screen.js',
  '23-sound-system.js',
  '24-save-system.js',
  '25-cutscene-engine.js',
  '26-story-script.js',
  '27-narrative-controller.js',
  '28-init-override.js',
];

const HTML_FILES = [
  'shell.html',
  'shell-narrative-html.html',
  'shell-close.html',
];

// ── Helpers ──────────────────────────────────────────────────────────────────

function read(relPath) {
  const abs = path.join(SRC, relPath);
  if (!fs.existsSync(abs)) {
    console.error(`\n[build.js] ERROR: missing source file: ${abs}\n`);
    process.exit(1);
  }
  return fs.readFileSync(abs, 'utf8');
}

function joinBlock(files) {
  return files.map(f => read(f)).join('');
}

// ── Validate ALL source files exist before writing anything ──────────────────

const allFiles = [...HTML_FILES, ...BLOCK_1, ...BLOCK_2, ...BLOCK_3];
allFiles.forEach(f => {
  const abs = path.join(SRC, f);
  if (!fs.existsSync(abs)) {
    console.error(`\n[build.js] ERROR: missing source file: ${abs}\n`);
    process.exit(1);
  }
});

if (!fs.existsSync(DIST)) {
  fs.mkdirSync(DIST, { recursive: true });
}

// ── Assemble ─────────────────────────────────────────────────────────────────

const output = [
  read('shell.html'),
  '<script>\n',
  joinBlock(BLOCK_1),
  '</script>\n',
  '\n<!-- ============================================================\n',
  '     EXTENSION: Job System, Ability System, Combat, Status, AI\n',
  '     ============================================================ -->\n',
  '<script>\n',
  '\n',
  joinBlock(BLOCK_2),
  '</script>\n',
  read('shell-narrative-html.html'),
  '<script>\n',
  joinBlock(BLOCK_3),
  read('shell-close.html'),
].join('');

// ── Write output ─────────────────────────────────────────────────────────────

const outPath = path.join(DIST, 'index.html');
fs.writeFileSync(outPath, output, 'utf8');

// ── Summary ──────────────────────────────────────────────────────────────────

const lineCount = output.split('\n').length;
console.log('');
console.log('[build.js] Build complete');
console.log(`  Source files : ${allFiles.length}`);
console.log(`  Output lines : ${lineCount}`);
console.log(`  Output path  : ${outPath}`);
console.log('');
