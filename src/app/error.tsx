'use client';

import { useEffect } from 'react';
import * as Sentry from '@sentry/nextjs';
import { Button } from '@/components/ui/button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to console in development
    console.error('Route error:', error);

    // Report to Sentry in production
    Sentry.captureException(error);
  }, [error]);

  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <div className="max-w-md mx-auto">
        <h1 className="text-4xl font-bold mb-4">Something went wrong</h1>
        <p className="text-muted-foreground mb-8">
          We encountered an unexpected error. Our team has been notified and is
          working to fix it.
        </p>
        {error.digest && (
          <p className="text-sm text-muted-foreground mb-4">
            Error ID: {error.digest}
          </p>
        )}
        <Button onClick={reset} size="lg">
          Try again
        </Button>
      </div>
    </div>
  );
}
