import turtlePortraitUrl from "~/assets/turtle_portrait.png";
import mousePortraitUrl from "~/assets/mouse_portrait.png";
import boulderPortraitUrl from "~/assets/boulder_portrait.png";
import dialogBackgroundUrl from "~/assets/dialog_panel.png";
import { EntityType } from "~/game/levels";

export const turtlePortraitImage = new Image();
turtlePortraitImage.src = turtlePortraitUrl;

export const mousePortraitImage = new Image();
mousePortraitImage.src = mousePortraitUrl;

export const boulderPortraitImage = new Image();
boulderPortraitImage.src = boulderPortraitUrl;

export const dialogBackgroundImage = new Image();
dialogBackgroundImage.src = dialogBackgroundUrl;


export function GetEntityPortrait(entity: EntityType) {
    switch (entity) {
        case 'turtle': return turtlePortraitImage;
        case 'mouse': return mousePortraitImage;
        case 'boulder': return boulderPortraitImage;
        default: return '';
    }
}

