import { appConfig } from './env.config';

describe('EnvConfig', () => {
  it('should load environment variables with defaults', () => {
    process.env = {
      PORT: '4000',
      NODE_ENV: 'test',
      API_PREFIX: 'v1',
      DB_TTL: '120000',
      DB_NAMESPACE: 'test-namespace',
      RATE_LIMIT_MAX: '50',
      RATE_LIMIT_WINDOW_MS: '60000',
    };

    const config = appConfig();

    expect(config.port).toBe(4000);
    expect(config.nodeEnv).toBe('test');
    expect(config.apiPrefix).toBe('v1');
    expect(config.dbTtl).toBe(120000);
    expect(config.dbNamespace).toBe('test-namespace');
    expect(config.rateLimitMax).toBe(50);
    expect(config.rateLimitWindowMs).toBe(60000);
  });

  it('should apply default values when environment variables are missing', () => {
    process.env = {};

    const config = appConfig();

    expect(config.port).toBe(3000);
    expect(config.nodeEnv).toBe('development');
    expect(config.apiPrefix).toBe('api');
    expect(config.dbTtl).toBe(60000);
    expect(config.dbNamespace).toBe('transactions');
    expect(config.rateLimitMax).toBe(100);
    expect(config.rateLimitWindowMs).toBe(900000);
  });
});
