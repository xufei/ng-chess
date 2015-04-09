angular.module("ng-chinese-chess").factory("Chariot", ["ChessMan", "ChessType", function (ChessMan, ChessType) {
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
            }
            return false;
        }
    };

    return Chariot;
}]);
