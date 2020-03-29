function random(low, high) {
    if (high) {
        return Math.random() * (high - low) + low;
    } else if (low) {
        return Math.random() * low;
    } else {
        return Math.random();
    }
}
function constrain(n, low, high) {
    return Math.max(Math.min(n, high), low);
}
var round = Math.round;
var floor = Math.floor;
var _d = { w: 500, h: 600 };
var width = _d.w, height = _d.h;
function setup() {
    createCanvas(_d.w, _d.h);
    angleMode(DEGREES);
}