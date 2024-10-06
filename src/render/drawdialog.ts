import { getCurrentMessage, Speaker } from "~/story";
import { crowWalkAnimation, dialogBackgroundImage, frogHopAnimation, mousePortraitImage, turtlePortraitImage } from "./images";
import { canvasScale } from "./drawframe";
import { drawSprite } from "./spritesheet";

const portraitSize = 300;
export function drawDialog(context: CanvasRenderingContext2D) {
    const currentBeat = getCurrentMessage();

    if (!currentBeat) {
        return;
    }
    if (currentBeat.type == "cleardialog") {
        return;
    }

    context.save();
    // let scale = (window.innerWidth - 200) / dialogBackgroundImage.width;
    // context.translate(100, window.innerHeight - 500 * scale);

    const windowWidth = window.innerWidth / canvasScale;
    const windowHeight = window.innerHeight / canvasScale;

    const windowLeftMargin = (window.innerWidth - windowWidth) / 2;
    const windowTopMargin = (window.innerHeight - windowHeight) / 2;

    let scale = 1 / canvasScale;

    context.translate(windowLeftMargin, windowTopMargin);
    scale *= ((window.innerWidth - 20) / dialogBackgroundImage.width);
    context.translate(10 / canvasScale, 0);
    context.scale(scale, scale);

    drawSpeaker(currentBeat.speaker, context);
    context.drawImage(dialogBackgroundImage, 0, 200);
    context.font = "40px Arial";
    context.fillStyle = "black";
    context.fillRect(95, 200, 120, 40);
    context.fillStyle = "white";
    context.fillText(currentBeat.speaker, 110, 233);
    context.fillStyle = "black";
    context.fillText(currentBeat.message, 100, 300);

    context.restore();
}

function drawSpeaker(speaker: Speaker, context: CanvasRenderingContext2D) {

    if (speaker === 'turtle') {
        context.drawImage(turtlePortraitImage, 70, 0, portraitSize, portraitSize);
    }
    else if (speaker === 'mouse') {
        context.drawImage(mousePortraitImage, 70, 0, portraitSize, portraitSize);
    }
    else if (speaker === 'bird') {
        const spriteDetails = { sprite: crowWalkAnimation, direction: -1, startTime: 0 };
        drawSprite(
            context,
            spriteDetails.sprite.spritesheet,
            150,
            150,
            spriteDetails.sprite.getFrame(performance.now() - spriteDetails.startTime, spriteDetails),
            false,
            { width: portraitSize, height: portraitSize },
        )
    }
    else if (speaker === 'frog') {
        const spriteDetails = { sprite: frogHopAnimation, direction: -1, startTime: 0 };
        drawSprite(
            context,
            spriteDetails.sprite.spritesheet,
            170,
            110,
            spriteDetails.sprite.getFrame(performance.now() - spriteDetails.startTime, spriteDetails),
            false,
            { width: portraitSize, height: portraitSize },
        )
    }
}