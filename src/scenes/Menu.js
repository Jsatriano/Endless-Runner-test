class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene");
    }

    preload() {
        this.load.audio("sfx_select", "./assets/sfx/select.wav");
        this.load.audio("sfx_hit", "./assets/sfx/waves.wav");
        this.load.audio("sfx_death", "./assets/sfx/death.wav");
        this.load.audio("sfx_music", "./assets/sfx/music.mp3");
        this.load.image('menu', './assets/Background/StartScreen/game_start.png');
    }

    create() {
        // loads menu image
        this.menu = this.add.tileSprite(0, 0, 480, 800, 'menu').setOrigin(0,0);

        // create keybinds
        keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        keyC = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.C);

        // play screen borders
        this.add.rectangle(0, 0, game.config.width, borderUISize, 0xfd6600).setOrigin(0, 0);
        this.add.rectangle(0, game.config.height - borderUISize, game.config.width, borderUISize, 0xfd6600).setOrigin(0, 0);
        this.add.rectangle(0, 0, borderUISize, game.config.height, 0xfd6600).setOrigin(0, 0);
        this.add.rectangle(game.config.width - borderUISize, 0, borderUISize, game.config.height, 0xfd6600).setOrigin(0, 0);
    }


    update() {
        if(Phaser.Input.Keyboard.JustDown(keySPACE)) {
            this.sound.play('sfx_select');
            this.scene.start('playScene');
        }
        
        if(Phaser.Input.Keyboard.JustDown(keyC)) {
            this.sound.play('sfx_select');
            this.scene.start('creditsScene');
        }
    }
}