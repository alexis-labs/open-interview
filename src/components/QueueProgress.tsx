import { useGameStore } from '../game/store/gameStore';

export function QueueProgress() {
  const candidateIndex = useGameStore((s) => s.candidateIndex);
  const candidates = useGameStore((s) => s.candidates);
  const phase = useGameStore((s) => s.phase);

  if (phase !== 'playing') return null;

  const progress = candidates.length > 0 ? (candidateIndex / candidates.length) * 100 : 0;
  const served = candidateIndex;

  return (
    <div className="queue-progress">
      <div className="queue-progress__header">
        <span className="queue-progress__label">Daily Queue</span>
        <span className="queue-progress__count">
          {served} served · {candidates.length - served} remaining
        </span>
      </div>
      <div className="queue-progress__track">
        <div className="queue-progress__fill queue-progress__fill--snap" style={{ width: `${progress}%` }} />
        {candidates.map((_, i) => (
          <div
            key={i}
            className={`queue-progress__tick ${i < candidateIndex ? 'queue-progress__tick--done' : ''} ${i === candidateIndex ? 'queue-progress__tick--active' : ''}`}
            style={{ left: `${((i + 0.5) / candidates.length) * 100}%` }}
          />
        ))}
      </div>
    </div>
  );
}
