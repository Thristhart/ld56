export type CircuitType = 'button' | 'bridge' | 'door';
export type TerrainType = CircuitType | 'ground' | 'water' | 'wall' | 'chasm' | 'tunnel';
export const creatures = ['mouse', 'turtle', 'bird', 'frog'] as const;
export type CreatureType = typeof creatures[number];
export type EntityType = CreatureType | 'empty' | 'goal' | 'boulder';

export function GetEntityType(entityCode: string) {
    const strippedCode = entityCode.trim();
    switch (strippedCode) {
        case 'M': return 'mouse';
        case 'T': return 'turtle';
        case 'B': return 'bird';
        case 'F': return 'frog';
        case 'R': return 'boulder';
        case 'G': return 'goal';
        default: return 'empty';
    }
}

export function GetTerrainType(terrainCode: string): TerrainType {
    const strippedCode = terrainCode.trim();
    switch (strippedCode) {
        case 'W': return 'water';
        case 'X': return 'wall';
        case 'C': return 'chasm';
        case 'T': return 'tunnel';
        case 'B': return 'button';
        case 'H': return 'bridge';
        case 'D': return 'door';
        default: return 'ground';
    }
}

export function IsCreatureEntity(entity: EntityType) {
    return entity === 'mouse' || entity === 'turtle' || entity === 'bird' || entity === 'frog';
}