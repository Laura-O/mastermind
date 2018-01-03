$(document).ready(function() {
    const columns = 4;
    const rows = 8;

    const $board = $("#board");
    const $feedback = $("#feedback");

    let code = [];
    let guess = [];

    let mode = 0;

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
        generateBoard();
        code = [];
        guess = [];
        generateCode();
        playGame();
    });

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

        var setMarker = function(hit, match) {
            console.log("exact:", hit, "colors", match);

            $(".current-feedback")
                .find(".key")
                .slice(0, hit)
                .addClass("black");
            $(".current-feedback")
                .find(".key")
                .slice(hit, match)
                .addClass("white");
            $(".current-feedback")
                .removeClass("current-feedback")
                .prev()
                .addClass("current-feedback");
        };

        if (hit == 4) {
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

    startGame();
});
