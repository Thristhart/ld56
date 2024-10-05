import { currentLevel, currentLevelState, LevelContent } from "~/game/levels";
import { COLOR_GRID_SQUARE_FILL_DARK, COLOR_GRID_LINE_LIGHT, COLOR_GRID_LINE_DARK, GetTerrainColor } from "./colors";
import { drawDialog } from "./drawdialog";
import { GetEntityPortrait } from "./images";
import { animateActionResult } from "./animateaction";
import { lastActionResults, lastActionTimestamp } from "~/game/actions";

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
        const groundRow = level.groundGrid[row];
        if (groundRow && groundRow.length) {
            for (let col = 0; col < width; col++) {
                const terrainType = groundRow[col];
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


function fitLevelToCamera()
{
    if(!currentLevelState)
    {
        return;
    }
    const width = currentLevelState.columns * GRID_SQUARE_WIDTH;
    const height= currentLevelState.rows * GRID_SQUARE_HEIGHT;
    const scale = Math.min(canvas.width / width, canvas.height / height);
    camera.x = width / 2;
    camera.y = height / 2;
    camera.scale = scale;
}

export function drawFrame(timestamp: number) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.imageSmoothingEnabled = false;

    fitLevelToCamera();

    context.save();
    context.translate(canvas.width / 2 - camera.x * camera.scale, canvas.height / 2 - camera.y * camera.scale);
    context.scale(camera.scale, camera.scale);

    if (currentLevelState) {
        drawGrid(context, currentLevelState);

        const animations = lastActionResults?.map(result => animateActionResult(result, timestamp - lastActionTimestamp!));
        // fill out the entities
        for (const entity of currentLevelState.entities) {
            const portrait = GetEntityPortrait(entity.type);
            if (portrait) {
                const positionModification = {column: 0, row: 0};
                animations?.forEach(animation => {
                    const mod = animation.entityPositionModifications.get(entity.id);
                    if(mod)
                    {
                        positionModification.column += mod.column;
                        positionModification.row += mod.row;
                    }
                })
                context.drawImage(portrait, (entity.location.column + positionModification.column) * GRID_SQUARE_WIDTH, (entity.location.row + positionModification.row) * GRID_SQUARE_HEIGHT, GRID_SQUARE_WIDTH, GRID_SQUARE_HEIGHT);
            }
        }
    }

    context.restore();

    // render story bits
    drawDialog(context);
}


if (import.meta.env.DEV) {
    //@ts-ignore
    window.DEBUG_CAMERA = camera;
}