import { drawFrame } from "~/render/drawframe";

let lastTickTime = performance.now();
let animationFrame: number;
export function tick(timestamp: number) {
    const dt = timestamp - lastTickTime;
    lastTickTime = timestamp;
    drawFrame();
    animationFrame = requestAnimationFrame(tick);
}

if (import.meta.hot) {
    import.meta.hot.accept((main) => {
        cancelAnimationFrame(animationFrame);
        requestAnimationFrame(main?.tick);
    });
}