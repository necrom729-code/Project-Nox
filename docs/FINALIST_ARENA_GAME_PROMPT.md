# FINALIST ARENA — Master Game Prompt (Unreal Engine 5.4, C++ and Blueprints)

**Title:** Finalist Arena
**Tagline:** "One Survives. Millions Watch."
**Genre:** 100-player online survival battle royale (Hunger Games x PUBG), with crafting, mutation horror and streamer integration.
**Rules:** No microtransactions. No pay-to-win. Cosmetics are earned in-game only.

---
## 1. Target PC and Performance Plan
Ryzen 5 7500F (6C/12T), 16 GB RAM, RTX 5060 8 GB, 187 GB free storage.
- Install UE 5.4 (about 50 GB), Visual Studio 2022 with the "Game development with C++" workload, and the Windows SDK. Keep projects on SSD.
- 16 GB RAM is tight for 100-player server testing. Run 1 dedicated server plus 2-4 clients locally, and use bots (AI) to fill the other slots.
- Fit in 8 GB VRAM: Nanite for rocks and foliage, Lumen set to Software/Hardware at "High" (not Epic), Virtual Shadow Maps, TSR/DLSS upscaling, texture streaming pool 3 GB, World Partition with One File Per Actor.
- Humans: MetaHuman with LOD0 only for cutscenes and close-ups. In gameplay use LOD1-3 and the Mass/animation budget system. Use the Animation Budget Allocator.
- Scalability presets: Low / Medium / High / Cinematic. Aim for 60 FPS at 1440p High with DLSS.
- Use Iris replication (UE 5.4 experimental), Replication Graph or relevancy for distance culling, and network dormancy for props.

## 2. Core Pillars
1. Craft or die: everything is built from the land.
2. Every arena is a different ecosystem with its own shrink hazard.
3. Every 10 minutes the Arena Master unleashes a unique Calamity.
4. Only one winner, even though alliances are allowed.
5. The audience is sadistic: hype is rewarded, and it is also a horror show.

## 3. Match Flow (20-60 min)
1. Lobby/Tutorial -> 2. Tribute cutscene -> 3. Drop-in (rising platform or parachute) -> 4. Scavenge (0-10 min) -> 5. Zone closes in phases, Calamity every 10 min -> 6. Mutants and Hunters spawn if the match is slow (anti-camp) -> 7. Final duel -> 8. Winner cutscene.
- Time-to-kill scale: small arena modes at 20 min, full at 60 min. Zone phases are scaled by the match length setting.
- **Winner cutscene (short):** The camera pans across cheering spectators in a golden stadium of holo-screens. The Gamemaker's voice: "Ladies and gentlemen, the arena has chosen. You are the Survivalist, the Finalist!" Confetti-ash falls, the winner's face shows real emotion (exhaustion, tears, relief) through MetaHuman facial animation, then fade to stats.

## 4. Player Vitals
- **Health:** bleeding, fractures, infection, poison, burns.
- **Stamina:** sprint, climb, swim, melee, bow draw.
- **Hygiene:** dirt, wounds get infected, smell attracts predators, and clean players are better at stealth. Wash in water, make soap from ash and fat.
- **Sleep:** low sleep causes blurred vision, micro-sleep, hallucinations, and worse aim. Rest in a shelter or hammock (vulnerable).
- Also: Hunger, Thirst, Temperature (cold in Arctic, heat in Desert), Sanity.
- **Paranoia / Keen Sense:** a Sanity meter. Betrayals, being hunted, or hearing footsteps raise paranoia: whispers, fake shadows, heartbeat. A keen-sense perk highlights footprints, broken twigs and sound direction for a short time. A player can use bluffs (fake camps, noise traps) to push an opponent into paranoia, which causes shaky aim and panic.

## 5. Realistic Humans and Expression
- MetaHuman characters with a character creator (age, body, scars, skin tones, hair).
- Facial animation driven by state: fear, pain, exhaustion, rage, grief, relief. Dynamic dirt, sweat, blood, wounds, wet clothing and frost on skin.
- Physical-world feedback: breath fog in cold, shivering, limping with a leg injury, and a wounded lip that bleeds.
- Motion Matching, Control Rig, IK foot placement, Full Body IK for climbing.

## 6. Movement and Traversal
- Climb trees (branches with a grab system), climb rock walls (stamina-based, chalk or crafted pitons help), vaulting, ledge hang, swimming, diving, and crawling.
- Rope, grapples, and zipline crafted items. Drowning and cold-water shock rules.
- C++ custom `UCharacterMovementComponent` with modes: Climb, Swim, Hang, Crawl, with client prediction via saved moves.

## 7. Arenas and Shrink Hazards
Zone shrink = the arena being destroyed. Anything outside is destroyed: players take rising damage, and plants, animals, items and buildings are removed. Players get a chance to escape if they run in time. HP 0 = death.
| Arena | Shrink Mechanic | Crafting Theme |
|---|---|---|
| Forest | Wildfire wall burning everything | wood, resin, herbs, traps |
| Safari | Earthquake fissures swallow ground and collapse the savanna | hide, bone, grass, spears |
| Arctic | Ice shelf breaks and falls into the freezing sea, blizzard | fur, ice, whale bone, fuel |
| Volcano | Meteor rain and eruption lava flows | obsidian, sulfur, metal, glass |
| Desert | Sandstorm walls that strip flesh, plus mirages | cactus water, scrap, solar |
| Unique 1: Sunken Metropolis | Rising tidal flood and collapsing towers | scrap electronics |
| Unique 2: Toxic Wasteland / Dead Factory | Acid rain and poison fog drift | chemicals, filters |
| Unique 3: Mutated Jungle Temple | Overgrowth vines choke the area | alien plants, venom |
- **Dynamic hazards in all maps:** poison fog banks, lightning storms, flash floods, rockfall, rogue wildlife migrations.
- Implementation: a `AZoneDirector` actor with phase data table, a Niagara + material-parameter-collection wall, and a server-authoritative damage tick. Destruction removes foliage instances, PCG assets and actors through a replicated "destroyed mask" (a low-res replicated grid).

## 8. Crafting System (Infinite Expansion)
- Data-driven: `UCraftingRecipe` Data Assets (inputs, tool needed, time, tech tier, skill requirement, output, quality).
- **Tech tiers:** Primitive -> Tribal -> Survivalist -> Salvage -> Advanced -> Mutant-Tech.
- **Quality** depends on skill, tool and materials. Items have durability and can be repaired.
- **Procedural recipe generator (infinite ideas):** Each material has tags (Sharp, Blunt, Flexible, Toxic, Flammable, Absorbent, Conductive, Insulating, Mutant:X). A rule-engine combines `Base item + Binder + Modifier tag` to produce new items automatically, e.g. Spear + Venom Gland = Poison Spear, Bandage + Moss = Antiseptic Dressing. Players discover and name recipes, and a discovery log is stored.
- **Starter ideas:** stone knife, bone needle, fire drill, torch, bow and arrows, sling, spear, club, axe, net trap, snare, pit trap, tripwire alarm, bear trap, raft, shelter, hammock, rope, ghillie suit, fur coat, water filter, purified bottle, solar still, smoke signal, soap, splint, bandage, antiseptic, painkiller tea, antivenom, adrenaline, tourniquet, stitch kit, charcoal mask, gas mask, ice axe, crampons, snow goggles, heat pack, fire bomb, Molotov, smoke bomb, flash powder, blowgun, crossbow, shield, armor of bark/bone/scrap, decoy dummy, noise maker, grappling hook, glider, wind-turbine charger, radio jammer, drone tracker.
- **Mutant crafting:** harvest from mutated animals/plants (Acid Gland, Chitin Plate, Glow Spore, Venom Sac, Regeneration Sap, Bloat Gas Bladder). Unique items: Acid Spear, Chitin Armor, Spore Grenade, Regen Salve (heals but raises paranoia), Night-Eye Drops, Predator Lure.
- **Crate Tech Shop:** kill points = Bonus Points. Spend at supply crates/terminals for items by tech needed (e.g. Tier 2 kit: bow parts; Tier 4: night vision). Items are never exclusive to money; no real money.

## 9. Skills — Manual Books
- Scavenge Manual Books (Archery, Melee, Herbalism, Trapping, Foraging, Medicine, Climbing, Swimming, Stealth, Mechanics, Chemistry, Fishing, Beastcraft, Leadership).
- Without a book, the player is an amateur: archery misses, trembling aim, can't hit weak spots.
- With a book: level 1, then upgrades by *use* (practice-based XP): bowmen unlock Breath Hold, Weak-Spot Mark, Quick Nock; melee unlock Parry, Execution; and so on. Style-adaptive: the dominant playstyle shapes perks.
- Skills reference The Hunger Games (archery, snares, camouflage, edible plants, fire, alliances) and other battle royales (looting, armor tiers, scanning, revives).
- Skills are per match only. No carry-over power, which protects fairness.

## 10. Combat, Executions, and Gore
- Weapon classes: bare hands, knives, clubs, axes, spears, bows, crossbows, slings, throwables, improvised guns (rare and crafted).
- Per-weapon animation sets and unique executions (stab-from-behind, spear-pin, axe finisher, arrow to the throat). Hit reactions by bone and zone.
- Ballistics for arrows (drop, wind, penetration); server-side hit validation with lag compensation.
- Gore: Niagara blood, decals, dismemberment on a mesh-swap or procedural-cut basis, wounds layered on the MetaHuman body, a gore toggle in accessibility settings.
- **Predator kill-cam:** when killed by animals, mutants, or toxic undead, a unique death camera shows the predator's victory (the predator looks up, roars, and feasts) in slow motion.

## 11. Wildlife, Mutants and Undead
- Natural animals by biome (wolves, bears, lions, hyenas, snakes, polar bears, crocodiles, boars, lava lizards, scorpions).
- Mutated versions drop crafting materials. Kill enough mutants and Mutated Humans (adapted zombies: ice-skinned, sand-burrowers, lava-crusted, swamp-gill) spawn and hunt players when the match drags on or players camp.
- AI: State Tree + Behavior Tree, EQS, perception (sight/sound/smell, hygiene-linked), Mass AI for hordes, with an AI server tick budget.

## 12. Calamity Schedule (every 10 minutes, 20 unique events)
One each 10 min for 60 min runs shows 6 per match; the pool of 20 rotates:
1. **Blood Tsunami:** a huge wave of blood with carnivorous mutated fish-zombies with fins that sense vibrations. Stay on high ground and keep quiet.
2. Sky of Meteors: fireballs hit high ground.
3. The Great Stampede: mutated herds charge through.
4. Acid Rain: items corrode, build a shelter.
5. Locust Swarm: devours plants, blinds players.
6. Spore Bloom: fungal zombies burst from the soil.
7. Black Fog: poison fog hides hunters.
8. Ice Titan Awakening: a frozen giant walks the map.
9. Lava Geysers: ground vents erupt periodically.
10. Bone Storm: a sandstorm carrying skeleton shards.
11. Hunter Pack Release: Capitol-style muttation hounds track the top killer.
12. Flash Flood: valleys fill within 60 s.
13. Eternal Night: no light; night-vision crafts become vital.
14. Gravity Quake: low-gravity zones that toss players.
15. Electric Storm: lightning strikes metal and water.
16. Plague Wind: infection ramps; hygiene matters most.
17. Root Hands: giant vines grab and drag players.
18. Sinkhole Maw: a giant worm swallows sections of land.
19. Spectator Drone Swarm: the audience drops chaos crates, and players fight over them.
20. Final Feast: a large supply cornucopia opens in the center with a gauntlet of traps.
- Each Calamity has: a 60 s warning (horn, sky change, UI alert), a counter-strategy, and a defend-or-flee design. Driven by `UCalamityDefinition` data assets spawned by `ACalamityDirector`.

## 13. Teams, Betrayal and Proximity Voice
- Alliances up to 8. Invite or accept offers made by neutral players (proximity voice lets you hear them calling for a truce).
- Team members share map pings and optionally supplies. Anyone can betray: attacking an ally triggers a Betrayal event (audience hype, a team alert, and paranoia for survivors).
- Only one winner: when the team is the last alive, the alliance dissolves into a final duel (a zone-forced face-off, a "Last Two Standing" rule).
- Voice: Vivox or EOS Voice with 3D spatial attenuation; team channel + proximity channel, push-to-talk, mute and report tools, and an in-game radio item.

## 14. Streamer Mode — Arena Hype
- Streamers connect Twitch, YouTube, Facebook, TikTok (and others) with a chat bridge service.
- **Hype Meter:** based on chat speed, emotes, donations-free engagement and clip moments (fights, close escapes, betrayals). Higher hype = the Arena sends a free sponsor crate to the streamer.
- To keep fairness: sponsor crates only give small supplies (medicine, food, tools), are capped per match, and are visible on the kill feed. Chat can't give direct damage or targeting. There is a Stream-Safe setting (no leaks of location, a delay toggle, and DMCA-safe audio).
- Auto-clip system: record 30 s replays around high-hype events.

## 15. Audio Direction
- **Main menu song "Ash and Applause" (design brief):** Key D minor, 70 BPM. Begins with distant stadium crowd cheering like glory, a low brass drone, a detuned music-box lullaby (sadistic elite feel), growing taiko/war drums, whispered chants, a rising string tremolo, then cheers distort into screams. A bright major motif played mockingly in minor at the end. Layers: Crowd, Drone, Strings, Drums, Choir, Glitch.
- Dynamic music in MetaSounds: layers fade by threat level, combat adds percussion and brass stabs. At critical health: low-pass filter, bitcrush/wow-flutter distortion, a heartbeat, tinnitus; ties to the HP parameter.
- Heavy, visceral impacts: layered flesh, bone, blade sounds, with distance and material-based reflections, convolution reverb by biome, and audio occlusion. Spectator crowd reacts to kills.

## 16. Tutorials for Beginners
- Training Island: step-by-step (movement, climbing, swimming, looting, crafting a knife, making fire, treating bleeding, hygiene, sleep, manual books, teaming, voice, the zone).
- Contextual hints, a recipe hint book, bot practice matches, and a short "Gamemaker's briefing" video.

## 17. Dedicated Server and Networking
- UE5.4 Dedicated Server target (`FinalistArenaServer.Target.cs`), headless Linux builds via Docker/Kubernetes (Agones for allocation) for 100 players per instance.
- Matchmaking: EOS or a custom service (queue, regions, party), backfill disabled after drop-in.
- Authoritative server for damage, crafting, loot, zone. Client prediction for movement and weapons. Net cull distance, Iris filters, priority-based bandwidth, 30 Hz server tick (20 Hz when idle), and replicated item as fast arrays (`FFastArraySerializer`).
- Anti-cheat: Easy Anti-Cheat, server validation, speed/aim anomaly detection.
- Target: under 60 ms ping inside a region, 3-4 vCPU per server instance (stress-tested with bots).

## 18. Unreal Architecture (C++ vs Blueprint)
**C++:** `AFAGameMode`, `AFAGameState`, `AFAPlayerState` (kill points, hype, skills), `AFACharacter`, `UFAMovementComponent`, `UFAVitalsComponent`, `UFAInventoryComponent`, `UFACraftingComponent`, `UFASkillComponent`, `AZoneDirector`, `ACalamityDirector`, `UFATeamSubsystem`, `UFAStreamBridgeSubsystem`, AI controllers, Gameplay Ability System (GAS) for weapons, skills, status effects.
**Blueprints:** UI (UMG/CommonUI), cutscene triggers, Niagara hookups, recipe data assets, tutorial scripting, level logic, tuning.
Modules: `FinalistArena` (core), `FinalistArenaServer`, `FinalistArenaEditor`. Plugins: GAS, Enhanced Input, Niagara, MetaSounds, Online Subsystem EOS, Mass, StateTree, PCG, Chaos Destruction, Control Rig, Motion Matching (Pose Search).

## 19. Production Roadmap
1. Prototype: Forest map, 1 character, vitals, crafting, 10 bots.
2. Vertical slice: zone, 1 Calamity, bows and melee, 16 players.
3. Core: 4 more arenas, teams, voice, skills, mutants.
4. 100-player scale test, streamer integration.
5. Polish: audio, gore, cutscenes, tutorial, anti-cheat. Beta, then launch.

## 20. Ready-to-Paste Master Prompt
> Create "Finalist Arena", a 100-player online battle royale in Unreal Engine 5.4 using C++ and Blueprints with a dedicated server architecture. Players craft tools, medicine and weapons from the environment in forest, safari, arctic, volcano, desert and unique arenas, each with its own shrinking hazard (fire, earthquake, ice break, meteors, sandstorm) that destroys everything outside the zone. Vitals: health, stamina, hygiene, sleep, plus paranoia. Include MetaHuman realism with expressive faces, climbing, swimming, 8-person alliances with betrayal, proximity voice, manual-book skills, mutated animals/plants as crafting materials, mutated humans hunting slow matches, a unique Calamity every 10 minutes, kill-point crate shops, streamer hype crates from Twitch/YouTube/Facebook/TikTok chat, predator kill-cams, gore, dynamic audio that distorts at low health, tutorials, and no microtransactions or pay-to-win.
