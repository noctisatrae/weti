import { migrate } from 'drizzle-orm/postgres-js/migrator';
import db, { sql } from './index';

// This will run migrations on the database, skipping the ones already applied
const startMigration = migrate(db, { migrationsFolder: './drizzle' });

export default startMigration;