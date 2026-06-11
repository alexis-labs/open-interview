import { type CSSProperties, useEffect, useRef, useState } from 'react';
import { SOUND_IDS } from '../game/audio/soundIds';
import { soundManager } from '../game/audio/soundManager';
import { getDayConfig, TOTAL_DAYS } from '../game/data/days';
import { CAMPAIGN_ENDING, GAME_OVER_LETTER, getDayEpilogue } from '../game/data/story';
import { formatViolationSummary } from '../game/engine/decisionFeedback';
import { CORRECT_REWARD, useGameStore, WRONG_PENALTY } from '../game/store/gameStore';

interface DaySummaryProps {
  inline?: boolean;
}

const SEAL_BURSTS = [
  { x: -38, y: -22, s: 0.65 },
  { x: 34, y: -30, s: 0.5 },
  { x: -18, y: 36, s: 0.55 },
  { x: 42, y: 18, s: 0.45 },
  { x: 0, y: -44, s: 0.7 },
  { x: -48, y: 6, s: 0.4 },
];

function useAnimatedNumber(
  target: number,
  from: number,
  duration = 900,
  delay = 0,
) {
  const [value, setValue] = useState(from);

  useEffect(() => {
    setValue(from);
    if (target === from) return;

    let raf = 0;
    const timeout = window.setTimeout(() => {
      const t0 = performance.now();
      const tick = (now: number) => {
        const t = Math.min(1, (now - t0) / duration);
        const eased = 1 - (1 - t) ** 3;
        setValue(Math.round(from + (target - from) * eased));
        if (t < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }, delay);

    return () => {
      window.clearTimeout(timeout);
      cancelAnimationFrame(raf);
    };
  }, [target, from, duration, delay]);

  return value;
}

export function DaySummary({ inline = false }: DaySummaryProps) {
  const sealPlayedRef = useRef(false);
  const phase = useGameStore((s) => s.phase);
  const money = useGameStore((s) => s.money);
  const mistakes = useGameStore((s) => s.mistakes);
  const dayRecords = useGameStore((s) => s.dayRecords);
  const candidates = useGameStore((s) => s.candidates);
  const dayId = useGameStore((s) => s.dayId);
  const dayPassed = useGameStore((s) => s.dayPassed);
  const continueToNextDay = useGameStore((s) => s.continueToNextDay);
  const retryDay = useGameStore((s) => s.retryDay);
  const goToMenu = useGameStore((s) => s.goToMenu);

  useEffect(() => {
    if (phase !== 'summary' && phase !== 'gameover') return;
    if (sealPlayedRef.current) return;
    sealPlayedRef.current = true;
    const timer = window.setTimeout(() => {
      soundManager.play(SOUND_IDS.seal);
    }, 480);
    return () => window.clearTimeout(timer);
  }, [phase]);

  if (phase !== 'summary' && phase !== 'gameover') return null;

  const day = getDayConfig(dayId);
  const correctCount = dayRecords.filter((r) => r.correct).length;
  const wrongRecords = dayRecords.filter((r) => !r.correct);
  const isGameOver = phase === 'gameover';
  const grade =
    mistakes === 0 ? 'EXEMPLARY' : mistakes <= day.maxMistakesToPass ? 'ADEQUATE' : 'UNSATISFACTORY';
  const perfectPay = day.startingMoney + candidates.length * CORRECT_REWARD;
  const canContinue = dayPassed && dayId < TOTAL_DAYS;
  const epilogue = getDayEpilogue(dayId);
  const campaignComplete = dayPassed && dayId === TOTAL_DAYS;
  const isPerfect = !isGameOver && dayPassed && mistakes === 0;
  const accuracy = dayRecords.length > 0 ? correctCount / dayRecords.length : 0;

  const outcomeClass = isGameOver
    ? 'day-summary--gameover'
    : isPerfect
      ? 'day-summary--perfect'
      : dayPassed
        ? 'day-summary--pass'
        : 'day-summary--warn';

  const displayMoney = useAnimatedNumber(money, day.startingMoney, 1000, 520);
  const displayMistakes = useAnimatedNumber(mistakes, 0, 650, 680);
  const displayCorrect = useAnimatedNumber(correctCount, 0, 750, 760);

  const spreadClass = inline ? 'day-summary--spread' : '';
  const inner = (
      <div
        className={`day-summary day-summary--reveal ${outcomeClass} ${inline ? 'day-summary--inline' : ''} ${spreadClass}`}
      >
        <div className="day-summary__fx" aria-hidden="true">
          <span className="day-summary__fx-glow" />
          <span className="day-summary__fx-grain" />
          {isPerfect && <span className="day-summary__fx-shimmer" />}
          {isGameOver && <span className="day-summary__fx-smudge" />}
        </div>

        <aside className="day-summary__panel day-summary__panel--left">
          <div className="day-summary__letterhead">
            <span className="day-summary__corp">OPENCORP INC.</span>
            <span className="day-summary__dept">Human Resources Division</span>
            <span className="day-summary__confidential">CONFIDENTIAL</span>
          </div>

          <div className="day-summary__title-block">
            <span className="day-summary__stamp-line" aria-hidden="true" />
            <h2>{isGameOver ? GAME_OVER_LETTER.subject : 'Daily Performance Review'}</h2>
          </div>
          <p className="day-summary__subtitle">
            {isGameOver
              ? 'Payroll depleted. Brenda has drafted your exit paperwork.'
              : `Day ${day.id} ${day.title} — ${candidates.length} souls processed`}
          </p>

          {isGameOver && (
            <div className="day-summary__letter">
              {GAME_OVER_LETTER.body.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
          )}

          {!isGameOver && epilogue && (
            <p className="day-summary__epilogue">{dayPassed ? epilogue.pass : epilogue.fail}</p>
          )}

          {campaignComplete && (
            <p className="day-summary__ending">{CAMPAIGN_ENDING}</p>
          )}

          {!isGameOver && (
            <div className={`day-summary__grade ${dayPassed ? 'day-summary__grade--pass' : 'day-summary__grade--fail'}`}>
              {dayPassed ? (
                <>
                  Shift passed (≤{day.maxMistakesToPass} errors). Rating: <strong>{grade}</strong>
                  {dayId < TOTAL_DAYS && ` — Continue to Day ${dayId + 1}`}
                </>
              ) : (
                <>Shift failed — {mistakes} errors exceeds limit of {day.maxMistakesToPass}. Retry to advance.</>
              )}
            </div>
          )}

          <div className="day-summary__accuracy" aria-hidden="true">
            <span className="day-summary__accuracy-label">Shift accuracy</span>
            <span className="day-summary__accuracy-track">
              <span
                className="day-summary__accuracy-fill"
                style={{ '--accuracy': `${Math.round(accuracy * 100)}%` } as CSSProperties}
              />
            </span>
          </div>
        </aside>

        <main className="day-summary__panel day-summary__panel--center">
          {wrongRecords.length > 0 && (
            <section className="day-summary__mistake-review" aria-label="Error review">
              <div className="day-summary__mistake-head">
                <span className="day-summary__mistake-label">What went wrong</span>
                <span className="day-summary__mistake-meta">
                  {wrongRecords.length} error{wrongRecords.length === 1 ? '' : 's'} to review
                </span>
              </div>
              <ul className="day-summary__mistake-list">
                {wrongRecords.map((record) => (
                  <li key={record.candidateName} className="day-summary__mistake-item">
                    <span className="day-summary__mistake-name">{record.candidateName}</span>
                    <span className={`day-summary__decision day-summary__decision--${record.decision}`}>
                      {record.decision.toUpperCase()}
                    </span>
                    <p className="day-summary__mistake-reason">
                      {record.wrongReason ?? 'Incorrect decision'}
                    </p>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <div className="day-summary__table-head">
            <span className="day-summary__table-label">Decision log</span>
            <span className="day-summary__table-meta">{dayRecords.length} entries · shift closed</span>
          </div>
          <table className="day-summary__table">
            <thead>
              <tr>
                <th>Candidate</th>
                <th>Decision</th>
                <th>Policy issues</th>
                <th>Result</th>
              </tr>
            </thead>
            <tbody>
              {dayRecords.map((record, index) => (
                <tr
                  key={record.candidateName}
                  className={`day-summary__row ${record.correct ? 'row--correct' : 'row--wrong'}`}
                  style={{ '--row-i': index } as CSSProperties}
                >
                  <td>{record.candidateName}</td>
                  <td>
                    <span className={`day-summary__decision day-summary__decision--${record.decision}`}>
                      {record.decision.toUpperCase()}
                    </span>
                  </td>
                  <td className="day-summary__violations">
                    {record.violations.length === 0
                      ? '—'
                      : formatViolationSummary(record.violations)}
                    {!record.correct && record.wrongReason && (
                      <span className="day-summary__row-mistake">{record.wrongReason}</span>
                    )}
                  </td>
                  <td>{record.correct ? `+$${CORRECT_REWARD}` : `-$${WRONG_PENALTY}`}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {!isGameOver && (
            <p className="day-summary__note">Perfect shift earns ${perfectPay}.</p>
          )}
        </main>

        <aside className="day-summary__panel day-summary__panel--right">
          <div className="day-summary__seal-wrap">
            <div className="day-summary__seal" aria-hidden="true">
              <span className="day-summary__seal-inner">
                {isGameOver ? 'FAIL' : dayPassed ? 'PASS' : 'WARN'}
              </span>
            </div>
            <div className={`day-summary__seal-burst day-summary__seal-burst--${isGameOver ? 'fail' : dayPassed ? 'pass' : 'warn'}`} aria-hidden="true">
              {SEAL_BURSTS.map((burst, i) => (
                <span
                  key={i}
                  className="day-summary__seal-dot"
                  style={
                    {
                      '--bx': `${burst.x}px`,
                      '--by': `${burst.y}px`,
                      '--bs': burst.s,
                      '--bd': `${0.42 + i * 0.035}s`,
                    } as CSSProperties
                  }
                />
              ))}
            </div>
          </div>

          <div className="day-summary__stats">
            <div className="day-summary__stat-card" style={{ '--stat-i': 0 } as CSSProperties}>
              <span className="day-summary__stat-label">Final Balance</span>
              <span className="day-summary__stat-value">${displayMoney}</span>
            </div>
            <div className="day-summary__stat-card" style={{ '--stat-i': 1 } as CSSProperties}>
              <span className="day-summary__stat-label">Errors</span>
              <span className={`day-summary__stat-value ${mistakes > day.maxMistakesToPass ? 'day-summary__stat-value--bad' : ''}`}>
                {displayMistakes}
              </span>
            </div>
            <div className="day-summary__stat-card" style={{ '--stat-i': 2 } as CSSProperties}>
              <span className="day-summary__stat-label">Correct</span>
              <span className="day-summary__stat-value">
                {displayCorrect}/{dayRecords.length}
              </span>
            </div>
          </div>

          <div className="day-summary__actions">
            {canContinue && (
              <button type="button" className="day-summary__continue" onClick={continueToNextDay}>
                Continue to Day {dayId + 1}
              </button>
            )}
            <button type="button" className="day-summary__reset" onClick={retryDay}>
              Retry Shift
            </button>
            <button type="button" className="day-summary__menu" onClick={goToMenu}>
              Main Menu
            </button>
          </div>
        </aside>
      </div>
  );

  if (inline) {
    return (
      <div className={`desk-summary-stage desk-summary-stage--reveal ${outcomeClass}`}>
        {inner}
      </div>
    );
  }

  return (
    <div className={`day-summary-overlay day-summary-overlay--reveal ${isGameOver ? 'day-summary-overlay--gameover' : ''}`}>
      {inner}
    </div>
  );
}
