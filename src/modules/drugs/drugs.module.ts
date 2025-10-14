import { Module } from '@nestjs/common';
import { DrugsService } from './drugs.service';
import { DrugsController } from './drugs.controller';
import { MongoModule } from '../mongo';
import { AuthModule } from '../auth';

@Module({
  imports: [MongoModule, AuthModule],
  controllers: [DrugsController],
  providers: [DrugsService],
  exports: [DrugsService],
})
export class DrugsModule {}
