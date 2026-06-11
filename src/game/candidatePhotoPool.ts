import type { CandidateGender } from './types';

export const FEMALE_PHOTO_POOL = [
  '/candidates/placeholder-female-01.png',
  '/candidates/placeholder-female-02.png',
  '/candidates/placeholder-female-03.png',
] as const;

export const MALE_PHOTO_POOL = [
  '/candidates/placeholder-male-01.png',
  '/candidates/placeholder-male-02.png',
  '/candidates/placeholder-male-03.png',
] as const;

const sessionAssignments = new Map<string, string>();

export function resetCandidatePhotoPool(): void {
  sessionAssignments.clear();
}

export function pickPoolPhoto(candidateId: string, gender: CandidateGender): string {
  const cached = sessionAssignments.get(candidateId);
  if (cached) return cached;

  const pool = gender === 'female' ? FEMALE_PHOTO_POOL : MALE_PHOTO_POOL;
  const pick = pool[Math.floor(Math.random() * pool.length)];
  sessionAssignments.set(candidateId, pick);
  return pick;
}
