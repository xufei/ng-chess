angular.module("ng-chinese-chess").factory("Watcher", [function () {
    function Watcher() {
        this.game = null;
    }

    Watcher.prototype = {
        notify: function() {

        }
    };

    return Watcher;
}]);