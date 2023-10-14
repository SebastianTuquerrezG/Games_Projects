//****** GAME LOOP ********//

var time = new Date();
var deltaTime = 0;

if(document.readyState === "complete" || document.readyState === "interactive"){
    setTimeout(Init, 1);
}else{
    document.addEventListener("DOMContentLoaded", Init); 
}

function Init() {
    time = new Date();
    Start();
    Loop();
}

function Loop() {
    deltaTime = (new Date() - time) / 1000;
    time = new Date();
    Update();
    requestAnimationFrame(Loop);
}

//****** GAME LOGIC ********//

var floorY = 22;
var velY = 0;
var impulse = 900;
var gravity = 2500;

var dinoPosX = 42;
var dinoPosY = floorY; 

var floorX = 0;
var velScenery = 1280/3;
var gameVel = 1;
var score = 0;

var stopped = false;
var jumping = false;

var timeToObstacle = 2;
var timeObstacleMin = 0.7;
var timeObstacleMax = 1.8;
var obstaclePosY = 16;
var obstacles = [];

var timeToClouds = 0.5;
var timeCloudMin = 0.7;
var timeCloudMax = 2.7;
var maxCloudY = 270;
var minCloudY = 100;
var clouds = [];
var velCloud = 0.5;

var container;
var dino;
var textoScore;
var floor;
var gameOver;

function Start() {
    gameOver = document.querySelector(".game-over");
    floor = document.querySelector(".floor");
    container = document.querySelector(".container");
    textoScore = document.querySelector(".score");
    dino = document.querySelector(".dino");
    document.addEventListener("keydown", HandleKeyDown);
}

function Update() {
    if(stopped) return;
    
    MoveDinosaur();
    MoveFloor();
    DecideMakeObstacles();
    DecideMakeClouds();
    MoveObstacles();
    MoveClouds();
    DetectCollision();

    velY -= gravity * deltaTime;
}

function HandleKeyDown(ev){
    if(ev.keyCode == 32){
        Jump();
    }
}

function Jump(){
    if(dinoPosY === floorY){
        jumping = true;
        velY = impulse;
        dino.classList.remove("dino-run");
    }
}

function MoveDinosaur() {
    dinoPosY += velY * deltaTime;
    if(dinoPosY < floorY){
        
        TouchFloor();
    }
    dino.style.bottom = dinoPosY+"px";
}

function TouchFloor() {
    dinoPosY = floorY;
    velY = 0;
    if(jumping){
        dino.classList.add("dino-run");
    }
    jumping = false;
}

function MoveFloor() {
    floorX += CalculateDisplacement();
    floor.style.left = -(floorX % container.clientWidth) + "px";
}

function CalculateDisplacement() {
    return velScenery * deltaTime * gameVel;
}

function Crash() {
    dino.classList.remove("dino-run");
    dino.classList.add("dino-crash");
    stopped = true;
}

function DecideMakeObstacles() {
    timeToObstacle -= deltaTime;
    if(timeToObstacle <= 0) {
        MakeObstacle();
    }
}

function DecideMakeClouds() {
    timeToClouds -= deltaTime;
    if(timeToClouds <= 0) {
        MakeCloud();
    }
}

function MakeObstacle() {
    var obstacle = document.createElement("div");
    container.appendChild(obstacle);
    obstacle.classList.add("cactus");
    if(Math.random() > 0.5) obstacle.classList.add("cactus2");
    obstacle.posX = container.clientWidth;
    obstacle.style.left = container.clientWidth+"px";

    obstacles.push(obstacle);
    timeToObstacle = timeObstacleMin + Math.random() * (timeObstacleMax-timeObstacleMin) / gameVel;
}

function MakeCloud() {
    var cloud = document.createElement("div");
    container.appendChild(cloud);
    cloud.classList.add("cloud");
    cloud.posX = container.clientWidth;
    cloud.style.left = container.clientWidth+"px";
    cloud.style.bottom = minCloudY + Math.random() * (maxCloudY-minCloudY)+"px";
    
    clouds.push(cloud);
    timeToClouds = timeCloudMin + Math.random() * (timeCloudMax-timeCloudMin) / gameVel;
}

function MoveObstacles() {
    for (var i = obstacles.length - 1; i >= 0; i--) {
        if(obstacles[i].posX < -obstacles[i].clientWidth) {
            obstacles[i].parentNode.removeChild(obstacles[i]);
            obstacles.splice(i, 1);
            WinPoints();
        }else{
            obstacles[i].posX -= CalculateDisplacement();
            obstacles[i].style.left = obstacles[i].posX+"px";
        }
    }
}

function MoveClouds() {
    for (var i = clouds.length - 1; i >= 0; i--) {
        if(clouds[i].posX < -clouds[i].clientWidth) {
            clouds[i].parentNode.removeChild(clouds[i]);
            clouds.splice(i, 1);
        }else{
            clouds[i].posX -= CalculateDisplacement() * velCloud;
            clouds[i].style.left = clouds[i].posX+"px";
        }
    }
}

function WinPoints() {
    score++;
    textoScore.innerText = score;
    if(score == 5){
        gameVel = 1.5;
        container.classList.add("noon");
    }else if(score == 10) {
        gameVel = 2;
        container.classList.add("tarde");
    } else if(score == 20) {
        gameVel = 3;
        container.classList.add("night");
    }
    floor.style.animationDuration = (3/gameVel)+"s";
}

function GameOver() {
    Crash();
    gameOver.style.display = "block";
}

function DetectCollision() {
    for (var i = 0; i < obstacles.length; i++) {
        if(obstacles[i].posX > dinoPosX + dino.clientWidth) {
            //EVADE
            break;
        }else{
            if(IsCollision(dino, obstacles[i], 10, 30, 15, 20)) {
                GameOver();
            }
        }
    }
}

function IsCollision(a, b, paddingTop, paddingRight, paddingBottom, paddingLeft) {
    var aRect = a.getBoundingClientRect();
    var bRect = b.getBoundingClientRect();

    return !(
        ((aRect.top + aRect.height - paddingBottom) < (bRect.top)) ||
        (aRect.top + paddingTop > (bRect.top + bRect.height)) ||
        ((aRect.left + aRect.width - paddingRight) < bRect.left) ||
        (aRect.left + paddingLeft > (bRect.left + bRect.width))
    );
}