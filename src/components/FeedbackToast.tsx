import { useGameStore } from '../game/store/gameStore';

export function FeedbackToast() {
  const feedbackToast = useGameStore((s) => s.feedbackToast);
  const feedbackFlash = useGameStore((s) => s.feedbackFlash);
  const juiceKey = useGameStore((s) => s.juiceKey);

  if (!feedbackToast || !feedbackFlash) return null;

  return (
    <div key={juiceKey} className={`feedback-toast feedback-toast--${feedbackFlash}`}>
      <span className="feedback-toast__icon">{feedbackFlash === 'correct' ? '✓' : '✗'}</span>
      <span>{feedbackToast}</span>
    </div>
  );
}
