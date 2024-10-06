
interface Particle {
    x: number;
    y: number;
    lifetime?: number;
}
interface ParticleSystem {
    particles: Array<Particle>;
}

export const particleSystems = new Map<number, ParticleSystem>();

