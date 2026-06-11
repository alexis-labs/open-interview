import { useEffect, useRef } from 'react';
import { getDayConfig } from '../game/data/days';
import { useAnimatedNumber } from '../hooks/useAnimatedNumber';
import { useGameStore } from '../game/store/gameStore';

export function CompanyStatusPanel() {
  const money = useGameStore((s) => s.money);
  const mistakes = useGameStore((s) => s.mistakes);
  const candidateIndex = useGameStore((s) => s.candidateIndex);
  const candidates = useGameStore((s) => s.candidates);
  const dayId = useGameStore((s) => s.dayId);
  const dayRecords = useGameStore((s) => s.dayRecords);
  const moneyDelta = useGameStore((s) => s.moneyDelta);
  const feedbackFlash = useGameStore((s) => s.feedbackFlash);
  const juicePhase = useGameStore((s) => s.juicePhase);
  const phase = useGameStore((s) => s.phase);
  const moneyRef = useRef<HTMLSpanElement>(null);
  const mistakesRef = useRef<HTMLSpanElement>(null);
  const day = getDayConfig(dayId);

  const served = phase === 'playing' ? candidateIndex : candidates.length;
  const correct = dayRecords.filter((r) => r.correct).length;
  const reputation = Math.max(0, 100 - mistakes * 12 - (dayRecords.length - correct) * 5);

  const shouldRoll = juicePhase === 'resolve' && moneyDelta !== null;
  const rollFrom = shouldRoll ? money - moneyDelta : money;
  const displayMoney = useAnimatedNumber(money, rollFrom, 400, shouldRoll ? 80 : 0, shouldRoll);

  useEffect(() => {
    if (!moneyRef.current || moneyDelta === null) return;
    moneyRef.current.classList.remove('status-bar__value--pop', 'status-bar__value--drop');
    void moneyRef.current.offsetWidth;
    moneyRef.current.classList.add(moneyDelta > 0 ? 'status-bar__value--pop' : 'status-bar__value--drop');
  }, [money, moneyDelta]);

  useEffect(() => {
    if (!mistakesRef.current || feedbackFlash !== 'wrong') return;
    mistakesRef.current.classList.remove('status-bar__value--mistake');
    void mistakesRef.current.offsetWidth;
    mistakesRef.current.classList.add('status-bar__value--mistake');
  }, [mistakes, feedbackFlash]);

  return (
    <div className="company-status">
      <span className="company-status__label">CORP STATUS</span>
      <div className="company-status__grid">
        <div className="company-status__cell">
          <span className="company-status__key">Day</span>
          <span className="company-status__val" title={`Day ${day.id} · ${day.title}`}>
            D{day.id} · {day.title}
          </span>
        </div>
        <div className="company-status__cell">
          <span className="company-status__key">Quota</span>
          <span className="company-status__val">{served}/{candidates.length || day.candidateCount}</span>
        </div>
        <div className="company-status__cell company-status__cell--money">
          <span className="company-status__key">Budget</span>
          <span ref={moneyRef} className="company-status__val company-status__val--money">${displayMoney}</span>
        </div>
        <div className="company-status__cell">
          <span className="company-status__key">Rep</span>
          <span className={`company-status__val ${reputation < 70 ? 'company-status__val--warn' : ''}`}>{reputation}%</span>
        </div>
        <div className="company-status__cell">
          <span className="company-status__key">Errors</span>
          <span ref={mistakesRef} className={`company-status__val ${mistakes > 0 ? 'company-status__val--bad' : ''}`}>{mistakes}</span>
        </div>
        <div className="company-status__cell">
          <span className="company-status__key">Hired</span>
          <span className="company-status__val">{correct}/{dayRecords.length || 0}</span>
        </div>
      </div>
    </div>
  );
}
