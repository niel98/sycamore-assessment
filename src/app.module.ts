import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import configuration from './config/configuration';
import { validate } from './config/env.validation';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './lib/common/database';
import { TransactionModule } from './modules/transaction/transaction.module';
import { InterestModule } from './modules/interest/interest.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [configuration],
      validate,
    }),
    DatabaseModule,
    TransactionModule,
    InterestModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
