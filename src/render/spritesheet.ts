export interface SpriteSheet {
    readonly image: HTMLImageElement;
    readonly spriteWidth: number;
    readonly spriteHeight: number;
    readonly width: number;
    readonly height: number;
}

export interface SpriteAnimation {
    readonly spritesheet: SpriteSheet;
    readonly getFrame: (timestamp: number) => readonly [x: number, y: number];
}

export function drawSprite(
    context: CanvasRenderingContext2D,
    sheet: SpriteSheet,
    x: number,
    y: number,
    frame: readonly [x: number, y: number],
    renderDimensions?: { width: number; height: number }
) {
    context.drawImage(
        sheet.image,
        frame[0] * sheet.spriteWidth,
        frame[1] * sheet.spriteHeight,
        sheet.spriteWidth,
        sheet.spriteHeight,
        x,
        y,
        renderDimensions?.width ?? sheet.spriteWidth,
        renderDimensions?.height ?? sheet.spriteHeight
    );
}