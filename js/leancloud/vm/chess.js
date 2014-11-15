angular.module("ng-chinese-chess").controller("ChessCtrl",
    ["$scope", "offsetX", "offsetY", "gridSize", "ChessColor", "GameState", "PlayerType", "Game", "Player", "Watcher", "RoomService", "UserService", "ConsoleLogger", "$timeout",
        function ($scope, offsetX, offsetY, gridSize, Color, GameState, PlayerType, Game, Player, Watcher, RoomService, UserService, ConsoleLogger, $timeout) {
            $scope.rooms = RoomService.rooms();
            $scope.games = [];

            var roomMap = {};

            $scope.currentGame = null;

            $scope.switchGame = function (game) {
                $scope.currentGame = game;
            };

            $scope.gameClass = function (game) {
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
                    .then(function (result) {
                        $scope.currentUser = result;
                        $scope.loadRooms();

                        alert("A new user is created.");
                    });
            };

            $scope.signIn = function () {
                UserService.signIn(user.username, user.password)
                    .then(function (result) {
                        $scope.currentUser = result;
                        $scope.loadRooms();

                        alert("Logged in.");
                    });
            };

            $scope.createGame = function () {
                var game = new Game();
                var player = new Player($scope.currentUser.get("username"), Color.RED, PlayerType.LOCAL);
                player.game = game;
                game.redPlayer = player;
                game.init();

                game.addLogger(ConsoleLogger);

                $scope.games.push(game);

                var room = RoomService.createRoom();
                room.save(game.serialize(), {
                    success: function (room) {
                        alert("New Room created!");

                        var steps = RoomService.loadSteps(room);
                        $scope.loadSteps(game, steps);
                    }
                });

                roomMap[game] = room;
            };

            $scope.canJoin = function (room) {
                var username = $scope.currentUser.get("username");
                if ((room.get("redPlayer") != username) && room.get("blackPlayer") != username) {
                    return true;
                }
                else {
                    return false;
                }
            };

            $scope.canWatch = function (room) {
                var username = $scope.currentUser.get("username");
                if ((room.get("redPlayer") != username) && room.get("blackPlayer") != username) {
                    return true;
                }
                else {
                    return false;
                }
            };

            $scope.join = function (room) {
                var game = new Game();

                var redPlayer = new Player(room.get("redPlayer"), Color.RED, PlayerType.REMOTE);
                redPlayer.game = game;
                game.redPlayer = redPlayer;

                var blackPlayer = new Player($scope.currentUser.get("username", Color.BLACK), PlayerType.LOCAL);
                blackPlayer.game = game;
                game.blackPlayer = blackPlayer;

                game.init();

                $scope.games.push(game);
                room.set("blackPlayer", blackPlayer.user);
                room.set("state", GameState.READY);

                room.save(null, {
                    success: function (room) {
                        alert("Start!");

                        var steps = RoomService.getSteps(room);
                        $scope.loadSteps(game, steps);
                    }
                });

                roomMap[game] = room;
            };

            $scope.watch = function (room) {
                var game = new Game();
                var watcher = new Watcher();
                game.init();

                game.addWatcher(watcher);

                $scope.games.push(game);
            };

            $scope.loadRooms = function () {
                $scope.rooms.fetch({
                    success: function (collection) {
                        $scope.watchRoomChange();

                        $scope.$digest();

                        $timeout(function () {
                            $scope.loadRooms();
                        }, 5000);
                    },
                    error: function (collection, error) {
                        // 怎么会读不到
                    }
                });
            };

            $scope.watchRoomChange = function () {
                $scope.rooms.each(function (room) {
                    if (room.get("state") == GameState.READY) {
                        var game = new Game();
                        var redPlayer = new Player(room.get("redPlayer"), Color.RED, PlayerType.LOCAL);
                        redPlayer.game = game;
                        game.redPlayer = redPlayer;

                        var blackPlayer = new Player(room.get("blackPlayer"), Color.BLACK, PlayerType.LOCAL);
                        blackPlayer.game = game;
                        game.blackPlayer = blackPlayer;
                        game.init();

                        game.addLogger(ConsoleLogger);

                        room.set("state", GameState.ACTING);

                        room.save(null, {
                            success: function (room) {
                                $scope.games.push(game);

                                var steps = RoomService.getSteps(room);
                                $scope.loadSteps(game, steps);
                            }
                        });
                    }
                });
            };

            $scope.loadSteps = function (game, steps) {
                steps.fetch({
                    success: function (collection) {
                        var history = [];
                        collection.each(function (object) {
                            history.push(object.attributes);
                        });

                        game.processHistory(history);

                        $scope.$digest();

                        $timeout(function() {
                            $scope.loadSteps(game, steps);
                        }, 5000);
                    },
                    error: function (collection, error) {
                        // 不可能吧
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
                var step = game.moveTo(position);

                var room = roomMap[game];

                RoomService.addStep(room, step);
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