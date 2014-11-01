angular.module("ng-chinese-chess", [])
    .constant("offsetX", 40)
    .constant("offsetY", 40)
    .constant("gridSize", 60)
    .value("ChessType", {
        GENERAL: 7,
        GUARD: 6,
        STAFF: 5,
        HORSE: 4,
        CHARIOT: 3,
        CANNON: 2,
        SOLDIER: 1,
        BLANK: 0
    })
    .value("ChessColor", {
        RED: 1,
        BLACK: -1,
        GREY: 0
    })
    .controller("ChessCtrl", ["$scope", "offsetX", "offsetY", "gridSize", "Game",
        function ($scope, offsetX, offsetY, gridSize, Game) {
            $scope.games = [];

            $scope.createGame = function() {
                var game = new Game();
                game.init();
                $scope.games.push(game);
            };

            $scope.chessX = function (chess) {
                return offsetX + chess.x * gridSize;
            };

            $scope.chessY = function (chess) {
                return offsetY + chess.y * gridSize;
            };

            $scope.placeX = function (chess) {
                return offsetX + (chess.x-0.5) * gridSize;
            };

            $scope.placeY = function (chess) {
                return offsetY + (chess.y-0.5) * gridSize;
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

            $scope.chessClick = function (game, chess) {
                game.select(chess);
            };
        }])
    .factory("ChessMan", [function () {
        function ChessMan(color, type) {
            this.game = null;

            this.color = color;
            this.type = type;
            this.x = -1;
            this.y = -1;

            this.beAttack = false;
        }

        return ChessMan;
    }])
    .factory("General", ["ChessMan", "ChessType", "ChessColor", function (ChessMan, ChessType, ChessColor) {
        function General(color) {
            ChessMan.call(this, color, ChessType.GENERAL);
        }

        General.prototype = {
            valid: function (x, y) {
                var result = true;
                switch (this.color) {
                    case ChessColor.BLACK:
                        if ((x < 3) || (x > 5) || ((y > 2) && (y < 7))) {
                            result = false;
                        }
                        break;
                    case ChessColor.RED:
                        if ((x < 3) || (x > 5) || ((y > 2) && (y < 7))) {
                            result = false;
                        }
                        break;
                    default:
                        result = true;
                }
                return result;
            },

            canGo: function (x, y) {
                if (this.valid(x, y) && !this.game.isFriendly(this.color, x, y)) {
                    if (Math.abs(this.y - y) + Math.abs(this.x - x) == 1) {
                        return true;
                    }
                    else if (this.x == x) {
                        if (this.game.getChess(x, y) && (this.game.getChess(x, y).type == ChessType.GENERAL)) {
                            var num = 0;
                            var minY = y > this.y ? this.y : y;
                            var maxY = y + this.y - minY;

                            for (var i = minY + 1; i < maxY; i++) {
                                if (this.game.getChess(x, i)) {
                                    num++;
                                }
                            }

                            if (num == 0) {
                                return true;
                            }
                        }
                    }
                }
                return false;
            }
        };

        return General;
    }])

    .factory("Guard", ["ChessMan", "ChessType", "ChessColor", function (ChessMan, ChessType, ChessColor) {
        function Guard(color) {
            ChessMan.call(this, color, ChessType.GUARD);
        }

        Guard.prototype = {
            valid: function (x, y) {
                switch (this.color) {
                    case ChessColor.BLACK:
                        if (((x == 3) && (y == 0))
                            || ((x == 3) && (y == 2))
                            || ((x == 5) && (y == 0))
                            || ((x == 5) && (y == 2))
                            || ((x == 4) && (y == 1))) {
                            return true;
                        }
                        break;
                    case ChessColor.RED:
                        if (((x == 3) && (y == 7))
                            || ((x == 3) && (y == 9))
                            || ((x == 5) && (y == 7))
                            || ((x == 5) && (y == 9))
                            || ((x == 4) && (y == 8))) {
                            return true;
                        }
                        break;
                    default:
                        return false;
                }
            },

            canGo: function (x, y) {
                if (this.valid(x, y) && !this.game.isFriendly(this.color, x, y)) {
                    if ((Math.abs(this.x - x) > 1)
                        || (Math.abs(this.y - y) > 1)
                        || ((Math.abs(this.x - x) == 0)
                        && (Math.abs(this.y - y) == 0))) {
                        return false;
                    }
                    else {
                        return true;
                    }
                }
                return false;
            }
        };

        return Guard;
    }])

    .factory("Staff", ["ChessMan", "ChessType", "ChessColor", function (ChessMan, ChessType, ChessColor) {
        function Staff(color) {
            ChessMan.call(this, color, ChessType.STAFF);
        }

        Staff.prototype = {
            valid: function (x, y) {
                switch (this.color) {
                    case ChessColor.BLACK:
                        if (((x == 0) && (y == 2))
                            || ((x == 2) && (y == 0))
                            || ((x == 2) && (y == 4))
                            || ((x == 4) && (y == 2))
                            || ((x == 6) && (y == 0))
                            || ((x == 6) && (y == 4))
                            || ((x == 8) && (y == 2))) {
                            return true;
                        }
                        break;
                    case ChessColor.RED:
                        if (((x == 0) && (y == 7))
                            || ((x == 2) && (y == 5))
                            || ((x == 2) && (y == 9))
                            || ((x == 4) && (y == 7))
                            || ((x == 6) && (y == 5))
                            || ((x == 6) && (y == 9))
                            || ((x == 8) && (y == 7))) {
                            return true;
                        }
                        break;
                    default:
                        return false;
                }
            },

            canGo: function (x, y) {
                if (this.valid(x, y) && !this.game.isFriendly(this.color, x, y)) {
                    if ((Math.abs(this.x - x) != 2)
                        || (Math.abs(this.y - y) != 2)) {
                        return false;
                    }
                    else {
                        var i = (this.x + x) / 2;
                        var j = (this.y + y) / 2;
                        if (this.game.isEmpty(i, j)) {
                            return true;
                        }
                        else {
                            return false;
                        }
                    }
                }
                return false;
            }
        };

        return Staff;
    }])
    .factory("Horse", ["ChessMan", "ChessType", function (ChessMan, ChessType) {
        function Horse(color) {
            ChessMan.call(this, color, ChessType.HORSE);
        }

        Horse.prototype = {
            valid: function (x, y) {
                return true;
            },

            canGo: function (x, y) {
                if (this.valid(x, y) && !this.game.isFriendly(this.color, x, y)) {
                    if (((Math.abs(this.x - x) == 1)
                        && (Math.abs(this.y - y) == 2))
                        || ((Math.abs(this.x - x) == 2)
                        && (Math.abs(this.y - y) == 1))) {
                        var i = -1;
                        var j = -1;
                        if (x - this.x == 2) {
                            i = this.x + 1;
                            j = this.y;
                        }
                        else if (this.x - x == 2) {
                            i = this.x - 1;
                            j = this.y;
                        }
                        else if (y - this.y == 2) {
                            i = this.x;
                            j = this.y + 1;
                        }
                        else if (this.y - y == 2) {
                            i = this.x;
                            j = this.y - 1;
                        }

                        if (this.game.isEmpty(i, j)) {
                            return true;
                        }
                    }
                }
                return false;
            }
        };

        return Horse;
    }])

    .factory("Chariot", ["ChessMan", "ChessType", function (ChessMan, ChessType) {
        function Chariot(color) {
            ChessMan.call(this, color, ChessType.CHARIOT);
        }

        Chariot.prototype = {
            valid: function (x, y) {
                return true;
            },

            canGo: function (x, y) {
                if (this.valid(x, y) && !this.game.isFriendly(this.color, x, y)) {
                    if ((this.x != x) && (this.y != y)) {
                        return false;
                    }
                    else {
                        if (this.y == y) {
                            if (this.x < x) {
                                for (var i = this.i + 1; i < x; i++) {
                                    if (!this.game.isEmpty(i, this.y)) {
                                        return false;
                                    }
                                }
                                return true;
                            }

                            if (this.x > x) {
                                for (var i = this.x - 1; i > x; i--) {
                                    if (!this.game.isEmpty(i, this.y)) {
                                        return false;
                                    }
                                }
                                return true;
                            }
                        }
                        else {
                            if (this.y < y) {
                                for (var i = this.y + 1; i < y; i++) {
                                    if (!this.game.isEmpty(this.x, i)) {
                                        return false;
                                    }
                                }
                                return true;
                            }

                            if (this.y > y) {
                                for (var i = this.y - 1; i > y; i--) {
                                    if (!this.game.isEmpty(this.x, i)) {
                                        return false;
                                    }
                                }
                                return true;
                            }
                        }
                    }
                }
                return false;
            }
        };

        return Chariot;
    }])

    .factory("Cannon", ["ChessMan", "ChessType", function (ChessMan, ChessType) {
        function Cannon(color) {
            ChessMan.call(this, color, ChessType.CANNON);
        }

        Cannon.prototype = {
            valid: function (x, y) {
                return true;
            },

            canGo: function (x, y) {
                if (this.valid(x, y) && !this.game.isFriendly(this.color, x, y)) {
                    if ((this.x != x) && (this.y != y)) {
                        return false;
                    }
                    else {
                        if (this.game.isEmpty(x, y)) {
                            if (this.y == y) {
                                if (this.x < x) {
                                    for (var i = this.x + 1; i < x; i++) {
                                        if (!this.game.isEmpty(i, this.y)) {
                                            return false;
                                        }
                                    }
                                    return true;
                                }

                                if (this.x > x) {
                                    for (var i = this.x - 1; i > x; i--) {
                                        if (!this.game.isEmpty(i, this.y)) {
                                            return false;
                                        }
                                    }
                                    return true;
                                }
                            }
                            else {
                                if (this.y < y) {
                                    for (var i = this.y + 1; i < y; i++) {
                                        if (!this.game.isEmpty(this.x, i)) {
                                            return false;
                                        }
                                    }
                                    return true;
                                }

                                if (this.y > y) {
                                    for (var i = this.y - 1; i > y; i--) {
                                        if (!this.game.isEmpty(this.x, i)) {
                                            return false;
                                        }
                                    }
                                    return true;
                                }
                            }
                        }
                        else {
                            var count = 0;

                            if (this.y == y) {
                                if (this.x < x) {
                                    for (var i = this.x + 1; i < x; i++) {
                                        if (!this.game.isEmpty(i, this.y)) {
                                            count++;
                                        }
                                    }
                                    if (count == 1) {
                                        return true;
                                    }
                                }

                                if (this.x > x) {
                                    for (var i = this.x - 1; i > x; i--) {
                                        if (!this.game.isEmpty(i, this.y)) {
                                            count++;
                                        }
                                    }
                                    if (count == 1) {
                                        return true;
                                    }
                                }
                            }
                            else {
                                if (this.y < y) {
                                    for (var i = this.y + 1; i < y; i++) {
                                        if (!this.game.isEmpty(this.x, i)) {
                                            count++;
                                        }
                                    }
                                    if (count == 1) {
                                        return true;
                                    }
                                }

                                if (this.y > y) {
                                    for (var i = this.y - 1; i > y; i--) {
                                        if (!this.game.isEmpty(this.x, i)) {
                                            count++;
                                        }
                                    }
                                    if (count == 1) {
                                        return true;
                                    }
                                }
                            }
                        }
                    }
                }
                return false;
            }
        };

        return Cannon;
    }])
    .factory("Soldier", ["ChessMan", "ChessType", "ChessColor", function (ChessMan, ChessType, ChessColor) {
        function Soldier(color) {
            ChessMan.call(this, color, ChessType.SOLDIER);
        }

        Soldier.prototype = {
            valid: function (x, y) {
                var result = true;
                switch (this.color) {
                    case ChessColor.BLACK:
                        if ((y < 3)
                            || ((y < 5) && (x % 2 == 1))) {
                            result = false;
                        }
                        break;
                    case ChessColor.RED:
                        if ((y > 6)
                            || ((y > 4) && (x % 2 == 1))) {
                            result = false;
                        }
                        break;
                    default:
                        result = true;
                }
                return result;
            },

            canGo: function (x, y) {
                var result = false;
                if (this.valid(x, y) && !this.game.isFriendly(this.color, x, y)) {
                    result = true;
                    switch (this.color) {
                        case ChessColor.BLACK:
                            if (y < this.y) {
                                result = false;
                            }
                            else {
                                if (Math.abs(x - this.x) + y - this.y != 1) {
                                    result = false;
                                }
                            }
                            break;
                        case ChessColor.RED:
                            if (y > this.y) {
                                result = false;
                            }
                            else {
                                if (Math.abs(x - this.x) + this.y - y != 1) {
                                    result = false;
                                }
                            }
                            break;
                        default:
                            result = true;
                    }
                }
                return result;
            }
        };

        return Soldier;
    }])
    .factory("ChessFactory", ["ChessType", "ChessColor", "General", "Guard", "Staff", "Horse", "Chariot", "Cannon", "Soldier", function (ChessType, ChessColor, General) {
        var ChessConstructors = [].slice.call(arguments).slice(2);

        var ChessFactory = {
            createChess: function (data) {
                var chess;

                var type = data[1];

                chess = new (ChessConstructors[7 - type])(data[0], data[1]);
                chess.x = data[2];
                chess.y = data[3];
                return chess;
            }
        };

        return ChessFactory;
    }])
    .factory("Game", ["ChessFactory", "ChessType", "ChessColor", function(Factory, Type, Color) {
        //color, type, x, y
        var chesses = [
            [1, 7, 4, 9],
            [1, 6, 3, 9],
            [1, 6, 5, 9],
            [1, 5, 2, 9],
            [1, 5, 6, 9],
            [1, 4, 1, 9],
            [1, 4, 7, 9],
            [1, 3, 0, 9],
            [1, 3, 8, 9],
            [1, 2, 1, 7],
            [1, 2, 7, 7],
            [1, 1, 0, 6],
            [1, 1, 2, 6],
            [1, 1, 4, 6],
            [1, 1, 6, 6],
            [1, 1, 8, 6],

            [-1, 7, 4, 0],
            [-1, 6, 3, 0],
            [-1, 6, 5, 0],
            [-1, 5, 2, 0],
            [-1, 5, 6, 0],
            [-1, 4, 1, 0],
            [-1, 4, 7, 0],
            [-1, 3, 0, 0],
            [-1, 3, 8, 0],
            [-1, 2, 1, 2],
            [-1, 2, 7, 2],
            [-1, 1, 0, 3],
            [-1, 1, 2, 3],
            [-1, 1, 4, 3],
            [-1, 1, 6, 3],
            [-1, 1, 8, 3]
        ];

        function Game() {
            this.situation = [];
            this.currentColor = Color.RED;
            this.currentChess = null;
            this.undoList = [];
            this.redoList = [];
            this.chessUnderAttack = [];

            this.generals = [];

            this.chesses = [];
            this.moveablePlaces = [];
        }

        Game.prototype = {
            init: function () {
                for (var i = 0; i < 9; i++) {
                    this.situation[i] = [];
                }

                for (var i = 0; i < chesses.length; i++) {
                    var chess = this.createChess(chesses[i]);

                    this.chesses.push(chess);
                }
            },

            destroy: function () {
                this.situation = null;
                this.currentChess = null;
                this.undoList = null;
                this.redoList = null;
                this.chessUnderAttack = null;
                this.chessBoard = null;
            },

            createChess: function (data) {
                var chess = Factory.createChess(data);
                chess.game = this;
                this.situation[chess.x][chess.y] = chess;

                if (chess.type == Type.GENERAL) {
                    this.generals.push(chess);
                }

                return chess;
            },

            isFriendly: function (color, x, y) {
                if (this.isEmpty(x, y))
                    return false;

                return color + this.getChess(x, y).color != 0;
            },

            isEmpty: function (x, y) {
                return !this.situation[x][y];
            },

            getChess: function (x, y) {
                return this.situation[x][y];
            },

            select: function (chess) {
                if (this.currentColor == Color.GREY) {
                    this.prompt("棋局已终止！");
                    return;
                }

                if (this.currentChess) {
                    if (this.currentChess.color + chess.color == 0) {
                        var canKill = false;
                        for (var i = 0; i < this.chessUnderAttack.length; i++) {
                            if ((this.chessUnderAttack[i].x == chess.x) && (this.chessUnderAttack[i].y == chess.y)) {
                                canKill = true;
                                break;
                            }
                        }

                        if (canKill) {
                            this.moveChess(this.currentChess, chess.x, chess.y, false);

                            if (chess.type == Type.GENERAL) {
                                var winner = (chess.color == Color.RED) ? "黑" : "红";
                                this.prompt("结束啦，" + winner + "方胜利！");
                                this.currentColor = Color.GREY;
                            }
                            return;
                        }
                        else {
                            this.prompt("吃不到这个棋子！");
                            return;
                        }
                    }
                }
                else {
                    if (chess.color != this.currentColor) {
                        this.prompt("不该你走！");
                        return;
                    }
                }

                this.currentChess = chess;
                this.moveablePlaces = [];
                this.chessUnderAttack = [];
                for (var i = 0; i < 9; i++) {
                    for (var j = 0; j < 10; j++) {
                        if (chess.canGo(i, j)) {
                            if (this.isEmpty(i, j)) {
                                this.moveablePlaces.push({
                                    x: i,
                                    y: j
                                });
                            }
                            else {
                                this.chessUnderAttack.push({
                                    x: i,
                                    y: j
                                });
                            }
                        }
                    }
                }
            },

            moveChess: function (chess, newX, newY, isUndo) {
                var step = {
                    chess: chess,
                    from: {
                        x: chess.x,
                        y: chess.y
                    },
                    dead: this.situation[newX][newY]
                };

                if (isUndo) {
                    this.redoList.push(step);
                }
                else {
                    this.undoList.push(step);
                }

                this.situation[chess.x][chess.y] = null;
                chess.x = newX;
                chess.y = newY;
                this.situation[newX][newY] = chess;

                this.currentColor = Color.RED + Color.BLACK - this.currentColor;
                this.currentChess = null;

                this.log(step);
                this.check();
            },

            check: function () {
                for (var i = 0; i < this.generals.length; i++) {
                    for (var j = 0; j < this.situation.length; j++) {
                        for (var k = 0; k < this.situation[j].length; k++) {
                            if (this.situation[j][k] && this.situation[j][k].canGo(this.generals[i].x, this.generals[i].y)) {
                                this.prompt("将军！");
                                return;
                            }
                        }
                    }
                }
            },

            prompt: function (text) {
                alert(text);
            },

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
            },

            undo: function () {
                if (this.undoList.length > 0) {
                    var step = this.undoList.pop();
                    this.chessBoard.moveChess(step.chess.x, step.chess.y, step.from.x, step.from.y);
                    this.moveChess(step.chess, step.from.x, step.from.y, true);

                    if (step.dead) {
                        this.situation[step.chess.x][step.chess.y] = step.dead;
                        this.chessBoard.drawChess(step.dead);
                    }
                }
            },

            redo: function () {
                if (this.redoList.length > 0) {
                    var step = this.redoList.pop();
                    this.chessBoard.moveChess(step.chess.x, step.chess.y, step.from.x, step.from.y);
                    this.moveChess(step.chess, step.from.x, step.from.y);
                }
            }
        };

        return Game;
    }]);