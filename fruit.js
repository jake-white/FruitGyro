//fruit.js
//pretty much all the game code is here

let game, basket, scoreDisplay, gameover, accelerometer, ctx;
let width = window.innerWidth;
let height = window.innerHeight;
let friction = 3;
let bg;
let nextDroppedFruit = 0, minDropTime = 0.3, maxDropTime = 3.1, increaseDifficulty = 15;
let active_fruits = [];
let fruit_timer, difficulty_timer;
let score = 0, best = 0;
let acorns = 0;
let paused = false, gameovered = false;

let FruitTypes = {
    APPLE: 0,
    CHERRY: 1,
    BANANA: 2,
    ORANGE: 3,
    PEACH: 4,
    ACORN: 5,
    attributes: {
        0: {file: "assets/apple.png", value: 1},
        1: {file: "assets/cherry.png", value: 2},
        2: {file: "assets/banana.png", value: 2},
        3: {file: "assets/orange.png", value: 3},
        4: {file: "assets/peach.png", value: 3},
        5: {file: "assets/acorn.png", value: 0},
    }
}

$( document ).ready(function() {
    best = localStorage.getItem('best');
    if(best == null) best = 0;
    game = new Scene();
    game.setSize(900, 1600);
    basket = new Sprite(game, "assets/basket.png", 400, 400);
    basket.setPosition(game.width/2, game.height-basket.height/2);
    basket.setBoundAction(STOP);
    basket.setDX(0);
    scoreDisplay = new Sprite(game, "assets/score.png", 400, 400);
    scoreDisplay.setPosition(game.width - 200, 200);
    scoreDisplay.setDX(0);
    gameover = new Sprite(game, "assets/gameover.png", 500, 500);
    gameover.setPosition(game.width/2, game.height/2);
    gameover.setDX(0);
    gameover.hide();
    bg = new Background();
    accelerometer = new Accel();
    ctx = game.canvas.getContext("2d");
    ctx.imageSmoothingEnabled= false;
    ctx.font = "50px Arial";
    ctx.textAlign = "center";
    ctx.fillStyle = "white";
    fruit_timer = new Timer();
    fruit_timer.reset();
    difficulty_timer = new Timer();
    difficulty_timer.reset();
    game.canvas.addEventListener("click", tap, false);
    window.onfocus = play;
    window.onblur = pause;
    game.start();
});

function update() {
    if(fruit_timer.getElapsedTime() > nextDroppedFruit && !paused && !gameovered) {
        let fruitChance = Math.random();
        let randomType = 0;
        if(fruitChance <=  0.3) {
            randomType = FruitTypes.ACORN;
        }
        else { 
            randomType = Math.floor(Math.random() * 5);
        }
        let newFruit = new Fruit(randomType);
        active_fruits.push(newFruit);
        nextDroppedFruit = minDropTime + (maxDropTime - minDropTime)*Math.random();
        fruit_timer.reset();
    }
    if(difficulty_timer.getElapsedTime() > increaseDifficulty && maxDropTime > 0.5 && !paused && !gameovered) {
        maxDropTime -= 0.5;
        difficulty_timer.reset();
    }
    game.clear();
    let dx = basket.dx;
    dx -= 2*accelerometer.getAX();
    dx = checkKeys(dx);
    if(dx > 0) dx -= friction;
    else if(dx < 0) dx += friction;
    basket.setDX(dx);
    bg.update();
    basket.update();
    for(let i = 0; i < active_fruits.length; ++i) {
        active_fruits[i].update();
        let dy = active_fruits[i].dy + 1;
        active_fruits[i].setDY(dy);
        if(active_fruits[i].distanceTo(basket) < active_fruits[i].width*0.9) {
            //collided
            active_fruits[i].hide();
            if(active_fruits[i].type == FruitTypes.ACORN) {
                acorns++;
                checkGameState();
            }
            document.getElementById('pickup').play();
            score+=FruitTypes.attributes[active_fruits[i].type].value;
            active_fruits.splice(i, 1);
        }
    }
    scoreDisplay.update();
    gameover.update();
    ctx.fillText(acorns, 730, 80);
    ctx.fillText(score, 730, 195);
    ctx.fillText(best, 730, 315);
}

function Fruit(type) {
    let fruit = new Sprite(game, FruitTypes.attributes[type].file, 100, 100);
    fruit.type = type;
    if(fruit.type == FruitTypes.ACORN) {
        fruit.width = 170;
        fruit.height = 170;
    }
    fruit.setPosition(Math.random()*game.width, 50);
    fruit.setDX(0);
    fruit.setBoundAction(DIE);
    fruit.setDY(0);
    return fruit;
}

function tap() {
    if(gameovered) {
        acorns = 0;
        score = 0;
        minDropTime = 0.5;
        maxDropTime = 3.1;
        gameovered = false;
        gameover.hide();
    }
}

function checkKeys(dx) {    
    if (keysDown[K_LEFT]){
        dx -= 6;
    }
    if (keysDown[K_RIGHT]){
        dx += 6;
    }
    console.log(dx);
    return dx;
}

function pause() {
    paused = true;
}

function play() {
    paused = false;
}

function checkGameState() {
    if(acorns >= 3) {
        if(score > best) {
            best = score;
            localStorage.setItem('best', best);
        }
        gameovered = true;
        gameover.show();
    }
}

function Basket() {

}

function Background() {
    let bg = new Sprite(game, "assets/background.png", game.width, game.height);
    bg.setPosition(game.width/2, game.height/2);
    bg.setDX(0);
    bg.setDY(0);
    return bg;
}