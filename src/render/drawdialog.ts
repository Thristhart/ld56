import { getCurrentMessage } from "~/story";
import { dialogBackgroundImage, turtlePortraitImage } from "./images";

const portraitSize = 300;
export function drawDialog(context: CanvasRenderingContext2D) {
    const currentBeat = getCurrentMessage();

    if (!currentBeat) {
        return;
    }
    if(currentBeat.type == "cleardialog")
    {
        return;
    }

    context.save();
    const scale = (window.innerWidth - 200) / dialogBackgroundImage.width;
    context.translate(100, window.innerHeight - 500 * scale);
    context.scale(scale, scale);

    context.drawImage(turtlePortraitImage, 70, 0, portraitSize, portraitSize);
    context.drawImage(dialogBackgroundImage, 0, 200);
    context.font = "40px Arial";
    context.fillStyle = "black";
    context.fillRect(95, 200, 120, 40);
    context.fillStyle = "white";
    context.fillText("turtle", 110, 233);
    context.fillStyle = "black";
    context.fillText(currentBeat.message, 100, 300);

    context.restore();
}