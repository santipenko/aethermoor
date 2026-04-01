// --- SECTION: Event Bus ---
const GameEvents = (() => {
  const _l = {};
  function on(e,cb){ if(!_l[e])_l[e]=[]; _l[e].push(cb); return ()=>{ _l[e]=_l[e].filter(x=>x!==cb); }; }
  function off(e,cb){ if(_l[e])_l[e]=_l[e].filter(x=>x!==cb); }
  function emit(e,d){ console.log(`[GameEvents] ${e}`,d??''); if(!_l[e])return; _l[e].forEach(cb=>{ try{cb(d);}catch(ex){console.error(ex);} }); }
  function once(e,cb){ const u=on(e,d=>{cb(d);u();}); }
  return { on, off, emit, once };
})();

