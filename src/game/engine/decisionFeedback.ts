import type { Decision, Violation } from '../types';

export function formatViolationSummary(violations: Violation[]): string {
  if (violations.length === 0) return '';
  return violations.map((v) => `Rule ${v.ruleId}: ${v.message}`).join(' · ');
}

export function getWrongDecisionReason(decision: Decision, violations: Violation[]): string {
  if (decision === 'hire') {
    return violations.length > 0
      ? `Should have rejected — ${formatViolationSummary(violations)}`
      : 'Incorrect hire decision';
  }
  return 'Should have hired — candidate had no policy violations';
}
