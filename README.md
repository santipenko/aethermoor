# Aethermoor: Tactical Chronicles

Browser-based tactical RPG. Playable on Android Chrome.

## Play

[https://santipenko.github.io/aethermoor/]

## Development

Edit files in `src/`. Run `node build.js` to rebuild `dist/index.html`.  
Open `dist/index.html` directly in a browser to test locally.  
Push to `main` to deploy automatically via GitHub Actions.

## File Structure

```
src/shell.html                — HTML shell, CSS, game HTML structure
src/shell-narrative-html.html — narrative overlay HTML (title screen, cutscene, save toast)
src/shell-close.html          — closing </script></body></html>
src/00-config.js              — schemas and config constants
src/01-events.js              — event bus
src/02-state.js               — game state object
src/03-units.js               — unit factory
src/04-maps.js                — map definitions (6 maps)
src/05-map-system.js          — map loading and cycling
src/06-turn-system.js         — turn queue and battle end detection
src/07-movement-system.js     — reachable tiles, move, undo move
src/08-input-manager.js       — click/touch/mouse input routing
src/09-terrain-visuals.js     — polished terrain drawing (water anim, grain, rocks)
src/10-vfx-system.js          — ability visual effects
src/11-renderer.js            — canvas renderer including HUD
src/13-helpers.js             — utility functions (getUnit, getUnitAt, syncMapOccupancy)
src/14-core-listeners.js      — GameEvents listeners (damage, heal, turn, battle end)
src/15-init.js                — engine init, window.GameEngine export
src/16-jobs.js                — job definitions
src/17-abilities.js           — ability definitions
src/18-combat-math.js         — damage and heal calculations
src/19-status-system.js       — status effect application and tick
src/20-ability-system.js      — ability execution (damage, heal, buff, AoE, etc.)
src/21-action-menu.js         — in-canvas action menu rendering and hit-testing
src/22-ai-system.js           — per-job AI turn logic
src/23-sound-system.js        — Web Audio API procedural sound (no files)
src/24-save-system.js         — localStorage save/load/clear
src/25-cutscene-engine.js     — typewriter cutscene overlay engine
src/26-story-script.js        — all narrative dialogue and scene content
src/27-narrative-controller.js — game flow orchestration (title → cutscene → battle)
src/28-init-override.js       — DOMContentLoaded startup hook
```

## Build

```sh
node build.js        # produces dist/index.html
```

No npm dependencies. Node.js standard library only.  
Exits with code 1 and prints the missing filename if any `src/` file is absent.

## GitHub Pages Setup

1. Push this repository to GitHub.
2. Go to **Settings → Pages → Source** and select **GitHub Actions**.
3. Push to `main` — the workflow builds and deploys automatically.

## Notes

- `dist/index.html` is generated on every push and is listed in `.gitignore`.  
  The GitHub Actions workflow deploys from the uploaded artifact, not from a committed file.
- The game runs entirely from a single HTML file with no server required.  
  `dist/index.html` can be opened directly via `file://` for local testing.
