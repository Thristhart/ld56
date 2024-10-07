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

import { currentLevelState, EntityData, GetTileAtLocation, Location } from "~/game/levels";
import { SpriteAnimation, SpriteAnimationDetails, SpriteSheet } from "./spritesheet";
import { lerp } from "./animateaction";
import { EntityType, isFlyingTerrain, TerrainType } from "~/game/specifications";
import { lastActionResults, lastActionTimestamp, lastUndoActionResults, lastUndoTimestamp } from "~/game/actions";

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

import frogAttackDownUrl from "~/assets/frog_attackdown_strip6.png";
const frogAttackDownImage = new Image();
frogAttackDownImage.src = frogAttackDownUrl;
const fromAttackDownSprite: SpriteSheet = {
    image: frogAttackDownImage,
    spriteWidth: 50,
    spriteHeight: 50,
    width: 6,
    height: 1,
    xOffset: 5,
    yOffset: -6
}
export const frogAttackDownAnimation = standardSpriteAnimation(fromAttackDownSprite, 24);

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

import turtleWalkUrl from "~/assets/turtle_walk_strip5.png";
const turtleWalkImage = new Image();
turtleWalkImage.src = turtleWalkUrl;
const turtleWalkSprite: SpriteSheet = {
    image: turtleWalkImage,
    spriteWidth: 40,
    spriteHeight: 40,
    width: 5,
    height: 1,
    yOffset: -4,
    xOffset: 2
}
export const turtleWalkAnimation: SpriteAnimation = standardSpriteAnimation(turtleWalkSprite, 33);

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

import doorSpriteBlueUrl from "~/assets/door_strip6_blue.png";
const doorSpriteBlueImage = new Image();
doorSpriteBlueImage.src = doorSpriteBlueUrl;
const doorSpriteBlue: SpriteSheet = {
    image: doorSpriteBlueImage,
    spriteWidth: 96,
    spriteHeight: 128,
    width: 6,
    height: 1
};
export const doorOpenBlueAnimation = standardSpriteAnimation(doorSpriteBlue, 33);

import doorSpriteRedUrl from "~/assets/door_strip6_red.png";
const doorSpriteRedImage = new Image();
doorSpriteRedImage.src = doorSpriteRedUrl;
const doorSpriteRed: SpriteSheet = {
    image: doorSpriteRedImage,
    spriteWidth: 96,
    spriteHeight: 128,
    width: 6,
    height: 1
};
export const doorOpenRedAnimation = standardSpriteAnimation(doorSpriteRed, 33);

import doorSpriteYellowUrl from "~/assets/door_strip6_yellow.png";
const doorSpriteYellowImage = new Image();
doorSpriteYellowImage.src = doorSpriteYellowUrl;
const doorSpriteYellow: SpriteSheet = {
    image: doorSpriteYellowImage,
    spriteWidth: 96,
    spriteHeight: 128,
    width: 6,
    height: 1
};
export const doorOpenYellowAnimation = standardSpriteAnimation(doorSpriteYellow, 33);

import doorSpritePurpleUrl from "~/assets/door_strip6_purple.png";
const doorSpritePurpleImage = new Image();
doorSpritePurpleImage.src = doorSpritePurpleUrl;
const doorSpritePurple: SpriteSheet = {
    image: doorSpritePurpleImage,
    spriteWidth: 96,
    spriteHeight: 128,
    width: 6,
    height: 1
};
export const doorOpenPurpleAnimation = standardSpriteAnimation(doorSpritePurple, 33);

import boulderChasmUrl from "~/assets/boulder_chasm_animated.png";
const boulderChasmImage = new Image();
boulderChasmImage.src = boulderChasmUrl;
const boulderChasmSprite: SpriteSheet = {
    image: boulderChasmImage,
    spriteWidth: 32,
    spriteHeight: 32,
    width: 8,
    height: 1
};
export const boulderChasmAnimation = standardSpriteAnimation(boulderChasmSprite, 33);

import witch1IdleUrl from "~/assets/witch1_idle.png";
const witch1Image = new Image();
witch1Image.src = witch1IdleUrl;
const witch1IdleSprite: SpriteSheet = {
    image: witch1Image,
    spriteWidth: 128,
    spriteHeight: 128,
    width: 8,
    height: 1,
};
export const witch1IdleAnimation: SpriteAnimation = {
    spritesheet: witch1IdleSprite,
    getFrame(timestamp) {
        return [Math.floor((timestamp % (witch1IdleSprite.width * 144)) / 144), 0];
    },
}

import witch2IdleUrl from "~/assets/witch2_idle.png";
const witch2Image = new Image();
witch2Image.src = witch2IdleUrl;
const witch2IdleSprite: SpriteSheet = {
    image: witch2Image,
    spriteWidth: 128,
    spriteHeight: 128,
    width: 6,
    height: 1,
};
export const witch2IdleAnimation: SpriteAnimation = {
    spritesheet: witch2IdleSprite,
    getFrame(timestamp) {
        return [Math.floor((timestamp % (witch2IdleSprite.width * 144)) / 144), 0];
    },
}

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

import bridgeOpenBlueHorizontalUrl from "~/assets/bridge_open_horizontal_blue.png";
import bridgeClosedBlueHorizontalUrl from "~/assets/bridge_closed_horizontal_blue.png";
export const bridgeOpenBlueHorizontalImage = new Image();
bridgeOpenBlueHorizontalImage.src = bridgeOpenBlueHorizontalUrl;
export const bridgeClosedBlueHorizontalImage = new Image();
bridgeClosedBlueHorizontalImage.src = bridgeClosedBlueHorizontalUrl;

import bridgeOpenBlueVerticalUrl from "~/assets/bridge_open_vertical_blue.png";
import bridgeClosedBlueVerticalUrl from "~/assets/bridge_closed_vertical_blue.png";
export const bridgeOpenBlueVerticalImage = new Image();
bridgeOpenBlueVerticalImage.src = bridgeOpenBlueVerticalUrl;
export const bridgeClosedBlueVerticalImage = new Image();
bridgeClosedBlueVerticalImage.src = bridgeClosedBlueVerticalUrl;

import bridgeOpenRedHorizontalUrl from "~/assets/bridge_open_horizontal_red.png";
import bridgeClosedRedHorizontalUrl from "~/assets/bridge_closed_horizontal_red.png";
export const bridgeOpenRedHorizontalImage = new Image();
bridgeOpenRedHorizontalImage.src = bridgeOpenRedHorizontalUrl;
export const bridgeClosedRedHorizontalImage = new Image();
bridgeClosedRedHorizontalImage.src = bridgeClosedRedHorizontalUrl;

import bridgeOpenRedVerticalUrl from "~/assets/bridge_open_vertical_red.png";
import bridgeClosedRedVerticalUrl from "~/assets/bridge_closed_vertical_red.png";
export const bridgeOpenRedVerticalImage = new Image();
bridgeOpenRedVerticalImage.src = bridgeOpenRedVerticalUrl;
export const bridgeClosedRedVerticalImage = new Image();
bridgeClosedRedVerticalImage.src = bridgeClosedRedVerticalUrl;

import bridgeOpenPurpleHorizontalUrl from "~/assets/bridge_open_horizontal_purple.png";
import bridgeClosedPurpleHorizontalUrl from "~/assets/bridge_closed_horizontal_purple.png";
export const bridgeOpenPurpleHorizontalImage = new Image();
bridgeOpenPurpleHorizontalImage.src = bridgeOpenPurpleHorizontalUrl;
export const bridgeClosedPurpleHorizontalImage = new Image();
bridgeClosedPurpleHorizontalImage.src = bridgeClosedPurpleHorizontalUrl;

import bridgeOpenPurpleVerticalUrl from "~/assets/bridge_open_vertical_purple.png";
import bridgeClosedPurpleVerticalUrl from "~/assets/bridge_closed_vertical_purple.png";
export const bridgeOpenPurpleVerticalImage = new Image();
bridgeOpenPurpleVerticalImage.src = bridgeOpenPurpleVerticalUrl;
export const bridgeClosedPurpleVerticalImage = new Image();
bridgeClosedPurpleVerticalImage.src = bridgeClosedPurpleVerticalUrl;

import bridgeOpenYellowHorizontalUrl from "~/assets/bridge_open_horizontal_yellow.png";
import bridgeClosedYellowHorizontalUrl from "~/assets/bridge_closed_horizontal_yellow.png";
export const bridgeOpenYellowHorizontalImage = new Image();
bridgeOpenYellowHorizontalImage.src = bridgeOpenYellowHorizontalUrl;
export const bridgeClosedYellowHorizontalImage = new Image();
bridgeClosedYellowHorizontalImage.src = bridgeClosedYellowHorizontalUrl;

import bridgeOpenYellowVerticalUrl from "~/assets/bridge_open_vertical_yellow.png";
import bridgeClosedYellowVerticalUrl from "~/assets/bridge_closed_vertical_yellow.png";
export const bridgeOpenYellowVerticalImage = new Image();
bridgeOpenYellowVerticalImage.src = bridgeOpenYellowVerticalUrl;
export const bridgeClosedYellowVerticalImage = new Image();
bridgeClosedYellowVerticalImage.src = bridgeClosedYellowVerticalUrl;

import buttonBlueBackgroundUrl from "~/assets/button_background_blue.png";
export const buttonBlueBackgroundImage = new Image();
buttonBlueBackgroundImage.src = buttonBlueBackgroundUrl;

import buttonRedBackgroundUrl from "~/assets/button_background_red.png";
export const buttonRedBackgroundImage = new Image();
buttonRedBackgroundImage.src = buttonRedBackgroundUrl;

import buttonPurpleBackgroundUrl from "~/assets/button_background_purple.png";
export const buttonPurpleBackgroundImage = new Image();
buttonPurpleBackgroundImage.src = buttonPurpleBackgroundUrl;

import buttonYellowBackgroundUrl from "~/assets/button_background_yellow.png";
export const buttonYellowBackgroundImage = new Image();
buttonYellowBackgroundImage.src = buttonYellowBackgroundUrl;

import buttonBlueDownBackgroundUrl from "~/assets/button_background_blue_down.png";
export const buttonBlueDownBackgroundImage = new Image();
buttonBlueDownBackgroundImage.src = buttonBlueDownBackgroundUrl;

import buttonRedDownBackgroundUrl from "~/assets/button_background_red_down.png";
export const buttonRedDownBackgroundImage = new Image();
buttonRedDownBackgroundImage.src = buttonRedDownBackgroundUrl;

import buttonPurpleDownBackgroundUrl from "~/assets/button_background_purple_down.png";
export const buttonPurpleDownBackgroundImage = new Image();
buttonPurpleDownBackgroundImage.src = buttonPurpleDownBackgroundUrl;

import buttonYellowDownBackgroundUrl from "~/assets/button_background_yellow_down.png";
export const buttonYellowDownBackgroundImage = new Image();
buttonYellowDownBackgroundImage.src = buttonYellowDownBackgroundUrl;

import iconwUrl from "~/assets/icon_w.png";
import iconaUrl from "~/assets/icon_a.png";
import iconsUrl from "~/assets/icon_s.png";
import icondUrl from "~/assets/icon_d.png";
import iconeUrl from "~/assets/icon_e.png";
import iconzUrl from "~/assets/icon_z.png";
import iconrUrl from "~/assets/icon_r.png";
import iconLeftClickUrl from "~/assets/icon_leftclick.png";
export const controlIcons = {
    w: new Image(),
    a: new Image(),
    s: new Image(),
    d: new Image(),
    e: new Image(),
    z: new Image(),
    r: new Image(),
    leftclick: new Image(),
};
controlIcons.w.src = iconwUrl;
controlIcons.a.src = iconaUrl;
controlIcons.s.src = iconsUrl;
controlIcons.d.src = icondUrl;
controlIcons.e.src = iconeUrl;
controlIcons.z.src = iconzUrl;
controlIcons.r.src = iconrUrl;
controlIcons.leftclick.src = iconLeftClickUrl;

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

import goalPortalBackgroundSpriteUrl from "~/assets/goal_portal_animated.png";
const goalPortalSpriteImage = new Image();
goalPortalSpriteImage.src = goalPortalBackgroundSpriteUrl;
const goalPortalBackgroundSprite: SpriteSheet = {
    image: goalPortalSpriteImage,
    spriteWidth: 32,
    spriteHeight: 32,
    width: 6,
    height: 1,
}

const goalPortalBackgroundAnimation: SpriteAnimation = {
    spritesheet: goalPortalBackgroundSprite,
    getFrame(timestamp) {
        return [Math.floor((timestamp % (goalPortalBackgroundSprite.width * 200)) / 200), 0];
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
        case 'wall': return rockWallImage;
        case 'goal': return goalPortraitImage;
        default: return undefined;
    }
}

export function GetTerrainAnimation(terrain: TerrainType, location?: Location): SpriteAnimationDetails | undefined {
    switch (terrain) {
        case 'water': return {
            sprite: waterBackgroundAnimation,
            direction: 1,
            startTime: 0,
        };
        case 'boulder-water': return {
            sprite: waterBoulderBackgroundAnimation,
            direction: 1,
            startTime: 0,
        };
        case 'boulder-chasm': {
            if (lastActionResults?.some(result => result.type === "MergeBoulderIntoTerrain" && result.targetlocation.column === location?.column && result.targetlocation.row === location.row)) {
                return {
                    sprite: boulderChasmAnimation,
                    direction: 1,
                    startTime: lastActionTimestamp!,
                };
            }
            if (lastUndoActionResults?.some(result => result.type === "MergeBoulderIntoTerrain" && result.targetlocation.column === location?.column && result.targetlocation.row === location.row)) {
                return {
                    sprite: boulderChasmAnimation,
                    direction: -1,
                    startTime: lastUndoTimestamp!,
                };
            }
            return undefined;
        }
        case 'goal': return {
            sprite: goalPortalBackgroundAnimation,
            direction: 1,
            startTime: 0,
        };
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
    if (entity.type === "turtle") {
        return { sprite: turtleWalkAnimation, direction: -1, startTime: 0 };
    }
    return undefined;
}

// yellow for 1 
// red for 2 
// blue for 3 
// purple for 4

export function GetDoorAnimation(circuitId: number | undefined) {
    switch (circuitId) {
        case 1: return doorOpenRedAnimation;
        case 2: return doorOpenBlueAnimation;
        case 3: return doorOpenPurpleAnimation;
        default: return doorOpenYellowAnimation;
    }
}

export function GetBridgeImagesForCircuit(circuitId: number | undefined) {
    switch (circuitId) {
        case 1: return { horizontalOpen: bridgeOpenRedHorizontalImage, horizontalClosed: bridgeClosedRedHorizontalImage, verticalOpen: bridgeOpenRedVerticalImage, verticalClosed: bridgeClosedRedVerticalImage };
        case 2: return { horizontalOpen: bridgeOpenBlueHorizontalImage, horizontalClosed: bridgeClosedBlueHorizontalImage, verticalOpen: bridgeOpenBlueVerticalImage, verticalClosed: bridgeClosedBlueVerticalImage };
        case 3: return { horizontalOpen: bridgeOpenPurpleHorizontalImage, horizontalClosed: bridgeClosedPurpleHorizontalImage, verticalOpen: bridgeOpenPurpleVerticalImage, verticalClosed: bridgeClosedPurpleVerticalImage };
        default: return { horizontalOpen: bridgeOpenYellowHorizontalImage, horizontalClosed: bridgeClosedYellowHorizontalImage, verticalOpen: bridgeOpenYellowVerticalImage, verticalClosed: bridgeClosedYellowVerticalImage };
    }
}

export function GetButtonImagesForCircuit(circuitId: number | undefined) {
    switch (circuitId) {
        case 1: return { down: buttonRedDownBackgroundImage, up: buttonRedBackgroundImage };
        case 2: return { down: buttonBlueDownBackgroundImage, up: buttonBlueBackgroundImage };
        case 3: return { down: buttonPurpleDownBackgroundImage, up: buttonPurpleBackgroundImage };
        default: return { down: buttonYellowDownBackgroundImage, up: buttonYellowBackgroundImage };
    }
}