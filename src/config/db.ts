import { registerAs } from '@nestjs/config';

export default registerAs('db', () => ({
  uri: process.env.DB_URI || 'mongodb://localhost/nest',
  dbName: process.env.DB_NAME || 'payever-task',
}));
