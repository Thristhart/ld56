export interface SpriteSheet {
    readonly image: HTMLImageElement;
    readonly spriteWidth: number;
    readonly spriteHeight: number;
    readonly width: number;
    readonly height: number;
    readonly xOffset?: number;
    readonly yOffset?: number;
}

export interface SpriteAnimation {
    readonly spritesheet: SpriteSheet;
    readonly getFrame: (dt: number, spriteDetails?: SpriteAnimationDetails) => readonly [x: number, y: number];
}

export interface SpriteAnimationDetails {
    sprite: SpriteAnimation;
    direction: number;
    startTime: number;
    onComplete?: () => void;
    renderDimensions?: {width: number; height: number};
}

export function drawSprite(
    context: CanvasRenderingContext2D,
    sheet: SpriteSheet,
    x: number,
    y: number,
    frame: readonly [x: number, y: number],
    flip?: boolean,
    renderDimensions?: { width: number; height: number }
) {
    context.save();
    let scale = flip ? -1 : 1;
    context.scale(scale, 1);
    context.translate(x * scale, 0);
    context.drawImage(
        sheet.image,
        frame[0] * sheet.spriteWidth,
        frame[1] * sheet.spriteHeight,
        sheet.spriteWidth,
        sheet.spriteHeight,
        -((renderDimensions?.width ?? sheet.spriteWidth) / 2 - (sheet.xOffset ?? 0)),
        y + (sheet.yOffset ?? 0) - (renderDimensions?.height ?? sheet.spriteHeight) / 2,
        renderDimensions?.width ?? sheet.spriteWidth,
        renderDimensions?.height ?? sheet.spriteHeight
    );
    context.restore();
}