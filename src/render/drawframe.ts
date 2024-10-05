import { currentLevel, LevelContent } from "~/game/levels";
import { getCurrentMessage } from "~/story";
import { COLOR_GRID_SQUARE_FILL_DARK, COLOR_GRID_LINE_LIGHT, COLOR_GRID_LINE_DARK, GetTerrainColor } from "./colors";
// import { getCurrentBeat } from "~/story";

const canvas = document.querySelector("canvas")!;
const context = canvas.getContext("2d")!;

export const camera = { x: 0, y: 0, scale: 1 };

export const GRID_SQUARE_WIDTH = 32;
export const GRID_SQUARE_HEIGHT = 32;

function drawGrid(context: CanvasRenderingContext2D, level: LevelContent) {
    const width = level.columns;
    const height = level.rows;

    // fill out the ground squares
    for (let row = 0; row < height; row++) {
        const groundRow = level.ground.get(row);
        if (groundRow && groundRow.size) {
            for (let col = 0; col < width; col++) {
                const terrainType = groundRow.get(col);
                if (terrainType) {
                    context.fillStyle = GetTerrainColor(terrainType);
                    context.fillRect(col * GRID_SQUARE_WIDTH, row * GRID_SQUARE_HEIGHT, GRID_SQUARE_WIDTH, GRID_SQUARE_HEIGHT);
                }
            }
        }
    }

    // fill out grid lines
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
        drawGrid(context, currentLevel);
    }

    context.restore();
}


if (import.meta.env.DEV) {
    //@ts-ignore
    window.DEBUG_CAMERA = camera;
}