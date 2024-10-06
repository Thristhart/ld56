import { clearActionAnimations, clearUndoAnimations, lastActionResults, lastActionTimestamp, lastUndoActionResults, lastUndoTimestamp } from "~/game/actions";
import { currentLevelState, EntityData, GetCircuitResponseElementAtLocation, LevelContent } from "~/game/levels";
import { animateActionResult } from "./animateaction";
import { COLOR_CURRENT_CREATURE_HIGHLIGHT, COLOR_GRID_LINE_LIGHT, GetTerrainColor } from "./colors";
import { drawDialog } from "./drawdialog";
import { bridgeClosedHorizontalImage, bridgeClosedVerticalImage, bridgeOpenHorizontalImage, bridgeOpenVerticalImage, chasmTopEdgeImage, doorOpenAnimation, fliesAnimation, GetEntityPortrait, GetSpriteForEntity, GetTerrainAnimation, GetTerrainBackground, treeImage, treeWallBackgroundImage, tunnelBackgroundImage, wall9GridImage, waterTopEdgeBackgroundAnimation } from "./images";
import { drawSprite, SpriteAnimationDetails } from "./spritesheet";

const canvas = document.querySelector("canvas")!;
const context = canvas.getContext("2d")!;

export const camera = { x: 0, y: 0, scale: 1, trueScale: 1 };

export const GRID_SQUARE_WIDTH = 32;
export const GRID_SQUARE_HEIGHT = 32;


function isWallLike(col: number, row: number) {
    if (!currentLevelState) {
        return false;
    }
    if (row === 0 || col === 0 || row === currentLevelState.rows - 1 || col === currentLevelState.columns - 1) {
        return false;
    }
    const terrain = currentLevelState.groundGrid[row]?.[col];
    return terrain === "wall" || terrain === "door" || terrain === "tunnel";
}
function isWall(col: number, row: number) {
    if (!currentLevelState) {
        return false;
    }
    if (row === 0 || col === 0 || row === currentLevelState.rows - 1 || col === currentLevelState.columns - 1) {
        return true;
    }
    const terrain = currentLevelState.groundGrid[row]?.[col];
    return terrain === "wall";
}

function identify9GridForWall(level: LevelContent, col: number, row: number): readonly [x: number, y: number] {
    if (isWallLike(col - 1, row) && isWallLike(col + 1, row) && isWallLike(col, row - 1) && !isWallLike(col, row + 1)) {
        return [4, 0];
    }
    if (isWallLike(col - 1, row) && isWallLike(col + 1, row) && isWallLike(col, row + 1) && !isWallLike(col, row - 1)) {
        return [4, 1];
    }
    if (isWallLike(col, row + 1) && isWallLike(col + 1, row)) {
        return [0, 0];
    }
    if (isWallLike(col, row - 1) && isWallLike(col + 1, row)) {
        return [0, 2];
    }
    if (isWallLike(col, row + 1) && isWallLike(col - 1, row)) {
        return [2, 0];
    }
    if (isWallLike(col, row - 1) && isWallLike(col - 1, row)) {
        return [2, 2];
    }
    if (isWallLike(col, row - 1) && !isWallLike(col, row + 1)) {
        return [2, 1];
    }
    if (isWallLike(col, row + 1) && !isWallLike(col, row - 1)) {
        return [1, 1];
    }
    if (isWallLike(col - 1, row) && !isWallLike(col + 1, row)) {
        return [3, 1];
    }
    if (isWallLike(col + 1, row) && !isWallLike(col - 1, row)) {
        return [3, 0];
    }
    if (!(isWallLike(col, row - 1) || isWallLike(col, row + 1))) {
        return [1, 0];
    }
    return [0, 1];
}

function draw9GridWall(col: number, row: number, nineGrid: readonly [x: number, y: number]) {
    context.drawImage(wall9GridImage, nineGrid[0] * 32, nineGrid[1] * 32, 32, 32, col * GRID_SQUARE_WIDTH, row * GRID_SQUARE_HEIGHT, 32, 32);
}

function drawGrid(level: LevelContent, timestamp: number) {
    const width = level.columns;
    const height = level.rows;

    // draw the foresty background
    for (let row = -10; row < height + 10; row++) {
        for (let col = -10; col < width + 10; col++) {
            context.drawImage(treeWallBackgroundImage, col * GRID_SQUARE_WIDTH, row * GRID_SQUARE_HEIGHT, GRID_SQUARE_WIDTH, GRID_SQUARE_HEIGHT);
        }
    }


    // fill out the ground squares
    for (let row = 0; row < height; row++) {
        const groundRow = level.groundGrid[row];
        if (groundRow && groundRow.length) {
            for (let col = 0; col < width; col++) {
                const terrainType = groundRow[col];
                if (terrainType) {
                    if (terrainType === "wall") {
                        context.drawImage(GetTerrainBackground("ground")!, col * GRID_SQUARE_WIDTH, row * GRID_SQUARE_HEIGHT, GRID_SQUARE_WIDTH, GRID_SQUARE_HEIGHT);
                        const parts = new Set<TreeFragment>();
                        if (col === 0) {
                            parts.add("tl");
                            parts.add("bl");
                        }
                        if (col === groundRow.length - 1) {
                            parts.add("tr");
                            parts.add("br");
                        }
                        if (row === 0) {
                            parts.add("tl");
                            parts.add("tr");
                        }
                        if (row === height - 1) {
                            parts.add("bl");
                            parts.add("br");
                        }
                        if (isWall(col - 1, row) && isWall(col, row - 1) && isWall(col - 1, row - 1)) {
                            parts.add("tl");
                        }
                        if (isWall(col + 1, row) && isWall(col, row - 1) && isWall(col + 1, row - 1)) {
                            parts.add("tr");
                        }
                        if (isWall(col - 1, row) && isWall(col, row + 1) && isWall(col - 1, row + 1)) {
                            parts.add("bl");
                        }
                        if (isWall(col + 1, row) && isWall(col, row + 1) && isWall(col + 1, row + 1)) {
                            parts.add("br");
                        }

                        // Not an edge wall, so we don't draw trees. Instead draw a wall
                        if (parts.size === 0) {
                            draw9GridWall(col, row, identify9GridForWall(level, col, row));
                            continue;
                        }
                        else {
                            const partArray = Array.from(parts);
                            const topParts = partArray.filter(part => part.startsWith("t"));
                            const bottomParts = partArray.filter(part => part.startsWith("b"));
                            topParts.forEach(frag => drawTreeFragment(col, row, frag));
                            drawTreeFragment(col, row, "center");
                            bottomParts.forEach(frag => drawTreeFragment(col, row, frag));
                            continue;
                        }
                    }
                    if(terrainType === "tunnel")
                    {
                        if(isWall(col, row - 1))
                        {
                            context.drawImage(tunnelBackgroundImage, 32, 0, 32, 32, col * GRID_SQUARE_WIDTH, row * GRID_SQUARE_HEIGHT, GRID_SQUARE_WIDTH, GRID_SQUARE_HEIGHT);
                        }
                        else {
                            context.drawImage(tunnelBackgroundImage, 0, 0, 32, 32, col * GRID_SQUARE_WIDTH, row * GRID_SQUARE_HEIGHT, GRID_SQUARE_WIDTH, GRID_SQUARE_HEIGHT);
                        }
                        continue;
                    }
                    if(terrainType === "door")
                    {
                        const circuitResponse = GetCircuitResponseElementAtLocation(level, {row, column: col});
                        context.drawImage(GetTerrainBackground("ground")!, col * GRID_SQUARE_WIDTH, row * GRID_SQUARE_HEIGHT, GRID_SQUARE_WIDTH, GRID_SQUARE_HEIGHT);
                        if(isWall(col, row - 1))
                        {
                            const frame = circuitResponse?.isActive ?  [0, 0] as const : doorOpenAnimation.getFrame(timestamp);
                            drawSprite(context, doorOpenAnimation.spritesheet, col * GRID_SQUARE_WIDTH + GRID_SQUARE_WIDTH / 2 - 10, row * GRID_SQUARE_HEIGHT + GRID_SQUARE_HEIGHT / 2 - 6, frame, false, {width: 48, height: 64});
                        }
                        else {
                            const frame = circuitResponse?.isActive ?  doorOpenAnimation.getFrame(timestamp) : [0, 0] as const;
                            drawSprite(context, doorOpenAnimation.spritesheet, col * GRID_SQUARE_WIDTH + GRID_SQUARE_WIDTH / 2, row * GRID_SQUARE_HEIGHT + GRID_SQUARE_HEIGHT / 2 - 16, frame, false,  {width: 64, height: 96});
                        }
                        continue;
                    }
                    let terrainAnimation = GetTerrainAnimation(terrainType);
                    if(terrainType === "water")
                    {
                        const above = level.groundGrid[row - 1][col];
                        if(above !== "water" && above !== "boulder-water")
                        {
                            terrainAnimation = waterTopEdgeBackgroundAnimation;
                        }
                    }
                    if(terrainType == "boulder-water")
                    {
                        const above = level.groundGrid[row - 1][col];
                        let waterAnim = GetTerrainAnimation("water")!;
                        if(above !== "water" && above !== "boulder-water")
                        {
                            waterAnim = waterTopEdgeBackgroundAnimation
                        }
                        drawSprite(context, waterAnim.spritesheet, col * GRID_SQUARE_WIDTH + GRID_SQUARE_WIDTH / 2, row * GRID_SQUARE_HEIGHT + GRID_SQUARE_HEIGHT / 2, waterAnim.getFrame(timestamp), false, { width: GRID_SQUARE_WIDTH, height: GRID_SQUARE_HEIGHT });
                        drawSprite(context, terrainAnimation!.spritesheet, col * GRID_SQUARE_WIDTH + GRID_SQUARE_WIDTH / 2, row * GRID_SQUARE_HEIGHT + GRID_SQUARE_HEIGHT / 2 + 10, terrainAnimation!.getFrame(timestamp), false, { width: GRID_SQUARE_WIDTH, height: GRID_SQUARE_HEIGHT });
                        continue;
                    }
                    if (terrainAnimation) {
                        drawSprite(context, terrainAnimation.spritesheet, col * GRID_SQUARE_WIDTH + GRID_SQUARE_WIDTH / 2, row * GRID_SQUARE_HEIGHT + GRID_SQUARE_HEIGHT / 2, terrainAnimation.getFrame(timestamp), false, { width: GRID_SQUARE_WIDTH, height: GRID_SQUARE_HEIGHT });
                        continue;
                    }

                    if(terrainType === "goal")
                    {
                        context.drawImage(GetTerrainBackground("ground")!, col * GRID_SQUARE_WIDTH, row * GRID_SQUARE_HEIGHT, GRID_SQUARE_WIDTH, GRID_SQUARE_HEIGHT);
                    }
                    if(terrainType == "chasm")
                    {
                        const above = level.groundGrid[row - 1][col];
                        if(above !== "chasm" && above !== "bridge" && above !== "boulder-chasm")
                        {
                            context.drawImage(chasmTopEdgeImage, col * GRID_SQUARE_WIDTH, row * GRID_SQUARE_HEIGHT, GRID_SQUARE_WIDTH, GRID_SQUARE_HEIGHT);
                            continue;
                        }
                    }
                    if(terrainType === "bridge")
                    {
                        const above = level.groundGrid[row - 1][col];
                        if(above !== "chasm" && above !== "bridge" && above !== "boulder-chasm")
                        {
                            context.drawImage(chasmTopEdgeImage, col * GRID_SQUARE_WIDTH, row * GRID_SQUARE_HEIGHT, GRID_SQUARE_WIDTH, GRID_SQUARE_HEIGHT);
                        }
                        else {
                            context.fillStyle = "black";
                            context.fillRect(col * GRID_SQUARE_WIDTH, row * GRID_SQUARE_HEIGHT, GRID_SQUARE_WIDTH, GRID_SQUARE_HEIGHT);
                        }
                        const circuitResponse = GetCircuitResponseElementAtLocation(level, {row, column: col});
                        
                        if(above === "chasm")
                        {
                            let horizBridgeImage = circuitResponse?.isActive ? bridgeOpenHorizontalImage : bridgeClosedHorizontalImage;
                            context.drawImage(horizBridgeImage, col * GRID_SQUARE_WIDTH, row * GRID_SQUARE_HEIGHT, GRID_SQUARE_WIDTH, GRID_SQUARE_HEIGHT);
                        }
                        else {
                            let verticalBridgeImage = circuitResponse?.isActive ? bridgeOpenVerticalImage : bridgeClosedVerticalImage;
                            context.drawImage(verticalBridgeImage, col * GRID_SQUARE_WIDTH, row * GRID_SQUARE_HEIGHT, GRID_SQUARE_WIDTH, GRID_SQUARE_HEIGHT);
                        }
                        continue;
                    }

                    const activeElement = GetCircuitResponseElementAtLocation(level, { row: row, column: col })
                    const activeElementState = activeElement && activeElement.isActive;
                    const terrainBackground = GetTerrainBackground(terrainType, !!activeElementState)
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
}

type TreeFragment = "tl" | "tr" | "bl" | "br" | "center";
function drawTreeFragment(col: number, row: number, fragment: TreeFragment) {
    if (fragment === "tl") {
        context.drawImage(treeImage, 16, 16, 16, 16, col * GRID_SQUARE_WIDTH, row * GRID_SQUARE_HEIGHT, 16, 16);
    }
    if (fragment === "tr") {
        context.drawImage(treeImage, 0, 16, 16, 16, col * GRID_SQUARE_WIDTH + 16, row * GRID_SQUARE_HEIGHT, 16, 16);
    }
    if (fragment === "bl") {
        context.drawImage(treeImage, 16, 0, 16, 16, col * GRID_SQUARE_WIDTH, row * GRID_SQUARE_HEIGHT + 16, 16, 16);
    }
    if (fragment === "br") {
        context.drawImage(treeImage, 0, 0, 16, 16, col * GRID_SQUARE_WIDTH + 16, row * GRID_SQUARE_HEIGHT + 16, 16, 16);
    }
    if (fragment === "center") {
        context.drawImage(treeImage, 0, 0, 32, 32, col * GRID_SQUARE_WIDTH, row * GRID_SQUARE_HEIGHT, 32, 32);
    }
}

export let canvasScale = 1;

function fitLevelToCamera() {
    if (!currentLevelState) {
        return;
    }
    const width = (currentLevelState.columns + 2) * GRID_SQUARE_WIDTH;
    const height = (currentLevelState.rows + 2) * GRID_SQUARE_HEIGHT;
    const scale = Math.min(canvas.width / width, canvas.height / height);
    camera.x = width / 2 - GRID_SQUARE_WIDTH;
    camera.y = height / 2 - GRID_SQUARE_HEIGHT;
    camera.scale = Math.floor(scale);
    canvasScale = scale / camera.scale;
    camera.trueScale = scale;
    canvas.style.transform = `scale(${canvasScale})`
}

function sortEntities(a: EntityData, b: EntityData) {

    // otherwise turtle should be most-bottom
    if (a.type === "turtle") {
        return -1;
    }
    if (b.type === "turtle") {
        return 1;
    }

    return 0;
}

function drawEntities(levelState: LevelContent, timestamp: number)
{
    const actionAnimations = lastActionResults?.map(result => animateActionResult(result, timestamp - lastActionTimestamp!)) ?? [];
    const undoAnimations = [];
    if ((lastUndoTimestamp ?? 0) > (lastActionTimestamp ?? 0)) {
        undoAnimations.push(...(lastUndoActionResults?.map(result => animateActionResult(result, timestamp - lastUndoTimestamp!, -1)) ?? []));
    }

    const sortedEntities = [...levelState.entities].sort(sortEntities);
    for (const entity of sortedEntities) {
        const portrait = GetEntityPortrait(entity.type);
        const positionModification = { column: 0, row: 0 };
        let spriteAnimationDetails: SpriteAnimationDetails | undefined;
        actionAnimations.forEach(animation => {
            const mod = animation.entityPositionModifications.get(entity.id);
            if (mod) {
                positionModification.column += mod.column;
                positionModification.row += mod.row;
            }
            const spriteAnim = animation.entitySpriteAnimations.get(entity.id);
            if (spriteAnim) {
                spriteAnimationDetails = {
                    ...spriteAnim,
                    direction: 1,
                    startTime: lastActionTimestamp!,
                    onComplete() {
                        clearActionAnimations()
                    },
                };
            }
        });
        undoAnimations.forEach(undoAnimation => {
            const mod = undoAnimation.entityPositionModifications.get(entity.id);
            if (mod) {
                positionModification.column += mod.column;
                positionModification.row += mod.row;
            }
            const spriteAnim = undoAnimation.entitySpriteAnimations.get(entity.id);
            if (spriteAnim) {
                spriteAnimationDetails = {
                    ...spriteAnim,
                    direction: -1,
                    startTime: lastUndoTimestamp!,
                    onComplete() {
                        clearUndoAnimations()
                    },
                };
            }
        });
        const entityLocation = {
            column: entity.location.column + positionModification.column,
            row: entity.location.row + positionModification.row,
        }

        if (levelState.currentEntityId === entity.id) {
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
        if(entity.type === "insect")
        {
            let dt = timestamp/50 + (1000 * entityLocation.column / entityLocation.row);
            drawSprite(
                context,
                fliesAnimation.spritesheet,
                entityLocation.column * GRID_SQUARE_WIDTH + GRID_SQUARE_WIDTH / 2 + Math.sin(dt/10) * 10,
                entityLocation.row * GRID_SQUARE_HEIGHT + GRID_SQUARE_HEIGHT / 2+ Math.cos(dt/3) * 10,
                fliesAnimation.getFrame(performance.now()),
            )
            drawSprite(
                context,
                fliesAnimation.spritesheet,
                entityLocation.column * GRID_SQUARE_WIDTH + GRID_SQUARE_WIDTH / 2 + Math.sin(dt/2) * 10,
                entityLocation.row * GRID_SQUARE_HEIGHT + GRID_SQUARE_HEIGHT / 2+ Math.cos(dt/4) * 10,
                fliesAnimation.getFrame(performance.now()),
            )
            drawSprite(
                context,
                fliesAnimation.spritesheet,
                entityLocation.column * GRID_SQUARE_WIDTH + GRID_SQUARE_WIDTH / 2 + Math.cos(dt/6) * 15,
                entityLocation.row * GRID_SQUARE_HEIGHT + GRID_SQUARE_HEIGHT / 2+ Math.sin(dt/10) * 10,
                fliesAnimation.getFrame(performance.now()),
            )
            drawSprite(
                context,
                fliesAnimation.spritesheet,
                entityLocation.column * GRID_SQUARE_WIDTH + GRID_SQUARE_WIDTH / 2 + Math.cos(dt/10) * 10,
                entityLocation.row * GRID_SQUARE_HEIGHT + GRID_SQUARE_HEIGHT / 2+ Math.sin(dt/10) * 15,
                fliesAnimation.getFrame(performance.now()),
            )
            drawSprite(
                context,
                fliesAnimation.spritesheet,
                entityLocation.column * GRID_SQUARE_WIDTH + GRID_SQUARE_WIDTH / 2 + Math.sin(dt/3) * 10,
                entityLocation.row * GRID_SQUARE_HEIGHT + GRID_SQUARE_HEIGHT / 2+ Math.sin(dt/8) * 3,
                fliesAnimation.getFrame(performance.now()),
            )
            continue;
        }
        const spriteDetails = spriteAnimationDetails ?? GetSpriteForEntity(entity);
        if (spriteDetails) {
            drawSprite(
                context,
                spriteDetails.sprite.spritesheet,
                entityLocation.column * GRID_SQUARE_WIDTH + GRID_SQUARE_WIDTH / 2,
                entityLocation.row * GRID_SQUARE_HEIGHT + GRID_SQUARE_HEIGHT / 2,
                spriteDetails.sprite.getFrame(performance.now() - spriteDetails.startTime, spriteDetails),
                entity.facing === "left",
                spriteDetails.renderDimensions,
            )
        }
        else if(portrait) {
            context.save();
            let scale = entity.facing === "left" ? -1 : 1;
            context.scale(scale, 1);
            context.translate(scale * entityLocation.column * GRID_SQUARE_WIDTH - (scale === -1 ? GRID_SQUARE_WIDTH : 0), 0);
            context.drawImage(portrait, 0, entityLocation.row * GRID_SQUARE_HEIGHT, GRID_SQUARE_WIDTH, GRID_SQUARE_HEIGHT);
            context.restore();
        }
    }
}

export function drawFrame(timestamp: number) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.imageSmoothingEnabled = false;

    fitLevelToCamera();

    context.save();
    context.translate(Math.round(canvas.width / 2 - camera.x * camera.scale), Math.round(canvas.height / 2 - camera.y * camera.scale));
    context.scale(camera.scale, camera.scale);

    if (currentLevelState) {
        drawGrid(currentLevelState, timestamp);
        drawEntities(currentLevelState, timestamp);
    }
    // render story bits
    drawDialog(context);

    context.restore();

}


if (import.meta.env.DEV) {
    //@ts-ignore
    window.DEBUG_CAMERA = camera;
}