class Monster extends Phaser.Scene {
    constructor() {
        super("monsterScene");
        this.my = {sprite: {}};  // Create an object to hold sprite bindings

        //Create constants for the monster location
        this.bodyX = 300;
        this.bodyY = 350;
        
    }

    // Use preload to load art and sound assets before the scene starts running.
    preload() {
        // Assets from Kenny Assets pack "Monster Builder Pack"
        // https://kenney.nl/assets/monster-builder-pack
        this.load.setPath("./assets/");

        // Load sprite atlas
        this.load.atlasXML("monsterParts", "spritesheet_default.png", "spritesheet_default.xml");
        
        // update instruction text
        document.getElementById('description').innerHTML = '<h2>Monster.js<br>S - smile // F - show fangs<br>A - move left // D - move right</h2>'
    }

    create() {
        let my = this.my;   // create an alias to this.my for readability

        // Create the main body sprite
        //
        // this.add.sprite(x,y, "{atlas key name}", "{name of sprite within atlas}")
        //
        // look in spritesheet_default.xml for the individual sprite names
        // You can also download the asset pack and look in the PNG/default folder.
        this.monster = this.add.container(this.bodyX, this.bodyY);

        my.sprite.body = this.add.sprite(this.bodyX, this.bodyY, "monsterParts", "body_blueE.png");

        my.sprite.arm1 = this.add.sprite(this.bodyX + 90, this.bodyY, "monsterParts", "arm_greenC.png");
        my.sprite.arm2 = this.add.sprite(this.bodyX - 90, this.bodyY, "monsterParts", "arm_darkB.png");
        my.sprite.arm2.flipX = true;

        my.sprite.eye1 = this.add.sprite(this.bodyX + 50, this.bodyY - 20, "monsterParts", "eye_yellow.png");
        my.sprite.eye2 = this.add.sprite(this.bodyX - 50, this.bodyY - 20, "monsterParts", "eye_human_green.png");

        my.sprite.leg1 = this.add.sprite(this.bodyX + 50, this.bodyY + 160, "monsterParts", "leg_yellowA.png");
        my.sprite.leg2 = this.add.sprite(this.bodyX - 50, this.bodyY + 160, "monsterParts", "leg_greenE.png");
        my.sprite.leg2.flipX = true;

        my.sprite.mouth1 = this.add.sprite(this.bodyX, this.bodyY + 30, "monsterParts", "mouth_closed_happy.png");
        my.sprite.mouth2 = this.add.sprite(this.bodyX, this.bodyY + 30, "monsterParts", "mouthH.png");

        my.sprite.accessory1 = this.add.sprite(this.bodyX + 20, this.bodyY - 150, "monsterParts", "detail_blue_antenna_large.png");
        my.sprite.accessory2 = this.add.sprite(this.bodyX, this.bodyY, "monsterParts", "nose_red.png");

        my.sprite.mouth2.visible = false;
        this.FKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        this.SKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);

        this.AKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.DKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);

        
    }

    update() {
        let my = this.my;    // create an alias to this.my for readability
        if(this.FKey.isDown){
            my.sprite.mouth2.visible = true;
            my.sprite.mouth1.visible = false;
        }
        if(this.SKey.isDown){
            my.sprite.mouth2.visible = false;
            my.sprite.mouth1.visible = true;
        }

        if(this.AKey.isDown){
            for(let part in my.sprite){
                my.sprite[part].x -= 1;
            }
        }
        if(this.DKey.isDown){
            for(let part in my.sprite){
                my.sprite[part].x += 1;
            }
        }
        

       
    }

}