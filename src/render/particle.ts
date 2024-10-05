
interface Particle {
    x: number;
    y: number;
    
}
interface ParticleSystem {
    particles: Array<Particle>;
}

export const particleSystems = new Map<number, ParticleSystem>();

