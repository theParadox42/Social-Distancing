function random(low, high) {
    if (high) {
        return Math.random() * (high - low) + low;
    } else if (low) {
        return Math.random() * low;
    } else {
        return Math.random();
    }
}
var round = Math.round;
var floor = Math.floor;
var _d = { w: 1000, h: 1200 };
var width = _d.w, height = _d.h;
function setup() {
    createCanvas(_d.w, _d.h);
    angleMode(DEGREES);
}