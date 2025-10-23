import { Module } from '@nestjs/common';
import { DiagnosesService } from './diagnoses.service';
import { DiagnosesController } from './diagnoses.controller';
import { MinioModule } from 'nestjs-minio-client';
import { AuthModule } from 'modules/auth';
import { MongoModule } from 'modules/mongo';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MongoModule,
    AuthModule,
    ConfigModule, // <-- kerak
    MinioModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        endPoint: configService.get<string>('minio.endPoint'),
        port: parseInt(configService.get<string>('minio.port'), 10),
        useSSL: false,
        accessKey: configService.get<string>('minio.accessKey'),
        secretKey: configService.get<string>('minio.secretKey'),
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [DiagnosesController],
  providers: [DiagnosesService],
})
export class DiagnosesModule {}
