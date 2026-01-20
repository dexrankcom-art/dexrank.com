'use client';

import { useReportWebVitals } from 'next/web-vitals';

export function WebVitals() {
  useReportWebVitals((metric) => {
    // In development, log to console for debugging
    if (process.env.NODE_ENV === 'development') {
      console.log('[Web Vital]', metric.name, metric.value, metric.rating);
      return;
    }

    // In production, send to analytics endpoint
    // Sentry Performance monitoring automatically captures these
    // For custom analytics, send via beacon:
    const body = JSON.stringify({
      metric: metric.name,
      value: metric.value,
      rating: metric.rating,
      page: window.location.pathname,
      id: metric.id,
    });

    // Use sendBeacon for reliable delivery on page unload
    if (navigator.sendBeacon) {
      navigator.sendBeacon('/api/analytics/vitals', body);
    }
  });

  return null;
}
