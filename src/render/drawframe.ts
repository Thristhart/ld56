import { currentLevel, currentLevelState, EntityData, LevelContent } from "~/game/levels";
import { COLOR_GRID_SQUARE_FILL_DARK, COLOR_GRID_LINE_LIGHT, COLOR_GRID_LINE_DARK, GetTerrainColor, COLOR_CURRENT_CREATURE_HIGHLIGHT } from "./colors";
import { drawDialog } from "./drawdialog";
import { GetEntityPortrait, GetTerrainBackground, GetTerrainAnimation, GetSpriteForEntity, treeImage } from "./images";
import { lastActionResults, lastActionTimestamp, lastUndoActionResults, lastUndoTimestamp } from "~/game/actions";
import { animateActionResult, animateActionResultUndo } from "./animateaction";
import { drawSprite, SpriteAnimation, SpriteAnimationDetails } from "./spritesheet";

const canvas = document.querySelector("canvas")!;
const context = canvas.getContext("2d")!;

export const camera = { x: 0, y: 0, scale: 1 };

export const GRID_SQUARE_WIDTH = 32;
export const GRID_SQUARE_HEIGHT = 32;

function drawGrid(context: CanvasRenderingContext2D, level: LevelContent, timestamp: number) {
    const width = level.columns;
    const height = level.rows;

    // draw the foresty background
    for (let row = -10; row < height + 10; row++) {
        for (let col = -10; col < width + 10; col++) {
            context.drawImage(GetTerrainBackground("wall")!, col * GRID_SQUARE_WIDTH, row * GRID_SQUARE_HEIGHT, GRID_SQUARE_WIDTH, GRID_SQUARE_HEIGHT);
        }
    }


    // fill out the ground squares
    for (let row = 0; row < height; row++) {
        const groundRow = level.groundGrid[row];
        if (groundRow && groundRow.length) {
            for (let col = 0; col < width; col++) {
                const terrainType = groundRow[col];
                if (terrainType) {
                    if(terrainType === "wall")
                    {
                        context.drawImage(GetTerrainBackground("ground")!, col * GRID_SQUARE_WIDTH, row * GRID_SQUARE_HEIGHT, GRID_SQUARE_WIDTH, GRID_SQUARE_HEIGHT);
                        const parts: Array<TreeFragment> = []
                        if(col === 0)
                        {
                            parts.push("tl", "bl");
                        }
                        if(col === groundRow.length - 1)
                        {
                            parts.push("tr", "br");
                        }
                        if(row === 0)
                        {
                            parts.push("tl", "tr");
                        }
                        if(row === height - 1)
                        {
                            parts.push("bl", "br");
                        }
                        const topParts = parts.filter(part => part.startsWith("t"));
                        const bottomParts = parts.filter(part => part.startsWith("b"));
                        topParts.forEach(frag => drawTreeFragment(col, row, frag));
                        drawTreeFragment(col, row, "center");
                        bottomParts.forEach(frag => drawTreeFragment(col, row, frag));
                        continue;
                    }
                    const terrainAnimation = GetTerrainAnimation(terrainType);
                    if (terrainAnimation) {
                        drawSprite(context, terrainAnimation.spritesheet, col * GRID_SQUARE_WIDTH + GRID_SQUARE_WIDTH / 2, row * GRID_SQUARE_HEIGHT + GRID_SQUARE_HEIGHT / 2, terrainAnimation.getFrame(timestamp), { width: GRID_SQUARE_WIDTH, height: GRID_SQUARE_HEIGHT });
                        continue;
                    }
                    const terrainBackground = GetTerrainBackground(terrainType)
                    if (terrainBackground) {
                        context.drawImage(terrainBackground, col * GRID_SQUARE_WIDTH, row * GRID_SQUARE_HEIGHT, GRID_SQUARE_WIDTH, GRID_SQUARE_HEIGHT);
                    }
                    else {
                        context.fillStyle = GetTerrainColor(terrainType);
                        context.fillRect(col * GRID_SQUARE_WIDTH, row * GRID_SQUARE_HEIGHT, GRID_SQUARE_WIDTH, GRID_SQUARE_HEIGHT);
                    }
                }
            }
        }
    }

    context.lineWidth = 0.4;
    // fill out grid lines
    for (let x = -10; x <= width + 10; x++) {
        context.strokeStyle = COLOR_GRID_LINE_LIGHT;
        context.beginPath();
        context.moveTo(x * GRID_SQUARE_WIDTH, -10 * GRID_SQUARE_HEIGHT);
        context.lineTo(x * GRID_SQUARE_WIDTH, (height + 10) * GRID_SQUARE_HEIGHT);
        context.closePath();
        context.stroke();
    }
    for (let y = -10; y <= height + 10; y++) {
        context.strokeStyle = COLOR_GRID_LINE_LIGHT;
        context.beginPath();
        context.moveTo(-10 * GRID_SQUARE_WIDTH, y * GRID_SQUARE_HEIGHT);
        context.lineTo((width + 10) * GRID_SQUARE_WIDTH, y * GRID_SQUARE_HEIGHT);
        context.closePath();
        context.stroke();
    }
}

type TreeFragment = "tl" | "tr" | "bl" | "br" | "center";
function drawTreeFragment(col: number, row: number, fragment: TreeFragment)
{
    if(fragment === "tl") {
        context.drawImage(treeImage, 16, 16, 16, 16, col * GRID_SQUARE_WIDTH, row * GRID_SQUARE_HEIGHT, 16, 16 );
    }
    if(fragment === "tr") {
        context.drawImage(treeImage, 0, 16, 16, 16, col * GRID_SQUARE_WIDTH + 16, row * GRID_SQUARE_HEIGHT, 16, 16 );
    }
    if(fragment === "bl") {
        context.drawImage(treeImage, 16, 0, 16, 16, col * GRID_SQUARE_WIDTH, row * GRID_SQUARE_HEIGHT + 16, 16, 16 );
    }
    if(fragment === "br") {
        context.drawImage(treeImage, 0, 0, 16, 16, col * GRID_SQUARE_WIDTH + 16, row * GRID_SQUARE_HEIGHT + 16, 16, 16 );
    }
    if(fragment === "center") {
        context.drawImage(treeImage, 0, 0, 32, 32, col * GRID_SQUARE_WIDTH, row * GRID_SQUARE_HEIGHT, 32, 32 );
    }
}


function fitLevelToCamera() {
    if (!currentLevelState) {
        return;
    }
    const width = ( currentLevelState.columns + 2) * GRID_SQUARE_WIDTH;
    const height = ( currentLevelState.rows + 2) * GRID_SQUARE_HEIGHT;
    const scale = Math.min(canvas.width / width, canvas.height / height);
    camera.x = width / 2 - GRID_SQUARE_WIDTH;
    camera.y = height / 2 - GRID_SQUARE_HEIGHT;
    camera.scale = scale;
}

function sortEntities(a: EntityData, b: EntityData)
{

    // otherwise turtle should be most-bottom
    if(a.type === "turtle")
    {
        return -1;
    }
    if(b.type === "turtle")
    {
        return 1;
    }

    return 0;
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
        drawGrid(context, currentLevelState, timestamp);

        let animations = [
            ...lastActionResults?.map(result => animateActionResult(result, timestamp - lastActionTimestamp!)) ?? [],
        ];
        if( ( lastUndoTimestamp ?? 0 ) > ( lastActionTimestamp ?? 0 ))
        {
            animations.push(...(lastUndoActionResults?.map(result => animateActionResultUndo(result, timestamp - lastUndoTimestamp!)) ?? []));
        }
        
        const sortedEntities = [...currentLevelState.entities].sort(sortEntities);
        for (const entity of sortedEntities) {
            const portrait = GetEntityPortrait(entity.type);
            if (portrait) {
                const positionModification = {column: 0, row: 0};
                let spriteAnimationDetails: SpriteAnimationDetails | undefined;
                animations?.forEach(animation => {
                    const mod = animation.entityPositionModifications.get(entity.id);
                    if(mod)
                    {
                        positionModification.column += mod.column;
                        positionModification.row += mod.row;
                    }
                    const spriteAnim = animation.entitySpriteAnimations.get(entity.id);
                    if(spriteAnim)
                    {
                        spriteAnimationDetails = spriteAnim;
                    }
                });
                const entityLocation = {
                    column: entity.location.column + positionModification.column,
                    row: entity.location.row + positionModification.row,
                }

                if (currentLevelState.currentEntityId === entity.id) {
                    context.strokeStyle = COLOR_CURRENT_CREATURE_HIGHLIGHT;
                    context.fillStyle = COLOR_CURRENT_CREATURE_HIGHLIGHT;
                    context.beginPath();
                    context.ellipse(
                        entityLocation.column * GRID_SQUARE_WIDTH + 0.5 * GRID_SQUARE_WIDTH,
                        entityLocation.row * GRID_SQUARE_HEIGHT + 0.75 * GRID_SQUARE_HEIGHT,
                        0.125 * GRID_SQUARE_HEIGHT,
                        0.35 * GRID_SQUARE_WIDTH,
                        Math.PI / 2,
                        0,
                        2 * Math.PI
                    );
                    context.fill();
                }
                const spriteDetails = spriteAnimationDetails ?? GetSpriteForEntity(entity);
                if(spriteDetails)
                {
                    drawSprite(
                        context,
                        spriteDetails.sprite.spritesheet,
                        entityLocation.column * GRID_SQUARE_WIDTH + GRID_SQUARE_WIDTH / 2,
                        entityLocation.row * GRID_SQUARE_HEIGHT + GRID_SQUARE_HEIGHT / 2,
                        spriteDetails.sprite.getFrame(performance.now() - spriteDetails.startTime, spriteDetails)
                    )
                }
                else {
                    context.drawImage(portrait, entityLocation.column * GRID_SQUARE_WIDTH, entityLocation.row * GRID_SQUARE_HEIGHT, GRID_SQUARE_WIDTH, GRID_SQUARE_HEIGHT);
                }
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