var canvas = document.getElementById('game-area');
var ctx = canvas.getContext('2d');
ctx.fillStyle = '#FFF';
ctx.fillRect(0, 0, 300, 300);
var snakeX = 0;
var snakeY = 0;
var unit_size = 20;
var snake = [];
var direction = 'r';
const updateGameArea = function() {
    ctx.clearRect(0, 0, 300, 300);
    for (var i = 0; i < snake.length; i++) {
        ctx.fillRect(snake[i].x, snake[i].y, unit_size, unit_size);
    }
};
setInterval(updateGameArea, 200);
