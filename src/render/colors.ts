import { TerrainType } from "~/game/specifications";


export const COLOR_GRID_SQUARE_FILL_LIGHT = "hsl(171 12% 35%)";
export const COLOR_GRID_SQUARE_FILL_DARK = "hsl(171 12% 25%)";

export const COLOR_GRID_SQUARE_FILL_GROUND = "hsl(120 90% 50%)";
export const COLOR_GRID_SQUARE_FILL_WATER = "hsl(200 50% 50%)";
export const COLOR_GRID_SQUARE_FILL_WALL = "hsl(0 0% 35%)";
export const COLOR_GRID_SQUARE_FILL_CHASM = "hsl(0 0% 0%)";
export const COLOR_GRID_SQUARE_FILL_TUNNEL = "hsl(60, 67%, 24%)";

export const COLOR_CURRENT_CREATURE_HIGHLIGHT = "#FFEA00";
export const COLOR_GRID_LINE_LIGHT = "#1e1e1e";
export const COLOR_GRID_LINE_DARK = "black";

export function GetTerrainColor(terrainType: TerrainType) {
    switch (terrainType) {
        case 'ground': return COLOR_GRID_SQUARE_FILL_GROUND;
        case 'water': return COLOR_GRID_SQUARE_FILL_WATER;
        case 'wall': return COLOR_GRID_SQUARE_FILL_WALL;
        case 'chasm': return COLOR_GRID_SQUARE_FILL_CHASM;
        case 'tunnel': return COLOR_GRID_SQUARE_FILL_TUNNEL;
        default: return COLOR_GRID_SQUARE_FILL_WALL
    }
}