// JT Gruber
class Smiley extends Phaser.Scene {
    constructor() {
        super("smileyScene");
        
        // Create variables to hold constant values for sprite locations
        this.bodyX = 400;
        this.bodyY = 350;

        // Define the locations of the smile and hands relative to the
        // main body location. This way, if we change the main body
        // location, the other values update too.
        this.smileX = this.bodyX;
        this.smileY = this.bodyY + 20;

        this.leftHandX = this.bodyX - 125;
        this.lefthandY = this.bodyY + 20;

        this.rightHandX = this.bodyX + 125;
        this.rightHandY = this.bodyY + 20;
        
        this.counter = 0;
        this.smileType = 'Smile';
    }

    // Use preload to load art and sound assets before the scene starts running.
    preload() {
        // Assets from Kenny Assets pack "Shape Characters"
        // https://kenney.nl/assets/shape-characters
        this.load.setPath("./assets/");
        // body
        this.load.image("yellowBody", "yellow_body_squircle.png");
        // smiles
        this.load.image("smile", "face_a.png");
        this.load.image("smileDimple", "face_c.png");
        // hands
        this.load.image("handOpen", "hand_yellow_open.png");
        this.load.image("handPeace", "hand_yellow_peace.png");

        // update instruction text
        document.getElementById('description').innerHTML = '<h2>Smiley.js</h2>'
    }

    create() {
        
        // Create the main body sprite
        my.sprite.body = this.add.sprite(this.bodyX, this.bodyY, "yellowBody");

        // Create the two sprites, one for each type of smile
        my.sprite.smile = this.add.sprite(this.smileX, this.smileY, "smile");
        my.sprite.dimple = this.add.sprite(this.smileX, this.smileY, "smileDimple");
        
        // Create the sprite for the left and right hands
        // Handedness is from the player's perspective, not Cubey's
        my.sprite.leftOpenHand = this.add.sprite(this.leftHandX, this.lefthandY, "handOpen");
        my.sprite.leftOpenHand.flipX = true;   // flip sprite to have thumb on correct side
        my.sprite.rightOpenHand = this.add.sprite(this.rightHandX, this.rightHandY, "handOpen");

        my.sprite.rightPeaceHand = this.add.sprite(this.rightHandX, this.rightHandY, "handPeace");
        my.sprite.rightPeaceHand.visible = false;

        // Since sprites are visible when created and we only want one smile to be shown
        // at a time, make the "dimple" smile not visible to start.
        my.sprite.dimple.visible = false;
        this.PKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P);
        this.DKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.SKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    }
    
    update() {
        let my = this.my; 
        // Polling input: peace hand
        if(this.PKey.isDown){
            my.sprite.rightPeaceHand.visible = true;
            my.sprite.rightOpenHand.visible = false;
        } else {
            my.sprite.rightPeaceHand.visible = false;
            my.sprite.rightOpenHand.visible = true;
        }
        // Event input: dimple smile
        if(this.DKey.isDown){
            my.sprite.dimple.visible = true;
            my.sprite.smile.visible = false;
        }
        // Event input: Regular smile
        if(this.SKey.isDown){
            my.sprite.dimple.visible = false;
            my.sprite.smile.visible = true;
        }
    }

}