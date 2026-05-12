/**
 * Particle Effects
 *
 * Handles particle systems for trails and explosions.
 *
 * Why particles work:
 * - Show motion and direction (trails)
 * - Make destruction satisfying (explosions)
 * - Add visual complexity without gameplay cost
 * - Guide player attention
 *
 * From "Juice It or Lose It": Particles are cheap and powerful.
 * A few particles can transform how an action feels.
 */

import { PARTICLES } from '../constants.js';

export class ParticleEffects {
    constructor(scene) {
        this.scene = scene;

        // Create particle emitters
        this.createTrailEmitter();
        this.createExplosionEmitter();
    }

    /**
     * Create the ball trail particle emitter
     */
    createTrailEmitter() {
        this.trailEmitter = this.scene.add.particles(0, 0, 'particle', {
            speed: { min: 10, max: 30 },
            scale: { start: 0.5, end: 0 },
            alpha: { start: 0.6, end: 0 },
            lifespan: PARTICLES.TRAIL_LIFESPAN,
            blendMode: 'ADD',
            frequency: 20,
            emitting: false
        });

        // Set depth so particles appear behind ball
        this.trailEmitter.setDepth(-1);
    }

    /**
     * Create the brick explosion particle emitter
     */
    createExplosionEmitter() {
        this.explosionEmitter = this.scene.add.particles(0, 0, 'particle', {
            speed: PARTICLES.EXPLOSION_SPEED,
            scale: { start: 0.8, end: 0 },
            alpha: { start: 1, end: 0 },
            lifespan: PARTICLES.EXPLOSION_LIFESPAN,
            blendMode: 'ADD',
            gravityY: 200,
            emitting: false
        });
    }

    /**
     * Start trail following the ball
     * @param {Ball} ball - Ball sprite to follow
     */
    startTrail(ball) {
        this.trailEmitter.startFollow(ball);
        this.trailEmitter.start();
    }

    /**
     * Stop the trail
     */
    stopTrail() {
        this.trailEmitter.stop();
        this.trailEmitter.stopFollow();
    }

    /**
     * Create explosion at position
     * @param {number} x - X position
     * @param {number} y - Y position
     * @param {number} color - Tint color for particles
     */
    explode(x, y, color) {
        // Set particle tint to match brick color
        this.explosionEmitter.setParticleTint(color);

        // Emit particles at position
        this.explosionEmitter.emitParticleAt(x, y, PARTICLES.EXPLOSION_QUANTITY);
    }

    /**
     * Update trail state based on juice settings
     * @param {Ball} ball - Ball sprite
     * @param {boolean} enabled - Whether trail should be active
     */
    updateTrail(ball, enabled) {
        if (enabled && ball.isLaunched) {
            if (!this.trailEmitter.emitting) {
                this.startTrail(ball);
            }
        } else {
            if (this.trailEmitter.emitting) {
                this.stopTrail();
            }
        }
    }

    /**
     * Clean up
     */
    destroy() {
        this.trailEmitter.destroy();
        this.explosionEmitter.destroy();
    }
}
