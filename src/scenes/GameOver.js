class GameOver extends Phaser.Scene {
    constructor() {
        super("gameoverScene");
    }

    create() {
        let menuConfig = {
            fontFamily: 'Verdana',
            fontSize: '32px',
            backgroundColor: '#5AB1BB',
            color: '#4E6766',
            align: 'center',
            padding: {
              top: 5,
              bottom: 5,
            },
        }
        // check for high score in local storage 
        if(localStorage.getItem('hiscore') != null) {
            let storedScore = parseInt(localStorage.getItem('hiscore'));
             // see if current score is higher than stored score
             if(score > storedScore) {
                localStorage.setItem('hiscore', score.toString());
                highScore = score;
                newHighScore = true;
            } else {
                highScore = parseInt(localStorage.getItem('hiscore'));
                newHighScore = false;
            }     
        } else {
            // no high score stored, create a new one
            highScore = score;
            localStorage.setItem('hiscore', highScore.toString());
            newHighScore = true;
        }

        this.add.text(game.config.width / 2, game.config.height / 2, `Highscore: ${highScore}`, menuConfig).setOrigin(0.5);
        this.add.text(game.config.width / 2, game.config.height / 2 + 64, `Score: ${score}`, menuConfig).setOrigin(0.5);

        // play borders
        this.add.rectangle(0, 0, game.config.width, borderUISize, 0x446BC5).setOrigin(0, 0);
        this.add.rectangle(0, game.config.height - borderUISize, game.config.width, borderUISize, 0x446BC5).setOrigin(0, 0);
        this.add.rectangle(0, 0, borderUISize, game.config.height, 0x446BC5).setOrigin(0, 0);
        this.add.rectangle(game.config.width - borderUISize, 0, borderUISize, game.config.height, 0x446BC5).setOrigin(0, 0);
    }
}