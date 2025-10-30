import { Module } from '@nestjs/common';
import { PatientsService } from './patients.service';
import { PatientsController } from './patients.controller';
import { AuthModule } from '../auth';
import { MongoModule } from 'modules/mongo';

@Module({
  imports: [
    MongoModule,
    AuthModule,
  ],
  controllers: [PatientsController],
  providers: [PatientsService],
  exports: [PatientsService],
})
export class PatientsModule {}
