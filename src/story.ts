import { levels, startLevel } from "./game/levels";

let storyIndex = -1;
const story: Array<StoryBeat> = [
    {
        type: "startlevel",
        level: "cutscene"
    },
    {
        type: "message",
        speaker: "witch1",
        message: "hello??"
    },
    {
        type: "startlevel",
        level: "flower2"
    },
    {
        type: "message",
        speaker: "turtle",
        message: "hello??"
    },
    {
        type: "message",
        speaker: "turtle",
        message: "hi world",
    },
    {
        type: "message",
        speaker: "turtle",
        message: "it's me",
    },
    { type: "cleardialog" },
    { type: "waitforlevelcomplete" },
    {
        type: "startlevel",
        level: "intro"
    },
]


if (import.meta.env.DEV) {
    //@ts-ignore
    window.DEBUG_STORY = story;
}

export type Speaker = "none" | "turtle" | "frog" | "bird" | "mouse" | "witch1" | "witch2";

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
export interface ClearDialog {
    readonly type: "cleardialog"
}
export interface WaitForLevelComplete {
    readonly type: "waitforlevelcomplete";
}

export type StoryBeat = StoryMessage | LevelStart | ClearDialog | WaitForLevelComplete;

const log: (StoryMessage | ClearDialog)[] = [];
const speakers: [Speaker?, Speaker?] = [];

export const getCurrentMessage = (): StoryMessage | ClearDialog | undefined => log[log.length - 1];
export const getCurrentSpeakers = () => speakers;

export function isShowingMessage() {
    return getCurrentMessage()?.type === "message";
}

export function insertStoryBeats(...beats: Array<StoryBeat>) {
    story.splice(storyIndex + 1, 0, ...beats);
}

export function displayDialog(...beats: Array<StoryMessage>) {
    insertStoryBeats(
        ...beats,
        { type: "cleardialog", }
    );
    continueStory();
}
function getNextBeat() {
    if (storyIndex < story.length) {
        const nextBeat = story[storyIndex + 1];
        return nextBeat;
    }
    return undefined;
}
export function continueStory(levelComplete = false) {
    const nextBeat = getNextBeat();
    if (nextBeat?.type === "waitforlevelcomplete" && !levelComplete) {
        return;
    }
    if (nextBeat) {
        storyIndex++;
        switch (nextBeat.type) {
            case "startlevel":
                startLevel(nextBeat.level);
                continueStory();
                break;
            case "message":
                log.push(nextBeat);
                break;
            case "cleardialog":
                log.push(nextBeat);
                continueStory();
                break;
            case "waitforlevelcomplete":
                if (levelComplete) {
                    continueStory();
                }
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