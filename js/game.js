var myCharacter;
var myImage;
var myEnemies = [];
var eWidth = 50;
var eHeight = 50;
var stageOne = ["."]
// var stageOne = [[".", ".", ".", ".", ".", ".", ".", ".", ".", ".", "."]];
var stageTwo = [[".", ".", ".", ".", ".", ".", ".", ".", ".", ".", "."], [".", ".", ".", ".", ".", ".", ".", ".", ".", ".", "."]];
var stageThree = [[".", ".", ".", ".", ".", ".", ".", ".", ".", ".", "."], [".", ".", ".", ".", ".", ".", ".", ".", ".", ".", "."], [".", ".", ".", ".", ".", ".", ".", ".", ".", ".", "."]];

var playerBullets = [];
var enemyBullets = [];
var inertia = .15;
var speed = .25;
var bulletSpeed = 5;
var bulletTrue = true;
var eDirection = -1;
var eInterval = 3000;
var ebullet = 500;
var shootingFrequency = 1000;
var image = document.getElementById("ship");
var score = 0;
var currentLevel = 1;
var maxLevel = 3;
var levelTransition = false;
var gameRunning = true;

function startGame() {
    myGameArea.stop();
    gameRunning = true;
    currentLevel = 1;
    score = 0;
    myGameArea.start();
}

var myGameArea = {
    canvas: document.createElement("canvas"),
    start: function () {
        gameRunning = true;
        this.canvas.width = 1120;
        this.canvas.height = 700;
        this.canvas.style.borderColor = "black";
        this.canvas.classList.add("mx-auto");
        this.context = this.canvas.getContext("2d");
        myCharacter = new component(40, 40, "red", this.canvas.width, this.canvas.height, 3);

        loadLevel(currentLevel);

        document.getElementById("box").appendChild(this.canvas);
        this.frameNo = 0;
        this.interval = setInterval(updateGameArea, 20);
        this.enemyBulletInterval = setInterval(enemyBullet, shootingFrequency);
        window.addEventListener('keydown', function (e) {
            myGameArea.keys = (myGameArea.keys || []);
            myGameArea.keys[e.keyCode] = true;
        });

        window.addEventListener('keyup', function (e) {
            myGameArea.keys[e.keyCode] = false;
        });
    },
    clear: function () {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    stop: function () {
        clearInterval(this.interval);
        clearInterval(this.enemyBulletInterval);
        gameRunning = false;
    }
};

function loadLevel(level) {
    myEnemies = [];
    var stageData;
    var enemyColor = "blue";
    var enemyHealth = 2;
    var enemySpeed = 1;

    if (level === 1) {
        stageData = stageOne;
        enemyColor = "blue";
        enemyHealth = 1;
        enemySpeed = 1;
        eDirection = -1;
        if (myCharacter) {
            myCharacter.health = 3;
        }
    } else if (level === 2) {
        stageData = stageTwo;
        enemyColor = "orange";
        enemyHealth = 2;
        enemySpeed = 2;
        eDirection = -1;
        if (myCharacter) {
            myCharacter.health = 3;
        }
    } else if (level === 3) {
        stageData = stageThree;
        enemyColor = "purple";
        enemyHealth = 3;
        enemySpeed = 2;
        eDirection = -1;
        if (myCharacter) {
            myCharacter.health = 2;
        }
    }

    for (let i = 0; i < stageData.length; i++) {
        myEnemies[i] = [];
        var position = 0;
        for (let j = 0; j < stageData[i].length; j++) {
            myEnemies[i][j] = new enemy(eWidth, eHeight, enemyColor, myGameArea.canvas.width / 12 - eWidth / 2 + position, 10 + (i * eHeight * 1.5), enemyHealth, 1, enemySpeed);
            position += (myGameArea.canvas.width / 12);
        }
    }
}

function checkLevelComplete() {
        if (currentLevel < maxLevel) {
            levelTransition = true;
            currentLevel++;
            playerBullets = [];
            enemyBullets = [];
            shootingFrequency = (1000 * Math.pow(currentLevel, -1)).toFixed(2);
            showLevelTransition();
        } else if (currentLevel === maxLevel) {
            myGameArea.stop();
            alert("YOU WIN! Final Score: " + score + "\nPress OK to play again!");
            resetGame();
        }
}

function showLevelTransition() {
    myGameArea.stop();
    alert("Level " + currentLevel + "!\nGet ready!");
    myGameArea.start();
}

function resetGame() {
    playerBullets = [];
    enemyBullets = [];
    score = 0;
    currentLevel = 1;
    shootingFrequency = 1000;
    bulletTrue = true;
    gameRunning = true;
    myGameArea.start();
}

function bullet(width, height, color, x, y, who) {
    this.width = width;
    this.height = height;
    this.x = x + width / 2 + width;
    this.y = y - 30;
    this.who = who;

    this.update = function () {
        ctx = myGameArea.context;
        ctx.fillStyle = color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    };

    this.hit = function (enemyArray) {
        const bulletTop = this.y;
        const bulletBottom = this.y + this.height;
        const bulletLeft = this.x;
        const bulletRight = this.x + this.width;

        for (let row = 0; row < enemyArray.length; row++) {
            for (let col = 0; col < enemyArray[row].length; col++) {
                var enemy = enemyArray[row][col];
                if (bulletRight > enemy.x &&
                    bulletLeft < enemy.x + enemy.width &&
                    bulletBottom > enemy.y &&
                    bulletTop < enemy.y + enemy.height) {

                    if (enemy.health === 1) {
                        enemyArray[row].splice(col, 1);
                        score += 10;
                        
                        if (enemyArray[row].length === 0) {
                            enemyArray.splice(row, 1);
                            if(enemyArray.length ===0){
                                checkLevelComplete()
                            }
                        }
                        return true;
                    } else {
                        enemy.health--;
                        score += 5;
                    }
                    return true;
                }
            }
        }
        return false;
    };

    this.playerHit = function () {
        const bulletTop = this.y;
        const bulletBottom = this.y + this.height;
        const bulletLeft = this.x;
        const bulletRight = this.x + this.width;

        if (bulletRight > myCharacter.x &&
            bulletLeft < myCharacter.x + myCharacter.width &&
            bulletBottom > myCharacter.y &&
            bulletTop < myCharacter.y + myCharacter.height) {

            if (myCharacter.health === 1) {
                myGameArea.stop();
                alert("GAME OVER! Score: " + score + "\nPress OK to play again!");
                resetGame();
            } else {
                myCharacter.health--;
            }
            return true;
        }
        return false;
    };

}

function enemy(width, height, color, x, y, health, damage, moveSpeed) {
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.health = health;
    this.damage = damage;
    this.speedX = 0;
    this.speedY = 0;
    this.moveSpeed = moveSpeed;

    this.update = function () {
        ctx = myGameArea.context;
        ctx.fillStyle = color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    };
    this.newPos = function () {
        this.x += 1 * eDirection * moveSpeed;
    };
    this.wallCrash = function () {
        const farthest = this.x + this.width;
        const closest = this.x;
        const wallleft = 0;
        const wallright = myGameArea.canvas.width;

        if (wallleft >= closest) {
            eDirection = 1;
            moveY();
        }
        if (wallright <= farthest) {
            eDirection = -1;
            moveY();
        }
    };
}

function component(width, height, color, x, y, health) {
    this.width = width;
    this.height = height;
    this.x = (x / 2 - width / 1.5);
    this.y = y - height * 2;
    this.health = health;
    this.speedX = 0;
    this.speedY = 0;

    this.update = function () {
        ctx = myGameArea.context;
        ctx.fillStyle = color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.drawImage(image, this.x, this.y, this.width, this.height);
        document.getElementById("score").innerHTML = score;
        document.getElementById("health").innerHTML = this.health;
        document.getElementById("level").innerHTML = currentLevel;

    };

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
    };

    this.wallCrash = function () {
        const myleft = this.x;
        const myright = this.x + this.width;
        const mytop = this.y;
        const mybottom = this.y + this.height;

        const wallleft = 0;
        const wallright = myGameArea.canvas.width;
        const walltop = 0;
        const wallbottom = myGameArea.canvas.height;

        if (walltop >= mytop) {
            topWall();
        }
        if (wallbottom <= mybottom) {
            bottomWall();
        }
        if (wallleft >= myleft) {
            leftWall();
        }
        if (wallright <= myright) {
            rightWall();
        }
    };
}

function updateGameArea() {
    if (!gameRunning) return;

    myGameArea.clear();
    var keys = myGameArea.keys;
    myCharacter.wallCrash();

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
        if (keys[32] && bulletTrue) {
            playerBullets.push(new bullet(10, 25, "green", myCharacter.x, myCharacter.y, "player"));
            // bulletTrue = false;
            // setTimeout(function () {
            //     bulletTrue = true;
            // }, 300);
        }
    }

    for (var i = 0; i < playerBullets.length; i++) {
        playerBullets[i].y += -bulletSpeed;
        playerBullets[i].update();
        var hitResult = playerBullets[i].hit(myEnemies);
        if (hitResult) {
            playerBullets.splice(i, 1);
            // bulletTrue = true;
            i--;
        } else if (playerBullets[i].y + playerBullets[i].height < 0) {
            playerBullets.splice(i, 1);
            // bulletTrue = true;
            i--;
        }
    }

    for (var i = 0; i < enemyBullets.length; i++) {
        enemyBullets[i].y += bulletSpeed;
        enemyBullets[i].update();
        var hitResult = enemyBullets[i].playerHit();
        if (hitResult) {
            enemyBullets.splice(i, 1);
            i--;
        } else if (enemyBullets[i].y > myGameArea.canvas.height) {
            enemyBullets.splice(i, 1);
            i--;
        }
    }

    if (myEnemies.length > 0) {
        for (var i = 0; i < myEnemies.length; i++) {
            if (myEnemies[i].length > 0) {
                myEnemies[i][myEnemies[i].length - 1].wallCrash();
                myEnemies[i][0].wallCrash();
            }
        }

        for (var i = 0; i < myEnemies.length; i++) {
            for (var j = 0; j < myEnemies[i].length; j++) {
                myEnemies[i][j].update();
                myEnemies[i][j].newPos();
            }
        }

    }

    myCharacter.newPos();
    myCharacter.update();

    myGameArea.frameNo++;
}

function moveY() {
    for (var i = 0; i < myEnemies.length; i++) {
        for (var j = 0; j < myEnemies[i].length; j++) {
            myEnemies[i][j].y += 10;
        }
    }
}

function enemyBullet() {
    if (!gameRunning) return;

    if (myEnemies.length > 0) {
        console.log(shootingFrequency)
        // clearInterval(myGameArea.enemyBulletInterval);
        // myGameArea.enemyBulletInterval = setInterval(enemyBullet, shootingFrequency);

        var rng = Math.floor(Math.random() * myEnemies.length);
        if (myEnemies[rng] && myEnemies[rng].length > 0) {
            var yRng = Math.floor(Math.random() * myEnemies[rng].length);
            enemyBullets.push(new bullet(10, 25, "red", myEnemies[rng][yRng].x, myEnemies[rng][yRng].y + myEnemies[rng][yRng].height * 2, "enemy"));
        }
    }
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
    myCharacter.y = myGameArea.canvas.height - myCharacter.height;
}