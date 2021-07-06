class Credits extends Phaser.Scene {
    constructor() {
        super("creditsScene");
    }

    create() {
        // new config for credit text
        let boldConfig = {
            fontFamily: 'Verdana',
            fontSize: '32px',
            color: '#fd7f00',
            align: 'center',
            padding: {
              top: 5,
              bottom: 5,
            },
        }
        let smallConfig = {
            fontFamily: 'Verdana',
            fontSize: '26px',
            color: '#fd7f00',
            align: 'center',
            padding: {
              top: 5,
              bottom: 5,
            },
        }

        // create keybinds
        keyC = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.C);
        
        // create background
        this.add.rectangle(0, 0, game.config.width, game.config.height, 0xfecc98).setOrigin(0, 0);

        // add all the text that is shown on screen
        this.add.text(game.config.width / 2, game.config.height / 2 - 250, "Credits", boldConfig).setOrigin(0.5);
        this.add.text(game.config.width / 2, game.config.height / 2 - 110, "Artwork", boldConfig).setOrigin(0.5);
        this.add.text(game.config.width / 2, game.config.height / 2 - 80, "Hazim Awad / Melissa Liu", smallConfig).setOrigin(0.5);
        this.add.text(game.config.width / 2, game.config.height / 2 - 15, "Coding", boldConfig).setOrigin(0.5)
        this.add.text(game.config.width / 2, game.config.height / 2 + 15, "Justin Satriano", smallConfig).setOrigin(0.5);
        this.add.text(game.config.width / 2, game.config.height / 2 + 80, "Design / Sound Design", boldConfig).setOrigin(0.5)
        this.add.text(game.config.width / 2, game.config.height / 2 + 110, "Hazim Awad / Melissa Liu", smallConfig).setOrigin(0.5);
        this.add.text((borderUISize + borderPadding) * 8, game.config.height  - ((borderUISize + borderPadding) * 3) , "Return (C)", smallConfig).setOrigin(0.5);

        // play screen borders
        this.add.rectangle(0, 0, game.config.width, borderUISize, 0xfd6600).setOrigin(0, 0);
        this.add.rectangle(0, game.config.height - borderUISize, game.config.width, borderUISize, 0xfd6600).setOrigin(0, 0);
        this.add.rectangle(0, 0, borderUISize, game.config.height, 0xfd6600).setOrigin(0, 0);
        this.add.rectangle(game.config.width - borderUISize, 0, borderUISize, game.config.height, 0xfd6600).setOrigin(0, 0);
    
    }

    update() {
        if(Phaser.Input.Keyboard.JustDown(keyC)) {
            this.sound.play('sfx_select');
            this.scene.start('menuScene');
        }
    }
}