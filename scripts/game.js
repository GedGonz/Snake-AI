function Game(width, height, canvas, cellSize){
	"use strict";
	var game = {
		snakes : [],
		deadSnakes : [],
		obstacles : [],
		food : [],
		height : height,
		width: width,
		cellSize: cellSize,
		addSnake : addSnake,
		startGame : startGame,
		stopGame : stopGame
	}
	
	let loopid;
	const fps = 30;
	const foodFrequency = 100; //The higher this number, the slower food will be generated
	let tick = 0;

	return game;
	
	function startGame(){
		loopid = setInterval(function() {
			loop();

			if (isGameOver()) {
				clearInterval(loopid);
			};
		}, 1000 / fps);
	}

	function stopGame(){
		clearInterval(loopid);
	}

	function isGameOver() {
		return game.snakes.length <= 0;
	}

	function loop() {

		// Move snakes depending on the direction set in the loop function.
		game.snakes.forEach((snake) => {
			var newDirection = snake.loop(game);
			if(newDirection){
				snake.direction = newDirection;
			}
			moveSnake(snake);
		});	

		// Clear board.
		canvas.clearRect(0, 0, width * game.cellSize, height * game.cellSize);

		evaluateBoard();

		game.snakes.forEach(snake => {
			drawSnake(snake);
		});

		//Grow food
		if(++tick % fps * foodFrequency == 0){
			growFood();
			if(game.food.length > 10){
				game.food.shift();
			}
		}

		drawFood();
		drawObstacles();
	};

	function drawObstacles(){
		game.obstacles.forEach(position => {
			canvas.fillRect(position.x * cellSize, position.y * cellSize, cellSize, cellSize);
		});
	}
	
	function drawFood() {
		var current = canvas.fillStyle;
		canvas.fillStyle = "#0f0";
		game.food.forEach(position => {
			canvas.fillRect(position.x * cellSize, position.y * cellSize, cellSize, cellSize);
		});
		canvas.fillStyle = current;
	}

	function addSnake(snake) {
		game.snakes.push(snake);
	}

	function moveSnake(snake) {
		var ateFood = false;
		var head = snake.getHead();
		for(var i = 0; i < game.food.length; i++){
			if(head.intersects(game.food[i])){
				game.food.splice(i,1);
				ateFood = true;
				break;
			}
		}
		
		if(!ateFood){
			snake.body.pop();
		}

		var newPosition = new Position(snake.body[0].x, snake.body[0].y);

		switch(snake.direction){
			case 'N':
				newPosition.y -= 1;
				break;
			case 'E':
				newPosition.x += 1;
				break;
			case 'S':
				newPosition.y += 1;
				break;
			case 'W':
				newPosition.x -= 1;
				break;					
		}

		snake.body.unshift(newPosition);
		
	}

	function drawSnake(snake){
		var currentStyle = canvas.fillStyle;
		canvas.fillStyle = snake.color;

		snake.body.forEach(position => {
			canvas.fillRect(position.x * cellSize, position.y * cellSize, cellSize, cellSize);
		});

		if (snake.name && snake.name != "") {
			canvas.fillText(snake.name, (snake.getHead().x-1)*cellSize, (snake.getHead().y-1)*cellSize);
		}

		canvas.fillStyle = currentStyle;
	}

	function evaluateBoard() {

		var deadSnakesIndexes = [];
		
		for (var i = 0; i < game.snakes.length; i++) {
			var head = game.snakes[i].getHead();

			// Evaluate if the snake has hit the board limits.
			if (snakeCrashedWithLimits(head)) {
				deadSnakesIndexes.push(i);
				continue;
			}

			// Evaluate if the snake has hit an obstacle.
			var isDeadByObstacle = false;
			for (var j = 0; j < game.obstacles.length; j++) {
				if (head.intersects(game.obstacles[j])) {
					isDeadByObstacle = true;
					break;
				}
			}

			if (isDeadByObstacle) {
				deadSnakesIndexes.push(i);
				continue;
			}

			// Evaluate if the snake has hit another snake.
			var isDeadByAnotherSnake = false;
			for (var k = 0; k < game.snakes.length; k++) {
				var startPosition = k == i ? 1 : 0;
				
				for (var m = startPosition; m < game.snakes[k].body.length; m++) {
					if (head.intersects(game.snakes[k].body[m])) {
						isDeadByAnotherSnake = true;
						break;
					}					
				}

				if (isDeadByAnotherSnake) {
					deadSnakesIndexes.push(i);
					break;
				}					
			}
		}

		for (var i = deadSnakesIndexes.length - 1; i >= 0; i--) {
			var currentDeadSnakeIndex = deadSnakesIndexes[i];
			game.deadSnakes.push(game.snakes[currentDeadSnakeIndex]);
			game.snakes.splice(currentDeadSnakeIndex, 1);
		}
	}

	function snakeCrashedWithLimits(snakeHead) {
		return snakeHead.x < 0 || snakeHead.x >= width || snakeHead.y < 0 || snakeHead.y >= height;
	}

	function growFood(){
		//TODO: Figure out a way to do this more efficiently, too many nested loops
		var availableSpaces = [];
		var takenSpaces = game.snakes.reduce((acc,val) => acc.concat(val.body) ,[]);
		takenSpaces = takenSpaces.concat(game.obstacles);
		takenSpaces = takenSpaces.concat(game.food);
		
		for(var i = 0; i < game.width ; i++){
			for(var j = 0; j < game.height; j++){
				let newPos = new Position(i,j);
				let intersects = false;
				for(var k = 0; k < takenSpaces.length; k++){
					if(newPos.intersects(takenSpaces[k])){
						intersects = true;
						break;
					}
				}
				if(!intersects){
					availableSpaces.push(newPos);
				}
								
			}
		}
		
		var randomSpace = Math.floor(Math.random() * availableSpaces.length);
		game.food.push(availableSpaces[randomSpace]);
	}
}