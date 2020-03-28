var config = {
    human: {
        speed: 2,
        radius: 3,
        density: 1/1000 // 1 person / 1000 pixels
    },
    virus: {
        length: 50,
        onlyOnce: true,
        mortalityRate: 3 // As a percent
    },
    behaviours: {
        // as percents, total must not exceed 100, or distribution will be inaccurate
        infected: 1,
        constant: 2, //doesnt move
        distancing: 2, // attempts to move away from others
    }
};

var Human = function(id, infected, constant, distancing) {
    this.x = random(0, width);
    this.y = random(height);
    this.radius = config.human.radius;
    var _direction = random(360);
    this.stage = infected ? 2 : 0;
    this.id = id;
    this.handled = [];
    this.constant = constant;
    this.distancing = distancing;
    this.vx = Math.sin(_direction) * config.human.speed;
    this.vy = Math.cos(_direction) * config.human.speed;
};
Human.prototype.draw = function() {
    push();
    noStroke();
    switch(this.stage) {
        case 0:
            fill(0, 255, 0);
        break;
        case 1:
            fill(255, 255, 0);
        break;
        case 2:
            fill(255, 0, 0);
        break;
        case 3:
            fill(255, 0, 255);
        break;
        default:
            fill(0, 255, 255);
    }
    ellipse(this.x, this.y, this.radius * 2, this.radius * 2);
    //console.log(this.x);
    pop();
};
Human.prototype.update = function() {
    this.handled = [];
    if(!this.constant) {
        this.x += this.vx;
        this.y += this.vy;
    }
};
Human.prototype.go = function() {
    this.update();
    this.draw();
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

var humans = [];
var populateHumans = function() {

    var _b = config.behaviours
    // Out of every 100 humans, X will be Y
    _infected = _b.infected || 1;
    _constant = _b.constant || 0;
    _distancing = _b.distancing || 0; 
    // Configure human population based upon area and density
    var _humanPopulation = width * height * (config.human.density || 1/1000);
    // configure the ranges for selection
    _constant += _infected;
    _distancing += _constant;
    // initialize humans
    for(var i = 0; i < _humanPopulation; i ++) {
        var counter = i % 100;
        var h = {};
        if (counter < _infected) {
            h.infected = true;
        } else if(counter < _constant) {
            h.constant = true;
        } else if(counter < _distancing) {
            h.distancing = true;
        }
        humans.push(new Human(i, h.infected, h.constant, h.distancing));
    }
};

populateHumans();

var draw = function() {
    background(50, 60, 70);
    fill(255, 0, 0);
    
    for(var i = humans.length - 1; i > -1; i --) {
        humans[i].go();
        if (humans[i].dead) {
            humans.splice(i, 1);
        } else {
            for (var j = 0; j < humans.length; j ++) {
                // console.log(i, j);
                if (i != j) {
                    humans[i].handle(humans[j]);
                }
            }
        }
    }
    
}
