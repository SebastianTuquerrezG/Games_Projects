var time = new Date();
var deltaTime = 0;

if(document.readyState === "complete" || document.readyState === "interactive"){
    setTimeout(Init, 1);
} else{
    document.addEventListener("DOMContentLoaded", Init)
}

function Init(){
    time = new Date();
    Start()
    Loop()
}

function Loop(){
    deltaTime = (new Date() - time)/1000;
    time = new Date();
    update();
    requestAnimationFrame(Loop);
}

var floorY = 22;
var valY = 0;
var impulse = 900;
var gravity = 2500;

var dinoPosX = 45;
var dinoPosY = floorY;

var floorX = 0;
var velEscenary = 1280/3;
var gameVel = 1;
var score = 0;

var stop = false;
var jump = false;

var dino, container, textScore, floor, gameOver;

function Start(){
    gameOver = document.querySelector(".game-over");
    floor = document.querySelector(".floor");
    container = document.querySelector(".container");
    textScore = document.querySelector(".score");
    dino = document.querySelector(".dino");
    document.addEventListener("keydown", HandleKeyDown);
}

function HandleKeyDown(ev){
    if(ev.KeyCode == 32){
        Saltar();
    }
}

function Saltar(){
    if(dinoPosY == floorY){
        jump = true;
        valY = impulse;
        dino.classList.remove("dino-run")
    }
}

function update(){
    moveFloor();
    moveDinosaur();
}

function moveFloor(){
    floorX += calculateDesplazement();
    floor.style.left = -(floorX % container.clientWidth) + "px";
}

function calculateDesplazement(){
    return velEscenary * deltaTime * gameVel;
}

function moveDinosaur(){
    dinoPosY  += gameVel * deltaTime;
    if(dinoPosY < floorY){
        touchFloor();
    }
    dino.style.bottom = dinoPosY + "px";
}

function touchFloor(){
    dinoPosY = floorY;
    velY = 0;
    if(jump){
        dino.classList.add("dino-run");
    }
    jump = false;
}