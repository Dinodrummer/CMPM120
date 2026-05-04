// src/Scenes/Enemy.js

class Enemy extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, nextShotTime, bulletGroup) {
        super(scene, x, y, texture);
        scene.add.existing(this); // Add to the scene
        this.setScale(2);
        scene.physics.add.existing(this);

        // Movement properties
        this.vel = Math.random() * 300;
        this.left = false;
        this.right = true;
        this.nextShotTime = nextShotTime;
        this.nextWalkFrameTime = 0

        this.bulletGroup = bulletGroup;
    }

    update(time, delta) {
        const dt = delta / 1000;

        // Animation Logic
        if (time >= this.nextWalkFrameTime) {
            let nextFrame = (this.texture.key === "enemyMove1") ? "enemyMove2" : "enemyMove1";
            this.setTexture(nextFrame);
            this.nextWalkFrameTime = time + 150; // Switch every 150ms
        }

        // Bouncing logic
        // Use scene.sys.game.config.width to get screen size
        if (this.x > this.scene.sys.game.config.width - 20) {
            this.right = false;
            this.left = true;
            this.setFlipX(true);
        }
        if (this.x < 15) {
            this.left = false;
            this.right = true;
            this.setFlipX(false);
        }

        // Apply movement
        if (this.left) this.x -= this.vel * dt;
        if (this.right) this.x += this.vel * dt;

        // Firing logic
        if (time > this.nextShotTime) {
            let bullet = this.bulletGroup.create(this.x, this.y + 20, "bullet");
            bullet.body.setSize(4, 4, true);
            bullet.setScale(2);
            this.nextShotTime = time + 800;
        }
    }
}