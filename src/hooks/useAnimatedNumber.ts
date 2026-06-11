import { useEffect, useState } from 'react';

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function useAnimatedNumber(
  target: number,
  from: number,
  duration = 400,
  delay = 0,
  enabled = true,
): number {
  const [value, setValue] = useState(from);

  useEffect(() => {
    if (!enabled || prefersReducedMotion() || target === from) {
      setValue(target);
      return;
    }

    setValue(from);
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
  }, [target, from, duration, delay, enabled]);

  return value;
}
