var myCharacter;
var myImage;
var myEnemies = [];
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
        this.canvas.width = 1080;
        this.canvas.height = 720;
        this.canvas.style.borderColor = "black"
        this.canvas.classList.add("mx-auto")
        this.context = this.canvas.getContext("2d");
        
        myCharacter = new component(40, 40, "red", this.canvas.width, this.canvas.height);
        myEnemies.push(new enemy(50, 50, "blue", this.canvas.width,this.canvas.height, 3, 1));
        document.getElementById("box").appendChild(this.canvas);
        this.frameNo = 0;
        this.interval = setInterval(updateGameArea, 20);
        window.addEventListener('keydown', function (e) {
            if (e.code === 'Space' && bulletTrue) {
                bullets.push(new bullet(10, 25, "green", myCharacter.x, myCharacter.y));
                bulletTrue = false;
                var time = this.setTimeout(() => {
                    bulletTrue = true;

                }, 300)
            }
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
    this.y = y - 30;
    this.update = function () {
        ctx = myGameArea.context;
        ctx.fillStyle = color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
    this.hit = function(index, enemyArray){
        var bulletTop = bullets[index].y + (this.height);
        
    }
}
function enemy(width, height, color, x, y, health, damage){
    this.width = width;
    this.height = height;
    this.x = (x / 2 - width / 1.5);
    this.y = y / 2  ;
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
        ctx.drawImage(image, this.x, this.y, this.width, this.height)
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
        var myleft = this.x;
        var myright = this.x + (this.width);
        var mytop = this.y;
        var mybottom = this.y + (this.height);

        var wallleft = 0;
        var wallright = myGameArea.canvas.width;
        var walltop = 0;
        var wallbottom = myGameArea.canvas.height;

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

    myCharacter.wallCrash()

    

    myGameArea.clear();

    if (myGameArea.keys && myGameArea.keys[37]) {
        myCharacter.speedX += -speed;
    } else if (myCharacter.speedX < 0) {
        myCharacter.speedX += inertia;
    }
    if (myGameArea.keys && myGameArea.keys[39]) {
        myCharacter.speedX += speed;
    } else if (myCharacter.speedX > 0) {
        myCharacter.speedX -= inertia;
    }
    if (myGameArea.keys && myGameArea.keys[38]) {
        myCharacter.speedY += -speed;
    } else if (myCharacter.speedY < 0) {
        myCharacter.speedY += inertia;
    }
    if (myGameArea.keys && myGameArea.keys[40]) {
        myCharacter.speedY += speed;
    } else if (myCharacter.speedY > 0) {
        myCharacter.speedY -= inertia;
        
    }

    for (i = 0; i < bullets.length; i += 1) {
        bullets[i].y += -bulletSpeed;
        bullets[i].update();
        bullet.hit(i, myEnemies);
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