import { NextRequest } from 'next/server';
import { db } from '@/db';
import { syncStatus } from '@/db/schema';
import { syncAll } from '@/lib/sync';

export const maxDuration = 60; // seconds
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  // Verify cron secret (Vercel sends this automatically for cron jobs)
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;

  // In development, allow requests without auth for testing
  const isDev = process.env.NODE_ENV === 'development';
  if (!isDev && authHeader !== `Bearer ${cronSecret}`) {
    console.warn('Unauthorized cron request');
    return new Response('Unauthorized', { status: 401 });
  }

  console.log('Starting scheduled sync...');

  try {
    const result = await syncAll();

    // Update sync status
    await db
      .insert(syncStatus)
      .values({
        syncType: 'full',
        lastSyncAt: new Date(),
        lastSuccessAt: new Date(),
        recordsProcessed: result.protocols.count + result.volumes.count,
      })
      .onConflictDoUpdate({
        target: syncStatus.syncType,
        set: {
          lastSyncAt: new Date(),
          lastSuccessAt: new Date(),
          recordsProcessed: result.protocols.count + result.volumes.count,
          lastError: null,
          updatedAt: new Date(),
        },
      });

    console.log('Sync completed:', result);

    return Response.json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error('Sync failed:', error);

    // Record failure
    await db
      .insert(syncStatus)
      .values({
        syncType: 'full',
        lastSyncAt: new Date(),
        lastError: String(error),
      })
      .onConflictDoUpdate({
        target: syncStatus.syncType,
        set: {
          lastSyncAt: new Date(),
          lastError: String(error),
          updatedAt: new Date(),
        },
      });

    return Response.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}
