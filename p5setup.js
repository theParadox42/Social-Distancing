function random(low, high) {
    if (high) {
        return Math.random() * (high - low) + low;
    } else if (low) {
        return Math.random() * low;
    } else {
        return Math.random();
    }
}
var width = 400, height = 400;
function setup() {
    createCanvas(width, height);
    angleMode(DEGREES);
}