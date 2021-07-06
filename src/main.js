// TO DO:
// - fix game over event

let config = {
    type: Phaser.CANVAS,
    width: 480,
    height: 800,
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
    scene: [Menu, Play, GameOver, Credits]
}

let game = new Phaser.Game(config);

//set UI sizes
let borderUISize = game.config.height / 100;
let borderPadding = borderUISize / 3;

//reserve global variables
let keyLEFT, keyRIGHT, keyUP, keyDOWN, keySPACE, keyBACKSPACE;
let player = null;
const playerVelocity = 150;
let tsunamiEvent = false;
let tsunamiDelay = false;
let score;
let highScore;
let newHighScore = false;

// create config for the timer text
let timerConfig = {
    fontFamily: 'Verdana',
    fontSize: '32px',
    backgroundColor: '#FFDB70',
    color: '#FF751F',
    align: 'center',
    padding: {
      top: 5,
      bottom: 5,
    },
}