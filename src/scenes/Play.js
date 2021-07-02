class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    preload() {
        this.load.image("car", "./assets/test-car.png");
        this.load.image("ob", "./assets/test-ob.png");
        this.load.image("flames", "./assets/test-flames.png");
    }

    create() {
        this.obstacleSpeed = 250;
        this.bounceSpeed = 3;

        // add keybinds
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        keyUP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        keyDOWN = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
        
        //create player
        player = this.physics.add.sprite(32, game.config.width / 2, 'car').setOrigin(0, 0);
        player.setCollideWorldBounds(true);
        player.setBounce(0.5);
        player.setImmovable();
        player.setMaxVelocity(250, 250);
        player.setDragX(700);
        player.setDragY(700);
        player.destroyed = false;

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

        // play borders
        this.add.rectangle(0, 0, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(0, game.config.height - borderUISize, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(0, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(game.config.width - borderUISize, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0);
        
        // game over flag (when true, game ends)
        this.gameOver = false;
        this.physics.add.collider("car", "ob");
    }

     // create obstacles and add them to obstacle group
     addObstacle() {
        let speedVariance = Phaser.Math.Between(0, 100);
        let obstacle = new Obstacle(this, this.obstacleSpeed + speedVariance);
        
        this.obstacleGroup.add(obstacle);
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


        // constantly updates objects every frame
        if(!this.gameOver) {
            if(keyLEFT.isDown) {
                player.body.velocity.x -= playerVelocity; 
            } else if(keyRIGHT.isDown) {
                player.body.velocity.x += playerVelocity;
            }
            // up and down player movement
            if(keyUP.isDown) {
                player.body.velocity.y -= playerVelocity;
    
            }else if(keyDOWN.isDown) {
                player.body.velocity.y += playerVelocity;
            }
            this.physics.world.collide(player, this.obstacleGroup, this.playerCollision, null, this); 
        } 
    }

    playerCollision() {
        player.bounce = true;
        player.y += this.bounceSpeed;
        this.add.text(game.config.width / 2, game.config.height / 2, 'GAME OVER', overText). setOrigin(0.5);
        if(player.bounce) {
            
            
            this.bounceDistance = this.time.delayedCall(200, () => {
                player.bounce = false;
            });
        }
    }
    // function that checks if player is touching another object
    // collisionCheck(player, object) {
    //     if(player.x < object.x + object.width &&
    //         player.x + player.width > object.x &&
    //         player.y < object.y + object.height &&
    //         player.height + player.y > object.y) {
    //             return true;
    //     }
    //     return false;
    // }

    // generates a random number between min and max
    randomNumGen(min, max) {
        return Math.round(Math.random() * (max - min + 1)) + min;
    }
}