angular.module("ng-chinese-chess").controller("ChessCtrl",
    ["$scope", "offsetX", "offsetY", "gridSize", "ChessColor", "Game", "Player", "Watcher", "RoomService", "UserService", "ConsoleLogger", "$timeout",
    function ($scope, offsetX, offsetY, gridSize, Color, Game, Player, Watcher, RoomService, UserService, ConsoleLogger, $timeout) {
        var room = RoomService.createRoom();

        var rooms = RoomService.rooms();

        $scope.rooms = [];
        $scope.games = [];

        $scope.currentGame = null;

        $scope.switchGame = function(game) {
            $scope.currentGame = game;
        };

        $scope.gameClass = function(game) {
            if (game == this.currentGame) {
                return "pure-menu-selected";
            }
            else {
                return "";
            }
        };

        var user = {};
        $scope.user = user;
        $scope.currentUser = null;

        $scope.signUp = function () {
            UserService.signUp(user.username, user.password)
                .then(function(result) {
                    $scope.currentUser = result;
                    $scope.loadRooms();

                    alert("A new user is created.");
                });
        };

        $scope.signIn = function() {
            UserService.signIn(user.username, user.password)
                .then(function(result) {
                    $scope.currentUser = result;
                    $scope.loadRooms();

                    alert("Logged in.");
                });
        };

        $scope.createGame = function () {
            var game = new Game();
            var player = new Player($scope.currentUser, Color.RED);
            player.game = game;
            game.redPlayer = player;
            game.init();

            game.addLogger(ConsoleLogger);

            $scope.games.push(game);

            room.save(game.serialize(), {
                success: function (room) {
                    alert("New Room created!");

                    var steps = $scope.loadSteps(room);
                    $scope.loadSteps(steps);
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
            var game = new Game();
            var player = new Player($scope.currentUser, Color.BLACK);
            player.game = game;
            game.blackPlayer = player;

            $scope.games.push(game);
        };

        $scope.watch = function(room) {
            var game = new Game();
            var watcher = new Watcher();

            game.addWatcher(watcher);

            $scope.games.push(game);
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

        $scope.loadSteps = function(steps) {
            steps.fetch({
                success: function(collection) {
                    collection.each(function(object) {
                        $scope.rooms.push(object.attributes);
                    });

                    $scope.$digest();
                },
                error: function(collection, error) {
                    // 不可能吧
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