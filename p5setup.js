function random(low, high) {
    if (high) {
        return Math.random() * (high - low) + low;
    } else if (low) {
        return Math.random() * low;
    } else {
        return Math.random();
    }
}
var width = 500, height = width;
function setup() {
    createCanvas(1000, 1000);
    angleMode(DEGREES);
    frameRate(20);
}