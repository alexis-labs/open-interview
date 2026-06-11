import { useGameStore } from '../game/store/gameStore';

export function JuiceFlash() {
  const feedbackFlash = useGameStore((s) => s.feedbackFlash);
  const juiceKey = useGameStore((s) => s.juiceKey);
  const juicePhase = useGameStore((s) => s.juicePhase);

  if (!feedbackFlash || juicePhase !== 'resolve') return null;

  return (
    <div
      key={juiceKey}
      className={`juice-flash juice-flash--${feedbackFlash}`}
      aria-hidden="true"
    />
  );
}
