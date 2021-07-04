class Obstacle extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, velocity) {
        super(scene, Phaser.Math.Between(40, game.config.width - 32), 0 - borderUISize * 2, 'ob');    //change x and y parameters later

        // add to the scene
        scene.add.existing(this);
        // add physics
        scene.physics.add.existing(this);
        // make it move
        this.setVelocityY(velocity);
        this.setImmovable();
        // to control obstacle spawning
        this.newObstacle = true;
    }

    update() {
        // once a barrier reaches a certain point, spawn a new one
        if(!tsunamiDelay) {
            if(this.newObstacle && this.y > game.config.height / 2) {
                this.newObstacle = false;
                this.scene.addObstacle(this.parent, this.velocity);
            }
        }
        if(tsunamiEvent) {
            if(this.newObstacle && this.y > game.config.height / 5) {
                this.newObstacle = false;
                this.scene.addObstacle(this.parent, this.velocity);
            }
        }
        // destroy obstacle once off screen
        if(this.y > game.config.height + this.height) {
            this.destroy();
        }
    }
}