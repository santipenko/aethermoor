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
};

