interface EditorsTakeProps {
  content: string;
  lastUpdated?: string;
  bestFor?: string;
  pros?: string[];
  cons?: string[];
  tier?: 1 | 2;
}

export function EditorsTake({ content, lastUpdated, bestFor, pros, cons, tier = 2 }: EditorsTakeProps) {
  return (
    <section className="bg-muted/50 rounded-lg p-6 my-8">
      <div className="flex items-center gap-2 mb-4">
        <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
          <span className="text-primary-foreground text-sm font-bold">DR</span>
        </div>
        <div>
          <h2 className="text-lg font-semibold">Editor&apos;s Take</h2>
          {lastUpdated && (
            <p className="text-xs text-muted-foreground">Last updated: {lastUpdated}</p>
          )}
        </div>
      </div>

      <div className="prose prose-slate dark:prose-invert max-w-none">
        <p className="text-base leading-relaxed whitespace-pre-line">{content}</p>
      </div>

      {bestFor && (
        <div className="mt-4 pt-4 border-t border-border">
          <p className="text-sm">
            <span className="font-medium">Best for:</span>{' '}
            <span className="text-muted-foreground">{bestFor}</span>
          </p>
        </div>
      )}

      {(pros?.length || cons?.length) && (
        <div className="mt-4 pt-4 border-t border-border grid md:grid-cols-2 gap-4">
          {pros && pros.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-green-600 dark:text-green-400 mb-2">Pros</h3>
              <ul className="space-y-1">
                {pros.map((pro, i) => (
                  <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                    <span className="text-green-600 dark:text-green-400">+</span>
                    {pro}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {cons && cons.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-red-600 dark:text-red-400 mb-2">Cons</h3>
              <ul className="space-y-1">
                {cons.map((con, i) => (
                  <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                    <span className="text-red-600 dark:text-red-400">-</span>
                    {con}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
