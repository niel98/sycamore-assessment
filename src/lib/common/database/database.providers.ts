import { Sequelize } from 'sequelize';
import { ConfigService } from '@nestjs/config';
import { SEQUELIZE } from './constants';
import { parseDatabaseUrl } from './utils/parse-database-url';
import { initModels } from './models';

export const databaseProviders = [
  {
    provide: SEQUELIZE,
    inject: [ConfigService],
    useFactory: async (configService: ConfigService) => {
      const database = configService.get<{
        url: string;
        ssl?: boolean;
        logging?: boolean;
      }>('database');
      const url = database?.url ?? '';
      const useSsl = database?.ssl ?? false;
      const logging = database?.logging ?? false;

      const config = parseDatabaseUrl(url, { ssl: useSsl, logging });

      const sequelize = new Sequelize({
        ...config,
        logging: config.logging ?? false,
        dialectOptions: config.ssl
          ? { ssl: { require: true, rejectUnauthorized: false } }
          : undefined,
        pool: {
          max: 10,
          min: 0,
          acquire: 30000,
          idle: 10000,
        },
      });

      await sequelize.authenticate();
      initModels(sequelize);
      return sequelize;
    },
  },
];
