const alienUnits = `
Alien Warlord,hgeneral.png,true,1,420,3,2,12,[Alien Heavy Shredder],[Alien Deathblade],[Fearless;Regeneration]
Alien Broodmaster,hgeneral.png,true,1,440,3,2,12,,[Alien Razorblade],[Fearless;Regeneration;Ambush;Flying;Furious]
Alien Veteran,hgeneral.png,true,1,80,4,4,3,[Alien Heavy Ravager],[Alien Deathclaws],[Fearless;Ambush;Flying]
Alien Drones,hranger.png,false,10,12,5,5,1,,[Alien Droneclaws],[Fast;Strider;Poison]
Alien Seekers,hranger.png,false,10,12,5,5,1,,[Alien Droneclaws],[Fast;Strider;Furious]
Alien Shooters,hranger.png,false,10,15,5,5,1,[Alien Light Ravagers],[Alien Claws],[Strider]
Alien Gargoyles,hlancer.png,false,10,14,5,5,1,[Alien Borers],[Alien Claws],[Ambush;Flying]
Alien Shredder Lord,hgeneral.png,true,1,120,3,4,3,,[Alien Shredclaws],[Fast;Scout;Strider]
Alien Shredders,hpaladin.png,false,5,34,3,4,1,,[Alien Deathclaws],[Fast;Scout;Strider]
Alien Warriors,hpaladin.png,false,5,63,4,4,3,[Alien Ravagers],[Alien Deathclaws],[Fearless;Ambush;Flying]
Alien Devourers,hpaladin.png,false,5,67,4,4,3,[Alien Spitters],[Alien Flails],[Fearless]
Alien Corpsers,hpaladin.png,false,5,43,4,4,3,[Alien Fleshrippers],[Alien Deathclaws],[Fearless]
Alien Sappers,hranger.png,false,10,15,5,5,1,[Alien Spinners],[Alien Claws],[Strider]
Alien Spores,hpaladin.png,false,5,17,6,6,1,,[Alien Claws],[Boom_2]
Alien Mortarlord,hpaladin.png,true,1,170,4,3,6,[Alien Mortar],[Alien Shredclaws],[Fearless]
Alien Flamerlord,hpaladin.png,true,1,200,4,3,6,[Alien Flamer],[Alien Shredclaws],[Fearless]
Alien Temple Haunters,hpaladin.png,false,3,72,3,3,3,,[Alien Shredclaws],[Relentless]
Alien Temple Guards,hpaladin.png,false,3,95,3,3,3,[Alien Heavy Ravager],[Alien Deathclaws],[Relentless]
Alien Temple Priests,hpaladin.png,false,3,101,3,3,3,[Alien Impaler],[Alien Deathclaws],[Relentless]
Alien Temple Lords,hpaladin.png,false,3,130,3,3,3,[Alien Skewergun],[Alien Deathclaws],[Relentless]
Alien Shadow Maulers,hpaladin.png,false,3,92,4,4,3,,[Alien Serrators],[Ambush;Fast;Stealth;Strider]
Alien Venovores,hpaladin.png,false,3,80,4,4,3,,[Alien Poisonfangs],[Stealth;Regeneration]
Alien Psychores,hpaladin.png,false,3,75,4,4,3,[Alien Psyblast],[Alien Claws],[Stealth;Regeneration]
Alien Gorelord,hpaladin.png,true,1,430,4,2,12,[Alien Titanic Ravager],[Alien Poisonfangs],[Fearless;Regeneration]
Alien Voidlord,hpaladin.png,true,1,590,4,2,18,[Alien Fracture Cannon],[Alien Voidclaws],[Fearless;Regeneration]
Alien Abomination,hpaladin.png,true,1,980,3,2,24,[Alien Toxic Breath],[Alien Deathjaw],[Fearless;Regeneration]
`;

const droidUnits = `
Droid Master,sklich.png,true,1,110,3,2,3,[Droid Plasma],[Droid Twinblades],[Fearless;Warlord;Purge]
Droid Destroyers,skdraug.png,false,3,78,3,2,3,[Droid Twincannons],[Droid Blades],[Fearless;Purge]
Droid Deathballs,skknight.png,false,3,95,3,2,3,[Droid Deathcannons],[Droid Blades],[Fearless;Purge]
Droid Assaulters,skknight.png,false,3,115,3,2,3,[Droid Plasma],[Droid Blades],[Fearless;Ambush;Flying;Purge]
B4 Droid Flamethrowers,skknight.png,false,3,42,3,2,1,[Droid Flamers],[Droid Blades],[Fearless;Purge]
B3 Droid Persecutors,skbanebow.png,false,5,45,3,2,1,[Droid Railguns],[Droid Blades],[Fearless;Purge;Regeneration]
B2 Droid Gunners,skbanebow.png,false,5,27,4,3,1,[Droid Blasters],[Droid Blades],[Fearless;Scout;Strider;Purge]
B1 Droid Infantry,skbanebow.png,false,10,15,4,4,1,[Droid Cannons],[Droid Blades],[Fearless;Purge]
Droid MTT,sklich.png,true,1,240,3,2,6,[Droid Laser Gatling],[Droid Blades],[Fearless;Fast;Impact_3;Scout;Strider;Purge]
Droid AAT,sklich.png,true,1,650,3,2,15,[Droid Storm Blasters],[Droid Twinblades],[Fearless;Warlord;Purge]
Droid Count,sklich.png,true,1,1240,3,2,24,[Droid Saberthrow],[Droid Lightsaber],[Fearless;Relentless;Regeneration]
Droid Mauler,sklich.png,true,1,1340,4,2,24,[Droid Force Lightning],[Droid Dualsaber],[Fearless;Warlord;Strider;Purge]
`;

const rebelUnits = `
Rebel Leader,skbanebow.png,true,1,85,4,4,3,[Rebel Plasma Pistol],[Rebel Saber],[Furious]
Rebel Infantry,skbanebow.png,false,10,7,6,5,1,[Rebel Blasters],[Rebel Blades],[]
Rebel Launchers,skbanebow.png,false,3,27,5,5,1,[Rebel Launchers],[Rebel Blades],[Relentless]
Rebel Destructors,skbanebow.png,false,3,42,5,5,1,[Rebel Plasma],[Rebel Blades],[Relentless]
Rebel Speeders,skbanebow.png,false,5,18,5,5,3,[Rebel Lightblasters],[Rebel Piercers],[Fast;Impact_1]
Rebel Weapon Team,skbanebow.png,false,3,45,5,5,3,[Rebel Mortar],[Rebel Blades],[]
Rebel Heavy Walker,skbanebow.png,true,1,320,4,2,12,[Rebel Heavy Gatling],[Rebel Deathbringer],[Furious]
Rebel Flame Walker,skbanebow.png,true,1,190,4,2,12,[Rebel Heavy Flamer],[Rebel Walkerblade],[Stealth]
Rebel Titanic Walker,skbanebow.png,true,1,680,4,2,18,[Rebel Laser Volley],[Rebel Smasher],[]
`;

const tuskUnits = `
Tusk Warlord,skbanebow.png,true,1,150,3,3,6,[Tusk Dual Blasters],[Tusk Warblades],[Ambush;Furious;Warlord]
Tusk Troopers,skbanebow.png,false,5,15,3,3,1,[Tusk Blasters],[Tusk Blades],[Furious]
Tusk Destroyers,skbanebow.png,false,5,50,3,3,1,[Tusk Plasma],[Tusk Pikes],[Fearless;Frenzy]
Tusk Meatfodder,skbanebow.png,false,10,14,5,5,1,,[Tusk Twinblades],[Frenzy]
Tusk Chargers,skbanebow.png,false,3,92,3,4,3,,[Tusk Warglaives],[Fast;Furious]
Tusk Mastertank,skbanebow.png,true,1,565,3,2,12,[Tusk Twinlasers],[Tusk Ram],[Fast;Impact_6]
Tusk Warwalker,skbanebow.png,true,1,350,3,2,12,,[Tusk Deathflail],[Furious]
Tusk Abomination,skbanebow.png,true,1,880,3,2,18,[Tusk Heptacannon],[Tusk Ram],[Fast;Impact_11]
`;

const cloneUnits = `
Clone Commander,skbanebow.png,true,1,150,3,3,6,[Clone Dual Blasters],[Clone Warblades],[Fearless;Ambush;Furious;Warlord]
Clone Troopers,skbanebow.png,false,5,36,3,3,1,[Clone Blasters],[Clone Blades],[Fearless]
Clone Flamemasters,skbanebow.png,false,3,48,3,3,1,[Clone Flamers],[Clone Blades],[Fearless;Relentless]
Clone Lasermasters,skbanebow.png,false,3,73,3,3,1,[Clone Lasers],[Clone Blades],[Fearless;Relentless]
Clone Missilemasters,skbanebow.png,false,3,98,3,3,1,[Clone Missiles],[Clone Blades],[Fearless;Relentless]
Clone Speeders,skbanebow.png,false,3,95,3,3,3,[Clone Triblasters],[Clone Blades],[Fearless;Fast]
Clone Warwalker,skbanebow.png,true,1,220,3,2,6,[Clone Flamethrower],[Clone Blades],[Fearless;Fast;Strider;Impact_3]
Clone Wartank,skbanebow.png,true,1,580,3,2,12,[Clone Autocannon],[Clone Blades],[Fearless;Fast;Impact_6]
`;

const cryptUnits = `
Crypt Warlord,skbanebow.png,true,1,85,3,3,3,[Crypt Flamer],[Crypt Scythe],[Robot;Regeneration;Slow]
Crypt Troopers,skbanebow.png,false,5,23,4,4,1,[Crypt Reapers],[Crypt Blades],[Robot;Regeneration;Slow]
Crypt Guardians,skbanebow.png,false,5,27,3,3,1,[Crypt Blasters],[Crypt Warblades],[Robot;Regeneration;Slow]
Crypt Eaters,skbanebow.png,false,5,28,3,4,1,,[Crypt Flails],[Robot;Regeneration;Slow;Ambush]
Crypt Immortals,skbanebow.png,false,5,49,3,2,1,[Crypt Flayers],[Crypt Blades],[Robot;Regeneration;Slow]
Crypt Speeders,skbanebow.png,false,3,90,4,4,3,[Crypt Lasers],[Crypt Warblades],[Robot;Regeneration;Fast;Strider]
Crypt Annihilators,skbanebow.png,false,3,138,3,3,3,[Crypt Cannons],[Crypt Warblades],[Robot;Regeneration;Strider;Ambush]
Crypt Deathgrinder,skbanebow.png,true,1,535,3,2,12,[Crypt Deathgazer],[Crypt Deathslicer],[Robot;Regeneration;Strider]
`;

const undeadUnits = `
Undead Warlord,skbanebow.png,true,1,215,3,2,6,,[Undead Warclaws],[Furious;Regeneration;Undead]
Undead Runners,skbanebow.png,false,10,10,5,6,1,,[Undead Claws],[Strider;Undead]
Undead Zombies,skbanebow.png,false,10,11,5,6,1,,[Undead Claws],[Regeneration;Slow;Undead]
Undead Infected,skbanebow.png,false,10,17,5,5,1,[Undead Blasters],[Undead Claws],[Undead]
Undead Gunners,skbanebow.png,false,3,28,5,5,3,[Undead Launcher],[Undead Claws],[Relentless;Undead]
Undead Boomers,skbanebow.png,false,3,58,4,4,3,,[Undead Putridclaws],[Boom_3;Undead]
Undead Slicers,skbanebow.png,false,5,27,3,4,1,,[Undead Toxicators],[Ambush;Strider;Undead]
Undead Rabids,skbanebow.png,false,5,24,4,5,1,,[Undead Rabidclaws],[Fast;Scout;Undead]
Undead Corruptors,skbanebow.png,false,3,80,3,3,3,,[Undead Infectors],[Undead]
Undead Hollower,skbanebow.png,true,1,440,4,2,12,[Undead Battle Cannon],[Undead Warclaws],[Fast;Impact_6;Undead]
Undead Abomination,skbanebow.png,true,1,380,3,2,12,,[Undead Rotclaws],[Undead]
`;

const urukUnits = `
Uruk Captain,skbanebow.png,true,1,120,3,4,6,[Uruk Crossbow],[Uruk Saw],[Furious;Bad Shot;Regeneration]
Uruk Warriors,skbanebow.png,false,10,19,4,5,1,[Uruk Harpoons],[Uruk Blades],[Furious;Bad Shot;Regeneration]
Uruk Berserkers,skbanebow.png,false,5,25,4,6,1,,[Uruk Pikes],[Furious;Bad Shot;Regeneration]
Uruk Flamehurlers,skbanebow.png,false,3,33,4,5,1,[Uruk Flamers],[Uruk Blades],[Furious;Bad Shot;Relentless]
Uruk Launchers,skbanebow.png,false,3,38,4,5,1,[Uruk Missiles],[Uruk Blades],[Furious;Bad Shot;Relentless]
Uruk Punishers,skbanebow.png,false,3,52,3,4,1,[Uruk Gatling],[Uruk Blades],[Furious;Bad Shot;Relentless]
Uruk Specialists,skbanebow.png,false,3,77,3,4,1,[Uruk Plasma],[Uruk Blades],[Furious;Bad Shot;Relentless]
Uruk Battle Truck,skbanebow.png,true,1,475,4,2,12,[Uruk Machine Gun],[Uruk Blades],[Fast;Impact_11;Strider]
`;

const imperialUnits = `
Imperial Dark Lord,skbanebow.png,true,1,195,3,4,6,[Imperial Mortargun],[Imperial Scythe],[Fast;Strider;Relentless;Regeneration]
Imperial Elites,skbanebow.png,false,3,35,4,5,1,[Imperial Skewers],[Imperial Halberds],[Fast;Warlord]
Imperial Infiltrators,skbanebow.png,false,5,32,4,4,1,[Imperial Cannons],[Imperial Halberds],[Fast;Ambush;Flying]
Imperial Troopers,skbanebow.png,false,5,21,4,5,1,[Imperial Blasters],[Imperial Blades],[Fast]
Imperial Speeders,skbanebow.png,false,3,75,4,4,3,[Imperial Triblasters],[Imperial Flails],[Hyperspeed;Strider]
Imperial Guard,skbanebow.png,false,3,77,3,5,3,[Imperial Doomlaunchers],[Imperial Lances],[Regeneration]
Imperial Dark Walker,skbanebow.png,true,1,200,4,2,6,[Imperial Mortarblast],[Imperial Halberds],[Fearless;Regeneration]
Imperial General,skbanebow.png,true,1,935,2,2,18,[Imperial Gaze],[Imperial Saberwall],[Regeneration]
Imperial Deathstar,skbanebow.png,true,1,1245,3,2,24,[Imperial Sunblast],[Imperial Moonblast],[Fearless;Ambush;Flying]
`;

const mercUnits = `
Mercenary Warlord,skbanebow.png,true,1,180,3,3,6,[Mercenary Flamethrower],[Mercenary Gutter],[Stealth]
Mercenary Immolators,skbanebow.png,false,3,72,4,3,3,[Mercenary Flamethrower],[Mercenary Gauntblade],[Ambush;Flying;Furious]
Mercenary Specialists,skbanebow.png,false,3,25,5,5,1,[Mercenary Plasma],[Mercenary Blades],[Relentless]
Mercenary Infantry,skbanebow.png,false,10,14,5,5,1,[Mercenary Blasters],[Mercenary Blades],[Fodder]
Mercenary Fodder,skbanebow.png,false,10,11,5,5,1,[Mercenary Pistols],[Mercenary Gauntlets],[Fodder]
Mercenary Deathwheel,skbanebow.png,true,1,175,4,2,6,[Mercenary Twinflamers],[Mercenary Blades],[Ambush;Fast;Impact_6]
Mercenary Terror Beast,skbanebow.png,true,1,180,4,2,6,[Mercenary Flamedrowser],[Mercenary Goreclaws],[Fearless]
Mercenary Artillery,skbanebow.png,true,1,185,4,2,6,[Mercenary Rocketblaster],[Mercenary Blades],[Slow;Regeneration]
Mercenary Abomination,skbanebow.png,true,1,365,4,2,12,,[Mercenary Deathclaws],[Fearless;Regeneration]
`;

const unitTypesCSV = `
name,img,isSingle,size,cost,skill,defense,hp,shootingWeapons,meleeWeapons,unitEffects
${alienUnits.trim()}
${droidUnits.trim()}
${rebelUnits.trim()}
${tuskUnits.trim()}
${cloneUnits.trim()}
${cryptUnits.trim()}
${undeadUnits.trim()}
${urukUnits.trim()}
${imperialUnits.trim()}
${mercUnits.trim()}
`;

const weaponTypesCSV = `
name,distance,attacks,penetration,weaponEffects
Alien Spinners,6,2,1,[]
Alien Plasma,12,1,4,[]
Alien Shredder,9,2,0,[Rending]
Alien Heavy Ravager,18,3,2,[]
Alien Borers,12,2,0,[]
Alien Light Ravagers,18,2,0,[]
Alien Ravagers,18,3,0,[]
Alien Spitters,24,1,2,[Blast_3]
Alien Fleshrippers,12,4,1,[]
Alien Heavy Shredder,18,6,2,[]
Alien Impaler,24,1,2,[Deadly_3]
Alien Skewergun,30,2,4,[LockOn]
Alien Psyblast,18,1,0,[Blast_3]
Alien Titanic Ravager,18,12,2,[]
Alien Mortar,24,3,0,[Indirect;Blast_3;Lethal]
Alien Flamer,18,2,1,[Blast_3;Reliable]
Alien Fracture Cannon,30,3,3,[Deadly_6]
Alien Toxic Breath,12,12,0,[Poison]
Alien Claws,1,1,0,[]
Alien Droneclaws,1,2,0,[]
Alien Deathclaws,1,2,1,[Rending]
Alien Razorblade,1,12,1,[Rending]
Alien Shredclaws,1,4,1,[Rending]
Alien Flails,1,2,0,[Poison;Reliable]
Alien Poisonfangs,1,4,0,[Poison;Reliable]
Alien Deathblade,1,7,4,[]
Alien Serrators,1,4,4,[]
Alien Voidclaws,1,10,2,[]
Alien Deathjaw,1,5,4,[Deadly_6]
Droid Plasma,12,2,4,[]
Droid Deathcannons,12,1,4,[Deadly_3]
Droid Twinblasters,24,1,4,[]
Droid Twincannons,24,2,4,[]
Droid Railguns,24,1,0,[Reliable]
Droid Blasters,18,1,0,[Rending]
Droid Cannons,18,2,1,[]
Droid Flamers,12,1,0,[Blast_3;Reliable]
Droid Laser Gatling,18,10,1,[]
Droid Storm Blasters,24,12,3,[]
Droid Saberthrow,12,6,4,[Deadly_3]
Droid Force Lightning,24,10,2,[Blast_3;Indirect]
Droid Blades,1,1,0,[]
Droid Twinblades,1,2,0,[]
Droid Lightsaber,1,20,0,[Reliable;Rending]
Droid Dualsaber,1,13,4,[]
Rebel Plasma Pistol,12,2,4,[]
Rebel Lightblasters,12,1,0,[]
Rebel Blasters,24,1,0,[]
Rebel Mortar,30,1,0,[Blast_3;Indirect]
Rebel Launchers,24,1,0,[Blast_3]
Rebel Plasma,24,2,4,[]
Rebel Blades,1,1,0,[]
Rebel Saber,1,2,1,[Rending]
Rebel Piercers,1,1,2,[]
Rebel Heavy Gatling,18,6,0,[]
Rebel Deathbringer,1,10,1,[Rending]
Rebel Heavy Flamer,12,2,1,[Blast_3;Reliable]
Rebel Walkerblade,1,2,1,[]
Rebel Laser Volley,30,12,3,[]
Rebel Smasher,1,6,1,[]
Tusk Dual Blasters,24,6,1,[]
Tusk Warblades,1,4,1,[Rending]
Tusk Blasters,24,1,1,[]
Tusk Blades,1,1,0,[]
Tusk Twinblades,1,2,0,[]
Tusk Plasma,12,1,4,[]
Tusk Pikes,1,2,1,[Rending]
Tusk Warglaives,1,4,2,[Lance]
Tusk Twinlasers,36,4,3,[Deadly_3]
Tusk Heptacannon,36,7,3,[Deadly_3]
Tusk Ram,1,2,0,[]
Tusk Deathflail,1,8,1,[Rending]
Clone Dual Blasters,24,6,1,[]
Clone Triblasters,24,3,1,[]
Clone Blasters,24,1,1,[]
Clone Lasers,18,1,4,[Deadly_3]
Clone Missiles,30,1,2,[Deadly_3;LockOn]
Clone Flamers,12,1,1,[Blast_3;Reliable]
Clone Flamethrower,12,2,1,[Blast_3;Reliable]
Clone Autocannon,30,12,2,[]
Clone Warblades,1,4,1,[Rending]
Clone Blades,1,1,0,[]
Undead Blasters,18,2,0,[]
Undead Launcher,24,1,0,[Blast_3]
Undead Battle Cannon,30,4,2,[Blast_3]
Undead Warclaws,1,6,1,[Rending]
Undead Claws,1,2,0,[]
Undead Toxicators,1,2,0,[Poison]
Undead Rabidclaws,1,2,0,[Rending]
Undead Putridclaws,1,4,0,[Poison]
Undead Infectors,1,4,1,[Rending]
Undead Rotclaws,1,12,3,[]
Crypt Flamer,12,1,0,[Blast_3;Reliable]
Crypt Reapers,18,1,2,[]
Crypt Blasters,12,2,1,[]
Crypt Flayers,24,2,0,[Rending]
Crypt Cannons,24,4,0,[Rending]
Crypt Lasers,24,3,1,[]
Crypt Deathgazer,18,3,3,[Deadly_3]
Crypt Scythe,1,1,2,[Deadly_3]
Crypt Warblades,1,2,0,[]
Crypt Blades,1,1,0,[]
Crypt Flails,1,2,1,[]
Crypt Deathslicer,1,10,2,[]
Uruk Crossbow,18,4,0,[]
Uruk Harpoons,12,1,0,[]
Uruk Flamers,12,1,0,[Blast_3;Reliable]
Uruk Missiles,18,1,2,[Deadly_3]
Uruk Gatling,30,3,1,[]
Uruk Plasma,30,1,4,[Blast_3]
Uruk Machine Gun,30,12,1,[]
Uruk Saw,1,4,1,[Rending]
Uruk Blades,1,2,0,[]
Uruk Pikes,1,1,4,[]
Imperial Mortargun,24,4,0,[Poison]
Imperial Skewers,18,2,0,[Rending]
Imperial Cannons,18,2,0,[Poison]
Imperial Triblasters,18,3,0,[Poison]
Imperial Blasters,24,1,0,[Poison]
Imperial Doomlaunchers,12,1,0,[Poison;Blast_3;Reliable]
Imperial Mortarblast,30,9,0,[Poison]
Imperial Sunblast,36,4,2,[Poison;Blast_6]
Imperial Gaze,12,3,4,[Deadly_3]
Imperial Saberwall,1,18,2,[Rending]
Imperial Moonblast,1,8,2,[]
Imperial Scythe,1,1,0,[Poison;Blast_3]
Imperial Halberds,1,2,1,[Rending]
Imperial Flails,1,2,0,[Poison]
Imperial Lances,1,2,2,[]
Imperial Blades,1,1,0,[]
Mercenary Blasters,18,2,0,[]
Mercenary Pistols,12,1,0,[]
Mercenary Plasma,24,1,4,[]
Mercenary Flamethrower,12,1,0,[Blast_3;Reliable]
Mercenary Twinflamers,12,2,0,[Blast_3;Reliable]
Mercenary Flamedrowser,12,1,1,[Blast_3;Reliable]
Mercenary Rocketblaster,18,2,2,[Deadly_3]
Mercenary Gutter,1,6,0,[]
Mercenary Gauntblade,1,2,1,[Rending]
Mercenary Gauntlets,1,2,0,[]
Mercenary Blades,1,1,0,[]
Mercenary Goreclaws,1,8,1,[]
Mercenary Deathclaws,1,16,1,[]
`;

function parseCSV(csvText) {
    const lines = csvText.trim().split("\n");
    const headers = lines[0].split(",");

    return lines.slice(1).map(line => {
        const values = line.split(",");
        return headers.reduce((obj, header, index) => {
            let value = values[index].trim();

            // Convert bracketed values into arrays
            if (value.startsWith("[") && value.endsWith("]")) {
                value = value.slice(1, -1).split(";").map(v => v.trim());
            } else if (value === "") {
                value = []; // Convert empty fields into empty arrays
            } else if (!isNaN(value)) {
                value = Number(value); // Convert numeric values
            } else if (value.toLowerCase() === "true") {
                value = true; // Convert "true" to boolean
            } else if (value.toLowerCase() === "false") {
                value = false; // Convert "false" to boolean
            }

            obj[header] = value;
            return obj;
        }, {});
    });
}

function parseObstacles() {
    const csvText = document.getElementById("obst_csv").innerText.trim();
    return csvText.split(" ").map(pair => {
        const [x, y] = pair.split(",").map(Number);
        return { x, y };
    });
}
