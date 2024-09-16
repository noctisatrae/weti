import postgres from 'postgres'

const DB_URL: string = process.env.DB_URL!;

if (DB_URL === undefined) {
  console.error("DB_URL not set! Quitting...");
  process.exit();
}

const sql = postgres(DB_URL) // will use psql environment variables

export default sql;