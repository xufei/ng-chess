angular.module("ng-chinese-chess").factory("Player", [function () {
    function Player(user, color) {
        this.game = null;
        this.user = user;
        this.color = color;
    }

    Player.prototype = {
        select: function(chess) {
            this.game.select(chess);
        },

        move: function(position) {
            this.game.moveTo(position);
        },

        attack: function(position) {
            this.game.attack(position);
        }
    };

    return Player;
}]);