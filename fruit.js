let game, basket, accelerometer;
let width = window.innerWidth;
let height = window.innerHeight;
let friction = 2;
let bg;
let lastDroppedFruit = 0, nextDroppedFruit = 0, minDropTime = 1000, maxDropTime = 4000;
let active_fruits = [];

let FruitTypes = {
    APPLE: 0,
    CHERRY: 1,
    BANANA: 2,
    ORANGE: 3,
    PEACH: 4,
    attributes: {
        0: {file: "apple.png", value: 1},
        1: {file: "apple.png", value: 2},
        2: {file: "apple.png", value: 2},
        3: {file: "apple.png", value: 3},
        4: {file: "apple.png", value: 3},
    }
}

// A $( document ).ready() block.
$( document ).ready(function() {
    game = new Scene();
    game.setSize(900, 1600);
    basket = new Sprite(game, "basket.png", 300, 300);
    basket.setPosition(game.width/2, game.height-basket.height/2);
    basket.setBoundAction(STOP);
    basket.setDX(0);
    bg = new Background();
    accelerometer = new Accel();
    game.canvas.getContext("2d").imageSmoothingEnabled= false;
    game.start();
});

function update() {
    if(Date.now() > lastDroppedFruit + nextDroppedFruit ) {
        let randomType = Math.floor(Math.random() * 5);
        let newFruit = new Fruit(randomType);
        active_fruits.push(newFruit);
        lastDroppedFruit = Date.now();
        nextDroppedFruit = minDropTime + (maxDropTime - minDropTime)*Math.random();
    }
    game.clear();
    let dx = basket.dx;
    dx -= 5*accelerometer.getAX();
    if(dx > 0) dx -= friction;
    else if(dx < 0) dx += friction;

    if(Math.abs(dx) < 0.5) {
        dx = 0;
    }
    basket.setDX(dx);
    bg.update();
    basket.update();
    active_fruits.forEach(function(fruit) {
        let dy = fruit.dy + 1;
        fruit.setDY(dy);
        fruit.update();
    })
}

function Fruit(type) {
    let fruit = new Sprite(game, FruitTypes.attributes[type].file, 100, 100);
    fruit.setPosition(Math.random()*game.width, 50);
    fruit.setDX(0);
    fruit.setBoundAction(STOP);
    fruit.setDY(0);
    return fruit;
}

function Basket() {

}

function Background() {
    let bg = new Sprite(game, "background.png", game.width, game.height);
    bg.setPosition(game.width/2, game.height/2);
    bg.setDX(0);
    bg.setDY(0);
    return bg;
}