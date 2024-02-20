//variables
let inputDirection = {x: 0, y: 0};
let currentDirection = {x: 0, y: 0};
let snakeBody = [
    {x: 13, y: 15}  
];
let foodBlock = {x: 9, y:7};
let gameStatus = 0;
let speed = 4
document.querySelector("#level").addEventListener('input', function(){
    speed = document.querySelector("#level").value;
});
let prevTime = 0;
let currentScore = 0;
let highScore = 0;


//sounds
let muteStatus = 0;
const beginSound = new Audio('./sounds/begin.mp3');
const eatSound = new Audio('./sounds/eat.mp3');
const gameOverSound = new Audio('./sounds/over.mp3');
const moveSound = new Audio('./sounds/move.mp3');


document.querySelector(".muteButton").addEventListener('click', function(){
    if(muteStatus===0){
        muteStatus=1;
        this.classList.remove("fa-volume-low");
        this.classList.add("fa-volume-off");
        muted();
    }
    else{
        muteStatus=0;
        this.classList.remove("fa-volume-off");
        this.classList.add("fa-volume-low");
    }
});

function muted(){
    beginSound.pause();
    eatSound.pause();
    gameOverSound.pause();
    moveSound.pause();
}


// //Pause Play button
function paused(){
    
    document.querySelector("#board").focus();

    if(gameStatus===1){
        gameStatus = 0;
        document.querySelector('#board').innerHTML="<div class='banner'><p>Paused ! Press any key to continue.</p><p>Tip : Use spacebar to pause & play.</p></div>";
        document.querySelector('#board');
    }
    else{
        if(inputDirection.x===0 && inputDirection.y===0)
            inputDirection = {x: 1, y: 0};
        gameStatus=1;
        document.querySelector('#board');
    }
    runGame(); 
}


//Logics

function runGame(ctime){

    // speed control
    window.requestAnimationFrame(runGame);

    if(!isGameOn() || ctime - prevTime < 1000/speed)
        return;
    if(muteStatus===0)
        moveSound.play();
    prevTime = ctime;
    boardLogic();
}

//Random locations for food
function generateRandom() {
    foodBlock.x = Math.floor(Math.random() * 30) + 1;
    foodBlock.y = Math.floor(Math.random() * 20) + 1;
    for(let i=0; i<snakeBody.length; i++){
        if(foodBlock.x===snakeBody[i].x && foodBlock.y===snakeBody[i].y)
            return generateRandom();
    }
}


function updateScore(){
    currentScore += (speed*10);
    document.querySelector("#currentScore").innerText = currentScore;
}


function boardLogic(){

    if((currentDirection.x===1 && inputDirection.x===-1) || (currentDirection.x===-1 && inputDirection.x===1) || (currentDirection.y===-1 && inputDirection.y===1) || (currentDirection.y===1 && inputDirection.y===-1)){
        inputDirection = currentDirection;
    }

    currentDirection.x = inputDirection.x;
    currentDirection.y = inputDirection.y;
    
    for(let i=1; i<snakeBody.length; i++){
        if(snakeBody[0].x + inputDirection.x === snakeBody[i].x && snakeBody[0].y + inputDirection.y === snakeBody[i].y){
            gameOver();
            return;
        }
    }

    //Move snake
    if(snakeBody[0].x + inputDirection.x < 31 && snakeBody[0].y + inputDirection.y < 21 && snakeBody[0].x + inputDirection.x > 0 && snakeBody[0].y + inputDirection.y > 0){
        snakeBody.unshift({x: snakeBody[0].x + inputDirection.x , y: snakeBody[0].y + inputDirection.y});
        
        //successful eat
        if(snakeBody[0].x === foodBlock.x && snakeBody[0].y === foodBlock.y){
            generateRandom();
            updateScore();
            if(muteStatus===0){
                eatSound.play();
            }
        }
        else
            snakeBody.pop();
    }
    else{
        gameOver();
        return;
    }

 
    //Display snake on board
    board.innerHTML="";
    snakeBody.forEach((e, index)=>{
        snakeDiv = document.createElement('div');
        snakeDiv.style.gridRowStart = e.y;
        snakeDiv.style.gridColumnStart = e.x;
        if(index===0)
            snakeDiv.classList.add('head');
        else
            snakeDiv.classList.add('tail');
        document.getElementById('board').appendChild(snakeDiv);
    })

    //Display food
    foodDiv = document.createElement('div');
    foodDiv.style.gridRowStart = foodBlock.y;
    foodDiv.style.gridColumnStart = foodBlock.x;
    foodDiv.classList.add('food');
    document.getElementById('board').appendChild(foodDiv);
}



function gameOver(){
    if(muteStatus===0)
        gameOverSound.play();
    if(currentScore>highScore){
        highScore = currentScore;
        document.querySelector('#board').innerHTML="<div class='banner'><p>New High Score ! You are AwEsOmE.</p></div>";
        document.querySelector("#highestScore").innerText = highScore;
    }
    else{
        document.querySelector('#board').innerHTML="<div class='banner'><p>Game Over ! Press any key to try again.</p></div>";
    }

    currentScore = 0;
    document.querySelector("#currentScore").innerText = currentScore;
    snakeBody = [
        {x: 13, y: 15}  
    ];
    gameStatus=0;
}


window.addEventListener('keydown', e=>{
    if(inputDirection.x===0 && inputDirection.y===0)
        inputDirection = {x: 1, y: 0};

    switch(e.key){
        case ' ':
            paused();
            break;

        case 'ArrowUp':
            gameStatus = 1; 
            inputDirection = {x: 0, y: -1};
            break;

        case 'ArrowDown':
            gameStatus = 1; 
            inputDirection = {x: 0, y: 1};
            break;

        case 'ArrowLeft': 
            gameStatus = 1;
            inputDirection = {x: -1, y: 0};
            break;

        case 'ArrowRight':
            gameStatus = 1; 
            inputDirection = {x: 1, y: 0};
            break;

        default : 
            gameStatus = 1;
            break;
    }
});




function isGameOn(){
    if(gameStatus===1){
        beginSound.pause();
        document.querySelector("#speed").style.display = "none";
        document.querySelector("#pauseButton").value = "Pause"
        return true;
    }
    else{
        if(muteStatus===0)
            beginSound.play();
        document.querySelector("#speed").style.display = "block";
        document.querySelector("#pauseButton").value = "Play"
        return false;
    }
}

document.querySelector("#pauseButton").addEventListener("click", paused);
window.requestAnimationFrame(runGame);

