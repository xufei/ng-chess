angular.module("ng-chinese-chess").controller("ChessboardCtrl",
    ["$scope", "offsetX", "offsetY", "gridSize",
        function ($scope, offsetX, offsetY, gridSize) {
            $scope.offsetX = offsetX;
            $scope.offsetY = offsetY;
            $scope.gridSize = gridSize;
            $scope.pathArr = [];

            init();

            function init() {
                var pathArr = [];
                var i, j;

                // 横线
                for (i = 1; i < 9; i++) {
                    pathArr.push(drawLine(0, i, 8, i));
                }

                // 竖线
                for (i = 1; i < 8; i++) {
                    pathArr.push(drawLine(i, 0, i, 4));
                    pathArr.push(drawLine(i, 5, i, 9));
                }

                // 九宫格的线
                for (i = 0; i < 2; i++) {
                    for (j = 0; j < 2; j++) {
                        pathArr.push(drawLine(3 + 2 * i, 7 * j, 5 - 2 * i, 2 + 7 * j));
                    }
                }

                // 炮位
                for (i = 0; i < 2; i++) {
                    for (j = 0; j < 2; j++) {
                        pathArr = pathArr.concat(drawStar(1 + i * 6, 2 + j * 5));
                    }
                }

                // 兵位
                for (i = 0; i < 5; i++) {
                    for (j = 0; j < 2; j++) {
                        pathArr = pathArr.concat(drawStar(i * 2, 3 + j * 3));
                    }
                }

                $scope.pathArr = pathArr;
            }

            // 生成线的路径
            function drawLine(x1, y1, x2, y2) {
                return "M" + (offsetX + x1 * gridSize) + "," + (offsetY + y1 * gridSize)
                    + " L" + (offsetX + x2 * gridSize) + "," + (offsetY + y2 * gridSize);
            }

            // 生成十字花
            function drawStar (x, y) {
                var arr = [];
                var distance = 1 / 10;
                var length = 1 / 4;

                var startX, startY, endX, endY;

                // 左边画一半
                if (x != 0) {
                    startX = x - distance;
                    startY = y - distance - length;
                    endX = x - distance - length;
                    endY = y - distance;

                    arr.push(drawLine(startX, startY, startX, endY));
                    arr.push(drawLine(startX, endY, endX, endY));

                    startY = y + distance + length;
                    endY = y + distance;

                    arr.push(drawLine(startX, startY, startX, endY));
                    arr.push(drawLine(startX, endY, endX, endY));
                }

                // 右边画一半
                if (x != 8) {
                    startX = x + distance;
                    startY = y - distance - length;
                    endX = x + distance + length;
                    endY = y - distance;

                    arr.push(drawLine(startX, startY, startX, endY));
                    arr.push(drawLine(startX, endY, endX, endY));

                    startY = y + distance + length;
                    endY = y + distance;

                    arr.push(drawLine(startX, startY, startX, endY));
                    arr.push(drawLine(startX, endY, endX, endY));
                }

                return arr;
            }
        }]);