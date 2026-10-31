# FINALIST ARENA — Game Master Prompt (Unreal Engine 5.4, C++ & Blueprints)

## 0. Target Hardware (Dev PC)
Ryzen 5 7500F, 16 GB RAM, RTX 5060 8 GB, ~187 GB free.
Recommendations: UE 5.4 with Lumen set to High (not Epic) in editor; Nanite on; Virtual Shadow Maps medium; use World Partition + One File Per Actor; keep editor open with ONE map; run dedicated server as a separate headless build (-nullrhi). Use DLSS/TSR upscaling. Close the browser while compiling shaders. Add a page file of 32 GB. Budget ~120 GB for source, DDC and builds.

## 1. Pitch
**Title: FINALIST ARENA.** 100 players are dropped into a televised arena run by a sadistic elite audience. Only 1 survives. Hunger Games tone + PUBG/battle-royale structure. Players craft tools, medicine and weapons from the environment, fight mutated beasts and plants, and survive a shrinking, burning/collapsing zone. No microtransactions, no pay-to-win. Cosmetics are earned in-game only.

## 2. Core Loop (20–60 min match)
1. Cutscene: spectators, Gamemaker welcome, drop into arena.
2. Scavenge, craft, tame the environment, form alliances.
3. Every 10 min a unique Mega-Danger event hits (20 designed below; match ends by min 60 at the latest).
4. Zone collapses in stages. Last player alive is declared **Survivalist Victor**.

## 3. Player Systems
- **Vitals:** Health, Stamina, Hygiene (infection, disease, smell attracts predators, lowers Sponsor appeal), Sleep (micro-sleep, blurred vision, hallucinations at low levels). Plus temperature, hunger, thirst per biome.
- **Movement:** sprint, crouch, prone, swim and dive, climb trees, climb rock walls and cliffs (stamina-driven, handhold detection via line traces + IK), vault, rope, glide down.
- **Realistic human avatar:** MetaHuman-based characters, facial expressions driven by state (fear, pain, exhaustion, rage, relief) via ARKit-style pose assets/Control Rig; dirt, wounds, sweat and blood accumulate by hygiene/damage.
- **Paranoia/Keen Sense:** Heightened-Sense meter. Hearing footsteps, glimpses, being tracked or betrayed raises paranoia: tunnel vision, heartbeat, false whispers. A player can induce paranoia in others (fake camps, trap rattles, bait items, fake alliance offers); a high Keen Sense skill reveals tracks and detects traps.
- **Looting:** corpses, supply caches, camps, sponsor crates.

## 4. Skills via Manual Books
Manuals are scavenged in the arena and are traits that level by use style (like the Hunger Games' training skills).
- Archery: untrained = sway, misses, no weak-spot; trained = steadier aim, weak-spot bonus, arrow retrieval, poison tips.
- Others: Knife-Fighting, Spear, Axe, Slingshot, Trap-Making, Snares, Camouflage, Herbalism, First Aid, Fire-craft, Fishing, Swimming, Climbing, Stealth, Tracking, Survival Cooking, Toxicology, Beast Handling, Bio-Alchemy (mutant crafting), Electronics/Tech, Leadership/Diplomacy, Intimidation, Deception.
- Upgrades branch by play style (e.g., Stealth Hunter vs. Brawler vs. Trapper vs. Medic). Level via actions, not purchases.

## 5. Crafting (open-ended)
Data-driven: `UCraftRecipe` DataAssets + tag-based materials (`Material.Fiber`, `Material.Toxic`, etc.), so new recipes can be added infinitely without code. Procedural recipe generator combines tags + tech tier + biome.
- Tiers: Primitive > Forged > Scavenged Tech > Mutant Bio.
- Examples: stone axe, bone knife, bow & arrows, spear, bolas, snare, pit trap, net, raft, shelter, torch, water filter, charcoal filter, tourniquet, splint, antiseptic from honey+herbs, antivenom, painkiller tea, smoke bomb, poison dart, gas mask, ghillie suit, ice picks, heat-pack, ash armor, obsidian blade, salt preservation, solar still, camel-hide canteen, ice-shard spear, glider kite, flare, signal mirror, drone jammer, EMP trap.
- Mutant crafting: venom glands > poison arrows; hide plates > armor; luminous spores > night lights; acid sacs > acid grenades; thorn vines > barbed whip; regen moss > advanced medicine; screamer bladders > decoy noise; bone shards > serrated weapons.
- Biome-aware: material availability and recipe efficiency depend on environment.

## 6. Kill Points & Sponsor Crates
- Kill points (also for assists, clip moments, survival time) are spent at **Sponsor Crates** (drop pods, vending terminals) to request supplies relevant to tech tier. No real money. Crates are scarce and also contested loot.
- **Arena Hype:** streamers link chat (YouTube, Twitch, Facebook, TikTok, others via a plugin/webhook layer). Chat activity, emotes and clip-worthy moments raise the Hype meter; high hype triggers supply crates for that player. Anti-abuse: server-validated caps, cooldowns, no purchases, opt-in, delay mode against stream sniping.

## 7. Teams & Betrayal
- Alliances up to 8 players; invite/accept flow. **Proximity voice chat** (Unreal Voice/ EOS Voice or Vivox) with attenuation and occlusion. Neutral players can be heard nearby and can request to join; team members can betray at any time (friendly fire is on), but only 1 wins, so team win is impossible; the final alliance is forced to split by the zone.

## 8. Zones & Biomes
Zone = biome-specific lethal collapse. Players outside take escalating damage; escape is possible with skill; at 0 HP they die. Materials, animals, plants and structures inside are also destroyed.
- Forest: wildfire sweep.
- Safari: earthquakes, fissures, stampedes.
- Arctic: falling ice, ice-sheet cracks, blizzard whiteout.
- Volcano: meteor/lava eruption, ash clouds.
- Desert: sandstorm wall, heat death, sinkholes.
- Unique: Toxic Waste Swamp, Sunken Ruins, Abandoned Megacity/Stadium, Crimson Coast.
- Dynamic hazards: poison fog, acid rain, flash floods, lightning storms, spore bloom, radioactive vents.

## 9. Mutated Wildlife & Mutated Humans
- Natural + mutated animals/plants (ambush vines, spore pods, venom stalkers, armored boars, ice wolves, lava salamanders, dune worms, mutant lions).
- If players kill many mutants or the match runs long, **Mutated Humans** (biome-adapted zombie-like horrors: frost crawlers, ash-skinned runners, desert burrowers, swamp bloaters) hunt players, tracking by sound and smell (hygiene matters).
- **Predator death-cam:** when killed by a creature, camera cuts to the predator's POV/cinematic with its victory pose.
- AI: Behavior Trees + EQS + StateTree; Mass AI for hordes; server-authoritative.

## 10. Combat & Execution Animations
Melee: knife, axe, spear, club, machete, bare hands. Ranged: bow, crossbow, slingshot, throwing knives, thrown spears, sparse guns/tech as late-tier. Motion-matching locomotion, per-weapon execution/finisher animations (Motion Warping), hit reactions, limb damage, bleeding, dismemberment (Niagara + procedural gore), blood decals, wound-based mesh. Weak-spot hits depend on skill. Gore toggle for accessibility.

## 11. The 20 Mega-Dangers (one every 10 minutes, rotating; each match picks the set for its length)
1. **Blood Tsunami** — blood wave with mutated zombie-shark carnivores, fins, sense vibrations (stand still/climb high).
2. Meteor Rain — hold in caves.
3. Swarm Plague — giant mutant insects drawn to light and sweat.
4. Poison Fog Tide — rising green fog; gas mask or high ground.
5. Dark Eclipse — total darkness, night predators emerge.
6. Ice Breaker — frozen lake shatters, leviathan under the ice.
7. Lava Flood — rivers of lava; craft bridges.
8. Sandworm Hunt — giant burrowers follow footsteps.
9. Spore Bloom — fungal hallucinations, mutated plants awaken.
10. Thunder Storm — lightning targets metal gear.
11. Stampede — megafauna charge across the map.
12. Zombie Horde Night — mutated human wave assault, defend a position.
13. Acid Rain — destroys wood/cloth; shelter needed.
14. Sinkhole Collapse — ground drops into a predator pit.
15. Hunter Drones — Gamemaker drones track those who camp.
16. Gamemaker's Hunt — elite mutant beast targets the leading player.
17. Rot Wind — disease spreads; hygiene/medicine skill matters.
18. Flash Flood — rising water, crocodile mutants.
19. Avalanche Cascade — snow/boulders slide to the basin.
20. Titan Awakening — a colossal mutant boss crosses the arena; avoid at all cost.
More can be added as DataAssets (`UArenaEventDef`) with phases, telegraph, VFX, audio, and AI spawn tables.

## 12. Cutscene
Short cinematic: spectators in a glittering stadium cheer, the Gamemaker announces rules; at the end the Victor is declared **Winner and Survivalist** with a close-up of a human face showing exhaustion and relief.

## 13. Audio
- **Main menu song:** suspenseful post-apocalyptic piece — low drone, detuned strings, war drums, distant crowd cheering like a glory anthem that slowly warps into horror (minor choir, metallic scrapes). Compose in MetaSounds; tempo 70 BPM, key D minor, build over 3 minutes and loop.
- Dynamic layers: percussion and brass stems fade in during combat (MetaSound parameters from combat intensity).
- Low-HP: low-pass filter, pitch wobble, distortion, heartbeat, tinnitus.
- Heavy, visceral impact sounds per material and weapon; spatial audio, occlusion, reverb zones per biome.

## 14. Tutorial
Solo training island: movement and climbing, vitals, crafting, looting, combat, manuals, team/betray, voice chat, zone and Mega-Dangers, with prompts and bots. Skippable. Bot-fill for early matchmaking.

## 15. Networking & Architecture (UE 5.4)
- Dedicated server (headless Linux build, Docker/Kubernetes, Agones or Multiplay for allocation), 100 players with **Replication Graph** or **Iris** (5.4 experimental) for relevancy; net-dormancy; significance manager; server-authoritative combat with lag compensation (hit rewind); client prediction in Character Movement (CMC/Mover); 30 Hz server tick; anti-cheat (EOS Easy Anti-Cheat), server-side loot rolls.
- Matchmaking via EOS or PlayFab; regions; crossplay optional; telemetry.
- Modules: `FinalistCore`, `FinalistSurvival` (vitals), `FinalistCrafting`, `FinalistCombat`, `FinalistAI`, `FinalistZones`, `FinalistHype` (stream integrations), `FinalistVoice`, `FinalistUI`. GAS (Gameplay Ability System) for skills, damage, status effects. Blueprints for content, events, UI (UMG/CommonUI); C++ for core, replication, performance-critical code.
- Performance: Nanite foliage, PCG for biome scatter, World Partition streaming, HLOD, Mass AI, Niagara budgets, LODs, and scalability presets.

## 16. Monetization Rules
None. No microtransactions, no loot boxes, no pay-to-win. Fair, skill-based, competitive.

## 17. Milestones
M1 vertical slice: 1 biome, 8 players, vitals, crafting. M2 combat and AI. M3 zones and Mega-Dangers. M4 100-player dedicated server load test. M5 voice, teams, hype integration. M6 art/audio/cutscene polish. M7 tutorial, beta, anti-cheat.
