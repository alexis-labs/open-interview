import { useGameStore } from '../game/store/gameStore';
import { CandidateAvatar } from './CandidateAvatar';

export function CandidateSlot() {
  const candidateIndex = useGameStore((s) => s.candidateIndex);
  const candidates = useGameStore((s) => s.candidates);
  const stampVisible = useGameStore((s) => s.stampVisible);

  const candidate = candidates[candidateIndex];
  if (!candidate) return null;

  return (
    <div className="candidate-slot candidate-slot--compact">
      <div className="candidate-slot__frame">
        <CandidateAvatar name={candidate.application.fullName} index={candidateIndex} size="sm" />
        <div className="candidate-slot__info">
          <span className="candidate-slot__name">{candidate.application.fullName}</span>
          <span className="candidate-slot__meta">
            {candidate.application.position} · {candidateIndex + 1}/{candidates.length}
            {stampVisible && ' · …'}
          </span>
          {!stampVisible && (
            <span className="candidate-slot__quip">{candidate.waitingQuip}</span>
          )}
        </div>
      </div>
    </div>
  );
}
