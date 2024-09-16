"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const matter_js_1 = require("matter-js");
const bar_1 = require("./components/bar");
const controls_1 = require("./components/controls");
const ball_1 = require("./components/ball");
const holes_1 = require("./components/holes");
const engine = matter_js_1.Engine.create();
const world = engine.world;
const screenHeight = 1000;
const screenWidth = 800;
const render = matter_js_1.Render.create({
    element: document.body,
    canvas: document.getElementById('gameCanvas'),
    engine: engine,
    options: {
        width: screenWidth,
        height: screenHeight,
        wireframes: false,
        background: '#f0f0f0',
    },
});
matter_js_1.Render.run(render);
const runner = matter_js_1.Runner.create();
matter_js_1.Runner.run(runner, engine);
matter_js_1.World.add(world, [bar_1.pointA, bar_1.pointB, bar_1.line]);
(0, holes_1.createNonOverlappingHoles)();
matter_js_1.World.add(engine.world, [...holes_1.holes, ball_1.THE_BALL]);
let goalId = (0, holes_1.randomGoal)(engine);
matter_js_1.Events.on(engine, 'collisionStart', (event) => {
    event.pairs.forEach((pair) => {
        // console.log('Collision pair:', pair.bodyA, pair.bodyB)
        if ((pair.bodyA === ball_1.ballCollisionBody && pair.bodyB.id === goalId) ||
            (pair.bodyA.id === goalId && pair.bodyB === ball_1.ballCollisionBody)) {
            console.log('Goal reached!');
            RESET();
            goalId = (0, holes_1.randomGoal)(engine);
        }
        // if (pair.bodyA === compositeBall && pair.bodyB === deathHole) {
        //   console.log('Goal reached!')
        //   // Reset ball or trigger win event
        // }
    });
});
function resetHelper(body, x, y) {
    matter_js_1.Body.setPosition(body, { x, y });
    matter_js_1.Body.setVelocity(body, { x: 0, y: 0 });
}
function RESET() {
    console.log('reset');
    resetHelper(bar_1.pointA, 0, screenHeight - 50);
    resetHelper(bar_1.pointB, screenWidth, screenHeight - 50);
    (0, bar_1.updateLine)(engine);
    resetHelper(ball_1.THE_BALL, screenWidth / 2, screenHeight - 60);
}
function gameLoop() {
    (0, controls_1.updateMovement)();
    (0, bar_1.updateLine)(engine);
    matter_js_1.Engine.update(engine);
    requestAnimationFrame(gameLoop);
}
gameLoop();
