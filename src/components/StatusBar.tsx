import { useEffect, useRef, useState } from 'react';

import { getDayConfig } from '../game/data/days';

import { INTERCOM_MESSAGES } from '../game/data/story';

import { useGameStore } from '../game/store/gameStore';



export function StatusBar() {

  const money = useGameStore((s) => s.money);

  const mistakes = useGameStore((s) => s.mistakes);

  const candidateIndex = useGameStore((s) => s.candidateIndex);

  const candidates = useGameStore((s) => s.candidates);

  const phase = useGameStore((s) => s.phase);

  const dayId = useGameStore((s) => s.dayId);

  const moneyDelta = useGameStore((s) => s.moneyDelta);

  const feedbackFlash = useGameStore((s) => s.feedbackFlash);

  const moneyRef = useRef<HTMLSpanElement>(null);

  const mistakesRef = useRef<HTMLSpanElement>(null);

  const day = getDayConfig(dayId);

  const [intercomIdx, setIntercomIdx] = useState(0);



  const current = phase === 'playing' ? candidateIndex + 1 : candidates.length;



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

  useEffect(() => {

    if (phase !== 'playing') return;

    const timer = setInterval(() => {

      setIntercomIdx((i) => (i + 1) % INTERCOM_MESSAGES.length);

    }, 8000);

    return () => clearInterval(timer);

  }, [phase]);



  return (

    <header className="status-bar">

      <div className="status-bar__brand">

        <div className="status-bar__logo-wrap">

          <svg className="status-bar__mark" viewBox="0 0 32 32" aria-hidden="true">

            <rect x="2" y="2" width="28" height="28" rx="3" fill="none" stroke="currentColor" strokeWidth="2" />

            <path d="M8 22 L16 10 L24 22" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

          </svg>

          <span className="status-bar__logo">OPENCORP</span>

        </div>

        <span className="status-bar__division">

          Day {day.id} — {day.title} · Booth 3

        </span>

        {phase === 'playing' && (

          <p className="status-bar__intercom" key={intercomIdx}>

            {INTERCOM_MESSAGES[intercomIdx]}

          </p>

        )}

      </div>

      <div className="status-bar__stats">

        <div className="status-bar__pill status-bar__pill--money">

          <span className="status-bar__label">Payroll</span>

          <span ref={moneyRef} className="status-bar__value status-bar__value--money">

            ${money}

          </span>

        </div>

        <div className={`status-bar__pill ${mistakes > 0 ? 'status-bar__pill--alert' : ''}`}>

          <span className="status-bar__label">Errors</span>

          <span ref={mistakesRef} className="status-bar__value">{mistakes}</span>

        </div>

        <div className="status-bar__pill">

          <span className="status-bar__label">Queue</span>

          <span className="status-bar__value">

            {current}/{candidates.length}

          </span>

        </div>

      </div>

    </header>

  );

}


