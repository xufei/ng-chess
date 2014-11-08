angular.module("ng-chinese-chess").factory("Soldier", ["ChessMan", "ChessType", "ChessColor", function (ChessMan, ChessType, ChessColor) {
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
}]);