const int = (value: string = '0') => parseInt(value, 10);

export default () => ({
  nodeEnv: process.env.NODE_ENV,
  port: int(process.env.PORT),

  database: {
    url: process.env.DATABASE_URL,
    ssl: process.env.DB_USE_SSL === 'true',
    logging: process.env.DB_LOGGING === 'true',
  },
});
