import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Keyv from 'keyv';
import { PinoLoggerService } from '../logger/logger.service';

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  private readonly db: Keyv;

  constructor(
    private readonly configService: ConfigService,
    private readonly logger: PinoLoggerService,
  ) {
    const dbTtl = this.configService.get<number>('app.dbTtl');
    const dbNamespace = this.configService.get<string>('app.dbNamespace');

    this.db = new Keyv({
      ttl: dbTtl,
      namespace: dbNamespace,
    });
  }

  onModuleInit() {
    this.logger.log('Database successfully started', 'Database');
  }

  async onModuleDestroy() {
    await this.db.clear();
  }

  async set<T>(key: string, value: T): Promise<void> {
    await this.db.set(key, value);
  }

  async get<T>(key: string): Promise<T | undefined> {
    return this.db.get(key);
  }

  async delete(key: string): Promise<boolean> {
    return this.db.delete(key);
  }

  async clear(): Promise<void> {
    await this.db.clear();
  }
}
