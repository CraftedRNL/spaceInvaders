var myCharacter;
var myImage;
var myEnemies = [];
var eWidth = 50;
var eHeight = 50;
var stageOne = [".", ".", ".", ".", ".", ".", ".", ".", ".", ".", "."]
var position = 0;
var bullets = [];
var inertia = .15;
var speed = .25;
var bulletSpeed = 5;
var bulletTrue = true;
var eDirection = -1;
var eInterval = 3000;
var ebullet = 2000;

var image = document.getElementById("ship");
function startGame() {
    myGameArea.start();
}
var myGameArea = {
    canvas: document.createElement("canvas"),
    start: function () {

        this.canvas.width = 1120;
        this.canvas.height = 700;
        this.canvas.style.borderColor = "black"
        this.canvas.classList.add("mx-auto")
        this.context = this.canvas.getContext("2d");

        myCharacter = new component(40, 40, "red", this.canvas.width, this.canvas.height);
        for (let i = 0; i < stageOne.length; i++) {

            myEnemies.push(new enemy(eWidth, eHeight, "blue", this.canvas.width / 12 - eWidth / 2 + position, 10, 2, 1));
            position += (this.canvas.width / 12);
            console.log(this.canvas.width / 12)
        }

        document.getElementById("box").appendChild(this.canvas);
        this.frameNo = 0;
        this.interval = setInterval(updateGameArea, 20);
        this.enemyInterval = setInterval(moveY, eInterval);
        this.enemyBulletInterval = setInterval(enemyBullet, ebullet);
        window.addEventListener('keydown', function (e) {

            myGameArea.keys = (myGameArea.keys || []);
            myGameArea.keys[e.keyCode] = true;
        })
        window.addEventListener('keyup', function (e) {
            myGameArea.keys[e.keyCode] = false;


        })


    },
    clear: function () {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
    },
    stop: function () {
        clearInterval(this.interval);
    }


}
function bullet(width, height, color, x, y, who) {
    this.width = width;
    this.height = height;
    this.x = x + width / 2 + width;
    console.log(this.x)
    this.y = y - 30;
    this.who = who;
    this.update = function () {
        ctx = myGameArea.context;
        ctx.fillStyle = color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
    this.hit = function (enemyArray) {
        const bulletTop = this.y;
        const bulletBottom = this.y + this.height;
        const bulletLeft = this.x;
        const bulletRight = this.x + this.width;

        enemyArray.forEach((enemy, index) => {
            if (bulletRight > enemy.x &&
                bulletLeft < enemy.x + enemy.width &&
                bulletBottom > enemy.y &&
                bulletTop < enemy.y + enemy.height) {
                    if(enemy.health === 0){
                        enemyArray.splice(index, 1);
                    }else{
                        enemy.health--;
                    }
                
                bullets.splice(i, 1)
                return true;
            }
        });
    };
    this.playerHit = function (){
        const bulletTop = this.y;
        const bulletBottom = this.y + this.height;
        const bulletLeft = this.x;
        const bulletRight = this.x + this.width;

            if (bulletRight > myCharacter.x &&
                bulletLeft < myCharacter.x + myCharacter.width &&
                bulletBottom > myCharacter.y &&
                bulletTop < myCharacter.y + myCharacter.height) {
                    if(myCharacter.health === 0){
                        myGameArea.stop();
                    }else{
                        myCharacter.health--;
                    }
                
                bullets.splice(i, 1)
                return true;
            }
        ;
    }
}
function enemy(width, height, color, x, y, health, damage) {
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.health = health;
    this.damage = damage;
    this.speedX = 0;
    this.speedY = 0;
    this.update = function () {
        ctx = myGameArea.context;

        ctx.fillStyle = color;
        ctx.fillRect(this.x, this.y, this.width, this.height);

    }
    this.newPos = function () {
        this.x += 1 * eDirection;

    }
    this.wallCrash = function () {
        const farthest = this.x + this.width;
        const closest = this.x;

        const wallleft = 0;
        const wallright = myGameArea.canvas.width;


        if (wallleft >= closest) {
            eDirection = 1;
        }
        if (wallright <= farthest) {
            eDirection = -1;
        }
    }
}

function component(width, height, color, x, y) {
    this.width = width;
    this.height = height;
    this.x = (x / 2 - width / 1.5);
    this.y = y - height*2 ;
    this.speedX = 0;
    this.speedY = 0;

    this.update = function () {
        ctx = myGameArea.context;
        ctx.fillStyle = color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.drawImage(image, (this.x), this.y, this.width, this.height)
    }
    this.newPos = function () {
        this.x += this.speedX;
        this.y += this.speedY;

        this.speedX = Math.min(5, Math.max(-5, this.speedX));
        this.speedY = Math.min(5, Math.max(-5, this.speedY));

        if (Math.abs(this.speedX) < 0.15) {
            this.speedX = 0;
        }
        if (Math.abs(this.speedY) < 0.15) {
            this.speedY = 0;
        }
    }
    this.wallCrash = function () {
        const myleft = this.x;
        const myright = this.x + (this.width);
        const mytop = this.y;
        const mybottom = this.y + (this.height);

        const wallleft = 0;
        const wallright = myGameArea.canvas.width;
        const walltop = 0;
        const wallbottom = myGameArea.canvas.height;

        var crash = false;

        if ((walltop >= mytop)) {
            topWall();
        }
        if ((wallbottom <= mybottom)) {
            bottomWall();
        }
        if (wallleft >= myleft) {
            leftWall();
        }
        if (wallright <= myright) {
            rightWall();
        }
    }

}

function updateGameArea() {

    myGameArea.clear();
    const keys = myGameArea.keys;
    myCharacter.wallCrash()


    if (keys) {
        if (keys[37]) {
            myCharacter.speedX += -speed;
        } else if (myCharacter.speedX < 0) {
            myCharacter.speedX += inertia;
        }
        if (keys[39]) {
            myCharacter.speedX += speed;
        } else if (myCharacter.speedX > 0) {
            myCharacter.speedX -= inertia;
        }
        // if (keys[38]) {
        //     myCharacter.speedY += -speed;
        // } else if (myCharacter.speedY < 0) {
        //     myCharacter.speedY += inertia;
        // }
        // if (keys[40]) {
        //     myCharacter.speedY += speed;
        // } else if (myCharacter.speedY > 0) {
        //     myCharacter.speedY -= inertia;
        // }
        if (keys[32] && bulletTrue) {
            bullets.push(new bullet(10, 25, "green", myCharacter.x, myCharacter.y, "player"));
            bulletTrue = false;
            setTimeout(() => {
                bulletTrue = true;
            }, 300)
        }
    }



    for (i = 0; i < bullets.length; i += 1) {
        bullets[i].y += -bulletSpeed;
        bullets[i].update();
        bullets[i].hit(myEnemies)
        if (bullets[i].y < 0) bullets.splice(i, 1);
    }
    if (myEnemies.length > 0) {
        myEnemies[myEnemies.length - 1].wallCrash();
        myEnemies[0].wallCrash();
        for (i = 0; i < myEnemies.length; i += 1) {
            myEnemies[i].update();
            myEnemies[i].newPos();

        }
    }

    myCharacter.newPos();
    myCharacter.update();


}

function moveY() {
    for (i = 0; i < myEnemies.length; i += 1) {
            myEnemies[i].y += 10;
        }
}
function enemyBullet(){
    var rng = (Math.floor(Math.random()) * 11)
    bullets.push(new bullet(10, 25, "red", myEnemies[rng].x, myEnemies[rng].y, "player"));

    for (i = 0; i < bullets.length; i += 1) {
        bullets[i].y += bulletSpeed;
        bullets[i].update();
        bullets[i].playerHithit()
        if (bullets[i].y > 0) bullets.splice(i, 1);
    }
}
function everyinterval(n) {
    if ((myGameArea.frameNo / n) % 1 == 0) { return true; }
    return false;
}
function leftWall() {
    myCharacter.x = 0;
}
function rightWall() {
    myCharacter.x = myGameArea.canvas.width - myCharacter.width;
}
function topWall() {
    myCharacter.y = 0;
}
function bottomWall() {
    myCharacter.y = (myGameArea.canvas.height - myCharacter.height);
}