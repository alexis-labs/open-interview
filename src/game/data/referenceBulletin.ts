import {
  APPROVED_POSITIONS,
  GAME_DATE,
  POSITION_MIN_EXPERIENCE,
  VERIFIED_COMPANIES,
} from './positions';

export interface ReferenceBulletin {
  gameDate: string;
  approvedRoles: string[];
  minExperience: { role: string; years: number }[];
  verifiedCompanies: string[];
  salaryCap: number;
}

export function buildReferenceBulletin(salaryCap: number): ReferenceBulletin {
  return {
    gameDate: GAME_DATE,
    approvedRoles: [...APPROVED_POSITIONS],
    minExperience: APPROVED_POSITIONS.map((role) => ({
      role,
      years: POSITION_MIN_EXPERIENCE[role],
    })),
    verifiedCompanies: [...VERIFIED_COMPANIES],
    salaryCap,
  };
}
