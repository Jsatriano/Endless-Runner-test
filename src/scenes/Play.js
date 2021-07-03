class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    preload() {
        this.load.image("phoenix", "./assets/Phoenix.png");
        this.load.image("ob", "./assets/test-ob.png");
        this.load.image("flames", "./assets/test-flames.png");
    }

    create() {
        this.obstacleSpeed = 250;
        this.obstacleSpeedMax = 550;
        this.bounceSpeed = 5;

        // add keybinds
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        keyUP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        keyDOWN = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
        
        //create player
        player = this.physics.add.sprite(32, game.config.width / 2, "phoenix").setOrigin(0, 0);
        player.setCollideWorldBounds(true);
        player.setBounce(0.5);
        player.setImmovable();
        player.setMaxVelocity(300, 300);
        player.setDragX(700);
        player.setDragY(700);
        player.destroyed = false;
        player.bounce = false;

        //set up obstacle group
        this.obstacleGroup = this.add.group({
            runChildUpdate: true
        });

        // create first obstacle
        this.time.delayedCall(1000, () => {
            this.addObstacle();
        });

        // create flame wall
        this.flameWall = new Flames(this, 0, game.config.height - (borderUISize + borderPadding), "flames").setOrigin(0, 0.5);

        // variable for the in game clock
        this.initialTime = 0;

        // adds a clock to the game and updates it every second
        this.textTimer = this.add.text(borderUISize + borderPadding, borderUISize + borderPadding, this.formatTime(this.initialTime), timerConfig);
        this.timer = this.time.addEvent({delay: 1000, callback: this.onEvent, callbackScope: this, loop: true});
        
        // play borders
        this.add.rectangle(0, 0, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(0, game.config.height - borderUISize, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(0, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(game.config.width - borderUISize, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0);

        // increases difficulty of the game over time
        this.difficultyTimer = this.time.addEvent({
            delay: 15000,
            callback: this.difficultyIncrease,
            callbackScope: this,
            loop: true
        });

        // triggers a tsunami event once every minute
        this.tsunamiTimer = this.time.addEvent({
            delay: 100000,
            callback: this.tsunamiTrigger,
            callbackScope: this,
            loop: true
        });

        // create text for tsunami event
        this.tsunamiText = this.add.text(game.config.width / 2, game.config.height / 2, 'TSUNAMI', timerConfig). setOrigin(0.5);
        this.warningText = this.add.text(game.config.width / 2, game.config.height / 2 + 64, 'WARNING', timerConfig). setOrigin(0.5);
        this.textFlicker();
        
        // game over flag (when true, game ends)
        this.gameOver = false;
    }

     // create obstacles and add them to obstacle group
     addObstacle() {
        if(!this.gameOver) {
            let speedVariance = Phaser.Math.Between(0, 75);
            let obstacle = new Obstacle(this, this.obstacleSpeed + speedVariance);
            this.obstacleGroup.add(obstacle);
        }
    }

    update(){
        let overText = {
            fontFamily: 'Verdana',
            fontSize: '32px',
            backgroundColor: '#5AB1BB',
            color: '#4E6766',
            align: 'center',
            padding: {
              top: 5,
              bottom: 5,
            },
            fixedWidth: 275
        }
        // if game over then do stuff (!!!  WOULD BE BETTER TO CREATE A GAME OVER SCENE  !!!)
        if(this.gameOver) {
            this.add.text(game.config.width / 2, game.config.height / 2, 'GAME OVER', overText). setOrigin(0.5); 
        }

        // game over if the player touches the wall of death!
        if(this.collisionCheck(player, this.flameWall)) {
            this.gameOver = true;
        }


        // constantly updates objects every frame
        if(!this.gameOver) {
            if(keyLEFT.isDown) {
                player.body.velocity.x -= playerVelocity; 
            } else if(keyRIGHT.isDown) {
                player.body.velocity.x += playerVelocity;
            }
            // up and down player movement
            if(!player.bounce) {
                if(keyUP.isDown) {
                    player.body.velocity.y -= playerVelocity;
        
                }else if(keyDOWN.isDown) {
                    player.body.velocity.y += playerVelocity;
                }
            }
            // set up collisions between player and obstacles 
            this.physics.world.collide(player, this.obstacleGroup, this.playerCollision, null, this); 
        } 

        // triggers if the player collides with an obstacle (bounces player back)
        if(player.bounce) {
            player.y += this.bounceSpeed;
            this.bounceDistance = this.time.delayedCall(300, () => {
                player.bounce = false;
            });
        }
        
    }

    // if player hits an obstacle, sets bounce = true to trigger bounce in update() func
    playerCollision() {
        player.bounce = true;
    }

    collisionCheck(player, object) {
        if(player.x < object.x + object.width &&
            player.x + player.width > object.x &&
            player.y < object.y + object.height &&
            player.height + player.y > object.y) {
                return true;
        }
        return false;
    }

    // generates a random number between min and max
    randomNumGen(min, max) {
        return Math.round(Math.random() * (max - min + 1)) + min;
    }

    // formats time in minutes and seconds
    formatTime(seconds) {
        this.minutes = Math.floor(seconds/60);
        this.partInSeconds = seconds%60;
        this.partInSeconds = this.partInSeconds.toString().padStart(2,'0');
        return `${this.minutes}:${this.partInSeconds}`;
    }

    // updates the in game clock every second
    onEvent () {
        if(!this.gameOver) {
            this.initialTime += 1;
            this.textTimer.setText(this.formatTime(this.initialTime));
        }
    }

    // makes the obstacles faster
    difficultyIncrease() {
        if(this.obstacleSpeed <= this.obstacleSpeedMax) {
            this.obstacleSpeed += 75;
        }
    }

    // triggers the tsunami event
    tsunamiTrigger() {
        // stops obstacles from spawning
        tsunamiDelay = true;
        // flickers tsunami warning text on screen
        this.time.delayedCall(1000, () => {
            this.textFlicker();
        });
        this.time.delayedCall(2000, () => {
            this.textFlicker();
        });
        this.time.delayedCall(3000, () => {
            this.textFlicker();
        });
        this.time.delayedCall(4000, () => {
            this.textFlicker();
            this.addObstacle();
            tsunamiEvent = true;    // turns tsunami event on after 4 sec delay
        });
        
        this.time.delayedCall(10000, () => {    //turns tsunami event off and allows regular obstacle spawning to continue
            tsunamiEvent = false;
            tsunamiDelay = false;
        });
    }

    // turns text on or off depending on its current alpha
    textFlicker() {
        if(this.tsunamiText.alpha == 1 && this.warningText.alpha == 1) {
            this.tsunamiText.alpha = 0;
            this.warningText.alpha = 0;
        } else {
            this.tsunamiText.alpha = 1;
            this.warningText.alpha = 1;
        }
    }
}