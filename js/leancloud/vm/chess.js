angular.module("ng-chinese-chess").controller("ChessCtrl",
    ["$scope", "offsetX", "offsetY", "gridSize", "ChessColor", "Game", "RoomService", "UserService", "ConsoleLogger",
    function ($scope, offsetX, offsetY, gridSize, Color, Game, RoomService, UserService, ConsoleLogger) {
        var room = RoomService.createRoom();

        var rooms = RoomService.rooms();
        $scope.rooms = [];

        rooms.fetch({
            success: function(collection) {
                collection.each(function(object) {
                    $scope.rooms.push(object);
                });

                $scope.$digest();
            },
            error: function(collection, error) {
                // The collection could not be retrieved.
            }});

        $scope.createGame = function () {
            var game = new Game();
            var me = UserService.currentUser();
            game.redPlayer = new Player(me, Color.RED);
            game.init();

            game.addLogger(ConsoleLogger);

            room.save(game.serialize(), {
                success: function (object) {
                    alert("Created！");
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

            RoomService.addStep(room, {
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