import { ActionResult } from "~/game/actions";

function lerp(a: number, b: number, t: number)
{
    return a * (1 - t) + b * t;
}

function clamp(n: number, min = 0, max = 1) {
    return Math.min(max, Math.max(min, n));
}

const MOVE_ANIMATION_DURATION_MS = 100;

export function animateActionResult(actionResult: ActionResult, dt: number)
{
    const entityPositionModifications = new Map<number, {row: number, column: number}>();
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
            break;
        }
    }
    return {entityPositionModifications};
}

export function animateActionResultUndo(actionResult: ActionResult, dt: number)
{
    const entityPositionModifications = new Map<number, {row: number, column: number}>();
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
            break;
        }
    }
    return {entityPositionModifications};
}