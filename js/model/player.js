angular.module("ng-chinese-chess").factory("Player", [function () {
    function Player(user, color) {
        this.game = null;
        this.user = user;
        this.color = color;
    }

    Player.prototype = {
        perform: function() {

        }
    };

    return Player;
}]);