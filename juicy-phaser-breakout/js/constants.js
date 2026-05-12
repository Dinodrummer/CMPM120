/**
 * Game Constants
 * Central location for all game configuration values.
 * Modify these to experiment with game feel!
 */

export const GAME = {
    WIDTH: 1020,           // Total canvas width (playfield + panel)
    HEIGHT: 600,
    PLAYFIELD_WIDTH: 800,  // Playfield area where ball bounces
    BACKGROUND_COLOR: 0x1a1a2e
};

export const PADDLE = {
    WIDTH: 120,
    HEIGHT: 20,
    Y_OFFSET: 50,          // Distance from bottom
    COLOR: 0x4fc3f7,
    SPEED: 800,            // For tweened movement
    LERP_FACTOR: 0.08,     // For smooth following (0-1, higher = faster)
    EYE_RADIUS: 8,         // White part of eye
    PUPIL_RADIUS: 4,       // Black pupil
    EYE_SPACING: 24        // Distance between eyes
};

export const BALL = {
    RADIUS: 10,
    COLOR: 0xffffff,
    INITIAL_SPEED: 400,
    MAX_SPEED: 600,
    SPEED_INCREMENT: 10    // Speed increase per brick hit
};

export const BRICK = {
    WIDTH: 70,
    HEIGHT: 25,
    PADDING: 8,
    OFFSET_TOP: 80,
    OFFSET_LEFT: 65,
    ROWS: 5,
    COLS: 9,
    COLORS: [
        0xff6b6b,  // Red
        0xfeca57,  // Orange
        0x48dbfb,  // Cyan
        0x1dd1a1,  // Green
        0xa29bfe   // Purple
    ],
    POINTS: [50, 40, 30, 20, 10]  // Points per row (top to bottom)
};

export const PARTICLES = {
    TRAIL_LIFESPAN: 300,
    TRAIL_QUANTITY: 1,
    EXPLOSION_LIFESPAN: 400,
    EXPLOSION_QUANTITY: 15,
    EXPLOSION_SPEED: { min: 50, max: 200 }
};

export const EFFECTS = {
    SHAKE_INTENSITY: 0.005,
    SHAKE_DURATION: 100,
    SQUASH_SCALE: { x: 1.3, y: 0.7 },
    STRETCH_SCALE: { x: 0.7, y: 1.3 },
    FLASH_DURATION: 100,
    POPUP_DURATION: 800,
    POPUP_RISE: 50
};

export const UI = {
    PANEL_WIDTH: 200,
    PANEL_PADDING: 15,
    TOGGLE_HEIGHT: 30,
    FONT_SIZE: 14,
    HEADER_SIZE: 18
};

// Effect toggle keys - used for JuiceManager
export const JUICE_EFFECTS = {
    TWEENING: 'tweening',
    BALL_TRAILS: 'ballTrails',
    SCREEN_SHAKE: 'screenShake',
    PARTICLES: 'particles',
    SQUASH_STRETCH: 'squashStretch',
    COLOR_FLASH: 'colorFlash',
    BRICK_ANIMATIONS: 'brickAnimations',
    SOUND_EFFECTS: 'soundEffects',
    SCORE_POPUPS: 'scorePopups',
    PADDLE_EYES: 'paddleEyes'
};
