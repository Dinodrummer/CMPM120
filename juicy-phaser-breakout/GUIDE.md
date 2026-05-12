# Juicy Phaser Breakout - Educational Guide

This project demonstrates "juice" effects from the famous Nordic Game talk ["Juice It or Lose It"](https://www.youtube.com/watch?v=Fy0aCDmgnxg) by Martin Jonasson and Petri Purho. Each effect can be toggled on/off to feel the difference it makes.

## Table of Contents

1. [Project Structure](#project-structure)
2. [Core Architecture](#core-architecture)
3. [The Toggle System](#the-toggle-system)
4. [Juice Effects](#juice-effects)
   - [Tweening](#1-tweening)
   - [Ball Trails](#2-ball-trails)
   - [Screen Shake](#3-screen-shake)
   - [Particles](#4-particles)
   - [Squash & Stretch](#5-squash--stretch)
   - [Color Flash](#6-color-flash)
   - [Brick Animations](#7-brick-animations)
   - [Sound Effects](#8-sound-effects)
   - [Score Popups](#9-score-popups)
   - [Paddle Eyes](#10-paddle-eyes)
5. [Key Takeaways](#key-takeaways)

---

## Project Structure

```
juicy-phaser-breakout/
├── index.html                 # Entry point, loads Phaser from CDN
├── js/
│   ├── main.js                # Game config and initialization
│   ├── constants.js           # All tunable values in one place
│   ├── scenes/
│   │   ├── BootScene.js       # Generates textures programmatically
│   │   ├── GameScene.js       # Main gameplay logic
│   │   └── UIScene.js         # Toggle panel overlay
│   ├── objects/
│   │   ├── Ball.js            # Ball with squash/stretch
│   │   ├── Paddle.js          # Paddle with tweening and eyes
│   │   ├── Brick.js           # Brick with destruction effects
│   │   └── BrickGrid.js       # Grid layout manager
│   ├── effects/
│   │   ├── JuiceManager.js    # Central toggle controller
│   │   ├── ScreenShake.js     # Camera shake helper
│   │   ├── ParticleEffects.js # Trail and explosion emitters
│   │   ├── SquashStretch.js   # Scale animation utilities
│   │   ├── ScorePopup.js      # Floating score text
│   │   └── ColorFlash.js      # Tint flash effect
│   ├── ui/
│   │   ├── TogglePanel.js     # Interactive toggle switches
│   │   └── ScoreDisplay.js    # Score and lives display
│   └── utils/
│       └── AudioManager.js    # Web Audio synthesis
```

### No External Assets

All graphics are generated programmatically in `BootScene.js` using Phaser's Graphics API. Audio is synthesized using the Web Audio API. This means:

- Zero loading time for assets
- Easy to customize colors and sizes via code
- Great for prototyping

---

## Core Architecture

### Scene Structure

The game uses three Phaser scenes:

1. **BootScene** - Runs once at startup to generate textures, then transitions to GameScene
2. **GameScene** - Main gameplay, physics, and game logic
3. **UIScene** - Runs as an overlay on top of GameScene for the toggle panel

```javascript
// UIScene runs on top of GameScene
this.scene.launch('UIScene');
```

### Centralized Constants

All tunable values live in `constants.js`:

```javascript
export const PADDLE = {
    WIDTH: 120,
    HEIGHT: 20,
    LERP_FACTOR: 0.08,  // Change this to adjust tweening feel
    // ...
};

export const EFFECTS = {
    SHAKE_INTENSITY: 0.005,
    SHAKE_DURATION: 100,
    FLASH_DURATION: 100,
    // ...
};
```

This makes it easy for students to experiment with values without hunting through code.

---

## The Toggle System

### JuiceManager

The `JuiceManager` class (`js/effects/JuiceManager.js`) is the central controller for all effects:

```javascript
export class JuiceManager {
    constructor(scene) {
        this.effects = {};
        // All effects start enabled
        Object.values(JUICE_EFFECTS).forEach(effect => {
            this.effects[effect] = true;
        });
    }

    isEnabled(effect) {
        return this.effects[effect] === true;
    }

    toggle(effect) {
        this.effects[effect] = !this.effects[effect];
    }
}
```

### Using the Toggle System

Before applying any juice effect, check if it's enabled:

```javascript
// In Brick.js
if (this.juiceManager.isEnabled(JUICE_EFFECTS.SCREEN_SHAKE)) {
    this.scene.screenShake.shake();
}

if (this.juiceManager.isEnabled(JUICE_EFFECTS.PARTICLES)) {
    this.scene.particleEffects.explode(this.x, this.y, this.brickColor);
}
```

This pattern allows effects to be toggled independently without changing game logic.

---

## Juice Effects

### 1. Tweening

**What it does:** Makes the paddle smoothly follow the mouse instead of snapping instantly.

**Why it works:** Adds a sense of weight and physicality. The paddle feels like it has mass rather than being a weightless cursor.

**Implementation** (`js/objects/Paddle.js`):

```javascript
update(mouseX, ball) {
    this.targetX = Phaser.Math.Clamp(mouseX, halfWidth, maxX);

    if (this.juiceManager.isEnabled(JUICE_EFFECTS.TWEENING)) {
        // Smooth movement using linear interpolation
        const distance = this.targetX - this.x;
        if (Math.abs(distance) > 1) {
            this.x += distance * PADDLE.LERP_FACTOR;
        }
    } else {
        // Instant movement (no juice)
        this.x = this.targetX;
    }
}
```

**Key Concept - Linear Interpolation (Lerp):**
Instead of jumping to the target, move a percentage of the remaining distance each frame. With `LERP_FACTOR = 0.08`, the paddle moves 8% of the distance to the target each frame, creating smooth deceleration.

---

### 2. Ball Trails

**What it does:** Leaves a fading particle trail behind the ball as it moves.

**Why it works:** Shows motion history, making the ball's path visible. Adds visual interest and helps players track fast-moving objects.

**Implementation** (`js/effects/ParticleEffects.js`):

```javascript
createTrailEmitter() {
    this.trailEmitter = this.scene.add.particles(0, 0, 'particle', {
        speed: { min: 10, max: 30 },
        scale: { start: 0.5, end: 0 },      // Shrink as they age
        alpha: { start: 0.6, end: 0 },      // Fade out
        lifespan: 300,
        blendMode: 'ADD',                    // Additive blending for glow
        frequency: 20,                       // Emit every 20ms
        emitting: false
    });
}

startTrail(ball) {
    this.trailEmitter.startFollow(ball);    // Follow the ball
    this.trailEmitter.start();
}
```

**Key Concept - Particle Following:**
Phaser's `startFollow()` automatically positions the emitter at the target's location each frame.

---

### 3. Screen Shake

**What it does:** Briefly shakes the camera when bricks are destroyed.

**Why it works:** Communicates impact force. Small shakes add weight to actions; the screen itself reacts to what's happening.

**Implementation** (`js/effects/ScreenShake.js`):

```javascript
shake(intensity = 0.005, duration = 100) {
    this.camera.shake(duration, intensity);
}
```

**Usage** (`js/objects/Brick.js`):

```javascript
if (this.juiceManager.isEnabled(JUICE_EFFECTS.SCREEN_SHAKE)) {
    this.scene.screenShake.shake();
}
```

**Key Concept - Subtlety:**
The shake intensity (0.005) is very small. Subtle effects often work better than dramatic ones - you feel it more than you see it.

---

### 4. Particles

**What it does:** Creates an explosion of particles when bricks break.

**Why it works:** Makes destruction feel satisfying. The brick doesn't just disappear - it explodes into pieces.

**Implementation** (`js/effects/ParticleEffects.js`):

```javascript
createExplosionEmitter() {
    this.explosionEmitter = this.scene.add.particles(0, 0, 'particle', {
        speed: { min: 50, max: 200 },       // Burst outward
        scale: { start: 0.8, end: 0 },
        alpha: { start: 1, end: 0 },
        lifespan: 400,
        blendMode: 'ADD',
        gravityY: 200,                       // Fall down
        emitting: false
    });
}

explode(x, y, color) {
    this.explosionEmitter.setParticleTint(color);  // Match brick color
    this.explosionEmitter.emitParticleAt(x, y, 15); // Burst 15 particles
}
```

**Key Concept - Color Matching:**
Particles are tinted to match the destroyed brick's color, maintaining visual coherence.

---

### 5. Squash & Stretch

**What it does:** Deforms the ball on impact - squashing when hitting something, stretching in the direction of movement.

**Why it works:** One of Disney's 12 principles of animation. Makes rigid objects feel alive and physical, even though they're just shapes.

**Implementation** (`js/objects/Ball.js`):

```javascript
// Stretch based on velocity (continuous)
applyVelocityStretch() {
    const speed = Math.sqrt(velX * velX + velY * velY);
    const stretchFactor = 1 + (speed / BALL.MAX_SPEED) * 0.2;

    // Rotate to face movement direction
    this.rotation = Math.atan2(velY, velX);

    // Stretch along movement axis
    this.scaleX = stretchFactor;
    this.scaleY = 1 / stretchFactor;  // Preserve volume
}

// Squash on impact (momentary)
onCollide() {
    this.scene.tweens.add({
        targets: this,
        scaleX: 0.7,
        scaleY: 1.3,
        duration: 50,
        yoyo: true,  // Return to normal
        ease: 'Quad.easeOut'
    });
}
```

**Key Concept - Volume Preservation:**
When squashing horizontally (`scaleX: 1.3`), stretch vertically (`scaleY: 0.7`) to maintain apparent volume. Objects that preserve volume feel more physical.

---

### 6. Color Flash

**What it does:** Flashes bricks white momentarily when hit before they're destroyed.

**Why it works:** Instant visual feedback. The player knows their action registered before the destruction animation even starts.

**Implementation** (`js/objects/Brick.js`):

```javascript
if (this.juiceManager.isEnabled(JUICE_EFFECTS.COLOR_FLASH)) {
    this.setTint(0xffffff);  // Flash white

    this.scene.time.delayedCall(EFFECTS.FLASH_DURATION, () => {
        this.setTint(this.brickColor);  // Restore color
        this.finishDestroy();            // Then destroy
    });
} else {
    this.finishDestroy();
}
```

**Key Concept - Sequencing:**
The flash must complete before destruction begins, otherwise it won't be visible. Effects should be sequenced thoughtfully.

---

### 7. Brick Animations

**What it does:** Bricks scale down, rotate, and fade out instead of disappearing instantly.

**Why it works:** Gives the eye time to register what happened. Instant removal feels abrupt; animated removal feels satisfying.

**Implementation** (`js/objects/Brick.js`):

```javascript
animatedDestroy() {
    const rotationDir = Phaser.Math.Between(0, 1) ? 1 : -1;  // Random direction

    this.scene.tweens.add({
        targets: this,
        scaleX: 0,
        scaleY: 0,
        rotation: rotationDir * Phaser.Math.DegToRad(45),
        alpha: 0,
        y: this.y + 30,       // Fall slightly
        duration: 200,
        ease: 'Back.easeIn',  // Accelerate into nothing
        onComplete: () => this.destroy()
    });
}
```

**Key Concept - Easing:**
`Back.easeIn` creates acceleration that feels like the brick is being sucked away. Different easing functions create different feels.

**Bonus - Neighbor Wobble:**
When a brick is hit, neighboring bricks wobble slightly:

```javascript
wobble() {
    this.scene.tweens.add({
        targets: this,
        scaleX: 1.1,
        scaleY: 0.9,
        duration: 50,
        yoyo: true
    });
}
```

---

### 8. Sound Effects

**What it does:** Plays synthesized sounds for collisions and events.

**Why it works:** Audio feedback reinforces visual feedback. Games feel hollow without sound.

**Implementation** (`js/utils/AudioManager.js`):

```javascript
playTone(frequency, duration, type = 'square') {
    const oscillator = this.context.createOscillator();
    const gainNode = this.context.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.context.destination);

    oscillator.type = type;
    oscillator.frequency.value = frequency;

    // Quick attack, exponential decay
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(volume, now + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + duration);

    oscillator.start(now);
    oscillator.stop(now + duration);
}

playBrickBreak(row) {
    // Higher rows = higher pitch (more satisfying for top bricks)
    const frequency = 400 + (4 - row) * 50;
    this.playTone(frequency, 0.1, 'square');
}
```

**Key Concept - Pitch Variation:**
Different brick rows play different pitches. This adds variety and subconsciously communicates that top bricks are worth more.

---

### 9. Score Popups

**What it does:** Shows floating "+10" text that rises and fades when bricks are destroyed.

**Why it works:** Celebrates the player's success. Every brick broken is a small win that deserves acknowledgment.

**Implementation** (`js/effects/ScorePopup.js`):

```javascript
show(x, y, score) {
    const text = this.getFromPool();  // Reuse text objects

    text.setText(`+${score}`);
    text.setPosition(x, y);
    text.setVisible(true);
    text.setAlpha(1);
    text.setScale(0.5);

    this.scene.tweens.add({
        targets: text,
        y: y - 50,        // Rise up
        alpha: 0,         // Fade out
        scale: 1.2,       // Grow slightly
        duration: 800,
        ease: 'Cubic.easeOut',
        onComplete: () => text.setVisible(false)
    });
}
```

**Key Concept - Object Pooling:**
Instead of creating/destroying text objects constantly, maintain a pool and reuse them. Better performance, no garbage collection stutters.

---

### 10. Paddle Eyes

**What it does:** Adds googly eyes to the paddle that track the ball's position.

**Why it works:** Instantly adds personality. The paddle becomes a character with awareness, not just a rectangle.

**Implementation** (`js/objects/Paddle.js`):

```javascript
updateEyes(ball) {
    // Position eyes on paddle
    const leftEyeX = this.x - PADDLE.EYE_SPACING / 2;
    const rightEyeX = this.x + PADDLE.EYE_SPACING / 2;

    this.leftEye.setPosition(leftEyeX, eyeY);
    this.rightEye.setPosition(rightEyeX, eyeY);

    // Point pupils toward ball
    this.positionPupil(this.leftPupil, leftEyeX, eyeY, ball.x, ball.y);
    this.positionPupil(this.rightPupil, rightEyeX, eyeY, ball.x, ball.y);
}

positionPupil(pupil, eyeX, eyeY, targetX, targetY, maxOffset) {
    const dx = targetX - eyeX;
    const dy = targetY - eyeY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Normalize and constrain to eye bounds
    const offsetX = (dx / distance) * maxOffset;
    const offsetY = (dy / distance) * maxOffset;

    pupil.setPosition(eyeX + offsetX, eyeY + offsetY);
}
```

**Key Concept - Look-At Behavior:**
Calculate the direction to the target, normalize it, then scale by the maximum pupil offset. The pupil always points toward the ball but stays within the eye.

---

## Key Takeaways

### 1. Feedback is Everything
Every player action should have immediate, clear feedback. Visual, audio, and physical (screen shake) feedback layers reinforce each other.

### 2. Subtlety Often Wins
Many effects are small - a slight shake, a brief flash, a small stretch. Subtle effects are felt more than seen, and they don't overwhelm.

### 3. Timing Matters
Effects should be sequenced properly. Flash before destroy. Squash on impact, stretch during movement. The order creates rhythm.

### 4. Consistency Creates Polish
Particles match brick colors. Sounds vary by row. Small consistencies add up to a cohesive feel.

### 5. Personality Through Animation
Squash/stretch and googly eyes transform geometric shapes into characters. Players connect with things that feel alive.

### 6. Always Allow Toggles (For Learning)
Being able to turn effects on/off is valuable for understanding their impact. Try playing with all effects off, then turn them on one by one.

---

## Experimenting

Try modifying these values in `constants.js`:

- `PADDLE.LERP_FACTOR` - Lower = more lag, higher = snappier
- `EFFECTS.SHAKE_INTENSITY` - Increase for more dramatic shakes
- `EFFECTS.FLASH_DURATION` - Longer flashes are more noticeable
- `PARTICLES.EXPLOSION_QUANTITY` - More particles = more satisfying
- `BALL.SPEED_INCREMENT` - How fast the game accelerates

## Resources

- [Juice It or Lose It (Nordic Game Talk)](https://www.youtube.com/watch?v=Fy0aCDmgnxg) - The original talk that inspired this project
- [The Art of Screenshake (Jan Willem Nijman)](https://www.youtube.com/watch?v=AJdEqssNZ-U) - Deep dive into screen shake
- [Game Feel by Steve Swink](http://www.game-feel.com/) - Book on the theory of game feel

---

*Built with Phaser 3 and vanilla JavaScript. No build tools required - just open in a browser!*
