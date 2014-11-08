angular.module("ng-chinese-chess").service("UserService", ["$q", function ($q) {
    this.signUp = function (username, password, email) {
        var defer = $q.defer();

        var user = new AV.User();
        user.set("username", username);
        user.set("password", password);
        user.set("email", email);

        // other fields can be set just like with AV.Object
        //user.set("phone", "415-392-0202");
        user.signUp(null, {
            success: function (user) {
                // Hooray! Let them use the app now.
                defer.resolve(user);
            },
            error: function (user, error) {
                // Show the error message somewhere and let the user try again.
                defer.resolve(error);
                alert("Error: " + error.code + " " + error.message);
            }
        });

        return defer.promise;
    };

    this.login = function (username, password) {
        var defer = $q.defer();

        AV.User.logIn(username, password, {
            success: function (user) {
                // Do stuff after successful login.
                defer.resolve(user);
            },
            error: function (user, error) {
                // The login failed. Check error to see why.
                defer.resolve(error);
            }
        });

        return defer.promise;
    };

    this.currentUser = function () {
        return AV.user.current;
    };
}])
    .controller("UserCtrl", ["$scope", "UserService", function ($scope, UserService) {
        $scope.signUp = function () {
            UserService.signUp();
        };
    }]);