import { getDayConfig } from '../game/data/days';
import { POLICY_RULES } from '../game/data/rules';
import { useGameStore } from '../game/store/gameStore';
import { usePaperSounds } from '../hooks/usePaperSounds';

const ruleDocMap: Record<number, 'application' | 'idBadge' | 'resume' | 'reference'> = {
  1: 'application',
  2: 'application',
  3: 'idBadge',
  4: 'resume',
  5: 'reference',
  6: 'resume',
  7: 'application',
};

const docLabels: Record<(typeof ruleDocMap)[number], string> = {
  application: 'Application',
  idBadge: 'ID Badge',
  resume: 'Resume',
  reference: 'Reference',
};

export function PolicyManual() {
  const dayId = useGameStore((s) => s.dayId);
  const highlightedRuleId = useGameStore((s) => s.highlightedRuleId);
  const setHighlightedRule = useGameStore((s) => s.setHighlightedRule);
  const setActiveDocument = useGameStore((s) => s.setActiveDocument);
  const reviewedRuleIds = useGameStore((s) => s.reviewedRuleIds);
  const toggleRuleReview = useGameStore((s) => s.toggleRuleReview);
  const phase = useGameStore((s) => s.phase);
  const { paperHover, paperPress } = usePaperSounds();

  const day = getDayConfig(dayId);
  const activeSet = new Set(day.activeRuleIds);
  const reviewedSet = new Set(reviewedRuleIds);
  const activeRules = POLICY_RULES.filter((r) => activeSet.has(r.id));
  const focusRule =
    POLICY_RULES.find((r) => r.id === highlightedRuleId && activeSet.has(r.id)) ?? activeRules[0] ?? null;

  function handleRuleClick(ruleId: number) {
    if (!activeSet.has(ruleId)) return;
    setHighlightedRule(ruleId);
    setActiveDocument(ruleDocMap[ruleId]);
  }

  if (phase !== 'playing' && phase !== 'briefing') return null;

  return (
    <section className="policy-manual policy-manual--inspector">
      <header className="policy-manual__header">
        <span className="policy-manual__log-label">SHIFT RULES</span>
        <p className="policy-manual__day-line">
          Day {day.id} — {day.title}
        </p>
        <p className="policy-manual__shift-stats">
          Cap <strong>${day.salaryCap.toLocaleString()}</strong> · {activeRules.length} rules · max{' '}
          <strong>{day.maxMistakesToPass}</strong> errors
        </p>
      </header>

      {focusRule && (
        <article className="policy-manual__detail-panel" aria-live="polite">
          <div className="policy-manual__detail-head">
            <span className="policy-manual__detail-badge">Rule {focusRule.id}</span>
            <button
              type="button"
              className={`policy-manual__detail-review ${reviewedSet.has(focusRule.id) ? 'policy-manual__detail-review--done' : ''}`}
              onMouseEnter={paperHover}
              onFocus={paperHover}
              onClick={() => {
                paperPress();
                toggleRuleReview(focusRule.id);
              }}
            >
              {reviewedSet.has(focusRule.id) ? '☑ Reviewed' : '☐ Mark reviewed'}
            </button>
          </div>
          <h3 className="policy-manual__detail-title">{focusRule.title}</h3>
          <p className="policy-manual__detail-desc">{focusRule.description}</p>
          {focusRule.hint && (
            <p className="policy-manual__detail-hint">
              <span className="policy-manual__detail-hint-label">Where to check</span>
              {focusRule.hint}
            </p>
          )}
          {focusRule.flavor && <p className="policy-manual__detail-flavor">{focusRule.flavor}</p>}
          <p className="policy-manual__detail-doc">
            Document: <strong>{docLabels[ruleDocMap[focusRule.id]]}</strong>
          </p>
        </article>
      )}

      <div className="policy-manual__picker-label">Select a rule</div>
      <ol className="policy-manual__rules">
        {activeRules.map((rule) => {
          const isReviewed = reviewedSet.has(rule.id);
          const isSelected = focusRule?.id === rule.id;

          return (
            <li key={rule.id} className="policy-manual__rule-row">
              <button
                type="button"
                className={`policy-manual__rule-chip ${isSelected ? 'policy-manual__rule-chip--active' : ''} ${isReviewed ? 'policy-manual__rule-chip--reviewed' : ''}`}
                onMouseEnter={paperHover}
                onFocus={paperHover}
                onClick={() => {
                  paperPress();
                  handleRuleClick(rule.id);
                }}
                aria-pressed={isSelected}
              >
                <span className="policy-manual__rule-num">{rule.id}</span>
                <span className="policy-manual__rule-title">{rule.title}</span>
                {isReviewed && <span className="policy-manual__rule-check" aria-label="Reviewed">☑</span>}
              </button>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

