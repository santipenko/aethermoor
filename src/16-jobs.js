// --- SECTION: Job Definitions ---
const JOBS = {
  'Knight':     { label:'Knight',     icon:'⚔', baseStats:{ maxHp:140, maxMp:20,  attack:16, defense:16, speed:3, moveRange:3 }, abilities:['Attack','Shield Bash','Wait'], description:'Stalwart defender. High HP/DEF, low SPD.' },
  'Mage':       { label:'Mage',       icon:'✦', baseStats:{ maxHp:65,  maxMp:90,  attack:24, defense:5,  speed:8, moveRange:4 }, abilities:['Attack','Fireball','Heal','Wait'], description:'Arcane wielder. High MP/ATK, fragile.' },
  'Archer':     { label:'Archer',     icon:'◎', baseStats:{ maxHp:85,  maxMp:20,  attack:15, defense:8,  speed:6, moveRange:3 }, abilities:['Attack','Arrow Shot','Wait'], description:'Ranged combatant. Balanced stats.' },
  'Dark Knight':{ label:'Dark Knight',icon:'☽', baseStats:{ maxHp:115, maxMp:50,  attack:22, defense:12, speed:4, moveRange:2 }, abilities:['Attack','Dark Wave','Wait'], description:'Shadowy warrior. High ATK, costs MP.' },
  'Healer':     { label:'Healer',     icon:'✚', baseStats:{ maxHp:75,  maxMp:100, attack:8,  defense:8,  speed:7, moveRange:4 }, abilities:['Attack','Mend','Revive','Wait'],          description:'Support caster. High MP, low ATK.' },
  'Thief':      { label:'Thief',      icon:'◈', baseStats:{ maxHp:80,  maxMp:40,  attack:14, defense:6,  speed:9, moveRange:5 }, abilities:['Attack','Steal Mana','Smoke Bomb','Wait'], description:'Swift rogue. High SPD and move range.' },
  'Paladin':    { label:'Paladin',    icon:'✦', baseStats:{ maxHp:120, maxMp:60,  attack:14, defense:18, speed:4, moveRange:3 }, abilities:['Attack','Holy Lance','Barrier','Wait'],    description:'Holy defender. High DEF, ranged strike.' },
  'Berserker':  { label:'Berserker',  icon:'⚡', baseStats:{ maxHp:130, maxMp:0,   attack:28, defense:7,  speed:5, moveRange:3 }, abilities:['Attack','Rampage','Wait'],                description:'Unstoppable berserker. Extreme ATK.' },

  // ── Advanced Jobs ───────────────────────────────────────────
  'Spellblade': {
    label: 'Spellblade', icon: '✦',
    baseStats: {
      maxHp: 110, maxMp: 60, attack: 20, defense: 12, speed: 6, moveRange: 3
    },
    abilities: ['Attack', 'Arcane Strike', 'Spellbreak', 'Wait'],
    description: 'Melee fighter channeling magic through strikes. High ATK, hybrid stats.'
  },

  'Sentinel': {
    label: 'Sentinel', icon: '◉',
    baseStats: {
      maxHp: 160, maxMp: 40, attack: 14, defense: 22, speed: 2, moveRange: 1
    },
    abilities: ['Attack', 'Cover', 'Fortify', 'Wait'],
    description: 'Immovable defender. Extreme DEF and HP, protects adjacent allies.'
  },

  'Phantom': {
    label: 'Phantom', icon: '◎',
    baseStats: {
      maxHp: 70, maxMp: 60, attack: 16, defense: 4, speed: 14, moveRange: 6
    },
    abilities: ['Attack', 'Phase Step', 'Mirage', 'Wait'],
    description: 'Perfect mobility. Extreme SPD, can pass through enemies.'
  },

  'Warlord': {
    label: 'Warlord', icon: '!',
    baseStats: {
      maxHp: 150, maxMp: 20, attack: 24, defense: 18, speed: 4, moveRange: 3
    },
    abilities: ['Attack', 'Intimidate', 'Battle Cry', 'Wait'],
    description: 'Disciplined power. High ATK and DEF, inspires nearby allies.'
  },

  'Sage': {
    label: 'Sage', icon: '✦',
    baseStats: {
      maxHp: 72, maxMp: 120, attack: 18, defense: 8, speed: 7, moveRange: 4
    },
    abilities: ['Attack', 'Ley Weave', 'Dispel', 'Wait'],
    description: 'Arcane wisdom. Battlefield manipulation, extended AoE, terrain effects.'
  },

  'Invoker': {
    label: 'Invoker', icon: '❧',
    baseStats: {
      maxHp: 82, maxMp: 90, attack: 14, defense: 10, speed: 5, moveRange: 3
    },
    abilities: ['Attack', 'Call Earth', 'Surge', 'Wait'],
    description: 'Commands the land as a weapon. Environmental abilities, aggressive terrain.'
  },

  'Reckoner': {
    label: 'Reckoner', icon: '◈',
    baseStats: {
      maxHp: 78, maxMp: 80, attack: 12, defense: 10, speed: 6, moveRange: 3
    },
    abilities: ['Attack', 'Foreknowledge', 'Historical Debt', 'Wait'],
    description: 'Tactical historian. Predicts and negates enemy abilities.'
  },
};
