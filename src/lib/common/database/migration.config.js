'use strict';

require('dotenv').config();

const databaseUrl =
  process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/postgres';
const useSsl = process.env.DB_USE_SSL === 'true';

const parsed = new URL(databaseUrl);
const port = parsed.port ? parseInt(parsed.port, 10) : 5432;
const database = parsed.pathname ? parsed.pathname.replace(/^\//, '') : 'postgres';

const config = {
  username: decodeURIComponent(parsed.username || 'postgres'),
  password: decodeURIComponent(parsed.password || ''),
  database,
  host: parsed.hostname || 'localhost',
  port,
  dialect: 'postgres',
  dialectOptions: useSsl ? { ssl: { require: true, rejectUnauthorized: false } } : {},
};

module.exports = {
  development: config,
  test: config,
  production: config,
};
