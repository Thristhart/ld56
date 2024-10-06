import { Howl } from "howler";

import boulderMoveUrl from "~/assets/audio/boulder move.mp3";
import footstepUrl from "~/assets/audio/footstep.mp3";
import turtleSelectUrl from "~/assets/audio/turtle select.mp3";
import mouseSelectUrl from "~/assets/audio/mouse select.mp3";

export const sounds = {
    boulderMove: new Howl({src: boulderMoveUrl}),
    footstep: new Howl({src: footstepUrl}),
    turtleSelect: new Howl({src: turtleSelectUrl}),
    mouseSelect: new Howl({src: mouseSelectUrl}),
} as const satisfies { [key: string]: Howl };