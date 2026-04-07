// --- SECTION: Story Script ---
// All narrative content for the game's acts.
// =============================================================================
const StoryScript = (() => {

  const INTRO = [
    {
      speaker: 'Aldric',
      portrait: '⚔', portraitColor: '#4fc3f7',
      glyph: '⚔', bgTint: 'rgba(0,20,50,0.4)',
      text: "Three days since Ashfen sealed the perimeter. They're not soldiers — they're contractors. Someone paid well to make sure no one reaches the vault below these stones."
    },
    {
      speaker: 'Lyra',
      portrait: '✦', portraitColor: '#b388ff',
      glyph: '✦', bgTint: 'rgba(20,0,50,0.4)',
      text: "The ley-lines are active — more than they should be after four centuries of dormancy. Whatever the Founders entombed here has been waking up. I can feel it through the stone. We need to reach the vault before they do."
    },
    {
      speaker: 'Zara',
      portrait: '◈', portraitColor: '#ffd740',
      glyph: '◈', bgTint: 'rgba(20,15,0,0.5)',
      text: "Vault, power, destiny — fascinating. I'm more interested in whether we're getting paid when this is over. How many of them are between us and this door?"
    },
    {
      speaker: 'Aldric',
      portrait: '⚔', portraitColor: '#4fc3f7',
      glyph: '⚔', bgTint: 'rgba(0,20,50,0.4)',
      text: "Grunt's archers hold the outer courtyard. Darkwraith commands the inner gate. They're the vanguard — the real force is still further in. We cut through, we keep moving."
    },
    {
      speaker: 'Kael',
      portrait: '†', portraitColor: '#80cbc4',
      glyph: '†', bgTint: 'rgba(0,25,40,0.5)',
      text: "I've broken through Ashfen lines before. They fight hard but they fight for coin, not conviction. Hold the formation and they'll crack. Lose it and they won't need to."
    },
    {
      speaker: 'Zara',
      portrait: '◈', portraitColor: '#ffd740',
      glyph: '◈', bgTint: 'rgba(20,15,0,0.5)',
      text: "Right. Inspiring. Can we go now?"
    },
    {
      speaker: '— SYSTEM —',
      portrait: '◈', portraitColor: 'var(--accent)',
      glyph: '◈', bgTint: 'rgba(0,30,40,0.6)',
      text: "MISSION: Ruins of Aethermoor. Neutralize all enemy forces. The gate to the causeway lies beyond."
    },
  ];

  const MID = [
    {
      speaker: 'Lyra',
      portrait: '✦', portraitColor: '#b388ff',
      glyph: '✦', bgTint: 'rgba(20,0,50,0.4)',
      text: "Grunt's dead. Darkwraith pulled back — wounded, not finished. They were the vanguard, Aldric. The main force is regrouping on the causeway."
    },
    {
      speaker: 'Zara',
      portrait: '◈', portraitColor: '#ffd740',
      glyph: '◈', bgTint: 'rgba(20,15,0,0.5)',
      text: "Of course they are. Nothing about this job has been straightforward. What's a causeway look like when someone's had three days to dig in?"
    },
    {
      speaker: 'Kael',
      portrait: '†', portraitColor: '#80cbc4',
      glyph: '†', bgTint: 'rgba(0,25,40,0.5)',
      text: "Narrow ground, water on the flanks, high ridges covering both exits. If they've placed archers on the ledges we'll be walking into a kill zone. We move fast or we don't move at all."
    },
    {
      speaker: 'Aldric',
      portrait: '⚔', portraitColor: '#4fc3f7',
      glyph: '⚔', bgTint: 'rgba(0,20,50,0.4)',
      text: "Then we don't give them time to breathe. The vault isn't going to wait for us to get comfortable. Push through. Stay close."
    },
    {
      speaker: '— SYSTEM —',
      portrait: '◈', portraitColor: 'var(--accent)',
      glyph: '◈', bgTint: 'rgba(0,30,40,0.6)',
      text: "MISSION: Ashfen Causeway. Breach the enemy line. The passage into the ruins lies ahead."
    },
  ];

  const OUTRO = [
    {
      speaker: 'Aldric',
      portrait: '⚔', portraitColor: '#4fc3f7',
      glyph: '⚔', bgTint: 'rgba(0,20,40,0.5)',
      text: "The keep is ours. All of them — down. We need thirty seconds to breathe and then we find that vault door."
    },
    {
      speaker: 'Zara',
      portrait: '◈', portraitColor: '#ffd740',
      glyph: '◈', bgTint: 'rgba(20,15,0,0.5)',
      text: "Found it. But Aldric — this isn't a lock. These glyphs aren't mechanical. They're a warning, carved in seven different scripts over the top of each other. Someone came back to this door more than once to make sure you'd understand: do not open it."
    },
    {
      speaker: 'Lyra',
      portrait: '✦', portraitColor: '#b388ff',
      glyph: '✦', bgTint: 'rgba(20,0,50,0.5)',
      text: "The ley-lines aren't radiating from the vault — they're flowing into it. Something in there is pulling energy from the entire region. It's been doing it for centuries. And it's not dormant. It is consuming, and it has been waiting for exactly this door to open."
    },
    {
      speaker: 'Kael',
      portrait: '†', portraitColor: '#80cbc4',
      glyph: '†', bgTint: 'rgba(0,25,40,0.5)',
      text: "Then the real question is the one none of us want to say out loud. The Founders sealed this for a reason — better soldiers than us, with more knowledge than us, decided it had to stay closed. So do we open it?"
    },
    {
      speaker: 'Zara',
      portrait: '◈', portraitColor: '#ffd740',
      glyph: '◈', bgTint: 'rgba(20,15,0,0.5)',
      text: "We came this far. I'd rather know what we're dealing with than spend the rest of my life wondering if someone else found it first."
    },
    {
      speaker: 'Aldric',
      portrait: '⚔', portraitColor: '#4fc3f7',
      glyph: '⚔', bgTint: 'rgba(0,20,50,0.5)',
      text: "We open it. That's what we came here for. Stand ready — all of you."
    },
    {
      speaker: '— —',
      portrait: '◈', portraitColor: '#b388ff',
      glyph: '✦', bgTint: 'rgba(10,0,30,0.9)',
      text: "The vault door splits open. Light — old light, the wrong color — pours into the keep. No one speaks. Everyone takes one step back. Except Aldric, who takes one step forward."
    },
    {
      speaker: '— ACT I COMPLETE —',
      portrait: '◈', portraitColor: 'var(--gold)',
      glyph: '◈', bgTint: 'rgba(0,0,0,0.92)',
      text: "Aethermoor: Tactical Chronicles  ·  ·  ·  To Be Continued"
    },
  ];

  const DEFEAT_SCENE = [
    {
      speaker: 'Brute',
      portrait: '⚡', portraitColor: '#ff6f00',
      glyph: '⚡', bgTint: 'rgba(40,10,0,0.7)',
      text: "That's it? I've broken better than you before breakfast. Get up when you can — if you can."
    },
    {
      speaker: 'Sister',
      portrait: '✚', portraitColor: '#ff80ab',
      glyph: '✚', bgTint: 'rgba(30,0,20,0.6)',
      text: "Oh, don't be ashamed. You were overmatched from the moment you stepped into this field. I've seen it before — good fighters, wrong ground, wrong day. Rest now. I'll see to your wounds."
    },
    {
      speaker: 'Darkwraith',
      portrait: '☽', portraitColor: '#9e47ff',
      glyph: '☽', bgTint: 'rgba(20,0,40,0.7)',
      text: "You pushed far. Farther than most. But these grounds do not yield to the unprepared. Return when you are ready — if the dead will let you leave."
    },
  ];

  const PRE_BATTLE_BANTER = [
    // Index 0 — map_1: Aldric and Zara
    [
      {
        speaker: 'Zara',
        portrait: '◈', portraitColor: '#ffd740',
        glyph: '◈', bgTint: 'rgba(20,15,0,0.5)',
        text: "Before we go in — if I find anything valuable in these ruins, that's mine. Pre-agreed. Just so we're clear."
      },
      {
        speaker: 'Aldric',
        portrait: '⚔', portraitColor: '#4fc3f7',
        glyph: '⚔', bgTint: 'rgba(0,20,50,0.4)',
        text: "Nothing in there belongs to us until the job is done. After that — I'll consider it. Move out."
      },
    ],
    // Index 1 — map_2: Lyra and Kael
    [
      {
        speaker: 'Lyra',
        portrait: '✦', portraitColor: '#b388ff',
        glyph: '✦', bgTint: 'rgba(20,0,50,0.4)',
        text: "The resonance is stronger here. There's something in the causeway stone — trace enchantments, military-grade. The Founders built this road to last."
      },
      {
        speaker: 'Kael',
        portrait: '†', portraitColor: '#80cbc4',
        glyph: '†', bgTint: 'rgba(0,25,40,0.5)',
        text: "Good. Then the ground won't shift under us. Focus on what's in front — the road can wait until after."
      },
    ],
    // Index 2 — map_3: Zara and Aldric
    [
      {
        speaker: 'Zara',
        portrait: '◈', portraitColor: '#ffd740',
        glyph: '◈', bgTint: 'rgba(20,15,0,0.5)',
        text: "Three walls, two chokepoints, one exit. You know who designs a passage like this? Someone who wanted it to be a slaughterhouse."
      },
      {
        speaker: 'Aldric',
        portrait: '⚔', portraitColor: '#4fc3f7',
        glyph: '⚔', bgTint: 'rgba(0,20,50,0.4)',
        text: "Then we don't give them time to use it that way. Pick a lane and commit — hesitation is what kills you here."
      },
    ],
    // Index 3 — map_4: Kael and Lyra
    [
      {
        speaker: 'Kael',
        portrait: '†', portraitColor: '#80cbc4',
        glyph: '†', bgTint: 'rgba(0,25,40,0.5)',
        text: "Shallows like this eat heavy armor. I'll take point — if the ground gives way, I'll find out first."
      },
      {
        speaker: 'Lyra',
        portrait: '✦', portraitColor: '#b388ff',
        glyph: '✦', bgTint: 'rgba(20,0,50,0.4)',
        text: "Your dedication to suffering on our behalf is noted. Just don't drown — I'd rather not lose a paladin to a marsh."
      },
    ],
  ];

  const TRANSITION_2_3 = [
    {
      speaker: 'Aldric',
      portrait: '⚔', portraitColor: '#4fc3f7',
      glyph: '⚔', bgTint: 'rgba(0,20,50,0.4)',
      text: "The causeway is ours. They're falling back into the passage — old iron walls, tight corridors. One wrong step and we're bottlenecked."
    },
    {
      speaker: 'Kael',
      portrait: '✦', portraitColor: '#80cbc4',
      glyph: '†', bgTint: 'rgba(0,25,40,0.5)',
      text: "Let them think the walls protect them. I'll take the front. Just keep Lyra out of the chokepoints — she's no good to us cornered."
    },
  ];

  const TRANSITION_3_4 = [
    {
      speaker: 'Zara',
      portrait: '◈', portraitColor: '#ffd740',
      glyph: '◈', bgTint: 'rgba(0,20,30,0.5)',
      text: "Passage is clear. But smell that? Marsh water. The ground ahead is rotting — half of it's underwater and the rest isn't far behind."
    },
    {
      speaker: 'Lyra',
      portrait: '✦', portraitColor: '#b388ff',
      glyph: '✦', bgTint: 'rgba(20,0,50,0.4)',
      text: "Stay on the high ground. The shallows will slow us — but they'll slow them too. Pick your crossings carefully."
    },
  ];

  const TRANSITION_4_5 = [
    {
      speaker: 'Brute',
      portrait: '⚡', portraitColor: '#ef5350',
      glyph: '⚡', bgTint: 'rgba(40,10,0,0.6)',
      text: "You made it through the shallows. Impressive. The escarpment ahead is ours — every ridge, every stone. Come up. We'll be waiting."
    },
    {
      speaker: 'Aldric',
      portrait: '⚔', portraitColor: '#4fc3f7',
      glyph: '⚔', bgTint: 'rgba(0,20,50,0.4)',
      text: "He wants us rattled. Don't give him it. Uphill fights are won by patience — don't charge the ridge, flank it. Move."
    },
  ];

  const TRANSITION_5_6 = [
    {
      speaker: 'Aldric',
      portrait: '⚔', portraitColor: '#4fc3f7',
      glyph: '⚔', bgTint: 'rgba(0,20,50,0.4)',
      text: "The escarpment is behind us. One more door. The Shattered Keep — whatever the Founders locked inside, we're about to find out why they didn't want it opened."
    },
    {
      speaker: 'Lyra',
      portrait: '✦', portraitColor: '#b388ff',
      glyph: '✦', bgTint: 'rgba(20,0,50,0.4)',
      text: "The ley-line pulse is coming from inside those walls. It's strong — stronger than anything natural. Something in the keep is already awake."
    },
  ];

  const PRE_BATTLE_3 = [
    {
      speaker: 'Kael',
      portrait: '†', portraitColor: '#80cbc4',
      glyph: '†', bgTint: 'rgba(0,25,40,0.5)',
      text: "Iron walls, iron floors. The passage was built to funnel an army into a killing ground — three lanes, no room to maneuver. Once we commit to one, we can't pull back."
    },
    {
      speaker: 'Aldric',
      portrait: '⚔', portraitColor: '#4fc3f7',
      glyph: '⚔', bgTint: 'rgba(0,20,50,0.4)',
      text: "Then we pick the right lane before we step in. Lyra — anything ahead? Zara — watch the walls. Ambush points in places like this are carved into the architecture."
    },
    {
      speaker: 'Darkwraith',
      portrait: '☽', portraitColor: '#9e47ff',
      glyph: '☽', bgTint: 'rgba(20,0,40,0.7)',
      text: "You hear it? The stone remembers every soldier who bled here. Take your time choosing your path — all three lanes lead to the same place. Me."
    },
    {
      speaker: '— SYSTEM —',
      portrait: '◈', portraitColor: 'var(--accent)',
      glyph: '◈', bgTint: 'rgba(0,30,40,0.6)',
      text: "MISSION: Ironhold Passage. Navigate the iron corridors. Neutralize all enemy forces."
    },
  ];

  const PRE_BATTLE_4 = [
    {
      speaker: 'Zara',
      portrait: '◈', portraitColor: '#ffd740',
      glyph: '◈', bgTint: 'rgba(20,15,0,0.5)',
      text: "Wonderful. Nothing I love more than ankle-deep water with a sword in my hand. Which crossing are we taking? Because I count four, and three of them look like traps."
    },
    {
      speaker: 'Lyra',
      portrait: '✦', portraitColor: '#b388ff',
      glyph: '✦', bgTint: 'rgba(20,0,50,0.4)',
      text: "The water itself carries an old enchantment — weighting, slowing, draining. It's not recent. Someone in the Founder's age seeded the marsh to stop exactly what we're trying to do."
    },
    {
      speaker: 'Zara',
      portrait: '◈', portraitColor: '#ffd740',
      glyph: '◈', bgTint: 'rgba(20,15,0,0.5)',
      text: "So the ground was rigged four hundred years ago specifically to kill us. Somehow that's not even the strangest thing that's happened this week."
    },
    {
      speaker: '— SYSTEM —',
      portrait: '◈', portraitColor: 'var(--accent)',
      glyph: '◈', bgTint: 'rgba(0,30,40,0.6)',
      text: "MISSION: Thornmire Shallows. Cross the marsh. Eliminate all enemy units. Avoid the deep water."
    },
  ];

  const PRE_BATTLE_5 = [
    {
      speaker: 'Brute',
      portrait: '⚡', portraitColor: '#ff6f00',
      glyph: '⚡', bgTint: 'rgba(40,10,0,0.6)',
      text: "Come on then. Every ridge up here is mine — I've held this escarpment for two days waiting for someone worth fighting. Don't disappoint me."
    },
    {
      speaker: 'Lyra',
      portrait: '✦', portraitColor: '#b388ff',
      glyph: '✦', bgTint: 'rgba(20,0,50,0.4)',
      text: "He's not wrong — they have every high tile on the board. Attacking uphill into that is going to hurt. We need to force them off the ridge before we engage directly."
    },
    {
      speaker: 'Aldric',
      portrait: '⚔', portraitColor: '#4fc3f7',
      glyph: '⚔', bgTint: 'rgba(0,20,50,0.4)',
      text: "We've been hurt before. High ground matters — it doesn't decide the fight. Stay tight, advance through the barriers, don't let them pick us apart in the open. We push together or not at all."
    },
    {
      speaker: '— SYSTEM —',
      portrait: '◈', portraitColor: 'var(--accent)',
      glyph: '◈', bgTint: 'rgba(0,30,40,0.6)',
      text: "MISSION: Verdant Escarpment. Assault the high ground. WARNING — enemy holds elevated advantage across the full front line."
    },
  ];

  const PRE_BATTLE_6 = [
    {
      speaker: 'Lyra',
      portrait: '✦', portraitColor: '#b388ff',
      glyph: '✦', bgTint: 'rgba(20,0,50,0.5)',
      text: "The ley-lines inside that keep are fracturing. I've never read anything like this — it's as if the vault is pushing back against the walls holding it. Whatever is in there knows we're coming."
    },
    {
      speaker: 'Darkwraith',
      portrait: '☽', portraitColor: '#9e47ff',
      glyph: '☽', bgTint: 'rgba(20,0,40,0.8)',
      text: "You've come further than I expected. But the keep is the last threshold, and I am the last guardian. I will not move aside for curiosity — or for coin."
    },
    {
      speaker: 'Aldric',
      portrait: '⚔', portraitColor: '#4fc3f7',
      glyph: '⚔', bgTint: 'rgba(0,20,50,0.4)',
      text: "We didn't cross a causeway, a marsh, a passage, and an escarpment to stop at a gate. Every one of us chose to be here. Whatever's waiting on the other side — we face it the same way we faced everything else. Together."
    },
    {
      speaker: '— SYSTEM —',
      portrait: '◈', portraitColor: 'var(--accent)',
      glyph: '◈', bgTint: 'rgba(0,30,40,0.6)',
      text: "MISSION: The Shattered Keep. Final engagement. Breach the inner fortress. End it."
    },
  ];

  // ── ACT 2 SCENES ────────────────────────────────────────────

  const ACT2_OPEN = [
    {
      speaker: 'Lyra',
      portrait: '✦', portraitColor: '#b388ff',
      glyph: '✦', bgTint: 'rgba(20,0,50,0.5)',
      text: "What came out of that vault wasn't a creature or a weapon. It was everything the Founders knew — and didn't want anyone else to know. I've been reading fragments for three days. It changes everything we understand about how this world works."
    },
    {
      speaker: 'Zara',
      portrait: '◈', portraitColor: '#ffd740',
      glyph: '◈', bgTint: 'rgba(20,15,0,0.5)',
      text: "And now at least three different groups know we have it. The Compact pulled back but they didn't go home. I've counted four separate scouting patterns since dawn. Someone is coordinating them."
    },
    {
      speaker: 'Kael',
      portrait: '†', portraitColor: '#80cbc4',
      glyph: '†', bgTint: 'rgba(0,25,40,0.5)',
      text: "Then we don't stay still. The Ashfen Wood is dense enough to lose pursuit in. We move now, while it's dark, and we figure out who's behind this while we're moving."
    },
    {
      speaker: 'Aldric',
      portrait: '⚔', portraitColor: '#4fc3f7',
      glyph: '⚔', bgTint: 'rgba(0,20,50,0.4)',
      text: "Agreed. Whatever this knowledge is — whatever it means — we don't hand it to anyone until we understand it ourselves. Move out."
    },
  ];

  const RYNN_JOIN = [
    {
      speaker: '— —',
      portrait: '◎', portraitColor: '#a8d8a8',
      glyph: '◎', bgTint: 'rgba(0,20,10,0.6)',
      text: "A figure drops from the tree line — fast, careful, hands visible. Not a threat. Not yet."
    },
    {
      speaker: 'Rynn',
      portrait: '◎', portraitColor: '#a8d8a8',
      glyph: '◎', bgTint: 'rgba(0,20,10,0.5)',
      text: "I've been tracking that unit for six days. You just took them apart in twenty minutes. Either you're very good or you're carrying something that makes you very important — and from what I've seen, it's both."
    },
    {
      speaker: 'Zara',
      portrait: '◈', portraitColor: '#ffd740',
      glyph: '◈', bgTint: 'rgba(20,15,0,0.5)',
      text: "Who are you and why were you tracking them?"
    },
    {
      speaker: 'Rynn',
      portrait: '◎', portraitColor: '#a8d8a8',
      glyph: '◎', bgTint: 'rgba(0,20,10,0.5)',
      text: "Rynn. Former courier for the Compact — until I delivered something I wasn't supposed to read and made the mistake of reading it anyway. Now they want me quiet and I want to stay loud. Seems like we have overlapping interests."
    },
    {
      speaker: 'Aldric',
      portrait: '⚔', portraitColor: '#4fc3f7',
      glyph: '⚔', bgTint: 'rgba(0,20,50,0.4)',
      text: "You know the Compact's patrol patterns?"
    },
    {
      speaker: 'Rynn',
      portrait: '◎', portraitColor: '#a8d8a8',
      glyph: '◎', bgTint: 'rgba(0,20,10,0.5)',
      text: "Better than they do. I set half of them. Where are you headed?"
    },
    {
      speaker: 'Aldric',
      portrait: '⚔', portraitColor: '#4fc3f7',
      glyph: '⚔', bgTint: 'rgba(0,20,50,0.4)',
      text: "South. Away from whoever's coordinating this hunt. We'll explain the rest while we move."
    },
    {
      speaker: '— SYSTEM —',
      portrait: '◎', portraitColor: 'var(--accent)',
      glyph: '◈', bgTint: 'rgba(0,30,40,0.6)',
      text: "RYNN has joined the party."
    },
  ];

  const ACT2_TRANSITION_1_2 = [
    {
      speaker: 'Rynn',
      portrait: '◎', portraitColor: '#a8d8a8',
      glyph: '◎', bgTint: 'rgba(0,20,10,0.5)',
      text: "That smoke on the horizon — that's Cinder Hollow. Small village, river trade post. I've passed through twice. Good people."
    },
    {
      speaker: 'Lyra',
      portrait: '✦', portraitColor: '#b388ff',
      glyph: '✦', bgTint: 'rgba(20,0,50,0.4)',
      text: "That fire isn't accidental. The burn pattern is too even — someone set it deliberately to flush out anyone sheltering there. Or to send a message."
    },
    {
      speaker: 'Aldric',
      portrait: '⚔', portraitColor: '#4fc3f7',
      glyph: '⚔', bgTint: 'rgba(0,20,50,0.4)',
      text: "If the Compact is ahead of us they've already searched it. But there may be survivors. We go through — not around."
    },
    {
      speaker: '— SYSTEM —',
      portrait: '◈', portraitColor: 'var(--accent)',
      glyph: '◈', bgTint: 'rgba(0,30,40,0.6)',
      text: "MISSION: Cinder Hollow. Navigate the burning village. Enemy forces are still present."
    },
  ];

  const ACT2_TRANSITION_2_3 = [
    {
      speaker: 'Kael',
      portrait: '†', portraitColor: '#80cbc4',
      glyph: '†', bgTint: 'rgba(0,25,40,0.5)',
      text: "The village is gone. Whatever it was, it isn't anymore. Anyone who was here either got out or didn't."
    },
    {
      speaker: 'Rynn',
      portrait: '◎', portraitColor: '#a8d8a8',
      glyph: '◎', bgTint: 'rgba(0,20,10,0.5)',
      text: "There's a tunnel network under the trade road — smugglers built it a generation ago. Compact doesn't know about it. I do. It runs south for two miles."
    },
    {
      speaker: 'Zara',
      portrait: '◈', portraitColor: '#ffd740',
      glyph: '◈', bgTint: 'rgba(20,15,0,0.5)',
      text: "Of course you know about smuggler tunnels. Of course."
    },
    {
      speaker: 'Rynn',
      portrait: '◎', portraitColor: '#a8d8a8',
      glyph: '◎', bgTint: 'rgba(0,20,10,0.5)',
      text: "They're not empty. Someone else had the same idea. But it's still our best option."
    },
    {
      speaker: '— SYSTEM —',
      portrait: '◈', portraitColor: 'var(--accent)',
      glyph: '◈', bgTint: 'rgba(0,30,40,0.6)',
      text: "MISSION: The Sunken Road. Clear the tunnel network. Stay underground."
    },
  ];

  const ACT2_SIDE1_PRE = [
    {
      speaker: '— —',
      portrait: '◉', portraitColor: '#80cfa0',
      glyph: '◉', bgTint: 'rgba(0,20,15,0.6)',
      text: "A woman blocks the path. Not hostile — but not moving either. She has the look of someone who has been dealing with a problem alone for a very long time."
    },
    {
      speaker: 'Eska',
      portrait: '◉', portraitColor: '#80cfa0',
      glyph: '◉', bgTint: 'rgba(0,20,15,0.5)',
      text: "You feel that? The ground has been bleeding energy for three months. I've been patching the worst of it with what I know — which is less than I thought, apparently. Then a team of scholars shows up claiming they're here to study it. They're not studying it. They're harvesting it."
    },
    {
      speaker: 'Lyra',
      portrait: '✦', portraitColor: '#b388ff',
      glyph: '✦', bgTint: 'rgba(20,0,50,0.4)',
      text: "Conclave survey team. They'd map the rupture, extract what they can, and leave the land worse than they found it. Who are you?"
    },
    {
      speaker: 'Eska',
      portrait: '◉', portraitColor: '#80cfa0',
      glyph: '◉', bgTint: 'rgba(0,20,15,0.5)',
      text: "Someone who lives here. Get them off my land and I'll listen to whatever you need to tell me."
    },
    {
      speaker: '— SYSTEM —',
      portrait: '◈', portraitColor: 'var(--accent)',
      glyph: '◈', bgTint: 'rgba(0,30,40,0.6)',
      text: "MISSION: The Ley Scar. Drive off the Conclave survey team. Protect Eska's territory."
    },
  ];

  const ESKA_JOIN = [
    {
      speaker: 'Eska',
      portrait: '◉', portraitColor: '#80cfa0',
      glyph: '◉', bgTint: 'rgba(0,20,15,0.5)',
      text: "The rupture is still there. Driving off the survey team bought time, not a solution. If what you're carrying is what caused this — or what could fix it — then I need to understand it. And you need someone who understands the land."
    },
    {
      speaker: 'Aldric',
      portrait: '⚔', portraitColor: '#4fc3f7',
      glyph: '⚔', bgTint: 'rgba(0,20,50,0.4)',
      text: "We could use someone who knows this region. The Conclave has been one step ahead of us. That ends now."
    },
    {
      speaker: 'Eska',
      portrait: '◉', portraitColor: '#80cfa0',
      glyph: '◉', bgTint: 'rgba(0,20,15,0.5)',
      text: "I'm not joining your cause. I'm solving my problem. If those happen to be the same thing, we'll get along fine."
    },
    {
      speaker: '— SYSTEM —',
      portrait: '◈', portraitColor: 'var(--accent)',
      glyph: '◈', bgTint: 'rgba(0,30,40,0.6)',
      text: "ESKA has joined the party."
    },
  ];

  const ACT2_TRANSITION_3_4 = [
    {
      speaker: 'Lyra',
      portrait: '✦', portraitColor: '#b388ff',
      glyph: '✦', bgTint: 'rgba(20,0,50,0.4)',
      text: "The soldiers in those tunnels weren't Compact. Different insignia, different equipment. More precise. Someone else is involved in this hunt."
    },
    {
      speaker: 'Rynn',
      portrait: '◎', portraitColor: '#a8d8a8',
      glyph: '◎', bgTint: 'rgba(0,20,10,0.5)',
      text: "I've seen that insignia before. On a shipment I delivered eighteen months ago — to a Conclave holding house. I didn't know what the Conclave was then. I do now."
    },
    {
      speaker: 'Kael',
      portrait: '†', portraitColor: '#80cbc4',
      glyph: '†', bgTint: 'rgba(0,25,40,0.5)',
      text: "The Compact and the Conclave working together. That's not a coincidence — someone brokered that arrangement specifically to find us."
    },
    {
      speaker: 'Aldric',
      portrait: '⚔', portraitColor: '#4fc3f7',
      glyph: '⚔', bgTint: 'rgba(0,20,50,0.4)',
      text: "The ridge ahead controls the southern passes. If they've fortified it we'll know just how organized this is. Move carefully."
    },
    {
      speaker: '— SYSTEM —',
      portrait: '◈', portraitColor: 'var(--accent)',
      glyph: '◈', bgTint: 'rgba(0,30,40,0.6)',
      text: "MISSION: Thornback Ridge. Break through the fortified mountain pass. Conclave and Compact forces are operating together."
    },
  ];

  const ACT2_TRANSITION_4_5 = [
    {
      speaker: 'Zara',
      portrait: '◈', portraitColor: '#ffd740',
      glyph: '◈', bgTint: 'rgba(20,15,0,0.5)',
      text: "There was a man on that ridge — robes, not armor. He wasn't fighting. He was watching. When things went bad for them he just... left. Walked away."
    },
    {
      speaker: 'Lyra',
      portrait: '✦', portraitColor: '#b388ff',
      glyph: '✦', bgTint: 'rgba(20,0,50,0.4)',
      text: "Conclave operative. They don't fight unless they have to — they observe, assess, and report. Which means somewhere ahead there's a relay point. A place they send information back to. If we can reach it before he does—"
    },
    {
      speaker: 'Aldric',
      portrait: '⚔', portraitColor: '#4fc3f7',
      glyph: '⚔', bgTint: 'rgba(0,20,50,0.4)',
      text: "We cut their communications. They can't coordinate what they can't communicate. Where is it?"
    },
    {
      speaker: 'Rynn',
      portrait: '◎', portraitColor: '#a8d8a8',
      glyph: '◎', bgTint: 'rgba(0,20,10,0.5)',
      text: "I know where their relay stations are. I used to deliver to them. Follow me."
    },
    {
      speaker: '— SYSTEM —',
      portrait: '◈', portraitColor: 'var(--accent)',
      glyph: '◈', bgTint: 'rgba(0,30,40,0.6)',
      text: "MISSION: The Relay Station. Destroy the Conclave communications outpost. Do not let Solen escape with the data."
    },
  ];

  const ACT2_OUTRO = [
    {
      speaker: 'Aldric',
      portrait: '⚔', portraitColor: '#4fc3f7',
      glyph: '⚔', bgTint: 'rgba(0,20,40,0.5)',
      text: "The station is down. Whatever they were transmitting — it's stopped."
    },
    {
      speaker: 'Lyra',
      portrait: '✦', portraitColor: '#b388ff',
      glyph: '✦', bgTint: 'rgba(20,0,50,0.5)',
      text: "Solen was gone before we breached the inner room. He didn't run empty-handed — I can see the data extraction point. He took something. Not everything, but something."
    },
    {
      speaker: 'Rynn',
      portrait: '◎', portraitColor: '#a8d8a8',
      glyph: '◎', bgTint: 'rgba(0,20,10,0.5)',
      text: "He'll report back to the Conclave with whatever he managed to pull. They'll know we're not running anymore. They'll know we're fighting back."
    },
    {
      speaker: 'Kael',
      portrait: '†', portraitColor: '#80cbc4',
      glyph: '†', bgTint: 'rgba(0,25,40,0.5)',
      text: "Good. I'm tired of running."
    },
    {
      speaker: 'Zara',
      portrait: '◈', portraitColor: '#ffd740',
      glyph: '◈', bgTint: 'rgba(20,15,0,0.5)',
      text: "There's a third faction. The people in those tunnels weren't Compact or Conclave — different movement, different tactics. Someone else is circling this."
    },
    {
      speaker: 'Lyra',
      portrait: '✦', portraitColor: '#b388ff',
      glyph: '✦', bgTint: 'rgba(20,0,50,0.5)',
      text: "The Remnants. I've been finding references to them in the vault material. They existed before the Founders. Whatever was suppressed — they're the reason it had to be suppressed."
    },
    {
      speaker: 'Aldric',
      portrait: '⚔', portraitColor: '#4fc3f7',
      glyph: '⚔', bgTint: 'rgba(0,20,50,0.5)',
      text: "Then we find them before anyone else does. Whatever they know — we need to understand it. All of it. Move out."
    },
    {
      speaker: '— ACT II COMPLETE —',
      portrait: '◈', portraitColor: 'var(--gold)',
      glyph: '◈', bgTint: 'rgba(0,0,0,0.92)',
      text: "Aethermoor: Tactical Chronicles  ·  Act II — Flight  ·  To Be Continued"
    },
  ];

  const ACT2_DEFEAT = [
    {
      speaker: 'Varek',
      portrait: '!', portraitColor: '#e0a060',
      glyph: '!', bgTint: 'rgba(30,15,0,0.7)',
      text: "Stand down. You fought well — better than most who've tried to run from us. That counts for something. Not enough to let you keep what you're carrying, but something."
    },
    {
      speaker: 'Solen',
      portrait: ')', portraitColor: '#ce93d8',
      glyph: '✦', bgTint: 'rgba(20,0,40,0.7)',
      text: "The knowledge you took from that vault belongs in controlled hands. You have to understand that. The wrong people reading the wrong things at the wrong time — that's how civilizations end. We are not the enemy here."
    },
    {
      speaker: 'Rynn',
      portrait: '◎', portraitColor: '#a8d8a8',
      glyph: '◎', bgTint: 'rgba(0,20,10,0.6)',
      text: "That's exactly what someone who wants to control everything would say."
    },
  ];

  return {
    INTRO, MID, OUTRO, DEFEAT_SCENE,
    PRE_BATTLE_BANTER, PRE_BATTLE_3, PRE_BATTLE_4, PRE_BATTLE_5, PRE_BATTLE_6,
    TRANSITION_2_3, TRANSITION_3_4, TRANSITION_4_5, TRANSITION_5_6,
    ACT2_OPEN, RYNN_JOIN, ACT2_TRANSITION_1_2, ACT2_TRANSITION_2_3,
    ACT2_SIDE1_PRE, ESKA_JOIN, ACT2_TRANSITION_3_4, ACT2_TRANSITION_4_5,
    ACT2_OUTRO, ACT2_DEFEAT,
  };
})();

// =============================================================================
