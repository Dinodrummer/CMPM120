/**
 * Brick Class
 *
 * Individual brick that can be destroyed by the ball.
 * This is the BEST example of juice effects working together!
 *
 * Juice Effects Demonstrated:
 * - PARTICLES: Explosion particles on destruction
 * - SCREEN_SHAKE: Camera shake on hit
 * - COLOR_FLASH: White flash on hit
 * - BRICK_ANIMATIONS: Animated destruction (scale/rotate/fall)
 * - SCORE_POPUPS: Floating score text
 * - SOUND_EFFECTS: Audio feedback
 *
 * Compare destroyWithJuice() with instant removal to feel the difference!
 */

import { BRICK, JUICE_EFFECTS, EFFECTS } from '../constants.js';

export class Brick extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, color, points, row) {
        super(scene, x, y, 'brick');

        // Add to scene and physics
        scene.add.existing(this);
        scene.physics.add.existing(this, true); // true = static body

        // Apply color tint
        this.setTint(color);

        // Store properties
        this.brickColor = color;
        this.points = points;
        this.row = row;

        // Store reference to juice manager
        this.juiceManager = scene.juiceManager;

        // Track destruction state
        this.isDestroying = false;
    }

    /**
     * Destroy the brick with all juice effects
     * This method demonstrates multiple effects working together
     */
    destroyWithJuice() {
        // Prevent multiple destruction calls
        if (this.isDestroying) return;
        this.isDestroying = true;

        // Disable physics immediately so ball doesn't re-collide
        this.body.enable = false;

        // Mark as inactive immediately for win detection
        // (visual destruction may be delayed by effects)
        this.setActive(false);

        // === SCREEN SHAKE ===
        // Camera shake adds weight to destruction
        if (this.juiceManager.isEnabled(JUICE_EFFECTS.SCREEN_SHAKE)) {
            this.scene.screenShake.shake();
        }

        // === PARTICLES ===
        // Explosion particles make destruction more satisfying
        if (this.juiceManager.isEnabled(JUICE_EFFECTS.PARTICLES)) {
            this.scene.particleEffects.explode(this.x, this.y, this.brickColor);
        }

        // === SOUND EFFECTS ===
        // Audio feedback reinforces the visual
        if (this.juiceManager.isEnabled(JUICE_EFFECTS.SOUND_EFFECTS)) {
            this.scene.audioManager.playBrickBreak(this.row);
        }

        // === SCORE POPUP ===
        // Floating numbers show points earned
        if (this.juiceManager.isEnabled(JUICE_EFFECTS.SCORE_POPUPS)) {
            this.scene.scorePopup.show(this.x, this.y, this.points);
        }

        // === COLOR FLASH + BRICK ANIMATION ===
        // Flash white, then destroy (with or without animation)
        if (this.juiceManager.isEnabled(JUICE_EFFECTS.COLOR_FLASH)) {
            // Flash white first
            this.setTint(0xffffff);

            // After flash duration, proceed with destruction
            this.scene.time.delayedCall(EFFECTS.FLASH_DURATION, () => {
                this.setTint(this.brickColor);
                this.finishDestroy();
            });
        } else {
            // No flash - destroy immediately
            this.finishDestroy();
        }
    }

    /**
     * Complete the destruction (called after flash if enabled)
     */
    finishDestroy() {
        if (this.juiceManager.isEnabled(JUICE_EFFECTS.BRICK_ANIMATIONS)) {
            this.animatedDestroy();
        } else {
            // No animation - instant removal
            this.destroy();
        }
    }

    /**
     * Animated brick destruction
     * Scales down, rotates, and fades out
     */
    animatedDestroy() {
        // Random rotation direction
        const rotationDir = Phaser.Math.Between(0, 1) ? 1 : -1;

        // Animate out with multiple properties
        this.scene.tweens.add({
            targets: this,
            scaleX: 0,
            scaleY: 0,
            rotation: rotationDir * Phaser.Math.DegToRad(45),
            alpha: 0,
            y: this.y + 30,
            duration: 200,
            ease: 'Back.easeIn',
            onComplete: () => {
                this.destroy();
            }
        });
    }

    /**
     * Wobble effect - called when nearby bricks are hit
     * Adds life to the brick grid
     */
    wobble() {
        if (!this.juiceManager.isEnabled(JUICE_EFFECTS.BRICK_ANIMATIONS)) {
            return;
        }

        if (this.isDestroying) return;

        // Quick scale wobble
        this.scene.tweens.add({
            targets: this,
            scaleX: 1.1,
            scaleY: 0.9,
            duration: 50,
            yoyo: true,
            ease: 'Sine.easeInOut'
        });
    }
}
