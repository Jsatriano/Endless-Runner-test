// TO DO:
// - increasing speed as game goes on
// - polish collisions (low prio)
// - fix x-axis spawn location to always fit in frame
// - make tsunami event
// - fix game over event

let config = {
    type: Phaser.CANVAS,
    width: 480,
    height: 640,
    scale: {
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {
                x: 0,
                y: 0
            }
        }
    },
    scene: [Menu, Play]
}

let game = new Phaser.Game(config);

//set UI sizes
let borderUISize = game.config.height / 100;
let borderPadding = borderUISize / 3;

//reserve keyboard variables
let keyLEFT, keyRIGHT, keyUP, keyDOWN;
let player = null;
const playerVelocity = 150;