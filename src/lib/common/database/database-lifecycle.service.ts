import { Injectable, Inject, OnModuleDestroy, Logger } from '@nestjs/common';
import { Sequelize } from 'sequelize';
import { SEQUELIZE } from './constants';

@Injectable()
export class DatabaseLifecycleService implements OnModuleDestroy {
  private readonly logger = new Logger(DatabaseLifecycleService.name);

  constructor(@Inject(SEQUELIZE) private readonly sequelize: Sequelize) {}

  async onModuleDestroy() {
    try {
      await this.sequelize.close();
      this.logger.log('Sequelize connection closed gracefully');
    } catch (err) {
      this.logger.error('Error closing Sequelize connection', err);
      throw err;
    }
  }
}
