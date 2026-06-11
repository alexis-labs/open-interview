import type { Candidate } from '../types';
import { generateDayCandidates } from '../engine/candidateGenerator';
import { CHARACTERS } from './story';

export const TOTAL_DAYS = 10;

export interface DayConfig {
  id: number;
  title: string;
  subtitle: string;
  memoSubject: string;
  activeRuleIds: number[];
  candidateCount: number;
  salaryCap: number;
  maxMistakesToPass: number;
  startingMoney: number;
  briefing: string[];
  newRuleIds: number[];
  /** Fraction of candidates that should be clean (0-1). Lower = harder. */
  cleanRate: number;
}

function briefingForDay(id: number): string[] {
  const boss = `From: ${CHARACTERS.boss.name}`;
  if (id === 1) {
    return [
      boss,
      'Two rules only: names must match, and roles must be approved.',
      'This is the small blind. Learn the table before Brenda raises it.',
      'Three errors max. Stamp HIRE when clean, REJECT when not.',
    ];
  }
  if (id === 2) {
    return [
      boss,
      'New rule: ID badges must be valid.',
      'Three rules total. Same booth, slightly sharper teeth.',
      'Three errors max to continue the run.',
    ];
  }
  if (id === 3) {
    return [
      boss,
      'New rule: resumes must show enough experience.',
      'Four rules. Brenda upgraded your anxiety to premium.',
      'Two errors max. Do not embarrass me.',
    ];
  }
  if (id === 4) {
    return [
      boss,
      'New rule: verified reference companies only.',
      'Five candidates, five rules. The queue is learning your habits.',
      'Two errors max. Read the letterhead.',
    ];
  }
  if (id === 5) {
    return [
      boss,
      'New rule: resume position must match application.',
      'Six rules total. Cross-checks are now part of the job.',
      'Two errors max. Gary would have asked for a glossary.',
    ];
  }
  if (id === 6) {
    return [
      boss,
      'New rule: salary cap enforced. All seven rules are active.',
      'This is the first real audit. Clean files are no longer polite.',
      'Two errors max. Payroll is watching.',
    ];
  }
  if (id === 7) {
    return [
      boss,
      'No new rule. Higher stake.',
      'Seven rules, thinner budget, fewer clean files.',
      'One error max. Brenda starts hovering at lunch.',
    ];
  }
  if (id === 10) {
    return [
      `${boss} - URGENT`,
      'Final shift. Zero errors allowed. Budget is razor-thin.',
      'Survive this and you earn the Golden Stapler. Maybe.',
    ];
  }
  return [
    boss,
    `Day ${id} of ${TOTAL_DAYS}. Rules unchanged - your budget is not.`,
    'Read every document. Brenda brought binoculars again.',
  ];
}

export const DAYS: DayConfig[] = [
  {
    id: 1,
    title: 'Orientation',
    subtitle: 'Gary\'s chair still spins. Try not to think about it.',
    memoSubject: 'RE: Booth 3 Orientation - Small Blind',
    activeRuleIds: [1, 2],
    candidateCount: 3,
    salaryCap: 120000,
    maxMistakesToPass: 3,
    startingMoney: 74,
    newRuleIds: [1, 2],
    cleanRate: 0.68,
    briefing: briefingForDay(1),
  },
  {
    id: 2,
    title: 'Badge Check',
    subtitle: 'ID badges enter the stack',
    memoSubject: 'RE: Badge Check - First Raise',
    activeRuleIds: [1, 2, 3],
    candidateCount: 4,
    salaryCap: 115000,
    maxMistakesToPass: 3,
    startingMoney: 70,
    newRuleIds: [3],
    cleanRate: 0.6,
    briefing: briefingForDay(2),
  },
  {
    id: 3,
    title: 'Experience',
    subtitle: 'The resume starts mattering',
    memoSubject: 'RE: Experience Shift - Mind the Gap',
    activeRuleIds: [1, 2, 3, 4],
    candidateCount: 5,
    salaryCap: 110000,
    maxMistakesToPass: 2,
    startingMoney: 64,
    newRuleIds: [4],
    cleanRate: 0.54,
    briefing: briefingForDay(3),
  },
  {
    id: 4,
    title: 'References',
    subtitle: 'Verified companies only',
    memoSubject: 'RE: Reference Shift - Trust But Invoice',
    activeRuleIds: [1, 2, 3, 4, 5],
    candidateCount: 5,
    salaryCap: 105000,
    maxMistakesToPass: 2,
    startingMoney: 60,
    newRuleIds: [5],
    cleanRate: 0.5,
    briefing: briefingForDay(4),
  },
  {
    id: 5,
    title: 'Cross-Check',
    subtitle: 'Resume must match application',
    memoSubject: 'RE: Cross-Check Shift - Same Story Twice',
    activeRuleIds: [1, 2, 3, 4, 5, 6],
    candidateCount: 6,
    salaryCap: 100000,
    maxMistakesToPass: 2,
    startingMoney: 56,
    newRuleIds: [6],
    cleanRate: 0.46,
    briefing: briefingForDay(5),
  },
  {
    id: 6,
    title: 'Salary Cap',
    subtitle: 'All rules active',
    memoSubject: 'RE: Salary Cap - Payroll Gets Teeth',
    activeRuleIds: [1, 2, 3, 4, 5, 6, 7],
    candidateCount: 6,
    salaryCap: 95000,
    maxMistakesToPass: 2,
    startingMoney: 52,
    newRuleIds: [7],
    cleanRate: 0.42,
    briefing: briefingForDay(6),
  },
  {
    id: 7,
    title: 'Audit',
    subtitle: 'The stake rises',
    memoSubject: 'RE: Audit Shift - One Bad Stamp',
    activeRuleIds: [1, 2, 3, 4, 5, 6, 7],
    candidateCount: 6,
    salaryCap: 90000,
    maxMistakesToPass: 1,
    startingMoney: 50,
    newRuleIds: [],
    cleanRate: 0.38,
    briefing: briefingForDay(7),
  },
  {
    id: 8,
    title: 'Crunch',
    subtitle: 'One mistake away from Brenda',
    memoSubject: 'RE: Crunch Shift - Precision Required',
    activeRuleIds: [1, 2, 3, 4, 5, 6, 7],
    candidateCount: 7,
    salaryCap: 88000,
    maxMistakesToPass: 1,
    startingMoney: 48,
    newRuleIds: [],
    cleanRate: 0.34,
    briefing: briefingForDay(8),
  },
  {
    id: 9,
    title: 'Penultimate',
    subtitle: 'Almost at the end',
    memoSubject: 'RE: Penultimate Shift - Do Not Slip',
    activeRuleIds: [1, 2, 3, 4, 5, 6, 7],
    candidateCount: 7,
    salaryCap: 88000,
    maxMistakesToPass: 1,
    startingMoney: 48,
    newRuleIds: [],
    cleanRate: 0.31,
    briefing: briefingForDay(9),
  },
  {
    id: 10,
    title: 'Final Audit',
    subtitle: 'Brenda brought binoculars',
    memoSubject: 'RE: Final Audit - Zero Tolerance',
    activeRuleIds: [1, 2, 3, 4, 5, 6, 7],
    candidateCount: 8,
    salaryCap: 85000,
    maxMistakesToPass: 0,
    startingMoney: 45,
    newRuleIds: [],
    cleanRate: 0.28,
    briefing: briefingForDay(10),
  },
];

export function getDayConfig(dayId: number): DayConfig {
  const day = DAYS.find((d) => d.id === dayId);
  if (!day) throw new Error(`Unknown day: ${dayId}`);
  return day;
}

export interface GetDayCandidatesOptions {
  runSeed: number;
  forceFirstClean?: boolean;
  forceFirstTutorial?: boolean;
}

export function getDayCandidates(dayId: number, options: GetDayCandidatesOptions): Candidate[] {
  const day = getDayConfig(dayId);
  return generateDayCandidates(day, options.runSeed, {
    forceFirstClean: options.forceFirstClean,
    forceFirstTutorial: options.forceFirstTutorial,
  });
}

export function canUnlockNextDay(dayId: number, mistakes: number, survived: boolean): boolean {
  if (!survived) return false;
  const day = getDayConfig(dayId);
  return mistakes <= day.maxMistakesToPass;
}
