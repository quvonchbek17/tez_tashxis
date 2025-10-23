import { registerAs } from '@nestjs/config';

interface MinioConfigOptions {
endPoint: string,
port: number,
  accessKey: string,
  secretKey: string,
  minioPublicUrl: string,

}

export const minioConfig = registerAs(
  'minio',
  (): MinioConfigOptions => ({
    endPoint: process.env.MINIO_ENDPOINT || "localhost",
    port: parseInt(process.env.MINIO_PORT || '9000', 10),
    accessKey: process.env.MINIO_ACCESS_KEY || "admin",
    secretKey: process.env.MINIO_SECRET_KEY || "password",
    minioPublicUrl: `http://${process.env.MINIO_ENDPOINT}:${parseInt(process.env.MINIO_PORT || '9000', 10)}`,
  }),
);
