import { appConfig, minioConfig, mongoConfig } from '@configs';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongoModule } from '@modules';
import { AuthModule } from 'modules/auth';
import { DoctorsModule } from 'modules/doctors';
import { AdvicesModule } from 'modules/advices';
import { DrugsModule } from 'modules/drugs';
import { DiseasesModule } from 'modules/diseases';
import { DiagnosesModule } from 'modules/diagnoses';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, mongoConfig, minioConfig],
    }),
    AuthModule,
    MongoModule,
    DoctorsModule,
    AdvicesModule,
    DrugsModule,
    DiseasesModule,
    DiagnosesModule
  ]
})
export class AppModule { }
