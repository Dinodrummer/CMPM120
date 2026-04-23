// JT Gruber
class Movement extends Phaser.Scene {
    constructor() {
        super("movementScene");
        
        // Create variables to hold constant values for sprite locations
        this.bodyX = 200;
        this.bodyY = 300;

        this.coinX = 250;
        this.coinY = 350;

        this.coinList = [];

    }

    // Use preload to load art and sound assets before the scene starts running.
    preload() {
        this.load.setPath("./assets/");

        //this.load.image("yellowBody", "yellow_body_squircle.png");

        this.load.image("purpleCharacter", "character_roundPurple.png");
        this.load.image("coin", "tile_coin.png");

        document.getElementById('description').innerHTML = '<h2>Movement.js</h2>'
    }

    create() {
        
        // Create the main body sprite
        //my.sprite.body = this.add.sprite(this.bodyX, this.bodyY, "yellowBody");
        my.char = this.add.sprite(this.bodyX, this.bodyY, "purpleCharacter");
        //my.coin = this.add.sprite(this.coinX, this.coinY, "coin");

        this.AKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.DKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.WKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.SKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.SpaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    }
    
    update(time, delta) {
        const dt = delta / 1000;
        const vel = 200
        this.charSpeedX = 0;
        this.charSpeedY = 0;

        this.coinSpeedX = 0;
        this.coinSpeedY = -100;

        // let my = this.my;
        if(this.AKey.isDown){
            if(my.char.x >= 20){
                this.charSpeedX -= vel;
            }
        }
        if(this.DKey.isDown){
            if(my.char.x <= 780){
                this.charSpeedX += vel;
            }
        }
        if(this.WKey.isDown){
            if(my.char.y >= 24){
                this.charSpeedY -= vel;
            }
        }
        if(this.SKey.isDown){
            if(my.char.y <= 576){
                this.charSpeedY += vel;
            }
        }

        if(Phaser.Input.Keyboard.JustDown(this.SpaceKey)){
            my.coin = this.add.sprite(my.char.x, my.char.y, "coin");
            this.coinList.push(my.coin)
        }

        my.char.x += this.charSpeedX * dt;
        my.char.y += this.charSpeedY * dt;
        for(let item of this.coinList){
            item.x += this.coinSpeedX * dt;
            item.y += this.coinSpeedY * dt;
        }
        
    }

}