import turtlePortraitUrl from "~/assets/turtle_portrait.png";
import turtleHideUrl from "~/assets/turtle_hide_strip8.png";
import turtleUnhideUrl from "~/assets/turtle_unhide_strip5.png";
import mousePortraitUrl from "~/assets/mouse_portrait.png";
import goalPortraitUrl from "~/assets/goal_portrait.png";
import boulderRollUrl from "~/assets/new_boulder_roll.png";

import grassBackgroundUrl from "~/assets/grass_background.png";
import tunnelBackgroundUrl from "~/assets/tunnel_background.png";
import dialogBackgroundUrl from "~/assets/dialog_panel.png";
import waterBackgroundSpriteUrl from "~/assets/water_animated.png";
import waterBoulderBackgroundSpriteUrl from "~/assets/water_boulder_animated-sheet.png";
import waterTopEdgeBackgroundSpriteUrl from "~/assets/water_top_edge_animated.png";
import buttonBackgroundUrl from "~/assets/button_background.png";
import chasmTopEdgeUrl from "~/assets/chasm_top_edge.png";
import bridgeOpenHorizontalUrl from "~/assets/bridge_open_horizontal.png";
import bridgeClosedHorizontalUrl from "~/assets/bridge_closed_horizontal.png";
import bridgeOpenVerticalUrl from "~/assets/bridge_open_vertical.png";
import bridgeClosedVerticalUrl from "~/assets/bridge_closed_vertical.png";

import doorOpenBackgroundUrl from "~/assets/door_open_background.png";
import doorClosedBackgroundUrl from "~/assets/door_closed_background.png";
import bridgeOpenBackgroundUrl from "~/assets/bridge_open_background.png";
import bridgeClosedBackgroundUrl from "~/assets/bridge_closed_background.png";
import wallBackgroundUrl from "~/assets/tree_wall.png";
import wall9GridUrl from "~/assets/wall_9grid.png";
import rockwallUrl from "~/assets/rockwall.png";
import doorSpriteUrl from "~/assets/door_strip6.png";

import treeImageUrl from "~/assets/tree.png";

import { currentLevelState, EntityData, GetTileAtLocation } from "~/game/levels";
import { SpriteAnimation, SpriteAnimationDetails, SpriteSheet } from "./spritesheet";
import { lerp } from "./animateaction";
import { EntityType, isFlyingTerrain, TerrainType } from "~/game/specifications";

export const turtlePortraitImage = new Image();
turtlePortraitImage.src = turtlePortraitUrl;

function standardSpriteAnimation(sheet: SpriteSheet, msPerFrame: number): SpriteAnimation {
    const duration = msPerFrame * sheet.width;
    return {
        spritesheet: sheet,
        getFrame(dt, spriteDetails) {
            const t = Math.min(dt / duration, 1);
            let frame;
            if ((spriteDetails?.direction ?? 1) > 0) {
                frame = lerp(0, sheet.width - 1, t)
            }
            else {
                frame = lerp(sheet.width - 1, 0, t)
            }
            if (t >= 1) {
                spriteDetails?.onComplete?.();
            }
            return [Math.floor(frame), 0];
        },
    };
}

const turtleHideImage = new Image();
turtleHideImage.src = turtleHideUrl;
const turtleHideSprite: SpriteSheet = {
    image: turtleHideImage,
    spriteWidth: 40,
    spriteHeight: 40,
    xOffset: 4,
    yOffset: -4,
    width: 8,
    height: 1
}
export const turtleHideAnimation = standardSpriteAnimation(turtleHideSprite, 66);

const turtleUnhideImage = new Image();
turtleUnhideImage.src = turtleUnhideUrl;
const turtleUnhideSprite: SpriteSheet = {
    image: turtleUnhideImage,
    spriteWidth: 40,
    spriteHeight: 40,
    xOffset: 4,
    yOffset: -4,
    width: 5,
    height: 1
}
export const turtleUnhideAnimation = standardSpriteAnimation(turtleUnhideSprite, 66);

import crowWalkUrl from "~/assets/crow_walk_strip16.png";
export const crowWalkImage = new Image();
crowWalkImage.src = crowWalkUrl;
const crowWalkSprite: SpriteSheet = {
    image: crowWalkImage,
    spriteWidth: 40,
    spriteHeight: 40,
    width: 8,
    height: 1,
}
export const crowWalkAnimation = standardSpriteAnimation(crowWalkSprite, 18);

import crowFlyUrl from "~/assets/crow_fly_strip6.png";
const crowFlyImage = new Image();
crowFlyImage.src = crowFlyUrl;
const crowFlySprite: SpriteSheet = {
    image: crowFlyImage,
    spriteWidth: 40,
    spriteHeight: 40,
    width: 6,
    height: 1,
}
export const crowFlyAnimation: SpriteAnimation = {
    spritesheet: crowFlySprite,
    getFrame(dt) {
        return [Math.floor((dt % (crowFlySprite.width * 66)) / 66), 0];
    },
};

import crowTakeoffUrl from "~/assets/crow_takeoff_strip9.png";
const crowTakeoffImage = new Image();
crowTakeoffImage.src = crowTakeoffUrl;
const crowTakeoffSprite: SpriteSheet = {
    image: crowTakeoffImage,
    spriteWidth: 40,
    spriteHeight: 40,
    width: 9,
    height: 1,
}
export const crowTakeoffAnimation = standardSpriteAnimation(crowTakeoffSprite, 66);

import crowLandUrl from "~/assets/crow_land_strip3.png";
const crowLandImage = new Image();
crowLandImage.src = crowLandUrl;
const crowLandSprite: SpriteSheet = {
    image: crowLandImage,
    spriteWidth: 40,
    spriteHeight: 40,
    width: 3,
    height: 1,
}
export const crowLandAnimation = standardSpriteAnimation(crowLandSprite, 66);


import frogHopUrl from "~/assets/frog_hop_strip6.png";
export const frogHopImage = new Image();
frogHopImage.src = frogHopUrl;
const frogHopSprite: SpriteSheet = {
    image: frogHopImage,
    spriteWidth: 50,
    spriteHeight: 50,
    width: 6,
    height: 1,
    xOffset: 5,
    yOffset: -6
}
export const frogHopAnimation = standardSpriteAnimation(frogHopSprite, 24);

import frogAttackForwardUrl from "~/assets/frog_attackforward_strip6.png";
const frogAttackForwardImage = new Image();
frogAttackForwardImage.src = frogAttackForwardUrl;
const fromAttackForwardSprite: SpriteSheet = {
    image: frogAttackForwardImage,
    spriteWidth: 50,
    spriteHeight: 50,
    width: 6,
    height: 1,
    xOffset: 5,
    yOffset: -6
}
export const frogAttackForwardAnimation = standardSpriteAnimation(fromAttackForwardSprite, 24);

import frogAttackUpUrl from "~/assets/frog_attackup_strip6.png";
const frogAttackUpImage = new Image();
frogAttackUpImage.src = frogAttackUpUrl;
const fromAttackUpSprite: SpriteSheet = {
    image: frogAttackUpImage,
    spriteWidth: 50,
    spriteHeight: 50,
    width: 6,
    height: 1,
    xOffset: 5,
    yOffset: -6
}
export const frogAttackUpAnimation = standardSpriteAnimation(fromAttackUpSprite, 24);

import fliesUrl from "~/assets/mosquito_strip2.png";
const fliesImage = new Image();
fliesImage.src = fliesUrl;
const fliesSprite: SpriteSheet = {
    image: fliesImage,
    spriteWidth: 8,
    spriteHeight: 8,
    width: 2,
    height: 1,
}
export const fliesAnimation: SpriteAnimation = {
    spritesheet: fliesSprite,
    getFrame(timestamp) {
        return [Math.floor((timestamp % (fliesSprite.width * 144)) / 144), 0];
    },
}

const boulderRollImage = new Image();
boulderRollImage.src = boulderRollUrl;
const boulderRollSprite: SpriteSheet = {
    image: boulderRollImage,
    spriteWidth: 40,
    spriteHeight: 40,
    width: 6,
    height: 1,
}
export const boulderRollAnimation = standardSpriteAnimation(boulderRollSprite, 24);

const doorSpriteImage = new Image();
doorSpriteImage.src = doorSpriteUrl;
const doorSprite: SpriteSheet = {
    image: doorSpriteImage,
    spriteWidth: 96,
    spriteHeight: 128,
    width: 6,
    height: 1
};

export const doorOpenAnimation = standardSpriteAnimation(doorSprite, 33);

export const mousePortraitImage = new Image();
mousePortraitImage.src = mousePortraitUrl;

export const goalPortraitImage = new Image();
goalPortraitImage.src = goalPortraitUrl;


// Background Images
export const grassBackgroundImage = new Image();
grassBackgroundImage.src = grassBackgroundUrl;

export const tunnelBackgroundImage = new Image();
tunnelBackgroundImage.src = tunnelBackgroundUrl;

export const dialogBackgroundImage = new Image();
dialogBackgroundImage.src = dialogBackgroundUrl;

const waterBackgroundSpriteImage = new Image();
waterBackgroundSpriteImage.src = waterBackgroundSpriteUrl;

const waterBoulderBackgroundSpriteImage = new Image();
waterBoulderBackgroundSpriteImage.src = waterBoulderBackgroundSpriteUrl;

const waterTopEdgeBackgroundSpriteImage = new Image();
waterTopEdgeBackgroundSpriteImage.src = waterTopEdgeBackgroundSpriteUrl;

export const buttonBackgroundImage = new Image();
buttonBackgroundImage.src = buttonBackgroundUrl;

export const doorOpenBackgroundImage = new Image();
doorOpenBackgroundImage.src = doorOpenBackgroundUrl;

export const doorClosedBackgroundImage = new Image();
doorClosedBackgroundImage.src = doorClosedBackgroundUrl;

export const bridgeOpenBackgroundImage = new Image();
bridgeOpenBackgroundImage.src = bridgeOpenBackgroundUrl;

export const bridgeClosedBackgroundImage = new Image();
bridgeClosedBackgroundImage.src = bridgeClosedBackgroundUrl;

export const treeWallBackgroundImage = new Image();
treeWallBackgroundImage.src = wallBackgroundUrl;

export const wall9GridImage = new Image();
wall9GridImage.src = wall9GridUrl;

export const rockWallImage = new Image();
rockWallImage.src = rockwallUrl;

export const chasmTopEdgeImage = new Image();
chasmTopEdgeImage.src = chasmTopEdgeUrl;

export const bridgeOpenHorizontalImage = new Image();
bridgeOpenHorizontalImage.src = bridgeOpenHorizontalUrl;
export const bridgeClosedHorizontalImage = new Image();
bridgeClosedHorizontalImage.src = bridgeClosedHorizontalUrl;

export const bridgeOpenVerticalImage = new Image();
bridgeOpenVerticalImage.src = bridgeOpenVerticalUrl;
export const bridgeClosedVerticalImage = new Image();
bridgeClosedVerticalImage.src = bridgeClosedVerticalUrl;

const waterBackgroundSprite: SpriteSheet = {
    image: waterBackgroundSpriteImage,
    spriteWidth: 32,
    spriteHeight: 32,
    width: 8,
    height: 1,
}

const waterBackgroundAnimation: SpriteAnimation = {
    spritesheet: waterBackgroundSprite,
    getFrame(timestamp) {
        return [Math.floor((timestamp % (waterBackgroundSprite.width * 200)) / 200), 0];
    },
}

const waterBoulderBackgroundSprite: SpriteSheet = {
    image: waterBoulderBackgroundSpriteImage,
    spriteWidth: 32,
    spriteHeight: 32,
    width: 8,
    height: 1,
}

const waterBoulderBackgroundAnimation: SpriteAnimation = {
    spritesheet: waterBoulderBackgroundSprite,
    getFrame(timestamp) {
        return [Math.floor((timestamp % (waterBoulderBackgroundSprite.width * 200)) / 200), 0];
    },
}

const waterTopEdgeBackgroundSprite: SpriteSheet = {
    image: waterTopEdgeBackgroundSpriteImage,
    spriteWidth: 32,
    spriteHeight: 32,
    width: 8,
    height: 1,
}

export const waterTopEdgeBackgroundAnimation: SpriteAnimation = {
    spritesheet: waterTopEdgeBackgroundSprite,
    getFrame(timestamp) {
        return [Math.floor((timestamp % (waterTopEdgeBackgroundSprite.width * 200)) / 200), 0];
    },
}

export const treeImage = new Image();
treeImage.src = treeImageUrl;

export function GetEntityPortrait(entity: EntityType) {
    switch (entity) {
        case 'turtle': return turtlePortraitImage;
        case 'mouse': return mousePortraitImage;
        case 'boulder': return boulderRollImage;
        default: return undefined;
    }
}

export function GetTerrainBackground(terrain: TerrainType, activeElementState?: boolean) {
    if (activeElementState) {
        if (terrain === 'bridge')
            return bridgeOpenBackgroundImage;
        if (terrain === 'door')
            return doorOpenBackgroundImage;
    }

    switch (terrain) {
        case 'ground': return grassBackgroundImage;
        case 'tunnel': return tunnelBackgroundImage;
        case 'button': return buttonBackgroundImage;
        case 'door': return doorClosedBackgroundImage;
        case 'bridge': return bridgeClosedBackgroundImage;
        case 'wall': return rockWallImage;
        case 'goal': return goalPortraitImage;
        default: return undefined;
    }
}

export function GetTerrainAnimation(terrain: TerrainType) {
    switch (terrain) {
        case 'water': return waterBackgroundAnimation;
        case 'boulder-water': return waterBoulderBackgroundAnimation;
        default: return undefined;
    }
}

export function GetSpriteForEntity(entity: EntityData): SpriteAnimationDetails | undefined {
    if (!currentLevelState) {
        return undefined;
    }
    if (entity.type === "turtle") {
        const tile = GetTileAtLocation(currentLevelState, entity.location);
        if (tile === "water") {
            return { sprite: turtleHideAnimation, direction: 1, startTime: 0 } // startTime 0 means this will always be at the last frame
        }
    }
    if (entity.type === "boulder") {
        return { sprite: boulderRollAnimation, direction: -1, startTime: 0, renderDimensions: { width: 32, height: 32 } } // startTime 0 means this will always be at the last frame
    }
    if (entity.type === "bird") {
        const tile = GetTileAtLocation(currentLevelState, entity.location);
        if (isFlyingTerrain(tile)) {
            return { sprite: crowFlyAnimation, direction: 1, startTime: 0 };
        }
        return { sprite: crowWalkAnimation, direction: -1, startTime: 0 };
    }
    if (entity.type === "frog") {
        return { sprite: frogHopAnimation, direction: -1, startTime: 0 };
    }
    return undefined;
}