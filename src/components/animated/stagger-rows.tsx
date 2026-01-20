'use client';

import { useAnimate } from 'motion/react-mini';
import { stagger } from 'motion/react';
import { useEffect, useRef } from 'react';
import { prefersReducedMotion, STAGGER_DELAY } from '@/lib/animations';

interface StaggerRowsProps {
  children: React.ReactNode;
  /** Delay between each row animation in ms. Default: 50 */
  staggerDelay?: number;
  /** CSS selector for row elements. Default: '[data-row]' */
  selector?: string;
  /** Whether to run animation. Default: true */
  animate?: boolean;
  className?: string;
}

/**
 * Wraps table rows to animate them with staggered entrance.
 * Uses Motion's useAnimate (2.3KB) for orchestrated animation.
 *
 * Usage:
 * <StaggerRows>
 *   <tbody>
 *     {rows.map(row => <tr key={row.id} data-row>...</tr>)}
 *   </tbody>
 * </StaggerRows>
 *
 * Each child with data-row attribute will animate in sequence.
 */
export function StaggerRows({
  children,
  staggerDelay = STAGGER_DELAY.normal,
  selector = '[data-row]',
  animate = true,
  className,
}: StaggerRowsProps) {
  const [scope, animateRows] = useAnimate();
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!animate || hasAnimated.current) return;

    // Check reduced motion preference
    if (prefersReducedMotion()) {
      // Make rows visible immediately
      const rows = scope.current?.querySelectorAll(selector);
      rows?.forEach((row: Element) => {
        (row as HTMLElement).style.opacity = '1';
      });
      hasAnimated.current = true;
      return;
    }

    // Set initial state (invisible)
    const rows = scope.current?.querySelectorAll(selector);
    rows?.forEach((row: Element) => {
      (row as HTMLElement).style.opacity = '0';
    });

    // Animate rows with stagger
    animateRows(
      selector,
      { opacity: [0, 1], y: [8, 0] },
      {
        delay: stagger(staggerDelay / 1000), // Convert ms to seconds
        duration: 0.2,
        ease: 'easeOut',
      }
    );

    hasAnimated.current = true;
  }, [animate, animateRows, scope, selector, staggerDelay]);

  return (
    <div ref={scope} className={className}>
      {children}
    </div>
  );
}
