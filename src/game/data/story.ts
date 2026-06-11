export const CHARACTERS = {
  boss: { name: 'Brenda Kline', title: 'VP Talent Compliance', email: 'b.kline@opencorp.internal' },
  mentor: { name: 'Dana Brooks', title: 'Former Booth 3 Lead', note: 'Alice\'s ex-manager. Gary\'s best friend.' },
  predecessor: { name: 'Gary Mensch', fate: 'Transferred to "Special Projects" after approving a Blockchain Evangelist' },
} as const;

export const TITLE_LORE = {
  hook: 'Your predecessor vanished into a wellness offsite. The queue did not.',
  propaganda: '"People are our most depreciable asset." — OpenCorp Annual Report, p. 12',
  incident: 'Gary Mensch lasted 4 hours before HR found his badge in the coffee machine. You have been selected to replace him. Congratulations.',
} as const;

export const INTERCOM_MESSAGES = [
  'INTERCOM: Remember — a smile costs $0. A wrongful hire costs $4.2M in litigation.',
  'INTERCOM: Booth 3 coffee is for candidates who passed. You passed orientation. Barely.',
  'INTERCOM: Brenda is watching. She is always watching. She brought binoculars today.',
  'INTERCOM: Tip: If the reference letter sounds too nice, it\'s probably from their mom.',
  'INTERCOM: StealthStartup LLC is not on the verified list. Neither is your side hustle.',
  'INTERCOM: Fun fact: Gary\'s last hire listed "synergy" as a hard skill.',
  'INTERCOM: Please do not discuss unionization near the fluoro lights.',
  'INTERCOM: The UX Designer role was "sunsetted." Tom Bradley did not get the memo.',
  'INTERCOM: Payroll is your lifeline. Errors are Brenda\'s love language.',
  'INTERCOM: Booth 3 has a 94% turnover rate. You are the turnover.',
] as const;

export const LOCKED_RULE_TEASERS: Record<number, string> = {
  5: 'Unlocks Day 2 — verified references',
  6: 'Unlocks Day 3 — resume must match application',
  7: 'Unlocks Day 7 — salary cap',
};

export const CORRECT_TOASTS = [
  'COMPLIANCE OK — Brenda exhaled audibly',
  'CORRECT STAMP — Payroll credits your optimism',
  'POLICY ALIGNED — Candidate proceeds to awkward small talk',
  'NICE WORK — Gary would have stamped REJECT by accident',
  'CLEAN FILE — Dana Brooks would be proud (she\'s watching too)',
] as const;

export const WRONG_TOAST_PREFIXES = [
  'BRENDA SIGH DETECTED —',
  'POLICY VIOLATION —',
  'GARY MOMENT —',
  'AUDIT TRAIL REGRET —',
] as const;

const DEFAULT_EPILOGUE = {
  pass: 'Shift cleared. Brenda exhaled. The queue regenerates tomorrow.',
  fail: 'Brenda scheduled a "coaching conversation." It is on your calendar forever.',
};

export const DAY_EPILOGUES: Record<number, { pass: string; fail: string }> = {
  1: {
    pass: 'Brenda left a voicemail: "Not terrible for a Gary replacement." Dana says you may survive the run.',
    fail: 'Brenda\'s memo: "Orientation is not optional. Neither is accuracy." Gary\'s ghost nods solemnly.',
  },
  2: {
    pass: 'Compliance cleared. Brenda upgraded your surveillance from "casual" to "professional."',
    fail: 'Brenda scheduled a "coaching conversation." It is on your calendar forever.',
  },
  3: {
    pass: 'Cross-check shift passed. The documents are lying more convincingly each day.',
    fail: 'Too many errors. Brenda is updating the Booth 3 turnover statistics.',
  },
  7: {
    pass: 'Audit survived. Salary cap enforced. Brenda put the binoculars away. For now.',
    fail: 'Audit failed. Your badge will be recycled. Gary\'s badge is still in the coffee machine.',
  },
  10: {
    pass: 'EXEMPLARY. All ten shifts cleared. You earned the Golden Stapler of Due Diligence.',
    fail: 'Final audit failed. Booth 3 has a 94% turnover rate. You are the turnover.',
  },
};

export function getDayEpilogue(dayId: number): { pass: string; fail: string } {
  return DAY_EPILOGUES[dayId] ?? DEFAULT_EPILOGUE;
}

export const CAMPAIGN_ENDING =
  'You completed all ten shifts. OpenCorp awards you the Golden Stapler of Due Diligence. ' +
  'Booth 2 awaits. Brenda has already redecorated your nightmares.';

export const GAME_OVER_LETTER = {
  subject: 'RE: Separation — Effective Immediately',
  body: [
    'Dear Former Colleague,',
    'Your payroll balance reached zero, which HR interprets as "voluntary disengagement from continued existence at OpenCorp."',
    'Please return your stapler, your dignity, and any hope of a reference letter.',
    'Gary\'s badge remains in the coffee machine. Yours will join it shortly.',
    'Sincerely, Brenda Kline — VP Talent Compliance',
  ],
};

export function pickRandom<T>(items: readonly T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

export function pickWrongToastPrefix(): string {
  return pickRandom(WRONG_TOAST_PREFIXES);
}

export function pickCorrectToast(): string {
  return pickRandom(CORRECT_TOASTS);
}
