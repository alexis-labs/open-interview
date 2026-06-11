import { describe, expect, it } from 'vitest';

import { CANDIDATES } from '../../data/candidates';

import { evaluateCandidate, isDecisionCorrect, isEligible } from '../ruleEngine';



describe('ruleEngine', () => {

  it('Alice Chen (tutorial) has no violations', () => {

    const violations = evaluateCandidate(CANDIDATES[0]);

    expect(violations).toHaveLength(0);

    expect(isEligible(violations)).toBe(true);

    expect(isDecisionCorrect('hire', violations)).toBe(true);

  });



  it('Marcus Webb has no violations', () => {

    const violations = evaluateCandidate(CANDIDATES[1]);

    expect(violations).toHaveLength(0);

    expect(isDecisionCorrect('hire', violations)).toBe(true);

  });



  it('Priya Nair fails name match (rule 1)', () => {

    const violations = evaluateCandidate(CANDIDATES[2]);

    expect(violations.some((v) => v.ruleId === 1)).toBe(true);

    expect(isDecisionCorrect('reject', violations)).toBe(true);

  });



  it('Tom Bradley fails unapproved role (rule 2)', () => {

    const violations = evaluateCandidate(CANDIDATES[3]);

    expect(violations.some((v) => v.ruleId === 2)).toBe(true);

    expect(isDecisionCorrect('reject', violations)).toBe(true);

  });



  it('Elena Rossi fails expired ID (rule 3)', () => {

    const violations = evaluateCandidate(CANDIDATES[4]);

    expect(violations.some((v) => v.ruleId === 3)).toBe(true);

    expect(isDecisionCorrect('reject', violations)).toBe(true);

  });



  it('James Okonkwo fails experience and reference (rules 4, 5)', () => {

    const violations = evaluateCandidate(CANDIDATES[5]);

    expect(violations.some((v) => v.ruleId === 4)).toBe(true);

    expect(violations.some((v) => v.ruleId === 5)).toBe(true);

    expect(isDecisionCorrect('reject', violations)).toBe(true);

  });



  it('Sofia Mendez has no violations', () => {

    const violations = evaluateCandidate(CANDIDATES[6]);

    expect(violations).toHaveLength(0);

    expect(isDecisionCorrect('hire', violations)).toBe(true);

  });



  it('Ryan Cho fails resume match (rule 6)', () => {

    const violations = evaluateCandidate(CANDIDATES[7]);

    expect(violations.some((v) => v.ruleId === 6)).toBe(true);

    expect(isDecisionCorrect('reject', violations)).toBe(true);

  });



  it('Nina Patel fails resume match (rule 6)', () => {

    const violations = evaluateCandidate(CANDIDATES[8]);

    expect(violations.some((v) => v.ruleId === 6)).toBe(true);

    expect(isDecisionCorrect('reject', violations)).toBe(true);

  });



  it('Omar Hassan fails salary cap (rule 7)', () => {

    const violations = evaluateCandidate(CANDIDATES[9]);

    expect(violations.some((v) => v.ruleId === 7)).toBe(true);

    expect(isDecisionCorrect('reject', violations)).toBe(true);

  });

});


