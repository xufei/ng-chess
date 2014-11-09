angular.module("ng-chinese-chess").factory("Player", [function () {
    function Player(color, type) {
        this.game = null;

        this.color = color;
    }

    Player.prototype = {
        perform: function() {

        }
    };

    return Player;
}]);