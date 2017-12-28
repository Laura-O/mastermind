$(document).ready(function() {
    const columns = 4;
    const rows = 10;

    const $board = $("#board");
    const $feedback = $("#feedback");

    let currentRow;
    let code = [];
    let guess = [];

    let colors = {
        blue: 1,
        red: 2,
        yellow: 3,
        pink: 4,
        green: 5,
        purple: 6,
    };

    var startGame = function() {
        generateBoard();
        generateCode();
        playGame();
    };

    var playGame = function() {
        let posIndex = 0;

        $(".choice").on("click", function(e) {
            let color = e.target.className.split(" ")[1];

            $(".current-row .hole")
                .eq(posIndex)
                .addClass(color);

            guess.push(colors[color]);

            if (posIndex <= 3) {
                posIndex++;
            } else {
                evaluateGuess(guess);
                guess = [];
                posIndex = 0;
            }
            console.log(guess);
        });
    };

    var generateCode = function() {
        code = Array.from({ length: 6 }, () => Math.floor(Math.random() * 6));
    };

    var evaluateGuess = function(guess) {
        let currentGuess = guess.slice(0);
        let hit = 0;
        let match = 0;

        for (let x = 0; x < code.length; x++) {
            if (currentGuess[x] == code[x]) {
                hit++;
                currentGuess[x] = 0;
            }
        }

        for (let y = 0; y < code.length; y++) {
            if (code.indexOf(currentGuess[y]) > 0 && currentGuess[y] !== 0) {
                match++;
            }
        }

        return [hit, match];
    };

    var generateBoard = function() {
        for (let x = 0; x < rows; x++) {
            let guess = $("<div>").addClass("guess");

            for (let y = 0; y < columns; y++) {
                var hole = $("<div>").addClass("hole");
                guess.append(hole);
            }
            $board.append(guess);
        }

        for (let x = 0; x < rows; x++) {
            let hintRows = columns / 2;
            console.log(hintRows);

            var $row = $("<div>").addClass("row");

            for (let y = 0; y < hintRows; y++) {
                var $hintRow = $("<div>").addClass("hint-row");
                let $key = $("<div>").addClass("key");
                $hintRow.append($key.clone());
                $hintRow.append($key.clone());

                $row.append($hintRow);
            }
            $feedback.append($row);
        }

        $(".guess")
            .last()
            .addClass("current-row");
    };

    startGame();
});
