import { ActionResult } from "./actions";
import { EntityData, EntityType, TerrainType, Location, LevelContent, GetTileAtLocation, GetEntitiesAtLocation } from "./levels";

export type Direction = "up" | "down" | "left" | "right";
function GetLocationInDirection(startLocation: Location, direction: Direction, distance = 1): Location {
    let dx = 0;
    let dy = 0;
    switch (direction) {
        case "up":
            dy = -distance;
            break;
        case "down":
            dy = distance;
            break;
        case "left":
            dx = -distance;
            break;
        case "right":
            dx = distance;
            break;
    }
    return {
        column: startLocation.column + dx,
        row: startLocation.row + dy,
    }
}

export function CanEntityMove(entityType: EntityType, tileAtMoveTarget: TerrainType, entitiesAtMoveTarget: EntityData[]) {
    switch (entityType) {
        case 'turtle': return CanTurtleMove(tileAtMoveTarget, entitiesAtMoveTarget);
        case 'mouse': return CanMouseMove(tileAtMoveTarget, entitiesAtMoveTarget);
        default: return false;
    }
}

export function GetEntityMovementActions(levelState: LevelContent, entity: EntityData, direction: Direction) {
    const entityMovementActions: ActionResult[] = [];

    const moveTarget = GetLocationInDirection(entity.location, direction);
    const tileAtMoveTarget = GetTileAtLocation(levelState, moveTarget);
    const entitiesAtMoveTarget = GetEntitiesAtLocation(levelState, moveTarget);

    const boulder = entitiesAtMoveTarget.find((entity) => entity.type === 'boulder');
    if (boulder && tileAtMoveTarget === 'ground') // boulders can only move on ground
    {
        const boulderTileAtLocation = tileAtMoveTarget;
        const boulderMoveTarget = GetLocationInDirection(boulder.location, direction);
        const boulderTileAtMoveTarget = GetTileAtLocation(levelState, boulderMoveTarget);
        const boulderEntitiesAtMoveTarget = GetEntitiesAtLocation(levelState, boulderMoveTarget);
        const canBoulderMove = CanBoulderMove(boulderTileAtLocation, boulderTileAtMoveTarget, boulderEntitiesAtMoveTarget);
        if (canBoulderMove) {
            entityMovementActions.push(
                {
                    type: "MoveEntity",
                    entityid: boulder.id,
                    oldLocation: boulder.location,
                    newLocation: boulderMoveTarget
                }
            )
        }
        else {
            return entityMovementActions;
        }
    }

    const canMoveEntity = CanEntityMove(entity.type, tileAtMoveTarget, entitiesAtMoveTarget);
    if (canMoveEntity) {
        entityMovementActions.push(
            {
                type: "MoveEntity",
                entityid: entity.id,
                oldLocation: entity.location,
                newLocation: moveTarget
            }
        )
    }

    return entityMovementActions;
}

export function CanTurtleMove(tileAtMoveTarget: TerrainType, entities: EntityData[]) {
    if (tileAtMoveTarget === 'chasm') {
        const hasBoulder = entities.find((entity) => entity.type === 'boulder')
        if (hasBoulder) {
            return true;
        }

        return false;
    }

    if (tileAtMoveTarget === 'ground' || tileAtMoveTarget === 'water') {
        return true;
    }

    return false
}

export function CanMouseMove(tileAtMoveTarget: TerrainType, entities: EntityData[]) {
    if (tileAtMoveTarget === 'chasm') {
        const hasBoulder = entities.find((entity) => entity.type === 'boulder')
        if (hasBoulder) {
            return true;
        }

        return false;
    }

    if (tileAtMoveTarget === 'water') {
        const hasStep = entities.find((entity) => entity.type === 'turtle' || entity.type === 'boulder')
        if (hasStep) {
            return true;
        }

        return false;
    }

    if (tileAtMoveTarget === 'ground' || tileAtMoveTarget === 'tunnel') {
        return true;
    }

    return false
}

export function CanBoulderMove(tileAtLocation: TerrainType, tileAtMoveTarget: TerrainType, entities: EntityData[]) {
    if (tileAtLocation !== 'ground' || entities.length) {
        return false;
    }

    if (tileAtMoveTarget === 'chasm' || tileAtMoveTarget === 'water' || tileAtMoveTarget === 'ground') {
        return true;
    }

    return false
}