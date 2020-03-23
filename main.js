var config = {
    human: {
        speed: 2,
        radius: 3,
        density: 1/1000 // 1 person / 1000 pixels
    },
    virus: {
        length: 50,
        onlyOnce: true,
    }
};

var Human = function(id, type) {
    this.x = random(width);
    this.y = random(height);
    var _direction = random(360);
    this.stage = 1;
    this.id = id;
    this.handled = [];
};
Human.prototype.draw = function() {

};
Human.prototype.update = function() {
    this.handled = [];
    if(this.type == "move") {
        this.x += this.vx;
        this.y += this.vy;
    }
};
Human.prototype.handle = function(anotherHuman) {
    // Check if collision isn't needed
    var alreadyHandled = this.handled.some(function(id) {
        return id == anotherHuman.id;
    });
    if(alreadyHandled) {
        return;
    }
    anotherHuman.handled.push(this.id);
    if (dist(this.x, this.y, anotherHuman.x, anotherHuman.y) > this.radius + anotherHuman.radius) {
        return;
    }
    // Alright a collision has been detected, now we handle it
    
};


var draw = function() {
    background(200, 220, 250);
    
}
