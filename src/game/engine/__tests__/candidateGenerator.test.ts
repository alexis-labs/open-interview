import { describe, expect, it } from 'vitest';
import { getDayConfig } from '../../data/days';
import { generateDayCandidates } from '../candidateGenerator';
import { evaluateCandidate } from '../ruleEngine';

const SEED = 42_424_242;

describe('candidateGenerator', () => {
  it('produces deterministic candidates for a fixed seed', () => {
    const day = getDayConfig(1);
    const a = generateDayCandidates(day, SEED);
    const b = generateDayCandidates(day, SEED);
    expect(a).toEqual(b);
    expect(a).toHaveLength(day.candidateCount);
  });

  it('generates different candidates for different days with same seed', () => {
    const day1 = generateDayCandidates(getDayConfig(1), SEED);
    const day2 = generateDayCandidates(getDayConfig(2), SEED);
    expect(day1[0].id).not.toBe(day2[0].id);
  });

  it('forceFirstClean yields a violation-free first candidate', () => {
    const day = getDayConfig(7);
    const candidates = generateDayCandidates(day, SEED, { forceFirstClean: true });
    const violations = evaluateCandidate(candidates[0], {
      activeRuleIds: day.activeRuleIds,
      salaryCap: day.salaryCap,
    });
    expect(violations).toHaveLength(0);
  });

  it('mix includes both clean and dirty candidates over a day', () => {
    const day = getDayConfig(10);
    const candidates = generateDayCandidates(day, SEED);
    let clean = 0;
    let dirty = 0;
    for (const c of candidates) {
      const violations = evaluateCandidate(c, {
        activeRuleIds: day.activeRuleIds,
        salaryCap: day.salaryCap,
      });
      if (violations.length === 0) clean++;
      else dirty++;
    }
    expect(clean).toBeGreaterThan(0);
    expect(dirty).toBeGreaterThan(0);
  });

  it('dirty candidates trigger only active rules', () => {
    const day = getDayConfig(1);
    const candidates = generateDayCandidates(day, SEED);
    const active = new Set(day.activeRuleIds);
    for (const c of candidates) {
      const violations = evaluateCandidate(c, {
        activeRuleIds: day.activeRuleIds,
        salaryCap: day.salaryCap,
      });
      for (const v of violations) {
        expect(active.has(v.ruleId)).toBe(true);
      }
    }
  });
});
