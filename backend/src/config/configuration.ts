export default () => ({
  http: {
    port: parseInt(process.env.PORT ?? '3000', 10),
  },
  database: {
    url: process.env.DATABASE_URL,
    directUrl: process.env.DATABASE_DIRECT_URL,
    shadowUrl: process.env.SHADOW_DATABASE_URL,
  },
  auth: {
    jwtSecret: process.env.JWT_SECRET ?? 'dev-secret',
    jwtTtl: process.env.JWT_TTL ?? '1h',
  },
  queue: {
    url: process.env.AMQP_URL,
    name: process.env.AMQP_QUEUE ?? 'wa-gateway-events',
  },
});
