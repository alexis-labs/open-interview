import type { EducationLevel, Position } from '../types';

export const SKILLS_BY_POSITION: Record<Position, string[]> = {
  'Software Engineer': ['TypeScript', 'React', 'Node.js', 'Python', 'Java', 'Go', 'AWS'],
  'Product Manager': ['Roadmapping', 'Agile', 'Stakeholder Management', 'Scrum', 'Jira', 'OKRs'],
  'Data Analyst': ['SQL', 'Python', 'Tableau', 'Excel', 'Power BI', 'R'],
};

export const EDUCATION_LEVELS: EducationLevel[] = [
  "Bachelor's",
  "Master's",
  'PhD',
  'Associate',
  'Bootcamp',
];

export const REFERRER_FIRST_NAMES = [
  'Dana',
  'Priya',
  'Marcus',
  'Elena',
  'James',
  'Sofia',
  'Ryan',
  'Nina',
] as const;

export const REFERRER_RELATIONSHIPS = [
  'Former Manager',
  'Team Lead',
  'Director',
  'Colleague',
  'Project Lead',
] as const;
