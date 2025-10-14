import { Module } from '@nestjs/common';
import { AdvicesService } from './advices.service';
import { AdvicesController } from './advices.controller';
import { MongoModule } from '../mongo';
import { AuthModule } from '../auth';

@Module({
  imports: [MongoModule, AuthModule],
  controllers: [AdvicesController],
  providers: [AdvicesService],
  exports: [AdvicesService],
})
export class AdvicesModule {}
