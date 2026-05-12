/**
 * Squash and Stretch Utilities
 *
 * Helper functions for squash and stretch animations.
 *
 * Why squash and stretch works:
 * - One of the 12 principles of animation (Disney)
 * - Makes objects feel like they have weight and flexibility
 * - Communicates impact force visually
 * - Makes rigid objects feel more alive
 *
 * From "Juice It or Lose It": Even simple geometric shapes
 * feel more natural when they squash and stretch on impact.
 *
 * Key principle: Volume preservation - when squashing horizontally,
 * stretch vertically (and vice versa) to maintain apparent volume.
 */

import { EFFECTS } from '../constants.js';

export class SquashStretch {
    constructor(scene) {
        this.scene = scene;
    }

    /**
     * Apply squash effect (compress horizontally, expand vertically)
     * @param {Phaser.GameObjects.Sprite} sprite - Target sprite
     * @param {number} [duration=50] - Animation duration
     * @param {function} [onComplete] - Callback when complete
     */
    squash(sprite, duration = 50, onComplete) {
        this.scene.tweens.add({
            targets: sprite,
            scaleX: EFFECTS.SQUASH_SCALE.x,
            scaleY: EFFECTS.SQUASH_SCALE.y,
            duration: duration,
            yoyo: true,
            ease: 'Quad.easeOut',
            onComplete: onComplete
        });
    }

    /**
     * Apply stretch effect (expand horizontally, compress vertically)
     * @param {Phaser.GameObjects.Sprite} sprite - Target sprite
     * @param {number} [duration=50] - Animation duration
     * @param {function} [onComplete] - Callback when complete
     */
    stretch(sprite, duration = 50, onComplete) {
        this.scene.tweens.add({
            targets: sprite,
            scaleX: EFFECTS.STRETCH_SCALE.x,
            scaleY: EFFECTS.STRETCH_SCALE.y,
            duration: duration,
            yoyo: true,
            ease: 'Quad.easeOut',
            onComplete: onComplete
        });
    }

    /**
     * Apply bounce effect (squash then stretch, good for landings)
     * @param {Phaser.GameObjects.Sprite} sprite - Target sprite
     * @param {number} [intensity=1] - Effect intensity multiplier
     */
    bounce(sprite, intensity = 1) {
        this.scene.tweens.timeline({
            targets: sprite,
            tweens: [
                {
                    scaleX: 1 + (EFFECTS.SQUASH_SCALE.x - 1) * intensity,
                    scaleY: 1 - (1 - EFFECTS.SQUASH_SCALE.y) * intensity,
                    duration: 50,
                    ease: 'Quad.easeOut'
                },
                {
                    scaleX: 1 - (1 - EFFECTS.STRETCH_SCALE.x) * intensity * 0.5,
                    scaleY: 1 + (EFFECTS.STRETCH_SCALE.y - 1) * intensity * 0.5,
                    duration: 80,
                    ease: 'Quad.easeInOut'
                },
                {
                    scaleX: 1,
                    scaleY: 1,
                    duration: 60,
                    ease: 'Quad.easeIn'
                }
            ]
        });
    }

    /**
     * Apply anticipation squash (good before jumps/launches)
     * @param {Phaser.GameObjects.Sprite} sprite - Target sprite
     * @param {function} onMidpoint - Callback at peak squash
     */
    anticipate(sprite, onMidpoint) {
        this.scene.tweens.add({
            targets: sprite,
            scaleX: EFFECTS.SQUASH_SCALE.x,
            scaleY: EFFECTS.SQUASH_SCALE.y,
            duration: 100,
            ease: 'Quad.easeIn',
            onComplete: () => {
                if (onMidpoint) onMidpoint();

                // Return to normal
                this.scene.tweens.add({
                    targets: sprite,
                    scaleX: 1,
                    scaleY: 1,
                    duration: 50,
                    ease: 'Quad.easeOut'
                });
            }
        });
    }
}
