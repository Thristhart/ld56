import { levels } from "./levels";

const levelHints: Record<keyof typeof levels, { count: number, hints: string[] }> = {
    cutscene: {
        count: 0, hints: []
    },
    testing: {
        count: 0, hints: [
            'hint one',
            'hint two',
            'hint three',
            'hint four',
            'hint five'
        ]
    },
    circuittesting: {
        count: 0, hints: [
            'hint one',
            'hint two',
            'hint three',
            'hint four',
            'hint five'
        ]
    },
    intro: {
        count: 0, hints: [
            'hint one',
            'hint two',
            'hint three',
            'hint four',
            'hint five'
        ]
    },
    flower1: {
        count: 0, hints: [
            'hint one',
            'hint two',
            'hint three',
            'hint four',
            'hint five'
        ]
    },
    flower2: {
        count: 0, hints: [
            'hint one',
            'hint two',
            'hint three',
            'hint four',
            'hint five'
        ]
    },
    boulderPond: {
        count: 0, hints: [
            'hint one',
            'hint two',
            'hint three',
            'hint four',
            'hint five'
        ]
    },
}
export function GetHint(levelname: keyof typeof levels) {
    const levelHint = levelHints[levelname];
    const hintCount = (levelHint.count) % levelHint.hints.length;
    levelHint.count++;

    return levelHint.hints[hintCount];
}