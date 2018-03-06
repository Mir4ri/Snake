// Настройка «холста»

var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
//  Висота і ширина

var width = canvas.width;
var height = canvas.height;

var blockSize = 10;
var widthInBlocks = width / blockSize;
var heightInBlocks = height / blockSize;

// Встановлюєм рахунок 0

var score = 0;
// Рамка

var drawBorder = function () {
ctx.fillStyle = "#303030";
ctx.fillRect(0, 0, width, blockSize);
ctx.fillRect(0, height - blockSize, width, blockSize);
ctx.fillRect(0, 0, blockSize, height);
ctx.fillRect(width - blockSize, 0, blockSize, height);
};

// Вивід тексту на екран

var drawScore = function () {
ctx.font = "20px Courier";
ctx.fillStyle = "Green";
ctx.textAlign = "left";
ctx.textBaseline = "top";
ctx.fillText("Score: " + score, blockSize, blockSize);
};


// Відміняєм дію setInterval і висвідчуєм надпис "Game Over"
var gameOver = function () {
clearInterval(intervalId);
ctx.font = "60px Courier";
ctx.fillStyle = "Red";
ctx.textAlign = "center";
ctx.textBaseline = "middle";
ctx.fillText("Game Over", width / 2, height / 2);
};
// Окружність
var circle = function (x, y, radius, fillCircle) {
ctx.beginPath();
ctx.arc(x, y, radius, 0, Math.PI * 2, false);
if (fillCircle) {
ctx.fill();
} else {
ctx.stroke();
}
};
// Задаєм конструктор Block (ячейка)
var Block = function (col, row) {
this.col = col;
this.row = row;
};
// Квадрат в ячейці
Block.prototype.drawSquare = function (color) {
var x = this.col * blockSize;
var y = this.row * blockSize;
ctx.fillStyle = color;
ctx.fillRect(x, y, blockSize, blockSize);
};
// Круг в яцейці
Block.prototype.drawCircle = function (color) {
var centerX = this.col * blockSize + blockSize / 2;
var centerY = this.row * blockSize + blockSize / 2;
ctx.fillStyle = color;
circle(centerX, centerY, blockSize / 2, true);
};
// Перевіряєм, находиться чи ця ячейка в тій же позиції, що і ячейка otherBlock
Block.prototype.equal = function (otherBlock) {
return this.col === otherBlock.col && this.row === otherBlock.row;
};
// Задаєм конструктор Snake (змейка)
var Snake = function () {
this.segments = [
new Block(7, 5),
new Block(6, 5),
new Block(5, 5)
];
this.direction = "right";
this.nextDirection = "right";
};
// Квадртатики для змійки
Snake.prototype.draw = function () {
for (var i = 0; i < this.segments.length; i++) {
this.segments[i].drawSquare("#E61C5D");
}
};
// Створюжм нову голову і добавляєм її до початку змійки, щоб посунути змію в потрібну сторону
Snake.prototype.move = function () {
var head = this.segments[0];
var newHead;
this.direction = this.nextDirection;
if (this.direction === "right") {
newHead = new Block(head.col + 1, head.row);
} else if (this.direction === "down") {
newHead = new Block(head.col, head.row + 1);
} else if (this.direction === "left") {
newHead = new Block(head.col - 1, head.row);
} else if (this.direction === "up") {
newHead = new Block(head.col, head.row - 1);
}
if (this.checkCollision(newHead)) {
gameOver();
return;
}
this.segments.unshift(newHead);
if (newHead.equal(apple.position)) {
score++;
apple.move();
} else {
this.segments.pop();
}
};
// Перевіряєм, чи не торкнулась  змійка стіни або свого тіла
Snake.prototype.checkCollision = function (head) {
var leftCollision = (head.col === 0);
var topCollision = (head.row === 0);
var rightCollision = (head.col === widthInBlocks - 1);
var bottomCollision = (head.row === heightInBlocks - 1);
var wallCollision = leftCollision || topCollision || rightCollision || bottomCollision;
var selfCollision = false;
for (var i = 0; i < this.segments.length; i++) {
if (head.equal(this.segments[i])) {
selfCollision = true;
}
}
return wallCollision || selfCollision;
};
// Навігація
Snake.prototype.setDirection = function (newDirection) {
if (this.direction === "up" && newDirection === "down") {
return;
} else if (this.direction === "right" && newDirection === "left") {
return;
} else if (this.direction === "down" && newDirection === "up") {
return;
} else if (this.direction === "left" && newDirection === "right") {
return;
}
this.nextDirection = newDirection;
};
// Задаєм конструктор Apple (яблуко)
var Apple = function () {
this.position = new Block(10, 10);
};
// Кружок в позиції яблука
Apple.prototype.draw = function () {
this.position.drawCircle("#FFBD39");
};
// Генерація яблука в рандомномній клітинці
Apple.prototype.move = function () {
var randomCol = Math.floor(Math.random() * (widthInBlocks - 2)) + 1;
var randomRow = Math.floor(Math.random() * (heightInBlocks - 2)) + 1;
this.position = new Block(randomCol, randomRow);
};
// Об'єкт змійка і об'єкт яблучко
var snake = new Snake();
var apple = new Apple();
// Запускаєм ф-ію анімації через setInterval
var intervalId = setInterval(function () {
ctx.clearRect(0, 0, width, height);
drawScore();
snake.move();
snake.draw();
apple.draw();
drawBorder();
}, 100);
// Закріплюєм код навігації до клавіш
var directions = {
37: "left",
38: "up",
39: "right",
40: "down",
};

// Задаєм опрацьовувач події keydown (клавіші-стрілки)
$("body").keydown(function (event) {
var newDirection = directions[event.keyCode];
if (newDirection !== undefined) {
snake.setDirection(newDirection);
}
});

