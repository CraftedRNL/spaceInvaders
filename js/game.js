var myCharacter;
var myObstacles = [];
var bullets = [];
var inertia = .15;
var speed = .25;
var bulletSpeed = 5;
var bulletTrue = true;
function startGame() {
    myGameArea.start();
    // myObstacle = new component(10, 200, "green", 300, 120);
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
        document.getElementById("box").appendChild(this.canvas);
        this.frameNo = 0;
        this.interval = setInterval(updateGameArea, 20);
        window.addEventListener('keydown', function (e) {

            myGameArea.keys = (myGameArea.keys || []);
            myGameArea.keys[e.keyCode] = true;
        })
        window.addEventListener('keyup', function (e) {
            myGameArea.keys[e.keyCode] = false;

            if (e.code === 'Space' && bulletTrue ) {
                
                bullets.push(new bullet(10, 25, "green", myCharacter.x, myCharacter.y));
                bulletTrue = false;
                var time = this.setTimeout(()=>{
                    bulletTrue = true;
                    
                },300)
            }
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
    this.crashWith = function (otherobj) {
        var myleft = this.x + 5;
        var myright = this.x + (this.width) - 5;
        var mytop = this.y + 5;
        var mybottom = this.y + (this.height) - 5;
        var otherleft = otherobj.x;
        var otherright = otherobj.x + (otherobj.width);
        var othertop = otherobj.y;
        var otherbottom = otherobj.y + (otherobj.height);
        var crash = true;
        if ((mybottom < othertop) ||
            (mytop > otherbottom) ||
            (myright < otherleft) ||
            (myleft > otherright)) {
            crash = false;
        }
        return crash;
    }

}

function updateGameArea() {





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
        if (bullets[i].y < 0) bullets.splice(i, 1);
    }

    myCharacter.newPos();
    myCharacter.update();


}
function everyinterval(n) {
    if ((myGameArea.frameNo / n) % 1 == 0) { return true; }
    return false;
}
