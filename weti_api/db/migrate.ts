import { migrate } from 'drizzle-orm/postgres-js/migrator';
import { sqlMigration } from './index';
import { drizzle } from 'drizzle-orm/postgres-js';

// This will run migrations on the database, skipping the ones already applied
const startMigration = migrate(drizzle(sqlMigration), { migrationsFolder: './drizzle' });

export default startMigration;