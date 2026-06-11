import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  loadProgress,
  markOnboardingComplete,
  recordDayResult,
  recordRunComplete,
  resetProgress,
  saveProgress,
} from '../progressStore';

function createStorageMock() {
  const store = new Map<string, string>();
  return {
    getItem: (key: string) => store.get(key) ?? null,
    setItem: (key: string, value: string) => {
      store.set(key, value);
    },
    removeItem: (key: string) => {
      store.delete(key);
    },
    clear: () => {
      store.clear();
    },
  };
}

describe('progressStore', () => {
  beforeEach(() => {
    vi.stubGlobal('localStorage', createStorageMock());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('returns default progress when storage is empty', () => {
    expect(loadProgress()).toEqual({
      onboardingComplete: false,
      runsCompleted: 0,
      bestRunDay: 0,
    });
  });

  it('persists and reloads progress', () => {
    saveProgress({
      onboardingComplete: true,
      runsCompleted: 2,
      bestRunDay: 7,
    });
    expect(loadProgress().bestRunDay).toBe(7);
    expect(loadProgress().runsCompleted).toBe(2);
  });

  it('tracks best run day when shift passes', () => {
    const progress = recordDayResult(3, 50, 1, true);
    expect(progress.bestRunDay).toBe(3);
    expect(progress.onboardingComplete).toBe(false);
  });

  it('marks onboarding complete when day 1 passes', () => {
    const progress = recordDayResult(1, 60, 0, true);
    expect(progress.onboardingComplete).toBe(true);
    expect(progress.bestRunDay).toBe(1);
  });

  it('does not advance best run day when shift fails', () => {
    const progress = recordDayResult(1, 10, 5, false);
    expect(progress.bestRunDay).toBe(0);
    expect(progress.onboardingComplete).toBe(false);
  });

  it('recordRunComplete increments runs completed', () => {
    recordDayResult(10, 50, 0, true);
    const progress = recordRunComplete();
    expect(progress.runsCompleted).toBe(1);
    expect(progress.bestRunDay).toBe(10);
  });

  it('markOnboardingComplete sets flag without passing day', () => {
    const progress = markOnboardingComplete();
    expect(progress.onboardingComplete).toBe(true);
  });

  it('resetProgress clears storage', () => {
    saveProgress({
      onboardingComplete: true,
      runsCompleted: 1,
      bestRunDay: 10,
    });
    resetProgress();
    expect(localStorage.getItem('open-interview-progress')).toBeNull();
  });
});
