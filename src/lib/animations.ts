/**
 * Animation constants for consistent timing across the app
 *
 * Following CONTEXT.md principles:
 * - CSS animations first for simple states
 * - Motion library only for orchestration (stagger, sequences)
 * - All animations use transform/opacity only (GPU-accelerated)
 * - Respect prefers-reduced-motion
 */

/** Standard animation durations in milliseconds */
export const ANIMATION_DURATION = {
  /** Quick feedback (hover, click) */
  instant: 100,
  /** Standard transitions */
  fast: 150,
  /** Page transitions, fades */
  normal: 200,
  /** Complex animations */
  slow: 300,
  /** Orchestrated sequences */
  sequence: 500,
} as const;

/** Stagger delays for list animations */
export const STAGGER_DELAY = {
  /** Fast stagger for short lists */
  fast: 30,
  /** Standard stagger for table rows */
  normal: 50,
  /** Slow stagger for emphasis */
  slow: 80,
} as const;

/** CSS class combinations for common animation patterns */
export const animationClasses = {
  /** Skeleton shimmer effect */
  shimmer: 'bg-gradient-to-r from-muted via-muted-foreground/10 to-muted bg-[length:200%_100%] animate-shimmer',
  /** Fade in on mount */
  fadeIn: 'animate-fade-in',
  /** Hover lift effect for cards */
  hoverLift: 'hover-lift',
  /** Click press feedback */
  pressFeedback: 'press-feedback',
  /** Combined interactive (hover + press) */
  interactive: 'hover-lift press-feedback',
} as const;

/**
 * Check if user prefers reduced motion
 * Use this for JS-driven animations (Motion library)
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Get animation duration respecting reduced motion preference
 * Returns 0 if user prefers reduced motion
 */
export function getAnimationDuration(duration: keyof typeof ANIMATION_DURATION): number {
  if (prefersReducedMotion()) return 0;
  return ANIMATION_DURATION[duration];
}
