angular.module("ng-chinese-chess").controller("ChessCtrl",
    ["$scope", "offsetX", "offsetY", "gridSize", "ChessColor", "Game", "Player", "RoomService", "UserService", "ConsoleLogger",
    function ($scope, offsetX, offsetY, gridSize, Color, Game, Player, RoomService, UserService, ConsoleLogger) {
        var room = RoomService.createRoom();

        var rooms = RoomService.rooms();
        $scope.rooms = [];

        var user = {};
        $scope.user = user;
        $scope.currentUser = null;

        $scope.signUp = function () {
            UserService.signUp(user.username, user.password)
                .then(function(result) {
                    $scope.currentUser = result;
                    alert("A new user is created.");
                });
        };

        $scope.signIn = function() {
            UserService.signIn(user.username, user.password)
                .then(function(result) {
                    $scope.currentUser = result;
                    alert("Logged in.");
                });
        };

        $scope.createGame = function () {
            var game = new Game();
            game.redPlayer = new Player($scope.currentUser, Color.RED);
            game.init();

            game.addLogger(ConsoleLogger);

            room.save(game.serialize(), {
                success: function (object) {
                    alert("New Room created!");
                }
            });
        };

        $scope.canJoin = function(room) {
            var username = $scope.currentUser.get("username");
            if ((room.redPlayer != username) && room.blackPlayer != username) {
                return true;
            }
            else {
                return false;
            }
        };

        $scope.canWatch = function(room) {
            var username = $scope.currentUser.get("username");
            if ((room.redPlayer != username) && room.blackPlayer != username) {
                return true;
            }
            else {
                return false;
            }
        };

        $scope.join = function(room) {

        };

        $scope.watch = function(room) {

        };

        $scope.loadRooms = function() {
            rooms.fetch({
                success: function(collection) {
                    collection.each(function(object) {
                        $scope.rooms.push(object.attributes);
                    });

                    $scope.$digest();
                },
                error: function(collection, error) {
                    // 怎么会读不到
                }});
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