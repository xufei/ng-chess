angular.module("ng-chinese-chess").factory("Guard", ["ChessMan", "ChessType", "ChessColor", function (ChessMan, ChessType, ChessColor) {
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
}]);