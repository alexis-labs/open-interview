import type { EducationLevel, Position } from '../types';

export const SKILLS_BY_POSITION: Record<Position, string[]> = {
  'Software Engineer': [
    'TypeScript',
    'React',
    'Node.js',
    'Python',
    'Java',
    'Go',
    'AWS',
    'PostgreSQL',
    'Docker',
    'GraphQL',
    'Testing',
    'CI/CD',
  ],
  'Product Manager': [
    'Roadmapping',
    'Agile',
    'Stakeholder Management',
    'Scrum',
    'Jira',
    'OKRs',
    'User Research',
    'A/B Testing',
    'Go-to-Market',
    'Prioritization',
    'Analytics',
    'Workshop Facilitation',
  ],
  'Data Analyst': [
    'SQL',
    'Python',
    'Tableau',
    'Excel',
    'Power BI',
    'R',
    'Looker',
    'dbt',
    'Statistics',
    'Data Cleaning',
    'Forecasting',
    'Dashboard Design',
  ],
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
  'Aisha',
  'Hugo',
  'Mei',
  'Samir',
  'Camila',
  'Jonas',
  'Noor',
  'Rafael',
] as const;

export const REFERRER_RELATIONSHIPS = [
  'Former Manager',
  'Team Lead',
  'Director',
  'Colleague',
  'Project Lead',
  'Mentor',
  'Client Partner',
  'Department Head',
  'Cross-functional Lead',
  'Skip-level Manager',
] as const;

export const CERTIFICATIONS_BY_POSITION: Record<Position, string[]> = {
  'Software Engineer': [
    'AWS Cloud Practitioner',
    'Azure Fundamentals',
    'Oracle Java SE',
    'Certified Kubernetes Application Developer',
    'GitHub Foundations',
    'Scrum Developer',
  ],
  'Product Manager': [
    'CSPO',
    'PMP',
    'Pragmatic Marketing',
    'Product Analytics Certification',
    'SAFe Product Owner',
    'Design Thinking Certificate',
  ],
  'Data Analyst': [
    'Google Data Analytics',
    'Microsoft Power BI Data Analyst',
    'Tableau Desktop Specialist',
    'dbt Fundamentals',
    'Statistics for Business',
    'Excel Expert',
  ],
};
