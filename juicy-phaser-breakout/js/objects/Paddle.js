/**
 * Paddle Class
 *
 * The player-controlled paddle at the bottom of the screen.
 *
 * Juice Effects Demonstrated:
 * - TWEENING: When enabled, paddle smoothly eases to mouse position
 *   instead of instantly teleporting. This adds weight and polish.
 * - SQUASH_STRETCH: Paddle squashes on ball impact.
 * - PADDLE_EYES: Googly eyes that track the ball - adds personality!
 */

import { PADDLE, GAME, JUICE_EFFECTS, EFFECTS } from '../constants.js';

export class Paddle extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'paddle');

        // Add to scene and physics
        scene.add.existing(this);
        scene.physics.add.existing(this, false);

        // Configure physics body
        this.body.setImmovable(true);
        this.body.setCollideWorldBounds(true);

        // Apply tint
        this.setTint(PADDLE.COLOR);

        // Store reference to juice manager
        this.juiceManager = scene.juiceManager;

        // Target position for tweened movement
        this.targetX = x;

        // Track if currently tweening
        this.currentTween = null;

        // Create googly eyes
        this.createEyes();
    }

    /**
     * Create the googly eyes
     * Eyes sit on top of the paddle and track the ball
     */
    createEyes() {
        const eyeOffsetY = -PADDLE.HEIGHT / 2 - PADDLE.EYE_RADIUS + 2;

        // Left eye (white part)
        this.leftEye = this.scene.add.image(
            this.x - PADDLE.EYE_SPACING / 2,
            this.y + eyeOffsetY,
            'eye'
        );
        this.leftEye.setDepth(10);

        // Left pupil
        this.leftPupil = this.scene.add.image(
            this.x - PADDLE.EYE_SPACING / 2,
            this.y + eyeOffsetY,
            'pupil'
        );
        this.leftPupil.setDepth(11);

        // Right eye (white part)
        this.rightEye = this.scene.add.image(
            this.x + PADDLE.EYE_SPACING / 2,
            this.y + eyeOffsetY,
            'eye'
        );
        this.rightEye.setDepth(10);

        // Right pupil
        this.rightPupil = this.scene.add.image(
            this.x + PADDLE.EYE_SPACING / 2,
            this.y + eyeOffsetY,
            'pupil'
        );
        this.rightPupil.setDepth(11);

        // Initially hidden (will show if effect is enabled)
        this.setEyesVisible(false);
    }

    /**
     * Update paddle position based on input
     * Called every frame from GameScene
     */
    update(mouseX, ball) {
        // Clamp target to keep paddle on screen
        const halfWidth = PADDLE.WIDTH / 2;
        this.targetX = Phaser.Math.Clamp(
            mouseX,
            halfWidth,
            GAME.PLAYFIELD_WIDTH - halfWidth
        );

        if (this.juiceManager.isEnabled(JUICE_EFFECTS.TWEENING)) {
            // Smooth tweened movement
            this.moveWithTween();
        } else {
            // Instant movement (no juice)
            this.x = this.targetX;
        }

        // Update eyes
        this.updateEyes(ball);
    }

    /**
     * Move paddle with smooth easing
     * This is the "tweening" juice effect
     */
    moveWithTween() {
        // Use lerp for smooth following
        // Lerp = Linear Interpolation: gradually moves current value toward target
        const distance = this.targetX - this.x;

        // Only tween if there's significant distance
        if (Math.abs(distance) > 1) {
            this.x += distance * PADDLE.LERP_FACTOR;
        } else {
            this.x = this.targetX;
        }
    }

    /**
     * Update the googly eyes to track the ball
     */
    updateEyes(ball) {
        const eyesEnabled = this.juiceManager.isEnabled(JUICE_EFFECTS.PADDLE_EYES);
        this.setEyesVisible(eyesEnabled);

        if (!eyesEnabled) return;

        const eyeOffsetY = -PADDLE.HEIGHT / 2 - PADDLE.EYE_RADIUS + 2;

        // Position eyes relative to paddle
        const leftEyeX = this.x - PADDLE.EYE_SPACING / 2;
        const rightEyeX = this.x + PADDLE.EYE_SPACING / 2;
        const eyeY = this.y + eyeOffsetY;

        this.leftEye.setPosition(leftEyeX, eyeY);
        this.rightEye.setPosition(rightEyeX, eyeY);

        // Calculate pupil positions (track the ball)
        const maxPupilOffset = PADDLE.EYE_RADIUS - PADDLE.PUPIL_RADIUS - 1;

        if (ball) {
            // Left pupil tracks ball
            this.positionPupil(this.leftPupil, leftEyeX, eyeY, ball.x, ball.y, maxPupilOffset);

            // Right pupil tracks ball
            this.positionPupil(this.rightPupil, rightEyeX, eyeY, ball.x, ball.y, maxPupilOffset);
        } else {
            // No ball, center pupils
            this.leftPupil.setPosition(leftEyeX, eyeY);
            this.rightPupil.setPosition(rightEyeX, eyeY);
        }
    }

    /**
     * Position a pupil to look toward a target
     */
    positionPupil(pupil, eyeX, eyeY, targetX, targetY, maxOffset) {
        // Calculate angle to target
        const dx = targetX - eyeX;
        const dy = targetY - eyeY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > 0) {
            // Normalize and scale by max offset
            const offsetX = (dx / distance) * maxOffset;
            const offsetY = (dy / distance) * maxOffset;

            pupil.setPosition(eyeX + offsetX, eyeY + offsetY);
        } else {
            pupil.setPosition(eyeX, eyeY);
        }
    }

    /**
     * Show or hide the eyes
     */
    setEyesVisible(visible) {
        this.leftEye.setVisible(visible);
        this.leftPupil.setVisible(visible);
        this.rightEye.setVisible(visible);
        this.rightPupil.setVisible(visible);
    }

    /**
     * Apply squash effect on ball impact
     * Called from GameScene on collision
     */
    squash() {
        if (!this.juiceManager.isEnabled(JUICE_EFFECTS.SQUASH_STRETCH)) {
            return;
        }

        // Stop any existing tween
        if (this.squashTween) {
            this.squashTween.stop();
        }

        // Squash: wider and shorter
        this.squashTween = this.scene.tweens.add({
            targets: this,
            scaleX: EFFECTS.SQUASH_SCALE.x,
            scaleY: EFFECTS.SQUASH_SCALE.y,
            duration: 50,
            yoyo: true,
            ease: 'Quad.easeOut'
        });
    }

    /**
     * Reset paddle to center
     */
    reset() {
        this.x = GAME.PLAYFIELD_WIDTH / 2;
        this.targetX = GAME.PLAYFIELD_WIDTH / 2;
        this.setScale(1, 1);
    }
}
