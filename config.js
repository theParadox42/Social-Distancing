// CHANGE THESE
var config = {
    human: {
        // (px/frame) Speed of the human
        speed: {
            value: 4, // 4
            min: 1,
            max: 15,
            step: 1
        },
        // (px) Radius of a human
        radius: {
            value: 4, // 4
            min: 1,
            max: 15,
            step: 1
        },
        // (%rand) How much variation should be applied
        variation: {
            value: 0.1, // 0.1
            min: 0,
            max: 0.9,
            step: 0.1,
            scale: 10
        },
        // (ppl/px^2) How dense the people are
        density: {
            value:25/100000, // 25/100000
            min: 2  /100000,
            max: 100/100000,
            step:2  /100000,
            scale:   100000
        }
    },
    virus: {
        // (time) Length of incubation
        incubation: {
            value: 50, // 50
            min: 0,
            max: 1000,
            step: 10
        },
        // (time) Length of Symptons
        symptomatic: {
            value: 300, // 300
            min: 0,
            max: 1000,
            step: 20
        },
        // (%) Chance of Death
        mortalityRate: {
            value: 100/100, // 4/100
            min: 0,
            max: 1,
            step: 1/100,
            scale: 100
        },
        // (%) Chance of Becoming Immune Once Recovered
        immuneChance: {
            value: 100/100, // 10/100
            min: 0,
            max: 1,
            step: 1/100,
            scale: 100
        }
    },
    behaviours: {
        infected: {
            value: 1/100, // 1/100
            min: 0,
            max: 1,
            step: 1/200,
            scale: 200
        },
        // (%) Doesnt move (stays @ home)
        constant: {
            value: 0, // 0
            min: 0,
            max: 1,
            step: 1/20,
            scale: 20
        },
        // (%) Practices Social Distancing
        distancing: {
            value: 0, // 0/10
            min: 0,
            max: 1,
            step: 1/20,
            scale: 20
        },
        // (int) How much to social distance
        distancingFactor: {
            value: 60, // 60,
            min: 10,
            max: 500,
            step: 10
        }
    },
    graph: {
        height: {
            value: 100, // 100
            min: 50,
            max: 300,
            step: 50
        },
        // (int) How slow the graph goes
        frameSkip: {
            value: 5, // 3
            min: 1,
            max: 30,
            step: 1
        },
        // (bool) Show gray for dead or scale it
        countDead: {
            value: 1, // true
            min: 0,
            max: 1,
            step: 1
        },
        // (int) How wide the post recordings should be
        finalWidth: {
            value: 10, // 10
            min: 0,
            max: 20,
            step: 5
        }
    }
};
function readLocalStorage() {
    localStorage.config = typeof localStorage.config == "string" ? localStorage.config : "";
    console.log(localStorage.config);
    var readObject = JSON.parse(localStorage.config);
    for (var p in config) {
        for (var c in config[p]) {
            var i = config[p][c];
            var _min = i.min;
            var _max = i.max;
            if (readObject[p] && typeof readObject[p][c] == typeof config[p][c].value) {
                config[p][c].value = constrain(readObject[p][c], _min, _max);
            }
        }
    }
};
function loadLocalStorage() {
    var loadObject = {};
    for (var p in config) {
        loadObject[p] = {};
        for (var c in config[p]) {
            var i = config[p][c];
            loadObject[p][c] = i.value;
        }
    }
    localStorage.config = JSON.stringify(loadObject);
}
function updateConfig() {
    readLocalStorage();
    for (var p in config) {
        for (var c in config[p]) {
            config[p][c] = config[p][c].value;
        }
    }
}