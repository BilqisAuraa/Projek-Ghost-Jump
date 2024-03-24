//board
let board;
let boardWidth = 1200;
let boardHeight = 750;
let context;

//poci
let pociWidth = 180;
let pociHeight = 100;
let pociX = boardWidth/2 - pociWidth/2;
let pociY = boardHeight*7/8 - pociHeight;
let pociRightImg;
let pociLeftImg;

let poci = {
    img : null,
    x : pociX,
    y : pociY,
    width : pociWidth,
    height : pociHeight
}

//physics
let velocityX = 0; 
let velocityY = 0; //poci jump speed
let initialVelocityY = -8; //starting velocity Y
let gravity = 0.4;

//platforms
let platformArray = [];
let platformWidth = 150;
let platformHeight = 100;
let platformImg;

let score = 0;
let HighScore = 0;
/*let gameOver = false;*/

window.onload = function() {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d"); //used for drawing on the board

    //load images
    pociRightImg = new Image();
    pociRightImg.src = "PociRight.png";
    poci.img = pociRightImg;
    pociRightImg.onload = function() {
        context.drawImage(poci.img, poci.x, poci.y, poci.width, poci.height);
    }

    pociLeftImg = new Image();
    pociLeftImg.src = "PociLeft.png";

    platformImg = new Image();
    platformImg.src = "Platform.png";

    velocityY = initialVelocityY;
    placePlatforms();
    requestAnimationFrame(update);
    document.addEventListener("keydown", movepoci);
}

function update() {
    requestAnimationFrame(update);
    /*if (gameOver) {
        return;
    }
    context.clearRect(0, 0, board.width, board.height);

    //poci
    poci.x += velocityX;
    if (poci.x > boardWidth) {
        poci.x = 0;
    }
    else if (poci.x + poci.width < 0) {
        poci.x = boardWidth;
    }

    velocityY += gravity;
    poci.y += velocityY;
    if (poci.y > board.height) {
        gameOver = true;
    }
    context.drawImage(poci.img, poci.x, poci.y, poci.width, poci.height);

    //platforms
    for (let i = 0; i < platformArray.length; i++) {
        let platform = platformArray[i];
        if (velocityY < 0 && poci.y < boardHeight*3/4) {
            platform.y -= initialVelocityY; //slide platform down
        }
        if (detectCollision(poci, platform) && velocityY >= 0) {
            velocityY = initialVelocityY; //jump
        }
        context.drawImage(platform.img, platform.x, platform.y, platform.width, platform.height);
    }

    // clear platforms and add new platform
    while (platformArray.length > 0 && platformArray[0].y >= boardHeight) {
        platformArray.shift(); //removes first element from the array
        newPlatform(); //replace with new platform on top
    }

    //score
    updateScore();
    context.fillStyle = "white";
    context.textAlign = ""
    context.font = "30px Times New Roman";
    context.fillText(`Score: ${Math.round(score)}`, boardWidth / 10, 50);
}

function movepoci(e) {
    if (e.code == "ArrowRight" || e.code == "KeyD") { //gerak right
        velocityX = 4;
        poci.img = pociRightImg;
    }
    else if (e.code == "ArrowLeft" || e.code == "KeyA") { //gerak left
        velocityX = -4;
        poci.img = pociLeftImg;
    }
    document.getElementById("retry").addEventListener('click', function() {
        hideEndMenu();
        resetGame();
        placePlatforms();
    });
    /*else if (e.code == "Space" && gameOver) {
        //reset
        poci = {
            img : pociRightImg,
            x : pociX,
            y : pociY,
            width : pociWidth,
            height : pociHeight
        }

        velocityX = 0;
        velocityY = initialVelocityY;
        score = 0;
        maxScore = 0;
        gameOver = false;
        placePlatforms();
    }*/
}


function placePlatforms() {
    platformArray = [];

    //start platforms
    let platform = {
        img : platformImg,
        x : boardWidth/2,
        y : boardHeight - 50,
        width : platformWidth,
        height : platformHeight
    }

    platformArray.push(platform);

    for (let i = 0; i < 6; i++) {
        let randomX = Math.floor(Math.random() * boardWidth*3/4); //(0-1) * boardWidth*3/4
        let platform = {
            img : platformImg,
            x : randomX,
            y : boardHeight - 90*i - 200,
            width : platformWidth,
            height : platformHeight
        }
    
        platformArray.push(platform);
    }
}

function newPlatform() {
    let randomX = Math.floor(Math.random() * boardWidth*3/4); //(0-1) * boardWidth*3/4
    let platform = {
        img : platformImg,
        x : randomX,
        y : -platformHeight,
        width : platformWidth,
        height : platformHeight
    }

    platformArray.push(platform);
}

function detectCollision(a, b) {
    return a.x < b.x + b.width &&   //a's top left corner doesn't reach b's top right corner
           a.x + a.width > b.x &&   //a's top right corner passes b's top left corner
           a.y < b.y + b.height &&  //a's top left corner doesn't reach b's bottom left corner
           a.y + a.height > b.y;    //a's bottom left corner passes b's top left corner
}

function updateScore() {
    let points = Math.floor(50*Math.random()); //(0-1) *50 --> (0-50)
    if (velocityY < 0) { //negative going up
        maxScore += points;
        if (score < maxScore) {
            score = maxScore;
        }
    }
    else if (velocityY >= 0) {
        maxScore -= points;
    }
}

function ShowEndMenu() {
    document.getElementById('end-game').style.display = 'block';
    document.getElementById('end-game-score').innerHTML = score;

    if(highScore < score) {
        highScore = score;
    }

    document.getElementById('high-score').innerHTML = highScore;

}

function HideEndMenu() {
    document.getElementById('end-game').style.display = 'none';
}