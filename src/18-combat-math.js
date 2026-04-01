// --- SECTION: Combat Math ---
const CombatMath = {
  calcDamage(attacker, defender, ability){
    let base = Math.max(1, ability.power + attacker.attack - defender.defense);
    const tile = GameState.map[attacker.y] && GameState.map[attacker.y][attacker.x];
    if(tile && tile.elevation > 0) base = Math.ceil(base * 1.15);
    return Math.max(1, Math.round(base * (0.9 + Math.random() * 0.2)));
  },
  calcHeal(healer, ability){
    return Math.round(ability.power + Math.floor(healer.attack * 0.5));
  },
};

