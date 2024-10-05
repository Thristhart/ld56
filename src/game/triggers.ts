import { EventEmitter } from "node:events";
import { continueStory, displayDialog } from "~/story";
import { currentLevelState, GetEntitiesAtLocation, GetTileAtLocation, IsCreatureEntity, LevelContent } from "./levels";
import { ActionResult, MoveEntityResult } from "./actions";

export const triggers = new EventEmitter();

triggers.once("turtleOnWater", () => {
    displayDialog({
        type: "message",
        speaker: "turtle",
        message: "i'm in da water"
    })
})

triggers.on("creatureOnGoal", () => {
    if(!currentLevelState)
    {
        return;
    }
    const creatures = currentLevelState.entities.filter(ent => IsCreatureEntity(ent.type))
    console.log(creatures);
    const anyNotOnGoal = creatures.some(entity => {
        const entitiesAtLocation = GetEntitiesAtLocation(currentLevelState!, entity.location);
        return !entitiesAtLocation.some(ent => ent.type === "goal");
    })
    // all creatures on goal
    if(!anyNotOnGoal)
    {
        continueStory(true);
    }
})

triggers.on("alargeratappears", () => {
    if(!currentLevelState)
    {
        return;
    }
    displayDialog({
        type: "message",
        speaker: "turtle",
        message: "you're large and that's ground."
    })
})


export function checkForTriggersAfterAnimation(levelState: LevelContent, actionResult: ActionResult)
{
    if(actionResult.type === "MoveEntity")
    {
        creatureMoveTriggers(levelState, actionResult);
    }
}

function creatureMoveTriggers(levelState: LevelContent, actionResult: MoveEntityResult)
{
    const entityId = levelState.currentEntityId;
    if (!entityId) {
        return undefined;
    }

    const creatureEntity = levelState.entities.find(entity => entity.id === entityId);
    if (!creatureEntity) {
        return undefined;
    }

    const tileAtMoveTarget = GetTileAtLocation(levelState, actionResult.newLocation);
    const entitiesAtMoveTarget = GetEntitiesAtLocation(levelState, actionResult.newLocation);
    const entitiesAtMoveOrigin = GetEntitiesAtLocation(levelState, actionResult.oldLocation);
    
    if(creatureEntity.type === "turtle")
    {
        if(tileAtMoveTarget === "water")
        {
            triggers.emit("turtleOnWater");
        }
    }
    if(entitiesAtMoveTarget.some(entity => entity.type === "goal"))
    {
        triggers.emit("creatureOnGoal");
    }
}