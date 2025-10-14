import { appConfig, mongoConfig } from '@configs';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongoModule } from '@modules';
import { AuthModule } from 'modules/auth';
import { DoctorsModule } from 'modules/doctors';
import { AdvicesModule } from 'modules/advices';
import { DrugsModule } from 'modules/drugs';
import { DiseasesModule } from 'modules/diseases';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, mongoConfig],
    }),
    AuthModule,
    MongoModule,
    DoctorsModule,
    AdvicesModule,
    DrugsModule,
    DiseasesModule,
  ]
})
export class AppModule { }
