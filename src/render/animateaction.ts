import { ActionResult, clearActionAnimations, clearUndoAnimations, lastActionTimestamp, lastUndoTimestamp } from "~/game/actions";
import { currentLevelState, GetTileAtLocation } from "~/game/levels";
import { SpriteAnimation, SpriteAnimationDetails } from "./spritesheet";
import { boulderRollAnimation, crowFlyAnimation, crowLandAnimation, crowTakeoffAnimation, frogHopAnimation, turtleHideAnimation, turtleUnhideAnimation } from "./images";
import { isFlyingTerrain, TerrainType } from "~/game/specifications";

export function lerp(a: number, b: number, t: number)
{
    return a * (1 - t) + b * t;
}

export function clamp(n: number, min = 0, max = 1) {
    return Math.min(max, Math.max(min, n));
}

const MOVE_ANIMATION_DURATION_MS = 144;


export function animateActionResult(actionResult: ActionResult, dt: number, direction=1)
{
    const entityPositionModifications = new Map<number, {row: number, column: number}>();
    const entitySpriteAnimations = new Map<number, Partial<SpriteAnimationDetails> & {sprite: SpriteAnimation}>();
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
            const lerped = lerp(-direction, 0, t);
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
                    });
                }
                else if(prevTile === "water" && nextTile !== "water")
                {
                    entitySpriteAnimations.set(entity.id, {
                        sprite: turtleUnhideAnimation,
                    });
                }
            }
            if(entity?.type === "turtle")
            {
                const prevTile = GetTileAtLocation(currentLevelState, actionResult.oldLocation);
                const nextTile = GetTileAtLocation(currentLevelState, actionResult.newLocation);
                if(prevTile !== "water" && nextTile === "water")
                {
                    entitySpriteAnimations.set(entity.id, {
                        sprite: turtleHideAnimation,
                    });
                }
                else if(prevTile === "water" && nextTile !== "water")
                {
                    entitySpriteAnimations.set(entity.id, {
                        sprite: turtleUnhideAnimation,
                    });
                }
            }
            if(entity?.type === "bird")
            {
                const prevTile = GetTileAtLocation(currentLevelState, actionResult.oldLocation);
                const nextTile = GetTileAtLocation(currentLevelState, actionResult.newLocation);
                if(!isFlyingTerrain(prevTile) && isFlyingTerrain(nextTile))
                {
                    entitySpriteAnimations.set(entity.id, {
                        sprite: crowTakeoffAnimation,
                    });
                }
                else if(isFlyingTerrain(prevTile) && !isFlyingTerrain(nextTile))
                {
                    entitySpriteAnimations.set(entity.id, {
                        sprite: crowLandAnimation,
                    });
                }
            }
            if(entity?.type === "boulder")
            {
                entitySpriteAnimations.set(entity.id, {
                    sprite: boulderRollAnimation,
                    renderDimensions: {width: 32, height: 32},
                })
            }
            if(entity?.type === "frog")
            {
                entitySpriteAnimations.set(entity.id, {
                    sprite: frogHopAnimation,
                });
            }
            break;
        }
    }
    return {entityPositionModifications, entitySpriteAnimations};
}
