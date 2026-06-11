import type { CSSProperties } from 'react';
import { useGameStore } from '../game/store/gameStore';

const CHIP_OFFSETS = [
  { x: -48, y: -72, rot: -28 },
  { x: 36, y: -88, rot: 18 },
  { x: -72, y: -40, rot: -42 },
  { x: 64, y: -52, rot: 32 },
  { x: 0, y: -96, rot: 6 },
];

export function MoneyPopup() {
  const moneyDelta = useGameStore((s) => s.moneyDelta);
  const juiceKey = useGameStore((s) => s.juiceKey);
  const juicePhase = useGameStore((s) => s.juicePhase);

  if (moneyDelta === null || juicePhase !== 'resolve') return null;

  const positive = moneyDelta > 0;
  const amount = Math.abs(moneyDelta);

  return (
    <div className="money-burst" key={juiceKey}>
      {CHIP_OFFSETS.map((chip, i) => (
        <span
          key={i}
          className={`money-burst__chip ${positive ? 'money-burst__chip--gain' : 'money-burst__chip--loss'}`}
          style={
            {
              '--chip-x': `${chip.x}px`,
              '--chip-y': `${chip.y}px`,
              '--chip-rot': `${chip.rot}deg`,
              '--chip-delay': `${i * 0.04}s`,
            } as CSSProperties
          }
        >
          {positive ? '+' : '−'}${amount}
        </span>
      ))}
      <span
        className={`money-burst__main ${positive ? 'money-burst__main--gain' : 'money-burst__main--loss'}`}
        style={{ '--main-delay': '0.15s' } as CSSProperties}
      >
        {positive ? '+' : '−'}${amount}
      </span>
    </div>
  );
}
