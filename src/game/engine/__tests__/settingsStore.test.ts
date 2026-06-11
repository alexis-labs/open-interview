import { afterEach, describe, expect, it } from 'vitest';
import { loadSettings, setSoundEnabled, setSfxVolume } from '../settingsStore';

const STORAGE_KEY = 'open-interview-settings';

afterEach(() => {
  localStorage.removeItem(STORAGE_KEY);
});

describe('settingsStore', () => {
  it('returns defaults when nothing saved', () => {
    expect(loadSettings()).toEqual({ soundEnabled: true, sfxVolume: 0.7 });
  });

  it('persists sound toggle', () => {
    setSoundEnabled(false);
    expect(loadSettings().soundEnabled).toBe(false);
  });

  it('clamps sfx volume', () => {
    setSfxVolume(2);
    expect(loadSettings().sfxVolume).toBe(1);
    setSfxVolume(-1);
    expect(loadSettings().sfxVolume).toBe(0);
  });
});
