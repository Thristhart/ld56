
import { currentLevel, currentLevelState, IsCreatureEntity, LevelContent, Location, setCurrentLevelState } from "./levels";
import { Direction, GetEntityMovementActions } from "./movehelpers";


export interface MoveCreatureAction {
    type: "MoveCreature";
    direction: Direction;
}

export interface SwitchCreatureAction {
    type: "SwitchCreature";
}

export type Action = MoveCreatureAction | SwitchCreatureAction;


interface MoveEntityResult {
    type: "MoveEntity";
    entityid: number;
    oldLocation: Location;
    newLocation: Location;
}

interface SwitchEntityResult {
    type: "SwitchEntity";
    newEntityId: number;
    oldEntityId: number;
}

export type ActionResult = MoveEntityResult | SwitchEntityResult;

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
                entities: [...otherEntities, { ...entity, location: actionResult.newLocation }]
            }
        }
        case "SwitchEntity": {
            return {
                ...levelState,
                currentEntityId: actionResult.newEntityId
            }
        }
    }

    return levelState;
}

export const actionLog: Array<Action> = [];

export function ComputeStateFromActionLog() {
    if (!currentLevel) {
        return undefined;
    }
    let levelState = currentLevel;
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

export function applyAction(levelState: LevelContent, action: Action): ActionResult | Array<ActionResult> | undefined {
    switch (action.type) {
        case "MoveCreature": {
            const entityId = levelState.currentEntityId;
            if (!entityId) {
                return undefined;
            }

            const creatureEntity = levelState.entities.find(entity => entity.id === entityId);
            if (!creatureEntity) {
                return undefined;
            }
            const moveActions = GetEntityMovementActions(levelState, creatureEntity, action.direction)
            return moveActions;
        }
        case "SwitchCreature": {
            const currentEntityId = levelState.currentEntityId;
            const otherCreatureEntities = levelState.entities.filter(entity => IsCreatureEntity(entity.type) && entity.id !== currentEntityId);
            if (otherCreatureEntities && otherCreatureEntities.length === 1) {
                return [
                    {
                        type: "SwitchEntity",
                        oldEntityId: currentEntityId,
                        newEntityId: otherCreatureEntities[0].id,
                    }
                ]
            }
        }
    }
    return undefined;
}

export let lastActionResults: Array<ActionResult> | undefined;
export let lastActionTimestamp: number | undefined;
export function fireAction(action: Action)
{
    if(!currentLevelState)
    {
        return;
    }
    const result = applyAction(currentLevelState, action);
    if(result && !(Array.isArray(result) && result.length === 0)) {
        lastActionResults = Array.isArray(result) ? result : [result];
        lastActionTimestamp = performance.now();
        actionLog.push(action);
    }
    setCurrentLevelState( ComputeStateFromActionLog() );
}
export let lastUndoActionResults: Array<ActionResult> | undefined;
export let lastUndoTimestamp: number | undefined;
export function undo()
{
    if(!currentLevelState)
    {
        return;
    }
    const undoneAction = actionLog.pop();
    if(!undoneAction)
    {
        return;
    }
    setCurrentLevelState( ComputeStateFromActionLog() );
    const resultOfUndoneAction = applyAction(currentLevelState, undoneAction);
    if(resultOfUndoneAction)
    {
        lastUndoActionResults = Array.isArray(resultOfUndoneAction) ? resultOfUndoneAction : [resultOfUndoneAction];
        lastUndoTimestamp = performance.now();
    }
}