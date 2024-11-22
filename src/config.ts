// src/config.ts

import { registerAs } from '@nestjs/config';

export default registerAs('config', () => {
  return {
    postgres: {
      // 👈 add config
      dbName: process.env.POSTGRES_DB,
      port: parseInt(process.env.POSTGRES_PORT, 10),
      password: process.env.POSTGRES_PASSWORD,
      user: process.env.POSTGRES_USER,
      host: process.env.POSTGRES_HOST,
    },
    jwtSecret: process.env.JWT_SECRET
  };
});
