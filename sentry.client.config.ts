import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Performance monitoring sample rate
  // In production, sample 10% of transactions to reduce costs
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,

  // Session Replay configuration
  // Sample 10% of sessions for general replay
  replaysSessionSampleRate: 0.1,
  // Sample 100% of sessions that have errors
  replaysOnErrorSampleRate: 1.0,

  integrations: [Sentry.replayIntegration()],

  // Disable debug logging
  debug: false,
});
