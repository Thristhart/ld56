import { StoryMessage } from "~/story";
import { levels } from "./levels";

const levelHints: Record<keyof typeof levels, { count: number, hints: StoryMessage[] }> = {
    cutscene: {
        count: 0, hints: []
    },
    testing: {
        count: 0, hints: [
            {
                type: 'message',
                message: 'hint1',
                speaker: 'turtle',
            },
            {
                type: 'message',
                message: 'hint2',
                speaker: 'frog',
            },
        ]
    },
    circuittesting: {
        count: 0, hints: [
            {
                type: 'message',
                message: 'hint1',
                speaker: 'turtle',
            },
            {
                type: 'message',
                message: 'hint2',
                speaker: 'frog',
            },
        ]
    },
    flower1: {
        count: 0, hints: [
            {
                type: 'message',
                message: 'ow, did you need a hint?',
                speaker: 'turtle',
            },
            {
                type: 'message',
                message: 'hop on!',
                speaker: 'turtle',
            },
            {
                type: 'message',
                message: 'I can\'t follow you in that tunnel.',
                speaker: 'turtle',
            },
            {
                type: 'message',
                message: 'Look it\'s a block moving puzzle, you know those, right?',
                speaker: 'mouse',
            },
            {
                type: 'message',
                message: 'isolate the middle and then remove it? something like that?',
                speaker: 'turtle',
            },
            {
                type: 'message',
                message: 'Buttons open doors?',
                speaker: 'mouse',
            },
        ]
    },
    flower2: {
        count: 0, hints: [
            {
                type: 'message',
                message: 'My sweet sunshine, will you get that button for me?',
                speaker: 'frog',
            },
            {
                type: 'message',
                message: 'Darling, extinguish those pests!',
                speaker: 'bird',
            },
            {
                type: 'message',
                message: 'Together, my love. To the goal!',
                speaker: 'frog',
            }
        ]
    },
    boulderPond: {
        count: 0, hints: [
            {
                type: 'message',
                message: 'we\'re going to have to split up for a second',
                speaker: 'turtle',
            },
            {
                type: 'message',
                message: 'Lets try approaching this button from the left.',
                speaker: 'mouse',
            },
            {
                type: 'message',
                message: 'I can try carrying rocks in the water',
                speaker: 'turtle',
            },
            {
                type: 'message',
                message: 'Can we approach the blue button from directly below?',
                speaker: 'mouse',
            },
        ]
    },
    riverCrossing: {
        count: 0, hints: [
            {
                type: 'message',
                message: 'Buttons, Doors, and Bridges, matched in harmony.',
                speaker: 'bird',
            },
            {
                type: 'message',
                message: 'You fly so beautifully my dark angel',
                speaker: 'frog',
            },
            {
                type: 'message',
                message: 'Don\t overindulge my dearest, two snacks should be plenty',
                speaker: 'bird',
            },
            {
                type: 'message',
                message: 'I shall command every boulder! In your name!',
                speaker: 'frog',
            },
        ]
    },
    superBoulderAdventure: {
        count: 0, hints: [
            {
                type: 'message',
                message: 'This bridge, my dear — absolutely essential!',
                speaker: 'frog',
            },
            {
                type: 'message',
                message: 'Ah, this boulder shall make a delightful companion for our journey',
                speaker: 'frog',
            },
            {
                type: 'message',
                message: 'Would you be so kind as to clear the way for me, darling?',
                speaker: 'bird',
            },
        ]
    },
    lastTurtle: {
        count: 0, hints: [
            {
                type: 'message',
                message: "if that rock was on the button I bet we could get out of the first room",
                speaker: 'turtle',
            },
            {
                type: 'message',
                message: 'I can push that boulder over the bridge. Just stand on the button!',
                speaker: 'mouse',
            },
            {
                type: 'message',
                message: 'if you put that rock on my back then I can carry it somewhere useful',
                speaker: 'turtle',
            },
            {
                type: 'message',
                message: 'If three of these buttons are pushed, I can pull out the last boulder!',
                speaker: 'mouse',
            }
        ]
    }
}

export function GetHint(levelname: keyof typeof levels) {
    const levelHint = levelHints[levelname];
    const hintCount = (levelHint.count) % levelHint.hints.length;
    levelHint.count++;

    return levelHint.hints[hintCount];
}