import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

// Validate DATABASE_URL at module load time for clear error messages
if (!process.env.DATABASE_URL) {
  throw new Error(
    'DATABASE_URL environment variable is not set. ' +
    'Please add it to your .env.local file or Vercel environment variables.'
  );
}

const sql = neon(process.env.DATABASE_URL);
export const db = drizzle(sql, { schema });
