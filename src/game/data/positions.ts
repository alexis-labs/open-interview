import type { EducationLevel, Position } from '../types';

export const APPROVED_POSITIONS: Position[] = [
  'Software Engineer',
  'Product Manager',
  'Data Analyst',
];

export const POSITION_MIN_EXPERIENCE: Record<Position, number> = {
  'Software Engineer': 2,
  'Product Manager': 5,
  'Data Analyst': 3,
};

export const POSITION_REQUIRED_SKILLS: Record<Position, string[]> = {
  'Software Engineer': ['TypeScript', 'React', 'Python', 'Java', 'Node.js'],
  'Product Manager': ['Roadmapping', 'Agile', 'Stakeholder Management', 'Scrum'],
  'Data Analyst': ['SQL', 'Python', 'Tableau', 'Excel'],
};

export const MIN_SKILL_MATCHES = 2;

export const POSITION_MIN_EDUCATION: Record<Position, EducationLevel> = {
  'Software Engineer': "Bachelor's",
  'Product Manager': "Bachelor's",
  'Data Analyst': "Bachelor's",
};

export const EDUCATION_RANK: Record<EducationLevel, number> = {
  Bootcamp: 1,
  Associate: 2,
  "Bachelor's": 3,
  "Master's": 4,
  PhD: 5,
};

export const VERIFIED_COMPANIES = [
  'OpenCorp Inc.',
  'Nexus Systems',
  'DataForge Labs',
  'CloudPeak Technologies',
  'Meridian Analytics',
];

export const GAME_DATE = '2026-06-10';
export const DAILY_SALARY_CAP = 95000;
export const MAX_APPLICATION_AGE_DAYS = 7;
export const MAX_REFERENCE_AGE_DAYS = 30;
