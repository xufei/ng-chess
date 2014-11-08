angular.module("ng-chinese-chess").factory("ChessMan", [function () {
    function ChessMan(color, type) {
        this.game = null;

        this.color = color;
        this.type = type;
        this.x = -1;
        this.y = -1;

        this.beAttack = false;
    }

    return ChessMan;
}]);