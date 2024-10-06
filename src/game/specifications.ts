export type CircuitType = 'button' | 'bridge' | 'door';
export type BoulderTypes = 'boulder-chasm' | 'boulder-water';
export type TerrainType = BoulderTypes | CircuitType | 'ground' | 'water' | 'wall' | 'chasm' | 'tunnel' | 'goal';
export const creatures = ['mouse', 'turtle', 'bird', 'frog'] as const;
export type CreatureType = typeof creatures[number];
export type EntityType = CreatureType | 'empty' | 'boulder' | 'insect';

export function GetEntityType(entityCode: string) {
    const strippedCode = entityCode.trim();
    switch (strippedCode) {
        case 'M': return 'mouse';
        case 'T': return 'turtle';
        case 'B': return 'bird';
        case 'F': return 'frog';
        case 'R': return 'boulder';
        case 'I': return 'insect';
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
        case 'G': return 'goal';
        default: return 'ground';
    }
}

export function IsCreatureEntity(entity: EntityType) {
    return entity === 'mouse' || entity === 'turtle' || entity === 'bird' || entity === 'frog';
}