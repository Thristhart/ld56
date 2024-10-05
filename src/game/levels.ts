export function startLevel(levelname: keyof typeof levels) {
    currentLevel = levels[levelname];
}

export function endLevel() {

}

interface LevelDescription {
    gridWidth: number;
    gridHeight: number;
}

export let currentLevel: LevelDescription | undefined;

export const levels = {
    testing: {
        gridWidth: 20,
        gridHeight: 20,
    }
} as const satisfies Record<string, LevelDescription>;