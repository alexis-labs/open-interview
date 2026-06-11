import { DAYS, TOTAL_DAYS } from '../game/data/days';
import { useGameStore } from '../game/store/gameStore';

export function RunProgress() {
  const progress = useGameStore((s) => s.progress);
  const runActive = useGameStore((s) => s.runActive);
  const dayId = useGameStore((s) => s.dayId);
  const runComplete = useGameStore((s) => s.runComplete);

  const currentDay = runActive ? dayId : progress.bestRunDay;
  const progressPct = Math.round((currentDay / TOTAL_DAYS) * 100);

  return (
    <div className="day-select run-progress">
      <div className="day-select__header">
        <h2>Run Progress</h2>
        <div className="day-select__progress" aria-label={`Day ${currentDay} of ${TOTAL_DAYS}`}>
          <div className="day-select__progress-track">
            <div className="day-select__progress-fill" style={{ width: `${progressPct}%` }} />
          </div>
          <span className="day-select__progress-label">
            Day {currentDay}/{TOTAL_DAYS}
            {progress.runsCompleted > 0 && ` · ${progress.runsCompleted} run${progress.runsCompleted === 1 ? '' : 's'} cleared`}
          </span>
        </div>
      </div>
      {runComplete && (
        <p className="run-progress__banner">Run complete — Brenda is mildly impressed.</p>
      )}
      <div className="day-select__grid run-progress__days">
        {DAYS.map((day) => {
          const reached = day.id <= progress.bestRunDay;
          const current = runActive && day.id === dayId;
          return (
            <article
              key={day.id}
              className={`day-select__card ${!reached ? 'day-select__card--locked' : ''} ${current ? 'day-select__card--active' : ''} ${reached ? 'day-select__card--done' : ''}`}
            >
              <header className="day-select__card-head">
                <span className="day-select__day-num">Day {day.id}</span>
                {reached && <span className="day-select__badge day-select__badge--done">Reached</span>}
              </header>
              <h3 className="day-select__day-title">{day.title}</h3>
              <p className="day-select__day-sub">{day.subtitle}</p>
              <footer className="day-select__day-meta">
                {day.candidateCount} cand. · {day.activeRuleIds.length} rules · ${day.startingMoney}
              </footer>
            </article>
          );
        })}
      </div>
    </div>
  );
}
