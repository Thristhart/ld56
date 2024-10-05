import testingEntities from '../levels/testing.entities?raw';
import testingGround from '../levels/testing.ground?raw';

export function startLevel(levelname: keyof typeof levels) {
    const level = constructLevelContent(levelname)
    currentLevel = level;
    currentLevelState = level;
}

export function endLevel() {

}

interface LevelDescription {
    entities: string;
    ground: string;
}

export let currentLevel: LevelContent | undefined;
export function setCurrentLevelState(newState: LevelContent | undefined) {
    currentLevelState = newState;
}
export let currentLevelState: LevelContent | undefined;

export const levels = {
    testing: {
        entities: testingEntities,
        ground: testingGround,
    }
} as const satisfies Record<string, LevelDescription>;

export type TerrainType = 'ground' | 'water' | 'wall' | 'chasm' | 'tunnel';
export type CreatureType = 'mouse' | 'turtle' | 'bird' | 'frog'
export type EntityType = CreatureType | 'empty' | 'goal' | 'boulder';
export interface EntityData {
    type: EntityType;
    location: Location;
    id: number;
}
export interface Location {
    row: number;
    column: number;
}

// first number is row
// second number is column
export type IGridMap<T> = T[][];

export interface LevelContent {
    rows: number;
    columns: number;
    readonly groundGrid: IGridMap<TerrainType>;
    readonly entities: EntityData[];
    currentEntityId: number;
}

let gEntityId = 1;
function getEntityId() {
    return gEntityId++;
}

function constructLevelContent(levelname: keyof typeof levels) {
    const level = levels[levelname];
    const ground = level.ground;

    const levelContent: LevelContent = {
        rows: 0,
        columns: 0,
        groundGrid: [],
        entities: [],
        currentEntityId: 0,
    }

    const groundRows = ground.split(/\r?\n|\r|\n/g);
    levelContent.rows = groundRows.length;
    levelContent.columns = groundRows[0].trim().split(',').length

    // parse initial ground
    for (const groundRowIndex in groundRows) {
        const terrainRowMap: Array<TerrainType> = [];
        const tiles = groundRows[groundRowIndex].split(',');
        if (levelContent.columns !== tiles.length) {
            console.log('WARNING: MISMATCHED GROUND COLUMNS');
        }

        for (const tileIndex in tiles) {
            const terrainTile = GetTerrainType(tiles[tileIndex]);
            terrainRowMap[parseInt(tileIndex)] = terrainTile;
        }
        levelContent.groundGrid[parseInt(groundRowIndex)] = terrainRowMap;
    }


    // parse and set initial entities
    const entityRows = level.entities.split(/\r?\n|\r|\n/g);
    for (const entityRowIndex in entityRows) {
        const entityTiles = entityRows[entityRowIndex].split(',');
        if (levelContent.columns !== entityTiles.length) {
            console.log('WARNING: MISMATCHED ENTITY COLUMNS');
        }

        for (const entityTileIndex in entityTiles) {
            const entityTile = GetEntityType(entityTiles[entityTileIndex]);
            if (entityTile !== 'empty') {
                const entityID = getEntityId();
                levelContent.entities.push(
                    {
                        type: entityTile,
                        location: {
                            row: parseInt(entityRowIndex),
                            column: parseInt(entityTileIndex)
                        },
                        id: entityID
                    }
                )
                if (!levelContent.currentEntityId && IsCreatureEntity(entityTile)) {
                    levelContent.currentEntityId = entityID;
                }
            }
        }
    }

    return levelContent;
}

export function GetTileAtLocation(level: LevelContent, location: Location) {
    return level.groundGrid[location.row][location.column];
}

export function GetEntitiesAtLocation(level: LevelContent, location: Location) {
    return level.entities.filter(entity => entity.location.column === location.column && entity.location.row === location.row);
}

function GetTerrainType(terrainCode: string): TerrainType {
    const strippedCode = terrainCode.trim();
    switch (strippedCode) {
        case 'W': return 'water';
        case 'X': return 'wall';
        case 'C': return 'chasm';
        case 'T': return 'tunnel';
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
        case 'B': return 'boulder';
        case 'G': return 'goal';
        default: return 'empty';
    }
}

export function IsCreatureEntity(entity: EntityType) {
    return entity === 'mouse' || entity === 'turtle' || entity === 'bird' || entity === 'frog';
}