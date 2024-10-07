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
    flower1: {
        count: 0, hints: [
            'Hop on!',
            'I can\'t follow you in that tunnel.',
            'Look it\'s a block moving puzzle, you know those, right?',
            'Isolate the middle and then remove it? Something like that?',
            'Buttons open doors?'
        ]
    },
    flower2: {
        count: 0, hints: [
            '[Bird] can reach that button.',
            '[Frog] likes to eat bugs.',
            'Let\'s both get to the left together.',
        ]
    },
    boulderPond: {
        count: 0, hints: [
            'We\'re going to have to split up for a second.',
            'We\'ll have to approach this red button from the left.',
            '[Turtle] can carry rocks in the water.',
            'You\'ll need to approach the blue button from directly below it.',
        ]
    },
    riverCrossing: {
        count: 0, hints: [
            'Buttons and Doors are color matched.',
            'You can fly! (And should)',
            'You\'re only going to need to eat twice, darling)',
            'You\'re going to need every boulder.',
        ]
    },
    superBoulderAdventure: {
        count: 0, hints: [
            '[Frog] won\'t be able to get to our destination without this bridge here.',
            'We\'re going to need to get this boulder all the way over there.',
            'Oh, could [Frog] clear the way for me up there?',
        ]
    }
}
export function GetHint(levelname: keyof typeof levels) {
    const levelHint = levelHints[levelname];
    const hintCount = (levelHint.count) % levelHint.hints.length;
    levelHint.count++;

    return levelHint.hints[hintCount];
}