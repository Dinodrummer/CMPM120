// src/Scenes/Scene.js

class Level1 extends Phaser.Scene {
    constructor() {
        super("levelScene");

        this.nextEnemySpawnTime = 0;
    }

    preload() {
        this.load.setPath("./assets/");

        this.load.image("playerIdle", "playerIdle.png");
        this.load.image("playerMove1", "playerMove1.png");
        this.load.image("playerMove2", "playerMove2.png");
        this.load.image("playerDead", "playerDead.png");

        this.load.image("enemyIdle", "Enemy/enemyIdle.png");
        this.load.image("enemyMove1", "Enemy/enemyMove1.png");
        this.load.image("enemyMove2", "Enemy/enemyMove2.png");
        this.load.image("enemyDead", "Enemy/enemyDead.png");

        this.load.image("bullet", "bullet.png");

        this.load.audio("music", "background_music.mp3");
        this.load.audio("shoot", "shoot-e.ogg");
        this.load.audio("hurt", "hurt-a.ogg");

        this.load.image("tilemap_tiles", "tilemap_packed.png");
        this.load.tilemapTiledJSON("map", "tilemap.json");


    }

    create() {
        this.score = 0;
        const map = this.make.tilemap({ key: "map" });
        const tileset = map.addTilesetImage("tilemap_packed", "tilemap_tiles");

        this.backgroundLayer = map.createLayer("Background", tileset, 0, 0);
        this.objectsLayer = map.createLayer("Objects", tileset, 0, 0);
        this.backgroundLayer.setScale(2.5);
        this.objectsLayer.setScale(2.5);
        this.width = this.sys.game.config.width;
        this.height = this.sys.game.config.height;



        this.player = new Player(this, this.width / 2, this.height - 30, "playerIdle");
        my.player = this.player;

        this.enemyGroup = this.physics.add.group();
        this.enemyBulletGroup = this.physics.add.group();
        this.enemies = [];

        for (let i = 0; i < 5; i++) {
            let enemy = new Enemy(this, 100 + (i * 120), 100, "enemyIdle", Math.random() * 500, this.enemyBulletGroup);
            this.enemyGroup.add(enemy);
            this.enemies.push(enemy);
        }

        this.physics.add.overlap(this.player.bulletGroup, this.enemyGroup, (bullet, enemy) => {
            bullet.destroy();
            enemy.destroy();
            my.sprite.hurt.play();
            this.score += 10;
            this.scoreText.setText("SCORE: " + this.score);
        });

        this.objectsLayer.setCollisionByExclusion([-1]);
        this.physics.add.collider(this.player.bulletGroup, this.objectsLayer, (bullet) => {
            bullet.destroy();
        });
        this.physics.add.collider(this.enemyBulletGroup, this.objectsLayer, (bullet) => {
            bullet.destroy();
        });

        this.physics.add.overlap(this.enemyBulletGroup, this.player, (bullet, player) => {
            if (this.player.active == true) {
                this.player.setTexture("playerDead");
                this.player.active = false;
                my.sprite.hurt.play();

                my.sprite.music.stop();

                this.time.delayedCall(2000, () => {
                    this.scene.start("restartScene");
                });
            }
        });
        my.sprite.shoot = this.sound.add("shoot");
        my.sprite.hurt = this.sound.add("hurt");
        my.sprite.music = this.sound.add("music", {
            loop: true,
            volume: 0.5
        });
        my.sprite.music.play();

        this.scoreText = this.add.text(10, 10, "SCORE: " + this.score, {
            fontFamily: 'Times, serif',
            fontSize: 24,
            color: '#ffffff'
        });
    }

    update(time, delta) {

        my.sprite.score = this.score

        if (time >= this.nextEnemySpawnTime) {
            let enemy = new Enemy(this, 100, 100, "enemyIdle", Math.random() * 500, this.enemyBulletGroup);
            this.enemyGroup.add(enemy);
            this.enemies.push(enemy);
            this.nextEnemySpawnTime = time + (Math.random() * (1000 - 400) + 400);
        }

        const dt = delta / 1000;

        if (this.player.active) {
            this.player.update(time, delta);
        }

        for (let enemy of this.enemies) {
            if (enemy.active) {
                enemy.update(time, delta);
            }
        }

        this.enemyBulletGroup.children.each(bullet => {
            if (bullet.y > this.height) bullet.destroy();
        });
    }
}
