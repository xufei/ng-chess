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
	.value("ChessColor", {
		RED: 1,
		BLACK: -1,
		GREY: 0
	})
	.controller("ChessCtrl", ["$scope", "offsetX", "offsetY", "gridSize", "ChessType", "ChessColor", function($scope, offsetX, offsetY, gridSize, ChessType, ChessColor) {
		var chesses = [
			[1, 7, 4, 9],
			[1, 6, 3, 9],
			[1, 6, 5, 9],
			[1, 5, 2, 9],
			[1, 5, 6, 9],
			[1, 4, 1, 9],
			[1, 4, 7, 9],
			[1, 3, 0, 9],
			[1, 3, 8, 9],
			[1, 2, 1, 7],
			[1, 2, 7, 7],
			[1, 1, 0, 6],
			[1, 1, 2, 6],
			[1, 1, 4, 6],
			[1, 1, 6, 6],
			[1, 1, 8, 6],

			[-1, 7, 4, 0],
			[-1, 6, 3, 0],
			[-1, 6, 5, 0],
			[-1, 5, 2, 0],
			[-1, 5, 6, 0],
			[-1, 4, 1, 0],
			[-1, 4, 7, 0],
			[-1, 3, 0, 0],
			[-1, 3, 8, 0],
			[-1, 2, 1, 2],
			[-1, 2, 7, 2],
			[-1, 1, 0, 3],
			[-1, 1, 2, 3],
			[-1, 1, 4, 3],
			[-1, 1, 6, 3],
			[-1, 1, 8, 3]
		];

		$scope.chesses = [];

		angular.forEach(chesses, function(arr){
			$scope.chesses.push({
				color: arr[0],
				type: arr[1],
				x: arr[2],
				y: arr[3]
			});
		});

		$scope.x = function(chess) {
			return offsetX + chess.x * gridSize;
		};

		$scope.y = function(chess) {
			return offsetY + chess.y * gridSize;
		};

		var colors = {
			"1": "red",
			"0": "",
			"-1": "black"
		};

		var types = ["blank", "soldier", "cannon", "chariot", "horse", "staff", "guard", "general"];

		$scope.symbol = function(chess) {
			return "#" + colors[chess.color] + "-" + types[chess.type];
		};

		$scope.chessClick = function(chess) {
			alert(chess.type);
		};
	}]);