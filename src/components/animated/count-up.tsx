'use client';

import { useEffect, useRef, useState } from 'react';
import { prefersReducedMotion, ANIMATION_DURATION } from '@/lib/animations';

interface CountUpProps {
  /** Final number value */
  end: number;
  /** Animation duration in ms. Default: 1000 */
  duration?: number;
  /** Prefix string (e.g., "$") */
  prefix?: string;
  /** Suffix string (e.g., "M", "%") */
  suffix?: string;
  /** Number of decimal places. Default: 0 */
  decimals?: number;
  /** Start animation immediately. Default: true */
  autoStart?: boolean;
  /** Custom formatter function */
  formatter?: (value: number) => string;
  className?: string;
}

/**
 * Animated number counter that counts up from 0 to the target value.
 * Uses requestAnimationFrame for smooth 60fps animation.
 * Respects prefers-reduced-motion by showing final value immediately.
 */
export function CountUp({
  end,
  duration = ANIMATION_DURATION.sequence,
  prefix = '',
  suffix = '',
  decimals = 0,
  autoStart = true,
  formatter,
  className,
}: CountUpProps) {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const startTimeRef = useRef<number | null>(null);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    if (!autoStart || hasAnimated) return;

    // Check reduced motion preference
    if (prefersReducedMotion()) {
      setCount(end);
      setHasAnimated(true);
      return;
    }

    const animate = (timestamp: number) => {
      if (!startTimeRef.current) {
        startTimeRef.current = timestamp;
      }

      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);

      // Ease-out cubic for natural deceleration
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setCount(easeOut * end);

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      } else {
        setCount(end); // Ensure exact final value
        setHasAnimated(true);
      }
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
      startTimeRef.current = null;
    };
  }, [end, duration, autoStart, hasAnimated]);

  // Format the number
  const formatted = formatter
    ? formatter(count)
    : count.toFixed(decimals);

  return (
    <span className={`tabular-nums ${className || ''}`}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}

/**
 * Format large numbers with K/M/B suffix
 */
export function formatCompactNumber(value: number): string {
  if (value >= 1_000_000_000) {
    return (value / 1_000_000_000).toFixed(2) + 'B';
  }
  if (value >= 1_000_000) {
    return (value / 1_000_000).toFixed(2) + 'M';
  }
  if (value >= 1_000) {
    return (value / 1_000).toFixed(1) + 'K';
  }
  return value.toFixed(0);
}
