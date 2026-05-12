/**
 * Score Display
 *
 * Shows score and lives in the game UI.
 */

import { GAME } from '../constants.js';

export class ScoreDisplay {
    constructor(scene) {
        this.scene = scene;

        this.score = 0;
        this.lives = 3;
        this.highScore = this.loadHighScore();

        this.createDisplay();
    }

    /**
     * Create the score and lives display
     */
    createDisplay() {
        const textStyle = {
            fontFamily: 'Arial, sans-serif',
            fontSize: '20px',
            color: '#ffffff'
        };

        // Score text (left side)
        this.scoreText = this.scene.add.text(20, 15, 'Score: 0', textStyle);
        this.scoreText.setDepth(100);

        // High score (center of playfield)
        this.highScoreText = this.scene.add.text(
            GAME.PLAYFIELD_WIDTH / 2,
            15,
            `Best: ${this.highScore}`,
            { ...textStyle, fontSize: '16px', color: '#888888' }
        );
        this.highScoreText.setOrigin(0.5, 0);
        this.highScoreText.setDepth(100);

        // Lives (right side of playfield)
        this.livesText = this.scene.add.text(
            GAME.PLAYFIELD_WIDTH - 20,
            15,
            'Lives: ♥♥♥',
            textStyle
        );
        this.livesText.setOrigin(1, 0);
        this.livesText.setDepth(100);
    }

    /**
     * Add points to score
     * @param {number} points - Points to add
     */
    addScore(points) {
        this.score += points;
        this.updateScoreDisplay();

        // Check for new high score
        if (this.score > this.highScore) {
            this.highScore = this.score;
            this.saveHighScore();
            this.updateHighScoreDisplay();
        }
    }

    /**
     * Update the score display text
     */
    updateScoreDisplay() {
        this.scoreText.setText(`Score: ${this.score}`);

        // Add a little pop effect
        this.scene.tweens.add({
            targets: this.scoreText,
            scale: 1.2,
            duration: 50,
            yoyo: true,
            ease: 'Quad.easeOut'
        });
    }

    /**
     * Update high score display
     */
    updateHighScoreDisplay() {
        this.highScoreText.setText(`Best: ${this.highScore}`);
        this.highScoreText.setColor('#ffff00');

        this.scene.tweens.add({
            targets: this.highScoreText,
            scale: 1.3,
            duration: 100,
            yoyo: true,
            ease: 'Quad.easeOut'
        });
    }

    /**
     * Set lives count
     * @param {number} lives - Number of lives
     */
    setLives(lives) {
        this.lives = lives;
        this.updateLivesDisplay();
    }

    /**
     * Lose a life
     * @returns {number} Remaining lives
     */
    loseLife() {
        this.lives--;
        this.updateLivesDisplay();
        return this.lives;
    }

    /**
     * Update the lives display
     */
    updateLivesDisplay() {
        const hearts = '♥'.repeat(Math.max(0, this.lives));
        const emptyHearts = '♡'.repeat(Math.max(0, 3 - this.lives));
        this.livesText.setText(`Lives: ${hearts}${emptyHearts}`);

        // Flash red when losing life
        if (this.lives < 3) {
            this.livesText.setColor('#ff6b6b');
            this.scene.time.delayedCall(200, () => {
                this.livesText.setColor('#ffffff');
            });
        }
    }

    /**
     * Get current score
     */
    getScore() {
        return this.score;
    }

    /**
     * Get remaining lives
     */
    getLives() {
        return this.lives;
    }

    /**
     * Reset for new game
     */
    reset() {
        this.score = 0;
        this.lives = 3;
        this.scoreText.setText('Score: 0');
        this.updateLivesDisplay();
    }

    /**
     * Load high score from localStorage
     */
    loadHighScore() {
        try {
            return parseInt(localStorage.getItem('juicyBreakoutHighScore')) || 0;
        } catch (e) {
            return 0;
        }
    }

    /**
     * Save high score to localStorage
     */
    saveHighScore() {
        try {
            localStorage.setItem('juicyBreakoutHighScore', this.highScore.toString());
        } catch (e) {
            // Ignore storage errors
        }
    }
}
