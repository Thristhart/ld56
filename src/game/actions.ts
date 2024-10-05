import { currentLevel, currentLevelState, GetEntityAtLocation, GetTileAtLocation, LevelContent, Location, setCurrentLevelState } from "./levels";

export type Direction = "up" | "down" | "left" | "right";

export interface MoveTurtleAction {
    type: "MoveTurtle";
    direction: Direction;
}

export type Action = MoveTurtleAction;


interface MoveEntityResult
{
    type: "MoveEntity";
    entityid: number;
    oldLocation: Location;
    newLocation: Location;
}
export type ActionResult = MoveEntityResult;

function GetLocationInDirection(startLocation: Location, direction: Direction, distance=1): Location
{
    let dx = 0;
    let dy = 0;
    switch(direction)
    {
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

function applyActionResult(levelState: LevelContent, actionResult: ActionResult): LevelContent
{
    switch(actionResult.type) {
        case "MoveEntity": {
            const entity = levelState.entities.find(e => e.id === actionResult.entityid);
            if(!entity)
            {
                return levelState;
            }
            const otherEntities = levelState.entities.filter(e => e.id != actionResult.entityid);
            return {
                ...levelState,
                entities: [...otherEntities, {...entity, location: actionResult.newLocation}]
            }
        }
    }

    return levelState;
}

export const actionLog: Array<Action> = [];

export function ComputeStateFromActionLog()
{
    if(!currentLevel)
    {
        return undefined;
    }
    let levelState = currentLevel;
    for(let action of actionLog)
    {
        let result = applyAction(levelState, action);
        if(result)
        {
            if(!Array.isArray(result))
            {
                result = [result];
            }
            for(let actionResult of result) {
                levelState = applyActionResult(levelState, actionResult);
            }
        }
    }
    return levelState;
}

export function applyAction(levelState: LevelContent, action: Action): ActionResult | Array<ActionResult> | undefined
{
    switch(action.type)
    {
        case "MoveTurtle": {
            const turtle = levelState.entities.find(entity => entity.type === "turtle");
            if(!turtle) {
                return undefined;
            }
            const moveTarget = GetLocationInDirection(turtle.location, action.direction);
            const tileAtMoveTarget = GetTileAtLocation(levelState, moveTarget);
            if(tileAtMoveTarget !== "ground")
            {
                return undefined;
            }
            const entityAtMoveTarget = GetEntityAtLocation(levelState, moveTarget);
            // for now, don't allow pushing any entity
            if(entityAtMoveTarget)
            {
                return undefined;
            }
            return {
                type: "MoveEntity",
                entityid: turtle.id,
                oldLocation: turtle.location,
                newLocation: moveTarget
            }
        }
    }
    return undefined;
}

export function fireAction(action: Action)
{
    if(!currentLevelState)
    {
        return;
    }
    const result = applyAction(currentLevelState, action);
    if(result) {
        actionLog.push(action);
    }
    setCurrentLevelState( ComputeStateFromActionLog() );
}