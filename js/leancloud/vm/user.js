angular.module("ng-chinese-chess").controller("UserCtrl", ["$scope", "UserService", function ($scope, UserService) {
    $scope.signUp = function () {
        UserService.signUp();
    };
}]);