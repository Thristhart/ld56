import testingEntities from '../levels/testing/testing.entities?raw';
import testingTerrain from '../levels/testing/testing.terrain?raw';
import testingCircuit from '../levels/testing/testing.circuit?raw';

import circuitTestingEntities from '../levels/testing/circuittest.entities?raw';
import circuitTestingTerrain from '../levels/testing/circuittest.terrain?raw';
import circuitTestingCircuit from '../levels/testing/circuittest.circuit?raw';

import cutsceneTerrain from '../levels/cutscene.terrain?raw';

import flower1Terrain from '../levels/turtle_mouse/flower_1/flower_1.terrain?raw';
import flower1Entities from '../levels/turtle_mouse/flower_1/flower_1.entities?raw';
import flower1Circuit from '../levels/turtle_mouse/flower_1/flower_1.circuit?raw';

import flower2Terrain from '../levels/frog_bird/flower_2/flower_2.terrain?raw';
import flower2Entities from '../levels/frog_bird/flower_2/flower_2.entities?raw';
import flower2Circuit from '../levels/frog_bird/flower_2/flower_2.circuit?raw';

import boulderPondTerrain from '../levels/turtle_mouse/boulder_pond/boulder_pond.terrain?raw';
import boulderPondEntities from '../levels/turtle_mouse/boulder_pond/boulder_pond.entities?raw';
import boulderPondCircuit from '../levels/turtle_mouse/boulder_pond/boulder_pond.circuit?raw';

import riverCrossingTerrain from "../levels/frog_bird/river_crossing/river_crossing.terrain?raw";
import riverCrossingEntities from "../levels/frog_bird/river_crossing/river_crossing.entities?raw";
import riverCrossingCircuit from "../levels/frog_bird/river_crossing/river_crossing.circuit?raw";

import superBoulderAdventureTerrain from "../levels/frog_bird/super_boulder_adventure/super_boulder_adventure.terrain?raw";
import superBoulderAdventureEntities from "../levels/frog_bird/super_boulder_adventure/super_boulder_adventure.entities?raw";
import superBoulderAdventureCircuit from "../levels/frog_bird/super_boulder_adventure/super_boulder_adventure.circuit?raw";

import lastTurtleTerrain from "../levels/turtle_mouse/last_turtle/last_turtle.terrain?raw";
import lastTurtleEntities from "../levels/turtle_mouse/last_turtle/last_turtle.entities?raw";
import lastTurtleCircuit from "../levels/turtle_mouse/last_turtle/last_turtle.circuit?raw";

import { clearActions } from './actions';
import { EntityType, GetEntityType, GetTerrainType, IsCreatureEntity, TerrainType } from './specifications';

export function startLevel(levelname: keyof typeof levels) {
    const level = constructLevelContent(levelname);
    initialLevelState = level;
    currentLevelState = level;
    clearActions();
}

export function endLevel() {

}

interface LevelDescription {
    terrain: string;
    entities?: string;
    circuit?: string;
}

export let initialLevelState: LevelContent | undefined;
export function setCurrentLevelState(newState: LevelContent | undefined) {
    currentLevelState = newState;
}
export let currentLevelState: LevelContent | undefined;

export const levels = {
    cutscene: {
        terrain: cutsceneTerrain,
        entities: undefined,
        circuit: undefined,
    },
    testing: {
        entities: testingEntities,
        terrain: testingTerrain,
        circuit: testingCircuit,
    },
    circuittesting: {
        entities: circuitTestingEntities,
        terrain: circuitTestingTerrain,
        circuit: circuitTestingCircuit,
    },
    flower1: {
        entities: flower1Entities,
        terrain: flower1Terrain,
        circuit: flower1Circuit,
    },
    flower2: {
        entities: flower2Entities,
        terrain: flower2Terrain,
        circuit: flower2Circuit,
    },
    boulderPond: {
        entities: boulderPondEntities,
        terrain: boulderPondTerrain,
        circuit: boulderPondCircuit,
    },
    riverCrossing: {
        entities: riverCrossingEntities,
        terrain: riverCrossingTerrain,
        circuit: riverCrossingCircuit,
    },
    superBoulderAdventure: {
        entities: superBoulderAdventureEntities,
        terrain: superBoulderAdventureTerrain,
        circuit: superBoulderAdventureCircuit,
    },
    lastTurtle: {
        entities: lastTurtleEntities,
        terrain: lastTurtleTerrain,
        circuit: lastTurtleCircuit,
    },
} as const satisfies Record<string, LevelDescription>;

export interface EntityData {
    type: EntityType;
    location: Location;
    id: number;
    facing: "left" | "right";
}
export interface Location {
    row: number;
    column: number;
}

export interface ActivationElement {
    location: Location;
    id: number;
    isActive: boolean
}

export interface ResponsiveElement {
    location: Location;
    id: number;
}

export interface CircuitData {
    circuitId: number;
    activationElements: ActivationElement[],
    responsiveElements: ResponsiveElement[],
}

// first number is row
// second number is column
export interface LevelContent {
    levelName: keyof typeof levels,
    rows: number;
    columns: number;
    readonly groundGrid: TerrainType[][];
    readonly entities: EntityData[];
    circuits: CircuitData[];
    currentEntityId: number;
    canContinueLevel: boolean;
}

let gEntityId = 1;
function getEntityId() {
    return gEntityId++;
}

function constructLevelContent(levelname: keyof typeof levels) {
    const level = levels[levelname];
    const ground = level.terrain;

    const levelContent: LevelContent = {
        levelName: levelname,
        rows: 0,
        columns: 0,
        groundGrid: [],
        entities: [],
        circuits: [],
        currentEntityId: 0,
        canContinueLevel: true
    }

    const groundRows = ground.replace(/ |\t/g, "").trim().split(/\r?\n|\r|\n/g);
    levelContent.rows = groundRows.length;
    levelContent.columns = groundRows[0].trim().split('').length

    // parse initial ground
    for (const groundRowIndex in groundRows) {
        const terrainRowMap: Array<TerrainType> = [];
        const tiles = groundRows[groundRowIndex].split('');
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
    const entityRows = level.entities?.replace(/ |\t/g, "").trim().split(/\r?\n|\r|\n/g) ?? [];
    for (const entityRowIndex in entityRows) {
        const entityTiles = entityRows[entityRowIndex].split('');
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
                        id: entityID,
                        facing: (entityTile === "bird" || entityTile === "frog") ? "left" : "right"
                    }
                )
                if (!levelContent.currentEntityId && IsCreatureEntity(entityTile)) {
                    levelContent.currentEntityId = entityID;
                }
            }
        }
    }


    // parse initial circuits
    const circuitRows = level.circuit?.replace(/ |\t/g, "").trim().split(/\r?\n|\r|\n/g) ?? [];
    for (const circuitRowIndex in circuitRows) {
        const circuits = circuitRows[circuitRowIndex].split('');
        if (levelContent.columns !== circuits.length) {
            console.log('WARNING: MISMATCHED CIRCUIT COLUMNS');
        }

        for (const circuitColumnIndex in circuits) {
            const circuitId = parseInt(circuits[circuitColumnIndex]);
            if (!isNaN(circuitId)) {
                let existingCircuit = levelContent.circuits.find((circuit) => circuit.circuitId === circuitId);
                if (!existingCircuit) {
                    existingCircuit = {
                        circuitId: circuitId,
                        activationElements: [],
                        responsiveElements: []
                    };

                    levelContent.circuits.push(existingCircuit);
                }

                const location = {
                    row: parseInt(circuitRowIndex),
                    column: parseInt(circuitColumnIndex)
                };

                const terrainType = GetTileAtLocation(levelContent, location);
                if (terrainType == 'button') {
                    const entities = GetEntitiesAtLocation(levelContent, location);

                    existingCircuit.activationElements.push({
                        location: {
                            row: parseInt(circuitRowIndex),
                            column: parseInt(circuitColumnIndex)
                        },
                        id: getEntityId(),
                        isActive: entities.length > 0,
                    })
                }
                else if (terrainType === 'door' || terrainType === 'bridge') {
                    existingCircuit.responsiveElements.push({
                        location: {
                            row: parseInt(circuitRowIndex),
                            column: parseInt(circuitColumnIndex)
                        },
                        id: getEntityId(),
                    })
                }
                else {
                    console.log(` WARNING INCORRECT TERRAIN ELEMENT FOR CIRCUIT at row: ${location.row} and column: ${location.column}`)
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

export function GetCircuitActivationElementAtLocation(level: LevelContent, location: Location) {
    for (const circuit of level.circuits) {
        for (const activationElement of circuit.activationElements) {
            if (activationElement.location.column === location.column && activationElement.location.row === location.row) {
                return { circuit: circuit, element: activationElement }
            }
        }
    }

    return null;
}


export function GetCircuitResponseElementAtLocation(level: LevelContent, location: Location) {
    for (const circuit of level.circuits) {
        for (const responseElement of circuit.responsiveElements) {
            if (responseElement.location.column === location.column && responseElement.location.row === location.row) {
                const activationState = circuit.activationElements.find((activationElement) => activationElement.isActive);
                return { circuit: circuit, element: responseElement, isActive: Boolean(activationState) }
            }
        }
    }

    return null;
}


