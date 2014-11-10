angular.module("ng-chinese-chess").controller("UserCtrl", ["$scope", "UserService", function ($scope, UserService) {
    $scope.signUp = function () {
        UserService.signUp($scope.username, $scope.password, $scope.email);
    };

    $scope.signIn = function() {
        UserService.signIn($scope.username, $scope.password);
    };
}]);