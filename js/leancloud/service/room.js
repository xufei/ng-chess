angular.module("ng-chinese-chess").service("RoomService", [function () {
    var Step = AV.Object.extend("Step");

    var Room = AV.Object.extend("Room");

    var RoomCollection = AV.Collection.extend({
        model: Room
    });

    var rooms = new RoomCollection();

    return {
        createRoom: function() {
            return new Room();
        },

        rooms: function() {
            return rooms;
        },

        getSteps: function(room) {
            var StepCollection = AV.Collection.extend({
                model: Step,
                query: (new AV.Query(Step)).equalTo("parent", room)
            });

            var steps = new StepCollection();
            return steps;
        },

        addStep: function(room, data) {
            var step = new Step();

            step.set("fromX", data.fromX);
            step.set("fromY", data.fromY);
            step.set("toX", data.toX);
            step.set("toY", data.toY);
            step.set("parent", room);

            step.save();
        }
    };
}]);