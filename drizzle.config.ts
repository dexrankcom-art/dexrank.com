import { config } from 'dotenv';
import { defineConfig } from 'drizzle-kit';

// Load .env.local for local development (drizzle-kit runs outside Next.js)
config({ path: '.env.local' });

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  verbose: true,
  strict: true,
});
