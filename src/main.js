//*********************************************************************************
// Justin Satriano, Hazim Awad, Melissa Liu
// Completed: 7/5/2021 
//
//                              PHOENIX WAVE
//
// Creative tilt
// -------------
// Our game has an interesting mechanic involved that allows the player
// to make mistakes throughout their runs. Hitting Obstacles does not instantly kill the
// player. It only knocks them back a distance. The way the player dies is if they collide
// with the sea monster at the bottom of the screen!
// 
// We also implemented a tsunami event that occurs every 1 minute. This event rapidly increases
// the spawn rate of the obstacles for a short amount of time.
//
// There was a ton of new programming knowledge we used from examples outside of class. Random
// generation of game objects was new, use of physics objects was new, implementing a high score
// tracker was new, implementing a game over and credit screen was new, and a ton of other aspects
// of the game I am forgetting to mention!
//
// The visual style we chose for this game is pixel art. We went with a blue and orange color
// palette because we wanted a contrast between the player character (orange phoenix) and the 
// "enemy" objects (blue water monster and obstacles). The title screen is very full of shades of
// orange, but after playing the game and dying, the theme becomes very blue. 
//
// We tried a birds eye view form of a endless runner with a slightly different death condition.
// Rather than hitting an obstacle and instantly losing, players are possibly able to recover from 
// their mistakes. Allowing for slightly more forgiving gameplay, which allows a more risky playstyle!

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
let keyLEFT, keyRIGHT, keyUP, keyDOWN, keySPACE, keyBACKSPACE, keyC;
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
    backgroundColor: '#fecc98',
    color: '#fd7f00',
    align: 'center',
    padding: {
      top: 5,
      bottom: 5,
    },
}