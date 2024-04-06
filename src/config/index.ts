export const config = () => ({
  port: process.env.PORT || '3333',
  host: process.env.HOST || '0.0.0.0',

  downloadDir: 'avatars',
});
