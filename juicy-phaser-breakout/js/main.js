/**
 * Main Game Entry Point
 *
 * This demo showcases "juice" effects from the famous GDC talk
 * "Juice It or Lose It" by Martin Jonasson & Petri Purho.
 *
 * Toggle each effect on/off to feel the difference it makes!
 */

import { GAME } from './constants.js';
import { BootScene } from './scenes/BootScene.js';
import { GameScene } from './scenes/GameScene.js';
import { UIScene } from './scenes/UIScene.js';

const config = {
    type: Phaser.AUTO,
    width: GAME.WIDTH,
    height: GAME.HEIGHT,
    parent: 'game-container',
    backgroundColor: GAME.BACKGROUND_COLOR,
    physics: {
        default: 'arcade',
        arcade: {
            // No gravity for breakout
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: [BootScene, GameScene, UIScene]
};

// Create the game instance
const game = new Phaser.Game(config);

// Expose game globally for debugging (optional)
window.game = game;
