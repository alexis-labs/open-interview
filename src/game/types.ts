export type DocumentType = 'application' | 'idBadge' | 'resume' | 'reference';

export type Position = 'Software Engineer' | 'Product Manager' | 'Data Analyst';

export type EducationLevel = "Bachelor's" | "Master's" | 'PhD' | 'Associate' | 'Bootcamp';

export interface WorkHistoryEntry {
  company: string;
  role: string;
  years: number;
}

export interface ApplicationDoc {
  type: 'application';
  fullName: string;
  position: string;
  dateApplied: string;
  interviewSlot: string;
  salaryExpectation: number;
}

export interface IdBadgeDoc {
  type: 'idBadge';
  fullName: string;
  badgeNumber: string;
  issueDate: string;
  expiryDate: string;
  photoId: string;
}

export interface ResumeDoc {
  type: 'resume';
  fullName: string;
  yearsExperience: number;
  position: string;
  skills: string[];
  lastEmployer: string;
  education: EducationLevel;
  workHistory: WorkHistoryEntry[];
  certifications: string[];
}

export interface ReferenceDoc {
  type: 'reference';
  candidateName: string;
  referrerName: string;
  referrerCompany: string;
  relationship: string;
  recommendationDate: string;
}

export type Document = ApplicationDoc | IdBadgeDoc | ResumeDoc | ReferenceDoc;

export type CandidateGender = 'female' | 'male';

export interface Candidate {
  id: string;
  gender: CandidateGender;
  isTutorial: boolean;
  waitingQuip: string;
  referenceBlurb: string;
  application: ApplicationDoc;
  idBadge: IdBadgeDoc;
  resume: ResumeDoc;
  reference: ReferenceDoc;
}

export interface Rule {
  id: number;
  title: string;
  description: string;
  hint?: string;
  flavor?: string;
}

export interface Violation {
  ruleId: number;
  message: string;
}

export type FieldFlag =
  | 'application.name'
  | 'application.position'
  | 'application.date'
  | 'application.salary'
  | 'idBadge.name'
  | 'idBadge.expiry'
  | 'resume.name'
  | 'resume.position'
  | 'resume.experience'
  | 'resume.employer'
  | 'resume.education'
  | 'resume.skills'
  | 'reference.name'
  | 'reference.company'
  | 'reference.date';

export type GamePhase = 'menu' | 'briefing' | 'playing' | 'summary' | 'gameover';

export type Decision = 'hire' | 'reject';

export interface DecisionResult {
  decision: Decision;
  correct: boolean;
  violations: Violation[];
}

export interface DayRecord {
  candidateName: string;
  decision: Decision;
  correct: boolean;
  violations: Violation[];
  /** Set when the player made a mistake — shown in the day-end review. */
  wrongReason?: string;
}
