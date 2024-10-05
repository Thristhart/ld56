import { ActionResult } from "./actions";
import { EntityData, EntityType, TerrainType, Location, LevelContent, GetTileAtLocation, GetEntitiesAtLocation, creatures, CreatureType } from "./levels";

export type Direction = "up" | "down" | "left" | "right";
export function GetLocationInDirection(startLocation: Location, direction: Direction, distance = 1): Location {
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
    const entitiesAtMoveOrigin = GetEntitiesAtLocation(levelState, entity.location);
    
    const canEntityMove = CanEntityMove(entity.type, tileAtMoveTarget, entitiesAtMoveTarget);

    if (canEntityMove) {
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


        entityMovementActions.push(
            {
                type: "MoveEntity",
                entityid: entity.id,
                oldLocation: entity.location,
                newLocation: moveTarget
            }
        )
        

        const isTurtle = entity.type === 'turtle';
        if(isTurtle){
            const carriedObjects = entitiesAtMoveOrigin.filter((x) => x.type !== 'turtle');
            for(const object of carriedObjects)
            {
                entityMovementActions.push(
                    {
                        type: "MoveEntity",
                        entityid: object.id,
                        oldLocation: object.location,
                        newLocation: moveTarget
                    }
                )
            }
        }
    }

    return entityMovementActions;
}

export function CanTurtleMove(tileAtMoveTarget: TerrainType, entitiesAtMoveTarget: EntityData[]) {
    const hasCreature = entitiesAtMoveTarget.find((entity) => creatures.includes(entity.type as CreatureType))
    if(hasCreature)
    {
        return false;
    }
    if (tileAtMoveTarget === 'chasm') {
        const hasBoulder = entitiesAtMoveTarget.find((entity) => entity.type === 'boulder')
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

export function CanMouseMove(tileAtMoveTarget: TerrainType, entitiesAtMoveTarget: EntityData[]) {
    const creaturesAtMoveTarget = entitiesAtMoveTarget.filter((entity) => creatures.includes(entity.type as CreatureType))
    if(creaturesAtMoveTarget.length > 0)
    {
        if(creaturesAtMoveTarget.filter((entity) => entity.type !== 'turtle').length === 0 && tileAtMoveTarget === 'water')
        {
            return true;
        }
        return false;
    }
    if (tileAtMoveTarget === 'chasm') {
        const hasBoulder = entitiesAtMoveTarget.find((entity) => entity.type === 'boulder')
        if (hasBoulder) {
            return true;
        }

        return false;
    }

    if (tileAtMoveTarget === 'water') {
        const hasStep = entitiesAtMoveTarget.find((entity) => entity.type === 'turtle' || entity.type === 'boulder')
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