import { registerAs } from '@nestjs/config';

export interface IAppConfig {
  port: number;
  nodeEnv: string;
  apiPrefix: string;
  dbTtl: number;
  dbNamespace: string;
  rateLimitMax: number;
  rateLimitWindowMs: number;
}

export const appConfig = registerAs(
  'app',
  (): IAppConfig => ({
    port: parseInt(process.env.PORT ?? '3000', 10),
    nodeEnv: process.env.NODE_ENV || 'development',
    apiPrefix: process.env.API_PREFIX || 'api',

    dbTtl: parseInt(process.env.DB_TTL ?? '60000', 10),
    dbNamespace: process.env.DB_NAMESPACE || 'transactions',

    rateLimitMax: parseInt(process.env.RATE_LIMIT_MAX ?? '10', 10),
    rateLimitWindowMs: parseInt(
      process.env.RATE_LIMIT_WINDOW_MS ?? '60000',
      10,
    ),
  }),
);
