import { describe, expect, it } from 'vitest';
import { canUnlockNextDay, getDayCandidates, getDayConfig, DAYS, TOTAL_DAYS } from '../../data/days';
import { evaluateCandidate } from '../ruleEngine';

const SEED = 99_001;

describe('days', () => {
  it('defines 10 procedural days', () => {
    expect(DAYS).toHaveLength(TOTAL_DAYS);
    expect(TOTAL_DAYS).toBe(10);
  });

  it('Day 1 has 4 candidates and 4 rules', () => {
    const day = getDayConfig(1);
    expect(day.activeRuleIds).toEqual([1, 2, 3, 4]);
    expect(getDayCandidates(1, { runSeed: SEED })).toHaveLength(4);
  });

  it('Day 2 has 5 candidates and 5 rules', () => {
    const day = getDayConfig(2);
    expect(day.activeRuleIds).toHaveLength(5);
    expect(getDayCandidates(2, { runSeed: SEED })).toHaveLength(5);
  });

  it('Day 10 has 8 candidates and all 7 rules', () => {
    const day = getDayConfig(10);
    expect(day.activeRuleIds).toHaveLength(7);
    expect(getDayCandidates(10, { runSeed: SEED })).toHaveLength(8);
  });

  it('Day 10 allows zero mistakes to pass', () => {
    expect(getDayConfig(10).maxMistakesToPass).toBe(0);
    expect(canUnlockNextDay(10, 0, true)).toBe(true);
    expect(canUnlockNextDay(10, 1, true)).toBe(false);
  });

  it('canUnlockNextDay respects mistake threshold', () => {
    expect(canUnlockNextDay(1, 3, true)).toBe(true);
    expect(canUnlockNextDay(1, 4, true)).toBe(false);
    expect(canUnlockNextDay(1, 0, false)).toBe(false);
  });

  it('generated candidates respect day rule context', () => {
    const day = getDayConfig(3);
    const candidates = getDayCandidates(3, { runSeed: SEED });
    for (const c of candidates) {
      const violations = evaluateCandidate(c, {
        activeRuleIds: day.activeRuleIds,
        salaryCap: day.salaryCap,
      });
      const hasSalaryViolation = violations.some((v) => v.ruleId === 7);
      expect(hasSalaryViolation).toBe(false);
    }
  });
});
