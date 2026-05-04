// src/Scenes/Scene.js

class Level1 extends Phaser.Scene {
    constructor() {
        super("levelScene");

        this.nextEnemySpawnTime = 0;
    }

    preload() {
        this.load.setPath("./assets/");

        // Player assets
        this.load.image("playerIdle", "playerIdle.png");
        this.load.image("playerMove1", "playerMove1.png");
        this.load.image("playerMove2", "playerMove2.png");
        this.load.image("playerDead", "playerDead.png");

        // Enemy assets
        this.load.image("enemyIdle", "Enemy/enemyIdle.png");
        this.load.image("enemyMove1", "Enemy/enemyMove1.png");
        this.load.image("enemyMove2", "Enemy/enemyMove2.png");
        this.load.image("enemyDead", "Enemy/enemyDead.png");

        // Bullet
        this.load.image("bullet", "bullet.png");
    }

    create() {
        this.width = this.sys.game.config.width;
        this.height = this.sys.game.config.height;

        // Create player
        this.player = new Player(this, this.width / 2, this.height - 30, "playerIdle");
        my.player = this.player; // Restore global reference

        // Create groups
        this.enemyGroup = this.physics.add.group();
        this.enemyBulletGroup = this.physics.add.group();
        this.enemies = [];

        for (let i = 0; i < 5; i++) {
            let enemy = new Enemy(this, 100 + (i * 120), 100, "enemyIdle", Math.random() * 500, this.enemyBulletGroup);
            this.enemyGroup.add(enemy);
            this.enemies.push(enemy);
        }

        // Set up collision (overlap) between player bullets and enemies
        this.physics.add.overlap(this.player.bulletGroup, this.enemyGroup, (bullet, enemy) => {
            bullet.destroy();
            enemy.destroy();
        });

        this.physics.add.overlap(this.enemyBulletGroup, this.player, (bullet, player) => {
            this.player.setTexture("playerDead");
            this.player.active = false
        });
    }

    update(time, delta) {

        if (time >= this.nextEnemySpawnTime) {
            let enemy = new Enemy(this, 100, 100, "enemyIdle", Math.random() * 500, this.enemyBulletGroup);
            this.enemyGroup.add(enemy);
            this.enemies.push(enemy);
            this.nextEnemySpawnTime = time + 1500;
        }

        const dt = delta / 1000;
        // Update player
        if (this.player.active) {
            this.player.update(time, delta);
        }

        // Update enemies (only those that are still active)
        for (let enemy of this.enemies) {
            if (enemy.active) {
                enemy.update(time, delta);
            }
        }

        // Update enemy bullets (so they move even if the enemy is dead)
        this.enemyBulletGroup.children.each(bullet => {
            bullet.y += 200 * dt;
            if (bullet.y > this.height) bullet.destroy();
        });
    }
}
