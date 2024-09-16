"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleKeyDown = handleKeyDown;
exports.handleKeyUp = handleKeyUp;
exports.updateMovement = updateMovement;
const matter_js_1 = require("matter-js");
const bar_1 = require("./bar");
const screenTop = 0;
const screenHeight = 1000;
const screenBottom = screenHeight;
const keyState = {
    r: false,
    f: false,
    u: false,
    j: false,
};
function handleKeyDown(event) {
    if (keyState.hasOwnProperty(event.key)) {
        keyState[event.key] = true;
    }
}
function handleKeyUp(event) {
    if (keyState.hasOwnProperty(event.key)) {
        keyState[event.key] = false;
    }
}
function updateMovement() {
    const moveSpeed = 1.2;
    if (keyState['r'] && bar_1.pointA.position.y - moveSpeed > screenTop) {
        matter_js_1.Body.translate(bar_1.pointA, { x: 0, y: -moveSpeed }); // Move point A up
    }
    if (keyState['f'] && bar_1.pointA.position.y + moveSpeed < screenBottom) {
        matter_js_1.Body.translate(bar_1.pointA, { x: 0, y: moveSpeed }); // Move point A down
    }
    if (keyState['u'] && bar_1.pointB.position.y - moveSpeed > screenTop) {
        matter_js_1.Body.translate(bar_1.pointB, { x: 0, y: -moveSpeed }); // Move point B up
    }
    if (keyState['j'] && bar_1.pointB.position.y + moveSpeed < screenBottom) {
        matter_js_1.Body.translate(bar_1.pointB, { x: 0, y: moveSpeed }); // Move point B down
    }
}
window.addEventListener('keydown', handleKeyDown);
window.addEventListener('keyup', handleKeyUp);
