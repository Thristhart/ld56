// import { continueStory } from './story';
import { InkObject } from 'inkjs/engine/Object';
import { tick } from './game/tick';
import "./main.css";
import { storyTest } from './story';

if (import.meta.hot) {
    import.meta.hot.accept();
}

console.log(InkObject);
storyTest()

// continueStory();

// this is temporary
document.querySelector("canvas")?.addEventListener("click", () => {
    // continueStory();
})

requestAnimationFrame(tick);