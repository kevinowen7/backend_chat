export default () => ({
  APP_PORT: parseInt(process.env.APP_PORT) || 3000,

  APP_DB_HOST: process.env.APP_DB_HOST,
  APP_DB_PORT: parseInt(process.env.APP_DB_PORT),
  APP_DB_USER: process.env.APP_DB_USER,
  APP_DB_PASS: process.env.APP_DB_PASS,
  APP_DB_NAME: process.env.APP_DB_NAME,
});
