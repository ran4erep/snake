function SHOW(node) {
    var mountNodeId = 'snake';
    document.getElementById(mountNodeId).appendChild(node);
}
//функция святого рандомчика
function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

//функция очистки для ROT
function cls() {
	for (var i=0; i<=width; i++) {
		for (var j=0; j<=height; j++) {
			switch(optionsBG) {
				case 1 :
			display.draw(i, j, ".", "#000000");
			break;

			case 0 :
			display.draw(i, j, " ", "#000000");
			break;
		}
		}
	}
}


//управление игрой
function input() {
	//управление с клавиатуры
	document.addEventListener('keydown', function(e) {
		switch (e.keyCode) {
			case 68 :
			case 39 :
			direction = 1;
			break;

			case 65 :
			case 37 :
			direction = 2;
			break;

			case 87 :
			case 38 :
			direction = 3;
			break;

			case 83 :
			case 40 :
			direction = 4;
			break;

		}
	})
	//управление при помощи тачскрина/мыши
buttonRight.addEventListener('click', function(e) {
	direction=1;
});
buttonLeft.addEventListener('click', function(e) {
	direction=2;
});
buttonUp.addEventListener('click', function(e) {
	direction=3;
});
buttonDown.addEventListener('click', function(e) {
	direction=4;
});
}

//логика
function logic() {
	var prevX = tailX[0];
	var prevY = tailY[0];
	var prev2X, prev2Y;
	tailX[0]=x;
	tailY[0]=y;
	for (var i=1; i<tail; i++) {
		prev2X=tailX[i];
		prev2Y=tailY[i];
		tailX[i]=prevX;
		tailY[i]=prevY;
		prevX=prev2X;
		prevY=prev2Y;
	}
//что делать при движении в выбранном направлении
if (!gameOver) {

	switch (direction) {
	case 1 :
	if (moveState !== "left") {
	x++;
	moveState = "right";
	
}
	break;

	case 2 :
	if (moveState !== "right") {
	x--;
	moveState = "left";
	
}
	break;

	case 3 :
	if (moveState !== "down") {
	y--;
	moveState = "up";
	
}
	break;

	case 4 :
	if (moveState !== "up") {
	y++;
	moveState = "down";
	
}
	break;

}
//не даём змейке двигаться в обратном направлении
if (direction === 4 && moveState === "up")
	y--;
if (direction === 3 && moveState === "down")
	y++;
if (direction === 1 && moveState === "left")
	x--;
if (direction === 2 && moveState === "right")
	y++;
}

//змейка выходит с другого конца карты
	if (y>19)
		y=0;
	if (y<0)
		y=19;
	if (x>19)
		x=0;
	if (x<0)
		x=19;

//что делать когда игра закончилась (змея укусила свой хвост)
for (var i=0; i<tail; i++) {
		if (tailX[i] == x && tailY[i] == y) {
			cls();
			display.drawText(rand(0, 11), rand(0,19), "%b{black}%c{red}GAME OVER");
			direction = 0;
			gameOver = true;
			gameSpeed = 1000;
			//cancelAmimationRequest(update);
			}

	}

//сбор фруктов
if (x === fruitX && y === fruitY) {
	fruitX = rand(9, 11);
	fruitY = rand(9, 11);
	score++;
	tail++;
}
//запрещаем еде спавниться на теле змейки
for (var i=0; i<tail; i++) {
	if (fruitX === tailX[i] && fruitY === tailY[i]) {

	fruitX = rand(0, 19);
	fruitY = rand(0, 19);
	display.drawText(0, 3, "it was", "#FF0000");
	}
}
if (fruitX === x && fruitY === y) {
	fruitX = rand(0, 19);
	fruitY = rand(0, 19);
	display.drawText(0, 3, "it was", "#FF0000");
}
}



//инициализация
var optionsBG;
var chooseBG = document.getElementById("chooseBG");
//chooseBG.addEventListener('change', (e) => {
//  console.log(e.target.value);
//});
var gameOver;
var moveState = null;
var gameSpeed;
var width = 20, height =20;
var x, y, fruitX, fruitY, score, tail;
var direction = 0;
var timeStart = 0;
var tail = 0;
var tailX = [], tailY = [];
var tailDraw;
var R, G, B;

//рендеринг консоли
var display = new ROT.Display({width:width, height:height, spacing: 0.8, forceSquareRatio:true, bg:"#D8D8D3"});
SHOW(display.getContainer());

//первоначальная настройка
gameOver = false;
gameSpeed = 300;
x = width/2;
y = height/2;
fruitX = rand(9, 11);
fruitY = rand(9, 11);
score = 0;
optionsBG = 0;


//главная функция
function update(timestamp){
	if (timestamp - timeStart >= gameSpeed) {
			//cls();
	//отрисовываем фрукт
	//display.draw(fruitX, fruitY, "@", "#000000");
	//отрисовываем змейку
	//display.draw(x, y, "O", "#000000");
	//выводим очки в HTML документ
for (var i=0; i<height; i++) {
	for(var j=0; j<width; j++) {
		//рендеринг головы змеи и фруктов
		if (i==y && j==x) {
			display.draw(j, i, "O", "#000000");
		}
		else if (i==fruitY && j==fruitX) {
			display.draw(j, i, "@", "#000000");
		}
		//рендеринг хвоста
		else {
			tailDraw = false;
			for (var k=0; k<tail; k++) {
				if (tailX[k]==j && tailY[k]==i) {
					tailDraw=true;
					R = rand(50, 200);
					G = rand(50, 200);
					B = rand(50, 200);
					display.draw(j, i, "o", "rgb("+R+","+G+","+B+")");
				}
			}
			if (!tailDraw) {
				switch (optionsBG) {
					case 1 :
				display.draw(j, i, ".", "#000000");
				break;

				case 0 :
				display.draw(j, i, " ", "#000000");
				break;
			}
			}
		}
		display.drawText(0, 0, `%c{red}${fruitX}`, "#000000");
		display.drawText(0, 1, `%c{red}${fruitY}`, "#000000");
	}
}
	document.getElementById("score").innerHTML = "Очки: " + score;
	chooseBG.addEventListener('change', function(e) {
	optionsBG = parseInt(e.target.value);
});
	logic();

		timeStart = timestamp;
	}

requestAnimationFrame(update);
}

	input();
	update();