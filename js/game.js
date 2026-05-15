var myCharacter;
var myImage;
var myEnemies = [];
var eWidth = 50;
var eHeight = 50;
var stageOne = [".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", "."]
var position = 0;
var bullets = [];
var inertia = .15;
var speed = .25;
var bulletSpeed = 5;
var bulletTrue = true;

var image = document.getElementById("ship");
function startGame() {
    myGameArea.start();
}
var myGameArea = {
    canvas: document.createElement("canvas"),
    start: function () {

        this.canvas.width = document.getElementById("box").clientWidth;
        this.canvas.height = document.getElementById("box").clientHeight;
        this.canvas.style.borderColor = "black"
        this.canvas.classList.add("mx-auto")
        this.context = this.canvas.getContext("2d");

        myCharacter = new component(40, 40, "red", this.canvas.width, this.canvas.height);
        for (let i = 0; i < stageOne.length; i++) {
            
            myEnemies.push(new enemy(eWidth, eHeight, "blue", this.canvas.width/8 + position , 50, 3, 1));
            position +=  (this.canvas.width/12 +eWidth);
            console.log( this.canvas.width/12)
        }

        document.getElementById("box").appendChild(this.canvas);
        this.frameNo = 0;
        this.interval = setInterval(updateGameArea, 20);
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
function bullet(width, height, color, x, y) {
    this.width = width;
    this.height = height;
    this.x = x + width / 2 + width;
    console.log(this.x)
    this.y = y - 30;
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
                enemyArray.splice(index, 1);
                bullets.splice(i, 1)
                return true;
            }
        });
    };
}
function enemy(width, height, color, x, y, health, damage) {
    this.width = width;
    this.height = height;
    this.x = (x / 2 - width / 1.5);
    this.y = y / 2;
    this.health = health;
    this.damage = damage;
    this.speedX = 0;
    this.speedY = 0;
    this.update = function () {
        ctx = myGameArea.context;

        ctx.fillStyle = color;
        ctx.fillRect(this.x, this.y, this.width, this.height);

    }

}

function component(width, height, color, x, y) {
    this.width = width;
    this.height = height;
    this.x = (x / 2 - width / 1.5);
    this.y = y / 2 * 1.5 - height;
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
        if (keys[38]) {
            myCharacter.speedY += -speed;
        } else if (myCharacter.speedY < 0) {
            myCharacter.speedY += inertia;
        }
        if (keys[40]) {
            myCharacter.speedY += speed;
        } else if (myCharacter.speedY > 0) {
            myCharacter.speedY -= inertia;
        }
        if (keys[32] && bulletTrue) {
            bullets.push(new bullet(10, 25, "green", myCharacter.x, myCharacter.y));
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
    for (i = 0; i < myEnemies.length; i += 1) {
        myEnemies[i].update();
    }
    myCharacter.newPos();
    myCharacter.update();


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