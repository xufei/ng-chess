angular.module("ng-chinese-chess").factory("Staff", ["ChessMan", "ChessType", "ChessColor", function (ChessMan, ChessType, ChessColor) {
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
}]);