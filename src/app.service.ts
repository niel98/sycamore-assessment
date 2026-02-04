import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(private readonly config: ConfigService) {}
  async health() {
    return {
      message: 'Server is running',
      data: {
        status: 'OK',
        timestamp: new Date().toISOString(),
        env: this.config.get<string>('nodeEnv'),
      },
    };
  }
}
