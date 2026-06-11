export function mulberry32(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function combineSeed(...parts: number[]): number {
  let hash = 0;
  for (const part of parts) {
    hash = (hash * 31 + (part >>> 0)) >>> 0;
  }
  return hash || 1;
}

export function pickRandom<T>(items: readonly T[], rng: () => number): T {
  return items[Math.floor(rng() * items.length)];
}

export function pickNUnique<T>(items: readonly T[], count: number, rng: () => number): T[] {
  const pool = [...items];
  const result: T[] = [];
  for (let i = 0; i < count && pool.length > 0; i++) {
    const idx = Math.floor(rng() * pool.length);
    result.push(pool.splice(idx, 1)[0]);
  }
  return result;
}

export function generateRunSeed(): number {
  return (Date.now() ^ (Math.random() * 0xffffffff)) >>> 0;
}
