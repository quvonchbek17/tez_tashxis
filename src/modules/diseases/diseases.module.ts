import { Module } from '@nestjs/common';
import { DiseasesService } from './diseases.service';
import { DiseasesController } from './diseases.controller';
import { MongoModule } from '../mongo';
import { AuthModule } from '../auth';

@Module({
  imports: [MongoModule, AuthModule],
  controllers: [DiseasesController],
  providers: [DiseasesService],
  exports: [DiseasesService],
})
export class DiseasesModule {}
