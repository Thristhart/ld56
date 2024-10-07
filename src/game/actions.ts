
import { sounds } from "~/audio";
import { initialLevelState, currentLevelState, LevelContent, Location, setCurrentLevelState, EntityData } from "./levels";
import { Direction, GetEntityMovementActions, GetFacingFromLocations } from "./movehelpers";
import { creatures, IsCreatureEntity, TerrainType } from "./specifications";
import { checkForTriggersAfterAnimation, TriggerAudioFromResults, triggers } from "./triggers";


export interface MoveCreatureAction {
    type: "MoveCreature";
    direction: Direction;
}

export interface SwitchCreatureAction {
    type: "SwitchCreature";
}

export type Action = MoveCreatureAction | SwitchCreatureAction;

export interface NoActionResult {
    type: "NoAction";
}

export interface MoveEntityResult {
    type: "MoveEntity";
    entityid: number;
    oldLocation: Location;
    newLocation: Location;
    entity: EntityData;
}

export interface SwitchFacingDirectionResult {
    type: "SwitchFacingDirection";
    entityid: number;
    oldFacing: 'left' | 'right';
    newFacing: 'left' | 'right';
    entity: EntityData;
}

export interface SwitchEntityResult {
    type: "SwitchEntity";
    newEntityId: number;
    oldEntityId: number;
}

export interface MergeBoulderIntoTerrainResult {
    type: "MergeBoulderIntoTerrain";
    targetlocation: Location,
    boulderOldLocation: Location,
    boulderId: number,
    oldTerrainType: TerrainType;
    newTerrainType: TerrainType;
}

export interface DeleteEntityResult {
    type: "DeleteEntity";
    entityId: number,
    entityLocation: Location;
}

export interface ModifyCircuitStateResult {
    type: "ModifyCircuitState";
    circuitId: number;
    elementId: number
    oldState: boolean;
    newState: boolean;
}

export interface EatInsectResult {
    type: "EatInsect";
    insectId: number;
    eaterId: number;
    insectLocation: Location;
    eaterLocation: Location;
}


export type ActionResult = ( NoActionResult | MoveEntityResult | SwitchEntityResult | MergeBoulderIntoTerrainResult | ModifyCircuitStateResult | EatInsectResult | DeleteEntityResult | SwitchFacingDirectionResult ) & { triggers?: string[] };

function applyActionResult(levelState: LevelContent, actionResult: ActionResult): LevelContent {
    switch (actionResult.type) {
        case "MoveEntity": {
            const entity = levelState.entities.find(e => e.id === actionResult.entityid);
            if (!entity) {
                return levelState;
            }
            const otherEntities = levelState.entities.filter(e => e.id != actionResult.entityid);
            return {
                ...levelState,
                entities: [...otherEntities, { ...entity, location: actionResult.newLocation, facing: GetFacingFromLocations(entity.facing, actionResult.oldLocation, actionResult.newLocation) }]
            }
        }
        case 'SwitchFacingDirection':
            {
                const entity = levelState.entities.find(e => e.id === actionResult.entityid);
                if (!entity) {
                    return levelState;
                }
                const otherEntities = levelState.entities.filter(e => e.id != actionResult.entityid);
                return {
                    ...levelState,
                    entities: [...otherEntities, { ...entity, facing: actionResult.newFacing }]
                }
            }
        case "SwitchEntity": {
            return {
                ...levelState,
                currentEntityId: actionResult.newEntityId
            }
        }
        case "DeleteEntity": {
            const entity = levelState.entities.find(e => e.id === actionResult.entityId);
            if (!entity) {
                return levelState;
            }
            const otherEntities = levelState.entities.filter(e => e.id != actionResult.entityId);

            const isCreature = IsCreatureEntity(entity.type);
            if (IsCreatureEntity(entity.type)) {
                triggers.emit(`kill${entity.type}`);
            }
            return {
                ...levelState,
                entities: [...otherEntities],
                canContinueLevel: levelState.canContinueLevel && !isCreature
            }
        }
        case "MergeBoulderIntoTerrain": {
            const { targetlocation, boulderId, newTerrainType } = actionResult;
            const groundGridCopy = levelState.groundGrid.map((groundRow) => [...groundRow])
            groundGridCopy[targetlocation.row][targetlocation.column] = newTerrainType;
            const filteredEntities = levelState.entities.filter((entity) => entity.id !== boulderId)
            return {
                ...levelState,
                groundGrid: groundGridCopy,
                entities: filteredEntities,
            }
        }
        case "ModifyCircuitState": {
            const { circuitId, elementId, newState } = actionResult;
            const circuit = levelState.circuits.find(c => c.circuitId === circuitId);
            if (!circuit) {
                return levelState;
            }

            const element = circuit.activationElements.find(e => e.id === elementId);
            if (!element) {
                return levelState;
            }
            const otherActivationElements = circuit.activationElements.filter(e => e.id != elementId);
            const otherCircuits = levelState.circuits.filter(c => c.circuitId != circuitId);

            return {
                ...levelState,
                circuits: [
                    ...otherCircuits,
                    {
                        ...circuit,
                        activationElements: [...otherActivationElements, { ...element, isActive: newState }]
                    }
                ]
            }
        }
        case "EatInsect": {
            const eater = levelState.entities.find(e => e.id === actionResult.eaterId);
            if (!eater) {
                return levelState;
            }
            const otherEntities = levelState.entities.filter(e => e.id != actionResult.eaterId);
            return {
                ...levelState,
                entities: [
                    ...otherEntities.filter(entity => entity.id !== actionResult.insectId),
                    { ...eater, facing: GetFacingFromLocations(eater.facing, actionResult.eaterLocation, actionResult.insectLocation) }
                ],
            }
        }
    }

    return levelState;
}

export const actionLog: Array<Action> = [];

export function ComputeStateFromActionLog() {
    if (!initialLevelState) {
        return undefined;
    }
    let levelState = initialLevelState;
    for (let action of actionLog) {
        let result = applyAction(levelState, action);
        if (result) {
            if (!Array.isArray(result)) {
                result = [result];
            }
            for (let actionResult of result) {
                levelState = applyActionResult(levelState, actionResult);
            }
        }
    }
    return levelState;
}

export function applyAction(levelState: LevelContent, action: Action): ActionResult | Array<ActionResult> {
    switch (action.type) {
        case "MoveCreature": {
            const entityId = levelState.currentEntityId;
            if (!entityId) {
                return { type: "NoAction" };
            }

            const creatureEntity = levelState.entities.find(entity => entity.id === entityId);
            if (!creatureEntity) {
                return { type: "NoAction" };
            }
            const moveActions = GetEntityMovementActions(levelState, creatureEntity, action.direction)
            return moveActions;
        }
        case "SwitchCreature": {
            const currentEntityId = levelState.currentEntityId;
            const oldEntity = levelState.entities.find(entity => entity.id === currentEntityId);
            if (!oldEntity)
                return { type: "NoAction" };

            const currentCreatureArrayId = creatures.findIndex((creature) => oldEntity.type === creature)
            if (currentCreatureArrayId < 0)
                return { type: "NoAction" };

            let creatureArrayId = (currentCreatureArrayId + 1) % (creatures.length);
            while (creatureArrayId !== currentCreatureArrayId) {
                const creatureType = creatures[creatureArrayId];
                const creatureEntity = levelState.entities.find(entity => entity.type === creatureType);
                if (creatureEntity) {
                    return [
                        {
                            type: "SwitchEntity",
                            oldEntityId: currentEntityId,
                            newEntityId: creatureEntity.id,
                        }
                    ]
                }
                else {
                    creatureArrayId = (creatureArrayId + 1) % (creatures.length);
                }
            }
            return { type: "NoAction" };
        }
    }
    return { type: "NoAction" };
}

export function MakeResultArray(result: ActionResult | Array<ActionResult>)
{
    if(Array.isArray(result))
    {
        return result;
    }
    return [result];
}

export function IsActiveResult(result: Array<ActionResult>)
{
    return result.some(res => res.type !== "NoAction");
}

export let lastActionResults: Array<ActionResult> | undefined;
export let lastActionTimestamp: number | undefined;
export function fireAction(action: Action) {
    if (!currentLevelState) {
        return;
    }
    const result = MakeResultArray(applyAction(currentLevelState, action));
    if (IsActiveResult(result)) {
        lastActionResults = Array.isArray(result) ? result : [result];
        if (lastActionResults.length === 1 && lastActionResults[0].type === "SwitchFacingDirection") {
            sounds.bump.play();
        }
        lastActionTimestamp = performance.now();
        setTimeout(() => {
            for (const actionResult of lastActionResults ?? []) {
                checkForTriggersAfterAnimation(currentLevelState!, actionResult);
            }
        }, 100);
        actionLog.push(action);
    }
    else {
        clearActionAnimations();
        sounds.bump.play();
    }
    // either way, do triggers
    for(const actionResult of result)
    {
        actionResult.triggers?.forEach(trigger => triggers.emit(trigger));
    }
    setCurrentLevelState(ComputeStateFromActionLog());
    if (lastActionResults) {
        TriggerAudioFromResults(lastActionResults);
    }
}
export let lastUndoActionResults: Array<ActionResult> | undefined;
export let lastUndoTimestamp: number | undefined;
export function undo() {
    if (!currentLevelState) {
        return;
    }
    const undoneAction = actionLog.pop();
    if (!undoneAction) {
        return;
    }
    setCurrentLevelState(ComputeStateFromActionLog());
    const resultOfUndoneAction = MakeResultArray( applyAction(currentLevelState, undoneAction) );
    if (IsActiveResult(resultOfUndoneAction)) {
        lastUndoActionResults = Array.isArray(resultOfUndoneAction) ? resultOfUndoneAction : [resultOfUndoneAction];
        lastUndoTimestamp = performance.now();
        TriggerAudioFromResults(lastUndoActionResults);
    }
}

export function clearActions() {
    actionLog.splice(0);
    clearActionAnimations();
    clearUndoAnimations();
}

export function clearActionAnimations() {
    lastActionResults = undefined;
    lastActionTimestamp = undefined;
}
export function clearUndoAnimations() {
    lastUndoActionResults = undefined;
    lastUndoTimestamp = undefined;
}