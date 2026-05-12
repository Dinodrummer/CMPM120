/**
 * Toggle Panel
 *
 * UI panel with toggles for each juice effect.
 * Allows students to enable/disable effects to see their impact.
 */

import { JUICE_EFFECTS, UI, GAME } from '../constants.js';

export class TogglePanel {
    constructor(scene, juiceManager) {
        this.scene = scene;
        this.juiceManager = juiceManager;

        this.toggles = [];
        this.panel = null;

        this.createPanel();
    }

    /**
     * Create the toggle panel UI
     */
    createPanel() {
        // Position panel in the dedicated area to the right of playfield
        const x = GAME.PLAYFIELD_WIDTH + 10;
        const y = 50;

        // Panel background
        this.panel = this.scene.add.rectangle(
            x + UI.PANEL_WIDTH / 2,
            y + 200,
            UI.PANEL_WIDTH,
            420,
            0x000000,
            0.7
        );
        this.panel.setStrokeStyle(2, 0x4fc3f7);
        this.panel.setDepth(200);

        // Panel header
        const header = this.scene.add.text(
            x + UI.PANEL_WIDTH / 2,
            y + 15,
            '🎮 Juice Effects',
            {
                fontFamily: 'Arial, sans-serif',
                fontSize: `${UI.HEADER_SIZE}px`,
                fontStyle: 'bold',
                color: '#4fc3f7'
            }
        );
        header.setOrigin(0.5, 0);
        header.setDepth(201);

        // Effect descriptions for tooltips
        const effectInfo = {
            [JUICE_EFFECTS.TWEENING]: { name: 'Tweening', desc: 'Smooth paddle movement' },
            [JUICE_EFFECTS.BALL_TRAILS]: { name: 'Ball Trails', desc: 'Particle trail on ball' },
            [JUICE_EFFECTS.SCREEN_SHAKE]: { name: 'Screen Shake', desc: 'Camera shake on hit' },
            [JUICE_EFFECTS.PARTICLES]: { name: 'Particles', desc: 'Explosion on brick break' },
            [JUICE_EFFECTS.SQUASH_STRETCH]: { name: 'Squash & Stretch', desc: 'Impact deformation' },
            [JUICE_EFFECTS.COLOR_FLASH]: { name: 'Color Flash', desc: 'White flash on hit' },
            [JUICE_EFFECTS.BRICK_ANIMATIONS]: { name: 'Brick Animations', desc: 'Animated destruction' },
            [JUICE_EFFECTS.SOUND_EFFECTS]: { name: 'Sound Effects', desc: 'Audio feedback' },
            [JUICE_EFFECTS.SCORE_POPUPS]: { name: 'Score Popups', desc: 'Floating score text' },
            [JUICE_EFFECTS.PADDLE_EYES]: { name: 'Paddle Eyes', desc: 'Googly eyes track ball' }
        };

        // Create toggles for each effect
        let toggleY = y + 50;

        Object.values(JUICE_EFFECTS).forEach(effect => {
            const info = effectInfo[effect];
            this.createToggle(x + UI.PANEL_PADDING, toggleY, effect, info.name);
            toggleY += UI.TOGGLE_HEIGHT + 5;
        });

        // All On / All Off buttons
        const buttonY = toggleY + 15;

        this.createButton(x + UI.PANEL_PADDING, buttonY, 'ALL ON', () => {
            this.juiceManager.enableAll();
            this.updateAllToggles();
        });

        this.createButton(x + UI.PANEL_WIDTH / 2 + 5, buttonY, 'ALL OFF', () => {
            this.juiceManager.disableAll();
            this.updateAllToggles();
        });

        // Counter text
        this.counterText = this.scene.add.text(
            x + UI.PANEL_WIDTH / 2,
            buttonY + 45,
            this.getCounterText(),
            {
                fontFamily: 'Arial, sans-serif',
                fontSize: '14px',
                color: '#888888'
            }
        );
        this.counterText.setOrigin(0.5, 0);
        this.counterText.setDepth(201);
    }

    /**
     * Create a single toggle
     */
    createToggle(x, y, effect, name) {
        const isEnabled = this.juiceManager.isEnabled(effect);

        // Toggle background
        const bg = this.scene.add.rectangle(
            x + 15,
            y + UI.TOGGLE_HEIGHT / 2,
            30,
            20,
            isEnabled ? 0x4fc3f7 : 0x333333
        );
        bg.setStrokeStyle(1, 0x666666);
        bg.setDepth(201);
        bg.setInteractive({ useHandCursor: true });

        // Toggle indicator
        const indicator = this.scene.add.circle(
            x + (isEnabled ? 22 : 8),
            y + UI.TOGGLE_HEIGHT / 2,
            7,
            0xffffff
        );
        indicator.setDepth(202);

        // Label
        const label = this.scene.add.text(
            x + 40,
            y + UI.TOGGLE_HEIGHT / 2,
            name,
            {
                fontFamily: 'Arial, sans-serif',
                fontSize: `${UI.FONT_SIZE}px`,
                color: isEnabled ? '#ffffff' : '#666666'
            }
        );
        label.setOrigin(0, 0.5);
        label.setDepth(201);

        // Store toggle reference
        const toggle = { bg, indicator, label, effect };
        this.toggles.push(toggle);

        // Click handler
        bg.on('pointerdown', () => {
            this.juiceManager.toggle(effect);
            this.updateToggle(toggle);
            this.updateCounter();

            // Play toggle sound if sound effects are enabled
            // (or if we're toggling sound effects on)
            const gameScene = this.scene.scene.get('GameScene');
            if (gameScene && gameScene.audioManager &&
                (effect === JUICE_EFFECTS.SOUND_EFFECTS ||
                 this.juiceManager.isEnabled(JUICE_EFFECTS.SOUND_EFFECTS))) {
                gameScene.audioManager.playToggle(
                    this.juiceManager.isEnabled(effect)
                );
            }
        });

        // Hover effect
        bg.on('pointerover', () => {
            bg.setStrokeStyle(2, 0x4fc3f7);
        });

        bg.on('pointerout', () => {
            bg.setStrokeStyle(1, 0x666666);
        });
    }

    /**
     * Create a button
     */
    createButton(x, y, text, callback) {
        const width = UI.PANEL_WIDTH / 2 - UI.PANEL_PADDING - 5;

        const bg = this.scene.add.rectangle(
            x + width / 2,
            y + 15,
            width,
            30,
            0x333333
        );
        bg.setStrokeStyle(1, 0x4fc3f7);
        bg.setDepth(201);
        bg.setInteractive({ useHandCursor: true });

        const label = this.scene.add.text(
            x + width / 2,
            y + 15,
            text,
            {
                fontFamily: 'Arial, sans-serif',
                fontSize: '12px',
                fontStyle: 'bold',
                color: '#4fc3f7'
            }
        );
        label.setOrigin(0.5);
        label.setDepth(202);

        bg.on('pointerdown', () => {
            callback();
            // Animate button press
            this.scene.tweens.add({
                targets: [bg, label],
                scaleX: 0.95,
                scaleY: 0.95,
                duration: 50,
                yoyo: true
            });
        });

        bg.on('pointerover', () => {
            bg.setFillStyle(0x444444);
        });

        bg.on('pointerout', () => {
            bg.setFillStyle(0x333333);
        });
    }

    /**
     * Update a single toggle's visual state
     */
    updateToggle(toggle) {
        const isEnabled = this.juiceManager.isEnabled(toggle.effect);

        // Update background color
        toggle.bg.setFillStyle(isEnabled ? 0x4fc3f7 : 0x333333);

        // Animate indicator position
        this.scene.tweens.add({
            targets: toggle.indicator,
            x: toggle.bg.x + (isEnabled ? 7 : -7),
            duration: 100,
            ease: 'Quad.easeOut'
        });

        // Update label color
        toggle.label.setColor(isEnabled ? '#ffffff' : '#666666');
    }

    /**
     * Update all toggles to match manager state
     */
    updateAllToggles() {
        this.toggles.forEach(toggle => this.updateToggle(toggle));
        this.updateCounter();
    }

    /**
     * Update the counter text
     */
    updateCounter() {
        this.counterText.setText(this.getCounterText());
    }

    /**
     * Get counter text string
     */
    getCounterText() {
        const enabled = this.juiceManager.getEnabledCount();
        const total = this.juiceManager.getTotalCount();
        return `${enabled}/${total} effects enabled`;
    }
}
