import { create } from 'zustand';
import { playDecisionJuice, soundManager } from '../audio/soundManager';
import { SOUND_IDS } from '../audio/soundIds';
import { resetCandidatePhotoPool } from '../candidatePhotoPool';
import { getDayCandidates, getDayConfig, canUnlockNextDay, TOTAL_DAYS } from '../data/days';
import { ONBOARDING_STEPS } from '../data/onboarding';
import { pickCorrectToast, pickWrongToastPrefix } from '../data/story';
import { formatViolationSummary, getWrongDecisionReason } from '../engine/decisionFeedback';
import { generateRunSeed } from '../engine/candidateGenerator';
import { CORRECT_REWARD, processDecision, STARTING_MONEY, WRONG_PENALTY } from '../engine/gameEngine';
import { evaluateCandidate, isDecisionCorrect } from '../engine/ruleEngine';
import {
  loadProgress,
  markOnboardingComplete,
  recordDayResult,
  recordRunComplete,
  resetProgress as clearProgress,
  type GameProgress,
} from '../engine/progressStore';
import type { RuleContext } from '../engine/ruleEngine';
import type { Candidate, DayRecord, DecisionResult, DocumentType, GamePhase, Violation } from '../types';

export type JuicePhase = 'idle' | 'windup' | 'impact' | 'resolve';

interface GameState {
  phase: GamePhase;
  dayId: number;
  runSeed: number | null;
  runActive: boolean;
  runComplete: boolean;
  money: number;
  candidateIndex: number;
  candidates: Candidate[];
  mistakes: number;
  activeDocument: DocumentType;
  lastDecisionResult: DecisionResult | null;
  dayRecords: DayRecord[];
  stampVisible: boolean;
  stampType: 'hire' | 'reject' | null;
  feedbackFlash: 'correct' | 'wrong' | null;
  moneyDelta: number | null;
  feedbackToast: string | null;
  juiceKey: number;
  juicePhase: JuicePhase;
  lastDecision: 'hire' | 'reject' | null;
  docAnimKey: number;
  highlightedRuleId: number | null;
  reviewedRuleIds: number[];
  ruleContext: RuleContext;
  progress: GameProgress;
  onboardingStep: number | null;
  dayPassed: boolean;
  goToMenu: () => void;
  startNewRun: () => void;
  startShift: () => void;
  hire: () => void;
  reject: () => void;
  setActiveDocument: (doc: DocumentType) => void;
  setHighlightedRule: (ruleId: number | null) => void;
  toggleRuleReview: (ruleId: number) => void;
  nextOnboardingStep: () => void;
  skipOnboarding: () => void;
  continueToNextDay: () => void;
  retryDay: () => void;
  retryRun: () => void;
  resetProgress: () => void;
}

function buildRuleContext(dayId: number): RuleContext {
  const day = getDayConfig(dayId);
  return { activeRuleIds: day.activeRuleIds, salaryCap: day.salaryCap };
}

function formatViolationToast(violations: Violation[]): string {
  if (violations.length === 0) return 'Candidate was clean — Brenda is suspicious';
  const preview = formatViolationSummary(violations.slice(0, 2)).replace(/ · /g, ' | ');
  return preview + (violations.length > 2 ? ` (+${violations.length - 2} more)` : '');
}

function createPlayingState(dayId: number, runSeed: number): Partial<GameState> {
  resetCandidatePhotoPool();
  const day = getDayConfig(dayId);
  const progress = loadProgress();
  const isFirstRunTutorial = dayId === 1 && !progress.onboardingComplete;

  return {
    phase: 'playing',
    dayId,
    runSeed,
    money: day.startingMoney,
    candidateIndex: 0,
    candidates: getDayCandidates(dayId, {
      runSeed,
      forceFirstClean: isFirstRunTutorial,
      forceFirstTutorial: isFirstRunTutorial,
    }),
    mistakes: 0,
    activeDocument: 'application',
    highlightedRuleId: day.activeRuleIds[0] ?? null,
    dayRecords: [],
    ruleContext: buildRuleContext(dayId),
    reviewedRuleIds: [],
    dayPassed: false,
    onboardingStep: isFirstRunTutorial ? 0 : null,
  };
}

export const useGameStore = create<GameState>((set, get) => ({
  phase: 'menu',
  dayId: 1,
  runSeed: null,
  runActive: false,
  runComplete: false,
  money: STARTING_MONEY,
  candidateIndex: 0,
  candidates: [],
  mistakes: 0,
  activeDocument: 'application',
  lastDecisionResult: null,
  dayRecords: [],
  stampVisible: false,
  stampType: null,
  feedbackFlash: null,
  moneyDelta: null,
  feedbackToast: null,
  juiceKey: 0,
  juicePhase: 'idle',
  lastDecision: null,
  docAnimKey: 0,
  highlightedRuleId: null,
  reviewedRuleIds: [],
  ruleContext: buildRuleContext(1),
  progress: loadProgress(),
  onboardingStep: null,
  dayPassed: false,

  goToMenu: () =>
    set({
      phase: 'menu',
      runActive: false,
      progress: loadProgress(),
      onboardingStep: null,
      stampVisible: false,
      feedbackFlash: null,
      juicePhase: 'idle',
    }),

  startNewRun: () => {
    void soundManager.init();
    soundManager.play(SOUND_IDS.uiConfirm);
    const runSeed = generateRunSeed();
    const day = getDayConfig(1);
    set({
      runSeed,
      runActive: true,
      runComplete: false,
      dayId: 1,
      phase: 'briefing',
      progress: loadProgress(),
      highlightedRuleId: day.activeRuleIds[0] ?? null,
    });
  },

  startShift: () => {
    const { dayId, runSeed } = get();
    if (runSeed === null) return;
    set({
      ...createPlayingState(dayId, runSeed),
      stampVisible: false,
      feedbackFlash: null,
      juicePhase: 'idle',
    });
  },

  setActiveDocument: (doc) => {
    const prev = get().activeDocument;
    if (prev !== doc) {
      soundManager.play(SOUND_IDS.paper);
    }
    set({ activeDocument: doc });
  },

  setHighlightedRule: (ruleId) => set({ highlightedRuleId: ruleId }),

  toggleRuleReview: (ruleId) => {
    const current = get().reviewedRuleIds;
    const next = current.includes(ruleId)
      ? current.filter((id) => id !== ruleId)
      : [...current, ruleId];
    set({ reviewedRuleIds: next });
  },

  nextOnboardingStep: () => {
    const step = get().onboardingStep;
    if (step === null) return;
    if (step >= ONBOARDING_STEPS.length - 1) {
      markOnboardingComplete();
      set({ onboardingStep: null, progress: loadProgress() });
    } else {
      set({ onboardingStep: step + 1 });
    }
  },

  skipOnboarding: () => {
    markOnboardingComplete();
    set({ onboardingStep: null, progress: loadProgress() });
  },

  hire: () => {
    if (get().phase !== 'playing' || get().juicePhase !== 'idle') return;
    applyDecision('hire', set, get);
  },

  reject: () => {
    if (get().phase !== 'playing' || get().juicePhase !== 'idle') return;
    applyDecision('reject', set, get);
  },

  continueToNextDay: () => {
    const { dayId, dayPassed, runSeed } = get();
    if (!dayPassed || runSeed === null) {
      get().goToMenu();
      return;
    }
    if (dayId >= TOTAL_DAYS) {
      set({ runComplete: true, runActive: false, phase: 'menu', progress: recordRunComplete() });
      return;
    }
    const nextDay = dayId + 1;
    const day = getDayConfig(nextDay);
    set({
      dayId: nextDay,
      phase: 'briefing',
      highlightedRuleId: day.activeRuleIds[0] ?? null,
    });
  },

  retryDay: () => {
    const { dayId, runSeed } = get();
    if (runSeed === null) return;
    set({ ...createPlayingState(dayId, runSeed) });
  },

  retryRun: () => get().startNewRun(),

  resetProgress: () => {
    clearProgress();
    set({
      phase: 'menu',
      progress: loadProgress(),
      dayId: 1,
      runSeed: null,
      runActive: false,
      runComplete: false,
      onboardingStep: null,
    });
  },
}));

function applyDecision(
  decision: 'hire' | 'reject',
  set: (partial: Partial<GameState>) => void,
  get: () => GameState,
) {
  const state = get();
  const candidate = state.candidates[state.candidateIndex];
  if (!candidate) return;

  const violations = evaluateCandidate(candidate, state.ruleContext);
  const correct = isDecisionCorrect(decision, violations);

  const outcome = processDecision(
    candidate,
    decision,
    state.money,
    state.mistakes,
    state.candidateIndex,
    state.candidates.length,
    state.ruleContext,
  );
  outcome.result = { decision, correct, violations };

  const record: DayRecord = {
    candidateName: candidate.application.fullName,
    decision,
    correct,
    violations,
    wrongReason: correct ? undefined : getWrongDecisionReason(decision, violations),
  };

  const delta = correct ? CORRECT_REWARD : -WRONG_PENALTY;
  const toast = correct
    ? pickCorrectToast()
    : `${pickWrongToastPrefix()} ${formatViolationToast(violations)}`;

  const finalMoney = correct ? state.money + CORRECT_REWARD : Math.max(0, state.money - WRONG_PENALTY);
  const finalMistakes = correct ? state.mistakes : state.mistakes + 1;

  playDecisionJuice({ decision, correct, delta });

  set({
    juicePhase: 'windup',
    stampType: decision,
    lastDecision: decision,
    lastDecisionResult: outcome.result,
    mistakes: finalMistakes,
    dayRecords: [...state.dayRecords, record],
    feedbackToast: toast,
  });

  setTimeout(() => {
    set({ juicePhase: 'impact', stampVisible: true });
  }, 60);

  setTimeout(() => {
    set({
      juicePhase: 'resolve',
      feedbackFlash: correct ? 'correct' : 'wrong',
      money: finalMoney,
      moneyDelta: delta,
      juiceKey: state.juiceKey + 1,
    });
  }, 100);

  setTimeout(() => {
    const current = get();
    let dayPassed = current.dayPassed;
    let progress = current.progress;
    let onboardingStep = current.onboardingStep;
    let runComplete = current.runComplete;

    let phase = outcome.phase;
    if (finalMoney <= 0) phase = 'gameover';
    else if (state.candidateIndex + 1 >= state.candidates.length) phase = 'summary';

    if (phase === 'summary') {
      const passed = canUnlockNextDay(current.dayId, finalMistakes, true);
      dayPassed = passed;
      progress = recordDayResult(current.dayId, finalMoney, finalMistakes, passed);
      if (passed && current.dayId === TOTAL_DAYS) {
        progress = recordRunComplete();
        runComplete = true;
      }
    } else if (phase === 'gameover') {
      recordDayResult(current.dayId, finalMoney, finalMistakes, false);
      progress = loadProgress();
    }

    if (onboardingStep === 5 && correct && candidate.isTutorial) {
      markOnboardingComplete();
      progress = loadProgress();
      onboardingStep = null;
    }

    set({
      stampVisible: false,
      stampType: null,
      feedbackFlash: null,
      moneyDelta: null,
      feedbackToast: null,
      lastDecision: null,
      juicePhase: 'idle',
      candidateIndex: outcome.candidateIndex,
      phase,
      activeDocument: 'application',
      lastDecisionResult: null,
      highlightedRuleId: getDayConfig(get().dayId).activeRuleIds[0] ?? null,
      reviewedRuleIds: [],
      docAnimKey: current.docAnimKey + 1,
      dayPassed,
      progress,
      onboardingStep,
      runComplete,
    });
  }, 1100);
}

export { CORRECT_REWARD, WRONG_PENALTY, STARTING_MONEY };
