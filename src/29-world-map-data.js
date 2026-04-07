// --- SECTION: World Map Data ---
// Node structure:
// {
//   id: string          — matches mapId used in SaveSystem and MapSystem.load()
//   label: string       — display name
//   act: number         — which act this node belongs to
//   type: string        — 'main', 'side', or 'secret'
//   unlockCondition: object|null  — condition evaluated by SaveSystem.evaluateCondition()
//                                   null means always available once previous node complete
//   connections: array  — ids of nodes this connects to (for future visual routing)
//   mapId: string       — the map definition id to load
// }

const WORLD_MAP_NODES = {

  // ── Act 1 ──────────────────────────────────────────────────
  act1_m1: {
    id: 'act1_m1', label: 'Ruins of Aethermoor', act: 1, type: 'main',
    unlockCondition: null, connections: ['act1_m2'], mapId: 'map_1'
  },

  act1_m2: {
    id: 'act1_m2', label: 'Ashfen Causeway', act: 1, type: 'main',
    unlockCondition: { type: 'map_completed', mapId: 'act1_m1' },
    connections: ['act1_m3'], mapId: 'map_2'
  },

  act1_m3: {
    id: 'act1_m3', label: 'Ironhold Passage', act: 1, type: 'main',
    unlockCondition: { type: 'map_completed', mapId: 'act1_m2' },
    connections: ['act1_m4'], mapId: 'map_3'
  },

  act1_m4: {
    id: 'act1_m4', label: 'Thornmire Shallows', act: 1, type: 'main',
    unlockCondition: { type: 'map_completed', mapId: 'act1_m3' },
    connections: ['act1_m5'], mapId: 'map_4'
  },

  act1_m5: {
    id: 'act1_m5', label: 'Verdant Escarpment', act: 1, type: 'main',
    unlockCondition: { type: 'map_completed', mapId: 'act1_m4' },
    connections: ['act1_m6'], mapId: 'map_5'
  },

  act1_m6: {
    id: 'act1_m6', label: 'The Shattered Keep', act: 1, type: 'main',
    unlockCondition: { type: 'map_completed', mapId: 'act1_m5' },
    connections: [], mapId: 'map_6'
  },

  // ── Act 2 ──────────────────────────────────────────────────
  act2_m1: {
    id: 'act2_m1', label: 'The Ashfen Wood', act: 2, type: 'main',
    unlockCondition: { type: 'map_completed', mapId: 'act1_m6' },
    connections: ['act2_m2'], mapId: 'act2_m1'
  },

  act2_m2: {
    id: 'act2_m2', label: 'Cinder Hollow', act: 2, type: 'main',
    unlockCondition: { type: 'map_completed', mapId: 'act2_m1' },
    connections: ['act2_m3', 'act2_side1'], mapId: 'act2_m2'
  },

  act2_side1: {
    id: 'act2_side1', label: 'The Ley Scar', act: 2, type: 'side',
    unlockCondition: {
      type: 'all_of', conditions: [
        { type: 'map_completed', mapId: 'act2_m2' },
        { type: 'flag', flag: 'heard_of_ley_scar' }
      ]
    },
    connections: [], mapId: 'act2_side1'
  },

  act2_m3: {
    id: 'act2_m3', label: 'The Sunken Road', act: 2, type: 'main',
    unlockCondition: { type: 'map_completed', mapId: 'act2_m2' },
    connections: ['act2_m4'], mapId: 'act2_m3'
  },

  act2_m4: {
    id: 'act2_m4', label: 'Thornback Ridge', act: 2, type: 'main',
    unlockCondition: { type: 'map_completed', mapId: 'act2_m3' },
    connections: ['act2_m5'], mapId: 'act2_m4'
  },

  act2_m5: {
    id: 'act2_m5', label: 'The Relay Station', act: 2, type: 'main',
    unlockCondition: { type: 'map_completed', mapId: 'act2_m4' },
    connections: [], mapId: 'act2_m5'
  },

};
