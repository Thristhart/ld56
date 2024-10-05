import { ActionResult, clearActionAnimations, clearUndoAnimations, lastActionTimestamp, lastUndoTimestamp } from "~/game/actions";
import { currentLevelState, GetTileAtLocation } from "~/game/levels";
import { SpriteAnimation, SpriteAnimationDetails } from "./spritesheet";
import { boulderRollAnimation, turtleHideAnimation, turtleUnhideAnimation } from "./images";

export function lerp(a: number, b: number, t: number)
{
    return a * (1 - t) + b * t;
}

export function clamp(n: number, min = 0, max = 1) {
    return Math.min(max, Math.max(min, n));
}

const MOVE_ANIMATION_DURATION_MS = 144;

export function animateActionResult(actionResult: ActionResult, dt: number)
{
    const entityPositionModifications = new Map<number, {row: number, column: number}>();
    const entitySpriteAnimations = new Map<number, SpriteAnimationDetails>();
    switch(actionResult.type)
    {
        case "MoveEntity": {
            // The entity has moved to the new location, so we want to lerp
            // from the old location (diff * -1) to the new location (0)
            let t = clamp(dt / MOVE_ANIMATION_DURATION_MS);
            const diff = {
                row: actionResult.newLocation.row - actionResult.oldLocation.row,
                column: actionResult.newLocation.column - actionResult.oldLocation.column,
            };
            const lerped = lerp(-1, 0, t);
            entityPositionModifications.set(actionResult.entityid, {row: diff.row * lerped, column: diff.column * lerped})

            if(!currentLevelState)
            {
                break;
            }
            const entity = currentLevelState.entities.find(ent => ent.id === actionResult.entityid);
            if(entity?.type === "turtle")
            {
                const prevTile = GetTileAtLocation(currentLevelState, actionResult.oldLocation);
                const nextTile = GetTileAtLocation(currentLevelState, actionResult.newLocation);
                if(prevTile !== "water" && nextTile === "water")
                {
                    entitySpriteAnimations.set(entity.id, {
                        sprite: turtleHideAnimation,
                        direction: 1,
                        startTime: lastActionTimestamp!,
                        onComplete() {
                            clearActionAnimations();
                        },
                    });
                }
                else if(prevTile === "water" && nextTile !== "water")
                {
                    entitySpriteAnimations.set(entity.id, {
                        sprite: turtleUnhideAnimation,
                        direction: 1,
                        startTime: lastActionTimestamp!,
                        onComplete() {
                            clearActionAnimations();
                        },
                    });
                }
            }
            if(entity?.type === "boulder")
            {
                entitySpriteAnimations.set(entity.id, {
                    sprite: boulderRollAnimation,
                    direction: 1,
                    startTime: lastActionTimestamp!,
                    onComplete() {
                        clearActionAnimations();
                    },
                    renderDimensions: {width: 32, height: 32},
                })
            }
            break;
        }
    }
    return {entityPositionModifications, entitySpriteAnimations};
}

export function animateActionResultUndo(actionResult: ActionResult, dt: number)
{
    const entityPositionModifications = new Map<number, {row: number, column: number}>();
    const entitySpriteAnimations = new Map<number, SpriteAnimationDetails>();
    switch(actionResult.type)
    {
        case "MoveEntity": {
            // Undoing the entity moving to a new location, so we want to lerp
            // from the new location (0) to the old location (diff * -1)
            let t = clamp(dt / MOVE_ANIMATION_DURATION_MS);
            const diff = {
                row: actionResult.newLocation.row - actionResult.oldLocation.row,
                column: actionResult.newLocation.column - actionResult.oldLocation.column,
            };
            const lerped = lerp(1, 0, t);
            entityPositionModifications.set(actionResult.entityid, {row: diff.row * lerped, column: diff.column * lerped})
            
            if(!currentLevelState)
            {
                break;
            }
            const entity = currentLevelState.entities.find(ent => ent.id === actionResult.entityid);
            if(entity?.type === "turtle")
            {
                const prevTile = GetTileAtLocation(currentLevelState, actionResult.oldLocation);
                const nextTile = GetTileAtLocation(currentLevelState, actionResult.newLocation);
                if(prevTile !== "water" && nextTile === "water")
                {
                    entitySpriteAnimations.set(entity.id, {
                        sprite: turtleHideAnimation,
                        direction: -1,
                        startTime: lastUndoTimestamp!,
                        onComplete() {
                            clearUndoAnimations();
                        },
                    });
                }
                else if(prevTile === "water" && nextTile !== "water")
                {
                    entitySpriteAnimations.set(entity.id, {
                        sprite: turtleUnhideAnimation,
                        direction: -1,
                        startTime: lastUndoTimestamp!,
                        onComplete() {
                            clearUndoAnimations();
                        },
                    });
                }
            }
            if(entity?.type === "boulder")
            {
                entitySpriteAnimations.set(entity.id, {
                    sprite: boulderRollAnimation,
                    direction: -1,
                    startTime: lastUndoTimestamp!,
                    onComplete() {
                        clearActionAnimations();
                    },
                    renderDimensions: {width: 32, height: 32},
                })
            }
            break;
        }
    }
    return {entityPositionModifications, entitySpriteAnimations};
}