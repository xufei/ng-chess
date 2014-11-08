angular.module("ng-chinese-chess").factory("Room", [function () {
    var Step = AV.Object.extend("Step");

    var Room = AV.Object.extend("Room", {
        addStep: function (data) {
            var step = new Step();

            step.set("chess", data.chess);
            step.set("fromX", data.fromX);
            step.set("fromY", data.fromY);
            step.set("toX", data.toX);
            step.set("toY", data.toY);
            step.set("parent", this);

            step.save();
        }
    });

    return Room;
}]);