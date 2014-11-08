angular.module("ng-chinese-chess").controller("ChessCtrl", ["$scope", "offsetX", "offsetY", "gridSize", "Game", "Room", "ConsoleLogger",
    function ($scope, offsetX, offsetY, gridSize, Game, Room, ConsoleLogger) {
        var room = new Room();

        $scope.games = [];

        $scope.createGame = function () {
            var game = new Game();
            game.init();

            game.addLogger(ConsoleLogger);
            $scope.games.push(game);

            room.save(game.serialize(), {
                success: function (object) {
                    alert("LeanCloud works!");
                }
            });
        };

        $scope.chessX = function (chess) {
            return offsetX + chess.x * gridSize;
        };

        $scope.chessY = function (chess) {
            return offsetY + chess.y * gridSize;
        };

        $scope.canGoX = function (chess) {
            return offsetX + (chess.x - 0.5) * gridSize;
        };

        $scope.canGoY = function (chess) {
            return offsetY + (chess.y - 0.5) * gridSize;
        };

        $scope.canAttackX = function (chess) {
            return offsetX + (chess.x - 0.5) * gridSize;
        };

        $scope.canAttackY = function (chess) {
            return offsetY + (chess.y - 0.5) * gridSize;
        };

        $scope.select = function (game, chess) {
            game.select(chess);
        };

        $scope.move = function (game, position) {
            game.moveTo(position);

            room.addStep({
                chess: "a",
                toX: position.x,
                toY: position.y
            });
        };

        $scope.attack = function (game, position) {
            game.attack(position);
        };

        var colors = {
            "1": "red",
            "0": "",
            "-1": "black"
        };

        var types = ["blank", "soldier", "cannon", "chariot", "horse", "staff", "guard", "general"];

        $scope.symbol = function (chess) {
            return "#" + colors[chess.color] + "-" + types[chess.type];
        };
    }]);