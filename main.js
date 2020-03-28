var config = {
    human: {
        speed: 5,
        radius: 5,
        density: 1/5000 // XX person / YY pixels
    },
    virus: {
        incubation: 50,
        symptomatic: 300,
        onlyOnce: true,
        mortalityRate: 3 // As a percent
    },
    behaviours: {
        // must not exceed 100
        infected: 1,
        constant: 0, //doesnt move
        distancing: 0 // attempts to move away from others
    },
    graph: {
        height: 200
    }
};

var Human = function(id, infected) {
    this.x = random(width);
    this.y = random(height - config.graph.height);
    this.radius = config.human.radius;
    var _direction = random(360);
    this.stage = infected ? 2 : 0;
    this._timer = 0; 
    this.id = id;
    this.handled = [];
    this.constant = false;
    this.distancing = false;
    this.vx = Math.sin(_direction) * config.human.speed;
    this.vy = Math.cos(_direction) * config.human.speed;
};
Human.prototype.draw = function() {
    push();
    var l = 255;
    switch(this.stage) {
        case 0:
            fill(0, l, 0);
        break;
        case 1:
            fill(l, l, 0);
        break;
        case 2:
            fill(l, 0, 0);
        break;
        case 3:
            fill(l, 0, l);
        break;
        default:
            fill(0, l, l);
    }
    if (this.constant) {
        stroke(128, 0, 0);
    } else if (this.distancing) {
        stroke(0, 0, 128);
    } else {
        stroke(0, 128, 0);
    }
    ellipse(this.x, this.y, this.radius * 2, this.radius * 2);
    //console.log(this.x);
    pop();
};
Human.prototype.update = function() {
    this.handled = [];
    if(!this.constant) {
        var _speed = mag(this.vx, this.vy);
        if (_speed != config.human.speed) {
            var _m = config.human.speed / _speed
            this.vx *= _m;
            this.vy *= _m; 
        }
        this.x += this.vx;
        this.y += this.vy;
    }
    this.x = this.x > width ? 0 : this.x < 0 ? width: this.x;
    this.y = this.y > height - config.graph.height - this.radius ? 0 : this.y < 0 ? height - config.graph.height - this.radius : this.y;
    if (this.stage == 1 || this.stage == 2) {
        this._timer ++;
        if (this._timer > config.virus[this.stage == 1 ? "incubation" : "symptomatic"]) {
            this.stage ++;
        }
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
    if (!anotherHuman.distancing) {
        anotherHuman.handled.push(this.id);
    }
    var _distance = dist(this.x, this.y, anotherHuman.x, anotherHuman.y);
    if (_distance < this.radius + anotherHuman.radius) {
        // console.log(this.id);
        // Alright a collision has been detected, now we handle it
        var _angle = atan2(this.x - anotherHuman.x, this.y - anotherHuman.y);
        
        var _apply = {
            x: sin(_angle) * config.human.speed,
            y: cos(_angle) * config.human.speed
        }
        this.vx += _apply.x, this.vy += _apply.y;
        anotherHuman.vx -= _apply.x, anotherHuman.vy -= _apply.y;
        if (this.stage == 2) {
            anotherHuman.infect();
        }
        if (anotherHuman.stage == 2) {
            this.infect();
        }
    } else if(this.distancing && _distance < this.radius * 6) {
        var _angle = atan2(this.x - anotherHuman.x, this.y - anotherHuman.y);
        this.vx += sin(_angle) * config.human.speed / 10;
        this.vy += cos(_angle) * config.human.speed / 10;
    }
};
Human.prototype.infect = function () { 
    if (this.stage == 0) {
        this.stage ++;
    } else if (this.stage == 1) {
        this._timer += 2;
    } else if (this.stage == 2) {
        this._timer -= 2;
    }
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
    // initialize humans
    for(var i = 0; i < _humanPopulation; i ++) {
        var counter = i % 100;
        var infected = false;
        if (counter < _infected) {
            infected = true;
        }
        humans.push(new Human(i, infected));
    }
    var counter = 0;
    while(counter < humans.length * _constant / 100) {
        var i = floor(random(humans.length));
        if (humans[i].constant) {
            continue;
        }
        humans[i].constant = true;
        counter ++;
    }
    counter = 0;
    while(counter < humans.length * _distancing / 100) {
        var i = floor(random(humans.length));
        if (humans[i].distancing || (_constant + _distancing < 100 && humans[i].constant)) {
            continue;
        }
        humans[i].distancing = true;
        counter ++;
    }
};
populateHumans();

var stats = [];
var draw = function() {
    noStroke();
    fill(0);
    rect(0, 0, width, height - config.graph.height);
    
    var _stats = [0, 0, 0, 0, humans.length];
    for(var i = humans.length - 1; i > -1; i --) {
        var _h = humans[i];
        _h.go();
        _stats[_h.stage] ++;
        for (var j = 0; j < humans.length; j ++) {
            if (i != j) {
                _h.handle(humans[j]);
            }
        }
    }
    stats.push(_stats);
    var i = stats.length
    var col = _stats;
    var y = height;
    var l = 255;
    var m = config.graph.height / col[4];
    stroke(l, 0, 0);
    line(i, y - col[2] * m, i, y);
    y -= col[2] * m;
    stroke(l, l, 0);
    line(i, y - col[1] * m, i, y);
    y -= col[1] * m
    stroke(0, l, 0);
    line(i, y - col[0] * m, i, y);
    y -= col[0] * m;
    stroke(l, 0, l);
    line(i, y - col[3] * m, i, y);
}
