import {Color} from "./Constants.js";


class Level {
    constructor(width, speed, parallel, color, goal, allowedMiss) {
        this.width = width;
        this.speed = speed;
        console.assert(parallel <= width ** 2); // grid has width^2 moles
        this.parallel = parallel;
        this.color = color;
        this.goal = goal;
        this.allowedMiss = allowedMiss;
    }
}

// levels with three difficulties
export const levels = [
    // [ // testing levels
    //     new Level(1, 1, 1, Color.GREEN, 4, 2),
    //     new Level(2, 1, 1, Color.BLUE, 4, 2),
    // ],
    [
        new Level(1, 1, 1, Color.GREEN, 8, 3),
        new Level(2, 1, 1, Color.BLUE, 8, 3),
        new Level(2, 1, 2, Color.YELLOW, 10, 4),
        new Level(2, 1.5, 2, Color.PINK, 11, 3),
        new Level(2, 1.5, 3, Color.WHITE, 13, 3)
    ],
    [
        new Level(2, 1, 2, Color.GREEN, 8, 4),
        new Level(2, 1.5, 3, Color.BLUE, 8, 4),
        new Level(2, 2, 3, Color.YELLOW, 10, 6),
        new Level(2, 2, 4, Color.PINK, 12, 7),
        new Level(3, 2, 4, Color.WHITE, 14, 7)
    ],
    [
        new Level(3, 1.5, 3, Color.GREEN, 8, 6),
        new Level(3, 2, 4, Color.BLUE, 10, 7),
        new Level(4, 2, 5, Color.YELLOW, 14, 8),
        new Level(4, 2.2, 3, Color.PINK, 15, 8),
        new Level(4, 2.2, 5, Color.WHITE, 16, 8)
    ],
];