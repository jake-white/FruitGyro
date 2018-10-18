let game, basket, accelerometer;
let width = window.innerWidth;
let height = window.innerHeight;
let basketAccel = 0;

// A $( document ).ready() block.
$( document ).ready(function() {
    game = new Scene();
    game.setSize(900, 1600);
    basket = new Sprite(game, "basket.png", 300, 300);
    basket.setPosition(game.width/2, game.height-basket.height);
    accelerometer = new Accel();
    game.canvas.getContext("2d").imageSmoothingEnabled= false;
    game.start();
});

function update() {
    game.clear();
    basketAccel-= 5*accelerometer.getAX();
    basket.setDX(basketAccel);
    basket.update();
}

function Fruit() {
    
}