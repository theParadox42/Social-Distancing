readLocalStorage();

function capitalize (str) {
    if(typeof str === 'string') {
        return str.replace(/^\w/, c => c.toUpperCase());
    } else {
        return '';
    }
};

function createForm () {
    var form = $("#form");
    for(var a in config) {
        form.append(`<h2 title="Category: ${a}">${capitalize(a)}</h2>`);
        for(var b in config[a]) {
            var c = config[a][b];
            if (c.scale) {
                var s = c.scale;
                c.value *= s;
                c.min *= s;
                c.max *= s;
                c.step *= s;
            }
            var rangeElement = `<input type="range" value="${c.value}" min="${c.min}" max="${c.max}" step="${c.step} id="config${capitalize(a)}${capitalize(b)}" name="${a}-${b}">`;
            var labelElement = `<label for="config${capitalize(a)}${capitalize(b)}">${capitalize(b)}</label><br>`;
            form.append(rangeElement);
            form.append(labelElement);
        }
    }
};

createForm();

$("#submit").on("click", () => {
    for (var a in config) {
        for(var b in config[a]) {
            var c = config[a][b];
            var inputValue = document.getElementById(`config${capitalize(a)}${capitalize(b)}`);
            console.log(inputValue);
            if (c.scale) {
                inputValue /= c.scale;
            }
            config[a][b].value = inputValue;
        }
    }
    loadLocalStorage ();
    window.location.href.replace("create.html", "simulation.html");
});
