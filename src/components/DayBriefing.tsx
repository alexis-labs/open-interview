import { getDayConfig, TOTAL_DAYS } from '../game/data/days';
import { POLICY_RULES } from '../game/data/rules';
import { CHARACTERS } from '../game/data/story';
import { useGameStore } from '../game/store/gameStore';

interface DayBriefingProps {
  inline?: boolean;
}

export function DayBriefing({ inline = false }: DayBriefingProps) {
  const dayId = useGameStore((s) => s.dayId);
  const startShift = useGameStore((s) => s.startShift);
  const goToMenu = useGameStore((s) => s.goToMenu);
  const day = getDayConfig(dayId);
  const newRules = POLICY_RULES.filter((r) => day.newRuleIds.includes(r.id));
  const bodyLines = day.briefing.filter((line) => !line.startsWith('From:'));

  const content = (
    <div className={`day-briefing day-briefing--memo ${inline ? 'day-briefing--inline' : ''}`}>
      <header className="day-briefing__letterhead">
        <div className="day-briefing__letterhead-text">
          <span className="day-briefing__corp">OPENCORP INC.</span>
          <span className="day-briefing__dept">Human Resources Division</span>
        </div>
        <span className="day-briefing__stamp">INTERNAL</span>
      </header>

      <dl className="day-briefing__meta">
        <div className="day-briefing__meta-row">
          <dt>From</dt>
          <dd>
            {CHARACTERS.boss.name}
            <span className="day-briefing__meta-sub">{CHARACTERS.boss.title}</span>
          </dd>
        </div>
        <div className="day-briefing__meta-row">
          <dt>To</dt>
          <dd>Booth 3 Screener</dd>
        </div>
        <div className="day-briefing__meta-row">
          <dt>Date</dt>
          <dd>
            Day {day.id} of {TOTAL_DAYS} · {day.title}
          </dd>
        </div>
        <div className="day-briefing__meta-row">
          <dt>Ref</dt>
          <dd>{CHARACTERS.boss.email}</dd>
        </div>
      </dl>

      <h2 className="day-briefing__subject">{day.memoSubject}</h2>

      <p className="day-briefing__epigraph">{day.subtitle}</p>

      <div className="day-briefing__body">
        <ul className="day-briefing__points">
          {bodyLines.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      </div>

      {newRules.length > 0 && (
        <div className="day-briefing__policies">
          <strong>{day.id === 1 ? 'Active policies' : 'New policies today'}</strong>
          <ol>
            {newRules.map((r) => (
              <li key={r.id}>
                <span className="day-briefing__policy-title">
                  Rule {r.id}: {r.title}
                </span>
                {r.flavor && <em className="day-briefing__flavor">{r.flavor}</em>}
              </li>
            ))}
          </ol>
        </div>
      )}

      <div className="day-briefing__targets">
        <div className="day-briefing__target">
          <span className="day-briefing__target-label">Max errors</span>
          <span className="day-briefing__target-value">≤{day.maxMistakesToPass}</span>
        </div>
        <div className="day-briefing__target">
          <span className="day-briefing__target-label">Shift budget</span>
          <span className="day-briefing__target-value">${day.startingMoney}</span>
        </div>
        <div className="day-briefing__target">
          <span className="day-briefing__target-label">Salary cap</span>
          <span className="day-briefing__target-value">${day.salaryCap.toLocaleString()}</span>
        </div>
      </div>

      <footer className="day-briefing__signature">
        <span className="day-briefing__sign-name">{CHARACTERS.boss.name}</span>
        <span className="day-briefing__sign-title">{CHARACTERS.boss.title}</span>
      </footer>

      <div className="day-briefing__actions">
        <button type="button" className="day-briefing__start" onClick={startShift}>
          Begin Shift
        </button>
        <button type="button" className="day-briefing__cancel" onClick={goToMenu}>
          Back
        </button>
      </div>
    </div>
  );

  if (inline) {
    return <div className="desk-dossier__briefing">{content}</div>;
  }

  return <div className="day-briefing-overlay">{content}</div>;
}
