import turtlePortraitUrl from "~/assets/turtle_portrait.png";
import dialogBackgroundUrl from "~/assets/dialog_panel.png";
import { EntityType } from "~/game/levels";

export const turtlePortraitImage = new Image();
turtlePortraitImage.src = turtlePortraitUrl;

export const dialogBackgroundImage = new Image();
dialogBackgroundImage.src = dialogBackgroundUrl;


export function GetEntityPortrait(entity: EntityType) {
    switch (entity) {
        case 'turtle': return turtlePortraitImage;
        default: return '';
    }
}

