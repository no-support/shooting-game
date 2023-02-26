// 캔버스 세팅
let canvas;
let ctx;
canvas = document.createElement('canvas');
ctx = canvas.getContext("2d");
canvas.width = 400;
canvas.height = 700;
// canvas.width = 1920; // canvas.height = 1080;
document.body.appendChild(canvas);

let backgroundImage, spaceshipImage, bulletImage, enemyImage, gameOverImage;
let gameOver = false; // true이면 게임 끝
let score = 0;
// 우주선 좌표
let spaceshipX = canvas.width/2-30;
let spaceshipY = canvas.height - 60;

let bulletList = []; // 총알들을 저장하는 리스트
function Bullet(){
  this.x = 0;
  this.y = 0;
  this.init = function(){
    this.x = spaceshipX + 18;
    this.y = spaceshipY;
    this.alive = true; // true면 살아있는 총알 false면 죽은 총알
    bulletList.push(this);
  }
  this.update = function () {
    this.y -=7;
  };

  this.checkHit = function () {
    for (let i = 0; i < enemyList.length; i++) {
      if(this.y <= enemyList[i].y && this.x>=enemyList[i].x && this.x<=enemyList[i].x + 48) {
        // 총알이 죽게 됨. 적군의 우주선이 없어짐, 점수 획득
        score++;
        this.alive = false;
        enemyList.splice(i, 1);
      }
      
    }
  }
}

let enemyList = [];
function generateRandomValue(min, max) {
  let randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
  return randomNum;
}

function Enemy() {
  this.x = 0;
  this.y = 0;
  this.init = function(){
    this.y = 0;
    this.x = generateRandomValue(0, canvas.width - 48);
    enemyList.push(this);
  }
  this.update = function() {
    this.y += 2; // 적군의 속도 조절

    if (this.y >= canvas.height - 48) {
      gameOver = true;

    }
  }
  
}
function loadImage(){
  backgroundImage = new Image();
  backgroundImage.src = "images/background.png";
  spaceshipImage = new Image();
  spaceshipImage.src = "images/spaceship.png";

  bulletImage = new Image();
  bulletImage.src = "images/bullet.png";

  enemyImage = new Image();
  enemyImage.src = "images/enemy.png";

  gameOverImage = new Image();
  gameOverImage.src = "images/game-over.jpg";
}

let keysDown = {};
function setupKeyboardListener(){
  document.addEventListener("keydown", function(event){
    keysDown[event.keyCode] = true;
  })
  document.addEventListener("keyup", function (event) {
    delete keysDown[event.keyCode];
    if (event.keyCode === 32) {
      createBullet(); // 총알 생성
    }
  })
}
function update() {
  if (39 in keysDown){
    if (spaceshipX >= 340) return;
    spaceshipX += 5;//right
  }
  if (37 in keysDown){
    if (spaceshipX <= 0) return;
    spaceshipX -= 5;//left
  }
  // 총알의 y좌표 업데이트하는 함수 호출
  for (let i = 0; i<bulletList.length ; i++ ) {
    if (bulletList[i].alive) {
      bulletList[i].update();
      bulletList[i].checkHit();
    }
  }
  for (let i = 0; i<enemyList.length ; i++ ) {
    enemyList[i].update();
  }
}

function createBullet(){
  let b = new Bullet();
  b.init();
}

function createEnemy() {
  const interval = setInterval(()=>{
    let e = new Enemy();
    e.init();
  }, 1000);
}

function render() {
  ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height)
  ctx.drawImage(spaceshipImage, spaceshipX, spaceshipY);
  ctx.fillText(`Score:${score}`, 20, 20);
  ctx.fillStyle = "white";
  ctx.font = "20px Arial";

  for (let i = 0; i< bulletList.length ; i++ ) {
    if (bulletList[i].alive) {
      ctx.drawImage(bulletImage, bulletList[i].x, bulletList[i].y);
    }
  }
  for (let i = 0; i< enemyList.length ; i++ ) {
    ctx.drawImage(enemyImage, enemyList[i].x, enemyList[i].y);
  }

}
function main() {
  if(!gameOver) {
    update();
    render();
    requestAnimationFrame(main);
  } else {
    ctx.drawImage(gameOverImage, 10, 100, 380, 380);
  }
}
loadImage();
setupKeyboardListener();
createEnemy();
main();
