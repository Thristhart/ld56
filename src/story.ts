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
        message: "Attention, tiny creatures of the forest!"
    },
    {
        type: "message",
        speaker: "witch1",
        message: "I am Thistle, the great witch!"
    },
    {
        type: "message",
        speaker: "witch2",
        message: "And I am the great witch Wisteria!"
    },
    {
        type: "message",
        speaker: "witch1",
        message: "We are speaking to your minds to summon you... for a challenge!"
    },
    {
        type: "message",
        speaker: "witch2",
        message: "We each require a familiar. The tiny creature who passes our trials..."
    },
    {
        type: "message",
        speaker: "witch1",
        message: "...will be rewarded with their heart's greatest desire!"
    },
    {
        type: "startlevel",
        level: "flower1"
    },
    {
        type: "message",
        speaker: "mouse",
        message: "!!!"
    },
    {
        type: "message",
        speaker: "mouse",
        message: "Tiramisu!"
    },
    {
        type: "message",
        speaker: "mouse",
        message: "WE HAVE TO GO!"
    },
    {
        type: "message",
        speaker: "turtle",
        message: "what?",
    },
    {
        type: "message",
        speaker: "mouse",
        message: "OUR HEART'S GREATEST DESIRE?"
    },
    {
        type: "message",
        speaker: "turtle",
        message: "it sounds like a lot of work",
    },
    {
        type: "message",
        speaker: "mouse",
        message: "Come on, Tiramisu! It'll be an adventure!"
    },
    {
        type: "message",
        speaker: "mouse",
        message: "You can be Thistle's familiar and I'll be Wisteria's familiar!"
    },
    {
        type: "message",
        speaker: "mouse",
        message: "And we'll be friends forever!"
    },
    {
        type: "message",
        speaker: "turtle",
        message: "alright, fine. it'll be something to do",
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