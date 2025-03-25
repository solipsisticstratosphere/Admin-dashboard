import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  url:
    process.env.NODE_ENV === 'production'
      ? process.env.DATABASE_URL
      : `postgresql://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}?schema=public`,
  directUrl:
    process.env.NODE_ENV === 'production'
      ? process.env.DIRECT_URL
      : `postgresql://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}?schema=public`,
}));
