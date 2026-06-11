import { POLICY_RULES } from '../game/data/rules';
import { useGameStore } from '../game/store/gameStore';

export function RecruiterChecklist() {
  const ruleContext = useGameStore((s) => s.ruleContext);
  const reviewedRuleIds = useGameStore((s) => s.reviewedRuleIds);
  const toggleRuleReview = useGameStore((s) => s.toggleRuleReview);
  const phase = useGameStore((s) => s.phase);

  if (phase !== 'playing') {
    return (
      <div className="recruiter-checklist recruiter-checklist--idle">
        <span className="recruiter-checklist__label">INSPECTOR LOG</span>
        <p>Tap rules you have checked — your notes only.</p>
      </div>
    );
  }

  const active = new Set(ruleContext.activeRuleIds);
  const reviewed = new Set(reviewedRuleIds);

  return (
    <div className="recruiter-checklist">
      <span className="recruiter-checklist__label">INSPECTOR LOG</span>
      <p className="recruiter-checklist__hint">Tap rules you have checked — your notes only.</p>
      <ul className="recruiter-checklist__list">
        {POLICY_RULES.map((rule) => {
          if (!active.has(rule.id)) {
            return (
              <li key={rule.id} className="recruiter-checklist__item recruiter-checklist__item--locked">
                <span className="recruiter-checklist__icon">🔒</span>
                {rule.title}
              </li>
            );
          }
          const isReviewed = reviewed.has(rule.id);
          return (
            <li key={rule.id}>
              <button
                type="button"
                className={`recruiter-checklist__item recruiter-checklist__item--toggle ${isReviewed ? 'recruiter-checklist__item--reviewed' : ''}`}
                onClick={() => toggleRuleReview(rule.id)}
              >
                <span className="recruiter-checklist__icon">{isReviewed ? '☑' : '☐'}</span>
                {rule.title}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
