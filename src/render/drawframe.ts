import { currentLevel } from "~/game/levels";
import { getCurrentMessage } from "~/story";
// import { getCurrentBeat } from "~/story";

const canvas = document.querySelector("canvas")!;
const context = canvas.getContext("2d")!;

export const camera = { x: 0, y: 0, scale: 1 };

export const GRID_SQUARE_WIDTH = 32;
export const GRID_SQUARE_HEIGHT = 32;

const COLOR_GRID_SQUARE_FILL_LIGHT = "hsl(171 12% 35%)";
const COLOR_GRID_SQUARE_FILL_DARK = "hsl(171 12% 25%)";
const COLOR_GRID_LINE_LIGHT = "#1e1e1e";
const COLOR_GRID_LINE_DARK = "black";


function drawGrid(context: CanvasRenderingContext2D, width: number, height: number) {
    for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
            const gradient = context.createRadialGradient(
                x * GRID_SQUARE_WIDTH + GRID_SQUARE_WIDTH / 2,
                y * GRID_SQUARE_HEIGHT,
                0,
                x * GRID_SQUARE_WIDTH + GRID_SQUARE_WIDTH / 2,
                y * GRID_SQUARE_HEIGHT + GRID_SQUARE_HEIGHT / 4,
                GRID_SQUARE_HEIGHT * 1.2
            );
            gradient.addColorStop(0, COLOR_GRID_SQUARE_FILL_LIGHT);
            gradient.addColorStop(1, COLOR_GRID_SQUARE_FILL_DARK);
            context.fillStyle = gradient;
            context.fillRect(x * GRID_SQUARE_WIDTH, y * GRID_SQUARE_HEIGHT, GRID_SQUARE_WIDTH, GRID_SQUARE_HEIGHT);
        }
    }

    // grid lines
    for (let x = 0; x <= width; x++) {
        context.strokeStyle = COLOR_GRID_LINE_LIGHT;
        if (x === 0 || x === width) {
            context.strokeStyle = COLOR_GRID_LINE_DARK;
        }
        context.beginPath();
        context.moveTo(x * GRID_SQUARE_WIDTH, 0);
        context.lineTo(x * GRID_SQUARE_WIDTH, height * GRID_SQUARE_HEIGHT);
        context.closePath();
        context.stroke();
    }
    for (let y = 0; y <= height; y++) {
        context.strokeStyle = COLOR_GRID_LINE_LIGHT;
        if (y === 0 || y === height) {
            context.strokeStyle = COLOR_GRID_LINE_DARK;
        }
        context.beginPath();
        context.moveTo(0, y * GRID_SQUARE_HEIGHT);
        context.lineTo(width * GRID_SQUARE_WIDTH, y * GRID_SQUARE_HEIGHT);
        context.closePath();
        context.stroke();
    }

    // fill out the squares
    context.fillStyle = COLOR_GRID_SQUARE_FILL_DARK;
    context.strokeStyle = COLOR_GRID_LINE_LIGHT;
    for (let x = 0; x < width; x++) {
        context.fillRect(x * GRID_SQUARE_WIDTH, height * GRID_SQUARE_HEIGHT, GRID_SQUARE_WIDTH, GRID_SQUARE_HEIGHT / 8);
    }
    for (let x = 0; x <= width; x++) {
        context.strokeStyle = COLOR_GRID_LINE_LIGHT;
        if (x === 0 || x === width) {
            context.strokeStyle = COLOR_GRID_LINE_DARK;
        }
        context.beginPath();
        context.moveTo(x * GRID_SQUARE_WIDTH, height * GRID_SQUARE_HEIGHT);
        context.lineTo(x * GRID_SQUARE_WIDTH, height * GRID_SQUARE_HEIGHT + GRID_SQUARE_HEIGHT / 8);
        context.closePath();
        context.stroke();
    }
    context.strokeStyle = COLOR_GRID_LINE_DARK;
    context.beginPath();
    context.moveTo(0, height * GRID_SQUARE_HEIGHT + GRID_SQUARE_HEIGHT / 8);
    context.lineTo(width * GRID_SQUARE_WIDTH, height * GRID_SQUARE_HEIGHT + GRID_SQUARE_HEIGHT / 8);
    context.closePath();
    context.stroke();
}


export function drawFrame() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.imageSmoothingEnabled = false;


    context.save();
    context.translate(canvas.width / 2 - camera.x * camera.scale, canvas.height / 2 - camera.y * camera.scale);

    // render story bits
    const currentBeat = getCurrentMessage();

    if (currentBeat) {
        context.fillText(currentBeat.message, 0, 0);
    }


    if (currentLevel) {
        camera.x = 0;
        camera.y = 0;
        drawGrid(context, currentLevel.gridWidth, currentLevel.gridHeight);
    }

    context.restore();
}


if (import.meta.env.DEV) {
    //@ts-ignore
    window.DEBUG_CAMERA = camera;
}