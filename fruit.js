let game, game, basket, accelerometer;

// A $( document ).ready() block.
$( document ).ready(function() {
    game = new Scene();
    basket = new Sprite(game, "basket.png", 0, 0);
    accelerometer = new Accel();
    game.start();
});

function update() {
    game.clear();
    let dx = accelerometer.getAX();
    dx*=5;
    basket.setDX(dx);
    basket.update();
}