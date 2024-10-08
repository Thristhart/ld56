import { ActionResult, IsActiveResult } from "./actions";
import { EntityData, Location, LevelContent, GetTileAtLocation, GetEntitiesAtLocation, GetCircuitActivationElementAtLocation, GetCircuitResponseElementAtLocation } from "./levels";
import { creatures, CreatureType, IsCreatureEntity } from "./specifications";
import { triggers } from "./triggers";

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

export function GetFacingFromLocations(currentFacing: "left" | "right", oldLocation: Location, newLocation: Location): "left" | "right" {
    if (oldLocation.column < newLocation.column) {
        return "right";
    }
    if (oldLocation.column > newLocation.column) {
        return "left";
    }
    return currentFacing;
}

export function GetFacingNewDirection(currentFacing: "left" | "right", direction: Direction): "left" | "right" | null {
    if (direction === 'up' || direction === 'down' || currentFacing === direction)
        return null;

    return direction;
}

export function GetEntityMoveResults(levelState: LevelContent, entity: EntityData, direction: Direction) {
    switch (entity.type) {
        case 'turtle': return GetTurtleMoveResults(levelState, entity, direction);
        case 'mouse': return GetMouseMoveResults(levelState, entity, direction);
        case 'frog': return GetFrogMoveResults(levelState, entity, direction);
        case 'bird': return GetBirdMoveResults(levelState, entity, direction);
        default: return [];
    }
}

export function GetEntityMovementActions(levelState: LevelContent, entity: EntityData, direction: Direction): ActionResult[] {

    const moveTarget = GetLocationInDirection(entity.location, direction);
    const entitiesAtMoveTarget = GetEntitiesAtLocation(levelState, moveTarget);
    const entityMoveResults = GetEntityMoveResults(levelState, entity, direction);

    if (entityMoveResults.length > 0 && IsActiveResult(entityMoveResults)) {
        const boulder = entitiesAtMoveTarget.find((entity) => entity.type === 'boulder');
        if (boulder) {
            const boulderMoveResults = GetBoulderMovementActionResults(levelState, boulder, direction);
            if (!boulderMoveResults.length || !IsActiveResult(boulderMoveResults)) {
                const newFacing = GetFacingNewDirection(entity.facing, direction)
                if (newFacing) {
                    return [{
                        type: "SwitchFacingDirection",
                        entityid: entity.id,
                        oldFacing: entity.facing,
                        newFacing: newFacing,
                        entity: entity,
                    }]
                }
                return [];
            }
            else {
                return [...entityMoveResults, ...boulderMoveResults];
            }
        }
        else {
            return entityMoveResults
        }
    }

    const newFacing = GetFacingNewDirection(entity.facing, direction)
    if (newFacing) {
        return [...entityMoveResults, {
            type: "SwitchFacingDirection",
            entityid: entity.id,
            oldFacing: entity.facing,
            newFacing: newFacing,
            entity: entity,
        }]
    }
    else {
        return entityMoveResults;
    }
}

export function GetMouseMoveResults(levelState: LevelContent, entity: EntityData, direction: Direction) {
    const actionResults: ActionResult[] = [];
    const originTileType = GetTileAtLocation(levelState, entity.location);

    const moveTargetLocation = GetLocationInDirection(entity.location, direction);
    const tileAtMoveTargetType = GetTileAtLocation(levelState, moveTargetLocation);
    const entitiesAtMoveTarget = GetEntitiesAtLocation(levelState, moveTargetLocation);

    const moveTargetHasCreature = entitiesAtMoveTarget.find((entity) => creatures.includes(entity.type as CreatureType))

    if (tileAtMoveTargetType === 'wall') {
        return [];
    }

    if (tileAtMoveTargetType === 'chasm' || tileAtMoveTargetType === 'boulder-chasm') {
        return [
            { type: "NoAction", triggers: [{ message: 'noMoveChasm', entityType: 'mouse' }] }
        ] as Array<ActionResult>;
    }
    if (tileAtMoveTargetType === 'water') {
        const turtleInWater = entitiesAtMoveTarget.filter((x) => x.type === 'turtle')
        if (turtleInWater.length) {
            actionResults.push(
                {
                    type: "MoveEntity",
                    entityid: entity.id,
                    oldLocation: entity.location,
                    newLocation: moveTargetLocation,
                    entity
                }
            )
        }
        else {
            // bail out, we can't move
            return [
                { type: "NoAction", triggers: [{ message: 'cannotSwim', entityType: 'mouse' }] }
            ] as Array<ActionResult>;
        }
    }
    else if (moveTargetHasCreature) {
        // bail out, we can't move
        return [
            { type: "NoAction", triggers: [{ message: 'hint', entityType: moveTargetHasCreature.type }] }
        ] as Array<ActionResult>;
    }
    else if (tileAtMoveTargetType === 'bridge' || tileAtMoveTargetType === 'door') {
        const responseCircuitAtMoveTarget = GetCircuitResponseElementAtLocation(levelState, moveTargetLocation)
        if (responseCircuitAtMoveTarget && responseCircuitAtMoveTarget.isActive) {
            actionResults.push(
                {
                    type: "MoveEntity",
                    entityid: entity.id,
                    oldLocation: entity.location,
                    newLocation: moveTargetLocation,
                    entity
                }
            )
        }
        else {
            // bail out, we can't move
            return [
                { type: "NoAction", triggers: [{ message: tileAtMoveTargetType === 'bridge' ? 'noMoveBridge' : 'noMoveDoor', entityType: 'mouse' }] }
            ] as Array<ActionResult>;
        }
    }
    else if (tileAtMoveTargetType === 'button') {
        actionResults.push(
            {
                type: "MoveEntity",
                entityid: entity.id,
                oldLocation: entity.location,
                newLocation: moveTargetLocation,
                entity
            }
        )
        const activationCircuitAtMoveTarget = GetCircuitActivationElementAtLocation(levelState, moveTargetLocation);
        if (activationCircuitAtMoveTarget) {
            // is any other activation element already on?
            let circuitActivated = true;
            for (const activation of activationCircuitAtMoveTarget.circuit.activationElements) {
                if (activation.id !== activationCircuitAtMoveTarget.element.id && activation.isActive) {
                    circuitActivated = false;
                }
            }

            actionResults.push(
                {
                    type: 'ModifyCircuitState',
                    circuitId: activationCircuitAtMoveTarget.circuit.circuitId,
                    elementId: activationCircuitAtMoveTarget.element.id,
                    oldState: activationCircuitAtMoveTarget.element.isActive,
                    newState: true,
                    circuitFlipped: circuitActivated,
                }
            )
        }
    }
    else {
        actionResults.push(
            {
                type: "MoveEntity",
                entityid: entity.id,
                oldLocation: entity.location,
                newLocation: moveTargetLocation,
                entity
            }
        )
    }

    if (originTileType === 'button') {
        const buttonDeactivationResults = GetButtonDeactivationResults(levelState, entity, moveTargetLocation);
        if (buttonDeactivationResults.length > 0)
            actionResults.push(...buttonDeactivationResults);
    }
    return actionResults;
}

export function GetTurtleMoveResults(levelState: LevelContent, entity: EntityData, direction: Direction) {
    const actionResults: ActionResult[] = [];
    const originTileType = GetTileAtLocation(levelState, entity.location);
    const entitiesAtOrigin = GetEntitiesAtLocation(levelState, entity.location);

    const moveTargetLocation = GetLocationInDirection(entity.location, direction);
    const tileAtMoveTargetType = GetTileAtLocation(levelState, moveTargetLocation);
    const entitiesAtMoveTarget = GetEntitiesAtLocation(levelState, moveTargetLocation);

    const moveTargetHasCreature = entitiesAtMoveTarget.find((entity) => creatures.includes(entity.type as CreatureType))
    if (moveTargetHasCreature) {
        return [
            { type: "NoAction", triggers: [{ message: 'hint', entityType: moveTargetHasCreature.type }] }
        ] as Array<ActionResult>;
    }

    if (tileAtMoveTargetType === 'wall') {
        return [];
    }

    if (tileAtMoveTargetType === 'chasm' || tileAtMoveTargetType === 'boulder-chasm') {
        return [
            { type: "NoAction", triggers: [{ message: 'noMoveChasm', entityType: 'turtle' }] }
        ] as Array<ActionResult>;
    }

    if (tileAtMoveTargetType === 'tunnel') {
        return [
            { type: "NoAction", triggers: [{ message: 'noMoveTunnel', entityType: 'turtle' }] }
        ] as Array<ActionResult>;
    }

    // turtle can only carry creatures and boulder while in water
    const carriedObjects = entitiesAtOrigin.filter((x) => x.type !== 'turtle');
    if (carriedObjects.length > 0 && (originTileType !== 'water' || tileAtMoveTargetType !== 'water')) {
        triggers.emit("turtleCannotMove")
        return [];
    }

    if (tileAtMoveTargetType === 'water') {
        const carriedObjects = entitiesAtOrigin.filter((x) => x.type !== 'turtle');
        if (originTileType === 'water') // to water from water, move all the carried objects too
        {
            for (const object of carriedObjects) {
                actionResults.push(
                    {
                        type: "MoveEntity",
                        entityid: object.id,
                        oldLocation: object.location,
                        newLocation: moveTargetLocation,
                        entity
                    }
                )
            }
        }

        actionResults.push(
            {
                type: "MoveEntity",
                entityid: entity.id,
                oldLocation: entity.location,
                newLocation: moveTargetLocation,
                entity
            }
        )
    }
    else if (tileAtMoveTargetType === 'bridge' || tileAtMoveTargetType === 'door') {
        const responseCircuitAtMoveTarget = GetCircuitResponseElementAtLocation(levelState, moveTargetLocation)
        if (responseCircuitAtMoveTarget && responseCircuitAtMoveTarget.isActive) {
            actionResults.push(
                {
                    type: "MoveEntity",
                    entityid: entity.id,
                    oldLocation: entity.location,
                    newLocation: moveTargetLocation,
                    entity
                }
            )
        }
        else {
            // bail out, we can't move
            return [
                { type: "NoAction", triggers: [{ message: tileAtMoveTargetType === 'bridge' ? 'noMoveBridge' : 'noMoveDoor', entityType: 'turtle' }] }
            ] as Array<ActionResult>;
        }
    }
    else if (tileAtMoveTargetType === 'button') {
        actionResults.push(
            {
                type: "MoveEntity",
                entityid: entity.id,
                oldLocation: entity.location,
                newLocation: moveTargetLocation,
                entity
            }
        )
        const activationCircuitAtMoveTarget = GetCircuitActivationElementAtLocation(levelState, moveTargetLocation);
        if (activationCircuitAtMoveTarget) {
            // is any other activation element already on?
            let circuitActivated = true;
            for (const activation of activationCircuitAtMoveTarget.circuit.activationElements) {
                if (activation.id !== activationCircuitAtMoveTarget.element.id && activation.isActive) {
                    circuitActivated = false;
                }
            }

            actionResults.push(
                {
                    type: 'ModifyCircuitState',
                    circuitId: activationCircuitAtMoveTarget.circuit.circuitId,
                    elementId: activationCircuitAtMoveTarget.element.id,
                    oldState: activationCircuitAtMoveTarget.element.isActive,
                    newState: true,
                    circuitFlipped: circuitActivated,
                }
            )
        }
    }
    else {
        actionResults.push(
            {
                type: "MoveEntity",
                entityid: entity.id,
                oldLocation: entity.location,
                newLocation: moveTargetLocation,
                entity
            }
        )
    }

    if (originTileType === 'button') {
        const buttonDeactivationResults = GetButtonDeactivationResults(levelState, entity, moveTargetLocation);
        if (buttonDeactivationResults.length > 0)
            actionResults.push(...buttonDeactivationResults);
    }
    return actionResults;
}

export function GetFrogMoveResults(levelState: LevelContent, entity: EntityData, direction: Direction): ActionResult[] {
    const actionResults: ActionResult[] = [];
    const originTileType = GetTileAtLocation(levelState, entity.location);

    const moveTargetLocation = GetLocationInDirection(entity.location, direction);
    const tileAtMoveTargetType = GetTileAtLocation(levelState, moveTargetLocation);
    const entitiesAtMoveTarget = GetEntitiesAtLocation(levelState, moveTargetLocation);

    const moveTargetHasCreature = entitiesAtMoveTarget.find((entity) => creatures.includes(entity.type as CreatureType))

    const insectsAtLocation = entitiesAtMoveTarget.filter(ent => ent.type === "insect");
    if (insectsAtLocation.length > 0) {
        return insectsAtLocation.map(insect => ({
            type: "EatInsect",
            insectId: insect.id,
            insectLocation: insect.location,
            eaterId: entity.id,
            eaterLocation: entity.location,
        }))
    }

    if (tileAtMoveTargetType === 'wall') {
        return [];
    }

    if (tileAtMoveTargetType === 'chasm' || tileAtMoveTargetType === 'boulder-chasm') {
        return [
            { type: "NoAction", triggers: [{ message: 'noMoveChasm', entityType: 'frog' }] }
        ] as Array<ActionResult>;
    }

    if (tileAtMoveTargetType === 'tunnel') {
        return [
            { type: "NoAction", triggers: [{ message: 'noMoveTunnel', entityType: 'frog' }] }
        ] as Array<ActionResult>;
    }


    if (tileAtMoveTargetType === 'water') {
        const turtleInWater = entitiesAtMoveTarget.filter((x) => x.type === 'turtle')
        if (turtleInWater.length) {
            actionResults.push(
                {
                    type: "MoveEntity",
                    entityid: entity.id,
                    oldLocation: entity.location,
                    newLocation: moveTargetLocation,
                    entity
                }
            )
        }
        else {
            // bail out, we can't move
            return [
                { type: "NoAction", triggers: [{ message: 'cannotSwim', entityType: 'frog' }] }
            ] as Array<ActionResult>;
        }
    }
    else if (moveTargetHasCreature) {
        return [
            { type: "NoAction", triggers: [{ message: 'noMoveTunnel', entityType: moveTargetHasCreature.type }] }
        ] as Array<ActionResult>;
    }
    else if (tileAtMoveTargetType === 'bridge' || tileAtMoveTargetType === 'door') {
        const responseCircuitAtMoveTarget = GetCircuitResponseElementAtLocation(levelState, moveTargetLocation)
        if (responseCircuitAtMoveTarget && responseCircuitAtMoveTarget.isActive) {
            actionResults.push(
                {
                    type: "MoveEntity",
                    entityid: entity.id,
                    oldLocation: entity.location,
                    newLocation: moveTargetLocation,
                    entity
                }
            )
        }
        else {
            // bail out, we can't move
            return [
                { type: "NoAction", triggers: [{ message: tileAtMoveTargetType === 'bridge' ? 'noMoveBridge' : 'noMoveDoor', entityType: 'frog' }] }
            ] as Array<ActionResult>;
        }
    }
    else if (tileAtMoveTargetType === 'button') {
        actionResults.push(
            {
                type: "MoveEntity",
                entityid: entity.id,
                oldLocation: entity.location,
                newLocation: moveTargetLocation,
                entity
            }
        )
        const activationCircuitAtMoveTarget = GetCircuitActivationElementAtLocation(levelState, moveTargetLocation);
        if (activationCircuitAtMoveTarget) {
            // is any other activation element already on?
            let circuitActivated = true;
            for (const activation of activationCircuitAtMoveTarget.circuit.activationElements) {
                if (activation.id !== activationCircuitAtMoveTarget.element.id && activation.isActive) {
                    circuitActivated = false;
                }
            }

            actionResults.push(
                {
                    type: 'ModifyCircuitState',
                    circuitId: activationCircuitAtMoveTarget.circuit.circuitId,
                    elementId: activationCircuitAtMoveTarget.element.id,
                    oldState: activationCircuitAtMoveTarget.element.isActive,
                    newState: true,
                    circuitFlipped: circuitActivated,
                }
            )
        }
    }
    else {
        actionResults.push(
            {
                type: "MoveEntity",
                entityid: entity.id,
                oldLocation: entity.location,
                newLocation: moveTargetLocation,
                entity
            }
        )
    }

    if (originTileType === 'button') {
        const buttonDeactivationResults = GetButtonDeactivationResults(levelState, entity, moveTargetLocation);
        if (buttonDeactivationResults.length > 0)
            actionResults.push(...buttonDeactivationResults);
    }

    return actionResults;
}

export function GetBirdMoveResults(levelState: LevelContent, entity: EntityData, direction: Direction) {
    const actionResults: ActionResult[] = [];
    const originTileType = GetTileAtLocation(levelState, entity.location);

    const moveTargetLocation = GetLocationInDirection(entity.location, direction);
    const tileAtMoveTargetType = GetTileAtLocation(levelState, moveTargetLocation);
    const entitiesAtMoveTarget = GetEntitiesAtLocation(levelState, moveTargetLocation);

    const moveTargetHasCreature = entitiesAtMoveTarget.find((entity) => creatures.includes(entity.type as CreatureType))

    if (tileAtMoveTargetType === 'wall') {
        // bail out, we can't move
        return [
            { type: "NoAction" }
        ] as Array<ActionResult>;
    }

    if (tileAtMoveTargetType === 'tunnel') {
        // bail out we can't move
        return [
            { type: "NoAction", triggers: [{ message: 'noMoveTunnel', entityType: 'bird' }] }
        ] as Array<ActionResult>;
    }

    if (entitiesAtMoveTarget.find(entity => entity.type === "boulder")) {
        // bird can't move boulders
        return [
            { type: "NoAction", triggers: [{ message: 'noMoveBoulder', entityType: 'bird' }] }
        ] as Array<ActionResult>;
    }

    if (entitiesAtMoveTarget.find(entity => entity.type === "insect")) {
        // bird can't enter tiles with insects
        return [
            { type: "NoAction", triggers: [{ message: 'noMoveInsect', entityType: 'bird' }] }
        ] as Array<ActionResult>;
    }

    if (tileAtMoveTargetType === 'water') {
        actionResults.push(
            {
                type: "MoveEntity",
                entityid: entity.id,
                oldLocation: entity.location,
                newLocation: moveTargetLocation,
                entity
            }
        )
    }
    else if (moveTargetHasCreature) {
        // bail out, we can't move
        return [
            { type: "NoAction", triggers: [{ message: 'hint', entityType: moveTargetHasCreature.type }] }
        ] as Array<ActionResult>;
    }
    else if (tileAtMoveTargetType === 'door') {
        const responseCircuitAtMoveTarget = GetCircuitResponseElementAtLocation(levelState, moveTargetLocation)
        if (responseCircuitAtMoveTarget && responseCircuitAtMoveTarget.isActive) {
            actionResults.push(
                {
                    type: "MoveEntity",
                    entityid: entity.id,
                    oldLocation: entity.location,
                    newLocation: moveTargetLocation,
                    entity
                }
            )
        }
        else {
            // can't move through a door
            return [
                { type: "NoAction", triggers: [{ message: 'noMoveDoor', entityType: 'bird' }] }
            ] as Array<ActionResult>;
        }
    }
    else if (tileAtMoveTargetType === 'button') {
        actionResults.push(
            {
                type: "MoveEntity",
                entityid: entity.id,
                oldLocation: entity.location,
                newLocation: moveTargetLocation,
                entity
            }
        )
        const activationCircuitAtMoveTarget = GetCircuitActivationElementAtLocation(levelState, moveTargetLocation);
        if (activationCircuitAtMoveTarget) {
            // is any other activation element already on?
            let circuitActivated = true;
            for (const activation of activationCircuitAtMoveTarget.circuit.activationElements) {
                if (activation.id !== activationCircuitAtMoveTarget.element.id && activation.isActive) {
                    circuitActivated = false;
                }
            }

            actionResults.push(
                {
                    type: 'ModifyCircuitState',
                    circuitId: activationCircuitAtMoveTarget.circuit.circuitId,
                    elementId: activationCircuitAtMoveTarget.element.id,
                    oldState: activationCircuitAtMoveTarget.element.isActive,
                    newState: true,
                    circuitFlipped: circuitActivated,
                }
            )
        }
    }
    else {
        actionResults.push(
            {
                type: "MoveEntity",
                entityid: entity.id,
                oldLocation: entity.location,
                newLocation: moveTargetLocation,
                entity
            }
        )
    }

    if (originTileType === 'button') {
        const buttonDeactivationResults = GetButtonDeactivationResults(levelState, entity, moveTargetLocation);
        if (buttonDeactivationResults.length > 0)
            actionResults.push(...buttonDeactivationResults);
    }
    return actionResults;
}

export function GetBoulderMovementActionResults(levelState: LevelContent, boulder: EntityData, direction: Direction) {
    const actionResults: ActionResult[] = [];
    const boulderOriginTileType = GetTileAtLocation(levelState, boulder.location);
    const boulderEntitiesAtOrigin = GetEntitiesAtLocation(levelState, boulder.location);

    const boulderMoveTargetLocation = GetLocationInDirection(boulder.location, direction);
    const boulderTileAtMoveTargetType = GetTileAtLocation(levelState, boulderMoveTargetLocation);
    const boulderEntitiesAtMoveTarget = GetEntitiesAtLocation(levelState, boulderMoveTargetLocation);

    const responseCircuitAtOrigin = GetCircuitResponseElementAtLocation(levelState, boulder.location);
    const bCanMoveFromOrigin = boulderOriginTileType === 'ground' ||
        boulderOriginTileType === 'water' && boulderEntitiesAtOrigin.find((x) => x.type === 'turtle') ||
        boulderOriginTileType === 'boulder-water' ||
        boulderOriginTileType === 'button' ||
        boulderOriginTileType === 'door' && responseCircuitAtOrigin?.isActive ||
        boulderOriginTileType === 'bridge' && responseCircuitAtOrigin?.isActive;

    if (!bCanMoveFromOrigin) {
        return actionResults;
    }

    // special special case 
    if (boulderTileAtMoveTargetType === 'water' &&
        boulderEntitiesAtMoveTarget.length === 1 &&
        boulderEntitiesAtMoveTarget[0].type === 'turtle') {
        actionResults.push(
            {
                type: "MoveEntity",
                entityid: boulder.id,
                oldLocation: boulder.location,
                newLocation: boulderMoveTargetLocation,
                entity: boulder
            }
        )
    }
    else if (boulderTileAtMoveTargetType === 'wall' || boulderTileAtMoveTargetType === 'tunnel' || boulderEntitiesAtMoveTarget.length > 0) {
        // bail out, we can't move
        return [];
    }
    else if (boulderTileAtMoveTargetType === 'bridge' || boulderTileAtMoveTargetType === 'door') {
        const responseCircuitAtMoveTarget = GetCircuitResponseElementAtLocation(levelState, boulderMoveTargetLocation)
        if (responseCircuitAtMoveTarget && responseCircuitAtMoveTarget.isActive) {
            actionResults.push(
                {
                    type: "MoveEntity",
                    entityid: boulder.id,
                    oldLocation: boulder.location,
                    newLocation: boulderMoveTargetLocation,
                    entity: boulder
                }
            )
        }
        else {
            // bail out, we can't move
            return []
        }
    }
    else if (boulderTileAtMoveTargetType === 'water') {
        actionResults.push(
            {
                type: "MergeBoulderIntoTerrain",
                targetlocation: boulderMoveTargetLocation,
                boulderOldLocation: boulder.location,
                boulderId: boulder.id,
                oldTerrainType: boulderTileAtMoveTargetType,
                newTerrainType: 'boulder-water',
            }
        )
    }
    else if (boulderTileAtMoveTargetType === 'chasm' || boulderTileAtMoveTargetType === 'boulder-chasm') {
        actionResults.push(
            {
                type: "MergeBoulderIntoTerrain",
                targetlocation: boulderMoveTargetLocation,
                boulderOldLocation: boulder.location,
                boulderId: boulder.id,
                oldTerrainType: boulderTileAtMoveTargetType,
                newTerrainType: 'boulder-chasm',
            }
        )
    }
    else if (boulderTileAtMoveTargetType === 'button') {
        actionResults.push(
            {
                type: "MoveEntity",
                entityid: boulder.id,
                oldLocation: boulder.location,
                newLocation: boulderMoveTargetLocation,
                entity: boulder
            }
        )
        const activationCircuitAtMoveTarget = GetCircuitActivationElementAtLocation(levelState, boulderMoveTargetLocation);
        if (activationCircuitAtMoveTarget) {
            // is any other activation element already on?
            let circuitActivated = true;
            for (const activation of activationCircuitAtMoveTarget.circuit.activationElements) {
                if (activation.id !== activationCircuitAtMoveTarget.element.id && activation.isActive) {
                    circuitActivated = false;
                }
            }

            actionResults.push(
                {
                    type: 'ModifyCircuitState',
                    circuitId: activationCircuitAtMoveTarget.circuit.circuitId,
                    elementId: activationCircuitAtMoveTarget.element.id,
                    oldState: activationCircuitAtMoveTarget.element.isActive,
                    newState: true,
                    circuitFlipped: circuitActivated,
                }
            )
        }
    }
    else {
        actionResults.push(
            {
                type: "MoveEntity",
                entityid: boulder.id,
                oldLocation: boulder.location,
                newLocation: boulderMoveTargetLocation,
                entity: boulder
            }
        )
    }

    return actionResults;
}

function GetButtonDeactivationResults(levelState: LevelContent, sourceEntity: EntityData, newLocation: Location) {
    const actionResults: ActionResult[] = [];
    const activationCircuitAtOrigin = GetCircuitActivationElementAtLocation(levelState, sourceEntity.location);
    if (!activationCircuitAtOrigin) {
        return [];
    }

    const { circuit, element } = activationCircuitAtOrigin;
    let circuitDeactivated = true;
    // is any other activation element on? if so then we don't have to check circuit closed consequences
    for (const activation of circuit.activationElements) {
        if (activation.id !== element.id && activation.isActive) {
            circuitDeactivated = false;
        }
    }

    actionResults.push(
        {
            type: 'ModifyCircuitState',
            circuitId: activationCircuitAtOrigin.circuit.circuitId,
            elementId: activationCircuitAtOrigin.element.id,
            oldState: activationCircuitAtOrigin.element.isActive,
            newState: false,
            circuitFlipped: circuitDeactivated
        })

    if (!circuitDeactivated) {
        return actionResults;
    }

    for (const response of circuit.responsiveElements) {
        const tileType = GetTileAtLocation(levelState, response.location);
        const entities = GetEntitiesAtLocation(levelState, response.location);
        if (entities.length) {
            for (const entity of entities) {
                if (entity.type === 'boulder') {
                    actionResults.push({
                        type: "DeleteEntity",
                        entityId: entity.id,
                        entityLocation: entity.location
                    })
                }
                else if (IsCreatureEntity(entity.type)) {
                    if (entity.type !== 'bird' || tileType !== 'bridge') {
                        actionResults.push({
                            type: "DeleteEntity",
                            entityId: entity.id,
                            entityLocation: entity.location
                        });
                    }
                }
            }
        }

        if (newLocation.column === response.location.column && newLocation.row === response.location.row) {
            if (sourceEntity.type !== 'bird' || tileType !== 'bridge') {
                actionResults.push({
                    type: "DeleteEntity",
                    entityId: sourceEntity.id,
                    entityLocation: newLocation
                });
            }
        }
    }

    return actionResults;
}