import turtlePortraitUrl from "~/assets/turtle_portrait.png";
import mousePortraitUrl from "~/assets/mouse_portrait.png";
import boulderPortraitUrl from "~/assets/boulder_portrait.png";
import goalPortraitUrl from "~/assets/goal_portrait.png";

import grassBackgroundUrl from "~/assets/grass_background.png";
import tunnelBackgroundUrl from "~/assets/tunnel_background.png";
import dialogBackgroundUrl from "~/assets/dialog_panel.png";
import { EntityType, TerrainType } from "~/game/levels";

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


export function GetEntityPortrait(entity: EntityType) {
    switch (entity) {
        case 'turtle': return turtlePortraitImage;
        case 'mouse': return mousePortraitImage;
        case 'boulder': return boulderPortraitImage;
        case 'goal': return goalPortraitImage;
        default: return '';
    }
}

export function GetTerrainBackground(terrain: TerrainType) {
    switch (terrain) {
        case 'ground': return grassBackgroundImage;
        case 'tunnel': return tunnelBackgroundImage;
        default: return '';
    }
}
