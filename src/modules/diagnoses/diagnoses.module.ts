import { Module } from '@nestjs/common';
import { DiagnosesService } from './diagnoses.service';
import { DiagnosesController } from './diagnoses.controller';
import { MinioModule } from 'nestjs-minio-client';
import { AuthModule } from 'modules/auth';
import { MongoModule } from 'modules/mongo';
import { minioConfig } from '@configs';

@Module({
  imports: [
    MongoModule, AuthModule,
    MinioModule.register({
      endPoint: minioConfig().endPoint,
      port: minioConfig().port,
      useSSL: false,
      accessKey: minioConfig().accessKey,
      secretKey: minioConfig().secretKey,
    }),
  ],
  controllers: [DiagnosesController],
  providers: [DiagnosesService],
})
export class DiagnosesModule {}
