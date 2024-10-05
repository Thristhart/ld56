import turtlePortraitUrl from "~/assets/turtle_portrait.png";
import mousePortraitUrl from "~/assets/mouse_portrait.png";
import boulderPortraitUrl from "~/assets/boulder_portrait.png";
import goalPortraitUrl from "~/assets/goal_portrait.png";

import grassBackgroundUrl from "~/assets/grass_background.png";
import tunnelBackgroundUrl from "~/assets/tunnel_background.png";
import dialogBackgroundUrl from "~/assets/dialog_panel.png";
import waterBackgroundSpriteUrl from "~/assets/water_animated.png";

import { EntityType, TerrainType } from "~/game/levels";
import { SpriteAnimation, SpriteSheet } from "./spritesheet";

export const turtlePortraitImage = new Image();
turtlePortraitImage.src = turtlePortraitUrl;

export const mousePortraitImage = new Image();
mousePortraitImage.src = mousePortraitUrl;

export const boulderPortraitImage = new Image();
boulderPortraitImage.src = boulderPortraitUrl;

export const goalPortraitImage = new Image();
goalPortraitImage.src = goalPortraitUrl;

export const grassBackgroundImage = new Image();
grassBackgroundImage.src = grassBackgroundUrl;

export const tunnelBackgroundImage = new Image();
tunnelBackgroundImage.src = tunnelBackgroundUrl;

export const dialogBackgroundImage = new Image();
dialogBackgroundImage.src = dialogBackgroundUrl;

const waterBackgroundSpriteImage = new Image();
waterBackgroundSpriteImage.src = waterBackgroundSpriteUrl;

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
        return [Math.floor((timestamp % (waterBackgroundSprite.width * 200))/200), 0];
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
        default: return undefined;
    }
}

export function GetTerrainAnimation(terrain: TerrainType) {
    switch(terrain) {
        case 'water': return waterBackgroundAnimation;
        default: return undefined;
    }
}