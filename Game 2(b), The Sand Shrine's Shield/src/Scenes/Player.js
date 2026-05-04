// src/Scenes/Player.js

class Player extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, playerList) {
        super(scene, x, y, texture);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setScale(2);
        this.body.setSize(this.width, this.height / 1.2, true);
        this.body.setOffset(0, 5);


        this.playerList = playerList;
        this.nextWalkFrameTime = 0;
        this.nextShotTime = 0;

        // Create a physics group for bullets
        this.bulletGroup = scene.physics.add.group();

        // Setup keys
        this.AKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.DKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.SpaceKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    }

    update(time, delta) {
        const dt = delta / 1000;
        const vel = 200;
        let charSpeedX = 0;

        if (this.AKey.isDown) {
            if (this.x >= 20) {
                charSpeedX -= vel;
                this.setFlipX(true);
            }
        }
        if (this.DKey.isDown) {
            if (this.x <= 680) {
                charSpeedX += vel;
                this.setFlipX(false);
            }
        }

        // Animation Toggle
        if (this.AKey.isDown || this.DKey.isDown) {
            if (time >= this.nextWalkFrameTime) {
                let nextFrame = (this.texture.key === "playerMove1") ? "playerMove2" : "playerMove1";
                this.setTexture(nextFrame);
                this.nextWalkFrameTime = time + 150;
            }
        } else {
            this.setTexture("playerIdle");
        }

        // Firing Logic
        if (this.SpaceKey.isDown && time > this.nextShotTime) {
            let bullet = this.bulletGroup.create(this.x, this.y - 20, "bullet");
            bullet.body.setSize(4, 4, true);
            bullet.setScale(2);
            bullet.body.setVelocityY(-400); // Set speed once, physics handles the rest!
            this.nextShotTime = time + 300;
        }

        // Apply movement
        this.x += charSpeedX * dt;

        // Cleanup bullets that go off-screen
        this.bulletGroup.children.each(function (bullet) {
            if (bullet.y < -10) {
                bullet.destroy();
            }
        });
    }
}
