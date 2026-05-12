/**
 * UI Scene
 *
 * Overlay scene for the toggle panel.
 * Runs on top of GameScene to handle UI separately.
 */

import { TogglePanel } from '../ui/TogglePanel.js';

export class UIScene extends Phaser.Scene {
    constructor() {
        super({ key: 'UIScene' });
    }

    create() {
        // Get reference to GameScene's juice manager
        const gameScene = this.scene.get('GameScene');
        this.juiceManager = gameScene.juiceManager;

        // Create toggle panel
        this.togglePanel = new TogglePanel(this, this.juiceManager);

        // Instructions text at bottom
        this.createInstructions();

        // Listen for toggle changes to update panel
        this.juiceManager.events.on('allChanged', () => {
            this.togglePanel.updateAllToggles();
        });
    }

    /**
     * Create instruction text
     */
    createInstructions() {
        const instructions = this.add.text(
            20,
            this.cameras.main.height - 25,
            'Click to launch ball | Move mouse to control paddle',
            {
                fontFamily: 'Arial, sans-serif',
                fontSize: '14px',
                color: '#666666'
            }
        );
        instructions.setDepth(100);
    }
}
