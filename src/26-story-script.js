// --- SECTION: Story Script ---
// All narrative content for the game's three acts.
// =============================================================================
const StoryScript = (() => {

  const INTRO = [
    {
      speaker: 'Aldric',
      portrait: '⚔',
      portraitColor: '#4fc3f7',
      glyph: '⚔',
      bgTint: 'rgba(0,20,50,0.4)',
      text: "Three days since Ashfen sealed the perimeter. They're not soldiers — they're contractors. Someone paid well to make sure no one reaches the vault below these stones."
    },
    {
      speaker: 'Lyra',
      portrait: '✦',
      portraitColor: '#b388ff',
      glyph: '✦',
      bgTint: 'rgba(20,0,50,0.4)',
      text: "The ley-lines are active — more than they should be after four centuries of dormancy. Whatever the Founders entombed here has been waking up. I can feel it through the stone. We need to reach the vault before they do."
    },
    {
      speaker: 'Zara',
      portrait: '◈',
      portraitColor: '#ffd740',
      glyph: '◈',
      bgTint: 'rgba(20,15,0,0.5)',
      text: "Vault, power, destiny — fascinating. I'm more interested in whether we're getting paid when this is over. How many of them are between us and this door?"
    },
    {
      speaker: 'Aldric',
      portrait: '⚔',
      portraitColor: '#4fc3f7',
      glyph: '⚔',
      bgTint: 'rgba(0,20,50,0.4)',
      text: "Grunt's archers hold the outer courtyard. Darkwraith commands the inner gate. They're the vanguard — the real force is still further in. We cut through, we keep moving."
    },
    {
      speaker: 'Kael',
      portrait: '†',
      portraitColor: '#80cbc4',
      glyph: '†',
      bgTint: 'rgba(0,25,40,0.5)',
      text: "I've broken through Ashfen lines before. They fight hard but they fight for coin, not conviction. Hold the formation and they'll crack. Lose it and they won't need to."
    },
    {
      speaker: 'Zara',
      portrait: '◈',
      portraitColor: '#ffd740',
      glyph: '◈',
      bgTint: 'rgba(20,15,0,0.5)',
      text: "Right. Inspiring. Can we go now?"
    },
    {
      speaker: '— SYSTEM —',
      portrait: '◈',
      portraitColor: 'var(--accent)',
      glyph: '◈',
      bgTint: 'rgba(0,30,40,0.6)',
      text: "MISSION: Ruins of Aethermoor. Neutralize all enemy forces. The gate to the causeway lies beyond."
    },
  ];

  const MID = [
    {
      speaker: 'Lyra',
      portrait: '✦',
      portraitColor: '#b388ff',
      glyph: '✦',
      bgTint: 'rgba(20,0,50,0.4)',
      text: "Grunt's dead. Darkwraith pulled back — wounded, not finished. They were the vanguard, Aldric. The main force is regrouping on the causeway."
    },
    {
      speaker: 'Zara',
      portrait: '◈',
      portraitColor: '#ffd740',
      glyph: '◈',
      bgTint: 'rgba(20,15,0,0.5)',
      text: "Of course they are. Nothing about this job has been straightforward. What's a causeway look like when someone's had three days to dig in?"
    },
    {
      speaker: 'Kael',
      portrait: '†',
      portraitColor: '#80cbc4',
      glyph: '†',
      bgTint: 'rgba(0,25,40,0.5)',
      text: "Narrow ground, water on the flanks, high ridges covering both exits. If they've placed archers on the ledges we'll be walking into a kill zone. We move fast or we don't move at all."
    },
    {
      speaker: 'Aldric',
      portrait: '⚔',
      portraitColor: '#4fc3f7',
      glyph: '⚔',
      bgTint: 'rgba(0,20,50,0.4)',
      text: "Then we don't give them time to breathe. The vault isn't going to wait for us to get comfortable. Push through. Stay close."
    },
    {
      speaker: '— SYSTEM —',
      portrait: '◈',
      portraitColor: 'var(--accent)',
      glyph: '◈',
      bgTint: 'rgba(0,30,40,0.6)',
      text: "MISSION: Ashfen Causeway. Breach the enemy line. The passage into the ruins lies ahead."
    },
  ];

  const OUTRO = [
    {
      speaker: 'Aldric',
      portrait: '⚔',
      portraitColor: '#4fc3f7',
      glyph: '⚔',
      bgTint: 'rgba(0,20,40,0.5)',
      text: "The keep is ours. All of them — down. We need thirty seconds to breathe and then we find that vault door."
    },
    {
      speaker: 'Zara',
      portrait: '◈',
      portraitColor: '#ffd740',
      glyph: '◈',
      bgTint: 'rgba(20,15,0,0.5)',
      text: "Found it. But Aldric — this isn't a lock. These glyphs aren't mechanical. They're a warning, carved in seven different scripts over the top of each other. Someone came back to this door more than once to make sure you'd understand: do not open it."
    },
    {
      speaker: 'Lyra',
      portrait: '✦',
      portraitColor: '#b388ff',
      glyph: '✦',
      bgTint: 'rgba(20,0,50,0.5)',
      text: "The ley-lines aren't radiating from the vault — they're flowing into it. Something in there is pulling energy from the entire region. It's been doing it for centuries. And it's not dormant. It is consuming, and it has been waiting for exactly this door to open."
    },
    {
      speaker: 'Kael',
      portrait: '†',
      portraitColor: '#80cbc4',
      glyph: '†',
      bgTint: 'rgba(0,25,40,0.5)',
      text: "Then the real question is the one none of us want to say out loud. The Founders sealed this for a reason — better soldiers than us, with more knowledge than us, decided it had to stay closed. So do we open it?"
    },
    {
      speaker: 'Zara',
      portrait: '◈',
      portraitColor: '#ffd740',
      glyph: '◈',
      bgTint: 'rgba(20,15,0,0.5)',
      text: "We came this far. I'd rather know what we're dealing with than spend the rest of my life wondering if someone else found it first."
    },
    {
      speaker: 'Aldric',
      portrait: '⚔',
      portraitColor: '#4fc3f7',
      glyph: '⚔',
      bgTint: 'rgba(0,20,50,0.5)',
      text: "We open it. That's what we came here for. Stand ready — all of you."
    },
    {
      speaker: '— —',
      portrait: '◈',
      portraitColor: '#b388ff',
      glyph: '✦',
      bgTint: 'rgba(10,0,30,0.9)',
      text: "The vault door splits open. Light — old light, the wrong color — pours into the keep. No one speaks. Everyone takes one step back. Except Aldric, who takes one step forward."
    },
    {
      speaker: '— ACT I COMPLETE —',
      portrait: '◈',
      portraitColor: 'var(--gold)',
      glyph: '◈',
      bgTint: 'rgba(0,0,0,0.92)',
      text: "Aethermoor: Tactical Chronicles  ·  ·  ·  To Be Continued"
    },
  ];

  const DEFEAT_SCENE = [
    {
      speaker: 'Brute',
      portrait: '⚡',
      portraitColor: '#ff6f00',
      glyph: '⚡',
      bgTint: 'rgba(40,10,0,0.7)',
      text: "That's it? I've broken better than you before breakfast. Get up when you can — if you can."
    },
    {
      speaker: 'Sister',
      portrait: '✚',
      portraitColor: '#ff80ab',
      glyph: '✚',
      bgTint: 'rgba(30,0,20,0.6)',
      text: "Oh, don't be ashamed. You were overmatched from the moment you stepped into this field. I've seen it before — good fighters, wrong ground, wrong day. Rest now. I'll see to your wounds."
    },
    {
      speaker: 'Darkwraith',
      portrait: '☽',
      portraitColor: '#9e47ff',
      glyph: '☽',
      bgTint: 'rgba(20,0,40,0.7)',
      text: "You pushed far. Farther than most. But these grounds do not yield to the unprepared. Return when you are ready — if the dead will let you leave."
    },
  ];

  // ── PRE_BATTLE_BANTER — short pre-fight exchanges, one per map (indices 0–3) ──
  // Index 0: map_1, Index 1: map_2, Index 2: map_3, Index 3: map_4
  // (wired into NarrativeController separately — content only here)
  const PRE_BATTLE_BANTER = [
    // Index 0 — map_1: Aldric and Zara
    [
      {
        speaker: 'Zara',
        portrait: '◈',
        portraitColor: '#ffd740',
        glyph: '◈',
        bgTint: 'rgba(20,15,0,0.5)',
        text: "Before we go in — if I find anything valuable in these ruins, that's mine. Pre-agreed. Just so we're clear."
      },
      {
        speaker: 'Aldric',
        portrait: '⚔',
        portraitColor: '#4fc3f7',
        glyph: '⚔',
        bgTint: 'rgba(0,20,50,0.4)',
        text: "Nothing in there belongs to us until the job is done. After that — I'll consider it. Move out."
      },
    ],
    // Index 1 — map_2: Lyra and Kael
    [
      {
        speaker: 'Lyra',
        portrait: '✦',
        portraitColor: '#b388ff',
        glyph: '✦',
        bgTint: 'rgba(20,0,50,0.4)',
        text: "The resonance is stronger here. There's something in the causeway stone — trace enchantments, military-grade. The Founders built this road to last."
      },
      {
        speaker: 'Kael',
        portrait: '†',
        portraitColor: '#80cbc4',
        glyph: '†',
        bgTint: 'rgba(0,25,40,0.5)',
        text: "Good. Then the ground won't shift under us. Focus on what's in front — the road can wait until after."
      },
    ],
    // Index 2 — map_3: Zara and Aldric
    [
      {
        speaker: 'Zara',
        portrait: '◈',
        portraitColor: '#ffd740',
        glyph: '◈',
        bgTint: 'rgba(20,15,0,0.5)',
        text: "Three walls, two chokepoints, one exit. You know who designs a passage like this? Someone who wanted it to be a slaughterhouse."
      },
      {
        speaker: 'Aldric',
        portrait: '⚔',
        portraitColor: '#4fc3f7',
        glyph: '⚔',
        bgTint: 'rgba(0,20,50,0.4)',
        text: "Then we don't give them time to use it that way. Pick a lane and commit — hesitation is what kills you here."
      },
    ],
    // Index 3 — map_4: Kael and Lyra
    [
      {
        speaker: 'Kael',
        portrait: '†',
        portraitColor: '#80cbc4',
        glyph: '†',
        bgTint: 'rgba(0,25,40,0.5)',
        text: "Shallows like this eat heavy armor. I'll take point — if the ground gives way, I'll find out first."
      },
      {
        speaker: 'Lyra',
        portrait: '✦',
        portraitColor: '#b388ff',
        glyph: '✦',
        bgTint: 'rgba(20,0,50,0.4)',
        text: "Your dedication to suffering on our behalf is noted. Just don't drown — I'd rather not lose a paladin to a marsh."
      },
    ],
  ];

  // ── Transition: map_2 → map_3 ────────────────────────────────
  const TRANSITION_2_3 = [
    {
      speaker: 'Aldric',
      portrait: '⚔',
      portraitColor: '#4fc3f7',
      glyph: '⚔',
      bgTint: 'rgba(0,20,50,0.4)',
      text: "The causeway is ours. They're falling back into the passage — old iron walls, tight corridors. One wrong step and we're bottlenecked."
    },
    {
      speaker: 'Kael',
      portrait: '✦',
      portraitColor: '#80cbc4',
      glyph: '†',
      bgTint: 'rgba(0,25,40,0.5)',
      text: "Let them think the walls protect them. I'll take the front. Just keep Lyra out of the chokepoints — she's no good to us cornered."
    },
  ];

  // ── Transition: map_3 → map_4 ────────────────────────────────
  const TRANSITION_3_4 = [
    {
      speaker: 'Zara',
      portrait: '◈',
      portraitColor: '#ffd740',
      glyph: '◈',
      bgTint: 'rgba(0,20,30,0.5)',
      text: "Passage is clear. But smell that? Marsh water. The ground ahead is rotting — half of it's underwater and the rest isn't far behind."
    },
    {
      speaker: 'Lyra',
      portrait: '✦',
      portraitColor: '#b388ff',
      glyph: '✦',
      bgTint: 'rgba(20,0,50,0.4)',
      text: "Stay on the high ground. The shallows will slow us — but they'll slow them too. Pick your crossings carefully."
    },
  ];

  // ── Transition: map_4 → map_5 ────────────────────────────────
  const TRANSITION_4_5 = [
    {
      speaker: 'Brute',
      portrait: '⚡',
      portraitColor: '#ef5350',
      glyph: '⚡',
      bgTint: 'rgba(40,10,0,0.6)',
      text: "You made it through the shallows. Impressive. The escarpment ahead is ours — every ridge, every stone. Come up. We'll be waiting."
    },
    {
      speaker: 'Aldric',
      portrait: '⚔',
      portraitColor: '#4fc3f7',
      glyph: '⚔',
      bgTint: 'rgba(0,20,50,0.4)',
      text: "He wants us rattled. Don't give him it. Uphill fights are won by patience — don't charge the ridge, flank it. Move."
    },
  ];

  // ── Transition: map_5 → map_6 ────────────────────────────────
  const TRANSITION_5_6 = [
    {
      speaker: 'Aldric',
      portrait: '⚔',
      portraitColor: '#4fc3f7',
      glyph: '⚔',
      bgTint: 'rgba(0,20,50,0.4)',
      text: "The escarpment is behind us. One more door. The Shattered Keep — whatever the Founders locked inside, we're about to find out why they didn't want it opened."
    },
    {
      speaker: 'Lyra',
      portrait: '✦',
      portraitColor: '#b388ff',
      glyph: '✦',
      bgTint: 'rgba(20,0,50,0.4)',
      text: "The ley-line pulse is coming from inside those walls. It's strong — stronger than anything natural. Something in the keep is already awake."
    },
  ];

  // ── PRE_BATTLE_3 — Ironhold Passage ──────────────────────────
  const PRE_BATTLE_3 = [
    {
      speaker: 'Kael',
      portrait: '†',
      portraitColor: '#80cbc4',
      glyph: '†',
      bgTint: 'rgba(0,25,40,0.5)',
      text: "Iron walls, iron floors. The passage was built to funnel an army into a killing ground — three lanes, no room to maneuver. Once we commit to one, we can't pull back."
    },
    {
      speaker: 'Aldric',
      portrait: '⚔',
      portraitColor: '#4fc3f7',
      glyph: '⚔',
      bgTint: 'rgba(0,20,50,0.4)',
      text: "Then we pick the right lane before we step in. Lyra — anything ahead? Zara — watch the walls. Ambush points in places like this are carved into the architecture."
    },
    {
      speaker: 'Darkwraith',
      portrait: '☽',
      portraitColor: '#9e47ff',
      glyph: '☽',
      bgTint: 'rgba(20,0,40,0.7)',
      text: "You hear it? The stone remembers every soldier who bled here. Take your time choosing your path — all three lanes lead to the same place. Me."
    },
    {
      speaker: '— SYSTEM —',
      portrait: '◈',
      portraitColor: 'var(--accent)',
      glyph: '◈',
      bgTint: 'rgba(0,30,40,0.6)',
      text: "MISSION: Ironhold Passage. Navigate the iron corridors. Neutralize all enemy forces."
    },
  ];

  // ── PRE_BATTLE_4 — Thornmire Shallows ───────────────────────
  const PRE_BATTLE_4 = [
    {
      speaker: 'Zara',
      portrait: '◈',
      portraitColor: '#ffd740',
      glyph: '◈',
      bgTint: 'rgba(20,15,0,0.5)',
      text: "Wonderful. Nothing I love more than ankle-deep water with a sword in my hand. Which crossing are we taking? Because I count four, and three of them look like traps."
    },
    {
      speaker: 'Lyra',
      portrait: '✦',
      portraitColor: '#b388ff',
      glyph: '✦',
      bgTint: 'rgba(20,0,50,0.4)',
      text: "The water itself carries an old enchantment — weighting, slowing, draining. It's not recent. Someone in the Founder's age seeded the marsh to stop exactly what we're trying to do."
    },
    {
      speaker: 'Zara',
      portrait: '◈',
      portraitColor: '#ffd740',
      glyph: '◈',
      bgTint: 'rgba(20,15,0,0.5)',
      text: "So the ground was rigged four hundred years ago specifically to kill us. Somehow that's not even the strangest thing that's happened this week."
    },
    {
      speaker: '— SYSTEM —',
      portrait: '◈',
      portraitColor: 'var(--accent)',
      glyph: '◈',
      bgTint: 'rgba(0,30,40,0.6)',
      text: "MISSION: Thornmire Shallows. Cross the marsh. Eliminate all enemy units. Avoid the deep water."
    },
  ];

  // ── PRE_BATTLE_5 — Verdant Escarpment ───────────────────────
  const PRE_BATTLE_5 = [
    {
      speaker: 'Brute',
      portrait: '⚡',
      portraitColor: '#ff6f00',
      glyph: '⚡',
      bgTint: 'rgba(40,10,0,0.6)',
      text: "Come on then. Every ridge up here is mine — I've held this escarpment for two days waiting for someone worth fighting. Don't disappoint me."
    },
    {
      speaker: 'Lyra',
      portrait: '✦',
      portraitColor: '#b388ff',
      glyph: '✦',
      bgTint: 'rgba(20,0,50,0.4)',
      text: "He's not wrong — they have every high tile on the board. Attacking uphill into that is going to hurt. We need to force them off the ridge before we engage directly."
    },
    {
      speaker: 'Aldric',
      portrait: '⚔',
      portraitColor: '#4fc3f7',
      glyph: '⚔',
      bgTint: 'rgba(0,20,50,0.4)',
      text: "We've been hurt before. High ground matters — it doesn't decide the fight. Stay tight, advance through the barriers, don't let them pick us apart in the open. We push together or not at all."
    },
    {
      speaker: '— SYSTEM —',
      portrait: '◈',
      portraitColor: 'var(--accent)',
      glyph: '◈',
      bgTint: 'rgba(0,30,40,0.6)',
      text: "MISSION: Verdant Escarpment. Assault the high ground. WARNING — enemy holds elevated advantage across the full front line."
    },
  ];

  // ── PRE_BATTLE_6 — The Shattered Keep ───────────────────────
  const PRE_BATTLE_6 = [
    {
      speaker: 'Lyra',
      portrait: '✦',
      portraitColor: '#b388ff',
      glyph: '✦',
      bgTint: 'rgba(20,0,50,0.5)',
      text: "The ley-lines inside that keep are fracturing. I've never read anything like this — it's as if the vault is pushing back against the walls holding it. Whatever is in there knows we're coming."
    },
    {
      speaker: 'Darkwraith',
      portrait: '☽',
      portraitColor: '#9e47ff',
      glyph: '☽',
      bgTint: 'rgba(20,0,40,0.8)',
      text: "You've come further than I expected. But the keep is the last threshold, and I am the last guardian. I will not move aside for curiosity — or for coin."
    },
    {
      speaker: 'Aldric',
      portrait: '⚔',
      portraitColor: '#4fc3f7',
      glyph: '⚔',
      bgTint: 'rgba(0,20,50,0.4)',
      text: "We didn't cross a causeway, a marsh, a passage, and an escarpment to stop at a gate. Every one of us chose to be here. Whatever's waiting on the other side — we face it the same way we faced everything else. Together."
    },
    {
      speaker: '— SYSTEM —',
      portrait: '◈',
      portraitColor: 'var(--accent)',
      glyph: '◈',
      bgTint: 'rgba(0,30,40,0.6)',
      text: "MISSION: The Shattered Keep. Final engagement. Breach the inner fortress. End it."
    },
  ];

  return { INTRO, MID, OUTRO, DEFEAT_SCENE, PRE_BATTLE_BANTER, PRE_BATTLE_3, PRE_BATTLE_4, PRE_BATTLE_5, PRE_BATTLE_6, TRANSITION_2_3, TRANSITION_3_4, TRANSITION_4_5, TRANSITION_5_6 };
})();

// =============================================================================
