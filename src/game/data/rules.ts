import { DAILY_SALARY_CAP, GAME_DATE } from './positions';

import type { Rule } from '../types';



export const POLICY_RULES: Rule[] = [

  {

    id: 1,

    title: 'Name Match',

    description: 'Same full name on Application, ID, Resume, and Reference.',

    hint: 'Compare the name on all four documents.',

    flavor: 'Middle initials are a trap.',

  },

  {

    id: 2,

    title: 'Approved Role',

    description: 'Role must be Software Engineer, Product Manager, or Data Analyst.',

    hint: 'Check position on the Application.',

    flavor: 'UX Designer was sunsetted. Tom did not attend that meeting.',

  },

  {

    id: 3,

    title: 'Valid ID',

    description: `ID badge must not be expired (today: ${GAME_DATE}).`,

    hint: 'Check expiry date on the ID Badge.',

    flavor: 'Expired badge = shredder.',

  },

  {

    id: 4,

    title: 'Experience',

    description:
      'Resume must show enough years for the role: Software Engineer 2+, Product Manager 5+, Data Analyst 3+.',

    hint: 'Compare the job on the application with years listed on the resume.',

    flavor: 'Two years as Product Manager is enthusiasm, not experience.',

  },

  {

    id: 5,

    title: 'Verified Reference',

    description:

      'Reference must be from a verified company (Nexus Systems, DataForge Labs, CloudPeak, Meridian, or OpenCorp).',

    hint: 'Check company on the Reference Letter.',

    flavor: 'StealthStartup LLC is not on the list.',

  },

  {

    id: 6,

    title: 'Resume Match',

    description: 'Position on Resume must match the Application.',

    hint: 'Compare Application vs Resume position.',

    flavor: 'Ryan applied as Software Engineer. His resume says Data Analyst.',

  },

  {

    id: 7,

    title: 'Salary Cap',

    description: `Salary expectation must not exceed today's cap ($${DAILY_SALARY_CAP.toLocaleString()} default).`,

    hint: 'Check salary on the Application.',

    flavor: 'Champagne ask, seltzer budget.',

  },

];


