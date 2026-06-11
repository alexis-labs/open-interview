export interface OnboardingStep {

  id: number;

  title: string;

  body: string;

  highlight?: 'policy' | 'crosscheck' | 'tabs' | 'document' | 'actions';

}



export const ONBOARDING_STEPS: OnboardingStep[] = [

  {

    id: 0,

    title: 'Dana: Welcome, Replacement',

    body: 'Gary lasted four hours. Four rules today. Read the documents, check the rulebook, stamp HIRE or REJECT.',

  },

  {

    id: 1,

    title: 'Dana: Policy Manual',

    body: 'Your rulebook. Tap a rule to jump to the right document — nothing is auto-checked for you.',

    highlight: 'policy',

  },

  {

    id: 2,

    title: 'Dana: Cross-Reference Desk',

    body: 'Side-by-side values only. You decide if they match — like Papers, Please.',

    highlight: 'crosscheck',

  },

  {

    id: 3,

    title: 'Dana: Document Tabs',

    body: 'Application, ID, Resume, Reference — read all four against the bulletin before stamping.',

    highlight: 'tabs',

  },

  {

    id: 4,

    title: 'Dana: Read Everything',

    body: 'No red flags. No hints on the paper. Brenda finds out after you stamp.',

    highlight: 'document',

  },

  {

    id: 5,

    title: 'Dana: Stamp the First Candidate',

    body: 'The first file is clean — if you checked. Stamp HIRE when you are sure. Gary would have guessed.',

    highlight: 'actions',

  },

];

