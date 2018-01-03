let solutions = [];
let code = [];
let counter = 0;
let currentEstimation = [];

function generateSolutionArray() {
    for (let i = 1; i <= 6; i++) {
        for (let j = 1; j <= 6; j++) {
            for (let k = 1; k <= 6; k++) {
                for (let l = 1; l <= 6; l++) {
                    solutions.push([i, j, k, l]);
                }
            }
        }
    }
}

Array.prototype.compare = function(array) {
    if (!array) {
        return false;
    }
    if (this.length !== array.length) {
        return false;
    }
    for (var i = 0, l = this.length; i < l; i++) {
        if (this[i] instanceof Array && array[i] instanceof Array) {
            if (!this[i].compare(array[i])) {
                return false;
            }
        } else if (this[i] !== array[i]) {
            return false;
        }
    }
    return true;
};

function generateCode() {
    return Array.from({ length: 4 }, () => Math.ceil(Math.random() * 6));
}

function start() {
    generateSolutionArray();
    code = generateCode();
    console.log("Code: " + code);

    let firstGuess = [1, 1, 2, 2];
    solve(firstGuess);
}

function solve(currentGuess) {
    console.log("Solution length: " + solutions.length);
    currentEstimation = evaluateGuess(currentGuess, code);

    if (currentEstimation.compare([4, 0])) {
        console.log("found: " + currentGuess);
    } else {
        reduceSolutions(currentGuess, currentEstimation);
        currentGuess = solutions[Math.floor(Math.random() * solutions.length)];
        solve(currentGuess);
    }
}

var reduceSolutions = function(currentGuess, currentEstimation) {
    solutions = solutions.filter(function(innerArray) {
        return !evaluateGuess(innerArray, currentGuess).compare(currentEstimation);
    });
};

var evaluateGuess = function(guess, compareCode) {
    let currentGuess = guess.slice(0);
    let currentCode = compareCode | [...code];
    let hit = 0;
    let match = 0;

    for (let x = 0; x < code.length; x++) {
        if (currentGuess[x] == code[x]) {
            hit++;
            currentGuess[x] = currentCode[x] = null;
        }
    }

    for (let y = 0; y < currentCode.length; y++) {
        if (currentCode.indexOf(currentGuess[y]) != -1 && currentGuess[y] != undefined) {
            match++;
        }
    }

    return [hit, match];
};

start();
