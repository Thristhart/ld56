import { continueStory } from './story';
import { tick } from './game/tick';
import "./main.css";

if (import.meta.hot) {
    import.meta.hot.accept();
}

// this is temporary
document.querySelector("canvas")?.addEventListener("click", () => {
    continueStory();
})

requestAnimationFrame(tick);