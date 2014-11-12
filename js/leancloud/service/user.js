angular.module("ng-chinese-chess").service("UserService", ["$q", function ($q) {
    this.signUp = function (username, password, email) {
        var defer = $q.defer();

        var user = new AV.User();
        user.set("username", username);
        user.set("password", password);

        user.signUp(null, {
            success: function (user) {
                // 注册成功了哦
                defer.resolve(user);
            },
            error: function (user, error) {
                // 出错了
                defer.reject(error);
                alert("Error: " + error.code + " " + error.message);
            }
        });

        return defer.promise;
    };

    this.signIn = function (username, password) {
        var defer = $q.defer();

        AV.User.logIn(username, password, {
            success: function (user) {
                // 登录成功了
                defer.resolve(user);
            },
            error: function (user, error) {
                // 登录失败
                defer.reject(error);
            }
        });

        return defer.promise;
    };
}]);