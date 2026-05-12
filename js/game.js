var myCharacter;
function startGame() {
    myGameArea.start();
    
}
var myGameArea = {
    canvas : document.createElement("canvas"),
    start : function(){
        this.canvas.width = 1080;
        this.canvas.height = 720;
        this.canvas.style.borderColor = "black"
        this.canvas.classList.add("mx-auto")
        this.context = this.canvas.getContext("2d");
        myCharacter = new component(40, 40, "red", this.canvas.width, this.canvas.height);
        document.getElementById("box").appendChild(this.canvas);
        this.interval = setInterval(updateGameArea, 20);
        window.addEventListener('keydown', function(e){
            myGameArea.keys = (myGameArea.keys || []);
            myGameArea.keys[e.keyCode] = true;
        })
        window.addEventListener('keyup', function(e){
            myGameArea.keys[e.keyCode] = false;
        })

    },
    clear : function(){
        this.context.clearRect(0,0, this.canvas.width, this.canvas.height)
    }
    
}

function component(width, height, color, x, y) {
    this.width = width;
    this.height = height;
    this.x = x/2 - width/1.5;
    this.y = y/2*1.5 - height;    
    this.speedX = 0;
    this.speedY = 0;

    this.update = function(){
        ctx = myGameArea.context;
        ctx.fillStyle = color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
    this.newPos = function(){
        this.x += this.speedX;
        this.y += this.speedY;
    }
    
}

function updateGameArea(){
    myGameArea.clear();
    // myCharacter.x++;
    myCharacter.speedY = 0;
    myCharacter.speedX = 0;
    if (myGameArea.keys && myGameArea.keys[37]) {myCharacter.speedX = -5; }
    if (myGameArea.keys && myGameArea.keys[39]) {myCharacter.speedX = 5; }
    if (myGameArea.keys && myGameArea.keys[38]) {myCharacter.speedY = -5; }
    if (myGameArea.keys && myGameArea.keys[40]) {myCharacter.speedY = 5; }
    

    myCharacter.newPos();
    myCharacter.update();
    
}

// function up(){
//     myCharacter.speedY -=1;
// }
// function down(){
//     myCharacter.speedY +=1;
// }
// function left(){
//     myCharacter.speedX -=1;
// }
// function right(){
//     myCharacter.speedX +=1;
// }

// function stopMove(){
    // myCharacter.speedY = 0;
    // myCharacter.speedX = 0;
// }