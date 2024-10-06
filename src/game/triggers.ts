import { EventEmitter } from "node:events";
import { continueStory, displayDialog } from "~/story";
import { currentLevelState, GetEntitiesAtLocation, GetTileAtLocation, LevelContent } from "./levels";
import { ActionResult, MoveEntityResult } from "./actions";
import { IsCreatureEntity } from "./specifications";
import { sounds } from "~/audio";

export const triggers = new EventEmitter();

triggers.once("turtleOnWater", () => {
    displayDialog({
        type: "message",
        speaker: "turtle",
        message: "i'm in da water"
    })
})

triggers.on("creatureOnGoal", () => {
    if (!currentLevelState) {
        return;
    }
    const creatures = currentLevelState.entities.filter(ent => IsCreatureEntity(ent.type))
    const anyNotOnGoal = creatures.some(entity => {

        const tileAtLocation = GetTileAtLocation(currentLevelState!, entity.location);
        return !(tileAtLocation == "goal");
    })
    // all creatures on goal
    if (!anyNotOnGoal) {
        continueStory(true);
    }
})

triggers.once("turtleCannotMove", () => {
    if (!currentLevelState) {
        return;
    }
    displayDialog({
        type: "message",
        speaker: "turtle",
        message: "you're large and that's ground."
    })
})

export function TriggerAudioFromResults(results: Array<ActionResult>) {
    for (const result of results) {
        if (result.type === "MoveEntity") {
            if (result.entity.type === "boulder") {
                sounds.boulderMove.play();
            }
            if (IsCreatureEntity(result.entity.type)) {
                sounds.footstep.play();
            }
        }
        else if (result.type === "SwitchEntity") {
            const entity = currentLevelState?.entities.find(entity => entity.id === result.newEntityId);
            if (!entity) {
                return;
            }
            if (entity.type === "mouse") {
                sounds.mouseSelect.stop();
                sounds.mouseSelect.play();
            }
            if (entity.type === "turtle") {
                sounds.turtleSelect.stop();
                sounds.turtleSelect.play();
            }
            if (entity.type === "bird") {
                sounds.birdSelect.stop();
                sounds.birdSelect.play();
            }
            if (entity.type === "frog") {
                sounds.frogSelect.stop();
                sounds.frogSelect.play();
            }
        }
    }
}


triggers.on("killturtle", () => {
    if (!currentLevelState) {
        return;
    }
    displayDialog({
        type: "message",
        speaker: "turtle",
        message: "YOU LET ME DIE!!. Press Z to undo"
    })
})

triggers.on("killbird", () => {
    if (!currentLevelState) {
        return;
    }
    displayDialog({
        type: "message",
        speaker: "bird",
        message: "YOU LET ME DIE!!. Press Z to undo"
    })
})

triggers.on("killfrog", () => {
    if (!currentLevelState) {
        return;
    }
    displayDialog({
        type: "message",
        speaker: "frog",
        message: "YOU LET ME DIE!!. Press Z to undo"
    })
})

triggers.on("killmouse", () => {
    if (!currentLevelState) {
        return;
    }
    displayDialog({
        type: "message",
        speaker: "mouse",
        message: "YOU LET ME DIE!!. Press Z to undo"
    })
})

export function checkForTriggersAfterAnimation(levelState: LevelContent, actionResult: ActionResult) {
    if (actionResult.type === "MoveEntity") {
        creatureMoveTriggers(levelState, actionResult);
    }
}

function creatureMoveTriggers(levelState: LevelContent, actionResult: MoveEntityResult) {
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

    if (creatureEntity.type === "turtle") {
        if (tileAtMoveTarget === "water") {
            triggers.emit("turtleOnWater");
        }
    }
    if (tileAtMoveTarget == "goal") {
        triggers.emit("creatureOnGoal");
    }
}