/**
 * Game Scene
 *
 * Main gameplay scene that ties together all game objects and juice effects.
 *
 * This scene demonstrates how to:
 * - Set up physics collisions
 * - Integrate multiple juice effects
 * - Check toggle state before applying effects
 * - Handle game state (lives, scoring, win/lose)
 */

import { GAME, PADDLE, JUICE_EFFECTS } from '../constants.js';
import { JuiceManager } from '../effects/JuiceManager.js';
import { ScreenShake } from '../effects/ScreenShake.js';
import { ParticleEffects } from '../effects/ParticleEffects.js';
import { SquashStretch } from '../effects/SquashStretch.js';
import { ScorePopup } from '../effects/ScorePopup.js';
import { ColorFlash } from '../effects/ColorFlash.js';
import { AudioManager } from '../utils/AudioManager.js';
import { Paddle } from '../objects/Paddle.js';
import { Ball } from '../objects/Ball.js';
import { BrickGrid } from '../objects/BrickGrid.js';
import { ScoreDisplay } from '../ui/ScoreDisplay.js';

export class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }

    create() {
        // Initialize juice manager first (other objects need it)
        this.juiceManager = new JuiceManager(this);

        // Initialize effect helpers
        this.screenShake = new ScreenShake(this);
        this.particleEffects = new ParticleEffects(this);
        this.squashStretch = new SquashStretch(this);
        this.scorePopup = new ScorePopup(this);
        this.colorFlash = new ColorFlash(this);
        this.audioManager = new AudioManager();

        // Create game objects
        this.createPaddle();
        this.createBall();
        this.createBricks();

        // Create score display
        this.scoreDisplay = new ScoreDisplay(this);

        // Set up physics collisions
        this.setupCollisions();

        // Set up input
        this.setupInput();

        // Game state
        this.isGameOver = false;
        this.isWin = false;

        // Create visual divider
        this.createDivider();

        // Start UI scene on top
        this.scene.launch('UIScene');

        // Create game over / win text (hidden initially)
        this.createEndGameText();
    }

    /**
     * Create the paddle
     */
    createPaddle() {
        const paddleY = GAME.HEIGHT - PADDLE.Y_OFFSET;
        this.paddle = new Paddle(this, GAME.PLAYFIELD_WIDTH / 2, paddleY);
    }

    /**
     * Create the ball
     */
    createBall() {
        const paddleY = GAME.HEIGHT - PADDLE.Y_OFFSET;
        this.ball = new Ball(this, GAME.PLAYFIELD_WIDTH / 2, paddleY - 30);
    }

    /**
     * Create the brick grid
     */
    createBricks() {
        this.brickGrid = new BrickGrid(this);
        this.brickGrid.create();
    }

    /**
     * Set up physics collisions
     */
    setupCollisions() {
        // Set world bounds to playfield area only
        this.physics.world.setBounds(0, 0, GAME.PLAYFIELD_WIDTH, GAME.HEIGHT);

        // Ball vs paddle
        this.physics.add.collider(
            this.ball,
            this.paddle,
            this.handleBallPaddleCollision,
            null,
            this
        );

        // Ball vs bricks
        this.physics.add.collider(
            this.ball,
            this.brickGrid.getGroup(),
            this.handleBallBrickCollision,
            null,
            this
        );

        // Ball vs world bounds (for wall hits)
        this.ball.body.onWorldBounds = true;
        this.physics.world.on('worldbounds', this.handleWallCollision, this);
    }

    /**
     * Create visual divider between playfield and UI panel
     */
    createDivider() {
        const graphics = this.add.graphics();
        graphics.lineStyle(2, 0x4fc3f7, 0.5);
        graphics.lineBetween(GAME.PLAYFIELD_WIDTH, 0, GAME.PLAYFIELD_WIDTH, GAME.HEIGHT);
        graphics.setDepth(100);
    }

    /**
     * Set up input handling
     */
    setupInput() {
        // Click to launch ball
        this.input.on('pointerdown', () => {
            // Initialize audio on first click (browser requirement)
            this.audioManager.init();

            if (!this.ball.isLaunched && !this.isGameOver) {
                this.ball.launch();

                // Play launch sound
                if (this.juiceManager.isEnabled(JUICE_EFFECTS.SOUND_EFFECTS)) {
                    this.audioManager.playLaunch();
                }

                // Start ball trail if enabled
                if (this.juiceManager.isEnabled(JUICE_EFFECTS.BALL_TRAILS)) {
                    this.particleEffects.startTrail(this.ball);
                }
            } else if (this.isGameOver) {
                this.restartGame();
            }
        });
    }

    /**
     * Create end game text elements
     */
    createEndGameText() {
        // Game over text
        this.gameOverText = this.add.text(
            GAME.PLAYFIELD_WIDTH / 2,
            GAME.HEIGHT / 2 - 30,
            'GAME OVER',
            {
                fontFamily: 'Arial, sans-serif',
                fontSize: '48px',
                fontStyle: 'bold',
                color: '#ff6b6b'
            }
        );
        this.gameOverText.setOrigin(0.5);
        this.gameOverText.setDepth(150);
        this.gameOverText.setVisible(false);

        // Win text
        this.winText = this.add.text(
            GAME.PLAYFIELD_WIDTH / 2,
            GAME.HEIGHT / 2 - 30,
            'YOU WIN!',
            {
                fontFamily: 'Arial, sans-serif',
                fontSize: '48px',
                fontStyle: 'bold',
                color: '#1dd1a1'
            }
        );
        this.winText.setOrigin(0.5);
        this.winText.setDepth(150);
        this.winText.setVisible(false);

        // Restart text
        this.restartText = this.add.text(
            GAME.PLAYFIELD_WIDTH / 2,
            GAME.HEIGHT / 2 + 30,
            'Click to play again',
            {
                fontFamily: 'Arial, sans-serif',
                fontSize: '24px',
                color: '#ffffff'
            }
        );
        this.restartText.setOrigin(0.5);
        this.restartText.setDepth(150);
        this.restartText.setVisible(false);
    }

    /**
     * Handle ball hitting paddle
     */
    handleBallPaddleCollision(ball, paddle) {
        // Calculate bounce angle based on where ball hit paddle
        const hitPoint = (ball.x - paddle.x) / (PADDLE.WIDTH / 2);
        const angle = hitPoint * 60; // Max 60 degrees

        // Set new velocity based on angle
        const speed = ball.currentSpeed;
        const radians = Phaser.Math.DegToRad(-90 + angle);
        ball.body.setVelocity(
            Math.cos(radians) * speed,
            Math.sin(radians) * speed
        );

        // Apply juice effects
        ball.onCollide();
        paddle.squash();

        // Sound effect
        if (this.juiceManager.isEnabled(JUICE_EFFECTS.SOUND_EFFECTS)) {
            this.audioManager.playPaddleHit();
        }
    }

    /**
     * Handle ball hitting a brick
     */
    handleBallBrickCollision(ball, brick) {
        if (brick.isDestroying) return;

        // Add score
        this.scoreDisplay.addScore(brick.points);

        // Increase ball speed
        ball.increaseSpeed();

        // Apply juice effects
        ball.onCollide();

        // Wobble neighboring bricks
        if (this.juiceManager.isEnabled(JUICE_EFFECTS.BRICK_ANIMATIONS)) {
            this.brickGrid.wobbleNeighbors(brick);
        }

        // Destroy brick with all applicable juice effects
        brick.destroyWithJuice();

        // Check for win
        this.time.delayedCall(50, () => {
            if (this.brickGrid.isEmpty()) {
                this.winGame();
            }
        });
    }

    /**
     * Handle ball hitting world bounds (walls)
     */
    handleWallCollision(body) {
        if (body.gameObject !== this.ball) return;

        // Apply collision effect
        this.ball.onCollide();

        // Sound effect
        if (this.juiceManager.isEnabled(JUICE_EFFECTS.SOUND_EFFECTS)) {
            this.audioManager.playWallHit();
        }

        // Light screen shake
        if (this.juiceManager.isEnabled(JUICE_EFFECTS.SCREEN_SHAKE)) {
            this.screenShake.shakeLight();
        }
    }

    /**
     * Called when ball goes past paddle
     */
    loseLife() {
        if (this.isGameOver) return;

        // Stop trail
        this.particleEffects.stopTrail();

        const livesRemaining = this.scoreDisplay.loseLife();

        // Sound effect
        if (this.juiceManager.isEnabled(JUICE_EFFECTS.SOUND_EFFECTS)) {
            this.audioManager.playLoseLife();
        }

        // Screen shake
        if (this.juiceManager.isEnabled(JUICE_EFFECTS.SCREEN_SHAKE)) {
            this.screenShake.shakeStrong();
        }

        // Color flash
        if (this.juiceManager.isEnabled(JUICE_EFFECTS.COLOR_FLASH)) {
            this.colorFlash.screenFlash(0xff0000, 200);
        }

        if (livesRemaining <= 0) {
            this.gameOver();
        } else {
            // Reset ball position
            this.ball.reset(this.paddle.x, this.paddle.y);
        }
    }

    /**
     * Game over
     */
    gameOver() {
        this.isGameOver = true;
        this.isWin = false;

        // Stop ball
        this.ball.body.setVelocity(0, 0);
        this.ball.isLaunched = false;

        // Stop particles
        this.particleEffects.stopTrail();

        // Sound
        if (this.juiceManager.isEnabled(JUICE_EFFECTS.SOUND_EFFECTS)) {
            this.audioManager.playGameOver();
        }

        // Show game over text
        this.gameOverText.setVisible(true);
        this.restartText.setVisible(true);

        // Animate text
        this.gameOverText.setScale(0);
        this.tweens.add({
            targets: this.gameOverText,
            scale: 1,
            duration: 500,
            ease: 'Back.easeOut'
        });
    }

    /**
     * Win game
     */
    winGame() {
        this.isGameOver = true;
        this.isWin = true;

        // Stop ball
        this.ball.body.setVelocity(0, 0);
        this.ball.isLaunched = false;

        // Stop particles
        this.particleEffects.stopTrail();

        // Sound
        if (this.juiceManager.isEnabled(JUICE_EFFECTS.SOUND_EFFECTS)) {
            this.audioManager.playWin();
        }

        // Show win text
        this.winText.setVisible(true);
        this.restartText.setVisible(true);

        // Animate text
        this.winText.setScale(0);
        this.tweens.add({
            targets: this.winText,
            scale: 1,
            duration: 500,
            ease: 'Back.easeOut'
        });

        // Screen flash
        if (this.juiceManager.isEnabled(JUICE_EFFECTS.COLOR_FLASH)) {
            this.colorFlash.screenFlash(0x1dd1a1, 300);
        }
    }

    /**
     * Restart the game
     */
    restartGame() {
        this.isGameOver = false;
        this.isWin = false;

        // Hide end game text
        this.gameOverText.setVisible(false);
        this.winText.setVisible(false);
        this.restartText.setVisible(false);

        // Reset score and lives
        this.scoreDisplay.reset();

        // Reset paddle
        this.paddle.reset();

        // Reset ball
        this.ball.reset(this.paddle.x, this.paddle.y);

        // Reset bricks
        this.brickGrid.reset();
    }

    /**
     * Update loop
     */
    update() {
        if (this.isGameOver) return;

        // Update paddle with mouse position and ball reference (for eye tracking)
        const pointer = this.input.activePointer;
        this.paddle.update(pointer.x, this.ball);

        // Update ball
        this.ball.update();

        // Keep ball on paddle before launch
        if (!this.ball.isLaunched) {
            this.ball.x = this.paddle.x;
        }

        // Update ball trail based on toggle state
        this.particleEffects.updateTrail(
            this.ball,
            this.juiceManager.isEnabled(JUICE_EFFECTS.BALL_TRAILS)
        );
    }
}
