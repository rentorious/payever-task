import { registerAs } from '@nestjs/config';

export default registerAs('db', () => ({
  uri: process.env.DATABASE_URL || 'mongodb://localhost/nest',
  dbName: process.env.DATABASE_NAME || 'payever-task',
  retryAttempts: 0,
}));
