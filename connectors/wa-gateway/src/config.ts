import { config as loadEnv } from 'dotenv';

loadEnv({ path: '.env', override: false });
loadEnv({ path: '.env.local', override: true });

const required = <T extends string>(value: T | undefined, key: string): T => {
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }

  return value;
};

export const config = {
  amqpUrl: required(process.env.AMQP_URL, 'AMQP_URL'),
  queueName: process.env.AMQP_QUEUE ?? 'wa-gateway-events',
  prefetch: Number(process.env.AMQP_PREFETCH ?? '10'),
  logLevel: (process.env.LOG_LEVEL ?? 'info') as 'info' | 'debug' | 'warn' | 'error',
};
