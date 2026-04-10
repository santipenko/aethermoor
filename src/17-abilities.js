// --- SECTION: Ability Definitions ---
const ABILITIES = {
  'Attack':     { id:'Attack',     name:'Attack',     icon:'⚔', power:10, mpCost:0,  range:1, targetType:'enemy', type:'damage', aoe:false, aoeTiles:null, statusEffect:null, statusChance:0,   pushBack:false, description:'Basic melee strike.' },
  'Shield Bash':{ id:'Shield Bash',name:'Shield Bash',icon:'O', power:6,  mpCost:0,  range:1, targetType:'enemy', type:'damage', aoe:false, aoeTiles:null, statusEffect:'stun',  statusChance:0.5, pushBack:true,  description:'Bash with shield. May stun & push back.' },
  'Fireball':   { id:'Fireball',   name:'Fireball',   icon:'*', power:18, mpCost:20, range:3, targetType:'any',   type:'damage', aoe:true,
    aoeTiles:(tx,ty)=>{ const t=[]; for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++)t.push({x:tx+dx,y:ty+dy}); return t; },
    statusEffect:null, statusChance:0, pushBack:false, description:'AoE blast 1-tile radius. 20 MP.' },
  'Heal':       { id:'Heal',       name:'Heal',       icon:'+', power:25, mpCost:15, range:2, targetType:'ally',  type:'heal',   aoe:false, aoeTiles:null, statusEffect:null, statusChance:0,   pushBack:false, description:'Restore HP to ally. 15 MP.' },
  'Arrow Shot': { id:'Arrow Shot', name:'Arrow Shot', icon:'~', power:12, mpCost:0,  range:2, targetType:'enemy', type:'damage', aoe:false, aoeTiles:null, statusEffect:'slow', statusChance:0.3, pushBack:false, description:'2-tile ranged attack. May slow.' },
  'Dark Wave':  { id:'Dark Wave',  name:'Dark Wave',  icon:')', power:20, mpCost:18, range:3, targetType:'any',   type:'damage', aoe:true,
    aoeTiles:(tx,ty,caster)=>{
      if(!caster)return[{x:tx,y:ty}];
      const dx=Math.sign(tx-caster.x),dy=Math.sign(ty-caster.y);
      const t=[]; let cx=caster.x+dx,cy=caster.y+dy;
      for(let i=0;i<4;i++){
        if(cx<0||cy<0||cx>=CONFIG.GRID_COLS||cy>=CONFIG.GRID_ROWS)break;
        t.push({x:cx,y:cy}); cx+=dx; cy+=dy;
      }
      return t;
    },
    statusEffect:'poison', statusChance:0.4, pushBack:false, description:'Line attack. May poison. 18 MP.' },
  'Wait':       { id:'Wait',       name:'Wait',       icon:'z', power:0,  mpCost:0,  range:0, targetType:'self',  type:'wait',   aoe:false, aoeTiles:null, statusEffect:null, statusChance:0,   pushBack:false, description:'End your turn.' },
  'Mend':       { id:'Mend',       name:'Mend',       icon:'+', power:18, mpCost:8,  range:2, targetType:'ally',  type:'heal',      aoe:false, aoeTiles:null, statusEffect:null, statusChance:0,   pushBack:false, description:'Restore HP to nearby ally. 8 MP.' },
  'Revive':     { id:'Revive',     name:'Revive',     icon:'✚', power:0,  mpCost:30, range:1, targetType:'ally',  type:'revive',    aoe:false, aoeTiles:null, statusEffect:null, statusChance:0,   pushBack:false, description:'Restore fallen ally to 25% HP. 30 MP.' },
  'Steal Mana': { id:'Steal Mana', name:'Steal Mana', icon:'◈', power:4,  mpCost:0,  range:1, targetType:'enemy', type:'steal_mp',  aoe:false, aoeTiles:null, statusEffect:null, statusChance:0,   pushBack:false, description:'Drain 20 MP from target. Deals minor damage.' },
  'Smoke Bomb': { id:'Smoke Bomb', name:'Smoke Bomb', icon:'◎', power:0,  mpCost:12, range:0, targetType:'self',  type:'smoke',     aoe:false, aoeTiles:null, statusEffect:null, statusChance:0,   pushBack:false, description:'Slow & push back all adjacent enemies. 12 MP.' },
  'Holy Lance': { id:'Holy Lance', name:'Holy Lance', icon:'†', power:16, mpCost:10, range:2, targetType:'enemy', type:'piercing',  aoe:false, aoeTiles:null, statusEffect:null, statusChance:0,   pushBack:false, description:'Ranged holy strike. Ignores 50% DEF. 10 MP.' },
  'Barrier':    { id:'Barrier',    name:'Barrier',    icon:'◉', power:0,  mpCost:14, range:2, targetType:'ally',  type:'buff',      aoe:false, aoeTiles:null, statusEffect:null, statusChance:0,   pushBack:false, description:'Grant ally a damage-absorbing shield. 14 MP.' },
  'Rampage':    { id:'Rampage',    name:'Rampage',    icon:'⚡', power:14, mpCost:0,  range:1, targetType:'any',   type:'damage',    aoe:true,
    aoeTiles:(tx,ty,caster)=>{ const t=[]; for(let dy=-1;dy<=1;dy++) for(let dx=-1;dx<=1;dx++) if(dx!==0||dy!==0) t.push({x:caster.x+dx,y:caster.y+dy}); return t; },
    statusEffect:null, statusChance:0, pushBack:false, description:'Strike all surrounding tiles.' },

  // ── Act 2 abilities ────────────────────────────────────────
  'Scout Shot': { id:'Scout Shot', name:'Scout Shot', icon:'~', power:10, mpCost:8,  range:3, targetType:'enemy', type:'damage', aoe:false, aoeTiles:null, statusEffect:'slow', statusChance:1.0, pushBack:false, description:'Ranged shot. Always slows target. 8 MP.' },

  'Vanish':     { id:'Vanish',     name:'Vanish',     icon:'◎', power:0,  mpCost:14, range:0, targetType:'self',  type:'buff',   aoe:false, aoeTiles:null, statusEffect:'hidden', statusChance:1.0, pushBack:false, description:'Become untargetable by enemies for 1 turn. 14 MP.' },

  'Root':       { id:'Root',       name:'Root',       icon:'❧', power:0,  mpCost:10, range:2, targetType:'enemy', type:'root',   aoe:false, aoeTiles:null, statusEffect:'rooted', statusChance:1.0, pushBack:false, description:'Immobilize target for 2 turns. 10 MP.' },

  'Ley Pulse':  { id:'Ley Pulse',  name:'Ley Pulse',  icon:'◈', power:12, mpCost:0,  range:1, targetType:'any',   type:'damage', aoe:true,
    aoeTiles:(tx,ty,caster)=>{
      const t=[];
      for(let dy=-1;dy<=1;dy++)
        for(let dx=-1;dx<=1;dx++)
          if(dx!==0||dy!==0) t.push({x:caster.x+dx,y:caster.y+dy});
      return t;
    },
    statusEffect:null, statusChance:0, pushBack:false, description:'AoE pulse around caster. Free once per battle.' },

  'Rally':      { id:'Rally',      name:'Rally',      icon:'!', power:0,  mpCost:12, range:0, targetType:'self',  type:'rally',  aoe:false, aoeTiles:null, statusEffect:'rallied', statusChance:1.0, pushBack:false, description:'Boost adjacent allies attack for 2 turns. 12 MP.' },

  'Shield Wall':{ id:'Shield Wall',name:'Shield Wall',icon:'◉', power:0,  mpCost:18, range:0, targetType:'self',  type:'shield_wall', aoe:false, aoeTiles:null, statusEffect:'shield', statusChance:1.0, pushBack:false, description:'Grant shield to self and adjacent allies. 18 MP.' },

  'Suppress':   { id:'Suppress',   name:'Suppress',   icon:')', power:0,  mpCost:20, range:3, targetType:'enemy', type:'suppress', aoe:false, aoeTiles:null, statusEffect:'suppressed', statusChance:1.0, pushBack:false, description:'Silence target for 2 turns. Cannot use abilities. 20 MP.' },

  // ── Advanced job stub abilities ────────────────────────────
  'Arcane Strike':   { id:'Arcane Strike',   name:'Arcane Strike',   icon:'✦', power:16, mpCost:8,  range:1, targetType:'enemy', type:'damage',   aoe:false, aoeTiles:null, statusEffect:null,        statusChance:0,   pushBack:false, description:'Melee strike infused with arcane energy. 8 MP.' },
  'Spellbreak':      { id:'Spellbreak',      name:'Spellbreak',      icon:')', power:10, mpCost:10, range:1, targetType:'enemy', type:'damage',   aoe:false, aoeTiles:null, statusEffect:'suppressed', statusChance:0.6, pushBack:false, description:'Strike that disrupts magical focus. May suppress. 10 MP.' },
  'Cover':           { id:'Cover',           name:'Cover',           icon:'◉', power:0,  mpCost:10, range:1, targetType:'ally',  type:'buff',     aoe:false, aoeTiles:null, statusEffect:'shield',     statusChance:1.0, pushBack:false, description:'Grant shield to adjacent ally. 10 MP.' },
  'Fortify':         { id:'Fortify',         name:'Fortify',         icon:'◉', power:0,  mpCost:14, range:0, targetType:'self',  type:'buff',     aoe:false, aoeTiles:null, statusEffect:'shield',     statusChance:1.0, pushBack:false, description:'Fortify self — gain shield and +4 defense for 2 turns. 14 MP.' },
  'Phase Step':      { id:'Phase Step',      name:'Phase Step',      icon:'◎', power:8,  mpCost:10, range:2, targetType:'enemy', type:'damage',   aoe:false, aoeTiles:null, statusEffect:'slow',       statusChance:0.5, pushBack:false, description:'Rapid strike from unexpected angle. May slow. 10 MP.' },
  'Mirage':          { id:'Mirage',          name:'Mirage',          icon:'◎', power:0,  mpCost:16, range:0, targetType:'self',  type:'buff',     aoe:false, aoeTiles:null, statusEffect:'hidden',     statusChance:1.0, pushBack:false, description:'Create a decoy — become hidden for 2 turns. 16 MP.' },
  'Intimidate':      { id:'Intimidate',      name:'Intimidate',      icon:'!', power:0,  mpCost:12, range:2, targetType:'enemy', type:'suppress', aoe:false, aoeTiles:null, statusEffect:'suppressed', statusChance:0.7, pushBack:false, description:'Suppress target with overwhelming presence. 12 MP.' },
  'Battle Cry':      { id:'Battle Cry',      name:'Battle Cry',      icon:'!', power:0,  mpCost:14, range:0, targetType:'self',  type:'rally',    aoe:false, aoeTiles:null, statusEffect:'rallied',    statusChance:1.0, pushBack:false, description:'Inspire adjacent allies — rally all nearby units. 14 MP.' },
  'Ley Weave':       { id:'Ley Weave',       name:'Ley Weave',       icon:'✦', power:14, mpCost:18, range:4, targetType:'any',   type:'damage',   aoe:true,
    aoeTiles:(tx,ty)=>{ const t=[]; for(let dy=-1;dy<=1;dy++) for(let dx=-1;dx<=1;dx++) t.push({x:tx+dx,y:ty+dy}); return t; },
    statusEffect:null, statusChance:0, pushBack:false, description:'Extended AoE ley-line blast. Range 4, 1-tile radius. 18 MP.' },
  'Dispel':          { id:'Dispel',          name:'Dispel',          icon:'✦', power:0,  mpCost:12, range:2, targetType:'enemy', type:'suppress', aoe:false, aoeTiles:null, statusEffect:'suppressed', statusChance:1.0, pushBack:false, description:'Strip target of active status effects and suppress. 12 MP.' },
  'Call Earth':      { id:'Call Earth',      name:'Call Earth',      icon:'❧', power:10, mpCost:14, range:2, targetType:'enemy', type:'root',     aoe:false, aoeTiles:null, statusEffect:'rooted',     statusChance:1.0, pushBack:false, description:'Call the earth to seize a target. Root for 3 turns. 14 MP.' },
  'Surge':           { id:'Surge',           name:'Surge',           icon:'❧', power:18, mpCost:16, range:1, targetType:'any',   type:'damage',   aoe:true,
    aoeTiles:(tx,ty,caster)=>{ const t=[]; for(let dy=-1;dy<=1;dy++) for(let dx=-1;dx<=1;dx++) if(dx!==0||dy!==0) t.push({x:caster.x+dx,y:caster.y+dy}); return t; },
    statusEffect:null, statusChance:0, pushBack:true, description:'Surge of natural force — AoE push-back around caster. 16 MP.' },
  'Foreknowledge':   { id:'Foreknowledge',   name:'Foreknowledge',   icon:'◈', power:0,  mpCost:10, range:3, targetType:'enemy', type:'suppress', aoe:false, aoeTiles:null, statusEffect:'suppressed', statusChance:1.0, pushBack:false, description:'Predict and negate target ability for 2 turns. 10 MP.' },
  'Historical Debt': { id:'Historical Debt', name:'Historical Debt', icon:'◈', power:22, mpCost:20, range:2, targetType:'enemy', type:'piercing', aoe:false, aoeTiles:null, statusEffect:'slow',       statusChance:0.8, pushBack:false, description:'Strike using knowledge of target weakness. Piercing, may slow. 20 MP.' },
};
