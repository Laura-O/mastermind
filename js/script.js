$(document).ready(function() {
    const columns = 4;
    const rows = 8;

    const $board = $("#board");
    const $feedback = $("#feedback");

    let code = [];
    let guess = [];
    let solutions = [];
    let guessCounter = 8;

    let mode = 0;
    let currentEstimation = [];

    let colors = {
        blue: 1,
        red: 2,
        yellow: 3,
        pink: 4,
        green: 5,
        purple: 6,
    };

    $(".restart-game").on("click", function() {
        restart();
    });

    $(".switch-game").on("click", function() {
        if ($("#container").css("flex-direction") == "column") {
            $("#container").css("flex-direction", "column-reverse");
        } else {
            $("#container").css("flex-direction", "column");
        }
        mode = 1;
        $("#board").empty();
        $("#feedback").empty();
        $(".choice").unbind();
        generateBoard();
        code = [];
        guess = [];
        setCode();
    });

    var setCode = function() {
        let solutionIndex = 0;
        code = [];

        $(".choice").on("click", function(e) {
            let color = e.target.className.split(" ")[1];

            $(".solution-hole")
                .eq(solutionIndex)
                .addClass(color)
                .addClass("color")
                .children()
                .hide();

            code.push(colors[color]);

            if (solutionIndex == 3) {
                $(".choice").unbind();
                letPlay(code);
            } else {
                solutionIndex++;
            }
        });
    };

    var letPlay = function(code) {
        console.log(code);
        generateSolutionArray();

        let firstColor = Math.floor(Math.random() * 6) + 1;
        let secondColor = Math.floor(Math.random() * 6) + 1;
        if (firstColor === secondColor) {
            secondColor === 1 ? secondColor++ : secondColor--;
        }
        let firstGuess = [firstColor, firstColor, secondColor, secondColor];
        solve(firstGuess);
    };

    var startGame = function() {
        generateBoard();
        generateCode();
        playGame();
    };

    var restart = function() {
        location.reload();
    };

    var playGame = function() {
        let posIndex = 0;
        console.log(code);

        $("#revert").on("click", function() {
            console.log("revert");
        });

        if (mode === 0) {
            $(".choice").on("click", function(e) {
                let color = e.target.className.split(" ")[1];

                $(".current-guess .hole")
                    .eq(posIndex)
                    .addClass(color)
                    .addClass("color");

                guess.push(colors[color]);

                if (posIndex < 3) {
                    posIndex++;
                } else {
                    evaluateGuess(guess);
                    guess = [];
                    posIndex = 0;
                }
            });
        } else if (mode === 1) {
            console.log("computer plays");
        }
    };

    // Generate code when user is codebreaker
    var generateCode = function() {
        code = Array.from({ length: 4 }, () => Math.ceil(Math.random() * 6));
    };

    var evaluateGuess = function(guess) {
        let currentGuess = guess.slice(0);
        let currentCode = [...code];
        console.log(currentGuess);
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

        if (hit == 4) {
            setMarker(hit, match);
            $(".modal").toggleClass("active");
            $(".x-button").on("click", function() {
                $(".modal").toggleClass("active");
            });
        } else {
            $(".current-guess")
                .removeClass("current-guess")
                .prev()
                .addClass("current-guess");

            setMarker(hit, match);
        }

        return [hit, match];
    };

    var generateBoard = function() {
        for (let x = 0; x < rows; x++) {
            let guess = $("<div>").addClass("guess-row");

            for (let y = 0; y < columns; y++) {
                var hole = $("<div>").addClass("hole");
                guess.append(hole);
            }
            $board.append(guess);
        }

        for (let x = 0; x < rows; x++) {
            let hintRows = columns / 2;

            var $row = $("<div>").addClass("feedback-row");

            for (let y = 0; y < hintRows; y++) {
                var $hintRow = $("<div>").addClass("hint-row");
                let $key = $("<div>").addClass("key");
                $hintRow.append($key.clone());
                $hintRow.append($key.clone());

                $row.append($hintRow);
            }
            $feedback.append($row);
        }

        $(".guess-row")
            .last()
            .addClass("current-guess");

        $("#feedback .feedback-row")
            .last()
            .addClass("current-feedback");
    };

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

    function solve(currentGuess) {
        guessCounter--;
        console.log("Solution length: " + solutions.length);
        currentEstimation = evaluateGuessSolver(currentGuess, code);
        setGuess(currentGuess, currentEstimation);
        evaluateGuess(currentGuess);

        if (currentEstimation.compare([4, 0])) {
            console.log("found: " + currentGuess);
        } else {
            reduceSolutions(currentGuess, currentEstimation);
            currentGuess = solutions[Math.floor(Math.random() * solutions.length)];
            setTimeout(function() {
                solve(currentGuess);
            }, 500);
        }
    }

    function setGuess(guess) {
        for (let x = 0; x < guess.length; x++) {
            let currentColor = Object.keys(colors).find(key => colors[key] === guess[x]);
            $(".current-guess .hole")
                .eq(x)
                .addClass(currentColor)
                .addClass("color");
        }
    }

    var setMarker = function(hit, match) {
        console.log("exact:", hit, "colors", match);

        $(".current-feedback")
            .find(".key")
            .slice(0, hit)
            .addClass("black");
        $(".current-feedback")
            .find(".key")
            .slice(hit, match + hit)
            .addClass("white");
        $(".current-feedback")
            .removeClass("current-feedback")
            .prev()
            .addClass("current-feedback");
    };

    var reduceSolutions = function(currentGuess, currentEstimation) {
        solutions = solutions.filter(function(innerArray) {
            return !evaluateGuessSolver(innerArray, currentGuess).compare(currentEstimation);
        });
    };

    var evaluateGuessSolver = function(guess, compareCode) {
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

    startGame();
});
