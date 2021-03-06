angular.module("ng-chinese-chess").factory("General", ["ChessMan", "ChessType", "ChessColor", function (ChessMan, ChessType, ChessColor) {
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
}]);