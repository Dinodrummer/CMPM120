/**
 * Audio Manager
 *
 * Generates and plays sound effects using Web Audio API.
 * No external audio files needed!
 *
 * Why sound effects work:
 * - Multi-sensory feedback reinforces actions
 * - Different sounds for different events add variety
 * - Audio cues help players understand game state
 * - Satisfying sounds make actions feel rewarding
 *
 * From "Juice It or Lose It": Sound is half of the experience.
 * Even simple synthesized sounds make a huge difference.
 */

export class AudioManager {
    constructor() {
        // Create audio context (lazy initialization)
        this.context = null;
        this.initialized = false;

        // Master volume
        this.volume = 0.3;
    }

    /**
     * Initialize audio context (must be called after user interaction)
     */
    init() {
        if (this.initialized) return;

        try {
            this.context = new (window.AudioContext || window.webkitAudioContext)();
            this.initialized = true;
        } catch (e) {
            console.warn('Web Audio API not supported');
        }
    }

    /**
     * Ensure context is running (browsers require user gesture)
     */
    ensureContext() {
        if (!this.initialized) {
            this.init();
        }

        if (this.context && this.context.state === 'suspended') {
            this.context.resume();
        }
    }

    /**
     * Play a simple tone
     * @param {number} frequency - Frequency in Hz
     * @param {number} duration - Duration in seconds
     * @param {string} type - Oscillator type (sine, square, triangle, sawtooth)
     * @param {number} [volume] - Volume override
     */
    playTone(frequency, duration, type = 'square', volume = this.volume) {
        this.ensureContext();
        if (!this.context) return;

        const oscillator = this.context.createOscillator();
        const gainNode = this.context.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.context.destination);

        oscillator.type = type;
        oscillator.frequency.value = frequency;

        // Envelope: quick attack, decay
        const now = this.context.currentTime;
        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(volume, now + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + duration);

        oscillator.start(now);
        oscillator.stop(now + duration);
    }

    /**
     * Play brick break sound
     * Different pitch based on brick row (higher rows = higher pitch)
     * @param {number} row - Brick row (0 = top)
     */
    playBrickBreak(row = 0) {
        // Map row to frequency (top rows higher pitch)
        const baseFreq = 400;
        const freqStep = 50;
        const frequency = baseFreq + (4 - row) * freqStep;

        this.playTone(frequency, 0.1, 'square');

        // Add a quick descending tone for extra satisfaction
        setTimeout(() => {
            this.playTone(frequency * 0.75, 0.05, 'square', this.volume * 0.5);
        }, 30);
    }

    /**
     * Play paddle hit sound
     */
    playPaddleHit() {
        this.playTone(220, 0.08, 'triangle');
    }

    /**
     * Play wall hit sound
     */
    playWallHit() {
        this.playTone(150, 0.05, 'sine');
    }

    /**
     * Play ball launch sound
     */
    playLaunch() {
        this.playTone(330, 0.1, 'triangle');
        setTimeout(() => {
            this.playTone(440, 0.1, 'triangle');
        }, 50);
    }

    /**
     * Play lose life sound
     */
    playLoseLife() {
        this.playTone(200, 0.2, 'sawtooth');
        setTimeout(() => {
            this.playTone(150, 0.3, 'sawtooth');
        }, 100);
    }

    /**
     * Play game over sound
     */
    playGameOver() {
        const notes = [400, 350, 300, 200];
        notes.forEach((freq, i) => {
            setTimeout(() => {
                this.playTone(freq, 0.2, 'square');
            }, i * 150);
        });
    }

    /**
     * Play win sound
     */
    playWin() {
        const notes = [262, 330, 392, 523]; // C major arpeggio
        notes.forEach((freq, i) => {
            setTimeout(() => {
                this.playTone(freq, 0.15, 'triangle');
            }, i * 100);
        });

        // Final chord
        setTimeout(() => {
            this.playTone(523, 0.4, 'triangle');
            this.playTone(659, 0.4, 'triangle', this.volume * 0.7);
            this.playTone(784, 0.4, 'triangle', this.volume * 0.5);
        }, 400);
    }

    /**
     * Play UI toggle sound
     */
    playToggle(enabled) {
        if (enabled) {
            this.playTone(440, 0.05, 'sine', this.volume * 0.5);
        } else {
            this.playTone(330, 0.05, 'sine', this.volume * 0.5);
        }
    }

    /**
     * Set master volume
     * @param {number} volume - Volume level (0-1)
     */
    setVolume(volume) {
        this.volume = Phaser.Math.Clamp(volume, 0, 1);
    }
}
