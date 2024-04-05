export const config = () => ({
  port: process.env.PORT || '3000',
  host: process.env.HOST || '0.0.0.0',

  downloadDir: 'avatars',
});
