import { Module, Global } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { databaseProviders } from './database.providers';
import { DatabaseLifecycleService } from './database-lifecycle.service';
import { SEQUELIZE } from './constants';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [...databaseProviders, DatabaseLifecycleService],
  exports: [SEQUELIZE],
})
export class DatabaseModule {}
