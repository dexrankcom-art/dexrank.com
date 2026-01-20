/**
 * Template wraps each page and re-renders on navigation.
 * Used for page transitions - the template unmounts/remounts on route change.
 *
 * Using CSS animation from globals.css (Plan 04-01)
 * Respects prefers-reduced-motion automatically via CSS media query
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <div className="animate-fade-in">
      {children}
    </div>
  );
}
