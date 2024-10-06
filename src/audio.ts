import { Howl } from "howler";

import boulderMoveUrl from "~/assets/audio/boulder move.mp3";
import footstepUrl from "~/assets/audio/footstep.mp3";
import hardstepUrl from "~/assets/audio/footstep_hard.mp3";
import turtleSelectUrl from "~/assets/audio/turtle select.mp3";
import mouseSelectUrl from "~/assets/audio/mouse select.mp3";
import frogSelectUrl from "~/assets/audio/frog select.mp3";
import birdSelectUrl from "~/assets/audio/bird select.mp3";
import splashUrl from "~/assets/audio/splash.mp3";
import bumpUrl from "~/assets/audio/bump.mp3";

export const sounds = {
    boulderMove: new Howl({src: boulderMoveUrl}),
    footstep: new Howl({src: footstepUrl}),
    hardstep: new Howl({src: hardstepUrl}),
    turtleSelect: new Howl({src: turtleSelectUrl}),
    mouseSelect: new Howl({src: mouseSelectUrl}),
    frogSelect: new Howl({src: frogSelectUrl}),
    birdSelect: new Howl({src: birdSelectUrl}),
    splash: new Howl({src: splashUrl}),
    bump: new Howl({src: bumpUrl}),
} as const satisfies { [key: string]: Howl };