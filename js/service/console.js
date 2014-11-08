angular.module("ng-chinese-chess").service("ConsoleLogger", ["ChessText", function (Text) {
    var logger = {

        log: function (step) {
            var numbers = ["一", "二", "三", "四", "五", "六", "七", "八", "九"];
            var directions = ["进", "平", "退"];

            var chessText = Text[step.chess.type + (step.chess.color + 1) * 7 / 2];

            var direction;
            if (step.from.y > step.chess.y) {
                direction = -1;
            }
            else if (step.from.y == step.chess.y) {
                direction = 0;
            }
            else if (step.from.y < step.chess.y) {
                direction = 1;
            }

            var stepLength;
            if (step.from.x == step.chess.x) {
                stepLength = Math.abs(step.from.y - step.chess.y) - 1;
            }
            else {
                stepLength = step.chess.x;
            }

            var text = chessText + numbers[step.from.x] + directions[direction * step.chess.color + 1] + numbers[stepLength];
            console.log(text);
        }
    };

    return logger;
}]);