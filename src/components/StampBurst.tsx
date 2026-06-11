import type { CSSProperties } from 'react';
import { useGameStore } from '../game/store/gameStore';

const BURSTS = [
  { x: -55, y: -30, s: 0.7 },
  { x: 48, y: -42, s: 0.55 },
  { x: -30, y: 50, s: 0.6 },
  { x: 60, y: 28, s: 0.5 },
  { x: 0, y: -65, s: 0.8 },
  { x: -70, y: 10, s: 0.45 },
];

export function StampBurst() {
  const stampVisible = useGameStore((s) => s.stampVisible);
  const stampType = useGameStore((s) => s.stampType);
  const juiceKey = useGameStore((s) => s.juiceKey);

  if (!stampVisible || !stampType) return null;

  return (
    <div className={`stamp-burst stamp-burst--${stampType}`} key={juiceKey} aria-hidden="true">
      {BURSTS.map((b, i) => (
        <span
          key={i}
          className="stamp-burst__dot"
          style={
            {
              '--bx': `${b.x}px`,
              '--by': `${b.y}px`,
              '--bs': b.s,
              '--bd': `${i * 0.03}s`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}
