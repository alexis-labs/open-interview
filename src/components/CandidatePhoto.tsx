import { useEffect, useMemo, useState } from 'react';
import { FEMALE_PHOTO_POOL, MALE_PHOTO_POOL, pickPoolPhoto } from '../game/candidatePhotoPool';
import type { CandidateGender } from '../game/types';

interface CandidatePhotoProps {
  candidateId: string;
  gender: CandidateGender;
  alt: string;
  className?: string;
}

function nextPoolPhoto(gender: CandidateGender, current: string): string {
  const pool: string[] = [...(gender === 'female' ? FEMALE_PHOTO_POOL : MALE_PHOTO_POOL)];
  const index = pool.indexOf(current);
  return pool[(index + 1) % pool.length];
}

export function CandidatePhoto({ candidateId, gender, alt, className }: CandidatePhotoProps) {
  const assigned = useMemo(() => pickPoolPhoto(candidateId, gender), [candidateId, gender]);
  const [src, setSrc] = useState(assigned);

  useEffect(() => {
    setSrc(assigned);
  }, [assigned]);

  return (
    <img
      className={className}
      src={src}
      alt={alt}
      onError={() => {
        const fallback = nextPoolPhoto(gender, src);
        if (src !== fallback) setSrc(fallback);
      }}
    />
  );
}
