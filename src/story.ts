import { startMusic } from "./audio";
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
    { type: "startmusic" },
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
    {
        type: "message",
        speaker: "mouse",
        message: "Yay! I think we just need to get to those gold portals."
    },
    { type: "cleardialog" },
    { type: "waitforlevelcomplete" },

    {
        type: "startlevel",
        level: "flower2"
    },
    {
        type: "message",
        speaker: "bird",
        message: "Fudge, darling, this opportunity is simply made for us."
    },
    {
        type: "message",
        speaker: "frog",
        message: "Yes, Cupcake! You would look divine perched on a witch's staff."
    },
    {
        type: "message",
        speaker: "bird",
        message: "And you would make a perfect potions assistant."
    },
    { type: "cleardialog" },
    { type: "waitforlevelcomplete" },

    {
        type: "startlevel",
        level: "boulderPond"
    },
    {
        type: "message",
        speaker: "turtle",
        message: "so what's your greatest desire?"
    },
    {
        type: "message",
        speaker: "mouse",
        message: "Think of how much frosting we could get!"
    },
    {
        type: "message",
        speaker: "turtle",
        message: "guess I would have assumed cheese"
    },
    {
        type: "message",
        speaker: "mouse",
        message: "What about you? What do you want?"
    },
    {
        type: "message",
        speaker: "turtle",
        message: "it's private. don't worry about it"
    },
    { type: "cleardialog" },
    { type: "waitforlevelcomplete" },

    {
        type: "startlevel",
        level: "riverCrossing"
    },
    {
        type: "message",
        speaker: "bird",
        message: "What sort of lavish mansion do you suppose these witches live in?"
    },
    {
        type: "message",
        speaker: "frog",
        message: "Surely if they are such great witches, they must have a great home!"
    },
    {
        type: "message",
        speaker: "bird",
        message: "A palacious estate!"
    },
    {
        type: "message",
        speaker: "frog",
        message: "A grand demense!"
    },
    { type: "cleardialog" },
    { type: "waitforlevelcomplete" },
    {
        type: "startlevel",
        level: "superBoulderAdventure"
    },
    {
        type: "message",
        speaker: "bird",
        message: "Dear, you're doing such a good job with these puzzles."
    },
    {
        type: "message",
        speaker: "frog",
        message: "Cupcake, your praise is all the motivation I need!"
    },
    {
        type: "message",
        speaker: "frog",
        message: "I would solve a thousand more to hear you tell me that I have done well."
    },
    {
        type: "message",
        speaker: "bird",
        message: "We can only hope there aren't that many!"
    },
    { type: "cleardialog" },
    { type: "waitforlevelcomplete" },
    {
        type: "startlevel",
        level: "lastTurtle"
    },
    {
        type: "message",
        speaker: "mouse",
        message: "What kind of animals do you think we'll meet?"
    },
    {
        type: "message",
        speaker: "turtle",
        message: "oh, all sorts I'm sure. lots of creatures could be a familiar"
    },
    {
        type: "message",
        speaker: "mouse",
        message: "I hope they're tough competition!"
    },
    {
        type: "message",
        speaker: "turtle",
        message: "wouldn't it be better if they're easy for us to beat?"
    },
    {
        type: "message",
        speaker: "mouse",
        message: "Where's the fun in that?!"
    },
    { type: "cleardialog" },
    { type: "waitforlevelcomplete" },
    // characterization notes:
    // mouse: precocious, cassie vibes
    // turtle: chill, slow. all lowercase
    // bird: hmmm yes, very proper. a bug? oh dear, not for me. morticia addams?
    // frog: gomez addams to her morticia. yes dear absolutely I will eat these bugs for you my precious
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
export interface StartMusic {
    readonly type: "startmusic"
}
export type StoryBeat = StoryMessage | LevelStart | ClearDialog | WaitForLevelComplete | StartMusic;

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
            case "startmusic":
                startMusic();
                continueStory();
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

if (import.meta.hot) {
    import.meta.hot.accept();
}