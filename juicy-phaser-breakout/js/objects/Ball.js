/**
 * Ball Class
 *
 * The bouncing ball that breaks bricks.
 *
 * Juice Effects Demonstrated:
 * - BALL_TRAILS: Particle trail following the ball, showing motion
 * - SQUASH_STRETCH: Ball deforms on impact to feel more dynamic
 */

import { BALL, GAME, JUICE_EFFECTS } from '../constants.js';

export class Ball extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'ball');

        // Add to scene and physics
        scene.add.existing(this);
        scene.physics.add.existing(this, false);

        // Configure physics
        this.body.setCollideWorldBounds(true);
        this.body.setBounce(1, 1);
        this.body.setCircle(BALL.RADIUS);

        // Store reference to juice manager
        this.juiceManager = scene.juiceManager;

        // Current speed (increases over time)
        this.currentSpeed = BALL.INITIAL_SPEED;

        // Track if ball is active
        this.isLaunched = false;
    }

    /**
     * Launch the ball in a random upward direction
     */
    launch() {
        if (this.isLaunched) return;

        this.isLaunched = true;

        // Random angle between -60 and -120 degrees (upward)
        const angle = Phaser.Math.Between(-120, -60);
        const radians = Phaser.Math.DegToRad(angle);

        this.body.setVelocity(
            Math.cos(radians) * this.currentSpeed,
            Math.sin(radians) * this.currentSpeed
        );
    }

    /**
     * Update ball state each frame
     */
    update() {
        if (!this.isLaunched) return;

        // Apply stretch based on velocity direction
        if (this.juiceManager.isEnabled(JUICE_EFFECTS.SQUASH_STRETCH)) {
            this.applyVelocityStretch();
        }

        // Check for bottom collision (lose life)
        if (this.y > GAME.HEIGHT - BALL.RADIUS) {
            this.scene.loseLife();
        }
    }

    /**
     * Stretch the ball in the direction of movement
     */
    applyVelocityStretch() {
        const velX = this.body.velocity.x;
        const velY = this.body.velocity.y;
        const speed = Math.sqrt(velX * velX + velY * velY);

        if (speed > 0) {
            // Calculate stretch amount based on speed
            const stretchFactor = 1 + (speed / BALL.MAX_SPEED) * 0.2;

            // Rotate to face velocity direction
            const angle = Math.atan2(velY, velX);
            this.rotation = angle;

            // Apply stretch (elongate in direction of movement)
            this.scaleX = stretchFactor;
            this.scaleY = 1 / stretchFactor;
        }
    }

    /**
     * Called when ball hits something
     * Applies squash effect
     */
    onCollide() {
        if (this.juiceManager.isEnabled(JUICE_EFFECTS.SQUASH_STRETCH)) {
            // Quick squash and return to normal
            this.scene.tweens.add({
                targets: this,
                scaleX: 0.7,
                scaleY: 1.3,
                duration: 50,
                yoyo: true,
                ease: 'Quad.easeOut',
                onComplete: () => {
                    // Let velocity stretch take over again
                }
            });
        }
    }

    /**
     * Increase ball speed (called on brick hit)
     */
    increaseSpeed() {
        this.currentSpeed = Math.min(
            this.currentSpeed + BALL.SPEED_INCREMENT,
            BALL.MAX_SPEED
        );

        // Normalize and apply new speed
        const vel = this.body.velocity;
        const currentMag = Math.sqrt(vel.x * vel.x + vel.y * vel.y);

        if (currentMag > 0) {
            const scale = this.currentSpeed / currentMag;
            this.body.setVelocity(vel.x * scale, vel.y * scale);
        }
    }

    /**
     * Reset ball to starting position
     * @param {number} paddleX - X position of paddle
     * @param {number} paddleY - Y position of paddle
     */
    reset(paddleX, paddleY) {
        this.isLaunched = false;
        this.currentSpeed = BALL.INITIAL_SPEED;
        this.setPosition(paddleX, paddleY - 30);
        this.body.setVelocity(0, 0);
        this.setScale(1, 1);
        this.rotation = 0;
    }
}
