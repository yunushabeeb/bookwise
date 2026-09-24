import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { config } from 'dotenv';
import postgres from 'postgres';
import journal from '../drizzle/meta/_journal.json';

config({
  path: '.env.local',
});

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('DATABASE_URL is missing from .env.local');
}

const sql = postgres(databaseUrl, {
  max: 1,
  onnotice: () => {},
});

const migrate = async () => {
  await sql`CREATE SCHEMA IF NOT EXISTS drizzle`;
  await sql`
    CREATE TABLE IF NOT EXISTS drizzle.__drizzle_migrations (
      id SERIAL PRIMARY KEY,
      hash text NOT NULL,
      created_at bigint
    )
  `;

  const applied = await sql<{ hash: string }[]>`
    select hash from drizzle.__drizzle_migrations
  `;
  const appliedHashes = new Set(applied.map((row) => row.hash));

  for (const entry of journal.entries) {
    const file = `drizzle/${entry.tag}.sql`;
    const content = readFileSync(file, 'utf8');
    const hash = createHash('sha256').update(content).digest('hex');

    if (appliedHashes.has(hash)) {
      continue;
    }

    const statements = content
      .split('--> statement-breakpoint')
      .map((statement) => statement.trim())
      .filter(Boolean);

    for (const statement of statements) {
      await sql.unsafe(statement);
    }

    await sql`
      insert into drizzle.__drizzle_migrations (hash, created_at)
      values (${hash}, ${entry.when})
    `;
    console.log(`Applied ${entry.tag}`);
  }

  await sql.end();
  console.log('Migrations are up to date');
};

migrate().catch(async (error) => {
  console.error(error);
  await sql.end();
  process.exit(1);
});
