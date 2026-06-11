import type { Candidate, Decision, DecisionResult, GamePhase } from '../types';
import { evaluateCandidate, isDecisionCorrect, type RuleContext } from './ruleEngine';

export const STARTING_MONEY = 70;
export const CORRECT_REWARD = 4;
export const WRONG_PENALTY = 12;

export function processDecision(
  candidate: Candidate,
  decision: Decision,
  money: number,
  mistakes: number,
  candidateIndex: number,
  totalCandidates: number,
  ruleContext: RuleContext,
): {
  money: number;
  mistakes: number;
  candidateIndex: number;
  phase: GamePhase;
  result: DecisionResult;
} {
  const violations = evaluateCandidate(candidate, ruleContext);
  const correct = isDecisionCorrect(decision, violations);
  const newMoney = correct ? money + CORRECT_REWARD : money - WRONG_PENALTY;
  const newMistakes = correct ? mistakes : mistakes + 1;

  let phase: GamePhase = 'playing';
  let nextIndex = candidateIndex;

  if (newMoney <= 0) {
    phase = 'gameover';
  } else if (candidateIndex + 1 >= totalCandidates) {
    phase = 'summary';
    nextIndex = candidateIndex + 1;
  } else {
    nextIndex = candidateIndex + 1;
  }

  return {
    money: Math.max(0, newMoney),
    mistakes: newMistakes,
    candidateIndex: nextIndex,
    phase,
    result: { decision, correct, violations },
  };
}
