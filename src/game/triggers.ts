import { EventEmitter } from "node:events";
import { continueStory, displayDialog } from "~/story";
import { currentLevelState, GetEntitiesAtLocation, GetTileAtLocation, LevelContent } from "./levels";
import { ActionResult, MoveEntityResult } from "./actions";
import { IsCreatureEntity } from "./specifications";
import { muted, sounds } from "~/audio";
import { GetHint } from "./hints";

export const triggers = new EventEmitter();

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
        message: "too heavy to get out of the water"
    })
})

export function TriggerAudioFromResults(results: Array<ActionResult>) {
    if (currentLevelState?.canContinueLevel) {
        if (!sounds.music.playing() && !muted) {
            sounds.music.play();
        }
        if (!muted)
            sounds.musicDeath.stop();
    }
    else {
        if (!muted) {
            sounds.music.pause();
            sounds.musicDeath.play();
        }
    }
    for (const result of results) {
        if (result.type === "MoveEntity") {
            if (result.entity.type === "boulder") {
                if (!muted)
                    sounds.boulderMove.play();
            }
            if (IsCreatureEntity(result.entity.type)) {
                const prevTile = GetTileAtLocation(currentLevelState!, result.oldLocation);
                const nextTile = GetTileAtLocation(currentLevelState!, result.newLocation);
                const entitiesAtNextLocation = GetEntitiesAtLocation(currentLevelState!, result.newLocation);
                if (nextTile === "boulder-water" || nextTile === "boulder-chasm" || entitiesAtNextLocation.some(ent => ent.type === "boulder" || (ent.type === "turtle" && result.entity.type !== "turtle"))) {
                    if (!muted)
                        sounds.hardstep.play();
                }
                else if (result.entity.type === "turtle" && nextTile === "water") {
                    if (prevTile !== "water") {
                        if (!muted)
                            sounds.turtleWaterEnter.play();
                    }
                    else {
                        if (!muted)
                            sounds.turtleWaterMove.play();
                    }
                }
                else {
                    if (!muted)
                        sounds.footstep.play();
                }
            }
        }
        else if (result.type === "MergeBoulderIntoTerrain" && result.newTerrainType === "boulder-water" && !muted) {
            sounds.splash.play();
        }
        else if (result.type === "SwitchEntity") {
            const entity = currentLevelState?.entities.find(entity => entity.id === result.newEntityId);
            if (!entity) {
                return;
            }
            if (entity.type === "mouse" && !muted) {
                sounds.mouseSelect.stop();
                sounds.mouseSelect.play();
            }
            if (entity.type === "turtle" && !muted) {
                sounds.turtleSelect.stop();
                sounds.turtleSelect.play();
            }
            if (entity.type === "bird" && !muted) {
                sounds.birdSelect.stop();
                sounds.birdSelect.play();
            }
            if (entity.type === "frog" && !muted) {
                sounds.frogSelect.stop();
                sounds.frogSelect.play();
            }
        }
        else if (result.type === "EatInsect" && !muted) {
            sounds.frogEat.play();
        }
        else if (result.type === "ModifyCircuitState" && result.circuitFlipped && !muted) {
            sounds.button.play();
        }
    }
}


triggers.on("killEntity", (entityType) => {
    if (!currentLevelState) {
        return;
    }
    let message = "";
    if (entityType === "frog") {
        message = "My darling... I have perished!"
    }
    if (entityType === "turtle") {
        message = "oh, no. rip me"
    }
    if (entityType === "bird") {
        message = "I am ruined!"
    }
    if (entityType === "mouse") {
        message = "I DIED!!"
    }
    displayDialog({
        type: "message",
        speaker: entityType,
        message
    })
})

triggers.on("hint", (entityType) => {
    if (!currentLevelState) {
        return;
    }

    const hint = GetHint(currentLevelState.levelName);
    displayDialog({
        type: "message",
        speaker: hint.speaker,
        message: hint.message
    })
})

triggers.once("turtleOnWater", () => {
    displayDialog({
        type: "message",
        speaker: "turtle",
        message: "hop on Muffin, I can carry you"
    })
})

triggers.on("cannotSwim", (entityType) => {
    if (entityType === 'mouse') {
        displayDialog(
            {
                type: "message",
                speaker: "mouse",
                message: "I can't swim!"
            },
            {
                type: "message",
                speaker: "turtle",
                message: "don't worry, I can"
            }
        )
    }
    else if (entityType === 'frog') {
        displayDialog(
            {
                type: "message",
                speaker: 'frog',
                message: "Cupcake hates it when I come home wet"
            }
        )
    }
})

triggers.on("noMoveInsect", (entityType) => {
    if (entityType === 'bird') {
        displayDialog(
            {
                type: "message",
                speaker: "bird",
                message: "How disguisting, they'll ruin my feathers"
            },
            {
                type: "message",
                speaker: "frog",
                message: "Let me deal with them my love."
            }
        )
    }
    else if (entityType === 'mouse') {
        displayDialog(
            {
                type: "message",
                speaker: 'mouse',
                message: "EEP! How gross!"
            }
        )
    }
})

triggers.on("noMoveTunnel", (entityType) => {
    displayDialog(
        {
            type: "message",
            speaker: entityType,
            message: "I can't squeeze in there"
        }
    )
})

triggers.on("noMoveDoor", (entityType) => {
    displayDialog(
        {
            type: "message",
            speaker: entityType,
            message: "Hmm, that doesn't seem open"
        }
    )
})


triggers.on("noMoveBridge", (entityType) => {
    displayDialog(
        {
            type: "message",
            speaker: entityType,
            message: "I can't seem to get over there"
        }
    )
})

triggers.on("noMoveBoulder", (entityType) => {
    displayDialog(
        {
            type: "message",
            speaker: entityType,
            message: "That's too heavy for me to push"
        }
    )
})

triggers.on("noMoveChasm", (entityType) => {
    displayDialog(
        {
            type: "message",
            speaker: entityType,
            message: "Wouldn't want to jump down there"
        }
    )
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