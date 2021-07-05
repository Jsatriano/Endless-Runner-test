class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene");
    }

    preload() {
        this.load.audio("sfx_select", "./assets/sfx/select.wav");
        this.load.audio("sfx_hit", "./assets/sfx/hit.wav");
        this.load.audio("sfx_death", "./assets/sfx/death.wav");
    }

    create() {
        keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    }


    update() {
        if(Phaser.Input.Keyboard.JustDown(keySPACE)) {
            this.sound.play('sfx_select');
            this.scene.start('playScene');
        }
        
    }
}