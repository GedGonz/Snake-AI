(function() {
	'use strict';

	var canvas = document.getElementById("snake-canvas").getContext("2d"),
		canvasWidth = 1200,
		canvasHeight = 600,
		cellSize = 10;

	if(canvasWidth % cellSize != 0 || canvasHeight % cellSize != 0){
		throw "Invalid canvas size. Width & Height must be multiples of " + cellSize;
	}

	canvas.font = "20px Calibri";

	// Initialize game.
	var game = new Game(canvasWidth/cellSize, canvasHeight/cellSize, canvas, cellSize);

	// Add static obstacles.
	game.obstacles = staticObstacles;

	//Add the AI snake
	var aiSnake = new Snake(Math.floor(game.width/2),Math.floor(game.height/2), {name: "AI", direction: "E", color: "#00F"});
	aiSnake.loop = snakeAILoop;
	game.addSnake(aiSnake);

	$("#addSnakeBtn").click(function(){
		addHumanPlayer();
		$(this).prop('disabled', 'disabled');
	});

	function addHumanPlayer(){
		// Add a human snake to game with keyboard controls.
		var humanSnake = new Snake(0,0, { name: "Derick"});
		humanSnake.color = "#F00";	
		game.addSnake(humanSnake);
		//Implement human snake loop method
		var directionChanges = [];
		humanSnake.loop = function (game) {
			var directionChange = directionChanges[0];
			if(directionChange !== undefined){
				switch(directionChange){
					case 'N':
						if(this.direction != 'S'){
							this.direction = 'N';
						}
						break;	
					case 'E':
						if(this.direction != 'W'){
							this.direction = 'E';
						}
						break;	
					case 'S':
						if(this.direction != 'N'){
							this.direction = 'S';
						}
						break;	
					case 'W':
						if(this.direction != 'E'){
							this.direction = 'W';
						}
						break;	
				}
				directionChanges.shift();
			}
		};
		$(document).keydown(function (event) {
			switch(event.which){
				case 37:
					directionChanges.push('W');	
					break;

				case 38:
					directionChanges.push('N');
					break;

				case 39:
					directionChanges.push('E');
					break;

				case 40:
					directionChanges.push('S');
					break;
			}
		});
	}

	$("#playBtn").click(function () {
		$("#playBtnContainer").hide();
		game.startGame();
		$("#snakeMenu").hide();
		$("#playerScores").show();
		setInterval(function() {
			refreshScores(getPlayerScores());
		}, 100);
	});
	
	function getPlayerScores() {
		var allPlayers = [];
		var alivePlayersScores = [];
		var deadPlayersScores = [];
		
		// Create result array.
		game.snakes.forEach(snake => {
			allPlayers.push({
				playerName: snake.name && snake.name !== "" ? snake.name : "Anonymous",
				score: snake.body.length - 4,
				isDead: false
			});
		});

		game.deadSnakes.forEach(snake => {
			allPlayers.push({
				playerName: snake.name && snake.name !== "" ? snake.name : "Anonymous",
				score: snake.body.length - 4,
				isDead: true
			});
		});

		// Sort the array.
		allPlayers.sort(function(snake1, snake2) {
			return snake2.score - snake1.score;
		});

		// Calculate positions.
		if (allPlayers.length > 0) {
			allPlayers[0].position = 1;

			for (var i = 1, pos = 1; i < allPlayers.length; i++) {
				if (allPlayers[i].score < allPlayers[i-1].score) {
					pos++;
				}

				allPlayers[i].position = pos;
			}
		}
		
		return allPlayers; // alivePlayersScores.concat(deadPlayersScores);;
	};

	function refreshScores(playerScores) {
		var playerScoreDetailsSection = $("#playerScoresDetails");
		playerScoreDetailsSection.empty();

		for (var i = 0; i < playerScores.length; i++) {
			var playerScoreRow = $(".player-score-row-temp").clone();

			playerScoreRow.removeClass("player-score-row-temp hidden");
			playerScoreRow.find(".js-player-position").html(playerScores[i].position);
			playerScoreRow.find(".js-player-name").html(playerScores[i].playerName);
			playerScoreRow.find(".js-player-score").html(playerScores[i].score);
			playerScoreRow.find(".js-player-status").html(playerScores[i].isDead ? "DEAD" : "");
			
			playerScoreRow.appendTo(playerScoreDetailsSection);
		}
	}

})();