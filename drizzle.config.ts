import { config } from 'dotenv';

// defineConfig is not exported from 'drizzle-kit' here; we'll export the config object directly

config({
  path: '.env.local',
});

export default {
  out: './drizzle',
  schema: './database/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
} as const;
