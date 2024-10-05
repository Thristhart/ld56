import { fireAction } from "./actions";

const canvas = document.querySelector("canvas")!;

const inputs = ["w", "a", "s", "d"] as const;

function isSupportedInput(input: string): input is Input
{
    return inputs.includes(input as Input);
}

export type Input = typeof inputs[number];

const inputDownTimestamps = new Map<Input, number>();
function onKeyDown(event: KeyboardEvent) {
    if(isSupportedInput(event.key) && !inputDownTimestamps.has(event.key))
    {
        inputDownTimestamps.set(event.key, performance.now());
        onInput(event.key);
    }
}
function onKeyUp(event: KeyboardEvent)
{
    if(isSupportedInput(event.key))
    {
        inputDownTimestamps.delete(event.key);
    }
}
document.body.addEventListener("keydown", onKeyDown);
document.body.addEventListener("keyup", onKeyUp);

function onInput(input: Input)
{
    switch(input)
    {
        case "w": {
            fireAction({type: "MoveTurtle", direction: "up"});
            break;
        }
        case "a": {
            fireAction({type: "MoveTurtle", direction: "left"});
            break;
        }
        case "s": {
            fireAction({type: "MoveTurtle", direction: "down"});
            break;
        }
        case "d": {
            fireAction({type: "MoveTurtle", direction: "right"});
            break;
        }
    }
}


// repeat every 250ms
const holdRepeatTime = 250;

export function tickInput(timestamp: number){
    inputDownTimestamps.forEach((downTimestamp, heldInput) => {
        if(timestamp - downTimestamp > holdRepeatTime)
        {
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