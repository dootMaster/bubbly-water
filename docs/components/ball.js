"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.THE_BALL = exports.ballCollisionBody = void 0;
const matter_js_1 = require("matter-js");
const collisionMasks_1 = require("./collisionMasks");
const screenHeight = 1000;
const screenWidth = 800;
const ballRadius = 800 / 32;
const ball = matter_js_1.Bodies.circle(screenWidth / 2, screenHeight - 60, ballRadius, {
    density: 0.3,
    restitution: 0.05,
    friction: 0.05,
    mass: 300,
    render: {
        fillStyle: '#FF6F61', // Color of the ball
    },
});
exports.ballCollisionBody = matter_js_1.Bodies.circle(screenWidth / 2, screenHeight - 60, ballRadius * 0.2, {
    isSensor: true, // This smaller body won't cause physical collisions
    render: {
        visible: true, // Hidden smaller collision body
        fillStyle: '#ffffff',
    },
    collisionFilter: {
        category: collisionMasks_1.BALL_LAYER,
        mask: collisionMasks_1.GOAL_LAYER | collisionMasks_1.DEATH_LAYER,
    },
});
exports.THE_BALL = matter_js_1.Body.create({
    parts: [ball, exports.ballCollisionBody], // Attach both the visual and collision bodies
});
