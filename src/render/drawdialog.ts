import { currentLevelState } from "~/game/levels";
import { getCurrentMessage, Speaker } from "~/story";
import { GRID_SQUARE_HEIGHT, GRID_SQUARE_WIDTH } from "./drawframe";
import { crowWalkAnimation, dialogBackgroundImage, frogHopAnimation, mousePortraitImage, turtlePortraitImage, witch1IdleAnimation, witch2IdleAnimation } from "./images";
import { drawSprite } from "./spritesheet";

function GetSpeakerDisplayName(speaker: Speaker): string
{
    switch(speaker) {
        case "turtle":
            return "Tiramisu";
        case "bird":
            return "Cupcake";
        case "frog":
            return "Fudge";
        case "mouse":
            return "Muffin";
        case "witch1":
            return "Thistle";
        case "witch2":
            return "Wisteria";
        case "none":
            return "";
    }
}

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
    if(currentLevelState) {
        const levelWidth = currentLevelState.columns * GRID_SQUARE_WIDTH;
        const levelHeight = currentLevelState!.rows * GRID_SQUARE_HEIGHT;
        context.translate(0, levelHeight);

        const scale = (levelWidth - 32)/dialogBackgroundImage.width;
        context.translate(16, -500 * scale);
        context.scale(scale, scale);
    }

    drawSpeaker(currentBeat.speaker, context);
    context.drawImage(dialogBackgroundImage, 0, 200);
    context.font = "40px Varela Round";
    context.fillStyle = "black";
    const speakerName = GetSpeakerDisplayName(currentBeat.speaker);
    context.fillRect(105, 195, context.measureText(speakerName).width + 10, 50);
    context.fillStyle = "white";
    context.fillText(speakerName, 110, 233);
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
    else if (speaker === 'witch1') {
        drawSprite(
            context,
            witch1IdleAnimation.spritesheet,
            230,
            0,
            witch1IdleAnimation.getFrame(performance.now()),
            false,
            { width: portraitSize * 2, height: portraitSize * 2 },
        )
        
    }
    else if (speaker === 'witch2') {
        drawSprite(
            context,
            witch2IdleAnimation.spritesheet,
            230,
            0,
            witch2IdleAnimation.getFrame(performance.now()),
            false,
            { width: portraitSize * 2, height: portraitSize * 2 },
        )
        
    }
}