import config from '@/lib/config';
import { createDb } from './db';

const {
  env: { databaseUrl },
} = config;

export const db = createDb(databaseUrl);
