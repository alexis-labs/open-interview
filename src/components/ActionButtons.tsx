import { useCallback } from 'react';
import { SOUND_IDS } from '../game/audio/soundIds';
import { soundManager } from '../game/audio/soundManager';
import { useGameStore } from '../game/store/gameStore';

export function ActionButtons() {
  const hire = useGameStore((s) => s.hire);
  const reject = useGameStore((s) => s.reject);
  const juicePhase = useGameStore((s) => s.juicePhase);
  const lastDecision = useGameStore((s) => s.lastDecision);
  const phase = useGameStore((s) => s.phase);

  const disabled = juicePhase !== 'idle' || phase !== 'playing';

  const playHover = useCallback(() => {
    soundManager.play(SOUND_IDS.uiHover);
  }, []);

  const windupHire = juicePhase === 'windup' && lastDecision === 'hire';
  const windupReject = juicePhase === 'windup' && lastDecision === 'reject';
  const slamHire =
    lastDecision === 'hire' && (juicePhase === 'windup' || juicePhase === 'impact' || juicePhase === 'resolve');
  const slamReject =
    lastDecision === 'reject' && (juicePhase === 'windup' || juicePhase === 'impact' || juicePhase === 'resolve');

  return (
    <div className="action-buttons">
      <div className="action-buttons__pad action-buttons__pad--hire">
        <button
          type="button"
          className={`action-buttons__btn action-buttons__btn--hire ${slamHire ? 'action-buttons__btn--slam' : ''} ${windupHire ? 'action-buttons__btn--held' : ''}`}
          onClick={hire}
          onMouseEnter={playHover}
          disabled={disabled}
        >
          <span className="action-buttons__ink" />
          HIRE
        </button>
        <span className="action-buttons__label">Bless their payroll (H)</span>
      </div>
      <div className="action-buttons__pad action-buttons__pad--reject">
        <button
          type="button"
          className={`action-buttons__btn action-buttons__btn--reject ${slamReject ? 'action-buttons__btn--slam' : ''} ${windupReject ? 'action-buttons__btn--held' : ''}`}
          onClick={reject}
          onMouseEnter={playHover}
          disabled={disabled}
        >
          <span className="action-buttons__ink" />
          REJECT
        </button>
        <span className="action-buttons__label">Send to Brenda (X)</span>
      </div>
    </div>
  );
}
