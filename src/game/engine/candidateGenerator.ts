import type { DayConfig } from '../data/days';
import { UNVERIFIED_COMPANIES, VERIFIED_COMPANIES } from '../data/companyPools';
import {
  FIRST_NAMES_FEMALE,
  FIRST_NAMES_MALE,
  LAST_NAMES,
  NAME_PREFIXES,
  UNAPPROVED_POSITIONS,
} from '../data/namePools';
import { fillTemplate, REFERENCE_BLURB_TEMPLATES, WAITING_QUIPS } from '../data/quipPools';
import {
  EDUCATION_LEVELS,
  REFERRER_FIRST_NAMES,
  REFERRER_RELATIONSHIPS,
  SKILLS_BY_POSITION,
} from '../data/skillPools';
import {
  APPROVED_POSITIONS,
  GAME_DATE,
  POSITION_MIN_EXPERIENCE,
} from '../data/positions';
import type { Candidate, CandidateGender, Position } from '../types';
import { evaluateCandidate } from './ruleEngine';
import { combineSeed, mulberry32, pickNUnique, pickRandom } from './rng';

export { generateRunSeed } from './rng';

interface GenerateOptions {
  forceFirstClean?: boolean;
  forceFirstTutorial?: boolean;
}

function formatFullName(prefix: string, first: string, last: string): string {
  return prefix ? `${prefix} ${first} ${last}` : `${first} ${last}`;
}

function addDays(isoDate: string, days: number): string {
  const d = new Date(isoDate + 'T12:00:00');
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

function padBadge(num: number): string {
  return `OC-${String(num).padStart(5, '0')}`;
}

function buildCleanCandidate(
  index: number,
  day: DayConfig,
  rng: () => number,
): Candidate {
  const gender: CandidateGender = rng() < 0.5 ? 'female' : 'male';
  const first = pickRandom(gender === 'female' ? FIRST_NAMES_FEMALE : FIRST_NAMES_MALE, rng);
  const last = pickRandom(LAST_NAMES, rng);
  const prefix = pickRandom(NAME_PREFIXES, rng);
  const fullName = formatFullName(prefix, first, last);

  const position = pickRandom(APPROVED_POSITIONS, rng) as Position;
  const minExp = POSITION_MIN_EXPERIENCE[position];
  const yearsExperience = minExp + Math.floor(rng() * 4);
  const verifiedCompany = pickRandom(VERIFIED_COMPANIES, rng);
  const lastEmployer = verifiedCompany;

  const skillPool = SKILLS_BY_POSITION[position];
  const skillCount = 2 + Math.floor(rng() * 3);
  const skills = pickNUnique(skillPool, skillCount, rng);

  const salaryBase = Math.floor(60000 + rng() * 25000);
  const salaryExpectation = Math.min(salaryBase, day.salaryCap - 5000);

  const issueDate = addDays(GAME_DATE, -365 - Math.floor(rng() * 400));
  const expiryDate = addDays(GAME_DATE, 180 + Math.floor(rng() * 500));
  const dateApplied = addDays(GAME_DATE, -Math.floor(rng() * 5));
  const recommendationDate = addDays(GAME_DATE, -7 - Math.floor(rng() * 20));

  const hour = 9 + Math.floor(index * 0.5);
  const minute = (index % 2) * 30;
  const interviewSlot = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')} AM — Booth 3`;

  const referrerFirst = pickRandom(REFERRER_FIRST_NAMES, rng);
  const referrerLast = pickRandom(LAST_NAMES, rng);
  const referrerName = `${referrerFirst} ${referrerLast}`;

  const id = `gen-d${day.id}-i${index}-${first.toLowerCase()}-${last.toLowerCase()}`;

  const quip = pickRandom(WAITING_QUIPS, rng);
  const blurbTemplate = pickRandom(REFERENCE_BLURB_TEMPLATES, rng);
  const referenceBlurb = fillTemplate(blurbTemplate, { name: first, company: lastEmployer });

  const workYears1 = Math.max(1, yearsExperience - 1 - Math.floor(rng() * 2));
  const workYears2 = yearsExperience - workYears1;

  return {
    id,
    gender,
    isTutorial: false,
    waitingQuip: quip,
    referenceBlurb,
    application: {
      type: 'application',
      fullName,
      position,
      dateApplied,
      interviewSlot,
      salaryExpectation,
    },
    idBadge: {
      type: 'idBadge',
      fullName,
      badgeNumber: padBadge(10000 + Math.floor(rng() * 89999)),
      issueDate,
      expiryDate,
      photoId: `${first[0]}${last[0]}-${String(index).padStart(3, '0')}`,
    },
    resume: {
      type: 'resume',
      fullName,
      yearsExperience,
      position,
      skills,
      lastEmployer,
      education: pickRandom(EDUCATION_LEVELS.slice(0, 3), rng),
      workHistory: [
        { company: lastEmployer, role: position, years: workYears1 },
        { company: pickRandom(VERIFIED_COMPANIES.filter((c) => c !== lastEmployer), rng), role: position, years: workYears2 },
      ],
      certifications: rng() > 0.5 ? ['Industry Certification'] : [],
    },
    reference: {
      type: 'reference',
      candidateName: fullName,
      referrerName,
      referrerCompany: verifiedCompany,
      relationship: pickRandom(REFERRER_RELATIONSHIPS, rng),
      recommendationDate,
    },
  };
}

type ViolationKind = 1 | 2 | 3 | 4 | 5 | 6 | 7;

function applyViolation(candidate: Candidate, kind: ViolationKind, day: DayConfig, rng: () => number): void {
  switch (kind) {
    case 1: {
      const doc = Math.floor(rng() * 3);
      const altLast = pickRandom(LAST_NAMES.filter((n) => n !== candidate.application.fullName.split(' ').pop()), rng);
      const parts = candidate.application.fullName.split(' ');
      const typoName = parts.length > 2
        ? `${parts[0]} ${parts[1]} ${altLast}`
        : `${parts[0]} ${altLast}`;
      if (doc === 0) candidate.idBadge.fullName = typoName;
      else if (doc === 1) candidate.resume.fullName = typoName;
      else candidate.reference.candidateName = typoName;
      break;
    }
    case 2:
      candidate.application.position = pickRandom(UNAPPROVED_POSITIONS, rng);
      break;
    case 3:
      candidate.idBadge.expiryDate = addDays(GAME_DATE, -30 - Math.floor(rng() * 200));
      break;
    case 4: {
      const pos = candidate.application.position as Position;
      if ((APPROVED_POSITIONS as string[]).includes(pos)) {
        const min = POSITION_MIN_EXPERIENCE[pos];
        candidate.resume.yearsExperience = Math.max(0, min - 1 - Math.floor(rng() * 2));
      }
      break;
    }
    case 5:
      candidate.reference.referrerCompany = pickRandom(UNVERIFIED_COMPANIES, rng);
      break;
    case 6: {
      const alt = APPROVED_POSITIONS.filter((p) => p !== candidate.application.position);
      candidate.resume.position = pickRandom(alt, rng);
      break;
    }
    case 7:
      candidate.application.salaryExpectation = day.salaryCap + 5000 + Math.floor(rng() * 15000);
      break;
  }
}

function injectViolations(
  candidate: Candidate,
  day: DayConfig,
  rng: () => number,
  violationCount: number,
): void {
  const active = day.activeRuleIds.filter((id): id is ViolationKind => id >= 1 && id <= 7);
  const kinds = pickNUnique(active, Math.min(violationCount, active.length), rng);
  for (const kind of kinds) {
    applyViolation(candidate, kind, day, rng);
  }
}

function validateCandidate(candidate: Candidate, day: DayConfig): boolean {
  const violations = evaluateCandidate(candidate, {
    activeRuleIds: day.activeRuleIds,
    salaryCap: day.salaryCap,
  });
  return violations.length === 0;
}

function getViolationCount(day: DayConfig, rng: () => number): number {
  const secondViolationChance = Math.min(0.18 + day.id * 0.045, 0.58);
  const thirdViolationChance = day.id >= 8 ? 0.18 : day.id >= 6 ? 0.08 : 0;
  let count = 1;

  if (rng() < secondViolationChance) count++;
  if (rng() < thirdViolationChance) count++;

  return count;
}

function generateOneCandidate(
  index: number,
  day: DayConfig,
  runSeed: number,
  shouldBeClean: boolean,
): Candidate {
  const seed = combineSeed(runSeed, day.id, index, shouldBeClean ? 0 : 1);
  let attempts = 0;

  while (attempts < 20) {
    const rng = mulberry32(seed + attempts);
    const candidate = buildCleanCandidate(index, day, rng);

    if (!shouldBeClean) {
      const violationCount = getViolationCount(day, rng);
      injectViolations(candidate, day, rng, violationCount);
    }

    const violations = evaluateCandidate(candidate, {
      activeRuleIds: day.activeRuleIds,
      salaryCap: day.salaryCap,
    });
    const isClean = violations.length === 0;

    if (shouldBeClean && isClean) return candidate;
    if (!shouldBeClean && !isClean) return candidate;
    if (shouldBeClean && !isClean && attempts > 10) return buildCleanCandidate(index, day, mulberry32(seed + 99));

    attempts++;
  }

  const fallback = buildCleanCandidate(index, day, mulberry32(seed));
  if (!shouldBeClean) injectViolations(fallback, day, mulberry32(seed + 1), 1);
  return fallback;
}

export function generateDayCandidates(
  day: DayConfig,
  runSeed: number,
  options: GenerateOptions = {},
): Candidate[] {
  const candidates: Candidate[] = [];

  for (let i = 0; i < day.candidateCount; i++) {
    const forceClean = (options.forceFirstClean && i === 0) || false;
    const rng = mulberry32(combineSeed(runSeed, day.id, i, 42));
    const shouldBeClean = forceClean || rng() < day.cleanRate;

    let candidate = generateOneCandidate(i, day, runSeed, shouldBeClean);

    if (forceClean) {
      let safety = 0;
      while (!validateCandidate(candidate, day) && safety < 15) {
        candidate = generateOneCandidate(i, day, runSeed + safety + 1000, true);
        safety++;
      }
      candidate = { ...candidate, isTutorial: options.forceFirstTutorial ?? false };
    }

    candidates.push(candidate);
  }

  return candidates;
}
