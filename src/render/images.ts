import turtlePortraitUrl from "~/assets/turtle_portrait.png";
import turtleHideUrl from "~/assets/turtle_hide_strip8.png";
import turtleUnhideUrl from "~/assets/turtle_unhide_strip5.png";
import mousePortraitUrl from "~/assets/mouse_portrait.png";
import boulderPortraitUrl from "~/assets/boulder_portrait.png";
import goalPortraitUrl from "~/assets/goal_portrait.png";

import grassBackgroundUrl from "~/assets/grass_background.png";
import tunnelBackgroundUrl from "~/assets/tunnel_background.png";
import dialogBackgroundUrl from "~/assets/dialog_panel.png";
import waterBackgroundSpriteUrl from "~/assets/water_animated.png";
import buttonBackgroundUrl from "~/assets/button_background.png";

import { currentLevelState, EntityData, GetTileAtLocation } from "~/game/levels";
import { SpriteAnimation, SpriteAnimationDetails, SpriteSheet } from "./spritesheet";
import { lerp } from "./animateaction";
import { EntityType } from "~/game/specifications";

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
                frame = lerp(0, sheet.width, t)
            }
            else {
                frame = lerp(sheet.width, 0, t)
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
    width: 7,
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
    width: 4,
    height: 1
}
export const turtleUnhideAnimation = standardSpriteAnimation(turtleUnhideSprite, 66);

export const mousePortraitImage = new Image();
mousePortraitImage.src = mousePortraitUrl;

export const boulderPortraitImage = new Image();
boulderPortraitImage.src = boulderPortraitUrl;

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

export const buttonBackgroundImage = new Image();
buttonBackgroundImage.src = buttonBackgroundUrl;

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

export function GetEntityPortrait(entity: EntityType) {
    switch (entity) {
        case 'turtle': return turtlePortraitImage;
        case 'mouse': return mousePortraitImage;
        case 'boulder': return boulderPortraitImage;
        case 'goal': return goalPortraitImage;
        default: return undefined;
    }
}

export function GetTerrainBackground(terrain: TerrainType) {
    switch (terrain) {
        case 'ground': return grassBackgroundImage;
        case 'tunnel': return tunnelBackgroundImage;
        case 'button': return buttonBackgroundImage;
        default: return undefined;
    }
}

export function GetTerrainAnimation(terrain: TerrainType) {
    switch (terrain) {
        case 'water': return waterBackgroundAnimation;
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
    return undefined;
}