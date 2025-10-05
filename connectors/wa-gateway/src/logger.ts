import pinoLogger from 'pino';

import { config } from './config';

export const logger = pinoLogger({
  level: config.logLevel,
  transport: process.env.NODE_ENV === 'development' ? { target: 'pino-pretty' } : undefined,
});
