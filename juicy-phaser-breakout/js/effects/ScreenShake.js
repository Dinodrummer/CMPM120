/**
 * Screen Shake Effect
 *
 * Shakes the camera briefly to add impact to events.
 *
 * Why it works:
 * - Communicates force and impact
 * - Draws attention to important events
 * - Makes destruction feel more powerful
 *
 * From "Juice It or Lose It": Screen shake is one of the most
 * impactful effects you can add with minimal code.
 */

import { EFFECTS } from '../constants.js';

export class ScreenShake {
    constructor(scene) {
        this.scene = scene;
        this.camera = scene.cameras.main;
    }

    /**
     * Trigger a camera shake
     * @param {number} [intensity] - Shake intensity (0-1)
     * @param {number} [duration] - Duration in ms
     */
    shake(intensity = EFFECTS.SHAKE_INTENSITY, duration = EFFECTS.SHAKE_DURATION) {
        // Use Phaser's built-in camera shake
        this.camera.shake(duration, intensity);
    }

    /**
     * Strong shake for significant events
     */
    shakeStrong() {
        this.shake(EFFECTS.SHAKE_INTENSITY * 2, EFFECTS.SHAKE_DURATION * 1.5);
    }

    /**
     * Light shake for minor events
     */
    shakeLight() {
        this.shake(EFFECTS.SHAKE_INTENSITY * 0.5, EFFECTS.SHAKE_DURATION * 0.5);
    }
}
