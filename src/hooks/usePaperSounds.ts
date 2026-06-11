import { useCallback } from 'react';
import { SOUND_IDS } from '../game/audio/soundIds';
import { soundManager } from '../game/audio/soundManager';

export function usePaperSounds() {
  const paperHover = useCallback(() => {
    soundManager.play(SOUND_IDS.uiHover, { volume: 0.55, pitch: 0.96 });
  }, []);

  const paperPress = useCallback(() => {
    soundManager.play(SOUND_IDS.uiConfirm, { volume: 0.65, pitch: 0.98 });
  }, []);

  return { paperHover, paperPress };
}
