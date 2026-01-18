import { backOff } from 'exponential-backoff';
import {
  ProtocolsResponseSchema,
  DexVolumeResponseSchema,
  type Protocol,
  type DexVolumeResponse,
} from './types';

const BASE_URL = 'https://api.llama.fi';

async function fetchWithRetry<T>(url: string, schema: { parse: (data: unknown) => T }): Promise<T> {
  return backOff(
    async () => {
      const response = await fetch(url, {
        headers: { 'Accept': 'application/json' },
      });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      const data = await response.json();
      return schema.parse(data);
    },
    {
      numOfAttempts: 3,
      startingDelay: 1000,
      maxDelay: 10000,
      jitter: 'full',
      retry: (error, attemptNumber) => {
        console.warn(`DefiLlama API attempt ${attemptNumber} failed:`, error.message);
        return true; // Retry all errors
      },
    }
  );
}

export async function fetchProtocols(): Promise<Protocol[]> {
  console.log('Fetching protocols from DefiLlama...');
  return fetchWithRetry(`${BASE_URL}/protocols`, ProtocolsResponseSchema);
}

export async function fetchDexVolumes(): Promise<DexVolumeResponse> {
  console.log('Fetching DEX volumes from DefiLlama...');
  return fetchWithRetry(`${BASE_URL}/overview/dexs`, DexVolumeResponseSchema);
}
