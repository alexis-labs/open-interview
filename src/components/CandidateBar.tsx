import { useGameStore } from '../game/store/gameStore';

function getReaction(
  stampVisible: boolean,
  stampType: 'hire' | 'reject' | null,
  feedbackFlash: 'correct' | 'wrong' | null,
): string | null {
  if (!stampVisible || !stampType) return null;
  if (stampType === 'hire' && feedbackFlash === 'correct') return '😊 "See you Monday!"';
  if (stampType === 'hire' && feedbackFlash === 'wrong') return '😬 "Wait, what?"';
  if (stampType === 'reject' && feedbackFlash === 'correct') return '😤 "This is unbelievable."';
  if (stampType === 'reject' && feedbackFlash === 'wrong') return '😰 "Thank god."';
  return null;
}

export function CandidateBar() {
  const candidateIndex = useGameStore((s) => s.candidateIndex);
  const candidates = useGameStore((s) => s.candidates);
  const stampVisible = useGameStore((s) => s.stampVisible);
  const stampType = useGameStore((s) => s.stampType);
  const feedbackFlash = useGameStore((s) => s.feedbackFlash);
  const phase = useGameStore((s) => s.phase);

  if (phase === 'briefing') {
    return (
      <div className="candidate-bar candidate-bar--briefing">
        <span className="candidate-bar__label">CANDIDATE QUEUE</span>
        <p className="candidate-bar__line">Review today&apos;s rules, then open the booth when ready.</p>
      </div>
    );
  }

  if (phase !== 'playing') {
    return (
      <div className="candidate-bar candidate-bar--idle">
        <span className="candidate-bar__label">CANDIDATE QUEUE</span>
        <p className="candidate-bar__line">No one at the window — start a shift to begin interviews.</p>
      </div>
    );
  }

  const candidate = candidates[candidateIndex];
  if (!candidate) return null;

  const reaction = getReaction(stampVisible, stampType, feedbackFlash);
  const badge = candidate.idBadge;
  const app = candidate.application;

  return (
    <div className="candidate-bar">
      <div className="candidate-bar__head">
        <span className="candidate-bar__label">ON DECK</span>
        <span className="candidate-bar__badge">#{badge.badgeNumber}</span>
      </div>
      <div className="candidate-bar__identity">
        <strong className="candidate-bar__name">{app.fullName}</strong>
        <span className="candidate-bar__role">{app.position}</span>
        <span className="candidate-bar__slot">{app.interviewSlot}</span>
      </div>
      <div className="candidate-bar__id">
        <span>ID: {badge.fullName}</span>
        <span>Exp {badge.expiryDate}</span>
      </div>
      <p className={`candidate-bar__speech ${reaction ? 'candidate-bar__speech--reaction' : ''}`}>
        {reaction ?? candidate.waitingQuip}
      </p>
    </div>
  );
}
