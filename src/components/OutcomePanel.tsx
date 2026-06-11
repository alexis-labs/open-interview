import { getDayConfig } from '../game/data/days';
import { CORRECT_REWARD, useGameStore, WRONG_PENALTY } from '../game/store/gameStore';

export function OutcomePanel() {
  const moneyDelta = useGameStore((s) => s.moneyDelta);
  const feedbackToast = useGameStore((s) => s.feedbackToast);
  const feedbackFlash = useGameStore((s) => s.feedbackFlash);
  const mistakes = useGameStore((s) => s.mistakes);
  const dayId = useGameStore((s) => s.dayId);
  const candidateIndex = useGameStore((s) => s.candidateIndex);
  const candidates = useGameStore((s) => s.candidates);
  const dayRecords = useGameStore((s) => s.dayRecords);
  const phase = useGameStore((s) => s.phase);
  const day = getDayConfig(dayId);

  const atRisk = mistakes >= day.maxMistakesToPass;
  const served = candidateIndex;
  const total = candidates.length;
  const progress = total > 0 ? (served / total) * 100 : 0;
  const correct = dayRecords.filter((r) => r.correct).length;

  return (
    <div className="outcome-panel">
      <div className="outcome-panel__head">
        <span className="outcome-panel__label">SHIFT FEED</span>
        {phase === 'playing' && total > 0 && (
          <span className="outcome-panel__queue">
            Queue {served}/{total}
          </span>
        )}
      </div>

      {phase !== 'playing' && (
        <p className="outcome-panel__idle">Queue progress and decision feedback appear during interviews.</p>
      )}

      {phase === 'playing' && total > 0 && (
        <div className="outcome-panel__progress">
          <div className="outcome-panel__progress-track">
            <div className="outcome-panel__progress-fill" style={{ width: `${progress}%` }} />
          </div>
          <div className="outcome-panel__progress-stats">
            <span>{total - served} waiting</span>
            <span>
              {dayRecords.length > 0 ? `${correct}/${dayRecords.length} correct` : 'No decisions yet'}
            </span>
          </div>
        </div>
      )}

      {phase === 'playing' && moneyDelta !== null && (
        <div className={`outcome-panel__delta ${moneyDelta > 0 ? 'outcome-panel__delta--gain' : 'outcome-panel__delta--loss'}`}>
          <span>Budget impact</span>
          <strong>{moneyDelta > 0 ? '+' : ''}${Math.abs(moneyDelta)}</strong>
        </div>
      )}

      {phase === 'playing' && feedbackToast && feedbackFlash && (
        <div className={`outcome-panel__toast outcome-panel__toast--${feedbackFlash}`}>
          {feedbackToast}
        </div>
      )}

      {phase === 'playing' && (
        <div className="outcome-panel__metrics">
          <div className="outcome-panel__metric">
            <span>Reward / error</span>
            <span>+${CORRECT_REWARD} / −${WRONG_PENALTY}</span>
          </div>
          <div className="outcome-panel__metric">
            <span>Cap</span>
            <span>${day.salaryCap.toLocaleString()}</span>
          </div>
        </div>
      )}

      {phase === 'playing' && atRisk && (
        <div className="outcome-panel__warning">
          ⚠ Error threshold reached — Brenda notified
        </div>
      )}
    </div>
  );
}
