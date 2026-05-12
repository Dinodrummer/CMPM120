/**
 * Boot Scene
 *
 * Generates all game textures programmatically using Phaser's Graphics API.
 * No external image files needed!
 *
 * This approach is great for:
 * - Quick prototyping
 * - Reducing load times
 * - Easy customization via code
 */

import { BALL, PADDLE, BRICK } from '../constants.js';

export class BootScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BootScene' });
    }

    create() {
        this.createBallTexture();
        this.createPaddleTexture();
        this.createBrickTexture();
        this.createParticleTexture();
        this.createEyeTextures();

        // Move to game scene
        this.scene.start('GameScene');
    }

    /**
     * Creates a circular ball texture
     */
    createBallTexture() {
        const graphics = this.make.graphics({ x: 0, y: 0, add: false });

        // Draw filled circle
        graphics.fillStyle(0xffffff, 1);
        graphics.fillCircle(BALL.RADIUS, BALL.RADIUS, BALL.RADIUS);

        // Generate texture from graphics
        graphics.generateTexture('ball', BALL.RADIUS * 2, BALL.RADIUS * 2);
        graphics.destroy();
    }

    /**
     * Creates a rounded rectangle paddle texture
     */
    createPaddleTexture() {
        const graphics = this.make.graphics({ x: 0, y: 0, add: false });

        // Draw rounded rectangle
        graphics.fillStyle(0xffffff, 1);
        graphics.fillRoundedRect(0, 0, PADDLE.WIDTH, PADDLE.HEIGHT, 8);

        graphics.generateTexture('paddle', PADDLE.WIDTH, PADDLE.HEIGHT);
        graphics.destroy();
    }

    /**
     * Creates a brick texture (tinted per-instance)
     */
    createBrickTexture() {
        const graphics = this.make.graphics({ x: 0, y: 0, add: false });

        // Draw rectangle with slight rounding
        graphics.fillStyle(0xffffff, 1);
        graphics.fillRoundedRect(0, 0, BRICK.WIDTH, BRICK.HEIGHT, 4);

        graphics.generateTexture('brick', BRICK.WIDTH, BRICK.HEIGHT);
        graphics.destroy();
    }

    /**
     * Creates a small particle texture for effects
     */
    createParticleTexture() {
        const graphics = this.make.graphics({ x: 0, y: 0, add: false });

        // Small circle for particles
        graphics.fillStyle(0xffffff, 1);
        graphics.fillCircle(4, 4, 4);

        graphics.generateTexture('particle', 8, 8);
        graphics.destroy();
    }

    /**
     * Creates eye textures for the paddle's googly eyes
     */
    createEyeTextures() {
        const eyeRadius = PADDLE.EYE_RADIUS;
        const pupilRadius = PADDLE.PUPIL_RADIUS;

        // White part of eye (sclera)
        const eyeGraphics = this.make.graphics({ x: 0, y: 0, add: false });
        eyeGraphics.fillStyle(0xffffff, 1);
        eyeGraphics.fillCircle(eyeRadius, eyeRadius, eyeRadius);
        eyeGraphics.lineStyle(1, 0x000000, 0.3);
        eyeGraphics.strokeCircle(eyeRadius, eyeRadius, eyeRadius);
        eyeGraphics.generateTexture('eye', eyeRadius * 2, eyeRadius * 2);
        eyeGraphics.destroy();

        // Pupil (black dot)
        const pupilGraphics = this.make.graphics({ x: 0, y: 0, add: false });
        pupilGraphics.fillStyle(0x000000, 1);
        pupilGraphics.fillCircle(pupilRadius, pupilRadius, pupilRadius);
        pupilGraphics.generateTexture('pupil', pupilRadius * 2, pupilRadius * 2);
        pupilGraphics.destroy();
    }
}
