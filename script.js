var canvas = document.getElementById('game-area');
var ctx = canvas.getContext('2d');

var unit = 20;
var cols = canvas.width / unit;
var rows = canvas.height / unit;

var snake = [{x: unit * 5, y: unit * 5}];
var direction = 'RIGHT';
var apples = [];
var maxApples = 3;
var speed = 200;
var timer;
var score = 0;
var slowTimeout = null;

function randomPosition() {
  return {
    x: Math.floor(Math.random() * cols) * unit,
    y: Math.floor(Math.random() * rows) * unit
  };
}

function spawnApple() {
  var colors = ['green', 'red', 'blue'];
  var pos;
  do {
    pos = randomPosition();
  } while (snake.some(seg => seg.x === pos.x && seg.y === pos.y) ||
           apples.some(a => a.x === pos.x && a.y === pos.y));
  apples.push({x: pos.x, y: pos.y, color: colors[Math.floor(Math.random() * colors.length)]});
}

function ensureApples() {
  while (apples.length < maxApples) spawnApple();
}

function draw() {
  ctx.clearRect(0,0,canvas.width, canvas.height);
  apples.forEach(a => {
    ctx.fillStyle = a.color;
    ctx.fillRect(a.x, a.y, unit, unit);
  });
  ctx.fillStyle = 'black';
  snake.forEach(seg => {
    ctx.fillRect(seg.x, seg.y, unit, unit);
  });
  document.getElementById('score').textContent = score;
}

function moveSnake() {
  var head = {x: snake[0].x, y: snake[0].y};
  if (direction === 'LEFT') head.x -= unit;
  if (direction === 'RIGHT') head.x += unit;
  if (direction === 'UP') head.y -= unit;
  if (direction === 'DOWN') head.y += unit;

  if (head.x >= canvas.width) head.x = 0;
  if (head.x < 0) head.x = canvas.width - unit;
  if (head.y >= canvas.height) head.y = 0;
  if (head.y < 0) head.y = canvas.height - unit;

  snake.unshift(head);
  var appleIndex = apples.findIndex(a => a.x === head.x && a.y === head.y);
  if (appleIndex > -1) {
    var apple = apples[appleIndex];
    apples.splice(appleIndex,1);
    score += 100;
    if (apple.color === 'red') {
      snake.pop();
      if (snake.length > 1) snake.pop();
    } else if (apple.color === 'blue') {
      clearInterval(timer);
      speed *= 2;
      timer = setInterval(gameStep, speed);
      if (slowTimeout) clearTimeout(slowTimeout);
      slowTimeout = setTimeout(function(){
        clearInterval(timer);
        speed /= 2;
        timer = setInterval(gameStep, speed);
      }, 10000);
    }
    if (score >= 1000) {
      alert('Victory! You scored ' + score + ' points!');
      score = 0;
    }
    ensureApples();
  } else {
    snake.pop();
  }
}

function gameStep() {
  moveSnake();
  draw();
}

document.addEventListener('keydown', function(e) {
  if (e.key === 'ArrowLeft' && direction !== 'RIGHT') direction = 'LEFT';
  if (e.key === 'ArrowRight' && direction !== 'LEFT') direction = 'RIGHT';
  if (e.key === 'ArrowUp' && direction !== 'DOWN') direction = 'UP';
  if (e.key === 'ArrowDown' && direction !== 'UP') direction = 'DOWN';
});

ensureApples();
timer = setInterval(gameStep, speed);
draw();
