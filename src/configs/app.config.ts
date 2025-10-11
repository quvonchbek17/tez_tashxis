import { registerAs } from '@nestjs/config';

interface AppConfigOptions {
  port: number;
  secret_key: string;
}

export const appConfig = registerAs(
  'app',
  (): AppConfigOptions => ({
    port: process.env.PORT ? parseInt(process.env.PORT) : 3000,
    secret_key: process.env.SECRET_KEY || "ygf8a7dfyg7f28",
  }),
);
