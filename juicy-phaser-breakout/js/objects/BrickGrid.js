/**
 * Brick Grid Manager
 *
 * Creates and manages the grid of bricks.
 * Handles layout, colors, and tracking remaining bricks.
 */

import { BRICK } from '../constants.js';
import { Brick } from './Brick.js';

export class BrickGrid {
    constructor(scene) {
        this.scene = scene;

        // Physics group for all bricks
        this.group = scene.physics.add.staticGroup();

        // Track individual bricks for neighbor effects
        this.bricks = [];
    }

    /**
     * Create the brick grid layout
     */
    create() {
        this.bricks = [];

        for (let row = 0; row < BRICK.ROWS; row++) {
            this.bricks[row] = [];

            for (let col = 0; col < BRICK.COLS; col++) {
                const x = BRICK.OFFSET_LEFT + col * (BRICK.WIDTH + BRICK.PADDING);
                const y = BRICK.OFFSET_TOP + row * (BRICK.HEIGHT + BRICK.PADDING);

                const color = BRICK.COLORS[row % BRICK.COLORS.length];
                const points = BRICK.POINTS[row % BRICK.POINTS.length];

                const brick = new Brick(this.scene, x, y, color, points, row);
                this.group.add(brick);
                this.bricks[row][col] = brick;
            }
        }
    }

    /**
     * Get physics group for collision detection
     */
    getGroup() {
        return this.group;
    }

    /**
     * Wobble neighboring bricks when one is hit
     * @param {Brick} hitBrick - The brick that was hit
     */
    wobbleNeighbors(hitBrick) {
        // Find brick position in grid
        let hitRow = -1, hitCol = -1;

        for (let row = 0; row < this.bricks.length; row++) {
            for (let col = 0; col < this.bricks[row].length; col++) {
                if (this.bricks[row][col] === hitBrick) {
                    hitRow = row;
                    hitCol = col;
                    break;
                }
            }
            if (hitRow !== -1) break;
        }

        if (hitRow === -1) return;

        // Wobble adjacent bricks
        const neighbors = [
            [hitRow - 1, hitCol],     // Above
            [hitRow + 1, hitCol],     // Below
            [hitRow, hitCol - 1],     // Left
            [hitRow, hitCol + 1],     // Right
            [hitRow - 1, hitCol - 1], // Top-left
            [hitRow - 1, hitCol + 1], // Top-right
            [hitRow + 1, hitCol - 1], // Bottom-left
            [hitRow + 1, hitCol + 1]  // Bottom-right
        ];

        neighbors.forEach(([r, c]) => {
            if (r >= 0 && r < this.bricks.length &&
                c >= 0 && c < this.bricks[r].length) {
                const neighbor = this.bricks[r][c];
                if (neighbor && neighbor.active) {
                    neighbor.wobble();
                }
            }
        });
    }

    /**
     * Check if all bricks are destroyed
     */
    isEmpty() {
        return this.group.countActive() === 0;
    }

    /**
     * Get count of remaining bricks
     */
    getRemaining() {
        return this.group.countActive();
    }

    /**
     * Reset the brick grid
     */
    reset() {
        this.group.clear(true, true);
        this.create();
    }
}
