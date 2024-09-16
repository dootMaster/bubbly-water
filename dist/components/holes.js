"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.currentGoal = exports.holes = void 0;
exports.createNonOverlappingHoles = createNonOverlappingHoles;
exports.randomGoal = randomGoal;
const matter_js_1 = require("matter-js");
const seedrandom = require('seedrandom');
const collisionMasks_1 = require("./collisionMasks");
const SEED = 'keep making things';
const rng = seedrandom(SEED);
const screenHeight = 1000;
const screenWidth = 800;
exports.holes = [];
const ballRadius = 800 / 32;
const holeRadius = ballRadius + 5; // Slightly larger than the ball
const numberOfHoles = 60; // Number of holes
function isOverlapping(x, y) {
    for (const hole of exports.holes) {
        const dx = hole.position.x - x;
        const dy = hole.position.y - y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const radius = hole.circleRadius || 0; // Access the radius safely
        // If the distance between centers is less than the sum of the radii, they overlap
        if (distance < radius * 2.1) {
            return true;
        }
    }
    return false;
}
function createNonOverlappingHoles() {
    let attempts = 0;
    while (exports.holes.length < numberOfHoles && attempts < 1000) {
        // Limit attempts to prevent infinite loops
        const x = rng() * (screenWidth - 2 * holeRadius) + holeRadius;
        const y = rng() * (screenHeight - 200 - 2 * holeRadius) + holeRadius + 80; // Avoid top and bottom
        // Check if the new hole overlaps with any existing holes
        if (!isOverlapping(x, y)) {
            const hole = matter_js_1.Bodies.circle(x, y, holeRadius, {
                collisionFilter: {
                    category: collisionMasks_1.DEATH_LAYER,
                    mask: collisionMasks_1.BALL_LAYER,
                },
                isStatic: true,
                isSensor: true,
                render: { fillStyle: '#000' },
            });
            exports.holes.push(hole);
        }
        attempts++;
    }
}
let holeder = null;
let goalder = null;
const randomSeededIndexes = [];
const totalGoals = 10;
exports.currentGoal = 0;
for (let i = 0; i < totalGoals; i++) {
    randomSeededIndexes.push(Math.floor(rng() * exports.holes.length));
}
function generateGoal(x, y) {
    return matter_js_1.Bodies.circle(x, y, holeRadius, {
        isStatic: true,
        isSensor: true,
        render: {
            fillStyle: '#32CD32',
        },
        collisionFilter: {
            category: collisionMasks_1.GOAL_LAYER,
            mask: collisionMasks_1.BALL_LAYER,
        },
    });
}
function randomGoal(engine) {
    let randomHole = exports.holes[randomSeededIndexes[exports.currentGoal]];
    let newGoal = generateGoal(randomHole.position.x, randomHole.position.y);
    if (!holeder) {
        // First-time setup
        holeder = randomHole;
        goalder = newGoal;
        // Replace the random hole with the goal
        matter_js_1.World.remove(engine.world, randomHole);
        matter_js_1.World.add(engine.world, newGoal);
    }
    else {
        // Swap back the previous goal to a hole
        if (goalder) {
            matter_js_1.World.remove(engine.world, goalder);
        }
        matter_js_1.World.add(engine.world, holeder);
        // Increment current goal and replace with new goal
        exports.currentGoal++;
        holeder = randomHole;
        goalder = newGoal;
        // Replace new hole with goal
        const nextRandomHole = exports.holes[randomSeededIndexes[exports.currentGoal]];
        const nextGoal = generateGoal(nextRandomHole.position.x, nextRandomHole.position.y);
        matter_js_1.World.remove(engine.world, nextRandomHole);
        matter_js_1.World.add(engine.world, nextGoal);
    }
    // Return the ID of the new goal
    return newGoal.id;
}
