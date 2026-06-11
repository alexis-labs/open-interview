import { GAME_DATE, POSITION_MIN_EXPERIENCE, VERIFIED_COMPANIES } from '../data/positions';

import type { Candidate, FieldFlag, Position } from '../types';

import { DEFAULT_RULE_CONTEXT, type RuleContext } from './ruleEngine';

function isApprovedPosition(position: string): position is Position {

  return ['Software Engineer', 'Product Manager', 'Data Analyst'].includes(position);

}



function isActive(ruleId: number, active: Set<number>, filter?: number): boolean {

  if (!active.has(ruleId)) return false;

  return filter === undefined || filter === ruleId;

}



export function getFlaggedFields(

  candidate: Candidate,

  ruleId?: number,

  context: RuleContext = DEFAULT_RULE_CONTEXT,

): Set<FieldFlag> {

  const flags = new Set<FieldFlag>();

  const { application, idBadge, resume, reference } = candidate;

  const canonical = application.fullName;

  const active = new Set(context.activeRuleIds);



  if (isActive(1, active, ruleId)) {

    if (application.fullName !== canonical) flags.add('application.name');

    if (idBadge.fullName !== canonical) flags.add('idBadge.name');

    if (resume.fullName !== canonical) flags.add('resume.name');

    if (reference.candidateName !== canonical) flags.add('reference.name');

  }



  if (isActive(2, active, ruleId) && !isApprovedPosition(application.position)) {

    flags.add('application.position');

  }



  if (isActive(3, active, ruleId) && idBadge.expiryDate < GAME_DATE) {

    flags.add('idBadge.expiry');

  }



  if (

    isActive(4, active, ruleId) &&

    isApprovedPosition(application.position) &&

    resume.yearsExperience < POSITION_MIN_EXPERIENCE[application.position]

  ) {

    flags.add('resume.experience');

  }



  if (isActive(5, active, ruleId) && !VERIFIED_COMPANIES.includes(reference.referrerCompany)) {

    flags.add('reference.company');

  }



  if (isActive(6, active, ruleId) && resume.position !== application.position) {

    flags.add('application.position');

    flags.add('resume.position');

  }



  if (isActive(7, active, ruleId) && application.salaryExpectation > context.salaryCap) {

    flags.add('application.salary');

  }



  return flags;

}

export function getCrossCheckRows(candidate: Candidate) {

  return [

    {

      label: 'Name',

      application: candidate.application.fullName,

      idBadge: candidate.idBadge.fullName,

      resume: candidate.resume.fullName,

      reference: candidate.reference.candidateName,

      ok:

        candidate.application.fullName === candidate.idBadge.fullName &&

        candidate.idBadge.fullName === candidate.resume.fullName &&

        candidate.resume.fullName === candidate.reference.candidateName,

    },

    {

      label: 'Position',

      application: candidate.application.position,

      idBadge: '—',

      resume: candidate.resume.position,

      reference: '—',

      ok: candidate.application.position === candidate.resume.position,

    },

  ];

}


