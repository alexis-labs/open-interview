import { useGameStore } from '../game/store/gameStore';
import { CandidatePhoto } from './CandidatePhoto';
import { PolicyManual } from './PolicyManual';

export function CandidateColumn() {
  const candidateIndex = useGameStore((s) => s.candidateIndex);
  const candidates = useGameStore((s) => s.candidates);
  const phase = useGameStore((s) => s.phase);

  if (phase === 'briefing') {
    return (
      <aside className="candidate-col candidate-col--briefing">
        <header className="candidate-col__header">
          <span className="candidate-col__label">CANDIDATE FILE</span>
          <span className="candidate-col__id">SHIFT BRIEF</span>
        </header>
        <PolicyManual />
      </aside>
    );
  }

  if (phase !== 'playing') {
    return (
      <aside className="candidate-col candidate-col--idle">
        <div className="candidate-col__empty">
          <span className="candidate-col__empty-icon">◫</span>
          <p>Waiting for the next candidate</p>
        </div>
      </aside>
    );
  }

  const candidate = candidates[candidateIndex];
  if (!candidate) return null;

  const badge = candidate.idBadge;

  return (
    <aside className="candidate-col">
      <header className="candidate-col__header">
        <span className="candidate-col__label">CANDIDATE FILE</span>
        <span className="candidate-col__id">#{badge.badgeNumber}</span>
      </header>

      <div className="candidate-col__portrait">
        <CandidatePhoto
          key={candidate.id}
          candidateId={candidate.id}
          gender={candidate.gender}
          alt={`Photo of ${candidate.application.fullName}`}
          className="candidate-col__photo"
        />
        <div className="candidate-col__scanline" aria-hidden="true" />
      </div>

      <PolicyManual />
    </aside>
  );
}
