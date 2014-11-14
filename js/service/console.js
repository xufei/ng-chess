angular.module("ng-chinese-chess").service("ConsoleLogger", ["ChessText", function (Text) {
    var logger = {

        log: function (chess, step) {
            var numbers = ["一", "二", "三", "四", "五", "六", "七", "八", "九"];
            var directions = ["进", "平", "退"];

            var chessText = Text[chess.type + (chess.color + 1) * 7 / 2];

            var direction;
            if (step.fromY > chess.y) {
                direction = -1;
            }
            else if (step.fromY == chess.y) {
                direction = 0;
            }
            else if (step.fromY < chess.y) {
                direction = 1;
            }

            var stepLength;
            if (step.fromX == chess.x) {
                stepLength = Math.abs(step.fromY - chess.y) - 1;
            }
            else {
                stepLength = chess.x;
            }

            var text = chessText + numbers[step.fromX] + directions[direction * chess.color + 1] + numbers[stepLength];
            console.log(text);
        }
    };

    return logger;
}]);