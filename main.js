//  === LEGEND ===
/* 
    == HUES
 * Green = Healthy
 * Yellow = Incubation Period
 * Red = Contaigious
 * Turquoise = Recovered
 * Blue = Recovered & Immune
 * White(dot) / Black(graph) = Dead

    == INTENSITIES
 * Bright = Practicing Distancing
 * Medium = Staying @ Home
 * Dark = Living Life as Normal
 */

// CHANGE THESE
var config = {
    human: {
        // (px/frame) Speed of the human
        speed: 5, // 5
        // (px) Radius of a human
        radius: 5, // 5
        // (ppl/px^2) How dense the people are
        density: 1/5000 // 1/5000
    },
    virus: {
        // (time) Length of incubation
        incubation: 50, // 50
        // (time) Length of Symptons
        symptomatic: 300, // 300
        // (%) Chance of Death
        mortalityRate: 5/100, // 0/100
        // (%) Chance of Becoming Immune Once Recovered
        immuneChance: 0/100 // 100/100
    },
    behaviours: {
        infected: 1/100, // 1/100
        // (%) Doesnt move (stays @ home)
        constant: 0/10, // 0/10
        // (%) Practices Social Distancing
        distancing: 0/10, // 0/10
        // (factor) How much to social distance
        distancingFactor: 100 // 100
    },
    graph: {
        height: 200, // 200
        // (int) How slow the graph goes
        frameSkip: 10, // 1-20
        // (bool) Show gray for dead or scale it
        countDead: false // true
    }
};

// HUMAN Behaviour Code
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
    this.dead = false;
};
Human.prototype.draw = function() {
    push();
    var l = this.constant ? 200 : this.distancing ? 250 : 150;
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
            fill(0, l, l);
        break;
        case 4:
            fill(0, 0, l);
        break;
        case 5:
            fill(l, l, l, l / 5);
        break;
        default:
            fill(l, 0, l);
    }
    ellipse(this.x, this.y, this.radius * 2, this.radius * 2);
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
    var _r = this.radius
    this.vx *= this.x > width - _r || this.x < _r ? -10 : 1;
    var boxHeight = height - config.graph.height - this.radius;
    this.vy *= this.y > boxHeight || this.y < _r ? -10 : 1;
    this.x = constrain(this.x, _r, width - _r);
    this.y = constrain(this.y, _r, boxHeight);
    if (this.stage === 1) {
        this._timer ++;
        if (this._timer > config.virus.incubation) {
            this.stage ++;
        }
    } else if (this.stage === 2) {
        this._timer ++;
        if (this._timer > config.virus.symptomatic) {
            this._timer = 0;
            this.stage ++;
            if (random() <= config.virus.mortalityRate) {
                this.stage += 2;
                this.dead = true;
            } else if(random() <= config.virus.immuneChance) {
                this.stage ++;
            }
        }
    }
};
Human.prototype.go = function() {
    if (!this.dead) {
        this.update();
    }
    this.draw();
};
Human.prototype.handle = function(anotherHuman) {
    // Check if collision isn't needed
    var alreadyHandled = this.handled.some(function(id) {
        return id == anotherHuman.id;
    });
    if(alreadyHandled || anotherHuman.dead) {
        return;
    }
    if (!anotherHuman.distancing) {
        anotherHuman.handled.push(this.id);
    }
    var _distance = dist(this.x, this.y, anotherHuman.x, anotherHuman.y);
    if (_distance < this.radius + anotherHuman.radius) {
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
    } else if(this.distancing && _distance < this.radius * sq(config.behaviours.distancingFactor)) {
        var _angle = atan2(this.x - anotherHuman.x, this.y - anotherHuman.y);
        var _m = config.human.speed * config.behaviours.distancingFactor / sq(_distance);
        this.vx += sin(_angle) * _m;
        this.vy += cos(_angle) * _m;
    }
};
Human.prototype.infect = function () { 
    if (this.stage === 0 || this.stage === 3) {
        this.stage = 1;
    } else if (this.stage == 1) {
        this._timer += 2;
    } else if (this.stage == 2) {
        this._timer -= 2;
    }
};
// Create the humans
var humans = [];
var populateHumans = function() {

    var _b = config.behaviours
    // Out of every 100 humans, X will be Y
    _infected = _b.infected;
    _constant = _b.constant;
    _distancing = _b.distancing;
    // Configure human population based upon area and density
    var _humanPopulation = width * height * config.human.density;
    // initialize humans
    for(var i = 0; i < _humanPopulation; i ++) {
        var counter = i % 100;
        var infected = false;
        if (counter < _infected * 100) {
            infected = true;
        }
        humans.push(new Human(i, infected));
    }
    var counter = 0;
    while(counter < humans.length * _constant) {
        var i = floor(random(humans.length));
        if (humans[i].constant) {
            continue;
        }
        humans[i].constant = true;
        counter ++;
    }
    counter = 0;
    while(counter < humans.length * _distancing) {
        var i = floor(random(humans.length));
        if (humans[i].distancing || (_constant + _distancing < 100 && humans[i].constant)) {
            continue;
        }
        humans[i].distancing = true;
        counter ++;
    }
};
populateHumans();

// Graph Code
var stats = [];
var graphStats = function(){
    console.log("wat");
    var x = stats.length
    var col = stats[x - 1];
    var y = height;
    var l = 255;
    var m = config.graph.height / (humans.length - (config.graph.countDead ? 0 : col[5]));
    var order = [
        {
            i: 2,
            c: [l, 0, 0]
        },
        {
            i: 1,
            c: [l, l, 0]
        },
        {
            i: 0,
            c: [0, l, 0]
        },
        {
            i: 3,
            c: [0, l, l]
        },
        {
            i: 4,
            c: [0, 0, l]
        }
    ];
    if (config.graph.countDead) {
        order.push({
            i: 5,
            c: [l, l, l, l/5]
        });
    }
    for (var i = 0; i < order.length; i ++) {
        stroke(order[i].c);
        line(x, y - col[order[i].i] * m, x, y);
        y -= col[order[i].i] * m;
    }
};

// Execution
var draw = function() {
    noStroke();
    fill(0);
    rect(0, 0, width, height - config.graph.height);
    
    var thisFrame = (frameCount % config.graph.frameSkip) == 0;
    var _stats = Array(6).fill(0);
    for(var i = humans.length - 1; i > -1; i --) {
        var _h = humans[i];
        _h.go();
        _stats[_h.stage] ++;
        if (!_h.dead) {
            for (var j = 0; j < humans.length; j ++) {
                if (i !== j) {
                    _h.handle(humans[j]);
                }
            }
        }
    }
    if(thisFrame) {
        stats.push(_stats);
        if (stats.length <= width) {
            graphStats();
        }
    }
}
