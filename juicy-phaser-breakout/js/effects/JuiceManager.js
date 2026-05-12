/**
 * Juice Manager
 *
 * Central controller for all "juice" effects in the game.
 * Each effect can be toggled on/off independently.
 *
 * The term "juice" refers to small effects that make games
 * feel more satisfying and responsive. From the GDC talk
 * "Juice It or Lose It" by Martin Jonasson & Petri Purho.
 *
 * Effects included:
 * - Tweening: Smooth paddle movement with easing
 * - Ball Trails: Particle trail following the ball
 * - Screen Shake: Camera shake on impacts
 * - Particles: Explosion particles when bricks break
 * - Squash & Stretch: Deformation on impact
 * - Color Flash: White flash on hit
 * - Brick Animations: Animated brick destruction
 * - Sound Effects: Audio feedback
 * - Score Popups: Floating score text
 * - Smooth Ball: Interpolated ball movement
 */

import { JUICE_EFFECTS } from '../constants.js';

export class JuiceManager {
    constructor(scene) {
        this.scene = scene;

        // Initialize all effects as enabled by default
        this.effects = {};
        Object.values(JUICE_EFFECTS).forEach(effect => {
            this.effects[effect] = true;
        });

        // Event emitter for toggle changes
        this.events = new Phaser.Events.EventEmitter();
    }

    /**
     * Check if an effect is currently enabled
     * @param {string} effect - Effect key from JUICE_EFFECTS
     * @returns {boolean}
     */
    isEnabled(effect) {
        return this.effects[effect] === true;
    }

    /**
     * Toggle an effect on/off
     * @param {string} effect - Effect key from JUICE_EFFECTS
     * @param {boolean} [value] - Optional explicit value, otherwise toggles
     */
    toggle(effect, value) {
        if (value !== undefined) {
            this.effects[effect] = value;
        } else {
            this.effects[effect] = !this.effects[effect];
        }
        this.events.emit('toggleChanged', effect, this.effects[effect]);
    }

    /**
     * Enable all effects
     */
    enableAll() {
        Object.values(JUICE_EFFECTS).forEach(effect => {
            this.effects[effect] = true;
        });
        this.events.emit('allChanged', true);
    }

    /**
     * Disable all effects
     */
    disableAll() {
        Object.values(JUICE_EFFECTS).forEach(effect => {
            this.effects[effect] = false;
        });
        this.events.emit('allChanged', false);
    }

    /**
     * Get the current state of all effects
     * @returns {Object} Map of effect -> boolean
     */
    getState() {
        return { ...this.effects };
    }

    /**
     * Get count of enabled effects
     * @returns {number}
     */
    getEnabledCount() {
        return Object.values(this.effects).filter(v => v).length;
    }

    /**
     * Get total number of effects
     * @returns {number}
     */
    getTotalCount() {
        return Object.keys(this.effects).length;
    }
}
