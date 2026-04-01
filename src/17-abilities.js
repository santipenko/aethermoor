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
};

