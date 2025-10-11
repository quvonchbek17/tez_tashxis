import { appConfig, mongoConfig } from '@configs';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SyncModule, MongoModule } from '@modules';
import { AuthModule } from 'modules/auth';
import { DoctorsModule } from 'modules/doctors';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, mongoConfig],
    }),
    AuthModule,
    MongoModule,
    SyncModule,
    DoctorsModule,
  ]
})
export class AppModule { }
