import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres'

import { rpcData, watchRequest } from './schema';

const DB_URL: string = process.env.WETI_DB_URL!;

if (DB_URL === undefined) {
  console.error("DB_URL not set! Quitting...");
  process.exit();
}

const sql = postgres(DB_URL) // will use psql environment variables
const sqlMigration = postgres(DB_URL, { max: 1 })

const db = drizzle(sql, {
  schema: {
    watchRequest,
    rpcData
  }
});

export default db;
export {
  sql,
  sqlMigration
};