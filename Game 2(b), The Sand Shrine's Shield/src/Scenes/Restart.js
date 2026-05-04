class Restart extends Phaser.Scene {
    constructor() {
        super("restartScene");
    }

    preload() {
    }

    create() {
        this.SpaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.add.text(this.sys.game.config.width / 2, this.sys.game.config.height / 2, "Game Over", {
            fontFamily: 'Times, serif',
            fontSize: 48,
            color: '#ffffff'
        }).setOrigin(0.5);
        
        this.add.text(this.sys.game.config.width / 2, this.sys.game.config.height / 2 + 35, "Score: " + my.sprite.score, {
            fontFamily: 'Times, serif',
            fontSize: 24,
            color: '#ffffff'
        }).setOrigin(0.5);


        this.add.text(this.sys.game.config.width / 2, this.sys.game.config.height / 2 + 60, "Press SPACE to restart", {
            fontFamily: 'Times, serif',
            fontSize: 24,
            color: '#ffffff'
        }).setOrigin(0.5);

    }

    update() {
        if (this.SpaceKey.isDown) {
            this.scene.start("levelScene");
        }
    }
}
