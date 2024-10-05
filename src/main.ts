import { tick } from './game/tick';
import "./main.css";
import { continueStory } from './story';

if (import.meta.hot) {
    import.meta.hot.accept();
}


continueStory();

// this is temporary
document.querySelector("canvas")?.addEventListener("click", () => {
    continueStory();
})

requestAnimationFrame(tick);