angular.module("ng-chinese-chess").factory("Game", ["ChessFactory", "ChessType", "ChessColor", "GameState", "PlayerType",
    function (Factory, Type, Color, GameState, PlayerType) {
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
        this.initialSituation = chesses;

        this.state = GameState.UNINITIALIZED;
        
        this.history = [];

        this.situation = [];

        this.redPlayer = null;
        this.blackPlayer = null;
        this.currentPlayer = null;

        this.watchers = [];

        this.currentChess = null;
        this.undoList = [];
        this.redoList = [];
        this.chessUnderAttack = [];

        this.generals = [];

        this.chesses = [];
        this.moveablePlaces = [];

        this.loggers = [];
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

            this.currentPlayer = this.redPlayer;
        },

        destroy: function () {
            this.situation = null;
            this.currentChess = null;
            this.undoList = null;
            this.redoList = null;
            this.chessUnderAttack = null;
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

        checkFinish: function () {
            if (this.state == GameState.FINISHED) {
                this.prompt("棋局已终止！");
                return true;
            }
            return false;
        },

        attack: function (position) {
            if (this.checkFinish()) {
                return;
            }

            var chess = this.situation[position.x][position.y];

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
                        var step = this.moveChess(this.currentChess, chess.x, chess.y, false);
                        return step;
                    }
                    else {
                        this.prompt("吃不到这个棋子！");
                        return;
                    }
                }
            }
        },

        select: function (chess) {
            if (this.checkFinish()) {
                return;
            }

            if (this.currentPlayer.type != PlayerType.LOCAL) {
                this.prompt("等待远程棋手落子！");
                return;
            }

            if (chess.color != this.currentPlayer.color) {
                this.prompt("不该你走！");
                return;
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

        moveTo: function (position) {
            var step = this.moveChess(this.currentChess, position.x, position.y);
            this.moveablePlaces = [];
            this.chessUnderAttack = [];

            return step;
        },

        moveChess: function (chess, newX, newY) {
            var step = {
                fromX: chess.x,
                fromY: chess.y,
                toX: newX,
                toY: newY
            };

            this.executeStep(step);

            return step;
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

        addLogger: function (logger) {
            this.loggers.push(logger);
        },

        log: function (step) {
            var chess = this.situation[step.toX][step.toY];
            angular.forEach(this.loggers, function (logger) {
                logger.log(chess, step);
            });
        },

        addWatcher: function(watcher) {
            this.watchers.push(watcher);
        },

        notify: function(step) {
            angular.forEach(this.watchers, function (watcher) {
                watcher.notify(step);
            });
        },
        
        processHistory: function(history) {
            var newSteps = history.slice(this.history.length, history.length);
            var game = this;
            newSteps.forEach(function(step) {
                game.executeStep(step);
            });
        },

        executeStep: function (step, isUndo) {
            var chess = this.situation[step.fromX][step.fromY];
            var killedChess = this.situation[step.toX][step.toY];
            delete this.situation[step.fromX][step.fromY];
            this.situation[step.toX][step.toY] = chess;
            chess.x = step.toX;
            chess.y = step.toY;

            if (killedChess) {
                for (var i = 0; i < this.chesses.length; i++) {
                    if (killedChess == this.chesses[i]) {
                        this.chesses.splice(i, 1);
                        break;
                    }
                }

                if (killedChess.type == Type.GENERAL) {
                    var winner = (killedChess.color == Color.RED) ? "黑" : "红";
                    this.prompt("结束啦，" + winner + "方胜利！");
                    this.state = GameState.FINISHED;
                }
            }

            if (isUndo) {
                if (step.deadColor) {
                    var deadChess = ChessFactory.createChess([step.deadColor, step.deadType, step.fromX, step.fromY]);
                    this.situation[step.fromX][step.fromY] = deadChess;

                    this.chesses.push(deadChess);
                }

                this.redoList.push(step);
            }
            else {
                if (killedChess) {
                    step.deadType = killedChess.type;
                    step.deadColor = killedChess.color;
                }
                this.undoList.push(step);
            }

            this.currentPlayer = (this.currentPlayer == this.redPlayer) ? this.blackPlayer : this.redPlayer;

            this.currentChess = null;
            this.moveablePlaces = [];
            this.chessUnderAttack = [];
            
            this.history.push(step);

            this.check();

            this.log(step);

            this.notify(step);
        },

        undo: function () {
            if (this.undoList.length > 0) {
                var step = this.undoList.pop();
                this.executeStep(step, true);
            }
        },

        redo: function () {
            if (this.redoList.length > 0) {
                var step = this.redoList.pop();
                this.executeStep(step);
            }
        },

        serialize: function () {
            var json = {
                initialSituation: this.initialSituation,
                state: this.state
            };

            if (this.redPlayer) {
                json.redPlayer = this.redPlayer.user;
            }

            if (this.blackPlayer) {
                json.blackPlayer = this.blackPlayer.user;
            }

            return json;
        }
    };

    return Game;
}]);