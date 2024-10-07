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
import turtleWaterEnterUrl from "~/assets/audio/turtle water enter.mp3";
import turtleWaterMoveUrl from "~/assets/audio/turtle water move.mp3";
import musicUrl from "~/assets/audio/main theme.mp3";
import frogEatUrl from "~/assets/audio/frog eat.mp3";

export const sounds = {
    boulderMove: new Howl({ src: boulderMoveUrl }),
    footstep: new Howl({ src: footstepUrl }),
    hardstep: new Howl({ src: hardstepUrl }),
    turtleSelect: new Howl({ src: turtleSelectUrl, volume: 0.8 }),
    mouseSelect: new Howl({ src: mouseSelectUrl, volume: 0.8 }),
    frogSelect: new Howl({ src: frogSelectUrl }),
    birdSelect: new Howl({ src: birdSelectUrl, volume: 0.8 }),
    splash: new Howl({ src: splashUrl }),
    bump: new Howl({ src: bumpUrl }),
    turtleWaterEnter: new Howl({ src: turtleWaterEnterUrl }),
    turtleWaterMove: new Howl({ src: turtleWaterMoveUrl }),
    frogEat: new Howl({ src: frogEatUrl }),
    music: new Howl({
        src: musicUrl,
        sprite: {
            intro: [0, 29109],
            loop: [29109, 204090, true]
        }
    }),
} as const satisfies { [key: string]: Howl };

export function startMusic() {
    let introId = sounds.music.play("intro");
    sounds.music.on("end", (soundId) => {
        if (soundId === introId) {
            sounds.music.play("loop");
        }
    })
}