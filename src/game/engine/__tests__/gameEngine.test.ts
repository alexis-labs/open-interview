import { describe, expect, it } from 'vitest';
import { getDayCandidates, getDayConfig } from '../../data/days';
import { CORRECT_REWARD, processDecision, WRONG_PENALTY } from '../gameEngine';
import { evaluateCandidate } from '../ruleEngine';

const SEED = 12_345;
const day = getDayConfig(3);
const CANDIDATES = getDayCandidates(3, { runSeed: SEED });

function findCleanCandidate() {
  return CANDIDATES.find(
    (c) =>
      evaluateCandidate(c, { activeRuleIds: day.activeRuleIds, salaryCap: day.salaryCap }).length === 0,
  )!;
}

function findDirtyCandidate() {
  return CANDIDATES.find(
    (c) =>
      evaluateCandidate(c, { activeRuleIds: day.activeRuleIds, salaryCap: day.salaryCap }).length > 0,
  )!;
}

describe('gameEngine', () => {
  it('rewards correct hire decision', () => {
    const candidate = findCleanCandidate();
    const start = day.startingMoney;
    const result = processDecision(
      candidate,
      'hire',
      start,
      0,
      0,
      CANDIDATES.length,
      { activeRuleIds: day.activeRuleIds, salaryCap: day.salaryCap },
    );
    expect(result.money).toBe(start + CORRECT_REWARD);
    expect(result.mistakes).toBe(0);
    expect(result.result.correct).toBe(true);
    expect(result.candidateIndex).toBe(1);
    expect(result.phase).toBe('playing');
  });

  it('penalizes wrong reject on eligible candidate', () => {
    const candidate = findCleanCandidate();
    const start = day.startingMoney;
    const result = processDecision(
      candidate,
      'reject',
      start,
      0,
      0,
      CANDIDATES.length,
      { activeRuleIds: day.activeRuleIds, salaryCap: day.salaryCap },
    );
    expect(result.money).toBe(start - WRONG_PENALTY);
    expect(result.mistakes).toBe(1);
    expect(result.result.correct).toBe(false);
  });

  it('triggers summary after last candidate', () => {
    const candidate = findDirtyCandidate();
    const lastIndex = CANDIDATES.length - 1;
    const result = processDecision(
      candidate,
      'reject',
      day.startingMoney,
      0,
      lastIndex,
      CANDIDATES.length,
      { activeRuleIds: day.activeRuleIds, salaryCap: day.salaryCap },
    );
    expect(result.phase).toBe('summary');
    expect(result.candidateIndex).toBe(CANDIDATES.length);
  });

  it('triggers gameover when money hits zero', () => {
    const candidate = findCleanCandidate();
    const result = processDecision(
      candidate,
      'reject',
      5,
      0,
      0,
      CANDIDATES.length,
      { activeRuleIds: day.activeRuleIds, salaryCap: day.salaryCap },
    );
    expect(result.money).toBe(0);
    expect(result.phase).toBe('gameover');
  });
});
