import { fireAction } from "./actions";
import { currentLevelState } from "./levels";

const canvas = document.querySelector("canvas")!;

const inputs = ["w", "a", "s", "d", "e"] as const;

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

    switch (input) {
        case "w": {
            fireAction({ type: "MoveCreature", direction: "up" });
            break;
        }
        case "a": {
            fireAction({ type: "MoveCreature", direction: "left" });
            break;
        }
        case "s": {
            fireAction({ type: "MoveCreature", direction: "down" });
            break;
        }
        case "d": {
            fireAction({ type: "MoveCreature", direction: "right" });
            break;
        }
        case "e": {
            fireAction({ type: "SwitchCreature" });
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