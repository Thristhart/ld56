import { continueStory, isShowingMessage } from "~/story";
import { clearActions, ComputeStateFromActionLog, fireAction, undo } from "./actions";
import { currentLevelState, setCurrentLevelState } from "./levels";
import { sounds } from "~/audio";

const canvas = document.querySelector("canvas")!;

const inputs = ["w", "a", "s", "d", "e", "z", " ", "r"] as const;

function isSupportedInput(input: string): input is Input {
    return inputs.includes(input as Input);
}

export type Input = typeof inputs[number];

const inputDownTimestamps = new Map<Input, number>();
function onKeyDown(event: KeyboardEvent) {
    if (isSupportedInput(event.key) && !inputDownTimestamps.has(event.key)) {
        inputDownTimestamps.set(event.key, performance.now());
        onInput(event.key);
    }
}
function onKeyUp(event: KeyboardEvent) {
    if (isSupportedInput(event.key)) {
        inputDownTimestamps.delete(event.key);
    }
}
document.body.addEventListener("keydown", onKeyDown);
document.body.addEventListener("keyup", onKeyUp);

function onInput(input: Input) {
    if (!currentLevelState) {
        return;
    }

    // when showing a message, only allow advancing dialog
    if (isShowingMessage()) {
        switch (input) {
            case "e":
            case " ": {
                continueStory();
                break;
            }
        }
        return;
    }
    switch (input) {
        case " ": {
            continueStory();
            break;
        }
        case "w": {
            if (currentLevelState.canContinueLevel) {
                fireAction({ type: "MoveCreature", direction: "up" });
            }
            break;
        }
        case "a": {
            if (currentLevelState.canContinueLevel) {
                fireAction({ type: "MoveCreature", direction: "left" });
            }
            break;
        }
        case "s": {
            if (currentLevelState.canContinueLevel) {
                fireAction({ type: "MoveCreature", direction: "down" });
            }
            break;
        }
        case "d": {
            if (currentLevelState.canContinueLevel) {
                fireAction({ type: "MoveCreature", direction: "right" });
            }
            break;
        }
        case "e": {
            if (currentLevelState.canContinueLevel) {
                fireAction({ type: "SwitchCreature" });
            }
            break;
        }
        case "z": {
            undo();
            break;
        }
        case "r": {
            clearActions();
            setCurrentLevelState(ComputeStateFromActionLog());
            try {
                if (!sounds.music.playing()) {
                    sounds.music.play();
                }
            }
            catch(e) {
        
            }
            break;
        }
    }
}

// repeat every 250ms
const holdRepeatTime = 250;

export function tickInput(timestamp: number) {
    inputDownTimestamps.forEach((downTimestamp, heldInput) => {
        if (timestamp - downTimestamp > holdRepeatTime) {
            inputDownTimestamps.set(heldInput, timestamp);
            onInput(heldInput);
        }
    })
}


if (import.meta.hot) {
    import.meta.hot.accept((main) => {
        canvas.removeEventListener("keydown", onKeyDown);
        canvas.removeEventListener("keyup", onKeyUp);
    });
}