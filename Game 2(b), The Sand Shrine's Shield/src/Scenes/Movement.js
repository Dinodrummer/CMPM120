// JT Gruber
class Movement extends Phaser.Scene {
    constructor() {
        super("movementScene");


        // Create variables to hold constant values for sprite locations
        this.bodyX = 200;
        this.bodyY = 300;


        this.bulletList = [];

        this.nextShotTime = 0;
        this.nextWalkFrameTime = 0;
        this.nextEnemySpawnTime = 0;

    }

    init() {
        this.width = this.sys.game.config.width;
        this.height = this.sys.game.config.height;
    }

    // Use preload to load art and sound assets before the scene starts running.
    preload() {
        this.load.setPath("./assets/");

        //this.load.image("yellowBody", "yellow_body_squircle.png");

        this.playerList = ["playerIdle", "playerMove1", "playerMove2", "playerDead"]
        this.load.image("playerIdle", "playerIdle.png");
        this.load.image("playerMove1", "playerMove1.png");
        this.load.image("playerMove2", "playerMove2.png");
        this.load.image("playerDead", "playerDead.png");

        this.load.image("enemyIdle", "Enemy/enemyIdle.png");
        this.load.image("enemyMove1", "Enemy/enemyMove1.png");
        this.load.image("enemyMove2", "Enemy/enemyMove2.png");
        this.load.image("enemyDead", "Enemy/enemyDead.png");
        this.load.image("bullet", "bullet.png");

        document.getElementById('description').innerHTML = '<h2>Movement.js</h2>'


    }

    create() {


        // Create the main body sprite
        //my.sprite.body = this.add.sprite(this.bodyX, this.bodyY, "yellowBody");
        my.player = this.physics.add.sprite(this.width / 2, this.height - 30, this.playerList[0]);
        my.player.setScale(2)
        //my.coin = this.add.sprite(this.coinX, this.coinY, "coin");

        this.AKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.DKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.WKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.SKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.SpaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        this.enemies = [];

        this.enemies.push(new Enemy(this, 100, 100, "enemyIdle", Math.random() * 500));
        this.enemies.push(new Enemy(this, 100, 100, "enemyIdle", Math.random() * 500));
        this.enemies.push(new Enemy(this, 100, 100, "enemyIdle", Math.random() * 500));
        this.enemies.push(new Enemy(this, 100, 100, "enemyIdle", Math.random() * 500));
        this.enemies.push(new Enemy(this, 100, 100, "enemyIdle", Math.random() * 500));
    }

    update(time, delta) {

        for (let enemy of this.enemies) {
            enemy.update(time, delta);
        }

        const dt = delta / 1000;
        const vel = 200
        this.charSpeedX = 0;
        this.charSpeedY = 0;

        this.bulletSpeedX = 0;
        this.bulletSpeedY = -400;

        // let my = this.my;
        if (this.AKey.isDown) {
            if (my.player.x >= 20) {
                this.charSpeedX -= vel;
                my.player.setFlipX(true);
            }
        }
        if (this.DKey.isDown) {
            if (my.player.x <= 680) {
                this.charSpeedX += vel;
                my.player.setFlipX(false);
            }
        }

        // WALKING ANIMATION
        if (this.AKey.isDown || this.DKey.isDown) {
            if (time >= this.nextWalkFrameTime) {
                let nextFrame = (my.player.texture.key === "playerMove1") ? "playerMove2" : "playerMove1";
                my.player.setTexture(nextFrame);
                this.nextWalkFrameTime = time + 150; // Switch every 150ms
            }
        } else {
            my.player.setTexture("playerIdle");
        }

        // FIRING LOGIC
        if (this.SpaceKey.isDown && time > this.nextShotTime) {
            my.bullet = this.add.sprite(my.player.x, my.player.y - 20, "bullet");
            my.bullet.setScale(2);
            this.bulletList.push(my.bullet);
            this.nextShotTime = time + 300;
        }

        // APPLY MOVEMENT
        my.player.x += this.charSpeedX * dt;
        my.player.y += this.charSpeedY * dt;

        // UPDATE BULLETS
        for (let item of this.bulletList) {
            item.x += this.bulletSpeedX * dt;
            item.y += this.bulletSpeedY * dt;
        }
    }
}