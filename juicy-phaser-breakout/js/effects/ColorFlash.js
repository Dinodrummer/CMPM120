/**
 * Color Flash Effect
 *
 * Flashes sprites white on impact.
 *
 * Why color flash works:
 * - Instant visual feedback for collisions
 * - Makes impacts feel more powerful
 * - Draws attention to hit objects
 * - Simple to implement, high impact
 *
 * From "Juice It or Lose It": A white flash is one of the
 * simplest ways to make hits feel impactful.
 */

import { EFFECTS } from '../constants.js';

export class ColorFlash {
    constructor(scene) {
        this.scene = scene;
    }

    /**
     * Flash a sprite white then return to original tint
     * @param {Phaser.GameObjects.Sprite} sprite - Target sprite
     * @param {number} [originalTint] - Original tint to restore (default: clear tint)
     * @param {number} [duration] - Flash duration in ms
     */
    flash(sprite, originalTint = null, duration = EFFECTS.FLASH_DURATION) {
        // Set to white
        sprite.setTint(0xffffff);

        // Return to original after delay
        this.scene.time.delayedCall(duration, () => {
            if (sprite.active) {
                if (originalTint !== null) {
                    sprite.setTint(originalTint);
                } else {
                    sprite.clearTint();
                }
            }
        });
    }

    /**
     * Flash sprite with a specific color
     * @param {Phaser.GameObjects.Sprite} sprite - Target sprite
     * @param {number} flashColor - Color to flash
     * @param {number} [originalTint] - Original tint to restore
     * @param {number} [duration] - Flash duration in ms
     */
    flashColor(sprite, flashColor, originalTint = null, duration = EFFECTS.FLASH_DURATION) {
        sprite.setTint(flashColor);

        this.scene.time.delayedCall(duration, () => {
            if (sprite.active) {
                if (originalTint !== null) {
                    sprite.setTint(originalTint);
                } else {
                    sprite.clearTint();
                }
            }
        });
    }

    /**
     * Pulse effect - flash multiple times
     * @param {Phaser.GameObjects.Sprite} sprite - Target sprite
     * @param {number} [count=3] - Number of flashes
     * @param {number} [originalTint] - Original tint to restore
     */
    pulse(sprite, count = 3, originalTint = null) {
        let flashCount = 0;

        const doFlash = () => {
            if (flashCount >= count || !sprite.active) return;

            sprite.setTint(0xffffff);

            this.scene.time.delayedCall(EFFECTS.FLASH_DURATION / 2, () => {
                if (sprite.active) {
                    if (originalTint !== null) {
                        sprite.setTint(originalTint);
                    } else {
                        sprite.clearTint();
                    }
                }

                flashCount++;
                if (flashCount < count) {
                    this.scene.time.delayedCall(EFFECTS.FLASH_DURATION / 2, doFlash);
                }
            });
        };

        doFlash();
    }

    /**
     * Screen flash effect (flash overlay)
     * @param {number} [color=0xffffff] - Flash color
     * @param {number} [duration=100] - Duration in ms
     */
    screenFlash(color = 0xffffff, duration = 100) {
        // Create full-screen rectangle
        const flash = this.scene.add.rectangle(
            this.scene.cameras.main.centerX,
            this.scene.cameras.main.centerY,
            this.scene.cameras.main.width,
            this.scene.cameras.main.height,
            color
        );
        flash.setAlpha(0.3);
        flash.setDepth(1000);

        // Fade out and destroy
        this.scene.tweens.add({
            targets: flash,
            alpha: 0,
            duration: duration,
            onComplete: () => {
                flash.destroy();
            }
        });
    }
}
