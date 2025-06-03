// Game state
let gameState = {
    round: 1,
    currentPlayer: 0, // 0 = Player 1 (Red), 1 = Player 2 (Blue)
    lastPlayer: 0,
    activatedUnits: [],
    foughtUnits: [],
    selectedUnit: null,
    selectedAction: null,
    movementRange: [],
    attackRange: [],
    units: [],
    remainingUnits: [],
    playerPoints: 0,
    opponentPoints: 0,
    phase: 'selecting' // 'selecting', 'moving', 'shooting'
};

// Parse CSV data
function parseCSV(csv) {
    const lines = csv.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim());

    return lines.slice(1).map(line => {
        const values = line.split(',').map(v => {
            // Handle arrays in brackets
            if (v.trim().startsWith('[') && v.trim().endsWith(']')) {
                return v.trim().slice(1, -1).split(';').map(item => item.trim());
            }
            // Parse numbers
            if (!isNaN(v.trim())) return parseInt(v.trim());
            // Parse booleans
            if (v.trim().toLowerCase() === 'true') return true;
            if (v.trim().toLowerCase() === 'false') return false;
            return v.trim();
        });

        const obj = {};
        headers.forEach((header, index) => {
            obj[header] = values[index];
        });
        return obj;
    });
}

// Parse units and weapons
const unitTypes = parseCSV(unitTypesCSV);
const weaponTypes = parseCSV(weaponTypesCSV);

// Initialize game board
function initBoard() {
    const board = document.getElementById('game-board');
    board.innerHTML = '';

    // Set CSS variables for board size
    document.documentElement.style.setProperty('--board-width', CONFIG.boardWidth);
    document.documentElement.style.setProperty('--board-height', CONFIG.boardHeight);

    let objCSVContent = document.getElementById("obj_csv").textContent.trim();
    let obstCSVContent = document.getElementById("obst_csv").textContent.trim();
    let coverCSVContent = document.getElementById("cover_csv").textContent.trim();

    // Split by space and map to coordinate pairs
    CONFIG.objectiveTiles = objCSVContent.split(" ").map(pair => {
        let [x, y] = pair.split(",").map(Number); // Convert each value to a number
        return [x, y];
    });
    CONFIG.obstacleTiles = obstCSVContent.split(" ").map(pair => {
        let [x, y] = pair.split(",").map(Number); // Convert each value to a number
        return [x, y];
    });
    CONFIG.coverTiles = coverCSVContent.split(" ").map(pair => {
        let [x, y] = pair.split(",").map(Number); // Convert each value to a number
        return [x, y];
    });

    for (let y = 0; y < CONFIG.boardHeight; y++) {
        for (let x = 0; x < CONFIG.boardWidth; x++) {
            const tile = document.createElement('div');
            tile.className = 'tile';
            tile.dataset.x = x;
            tile.dataset.y = y;

            // Add cover to specific tiles
            if (CONFIG.gameMode === 1) {
                if (CONFIG.objectiveTiles.some(pos => pos[0] === x && pos[1] === y)) {
                    tile.classList.add('objective');
                }
                if (CONFIG.coverTiles.some(pos => pos[0] === x && pos[1] === y)) {
                    tile.classList.add('cover');
                } else if (CONFIG.obstacleTiles.some(pos => pos[0] === x && pos[1] === y)) {
                    tile.classList.add('grass');
                }
            } else {
                const centerStartX = Math.floor(CONFIG.boardWidth * 0.3);
                const centerEndX = Math.floor(CONFIG.boardWidth * 0.7);
                const centerStartY = Math.floor(CONFIG.boardHeight * 0.3);
                const centerEndY = Math.floor(CONFIG.boardHeight * 0.7);
                if (Math.random() > 0.8) {
                    CONFIG.obstacleTiles.push([x, y]);
                    tile.classList.add('grass');
                } else if (Math.random() > 0.95) {
                    CONFIG.coverTiles.push([x, y]);
                    tile.classList.add('cover');
                } else if (
                    x >= centerStartX && x <= centerEndX &&
                    y >= centerStartY && y <= centerEndY &&
                    Math.random() > 0.95
                ) {
                    CONFIG.objectiveTiles.push([x, y]);
                    tile.classList.add('objective');
                }
            }

            tile.addEventListener('click', () => handleTileClick(x, y));
            board.appendChild(tile);
        }
    }
}

// Place units on the board
function placeUnits() {
    // Get unit placements from the div
    const placements = document.getElementById('units_csv').innerText.trim().split('\n');

    gameState.units = [];

    placements.forEach((placement, index) => {
        const [unitIndex, x, y, team, sizeOverride] = placement.split(',').map(v => parseInt(v.trim()));

        // Get unit type
        const unitType = unitTypes[unitIndex];
        const size = sizeOverride ? sizeOverride : unitType.size;

        // Create unit
        const unit = {
            id: index,
            name: unitType.name,
            type: unitType,
            x: x,
            y: y,
            team: team,
            owner: team,
            maxHp: size * unitType.hp,
            currentHp: size * unitType.hp,
            maxModels: size,
            currentModels: size,
            cost: unitType.cost,
            hasActivated: false,
            hasAdvanced: false,
            hasHold: false,
            hasFought: false,
            movedThisTurn: false,
            isCharging: false
        };

        gameState.units.push(unit);
    });

    // Initialize remaining units
    gameState.remainingUnits = [...gameState.units];

    renderUnits();
    updateUnitsLeft();
}

// Render units on the board
function renderUnits() {
    // Clear existing units
    document.querySelectorAll('.unit').forEach(unit => unit.remove());

    gameState.units.forEach(unit => {
        if (unit.currentHp <= 0) return; // Skip dead units

        const tile = document.querySelector(`.tile[data-x="${unit.x}"][data-y="${unit.y}"]`);
        if (!tile) return;

        const unitEl = document.createElement('div');
        unitEl.className = `unit player${unit.owner}`;
        if (unit.id === gameState.selectedUnit?.id) {
            unitEl.classList.add('selected');
        }
        if (unit.hasActivated) {
            unitEl.classList.add('moved');
        }
        if (unit.hasFought) {
            unitEl.classList.add('fatigued');
        }

        unitEl.textContent = unit.name.charAt(0);
        unitEl.title = `${unit.name}\nHP: ${unit.currentHp}/${unit.maxHp}  ${unit.type.skill}+ ${unit.type.defense}+`;
        unitEl.dataset.unitId = unit.id;

        // Add model count for multi-model units
        if (!unit.type.isSingle && unit.currentModels > 1) {
            const modelCount = document.createElement('div');
            modelCount.className = 'model-count';
            modelCount.textContent = unit.currentModels;
            unitEl.appendChild(modelCount);
        }

        // HP bar
        const hpBar = document.createElement('div');
        hpBar.className = 'hp-bar';
        const hpFill = document.createElement('div');
        hpFill.className = 'hp-fill';
        const hpPercent = (unit.currentHp / unit.maxHp) * 100;
        hpFill.style.width = `${hpPercent}%`;
        hpBar.appendChild(hpFill);
        unitEl.appendChild(hpBar);

        // Unit info tooltip
        const unitInfo = document.createElement('div');
        unitInfo.className = 'unit-info';
        unitInfo.textContent = unit.name;
        unitEl.appendChild(unitInfo);

        unitEl.addEventListener('click', (e) => {
            e.stopPropagation();
            selectUnit(unit);
        });

        tile.appendChild(unitEl);
    });
}

// Select a unit
function selectUnit(unit) {
    if (gameState.phase === 'shooting' && gameState.currentPlayer !== unit.owner) {
        const weaponName = gameState.selectedUnit.type.shootingWeapons[0];
        const weapon = weaponTypes.find(w => w.name === weaponName);
        if (!weapon) return;
        const range = weapon.distance;

        // Calculate distance between selected unit and target unit
        const distance = Math.abs(gameState.selectedUnit.x - unit.x) + Math.abs(gameState.selectedUnit.y - unit.y);

        // Allow shooting only if the enemy is within range
        if (distance <= Math.round(range / CONFIG.movementDivider)) {
            // Not protected by obstacle
            if (weapon.weaponEffects?.includes('Indirect') || !isProtectedByObstacle(gameState.selectedUnit, unit)) {
                handleTileClick(unit.x, unit.y);
            }
        }
        return;
    }
    // Clear any previous selection
    clearHighlights();

    if (unit.owner === gameState.currentPlayer) {
        if (gameState.selectedUnit && gameState.selectedUnit.hasAdvanced) {
            activateUnit(gameState.selectedUnit);
            return;
        }
        // Selecting own unit
        gameState.selectedUnit = unit;
        gameState.selectedAction = null;
        renderUnits();

        // Update UI
        document.getElementById('selected-unit').textContent = unit.name;
        updateUnitDetails(unit);

        // Show action description
        document.getElementById('action-description').textContent =
            `Select an action for ${unit.name}`;

        // Highlight movement range based on current action
        if (gameState.selectedAction) {
            highlightMovementRange(unit, gameState.selectedAction);
        }
    } else {
        // Selecting enemy unit
        gameState.selectedUnit = unit;
        document.getElementById('selected-unit').textContent = `${unit.name} (Enemy)`;
        updateUnitDetails(unit);

        // Show danger zone (movement range)
        if (!unit.hasActivated) {
            highlightMovementRange(unit, 'danger');
            document.getElementById('action-description').textContent =
                `Viewing enemy unit ${unit.name}. Showing potential movement range.`;
        } else {
            document.getElementById('action-description').textContent =
                `Viewing enemy unit ${unit.name}. This unit has already activated.`;
        }
    }
    updateButtonStates();
}

function isProtectedByObstacle(attacker, defender) {
    // Find all adjacent obstacles to defender
    const adjacentObstacles = CONFIG.obstacleTiles.filter(([ox, oy]) => {
        return Math.abs(ox - defender.x) + Math.abs(oy - defender.y) === 1;
    });
    
    // Check each adjacent obstacle for line-of-sight blocking
    for (const [ox, oy] of adjacentObstacles) {
        if (isInProtectionCone(attacker, defender, {x: ox, y: oy})) {
            return true;
        }
    }
    
    return false;
}

function isInProtectionCone(attacker, defender, obstacle) {
    // Vector from obstacle to defender
    const v_x = defender.x - obstacle.x;
    const v_y = defender.y - obstacle.y;

    // Protection direction (opposite of v)
    const u_x = -v_x;
    const u_y = -v_y;

    // Attacker relative to obstacle
    const a_x = attacker.x - obstacle.x;
    const a_y = attacker.y - obstacle.y;

    // Projection of attacker onto protection direction
    const projection = a_x * u_x + a_y * u_y;

    // Perpendicular distance
    const perp = u_x !== 0 ? Math.abs(a_y) : Math.abs(a_x);

    // Attacker is in cone if projection is positive and exceeds perpendicular distance
    return projection > 0 && projection > perp;
}


// Function to get weapon details
function getWeaponDetails(weaponName) {
    const weapon = weaponTypes.find(w => w.name === weaponName);
    if (!weapon) return '';

    return `${weapon.attacks} attacks at ${weapon.penetration}P ${weapon.distance > 1 ? ' (range: ' + Math.round(weapon.distance / CONFIG.movementDivider) + ')' : ' '} ${weapon.weaponEffects.length > 0 ? ' - ' + weapon.weaponEffects.join(', ') : ' '}`;
}

// Update unit details display
function updateUnitDetails(unit) {
    const details = document.getElementById('unit-details');
    if (!unit) {
        details.innerHTML = 'Select a unit to see details';
        return;
    }

    let effectsHtml = '';
    if (unit.type.unitEffects && unit.type.unitEffects.length > 0) {
        effectsHtml = unit.type.unitEffects.map(effect =>
            `<span class="effect-tag">${effect}</span>`
        ).join('');
    }

    // Show shooting weapons
    let shootingWeapons = '';
    if (unit.type.shootingWeapons && unit.type.shootingWeapons.length > 0) {
        shootingWeapons = `<div><strong>Shooting Weapons:</strong> ${unit.type.shootingWeapons.join(', ')}</div>`;
        unit.type.shootingWeapons.forEach(weaponName => {
            shootingWeapons += "<div>" + getWeaponDetails(weaponName) + "</div>";
        });
    }

    // Show melee weapons
    let meleeWeapons = '';
    if (unit.type.meleeWeapons && unit.type.meleeWeapons.length > 0) {
        meleeWeapons = `<div><strong>Melee Weapons:</strong> ${unit.type.meleeWeapons.join(', ')}</div>`;
        unit.type.meleeWeapons.forEach(weaponName => {
            meleeWeapons += "<div>" + getWeaponDetails(weaponName) + "</div>";
        });
    }

    details.innerHTML = `
                <div class="unit-stats">
                    <div class="stat">HP: ${unit.currentHp}/${unit.maxHp}</div>
                    <div class="stat">Models: ${unit.currentModels}/${unit.maxModels}</div>
                    <div class="stat">Skill: ${unit.type.skill}+</div>
                    <div class="stat">Defense: ${unit.type.defense}+</div>
                    <div class="stat">Cost: ${unit.type.cost * unit.currentModels}</div>
                </div>
                <div class="effects">${effectsHtml}</div>
                ${shootingWeapons}
                ${meleeWeapons}
                
                ${unit.owner !== gameState.currentPlayer ? `
                <div class="danger-zone">
                    <h4>Danger Zone</h4>
                    <p>This enemy unit can move up to ${getMovementDistance(unit, 'danger')} tiles.</p>
                    <p>It has ${unit.type.shootingWeapons?.length || 0} shooting weapons and ${unit.type.meleeWeapons?.length || 0} melee weapons.</p>
                </div>
                ` : ''}
            `;
}

// Get movement distance based on action
function getMovementDistance(unit, action) {
    let movement = 0;

    switch (action) {
        case 'hold':
            movement = 0;
            break;
        case 'advance':
            movement = 6;
            break;
        case 'charge':
            movement = 12;
            break;
        case 'danger':
            movement = 12; // For enemy danger zone
            break;
    }

    // Apply movement modifiers
    if (unit.type.unitEffects?.includes('Fast')) {
        if (action === 'advance') movement += 2;
        if (action === 'charge') movement += 4;
    } else if (unit.type.unitEffects?.includes('Hyperspeed')) {
        if (action === 'advance') movement += 4;
        if (action === 'charge') movement += 8;
    } else if (unit.type.unitEffects?.includes('Slow')) {
        if (action === 'advance') movement -= 2;
        if (action === 'charge') movement -= 4;
    }

    return Math.max(0, movement);
}

// Highlight movement range
function highlightMovementRange(unit, action) {
    clearHighlights();

    let movement = getMovementDistance(unit, action);
    movement = Math.round(movement / CONFIG.movementDivider);

    for (let dy = -movement; dy <= movement; dy++) {
        for (let dx = -movement; dx <= movement; dx++) {
            const distance = Math.abs(dx) + Math.abs(dy);
            if (distance > movement) continue;

            const nx = unit.x + dx;
            const ny = unit.y + dy;

            if (nx >= 0 && nx < CONFIG.boardWidth &&
                ny >= 0 && ny < CONFIG.boardHeight &&
                !isBlocked(nx, ny, unit) &&
    (unit.type.unitEffects?.includes('Flying') || 
    !CONFIG.obstacleTiles.some(pos => pos[0] === nx && pos[1] === ny))) {

                const tile = document.querySelector(`.tile[data-x="${nx}"][data-y="${ny}"]`);
                if (tile) {
                    const highlightClass = action === 'danger' ? 'highlight-danger' : 'highlight-move';
                    tile.classList.add(highlightClass);
                    gameState.movementRange.push({
                        x: nx,
                        y: ny
                    });
                }
            }
        }
    }
}

// Alternative version that highlights all tiles in range
function highlightShootingRange(unit) {
    if(gameState.selectedAction === 'hold') {
        unit.hasHold = true;
    }
    clearHighlights();

    if (!unit.type.shootingWeapons || unit.type.shootingWeapons.length === 0) return;
    const weaponName = unit.type.shootingWeapons[0];
    const weapon = weaponTypes.find(w => w.name === weaponName);
    if (!weapon) return;

    const range = weapon.distance;
    const rangeGrid = Math.round(range / CONFIG.movementDivider);
    const hasIndirect = weapon.weaponEffects?.includes('Indirect');

    for (let dy = -rangeGrid; dy <= rangeGrid; dy++) {
        for (let dx = -rangeGrid; dx <= rangeGrid; dx++) {
            const distance = Math.abs(dx) + Math.abs(dy);
            if (distance > rangeGrid) continue;

            const nx = unit.x + dx;
            const ny = unit.y + dy;

            if (nx >= 0 && nx < CONFIG.boardWidth &&
                ny >= 0 && ny < CONFIG.boardHeight) {

                const tile = document.querySelector(`.tile[data-x="${nx}"][data-y="${ny}"]`);
                if (!tile) continue;

                // Check if there's an enemy unit here
                const targetUnit = gameState.units.find(u => u.x === nx && u.y === ny && u.owner !== unit.owner);
                const isEnemy = !!targetUnit;

                if (isEnemy) {
                    // For enemy units, check protection
                    const isProtected = !hasIndirect && isProtectedByObstacle(unit, targetUnit);
                    tile.classList.add(isProtected ? 'highlight-protected' : 'highlight-attack');
                } else {
                    // For empty tiles, just show range
                    tile.classList.add('highlight-attack');
                }

                gameState.attackRange.push({
                    x: nx,
                    y: ny,
                    protected: isEnemy && !hasIndirect && isProtectedByObstacle(unit, targetUnit)
                });
            }
        }
    }
}

// Check if a tile is blocked
function isBlocked(x, y, movingUnit) {
    // Check if position is out of bounds
    if (x < 0 || x >= CONFIG.boardWidth || y < 0 || y >= CONFIG.boardHeight) {
        return true;
    }

    // Check for other units
    return gameState.units.some(unit =>
        unit.x === x && unit.y === y &&
        unit.id !== movingUnit?.id &&
        unit.currentHp > 0
    );
}

// Clear highlighted tiles
function clearHighlights() {
    document.querySelectorAll('.tile').forEach(tile => {
        tile.classList.remove('highlight-move', 'highlight-attack', 'highlight-danger', 'highlight-protected');
    });
    gameState.movementRange = [];
    gameState.attackRange = [];
}

// Handle tile click
function handleTileClick(x, y) {
    // If in moving phase and unit is selected, move
    if (gameState.phase === 'moving' && gameState.selectedUnit) {
        // Check if it's a movement tile
        const isMovementTile = gameState.movementRange.some(tile => tile.x === x && tile.y === y);

        if (isMovementTile && gameState.selectedUnit.owner === gameState.currentPlayer) {
            moveUnit(gameState.selectedUnit, x, y);
        }
        else {
            gameState.selectedUnit = null;
            clearHighlights();
            renderUnits();
            return;
        }
    }
    // If in shooting phase and unit is selected, check for target
    else if (gameState.phase === 'shooting' && gameState.selectedUnit) {
        // Find unit at clicked position
        const targetUnit = gameState.units.find(unit =>
            unit.x === x && unit.y === y &&
            unit.owner !== gameState.currentPlayer &&
            unit.currentHp > 0
        );

        if (targetUnit) {
            resolveShooting(gameState.selectedUnit, targetUnit);
        }
        else {
            if(gameState.selectedAction === 'advance') {
                activateUnit(gameState.selectedUnit);
                return;
            }
            gameState.selectedUnit = null;
            clearHighlights();
            return;
        }
    }
}

function hasValidTargets(unit) {
    if (!unit?.type?.shootingWeapons || unit.type.shootingWeapons.length === 0) return false;

    const weaponName = unit.type.shootingWeapons[0];
    const weapon = weaponTypes.find(w => w.name === weaponName);
    if (!weapon) return false;
    const hasIndirect = weapon.weaponEffects?.includes('Indirect');

    const finalDistance = Math.round(weapon.distance / CONFIG.movementDivider);
    
    return gameState.units
  .filter(enemy => enemy.currentHp > 0) // Explicitly exclude dead units
  .some(enemy =>
    enemy.owner !== gameState.currentPlayer &&
    getDistance(unit, enemy) <= finalDistance && 
    (hasIndirect || !isProtectedByObstacle(unit, enemy))
  );
}

// Function to calculate distance between two units (Manhattan distance)
function getDistance(unit1, unit2) {
    return Math.abs(unit1.x - unit2.x) + Math.abs(unit1.y - unit2.y);
}


// Move unit to a new position
function moveUnit(unit, x, y) {
    unit.x = x;
    unit.y = y;
    unit.movedThisTurn = true;

    // If this is a charge action, check for adjacent enemies
    if (gameState.selectedAction === 'charge') {
        const adjacentEnemies = findAdjacentEnemies(unit);
        if (adjacentEnemies.length > 0) {
            unit.isCharging = true;
            resolveCombat(unit, adjacentEnemies[0]); // Attack the first adjacent enemy
            // After combat, mark as activated
            activateUnit(unit);
            return;
        }
    }

    // For hold and advance, move to shooting phase
    if ((gameState.selectedAction === 'hold' || gameState.selectedAction === 'advance') && hasValidTargets(gameState.selectedUnit)) {
        gameState.phase = 'shooting';
        renderUnits();

        highlightShootingRange(unit);
        document.getElementById('action-description').textContent =
            `Select an enemy unit to shoot at with ${unit.name}`;
        if(gameState.selectedAction === 'advance') {
            unit.hasAdvanced = true;
            updateButtonStates();
        }
    } else {
        // For charge without adjacent enemy, mark as activated
        activateUnit(unit);
    }
}

function activateUnit(unit) {
    unit.hasAdvanced = false;
    unit.hasHold = false;
    unit.hasActivated = true;
    removeFromRemaining(unit);
    clearHighlights();
    gameState.selectedUnit = null;
    gameState.phase = 'selecting';
    renderUnits();
    updateUnitsLeft();
    checkRoundEnd();
}

// Remove unit from remaining units
function removeFromRemaining(unit) {
    const index = gameState.remainingUnits.findIndex(u => u.id === unit.id);
    if (index !== -1) {
        gameState.remainingUnits.splice(index, 1);
    }
    updateUnitsLeft();
}

// Update units left display
function updateUnitsLeft() {
    const playerUnits = gameState.remainingUnits.filter(u => u.owner === 0);
    const enemyUnits = gameState.remainingUnits.filter(u => u.owner === 1);

    document.getElementById('units-left').textContent =
        `R: ${playerUnits.length} | B: ${enemyUnits.length}`;

    document.getElementById('player-points').textContent =
        `R: ${gameState.playerPoints} | B: ${gameState.opponentPoints}`;
}

// Find adjacent enemies
function findAdjacentEnemies(unit) {
    return gameState.units.filter(other =>
        other.owner !== unit.owner &&
        other.currentHp > 0 &&
        Math.abs(other.x - unit.x) + Math.abs(other.y - unit.y) === 1
    );
}

// Resolve shooting attack
function resolveShooting(attacker, defender) {
    // Get the first shooting weapon
    if (!attacker.type.shootingWeapons || attacker.type.shootingWeapons.length === 0) return;
    const weaponName = attacker.type.shootingWeapons[0];
    const weapon = weaponTypes.find(w => w.name === weaponName);
    if (!weapon) return;

    resolveAttack(attacker, defender, weapon);
    
    document.getElementById('selected-unit').textContent = 'None';
    document.getElementById('unit-details').innerHTML = 'Select a unit to see details';
    document.getElementById('current-action').textContent = 'Select a unit';
    document.getElementById('action-description').textContent = 'Select an action for your unit';

    // Mark unit as activated
    activateUnit(attacker);
}

// Resolve combat
function resolveCombat(attacker, defender) {
    // Determine who attacks first (if defender has Counter, they strike first)
    if (defender.type.unitEffects?.includes('Counter')) {
        resolveAttack(defender, attacker, getMeleeWeapon(defender), true);
        resolveAttack(attacker, defender, getMeleeWeapon(attacker));
    } else {
        resolveAttack(attacker, defender, getMeleeWeapon(attacker));
        resolveAttack(defender, attacker, getMeleeWeapon(defender), true);
    }

    // Check if defender is still alive
    if (defender.currentHp > 0 && attacker.isCharging) {
        // Knock back the attacker
        knockBack(attacker, defender);
    }

    // Mark both units as having fought
    attacker.hasFought = true;
    defender.hasFought = true;
    attacker.isCharging = false;
    renderUnits();
}

// Get melee weapon for a unit
function getMeleeWeapon(unit) {
    if (!unit.type.meleeWeapons || unit.type.meleeWeapons.length === 0) return null;
    const weaponName = unit.type.meleeWeapons[0];
    return weaponTypes.find(weapon => weapon.name === weaponName);
}

// Knock back unit after failed charge
function knockBack(attacker, defender) {
    // Calculate direction away from defender
    let dx = attacker.x - defender.x;
    let dy = attacker.y - defender.y;

    // Normalize direction
    if (dx !== 0) dx = dx > 0 ? 1 : -1;
    if (dy !== 0) dy = dy > 0 ? 1 : -1;

    const newX = attacker.x + dx;
    const newY = attacker.y + dy;

    // Move if the tile is free
    if (!isBlocked(newX, newY, attacker)) {
        attacker.x = newX;
        attacker.y = newY;
        addCombatLog(`⚔️ ${attacker.name} is knocked back to (${newX}, ${newY})`);
    }
}

// Resolve an attack
function resolveAttack(attacker, defender, weapon, isCounterAttack = false) {
    if (!weapon || attacker.currentHp <= 0 || defender.currentHp <= 0) return;

    // Apply fatigue if the unit has fought before
    let effectiveSkill = (attacker.hasFought && gameState.phase !== 'shooting') ? 6 : attacker.type.skill;
    const distance = getDistance(attacker, defender) * CONFIG.movementDivider;

    // Calculate number of attacks
    let numAttacks = attacker.currentModels * weapon.attacks;

    // Apply weapon effects
    let toHitModifier = 0;
    let penetrationModifier = 0;
    let damageModifier = 0;
    let attackModifier = 0;
    let saveModifier = 0;

    // Apply unit effects
    if (attacker.type.unitEffects?.includes('Warlord')) {
        toHitModifier += 1;
    }
    if (attacker.isCharging && attacker.type.unitEffects?.includes('Frenzy')) {
        penetrationModifier += 1;
    }
    if (attacker.isCharging && weapon.weaponEffects?.includes('Lance')) {
        toHitModifier += 1;
        penetrationModifier += 1;
    }
    if (weapon.weaponEffects?.includes('Corrosive')) {
        numAttacks += (attacker.currentHp - attacker.maxHp);
    }
    if (defender.type.unitEffects?.includes('Stealth') && distance > 10 && !weapon.weaponEffects?.includes('LockOn')) {
        toHitModifier -= 1;
    }
    if (attacker.type.unitEffects?.includes('Bad Shot') && distance > 3) {
        effectiveSkill = 5;
    }
    if (attacker.type.unitEffects?.includes('Good Shot') && distance > 3) {
        effectiveSkill = 4;
    }

    // Apply Furious effect
    let furiousExtraHits = 0;

    // Roll to hit
    let hits = 0;
    let rendHits = 0;
    let impactHits = 0;
    let diceResults = [];
    let hitNeeded = Math.max(2, effectiveSkill - toHitModifier);

    if (weapon.weaponEffects?.includes('Reliable')) {
        hitNeeded = 2;
    }
    if (attacker.type.unitEffects?.some(effect => effect.startsWith('Impact_')) && !attacker.hasFought) {
        const impactEffect = attacker.type.unitEffects.find(effect => effect.startsWith('Impact_'));
        const impactValue = parseInt(impactEffect.split('_')[1]);
        impactHits = impactValue;
    }

    numAttacks += attackModifier * attacker.currentModels;
    if (numAttacks < attacker.currentModels) {
        numAttacks = attacker.currentModels; // minimum 1 attack
    }

    for (let i = 0; i < numAttacks; i++) {
        const roll = Math.floor(Math.random() * 6) + 1;
        diceResults.push(roll);

        if (roll >= hitNeeded) {
            hits++;
        }

        if (roll === 6) {
            // Apply Furious effect (extra hits on natural 6)
            if (attacker.isCharging && (attacker.type.unitEffects?.includes('Furious') || attacker.type.unitEffects?.includes('Frenzy'))) {
                furiousExtraHits++;
            }
            if (attacker.type.unitEffects?.includes('Purge') && distance > 2 && distance < 13) {
                furiousExtraHits++;
            }
            if (attacker.hasHold && attacker.type.unitEffects?.includes('Relentless')) {
                furiousExtraHits++;
            }
            if (weapon.weaponEffects?.includes('Rending')) {
                rendHits++;
                hits--;
            }
        }
    }

    // Add Furious extra hits
    hits += furiousExtraHits;

    const effectivePenetration = weapon.penetration + penetrationModifier;
    let saveNeeded = Math.max(2, defender.type.defense - saveModifier + effectivePenetration);
    saveNeeded = Math.min(6, saveNeeded);

    // Check if defender is in cover
    const inCover = CONFIG.coverTiles.some(pos =>
        pos[0] === defender.x && pos[1] === defender.y
    );
    const inObst = CONFIG.obstacleTiles.some(pos =>
        pos[0] === defender.x && pos[1] === defender.y
    );

    if ((inCover || inObst) && !weapon.weaponEffects?.some(effect =>
            effect.startsWith('Blast_') || effect === 'LockOn' || effect === 'Indirect'
        )) {
        saveNeeded = Math.max(2, saveNeeded - 1);
    }

    // Roll saves
    let failedSaves = 0;
    let saveResults = [];

    if (attacker.isCharging && impactHits > 0) {
        hits += impactHits;
    }

    if (weapon.weaponEffects?.some(effect => effect.startsWith('Blast_'))) {
        const blastEffect = weapon.weaponEffects.find(effect => effect.startsWith('Blast_'));
        const blastValue = parseInt(blastEffect.split('_')[1]);
        hits *= Math.min(blastValue, defender.currentModels);
    }

    for (let i = 0; i < hits; i++) {
        const roll = Math.floor(Math.random() * 6) + 1;
        saveResults.push(roll);

        if (roll < saveNeeded) {
            failedSaves++;
        }
        if (roll === 6) {
            if (weapon.weaponEffects?.includes('Poison')) {
                if (Math.floor(Math.random() * 6) + 1 < saveNeeded) {
                    failedSaves++;
                }
            }
        }
        if (roll === 1) {
            if (weapon.weaponEffects?.includes('Lethal')) {
                failedSaves++;
            }
        }
    }

    if (rendHits > 0) {
        for (let i = 0; i < rendHits; i++) {
            const roll = Math.floor(Math.random() * 6) + 1;
            saveResults.push(roll);

            if (roll < 6) {
                failedSaves++;
            }
        }
    }

    // Apply damage
    let damagePerHit = 1;
    if (weapon.weaponEffects?.some(effect => effect.startsWith('Deadly_'))) {
        const deadlyEffect = weapon.weaponEffects.find(effect => effect.startsWith('Deadly_'));
        const deadlyValue = parseInt(deadlyEffect.split('_')[1]);
        damagePerHit = Math.min(deadlyValue, defender.currentHp / defender.currentModels);
    }

    const totalDamage = failedSaves * damagePerHit;
    let counterDamage = 0; let regenHeal = 0;

    if (defender.type.unitEffects?.includes('Regeneration') && !weapon.weaponEffects?.includes('Poison') && !weapon.weaponEffects?.includes('Rending')) {
        for (let i = 0; i < totalDamage; i++) {
            const roll = Math.floor(Math.random() * 6) + 1;
            saveResults.push(roll);

            if (roll >= 5) {
                regenHeal++;
            }
        }
    }

    defender.currentHp = Math.max(0, defender.currentHp - totalDamage + regenHeal);

    // Update model count for multi-model units
    if (!defender.type.isSingle) {
        // Boom effect
        if (defender.type.unitEffects?.some(effect => effect.startsWith('Boom_')) && distance < 3) {
            const boomEffect = defender.type.unitEffects.find(effect => effect.startsWith('Boom_'));
            const boomValue = parseInt(boomEffect.split('_')[1]);
            let diffModel = boomValue * Math.abs(Math.ceil(defender.currentHp / defender.type.hp) - defender.currentModels);
            if (diffModel > 0) {
                for (let i = 0; i < diffModel; i++) {
                    const roll = Math.floor(Math.random() * 6) + 1;
                    saveResults.push(roll);

                    if (roll < saveNeeded) {
                        counterDamage++;
                    }
                }
            }
        }
        defender.currentModels = Math.ceil(defender.currentHp / defender.type.hp);
    }

    // Check if defender is dead
    if (defender.currentHp <= 0) {
        removeUnit(defender);
    }

    // Check if counter damage
    if (counterDamage > 0) {
        attacker.currentHp = Math.max(0, attacker.currentHp - counterDamage);
        attacker.currentModels = Math.ceil(attacker.currentHp / attacker.type.hp);
        if (attacker.currentHp <= 0) {
            removeUnit(attacker);
        }
    }

    // Display attack results
    const attackType = isCounterAttack ? "Counter Attack" : "Attack";
    const combatLog = document.getElementById('dice-results');

    const logEntry = document.createElement('div');
    logEntry.className = 'dice-roll';
    logEntry.innerHTML = `
                <p><strong>${attackType}:</strong> 
                <span class="player${attacker.owner}">${attacker.name}</span> vs 
                <span class="player${defender.owner}">${defender.name}</span> with ${weapon.name}</p>
                <p>To Hit: ${diceResults.join(', ')} (needed ${hitNeeded}+) - ${hits} hits</p>
                <p>Saves: ${saveResults.join(', ')} (needed ${saveNeeded}+) - ${failedSaves} failed</p>
                <p>Damage dealt: ${totalDamage}</p>
                ${defender.currentHp <= 0 ? `<p>${defender.name} has been defeated!</p>` : ''}
                ${furiousExtraHits > 0 ? `<p>Furious: +${furiousExtraHits} extra hits!</p>` : ''}
            `;

    // Prepend to keep most recent on top
    combatLog.insertBefore(logEntry, combatLog.firstChild);

    // Scroll to top of combat log
    combatLog.scrollTop = 0;
    updatePoints();
}

// Add message to combat log
function addCombatLog(message) {
    const combatLog = document.getElementById('dice-results');
    const logEntry = document.createElement('div');
    logEntry.className = 'dice-roll';
    logEntry.innerHTML = `<p>${message}</p>`;
    combatLog.insertBefore(logEntry, combatLog.firstChild);
    combatLog.scrollTop = 0;
}

// Remove dead unit
function removeUnit(unit) {
    addCombatLog(`💀 ${unit.name} has been destroyed!`);
    unit.currentHp = 0;
    unit.currentModels = 0;
    removeFromRemaining(unit);
}

// Check if round should end
function checkRoundEnd() {
    // Check if all units have activated
    if (gameState.remainingUnits.length === 0) {
        gameState.lastPlayer = 1 - gameState.currentPlayer;
        nextRound();
    } else {
        gameState.currentPlayer = 1 - gameState.currentPlayer;
        updatePlayerDisplay();
        // Switch to next player if current player has no units left
        const playerUnitsLeft = gameState.remainingUnits.filter(u => u.owner === gameState.currentPlayer);
        if (playerUnitsLeft.length === 0) {
            gameState.currentPlayer = 1 - gameState.currentPlayer;
            updatePlayerDisplay();
        }

    }
}

// End current player's turn
function endTurn() {
    // Mark all current player's units as activated
    gameState.units.forEach(unit => {
        if (unit.owner === gameState.currentPlayer && !unit.hasActivated) {
            unit.hasActivated = true;
            removeFromRemaining(unit);
        }
    });

    checkRoundEnd();
}

// Start next round
function nextRound() {
    gameState.round++;
    document.getElementById('round-count').textContent = gameState.round;

    // Reset all units
    gameState.units.forEach(unit => {
        if (unit.currentHp > 0) {
            unit.hasActivated = false;
            unit.hasFought = false;
            unit.movedThisTurn = false;
            unit.isCharging = false;
        }
    });

    // Count units on objective tiles
    gameState.units.forEach(unit => {
        if (unit.currentHp > 0) {
            if (CONFIG.objectiveTiles.some(pos => pos[0] === unit.x && pos[1] === unit.y)) {
                if (unit.owner === 0) {
                    gameState.playerPoints++;
                } else if (unit.owner === 1) {
                    gameState.opponentPoints++;
                }
        }
        }
    });

    // Reset remaining units
    gameState.remainingUnits = gameState.units.filter(u => u.currentHp > 0);

    // Reset to first player
    gameState.currentPlayer = gameState.lastPlayer;
    updatePlayerDisplay();

    // Reset selection
    gameState.selectedUnit = null;
    gameState.selectedAction = null;
    gameState.phase = 'selecting';
    clearHighlights();
    document.getElementById('selected-unit').textContent = 'None';
    document.getElementById('unit-details').innerHTML = 'Select a unit to see details';
    document.getElementById('current-action').textContent = 'Select a unit';
    document.getElementById('action-description').textContent = 'Select an action for your unit';

    addCombatLog(`🔄 Starting Round ${gameState.round}`);
    renderUnits();
    updateUnitsLeft();
}

function updatePoints() {
    let player_points = 0;
    let opp_points = 0;

    gameState.units.forEach(unit => {
        if(unit.currentHp > 0) {
            if (unit.owner === 0) {
                player_points += unit.cost * unit.currentModels;
            } else if (unit.owner === 1) {
                opp_points += unit.cost * unit.currentModels;
            }
        }
    });

    document.getElementById('player_points').innerHTML = player_points;
    document.getElementById('opp_points').innerHTML = opp_points;
}

// Update player display
function updatePlayerDisplay() {
    const playerEl = document.getElementById('current-player');
    playerEl.textContent = gameState.currentPlayer === 0 ?
        'Player 1 (Red)' : 'Player 2 (Blue)';
    playerEl.className = `current-player player${gameState.currentPlayer}`;
}

// Function to update button states
function updateButtonStates() {
    let canActBtn = canActivateUnit(gameState.selectedUnit);
    const buttons = ['btn-hold', 'btn-advance', 'btn-charge', 'btn-pass'];
    buttons.forEach(id => {
        const button = document.getElementById(id);
        button.disabled = !canActBtn;
    });
}

// Function to check if an action can be taken
function canActivateUnit(unit) {
    return unit && gameState.currentPlayer === unit.owner && !unit.hasActivated;
}

// Function to handle action selection
function selectAction(action, description, phase, highlightFunction) {
    if (canActivateUnit(gameState.selectedUnit)) {
        if (action === 'pass') {
            activateUnit(gameState.selectedUnit);
            return;

        }
        if (action === 'hold' && !hasValidTargets(gameState.selectedUnit)) {
            moveUnit(gameState.selectedUnit, gameState.selectedUnit.x, gameState.selectedUnit.y);
            return;
        }
        gameState.selectedAction = action;
        document.getElementById('current-action').textContent = action.charAt(0).toUpperCase() + action.slice(1);
        document.getElementById('action-description').textContent = description;
        gameState.phase = phase;
        highlightFunction(gameState.selectedUnit);
    }
}

// Initialize the game
function initGame() {
    initBoard();
    placeUnits();
    updatePlayerDisplay();
    updatePoints();

    // Add event listeners
    document.getElementById('btn-hold').addEventListener('click', () => {
        selectAction(
            'hold',
            `${gameState.selectedUnit.name} will not move and can shoot. Select a target.`,
            'shooting',
            highlightShootingRange
        );
    });

    document.getElementById('btn-advance').addEventListener('click', () => {
        selectAction(
            'advance',
            `${gameState.selectedUnit.name} will move up to 6 tiles and can shoot. Select a movement location.`,
            'moving',
            unit => highlightMovementRange(unit, 'advance')
        );
    });

    document.getElementById('btn-charge').addEventListener('click', () => {
        selectAction(
            'charge',
            `${gameState.selectedUnit.name} will move up to 12 tiles and attack if adjacent to an enemy. Select a movement location.`,
            'moving',
            unit => highlightMovementRange(unit, 'charge')
        );
    });

    document.getElementById('btn-pass').addEventListener('click', () => {
        selectAction(
            'pass',
            `${gameState.selectedUnit.name} will do nothing.`,
            'moving',
            highlightShootingRange
        );
    });

    document.getElementById('btn-end-turn').addEventListener('click', endTurn);
    document.getElementById('btn-next-round').addEventListener('click', nextRound);
    document.getElementById('btn-clear-log').addEventListener('click', () => {
    document.getElementById('dice-results').innerHTML = '';
    });
}

// Start the game when page loads
window.addEventListener('DOMContentLoaded', initGame);
