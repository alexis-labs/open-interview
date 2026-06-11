import { describe, expect, it } from 'vitest';
import { getWrongDecisionReason } from '../decisionFeedback';

describe('getWrongDecisionReason', () => {
  const violations = [{ ruleId: 2, message: 'Salary exceeds cap' }];

  it('explains wrongful hire', () => {
    expect(getWrongDecisionReason('hire', violations)).toBe(
      'Should have rejected — Rule 2: Salary exceeds cap',
    );
  });

  it('explains wrongful reject of clean candidate', () => {
    expect(getWrongDecisionReason('reject', [])).toBe(
      'Should have hired — candidate had no policy violations',
    );
  });
});
