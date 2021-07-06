class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    preload() {
        // preload all assets that will be used
        this.load.spritesheet("phoenix", "./assets/Phoenix_anim.png", {frameWidth: 80, frameHeight: 72, startFrame: 0, endFrame: 4 });
        this.load.image("ob", "./assets/Obstacles/obstacleLong.png");
        this.load.image("monster", "./assets/water_monster.png");
        this.load.image('water', './assets/Background/Background.png');
        this.load.image('fish', './assets/Background/Fish.png');
        this.load.image('waves', './assets/Background/Waves.png');
        this.load.image('particle', './assets/spark.png');
    }

    create() {
        // reset varibles needed when replaying
        this.obstacleSpeed = 250;
        this.obstacleSpeedMax = 550;
        this.bounceSpeed = 7;
        tsunamiEvent = false;
        tsunamiDelay = false;
        score = 0;

        // create animation sequence for phoenix
        this.anims.create({
            key: 'phoenixMove',
            frames: this.anims.generateFrameNumbers('phoenix', { start: 0, end: 4, first: 0}),
            frameRate: 8,
            loop: true
        });

        this.add.sprite(game.config.width / 2, game.config.height / 2, 'water');
        this.fish = this.add.tileSprite(0, 0, 480, 800, 'fish').setOrigin(0, 0);
        this.waves = this.add.tileSprite(0, 0, 480, 800, 'waves').setOrigin(0, 0);
        // add keybinds
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        keyUP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        keyDOWN = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
        
        //create player
        player = this.physics.add.sprite(game.config.width / 2 - 32, game.config.height - (borderUISize + 250), 'phoenix').setOrigin(0, 0);
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
        this.waterMonster = new Monster(this, 0, game.config.height - (borderUISize + 32), "monster").setOrigin(0, 0.5);
        this.waterMonster.depth = 1;
        
        // variable for the in game clock
        this.initialTime = 0;

        // adds a clock to the game and updates it every second --- credit: Hazim Awad ---
        this.textTimer = this.add.text(borderUISize + borderPadding, borderUISize + borderPadding, this.formatTime(this.initialTime), timerConfig);
        this.timer = this.time.addEvent({delay: 1000, callback: this.onEvent, callbackScope: this, loop: true});
        this.textTimer.depth = 1;
        
        // play borders
        this.rec1 = this.add.rectangle(0, 0, game.config.width, borderUISize, 0x446BC5).setOrigin(0, 0);
        this.rec2 = this.add.rectangle(0, game.config.height - borderUISize, game.config.width, borderUISize, 0x446BC5).setOrigin(0, 0);
        this.rec3 = this.add.rectangle(0, 0, borderUISize, game.config.height, 0x446BC5).setOrigin(0, 0);
        this.rec4 = this.add.rectangle(game.config.width - borderUISize, 0, borderUISize, game.config.height, 0x446BC5).setOrigin(0, 0);
        // increase the depth of the borders so they always appear above other game objects
        this.rec1.depth = 2;
        this.rec2.depth = 2;
        this.rec3.depth = 2;
        this.rec4.depth = 2;

        // increases difficulty of the game over time
        this.difficultyTimer = this.time.addEvent({
            delay: 15000,
            callback: this.difficultyIncrease,
            callbackScope: this,
            loop: true
        });

        // triggers a tsunami event once every minute
        this.tsunamiTimer = this.time.addEvent({
            delay: 60000,
            callback: this.tsunamiTrigger,
            callbackScope: this,
            loop: true
        });

        // create text for tsunami event 
        this.tsunamiText = this.add.text(game.config.width / 2, game.config.height / 2 - 64, 'TSUNAMI', timerConfig). setOrigin(0.5);
        this.warningText = this.add.text(game.config.width / 2, game.config.height / 2, 'WARNING', timerConfig). setOrigin(0.5);
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
        // move the tile sprites
        this.waves.tilePositionY -= 0.5;
        this.fish.tilePositionY -= 1;

        // game over if the player touches the wall of death!
        if(this.collisionCheck(player, this.waterMonster)) {
            this.playerDeath();
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

        // play the phoenix animation
        if(Phaser.Input.Keyboard.JustDown(keyLEFT) || Phaser.Input.Keyboard.JustDown(keyRIGHT)
           || Phaser.Input.Keyboard.JustDown(keyUP) || Phaser.Input.Keyboard.JustDown(keyDOWN)) {
            player.anims.play('phoenixMove');
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
        this.sound.play('sfx_hit', {volume: 0.3});
    }

    // simple collision check logic
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

    // updates the in game clock every second --- credit: Hazim Awad ---
    onEvent () {
        if(!this.gameOver) {
            this.initialTime += 1;
            score += 1;
            this.textTimer.setText(this.formatTime(this.initialTime));
        }
    }

    // makes the obstacles faster --- credit: Hazim Awad ---
    difficultyIncrease() {
        if(this.obstacleSpeed <= this.obstacleSpeedMax) {
            this.obstacleSpeed += 50;
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
            
        this.time.delayedCall(8000, () => {    //turns tsunami event off and allows regular obstacle spawning to continue
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

    playerDeath() {
        this.cameras.main.shake(10, 0.0075);    // shake the camera!
        this.sound.play('sfx_death');
        //add a particle emmiter that triggers on death
        let sparks = this.add.particles('particle');    
        let emitter = sparks.createEmitter();

        emitter.setPosition(player.x + 32, player.y + 32);
        emitter.setSpeed(50);
        emitter.setScale(0.7);
        emitter.setLifespan(800);
        //emitter.maxParticles = 1;
        player.setPosition(-100, -100)
        player.destroy();
            
        this.gameOver = true;
        this.time.delayedCall(2000, () => { this.scene.start('gameoverScene'); });
    }
}