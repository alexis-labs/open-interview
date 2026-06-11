const STORAGE_KEY = 'open-interview-progress';

export interface GameProgress {
  onboardingComplete: boolean;
  runsCompleted: number;
  bestRunDay: number;
}

const DEFAULT_PROGRESS: GameProgress = {
  onboardingComplete: false,
  runsCompleted: 0,
  bestRunDay: 0,
};

export function loadProgress(): GameProgress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_PROGRESS };
    const parsed = JSON.parse(raw) as Partial<GameProgress>;
    return {
      ...DEFAULT_PROGRESS,
      onboardingComplete: parsed.onboardingComplete ?? false,
      runsCompleted: parsed.runsCompleted ?? 0,
      bestRunDay: parsed.bestRunDay ?? 0,
    };
  } catch {
    return { ...DEFAULT_PROGRESS };
  }
}

export function saveProgress(progress: GameProgress): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

export function recordDayResult(
  dayId: number,
  _money: number,
  _mistakes: number,
  passed: boolean,
): GameProgress {
  const progress = loadProgress();
  if (passed && dayId > progress.bestRunDay) {
    progress.bestRunDay = dayId;
  }
  if (dayId === 1 && passed) {
    progress.onboardingComplete = true;
  }
  saveProgress(progress);
  return progress;
}

export function recordRunComplete(): GameProgress {
  const progress = loadProgress();
  progress.runsCompleted += 1;
  progress.bestRunDay = Math.max(progress.bestRunDay, 10);
  progress.onboardingComplete = true;
  saveProgress(progress);
  return progress;
}

export function markOnboardingComplete(): GameProgress {
  const progress = loadProgress();
  progress.onboardingComplete = true;
  saveProgress(progress);
  return progress;
}

export function resetProgress(): void {
  localStorage.removeItem(STORAGE_KEY);
}
