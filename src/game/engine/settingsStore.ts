const STORAGE_KEY = 'open-interview-settings';

export interface GameSettings {
  soundEnabled: boolean;
  sfxVolume: number;
}

const DEFAULT_SETTINGS: GameSettings = {
  soundEnabled: true,
  sfxVolume: 0.7,
};

export function loadSettings(): GameSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_SETTINGS };
    const parsed = JSON.parse(raw) as Partial<GameSettings>;
    return {
      soundEnabled: parsed.soundEnabled ?? DEFAULT_SETTINGS.soundEnabled,
      sfxVolume: clampVolume(parsed.sfxVolume ?? DEFAULT_SETTINGS.sfxVolume),
    };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

export function saveSettings(settings: GameSettings): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
}

export function setSoundEnabled(enabled: boolean): GameSettings {
  const settings = { ...loadSettings(), soundEnabled: enabled };
  saveSettings(settings);
  return settings;
}

export function setSfxVolume(volume: number): GameSettings {
  const settings = { ...loadSettings(), sfxVolume: clampVolume(volume) };
  saveSettings(settings);
  return settings;
}

function clampVolume(volume: number): number {
  return Math.max(0, Math.min(1, volume));
}
