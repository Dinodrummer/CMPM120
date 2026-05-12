/**
 * Score Popup Effect
 *
 * Shows floating score text when bricks are destroyed.
 *
 * Why score popups work:
 * - Immediate feedback for player actions
 * - Celebrates successful hits
 * - Communicates value of different targets
 * - Adds visual interest to destruction
 *
 * From "Juice It or Lose It": Numbers popping out of things
 * makes players feel like they're accomplishing something.
 */

import { EFFECTS } from '../constants.js';

export class ScorePopup {
    constructor(scene) {
        this.scene = scene;

        // Pool of reusable text objects
        this.pool = [];
        this.poolSize = 20;

        // Pre-create text objects
        this.initPool();
    }

    /**
     * Initialize the text object pool
     */
    initPool() {
        for (let i = 0; i < this.poolSize; i++) {
            const text = this.scene.add.text(0, 0, '', {
                fontFamily: 'Arial, sans-serif',
                fontSize: '24px',
                fontStyle: 'bold',
                color: '#ffffff',
                stroke: '#000000',
                strokeThickness: 3
            });
            text.setOrigin(0.5);
            text.setVisible(false);
            text.setDepth(100);
            this.pool.push(text);
        }
    }

    /**
     * Get a text object from the pool
     */
    getFromPool() {
        // Find inactive text object
        const text = this.pool.find(t => !t.visible);

        if (text) {
            return text;
        }

        // All in use, create new one
        const newText = this.scene.add.text(0, 0, '', {
            fontFamily: 'Arial, sans-serif',
            fontSize: '24px',
            fontStyle: 'bold',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 3
        });
        newText.setOrigin(0.5);
        newText.setDepth(100);
        this.pool.push(newText);
        return newText;
    }

    /**
     * Show a score popup at position
     * @param {number} x - X position
     * @param {number} y - Y position
     * @param {number} score - Score value to display
     * @param {number} [color=0xffffff] - Text tint color
     */
    show(x, y, score, color = 0xffffff) {
        const text = this.getFromPool();

        // Set text and position
        text.setText(`+${score}`);
        text.setPosition(x, y);
        text.setTint(color);
        text.setVisible(true);
        text.setAlpha(1);
        text.setScale(0.5);

        // Animate: scale up, rise, fade out
        this.scene.tweens.add({
            targets: text,
            y: y - EFFECTS.POPUP_RISE,
            alpha: 0,
            scale: 1.2,
            duration: EFFECTS.POPUP_DURATION,
            ease: 'Cubic.easeOut',
            onComplete: () => {
                text.setVisible(false);
            }
        });
    }

    /**
     * Show combo popup for multiple hits
     * @param {number} x - X position
     * @param {number} y - Y position
     * @param {number} combo - Combo count
     */
    showCombo(x, y, combo) {
        const text = this.getFromPool();

        text.setText(`${combo}x COMBO!`);
        text.setPosition(x, y);
        text.setTint(0xffff00);
        text.setVisible(true);
        text.setAlpha(1);
        text.setScale(0.3);

        // More dramatic animation for combos
        this.scene.tweens.add({
            targets: text,
            y: y - EFFECTS.POPUP_RISE * 1.5,
            alpha: 0,
            scale: 1.5,
            duration: EFFECTS.POPUP_DURATION * 1.2,
            ease: 'Back.easeOut',
            onComplete: () => {
                text.setVisible(false);
            }
        });
    }

    /**
     * Clean up
     */
    destroy() {
        this.pool.forEach(text => text.destroy());
        this.pool = [];
    }
}
