export { syncProtocols } from './protocols';
export { syncVolumes } from './volumes';

import { syncProtocols } from './protocols';
import { syncVolumes } from './volumes';

export async function syncAll(): Promise<{
  protocols: { count: number };
  volumes: { count: number };
  duration: number;
}> {
  const start = Date.now();

  // Sync protocols first (creates records)
  const protocols = await syncProtocols();

  // Then sync volumes (updates records)
  const volumes = await syncVolumes();

  return {
    protocols,
    volumes,
    duration: Date.now() - start,
  };
}
