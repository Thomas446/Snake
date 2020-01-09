var snakeHead;
var apple;
var xVel = 0;
var yVel = 0;
var speed = 10;
var bodySize = 10;
var hasMoved = false;
var gameOver = false;
var initialLength = 5;

function setup(){
	// scales canvas size to device
	if(displayWidth < displayHeight){
		var size = displayWidth/2;
		var offset = 100;
	}else{
		var size = displayHeight/2;
		var offset = 0;
	}
	size = Math.floor(size/bodySize)*bodySize;
	var cnv = createCanvas(size,size);
	snakeHead = new Head(10,10, initialLength);
	apple = new Apple(true);
	textSize(20);
	textStyle(BOLD);
	frameRate(18);
}

function draw(){
	//basic game loop
	if(!gameOver){
		clear();
		fill(255,255,255);
		rect(0,0,width,height);
		snakeHead.updatePosition(xVel,yVel);
		snakeHead.drawSnake();
		apple.drawApple();
		
		text(snakeHead.length - initialLength,width - 50, 25);
		if(snakeHead.checkCollision()){
			console.log("collided");
			gameOver = true;
		}
		if(snakeHead.checkApple(apple)){
			apple.respawn();
			snakeHead.addBody();
		}
	}
}
// snake head contains recursive trail of snake body squares
class Head{
	//sends old position to body so it lags behind
	constructor(x,y,length){
		this.xPos = x;
		this.yPos = y;
		this.oldX = x;
		this.oldY = y;
		this.length = length;
		this.child = new Body(this.oldX,this.oldY,this.length - 1);
	}
	updatePosition(xVel, yVel){
		this.oldX = this.xPos;
		this.oldY = this.yPos;
		this.xPos += xVel;
		this.yPos += yVel;
		if(this.xPos > width)
			this.xPos = 0;
		if(this.xPos < 0)
			this.xPos = width;
		if(this.yPos > height)
			this.yPos = 0;
		if(this.yPos < 0)
			this.yPos = height;
		this.child.updatePosition(Math.floor(this.oldX),Math.floor(this.oldY));
	}
	checkCollision(){
		return this.child.checkCollision(this.xPos,this.yPos) && hasMoved;
	}
	checkApple(tempApple){
		return this.child.checkApple(tempApple) || (this.xPos + bodySize/2 > tempApple.xPos - bodySize/2 && this.xPos - bodySize/2 < tempApple.xPos + bodySize/2 && this.yPos - bodySize/2 < tempApple.yPos + bodySize/2 && this.yPos + bodySize /2 > tempApple.yPos - bodySize/2);
	}
	addBody(){
		this.length++;
		this.child.addBody();
	}
	drawSnake(){
		fill(255,255,255);
		circle(Math.floor(this.xPos), Math.floor(this.yPos), bodySize);
		this.child.drawBody();
	}
}


class Body{
	constructor(x,y,remaining){
		this.xPos = x;
		this.yPos = y;
		this.oldX = x;
		this.oldY = y;
		this.hasChild = false;
		if(remaining > 0){
			this.child = new Body(this.oldX, this.oldY, remaining - 1);
			this.hasChild = true;
		}
	}
	updatePosition(newX, newY){
		this.oldX = this.xPos;
		this.oldY = this.yPos;
		this.xPos = newX;
		this.yPos = newY;
		if(this.hasChild)
			this.child.updatePosition(this.oldX,this.oldY);
	}
	
	checkCollision(x,y){
		if(this.hasChild){
			return (this.xPos == x && this.yPos == y) || this.child.checkCollision(x,y);
		}else{
			return (this.xPos == x && this.yPos == y);
		}
	}
	addBody(){
		if(this.hasChild){
			this.child.addBody();
		}else{
			this.hasChild = true;
			this.child = new Body(this.oldX, this.oldY, 0);
		}
	}
	checkApple(tempApple){
		if(this.hasChild){
			return this.child.checkApple(tempApple) || (this.xPos + bodySize/2 > tempApple.xPos - bodySize/2 && this.xPos - bodySize/2 < tempApple.xPos + bodySize/2 && this.yPos - bodySize/2 < tempApple.yPos + bodySize/2 && this.yPos + bodySize /2 > tempApple.yPos - bodySize/2);
		}else{
			return this.xPos + bodySize/2 > tempApple.xPos - bodySize/2 && this.xPos - bodySize/2 < tempApple.xPos + bodySize/2 && this.yPos - bodySize/2 < tempApple.yPos + bodySize/2 && this.yPos + bodySize /2 > tempApple.yPos - bodySize/2;
		}
	}
	drawBody(){
		circle(Math.floor(this.xPos),Math.floor(this.yPos), bodySize);
		if(this.hasChild)
			this.child.drawBody();
	}
}
// apple visibility not used now, but could be used for some features
class Apple{
	constructor(visible){
		this.visible = visible;
		this.xPos = Math.floor(random(0,width)/bodySize)*bodySize;
		this.yPos = Math.floor(random(0,height)/bodySize)*bodySize;
	}
	drawApple(){
		if(this.visible){
			fill(255,0,0);
			circle(this.xPos,this.yPos, bodySize);
		}
	}
	respawn(){
		this.xPos = Math.floor(random(0,width)/bodySize)*bodySize;
		this.yPos = Math.floor(random(0,height)/bodySize)*bodySize;
	}
}

// basic key handler, doesn't allow user to reverse back on itself (e.g. go from right to left)
function keyPressed(){
	if (keyCode === LEFT_ARROW && xVel == 0 && snakeHead.xPos == snakeHead.child.xPos) {
		xVel = -speed;
		yVel = 0;
		hasMoved = true;
  } else if (keyCode === RIGHT_ARROW && xVel == 0 && snakeHead.xPos == snakeHead.child.xPos) {
		xVel = speed;
		yVel = 0;
		hasMoved = true;
  } else if (keyCode === UP_ARROW && yVel == 0 && snakeHead.yPos == snakeHead.child.yPos) {
		xVel = 0;
		yVel = -speed;
		hasMoved = true;
  } else if (keyCode === DOWN_ARROW && yVel == 0 && snakeHead.yPos == snakeHead.child.yPos) {
		xVel = 0;
		yVel = speed;
		hasMoved = true;
  }
}