class MouseSmiley extends Phaser.Scene {
    // JT Gruber
    constructor() {
        super("mouseSmiley");
    }

    // Use preload to load art and sound assets before the scene starts running.
    preload() {
        this.bodyX = 400;
        this.bodyY = 350;

        this.smileX = this.bodyX;
        this.smileY = this.bodyY + 20;
    }

    create() {
        document.getElementById('description').innerHTML = '<h2>mouseSmiley.js</h2>'

        my.sprite.body = this.add.sprite(this.bodyX, this.bodyY, "yellowBody");
        my.sprite.smile = this.add.sprite(this.smileX, this.smileY, "smile");

        
        this.MKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.M);
        my.sprite.smile.visible = false;
        my.sprite.body.visible = false;

        this.input.on('pointerdown', (pointer) => {
            my.sprite.body = this.add.sprite(this.bodyX, this.bodyY, "yellowBody");
            my.sprite.smile = this.add.sprite(this.smileX, this.smileY, "smile");
            my.sprite.body.x = this.input.activePointer.x;
            my.sprite.body.y = this.input.activePointer.y;
            my.sprite.smile.x = this.input.activePointer.x;
            my.sprite.smile.y = this.input.activePointer.y;
        });
    }
    
    update() {
        
    }

}
