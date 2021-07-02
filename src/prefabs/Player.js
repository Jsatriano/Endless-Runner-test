class Player extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);

        // add to the scene
        scene.add.existing(this);
        // how fast the player moves (pixels per frame)
        this.moveSpeed = 1.5;
        // check if the player is hitting an obstacle
        this.bounce = false;
    }

    update() {

        // left and right player movement
        if(keyLEFT.isDown && this.x >= borderUISize + this.width) {
            this.x -= this.moveSpeed; 
        } else if(keyRIGHT.isDown && this.x <= game.config.width - (borderUISize + this.width)) {
            this.x += this.moveSpeed;
        }
        // up and down player movement
        if(!this.bounce) {
            if(keyUP.isDown && this.y >= borderUISize + borderPadding) {
                this.y -= this.moveSpeed;

            }else if(keyDOWN.isDown && this.y <= game.config.height - (borderUISize + this.height)) {
                this.y += this.moveSpeed;
            } 
        }

        // bounce the player back
        if(this.bounce) {
            this.y += this.moveSpeed * 2;
        }
    }
}