import { EventEmitter } from "node:events";
import { continueStory, displayDialog } from "~/story";
import { currentLevelState, GetEntitiesAtLocation, GetTileAtLocation, LevelContent } from "./levels";
import { ActionResult, MoveEntityResult } from "./actions";
import { IsCreatureEntity } from "./specifications";
import { sounds } from "~/audio";
import { GetHint } from "./hints";

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
    if (currentLevelState?.canContinueLevel) {
        if (!sounds.music.playing()) {
            sounds.music.play();
        }
    }
    else {
        sounds.music.pause();
    }
    for (const result of results) {
        if (result.type === "MoveEntity") {
            if (result.entity.type === "boulder") {
                sounds.boulderMove.play();
            }
            if (IsCreatureEntity(result.entity.type)) {
                const prevTile = GetTileAtLocation(currentLevelState!, result.oldLocation);
                const nextTile = GetTileAtLocation(currentLevelState!, result.newLocation);
                const entitiesAtNextLocation = GetEntitiesAtLocation(currentLevelState!, result.newLocation);
                if (nextTile === "boulder-water" || nextTile === "boulder-chasm" || entitiesAtNextLocation.some(ent => ent.type === "boulder" || (ent.type === "turtle" && result.entity.type !== "turtle"))) {
                    sounds.hardstep.play();
                }
                else if (result.entity.type === "turtle" && nextTile === "water") {
                    if (prevTile !== "water") {
                        sounds.turtleWaterEnter.play();
                    }
                    else {
                        sounds.turtleWaterMove.play();
                    }
                }
                else {
                    sounds.footstep.play();
                }
            }
        }
        else if (result.type === "MergeBoulderIntoTerrain" && result.newTerrainType === "boulder-water") {
            sounds.splash.play();
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
        else if (result.type === "EatInsect") {
            sounds.frogEat.play();
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

triggers.on("hintbird", () => {
    if (!currentLevelState) {
        return;
    }

    const hint = GetHint(currentLevelState.levelName);
    displayDialog({
        type: "message",
        speaker: "bird",
        message: hint
    })
})


triggers.on("hintfrog", () => {
    if (!currentLevelState) {
        return;
    }
    const hint = GetHint(currentLevelState.levelName);
    displayDialog({
        type: "message",
        speaker: "frog",
        message: hint
    })
})

triggers.on("hintturtle", () => {
    if (!currentLevelState) {
        return;
    }
    const hint = GetHint(currentLevelState.levelName);
    displayDialog({
        type: "message",
        speaker: "turtle",
        message: hint
    })
})

triggers.on("hintmouse", () => {
    if (!currentLevelState) {
        return;
    }

    const hint = GetHint(currentLevelState.levelName);
    displayDialog({
        type: "message",
        speaker: "mouse",
        message: hint
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