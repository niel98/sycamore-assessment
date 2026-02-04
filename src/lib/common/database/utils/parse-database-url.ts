export interface SequelizeConfigFromUrl {
  username: string;
  password: string;
  database: string;
  host: string;
  port: number;
  dialect: 'postgres';
  ssl?: boolean;
  logging?: boolean;
}

/**
 * Parses a PostgreSQL URL (e.g. postgresql://user:pass@host:5432/dbname) into
 * options suitable for Sequelize.
 */
export function parseDatabaseUrl(
  url: string,
  options?: { ssl?: boolean; logging?: boolean },
): SequelizeConfigFromUrl {
  const parsed = new URL(url);
  const port = parsed.port ? parseInt(parsed.port, 10) : 5432;
  const database = parsed.pathname
    ? parsed.pathname.replace(/^\//, '')
    : 'postgres';

  return {
    username: decodeURIComponent(parsed.username || 'postgres'),
    password: decodeURIComponent(parsed.password || ''),
    database,
    host: parsed.hostname || 'localhost',
    port,
    dialect: 'postgres',
    ...(options?.ssl !== undefined && { ssl: options.ssl }),
    ...(options?.logging !== undefined && { logging: options.logging }),
  };
}
