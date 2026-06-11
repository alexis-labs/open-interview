import {

  APPROVED_POSITIONS,

  DAILY_SALARY_CAP,

  GAME_DATE,

  POSITION_MIN_EXPERIENCE,

  VERIFIED_COMPANIES,

} from '../data/positions';

import type { Candidate, Decision, Position, Violation } from '../types';



export const ALL_RULE_IDS = [1, 2, 3, 4, 5, 6, 7] as const;



export interface RuleContext {

  activeRuleIds: number[];

  salaryCap: number;

}



export const DEFAULT_RULE_CONTEXT: RuleContext = {

  activeRuleIds: [...ALL_RULE_IDS],

  salaryCap: DAILY_SALARY_CAP,

};



function isApprovedPosition(position: string): position is Position {

  return (APPROVED_POSITIONS as string[]).includes(position);

}



export function evaluateCandidate(candidate: Candidate, context: RuleContext = DEFAULT_RULE_CONTEXT): Violation[] {

  const violations: Violation[] = [];

  const { application, idBadge, resume, reference } = candidate;

  const { salaryCap } = context;



  const names = [application.fullName, idBadge.fullName, resume.fullName, reference.candidateName];

  if (new Set(names).size > 1) {

    violations.push({

      ruleId: 1,

      message: `Names don't match: ${[...new Set(names)].join(' / ')}`,

    });

  }



  if (!isApprovedPosition(application.position)) {

    violations.push({

      ruleId: 2,

      message: `"${application.position}" is not an approved role`,

    });

  }



  if (idBadge.expiryDate < GAME_DATE) {

    violations.push({ ruleId: 3, message: `ID expired on ${idBadge.expiryDate}` });

  }



  if (isApprovedPosition(application.position)) {

    const minimum = POSITION_MIN_EXPERIENCE[application.position];

    if (resume.yearsExperience < minimum) {

      violations.push({

        ruleId: 4,

        message: `Needs ${minimum}+ years for ${application.position}, has ${resume.yearsExperience}`,

      });

    }

  }



  if (!VERIFIED_COMPANIES.includes(reference.referrerCompany)) {

    violations.push({

      ruleId: 5,

      message: `"${reference.referrerCompany}" is not a verified reference`,

    });

  }



  if (resume.position !== application.position) {

    violations.push({

      ruleId: 6,

      message: `Resume says "${resume.position}", application says "${application.position}"`,

    });

  }



  if (application.salaryExpectation > salaryCap) {

    violations.push({

      ruleId: 7,

      message: `Salary $${application.salaryExpectation.toLocaleString()} exceeds cap $${salaryCap.toLocaleString()}`,

    });

  }



  const active = new Set(context.activeRuleIds);

  return violations.filter((v) => active.has(v.ruleId));

}



export function isEligible(violations: Violation[]): boolean {

  return violations.length === 0;

}



export function isDecisionCorrect(decision: Decision, violations: Violation[]): boolean {

  const eligible = isEligible(violations);

  return (decision === 'hire' && eligible) || (decision === 'reject' && !eligible);

}



