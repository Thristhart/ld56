import testingEntities from '../levels/testing.entities?raw';
import testingGround from '../levels/testing.ground?raw';

export function startLevel(levelname: keyof typeof levels) {
    const level = new LevelContent(levelname)
    currentLevel = level;
}

export function endLevel() {

}

interface LevelDescription {
    entities: string;
    ground: string;
}

export let currentLevel: LevelContent | undefined;

export const levels = {
    testing: {
        entities: testingEntities,
        ground: testingGround,
    }
} as const satisfies Record<string, LevelDescription>;

export type TerrainType = 'ground' | 'water' | 'wall' | 'chasm' | 'tunnel';
export type EntityType = 'empty' | 'mouse' | 'turtle' | 'bird' | 'frog' | 'goal' | 'boulder';

// first number is row
// second number is column
export type IGridMap<T> = Map<number, Map<number, T>>;

export class LevelContent {
    private numRows: number;
    private numColumns: number;
    private groundGrid: IGridMap<TerrainType> = new Map();
    private entitiesGrid: IGridMap<EntityType> = new Map();

    constructor(levelname: keyof typeof levels) {
        const level = levels[levelname];
        const ground = level.ground;

        const groundRows = ground.split('\r\n');
        this.numRows = groundRows.length;
        this.numColumns = groundRows[0].trim().split(',').length

        // parse initial ground
        for (const groundRowIndex in groundRows) {
            const terrainRowMap: Map<number, TerrainType> = new Map();
            const tiles = groundRows[groundRowIndex].split(',');
            if (this.numColumns !== tiles.length) {
                console.log('WARNING: MISMATCHED GROUND COLUMNS');
            }

            for (const tileIndex in tiles) {
                const terrainTile = GetTerrainType(tiles[tileIndex]);
                terrainRowMap.set(parseInt(tileIndex), terrainTile)
            }
            this.groundGrid.set(parseInt(groundRowIndex), terrainRowMap)
        }


        // parse initial entities
        const entities = level.entities;

        const entityRows = entities.split('\n');
        for (const entityRowIndex in entityRows) {
            const entityRowMap: Map<number, EntityType> = new Map();
            const entityTiles = entityRows[entityRowIndex].split(',');
            if (this.numColumns !== entityTiles.length) {
                console.log('WARNING: MISMATCHED ENTITY COLUMNS');
            }

            for (const entityTileIndex in entityTiles) {
                const entityTile = GetEntityType(entityTiles[entityTileIndex]);
                entityRowMap.set(parseInt(entityTileIndex), entityTile)
            }
            this.entitiesGrid.set(parseInt(entityRowIndex), entityRowMap)
        }
    }

    get rows(): number { return this.numRows }
    get columns(): number { return this.numColumns }
    get ground(): IGridMap<TerrainType> { return this.groundGrid }
    get entities(): IGridMap<EntityType> { return this.entitiesGrid }
}

function GetTerrainType(terrainCode: string): TerrainType {
    const strippedCode = terrainCode.trim();
    switch (strippedCode) {
        case 'W': return 'water';
        case 'X': return 'wall';
        case 'W': return 'chasm';
        case 'W': return 'tunnel';
        default: return 'ground';
    }
}

function GetEntityType(entityCode: string) {
    const strippedCode = entityCode.trim();
    switch (strippedCode) {
        case '1': return 'mouse';
        case '2': return 'turtle';
        case '3': return 'bird';
        case '4': return 'frog';
        default: return 'empty';
    }
}