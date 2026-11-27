import { useEffect, useState } from 'react';

interface AnimatedCounterProps {
  target: number;
  suffix?: string;
}

export function AnimatedCounter({ target, suffix = '' }: AnimatedCounterProps) {
  const [displayValue, setDisplayValue] = useState(target);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion || target <= 0) {
      setDisplayValue(target);
      return;
    }

    let frameId = 0;
    const duration = 520;
    const startTime = performance.now();

    const step = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - (1 - progress) * (1 - progress);
      setDisplayValue(Math.round(target * eased));
      if (progress < 1) {
        frameId = window.requestAnimationFrame(step);
      }
    };

    frameId = window.requestAnimationFrame(step);
    return () => window.cancelAnimationFrame(frameId);
  }, [target]);

  return (
    <span>
      {displayValue.toLocaleString()}
      {suffix}
    </span>
  );
}
