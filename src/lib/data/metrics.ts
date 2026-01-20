import { db } from '@/db';
import { protocolMetrics } from '@/db/schema';
import { desc } from 'drizzle-orm';

/**
 * Get the timestamp of the most recent metrics sync
 * Used to show data freshness to users
 */
export async function getLastSyncTime(): Promise<Date | null> {
  const result = await db
    .select({ fetchedAt: protocolMetrics.fetchedAt })
    .from(protocolMetrics)
    .orderBy(desc(protocolMetrics.fetchedAt))
    .limit(1);

  return result[0]?.fetchedAt ?? null;
}

/**
 * Format a date as relative time (e.g., "5 minutes ago", "2 hours ago")
 */
export function formatRelativeTime(date: Date): string {
  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
  const diff = Date.now() - date.getTime();
  const minutes = Math.floor(diff / 60000);

  if (minutes < 1) return 'just now';
  if (minutes < 60) return rtf.format(-minutes, 'minutes');

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return rtf.format(-hours, 'hours');

  const days = Math.floor(hours / 24);
  return rtf.format(-days, 'days');
}
