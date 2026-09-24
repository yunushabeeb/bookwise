import { neon } from '@neondatabase/serverless';
import { drizzle as neonDrizzle } from 'drizzle-orm/neon-http';
import { drizzle as postgresDrizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

export function createDb(databaseUrl: string) {
  if (databaseUrl.includes('neon.tech')) {
    return neonDrizzle({ client: neon(databaseUrl) });
  }

  const client = postgres(databaseUrl, { max: 10 });
  return postgresDrizzle({ client });
}
