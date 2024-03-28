import queue from './queue';

export const config = () => ({
  port: process.env.PORT || '3000',
  host: process.env.HOST || '0.0.0.0',
  databaseUrl: process.env.DATABASE_URL || 'mongodb://localhost/nest',

  queue,
});
