function Snake(x, y, options) {
	
	var options = extend({
		direction : 'E',
		color: '#000',
		initialSize: 4
	}, options);
	
	this.name = options.name;
	this.body = [];
	this.direction = options.direction;
	this.color = options.color;
	this.loop = function () {};
	this.getHead = () => this.body[0];
	this.memory = {};

	//Initialize body
	for (var i = 0; i < options.initialSize; i++) {
		switch(this.direction){
			case 'N':
				this.body.push(new Position(x, y - i));
				break;
			case 'E':
				this.body.push(new Position(x - i, y));
				break;
			case 'S':
				this.body.push(new Position(x, y + i));
				break;
			case 'W':
				this.body.push(new Position(x + i, y));
				break;
		}
	}
}

