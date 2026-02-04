import { parseDatabaseUrl } from './utils/parse-database-url';
import * as dotenv from 'dotenv';

dotenv.config();

/**
 * Builds sequelize-cli config from DATABASE_URL and env.
 * Used when running migrations with ts-node; for plain Node use migration.config.js.
 */
export function getMigrationConfig() {
  const databaseUrl =
    process.env.DATABASE_URL ||
    'postgresql://postgres:postgres@localhost:5432/postgres';
  const useSsl = process.env.DB_USE_SSL === 'true';

  const base = parseDatabaseUrl(databaseUrl, { ssl: useSsl });
  const config = {
    ...base,
    dialectOptions: base.ssl
      ? { ssl: { require: true, rejectUnauthorized: false } }
      : {},
  };

  return {
    development: config,
    test: config,
    production: config,
  };
}
