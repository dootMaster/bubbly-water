"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.line = exports.pointB = exports.pointA = void 0;
exports.updateLine = updateLine;
const matter_js_1 = require("matter-js");
const screenHeight = 1000;
const screenWidth = 800;
const barSpaceFromBottom = 50;
const barColor = '#4682B4';
exports.pointA = matter_js_1.Bodies.circle(0, screenHeight - barSpaceFromBottom, 10, {
    isStatic: true,
    render: {
        visible: false,
    },
});
exports.pointB = matter_js_1.Bodies.circle(screenWidth, screenHeight - barSpaceFromBottom, 10, {
    isStatic: true,
    render: {
        visible: false,
    },
});
const width = Math.abs(exports.pointB.position.x - exports.pointA.position.x);
const height = 10;
exports.line = matter_js_1.Bodies.rectangle((exports.pointA.position.x + exports.pointB.position.x) / 2, (exports.pointA.position.y + exports.pointB.position.y) / 2, width, height, {
    isStatic: true,
    render: {
        fillStyle: barColor,
    },
});
function updateLine(engine) {
    const xA = exports.pointA.position.x;
    const yA = exports.pointA.position.y;
    const xB = exports.pointB.position.x;
    const yB = exports.pointB.position.y;
    // Calculate the center of the line
    const x = (xA + xB) / 2;
    const y = (yA + yB) / 2;
    // Calculate the width of the line (distance between pointA and pointB)
    const width = Math.sqrt(Math.pow(xB - xA, 2) + Math.pow(yB - yA, 2));
    const height = 5; // Line thickness
    // Calculate the angle of the line
    const angle = Math.atan2(yB - yA, xB - xA);
    // Remove the old line
    matter_js_1.World.remove(engine.world, exports.line);
    // Create a new line with the updated width
    exports.line = matter_js_1.Bodies.rectangle(x, y, width, height, {
        isStatic: true,
        angle: angle,
        render: {
            fillStyle: barColor,
        },
    });
    // Add the new line back to the world
    matter_js_1.World.add(engine.world, exports.line);
}
