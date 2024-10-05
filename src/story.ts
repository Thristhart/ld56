import { Howl } from "howler";
import { Story } from "inkjs/engine/Story";
import { levels, startLevel } from "./game/levels";

const sounds: { [key: string]: Howl } = {
    // screech: new Howl({ src: ratSpawnSoundPath, volume: 0.01 }),
    // laugh: new Howl({ src: laughSoundPath, volume: 0.05 }),
    // siren: new Howl({ src: copSirenSoundPath, volume: 0.1 }),
};

let storyIndex = -1;
const story = [
    {
        type: "startlevel",
        level: "testing"
    },
    {
        type: "message",
        speaker: "cat",
        message: "hi world",
    },
    {
        type: "message",
        speaker: "cat",
        message: "it's me",
    },
] as const satisfies Array<StoryBeat>


if (import.meta.env.DEV) {
    //@ts-ignore
    window.DEBUG_STORY = story;
}

export type Speaker = "none" | "cat" | "cattruck" | "rat" | "cop" | "frog" | "bear" | "clown" | "leslie";

export interface StoryMessage {
    readonly type: "message";
    readonly speaker: Speaker;
    readonly message: string;
    readonly isNarration?: boolean;
}
export interface LevelStart {
    readonly type: "startlevel";
    readonly level: keyof typeof levels;
}

export type StoryBeat = StoryMessage | LevelStart;

const log: StoryMessage[] = [];
const speakers: [Speaker?, Speaker?] = [];

export const getCurrentMessage = (): StoryMessage | undefined => log[log.length - 1];
export const getCurrentSpeakers = () => speakers;

function getNextBeat()
{
    if (storyIndex < story.length) {
        const nextBeat = story[storyIndex + 1];
        return nextBeat;
    }
    return undefined;
}
export function continueStory() {
    const nextBeat = getNextBeat();
    if (nextBeat) {
        storyIndex++;
        switch(nextBeat.type)
        {
            case "startlevel":
                startLevel(nextBeat.level);
                continueStory();
                break;
            case "message":
                log.push(nextBeat);
                break;
        }
    }
    else {
        // end game here
        // showingCredits.value = true;
    }
};

// function getDecoratorClass(name: string) {
//     return getStoryBool(name) && name;
// }

export const getStoryDecoratorsClassName = () => "";

if (import.meta.hot) {
    import.meta.hot.accept();
}