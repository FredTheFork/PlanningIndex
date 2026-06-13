'use client';

import { useEffect, useState } from 'react';

export function useCountUp(target: number, duration = 1500, enabled = true): number {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!enabled) return;
    let animFrame: number;
    const start = performance.now();

    const step = (timestamp: number) => {
      const progress = Math.min((timestamp - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) {
        animFrame = requestAnimationFrame(step);
      } else {
        setCount(target);
      }
    };

    animFrame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animFrame);
  }, [target, duration, enabled]);

  return count;
}
