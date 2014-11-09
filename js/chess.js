angular.module("ng-chinese-chess", [])
    .constant("offsetX", 40)
    .constant("offsetY", 40)
    .constant("gridSize", 60)
    .value("ChessType", {
        GENERAL: 7,
        GUARD: 6,
        STAFF: 5,
        HORSE: 4,
        CHARIOT: 3,
        CANNON: 2,
        SOLDIER: 1,
        BLANK: 0
    })
    .value("ChessText", {
        14: "帅",
        13: "仕",
        12: "相",
        11: "馬",
        10: "車",
        9: "砲",
        8: "兵",
        7: "将",
        6: "士",
        5: "象",
        4: "马",
        3: "车",
        2: "炮",
        1: "卒"
    })
    .value("ChessColor", {
        RED: 1,
        BLACK: -1,
        GREY: 0
    })
    .value("GameState", {
        UNINITIALIZED: -1,
        FINISHED: 0,
        READY: 1,
        ACTING: 2
    });